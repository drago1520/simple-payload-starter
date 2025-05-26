import canUseDOM from './canUseDOM';

/**
 * Utility functions for getting the application's URL in different environments.
 * These functions help maintain consistent URL generation across server and client contexts.
 */

/**
 * Gets the application URL when running on the server.
 *
 * @returns {string} The server-side URL of the application
 *
 * ## When to use:
 *
 * 1. **Server Components**:
 *    - When generating absolute URLs in Server Components
 *    - For creating canonical URLs for SEO
 *
 * 2. **API Routes**:
 *    - When constructing callback URLs for authentication flows
 *    - For webhook response URLs
 *
 * 3. **Email Templates**:
 *    - When including application links in emails
 */
export const getServerSideURL = () => {
  let url = process.env.NEXT_PUBLIC_SERVER_URL;

  if (!url && process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }

  if (!url) {
    url = 'http://localhost:3000';
  }

  return url;
};

/**
 * Gets the application URL when running in the browser.
 * Falls back to server-side detection when not in browser.
 *
 * @returns {string} The client-side URL of the application
 *
 * ## When to use:
 *
 * 1. **Client Components**:
 *    - When generating absolute URLs in Client Components
 *    - For sharing links or social media integration
 *
 * 2. **Dynamic Redirects**:
 *    - When constructing redirect URLs based on current location
 *
 * 3. **Cross-Origin Requests**:
 *    - When making API calls that need the current origin
 */
export const getClientSideURL = () => {
  if (canUseDOM) {
    const protocol = window.location.protocol;
    const domain = window.location.hostname;
    const port = window.location.port;

    return `${protocol}//${domain}${port ? `:${port}` : ''}`;
  }

  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }

  return process.env.NEXT_PUBLIC_SERVER_URL || '';
};
