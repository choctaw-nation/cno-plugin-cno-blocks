#!/usr/bin/env bash

set -euo pipefail

package="${1:-}"

if [ -z "$package" ]; then
  echo "Usage: $0 <package>@<version>"
  echo "Example: $0 @parcel/watcher@2.5.6"
  exit 1
fi

safe_name="$(echo "$package" | sed 's/^@//; s/\//-/g; s/@/-/g; s/:/-/g')"
audit_root="./.tmp/npm-audit"
package_dir="$audit_root/$safe_name"
extract_dir="$package_dir/extracted"

mkdir -p "$package_dir" "$extract_dir"

echo "== Auditing $package =="
echo

echo "== npm explain =="
npm explain "$package" > "$package_dir/explain.txt" 2>&1 || true
echo "Saved to $package_dir/explain.txt"
echo

echo "== npm view metadata =="
npm view "$package" scripts repository dist.integrity --json > "$package_dir/npm-view.json"
echo "Saved to $package_dir/npm-view.json"
cat "$package_dir/npm-view.json"
echo

echo "== npm pack =="
pack_output="$(npm pack "$package" --pack-destination "$package_dir")"
tarball="$package_dir/$pack_output"

echo "Packed: $tarball"
echo

echo "== Extracting =="
tar -xzf "$tarball" -C "$extract_dir"

package_json="$extract_dir/package/package.json"

echo "== package.json lifecycle scripts =="
node -e "
const pkg = require('$package_json');
const lifecycle = [
  'preinstall',
  'install',
  'postinstall',
  'prepublish',
  'preprepare',
  'prepare',
  'postprepare'
];
for (const name of lifecycle) {
  if (pkg.scripts && pkg.scripts[name]) {
    console.log(name + ': ' + pkg.scripts[name]);
  }
}
" > "$package_dir/lifecycle-scripts.txt"

echo "Saved to $package_dir/lifecycle-scripts.txt"
echo

echo "== Risky pattern scan =="

risky_dir="$package_dir/risky-patterns"
mkdir -p "$risky_dir"

raw_risky_file="$risky_dir/all.txt"
summary_file="$risky_dir/summary.txt"
review_file="$risky_dir/review-first.txt"

scan_root="$extract_dir/package"

grep_common_args=(
  -RInE
  --binary-files=without-match
  --exclude-dir=node_modules
  --exclude-dir=.git
  --exclude-dir=coverage
  --exclude-dir=dist
  --exclude-dir=build
)

# Full broad scan.
grep "${grep_common_args[@]}" \
  "curl|wget|fetch|https?|exec|execSync|spawn|spawnSync|eval|Function\\(|process\\.env|npmrc|\\.ssh|token|password|secret|base64|chmod|chown|sudo|rm -rf|postinstall|preinstall|prepare|node-gyp" \
  "$scan_root" \
  > "$raw_risky_file" || true

if [ ! -s "$raw_risky_file" ]; then
  echo "No risky patterns found."
  exit 0
fi

echo "Found risky patterns: saved to $raw_risky_file"

# Priority buckets.
grep -nEi "preinstall|postinstall|prepare|node-gyp|node-pre-gyp|prebuild-install" \
  "$raw_risky_file" > "$risky_dir/01-lifecycle.txt" || true

grep -nEi "child_process|exec|execSync|spawn|spawnSync|execFile|shell: true|/bin/sh|cmd.exe|powershell" \
  "$raw_risky_file" > "$risky_dir/02-shell-exec.txt" || true

grep -nEi "curl|wget|fetch|https?://|request\\(|axios|got\\(|node-fetch" \
  "$raw_risky_file" > "$risky_dir/03-network.txt" || true

grep -nEi "eval|Function\\(|setTimeout\\(|setInterval\\(|vm\\.runIn|vm\\.Script" \
  "$raw_risky_file" > "$risky_dir/04-dynamic-code.txt" || true

grep -nEi "base64|atob|btoa|fromCharCode|charCodeAt|Buffer\\.from" \
  "$raw_risky_file" > "$risky_dir/05-obfuscation.txt" || true

grep -nEi "chmod|chown|sudo|rm -rf|unlink|rmdir|writeFile|appendFile|mkdir" \
  "$raw_risky_file" > "$risky_dir/06-filesystem.txt" || true

grep -nEi "npmrc|\\.ssh|token|password|passwd|secret|credential|private_key|GITHUB_TOKEN|NPM_TOKEN|process\\.env" \
  "$raw_risky_file" > "$risky_dir/07-secrets-env.txt" || true

# Combined high-priority review file.
cat \
  "$risky_dir/01-lifecycle.txt" \
  "$risky_dir/02-shell-exec.txt" \
  "$risky_dir/03-network.txt" \
  "$risky_dir/04-dynamic-code.txt" \
  "$risky_dir/05-obfuscation.txt" \
  "$risky_dir/06-filesystem.txt" \
  "$risky_dir/07-secrets-env.txt" \
  > "$review_file"

# Summary counts.
{
  echo "Risky pattern summary"
  echo
  wc -l "$raw_risky_file"
  wc -l "$risky_dir"/*.txt
  echo
  echo "Most common matching files:"
  cut -d ':' -f 1 "$raw_risky_file" | sort | uniq -c | sort -nr | head -n 25
} > "$summary_file"

echo
echo "Risky scan summary:"
cat "$summary_file"

echo
echo "Review these first:"
echo "$review_file"
echo
echo "== Done =="
echo "Review folder: $package_dir"
