/**
 * Local emergency path ONLY after explicit owner approval.
 * Checks out nothing — requires working tree / HEAD to be exactly the approved RC.
 * Prefer GitHub Actions with environment reviewers instead of this script.
 *
 * Usage (opt-in):
 *   ALLOW_PRODUCTION_RC_DEPLOY=YES node scripts/deploy-approved-rc-production.mjs
 */
import { execSync } from 'child_process';

const APPROVED = 'cfcc7ab31ddf6ec95d61d2ca4b96d5975300c33d';

if (process.env.ALLOW_PRODUCTION_RC_DEPLOY !== 'YES') {
  console.error('Set ALLOW_PRODUCTION_RC_DEPLOY=YES after owner approval to continue.');
  process.exit(1);
}

const head = execSync('git rev-parse HEAD', { encoding: 'utf8' }).trim();
if (head !== APPROVED) {
  console.error(`REFUSED: HEAD ${head} is not approved RC ${APPROVED}`);
  console.error('git checkout cfcc7ab31ddf6ec95d61d2ca4b96d5975300c33d');
  process.exit(1);
}

execSync('node scripts/validate-pages-functions-artifact.mjs', { stdio: 'inherit' });
execSync(
  `npx wrangler pages deploy . --project-name=drcenik-live --branch=main --commit-hash=${APPROVED} --commit-message="production: approved RC ${APPROVED}"`,
  { stdio: 'inherit' },
);
