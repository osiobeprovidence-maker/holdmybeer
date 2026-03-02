$ts = Get-Date -Format 'yyyyMMdd-HHmmss'
$branch = "wip/shelve-$ts"
Write-Output "Creating branch $branch"

git checkout -b $branch

git add -A

$has = git status --porcelain
if ($has) {
  git commit -m "wip: shelve work in progress $ts"
} else {
  git commit --allow-empty -m "wip: create branch $branch $ts"
}

git push -u origin $branch

Write-Output "Pushed branch: $branch"
