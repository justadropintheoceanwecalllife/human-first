/**
 * Simple passcode authentication for demo
 */

const AUTH_KEY = 'human-first-auth';
const VALID_PASSCODES = [
  'human123',
  'govtech2024',
  'jellyfish',
  'touchgrass',
];

export function isAuthenticated(): boolean {
  if (typeof window === 'undefined') return false;
  const stored = localStorage.getItem(AUTH_KEY);
  return stored === 'true';
}

export function login(passcode: string): boolean {
  if (VALID_PASSCODES.includes(passcode.toLowerCase())) {
    if (typeof window !== 'undefined') {
      localStorage.setItem(AUTH_KEY, 'true');
    }
    return true;
  }
  return false;
}

export function logout(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(AUTH_KEY);
  }
}

export function getValidPasscodes(): string[] {
  return VALID_PASSCODES;
}
