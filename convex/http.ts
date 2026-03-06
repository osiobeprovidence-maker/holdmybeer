import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { api } from "./_generated/api";

const http = httpRouter();

function corsHeaders(request: Request) {
    const origin = request.headers.get("Origin");
    return {
        "Access-Control-Allow-Origin": origin || "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Credentials": "true",
    };
}

http.route({
    path: "/auth/verify",
    method: "OPTIONS",
    handler: httpAction(async (ctx, request) => {
        return new Response(null, {
            status: 204,
            headers: corsHeaders(request),
        });
    }),
});

http.route({
    path: "/auth/verify",
    method: "POST",
    handler: httpAction(async (ctx, request) => {
        try {
            const { email, code, referralCode } = await request.json();
            const result = await ctx.runMutation(api.auth.verifyOTP, { email, code, referralCode });

            const cookie = `hmb_session_id=${result.sessionToken}; Path=/; HttpOnly; Secure; SameSite=None; Max-Age=${60 * 60 * 24 * 30}`;

            return new Response(JSON.stringify(result), {
                status: 200,
                headers: {
                    ...corsHeaders(request),
                    "Content-Type": "application/json",
                    "Set-Cookie": cookie,
                },
            });
        } catch (e: any) {
            return new Response(JSON.stringify({ error: e.message }), {
                status: 400,
                headers: {
                    ...corsHeaders(request),
                    "Content-Type": "application/json",
                },
            });
        }
    }),
});

http.route({
    path: "/auth/logout",
    method: "OPTIONS",
    handler: httpAction(async (ctx, request) => {
        return new Response(null, {
            status: 204,
            headers: corsHeaders(request),
        });
    }),
});

http.route({
    path: "/auth/logout",
    method: "POST",
    handler: httpAction(async (ctx, request) => {
        const cookie = `hmb_session_id=; Path=/; HttpOnly; Secure; SameSite=None; Max-Age=0`;
        return new Response(JSON.stringify({ success: true }), {
            status: 200,
            headers: {
                ...corsHeaders(request),
                "Content-Type": "application/json",
                "Set-Cookie": cookie,
            },
        });
    }),
});

// Friendly referral redirect: set a readable cookie then redirect to root
http.route({
    path: "/referral/:code",
    method: "GET",
    handler: httpAction(async (ctx, request) => {
        try {
            const url = new URL(request.url);
            const parts = url.pathname.split('/');
            const code = parts[parts.length - 1] || '';
            const cookie = `hmb_referral=${encodeURIComponent(code)}; Path=/; Max-Age=${60 * 60 * 24 * 30}`;
            return new Response(null, {
                status: 302,
                headers: {
                    ...corsHeaders(request),
                    Location: '/',
                    'Set-Cookie': cookie,
                },
            });
        } catch (e) {
            return new Response(null, { status: 302, headers: { Location: '/' } });
        }
    }),
});

http.route({
    path: "/referral",
    method: "GET",
    handler: httpAction(async (ctx, request) => {
        // No code present — just redirect to root
        return new Response(null, {
            status: 302,
            headers: { Location: '/' },
        });
    }),
});

export default http;

// Admin endpoint to trigger backfill migration (POST { secret })
http.route({
    path: "/admin/backfill-referrals",
    method: "POST",
    handler: httpAction(async (ctx, request) => {
        try {
            const body = await request.json();
            const secret = body && body.secret ? body.secret : '';
            // Use any-cast to call admin backfill mutation (generated types may be out-of-sync)
            const gen: any = (await import('./_generated/api')).api;
            const result = await ctx.runMutation(gen.backfillReferralCodes, { secret });
            return new Response(JSON.stringify(result), {
                status: 200,
                headers: {
                    ...corsHeaders(request),
                    'Content-Type': 'application/json',
                },
            });
        } catch (e: any) {
            return new Response(JSON.stringify({ error: e.message || String(e) }), {
                status: 400,
                headers: {
                    ...corsHeaders(request),
                    'Content-Type': 'application/json',
                },
            });
        }
    }),
});
