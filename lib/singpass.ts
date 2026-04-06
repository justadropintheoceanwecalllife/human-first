/**
 * Singpass Authentication (Mock for Demo)
 *
 * For production, use official Singpass OIDC integration:
 * - Docs: https://api.singpass.gov.sg/library/login/developers/overview
 * - Flow: Authorization Code Flow with PKCE
 * - Scopes: openid, profile, email
 */

const AUTH_KEY = 'human-first-singpass-auth';
const USER_INFO_KEY = 'human-first-singpass-user';
const VERIFIED_KEY = 'human-first-verified';

export interface SingpassUser {
  nric: string; // Mock NRIC (last 4 digits only for privacy)
  name: string;
  email?: string;
}

// Mock Singpass users for demo
const MOCK_USERS: Record<string, SingpassUser> = {
  '1234': {
    nric: '****1234',
    name: 'Alex Tan Wei Ming',
    email: 'alex.tan@tech.gov.sg',
  },
  '5678': {
    nric: '****5678',
    name: 'Jamie Lim Hui Ling',
    email: 'jamie.lim@tech.gov.sg',
  },
  '9012': {
    nric: '****9012',
    name: 'Marcus Wong Jun Wei',
    email: 'marcus.wong@tech.gov.sg',
  },
};

export function isAuthenticated(): boolean {
  if (typeof window === 'undefined') return false;
  const stored = localStorage.getItem(AUTH_KEY);
  return stored === 'true';
}

export function getCurrentUser(): SingpassUser | null {
  if (typeof window === 'undefined') return null;
  const stored = localStorage.getItem(USER_INFO_KEY);
  if (!stored) return null;

  try {
    return JSON.parse(stored) as SingpassUser;
  } catch {
    return null;
  }
}

/**
 * Mock Singpass login
 * In production, this would redirect to Singpass OIDC authorization endpoint
 */
export function mockSingpassLogin(nricLast4: string): SingpassUser | null {
  const user = MOCK_USERS[nricLast4];

  if (user && typeof window !== 'undefined') {
    localStorage.setItem(AUTH_KEY, 'true');
    localStorage.setItem(USER_INFO_KEY, JSON.stringify(user));
    return user;
  }

  return null;
}

/**
 * Production Singpass flow (for reference)
 *
 * 1. Generate PKCE code verifier and challenge
 * 2. Redirect to Singpass authorization URL with params:
 *    - client_id
 *    - redirect_uri
 *    - response_type=code
 *    - scope=openid profile email
 *    - code_challenge & code_challenge_method
 * 3. User authenticates with Singpass (mobile app or face verification)
 * 4. Singpass redirects back with authorization code
 * 5. Exchange code for tokens at token endpoint
 * 6. Validate ID token and extract user info
 */
export function initiateRealSingpassLogin(clientId: string, redirectUri: string): void {
  // This would be the real implementation
  const authUrl = new URL('https://stg-id.singpass.gov.sg/auth');
  authUrl.searchParams.set('client_id', clientId);
  authUrl.searchParams.set('redirect_uri', redirectUri);
  authUrl.searchParams.set('response_type', 'code');
  authUrl.searchParams.set('scope', 'openid profile email');
  // Add PKCE params

  // window.location.href = authUrl.toString();
}

export function isVerified(): boolean {
  if (typeof window === 'undefined') return false;
  const stored = localStorage.getItem(VERIFIED_KEY);
  return stored === 'true';
}

export function markAsVerified(): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(VERIFIED_KEY, 'true');
  }
}

export function logout(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(AUTH_KEY);
    localStorage.removeItem(USER_INFO_KEY);
    localStorage.removeItem(VERIFIED_KEY);
  }
}

export function getMockNRICs(): string[] {
  return Object.keys(MOCK_USERS);
}

export function getMockUsers(): Record<string, SingpassUser> {
  return MOCK_USERS;
}
