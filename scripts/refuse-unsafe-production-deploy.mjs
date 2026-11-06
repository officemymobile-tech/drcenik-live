/**
 * Blocks accidental `npm run deploy-pages` production publishes.
 * Approved path: GitHub Actions workflow_dispatch with RC pin + environment approval,
 * or explicit `npm run deploy-pages-production-approved-rc` after human confirmation.
 */
console.error('REFUSED: npm run deploy-pages is disabled to prevent publishing an unpinned tree to production.');
console.error('Use GitHub Actions → Deploy Cloudflare Pages with:');
console.error('  - Use workflow from: release/seo-physikalische-therapie-wien-11');
console.error('  - git_ref: rc/seo-assistant-2026-11-06');
console.error('  - confirm_production_deploy: DEPLOY-PRODUCTION');
console.error('  - Approve the production environment review');
console.error('Rollback target remains: 9d68e71d-82e9-4206-a2ec-e6f1a407c151');
process.exit(1);
