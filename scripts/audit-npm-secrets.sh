#!/usr/bin/env bash
set -e

echo "🔍 [1/4] 查找 .npmrc 文件..."
git ls-files | grep -E '(^|/)\.npmrc$' || echo "✅ 没有找到 .npmrc"

echo ""
echo "🔍 [2/4] 搜索可能的明文 token..."
git grep -nE "(NPM_TOKEN|NODE_AUTH_TOKEN|_authToken|registry\.npmjs\.org)" || echo "✅ 没有发现可疑 token 引用"

echo ""
echo "🔍 [3/4] 检查工作区 npm 配置（全局/用户级）..."
npm config list --location=global | grep -E "authToken|registry" || true
npm config list --location=user | grep -E "authToken|registry" || true

echo ""
echo "🔍 [4/4] 检查 GitHub workflow 中的敏感引用..."
grep -R "NPM_TOKEN" .github/workflows || echo "✅ workflows 未直接引用 token"

echo ""
echo "✅ 审计结束。如发现输出含 token 值，请务必在下一步清理。"
