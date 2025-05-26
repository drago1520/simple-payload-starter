import configPromise from '@payload-config';
import { getPayload } from 'payload';
import { unstable_cache } from 'next/cache';

/**
 * Fetches all redirects from the Payload CMS.
 *
 * @param {number} depth - The depth of relationships to populate
 * @returns {Promise<any[]>} Array of redirect documents
 */
export async function getRedirects(depth = 1) {
  const payload = await getPayload({ config: configPromise });

  const { docs: redirects } = await payload.find({
    collection: 'redirects',
    depth,
    limit: 0,
    pagination: false,
  });

  return redirects;
}

/**
 * Returns a cached version of all redirects from the CMS.
 * Uses Next.js unstable_cache for server-side caching with appropriate cache tags.
 *
 * Cache all redirects together to avoid multiple fetches.
 *
 * @returns {Promise<any[]>} Array of cached redirect documents
 *
 * ## When to use:
 *
 * 1. **Middleware**:
 *    - In Next.js middleware for handling redirects
 *    - For implementing custom redirect logic based on CMS data
 *
 * 2. **Route Handlers**:
 *    - In API routes that need to check for redirects
 *    - For server-side redirect handling
 *
 * 3. **Navigation Components**:
 *    - When building navigation that needs to respect redirects
 *    - For ensuring links point to the correct destination
 *
 * 4. **SEO Optimization**:
 *    - For implementing proper 301/302 redirects
 *    - To maintain SEO value when URLs change
 *
 * ## Example usage:
 *
 * ```tsx
 * // In middleware.ts
 * import { NextResponse } from 'next/server';
 * import { getCachedRedirects } from '@/lib/utils/getRedirects';
 *
 * export async function middleware(request: NextRequest) {
 *   const redirects = await getCachedRedirects();
 *   const pathname = request.nextUrl.pathname;
 *
 *   const matchedRedirect = redirects.find(redirect =>
 *     redirect.from === pathname
 *   );
 *
 *   if (matchedRedirect) {
 *     return NextResponse.redirect(
 *       new URL(matchedRedirect.to, request.url),
 *       { status: matchedRedirect.statusCode || 302 }
 *     );
 *   }
 *
 *   return NextResponse.next();
 * }
 * ```
 */
export const getCachedRedirects = () =>
  unstable_cache(async () => getRedirects(), ['redirects'], {
    tags: ['redirects'],
  });
