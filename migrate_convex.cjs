const fs = require('fs');

let content = fs.readFileSync('App.tsx', 'utf-8');

// Replace Imports
content = content.replace("import { supabase } from './services/supabaseClient';",
    `import { useQuery, useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import { useAuthActions } from "@convex-dev/auth/react";`);

// Inject Convex hooks at the start of App
content = content.replace(
    "const [currentView, setCurrentView] = useState<string>('home');",
    `const [currentView, setCurrentView] = useState<string>('home');
  const convexUser = useQuery(api.api.current);
  const convexProfiles = useQuery(api.api.searchProfiles);
  const convexUnlocks = useQuery(api.api.getUnlocks);
  
  const updateProfileMutation = useMutation(api.api.updateProfile);
  const creditCoinsMutation = useMutation(api.api.creditCoins);
  const deductCoinsMutation = useMutation(api.api.deductCoins);
  const insertUnlockMutation = useMutation(api.api.insertUnlock);
  const { signOut } = useAuthActions();`
);

// Connect current user mapping
content = content.replace(
    "const [currentUser, setCurrentUser] = useState<User | null>(null);",
    `const [currentUserLocal, setCurrentUserLocal] = useState<User | null>(null);
  const currentUser = React.useMemo(() => {
    if (!convexUser) return currentUserLocal;
    return {
      ...convexUser,
      id: convexUser.userId,
      name: convexUser.name || convexUser.full_name || 'User',
      isCreator: convexUser.is_creator,
      kycVerified: convexUser.kyc_verified,
      kycStatus: convexUser.kyc_status,
      reliabilityScore: convexUser.reliability_score || 70,
      totalUnlocks: 0,
      avatar: convexUser.avatar || \`https://ui-avatars.com/api/?name=\${convexUser.name || 'User'}&background=000&color=fff\`,
      hasPurchasedSignUpPack: convexUser.has_purchased_sign_up_pack,
    } as User;
  }, [convexUser, currentUserLocal]);
  const setCurrentUser = setCurrentUserLocal;`
);

// Replace supabase signOut
content = content.replace(
    "if (supabase) await supabase.auth.signOut();",
    "await signOut();"
);

// handleUnlockSuccess
content = content.replace(
    `    if (supabase) {
      supabase.from('unlocks').insert({
        organiser_id: newRequest.clientId,
        vendor_profile_id: newRequest.creatorId,
        tier: newRequest.paymentType,
        amount: newRequest.amount,
        status: newRequest.status,
        payment_reference: \`hmb-\${newRequest.id}\` // placeholder ref
      }).then(({ error }) => { if (error) console.error("Supabase insert error:", error) });
    }`,
    `    insertUnlockMutation({
        vendorProfileId: newRequest.creatorId as any,
        tier: newRequest.paymentType,
        amount: newRequest.amount,
        status: newRequest.status,
    }).catch((error) => console.error("Convex insert error:", error));`
);

// handlePurchaseCoins
content = content.replace(`    if (supabase) {
      const { data: rpcResult, error: rpcError } = await supabase.rpc('credit_coins', {
        p_user_id: currentUser.id,
        p_amount: coinsToAdd,
        p_description: \`Coin Purchase – \${coinsToAdd} coins\`,
        p_reference: \`purchase-\${Date.now()}\`
      });

      if (rpcError || !rpcResult?.success) {
        console.error('[HMB] Credit coins failed:', rpcError?.message);
        // Fallback: direct update
        await supabase.from('profiles').update({
          coins: newBalance,
          has_purchased_sign_up_pack: updatedUser.hasPurchasedSignUpPack
        }).eq('id', currentUser.id);
      } else {
        // Also update sign up pack flag if needed
        if (isSignUpPack) {
          await supabase.from('profiles').update({ has_purchased_sign_up_pack: true }).eq('id', currentUser.id);
        }
      }
    }`,
    `    try {
      await creditCoinsMutation({
        amount: coinsToAdd,
        description: \`Coin Purchase – \${coinsToAdd} coins\`,
      });
      if (isSignUpPack) {
        await updateProfileMutation({
          has_purchased_sign_up_pack: true
        });
      }
    } catch (error: any) {
      console.error('[HMB] Credit coins failed:', error.message);
    }`);

// handleUnlockWithCoins
content = content.replace(`      // Use server-side RPC for coin deduction (validates balance server-side)
      if (supabase) {
        const { data: rpcResult, error: rpcError } = await supabase.rpc('deduct_coins', {
          p_user_id: currentUser.id,
          p_amount: requiredCoins,
          p_description: unlockDesc,
          p_reference: \`unlock-\${vendor.id}-\${Date.now()}\`
        });

        if (rpcError || !rpcResult?.success) {
          console.error('[HMB] Coin deduction failed:', rpcError?.message || rpcResult?.error);
          alert(rpcResult?.error === 'Insufficient coins'
            ? 'Not enough coins. Please top up your wallet.'
            : 'Unlock failed. Please try again.');
          setIsProcessingPayment(false);
          return;
        }
        newBalance = rpcResult.new_balance;
      }`,
    `      // Use server-side RPC for coin deduction
      try {
        await deductCoinsMutation({
          amount: requiredCoins,
          description: unlockDesc,
        });
        newBalance = (currentUser.coins || 0) - requiredCoins;
      } catch (error: any) {
        console.error('[HMB] Coin deduction failed:', error.message);
        alert(error.message === 'Insufficient coins'
          ? 'Not enough coins. Please top up your wallet.'
          : 'Unlock failed. Please try again.');
        setIsProcessingPayment(false);
        return;
      }`
);

content = content.replace(`      if (supabase) {
        await supabase
          .from('profiles')
          .update({ coins: newBalance })
          .eq('id', currentUser.id);
      }`,
    `      try {
        await deductCoinsMutation({ amount: requiredCoins, description: "Calendar Unlock" });
      } catch (e) {}`
);

content = content.replace(`    if (supabase) {
      supabase.from('profiles').update({
        name: updatedUser.name,
        business_name: updatedUser.businessName,
        category: updatedUser.category,
        bio: updatedUser.bio,
        location: updatedUser.location,
        has_purchased_sign_up_pack: updatedUser.hasPurchasedSignUpPack,
        preferred_location: updatedUser.preferredLocation,
        available_today: updatedUser.availableToday,
        price_range: updatedUser.priceRange,
        top_skills: updatedUser.topSkills,
        services: updatedUser.services,
        experience: updatedUser.experience,
        industries: updatedUser.industries,
        social_links: updatedUser.socialLinks,
        avatar: updatedUser.avatar,
        portfolio: updatedUser.portfolio
      }).eq('id', updatedUser.id).then(({ error }) => {
        if (error) console.error("Supabase update error:", error);
      });
    }`,
    `    updateProfileMutation({
        name: updatedUser.name,
        bio: updatedUser.bio,
        location: updatedUser.location as string,
        panic_mode_opt_in: updatedUser.panicModeOptIn,
        panic_mode_price: updatedUser.panicModePrice,
    }).catch(e => console.error(e));`
);

content = content.replace(`const App: React.FC = () => {`,
    `const supabase: any = null;
const App: React.FC = () => {`);

fs.writeFileSync('App.tsx', content, 'utf-8');
console.log('SUCCESS');
