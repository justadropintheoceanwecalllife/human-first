/**
 * Admin Configuration
 *
 * Whitelist of users who can manage bulletin board posts
 * Add NRIC (last 4 digits) or email addresses here
 */

export const BULLETIN_ADMINS = {
  // By NRIC (last 4 digits)
  nrics: [
    '****5678', // Jamie Lim Hui Ling
    '****1234', // Alex Tan Wei Ming
  ],
  // By email
  emails: [
    'jamie.lim@tech.gov.sg',
    'alex.tan@tech.gov.sg',
  ],
};

/**
 * Check if a user is a bulletin board admin
 */
export function isBulletinAdmin(nric?: string, email?: string): boolean {
  if (nric && BULLETIN_ADMINS.nrics.includes(nric)) {
    return true;
  }
  if (email && BULLETIN_ADMINS.emails.includes(email)) {
    return true;
  }
  return false;
}
