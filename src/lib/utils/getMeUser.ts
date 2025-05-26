import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import type { User } from '@/payload-types';
import { getClientSideURL } from './getURL';

/**
 * Fetches the currently authenticated user and handles redirects based on authentication state.
 *
 * @param {Object} args - Optional arguments for redirect behavior
 * @param {string} args.nullUserRedirect - URL to redirect to if no user is authenticated
 * @param {string} args.validUserRedirect - URL to redirect to if a user is authenticated
 * @returns {Promise<{token: string, user: User}>} The authenticated user and their token
 *
 * ## When to use:
 *
 * 1. **Authentication Checks**:
 *    - For protecting routes that require authentication
 *    - To implement auth guards in Server Components
 *
 * 2. **User-specific Content**:
 *    - When displaying personalized content based on the current user
 *    - For showing user profile information
 *
 * 3. **Conditional Redirects**:
 *    - To redirect authenticated users away from login/signup pages
 *    - To redirect unauthenticated users to login pages
 *
 * 4. **Permission Checks**:
 *    - As a first step in checking user permissions
 *    - Before performing user-specific operations
 *
 * ## Example usage:
 *
 * ```tsx
 * // In a protected page.tsx
 * export default async function ProtectedPage() {
 *   // Redirects to /login if not authenticated
 *   const { user } = await getMeUser({
 *     nullUserRedirect: '/login'
 *   });
 *
 *   return (
 *     <div>
 *       <h1>Welcome, {user.name}</h1>
 *       <p>Your email: {user.email}</p>
 *     </div>
 *   );
 * }
 *
 * // In a login page.tsx
 * export default async function LoginPage() {
 *   // Redirects to /dashboard if already authenticated
 *   try {
 *     await getMeUser({
 *       validUserRedirect: '/dashboard'
 *     });
 *   } catch (error) {
 *     // User is not authenticated, show login form
 *   }
 *
 *   return <LoginForm />;
 * }
 * ```
 */
export const getMeUser = async (args?: {
  nullUserRedirect?: string;
  validUserRedirect?: string;
}): Promise<{
  token: string;
  user: User;
}> => {
  const { nullUserRedirect, validUserRedirect } = args || {};
  const cookieStore = await cookies();
  const token = cookieStore.get('payload-token')?.value;

  const meUserReq = await fetch(`${getClientSideURL()}/api/users/me`, {
    headers: {
      Authorization: `JWT ${token}`,
    },
  });

  const {
    user,
  }: {
    user: User;
  } = await meUserReq.json();

  if (validUserRedirect && meUserReq.ok && user) {
    redirect(validUserRedirect);
  }

  if (nullUserRedirect && (!meUserReq.ok || !user)) {
    redirect(nullUserRedirect);
  }

  // Token will exist here because if it doesn't the user will be redirected
  return {
    token: token!,
    user,
  };
};
