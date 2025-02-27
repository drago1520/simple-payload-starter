import type { Metadata } from 'next'

import type { Media, Page, Post, Config } from '@/payload-types'

import { mergeOpenGraph } from './mergeOpenGraph'
import { getServerSideURL } from './getURL'

/**
 * Helper function to get the appropriate image URL for OpenGraph metadata.
 * Prioritizes the OG-sized image if available, falls back to the original image URL,
 * and uses a default image if none is provided.
 * 
 * @param {Media | Config['db']['defaultIDType'] | null | undefined} image - The image object or ID
 * @returns {string} The full URL to the image
 */
const getImageURL = (image?: Media | Config['db']['defaultIDType'] | null) => {
  const serverUrl = getServerSideURL()

  let url = serverUrl + '/website-template-OG.webp'

  if (image && typeof image === 'object' && 'url' in image) {
    const ogUrl = image.sizes?.og?.url

    url = ogUrl ? serverUrl + ogUrl : serverUrl + image.url
  }

  return url
}

/**
 * Generates standardized metadata for Next.js pages based on Payload CMS document data.
 * 
 * @param {Object} args - Arguments object
 * @param {Partial<Page> | Partial<Post>} args.doc - The Payload document to generate metadata from
 * @returns {Promise<Metadata>} Next.js Metadata object
 * 
 * ## When to use:
 * 
 * 1. **Page Metadata Generation**:
 *    - In generateMetadata functions for Next.js pages
 *    - For consistent metadata across content-driven pages
 * 
 * 2. **SEO Optimization**:
 *    - When implementing SEO best practices for content pages
 *    - For ensuring proper title, description, and OpenGraph data
 * 
 * 3. **Dynamic Routes**:
 *    - In [slug] or dynamic route handlers
 *    - For blog posts, product pages, or other content-driven pages
 * 
 * 4. **Content Preview**:
 *    - When generating metadata for content preview pages
 *    - For draft content that needs proper metadata
 * 
 * ## Example usage:
 * 
 * ```tsx
 * // In a dynamic [slug] page.tsx
 * import { generateMeta } from '@/lib/utils/generateMeta';
 * import { getCachedDocument } from '@/lib/utils/getDocument';
 * 
 * export async function generateMetadata({ params }): Promise<Metadata> {
 *   const post = await getCachedDocument('posts', params.slug);
 *   
 *   if (!post) {
 *     return {
 *       title: 'Post Not Found',
 *     };
 *   }
 *   
 *   return generateMeta({ doc: post });
 * }
 * 
 * export default async function PostPage({ params }) {
 *   // Page component implementation
 * }
 * ```
 */
export const generateMeta = async (args: {
  doc: Partial<Page> | Partial<Post>
}): Promise<Metadata> => {
  const { doc } = args || {}

  const ogImage = getImageURL(doc?.meta?.image)

  const title = doc?.meta?.title
    ? doc?.meta?.title + ' | Payload Website Template'
    : 'Payload Website Template'

  return {
    description: doc?.meta?.description,
    openGraph: mergeOpenGraph({
      description: doc?.meta?.description || '',
      images: ogImage
        ? [
          {
            url: ogImage,
          },
        ]
        : undefined,
      title,
      url: Array.isArray(doc?.slug) ? doc?.slug.join('/') : '/',
    }),
    title,
  }
}
