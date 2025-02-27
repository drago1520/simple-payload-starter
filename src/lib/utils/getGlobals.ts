import type { Config } from '@/payload/payload-types'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { unstable_cache } from 'next/cache'

type Global = keyof Config['globals']

/**
 * Fetches a global document from Payload CMS.
 * 
 * @param {Global} slug - The slug of the global to fetch
 * @param {number} depth - The depth of relationships to populate
 * @returns {Promise<any>} The global document
 */
async function getGlobal(slug: Global, depth = 0) {
  const payload = await getPayload({ config: configPromise })

  const global = await payload.findGlobal({
    slug,
    depth,
  })

  return global
}

/**
 * Returns a cached version of the global document fetch function.
 * Uses Next.js unstable_cache for server-side caching with appropriate cache tags.
 * 
 * @param {Global} slug - The slug of the global to fetch
 * @param {number} depth - The depth of relationships to populate (default: 0)
 * @returns {Promise<any>} The cached global document
 * 
 * ## When to use:
 * 
 * 1. **Site-wide Settings**:
 *    - For fetching global site configuration like navigation menus
 *    - For header/footer data that appears on multiple pages
 * 
 * 2. **Performance Optimization**:
 *    - When the same global data is needed across multiple pages
 *    - To reduce database queries for frequently accessed data
 * 
 * 3. **Server Components**:
 *    - In Server Components that need access to global site settings
 *    - For layout components that need configuration data
 * 
 * ## Example usage:
 * 
 * ```tsx
 * // In a Server Component
 * import { getCachedGlobal } from '@/lib/utils/getGlobals';
 * 
 * export default async function Header() {
 *   const navigation = await getCachedGlobal('navigation');
 *   
 *   return (
 *     <header>
 *       <nav>
 *         {navigation.links.map(link => (
 *           <a key={link.id} href={link.url}>{link.label}</a>
 *         ))}
 *       </nav>
 *     </header>
 *   );
 * }
 * ```
 */
export const getCachedGlobal = (slug: Global, depth = 0) =>
  unstable_cache(async () => getGlobal(slug, depth), [slug], {
    tags: [`global_${slug}`],
  })
