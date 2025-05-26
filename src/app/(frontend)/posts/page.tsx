import type { Metadata } from 'next/types';

import { CollectionArchive } from '@/components/CollectionArchive/CollectionArchive';
import { PageRange } from '@/components/PageRange';
import { Pagination } from '@/components/Pagination';
import configPromise from '@payload-config';
import { getPayload } from 'payload';
import PageClient from './page.client';

export const dynamic = 'force-static';
export const revalidate = 600;

export const POSTS_SIZE = 12;

// The reason we don't use searchParams for pagination is because otherwise posts list wouldn't be statically generated
// In case you want to use search params, it's as simple as using a searchParams prop and passing it to payload.find (and remove 'force-static' and the page/[pageNumber] folder)
export default async function PostPage() {
  const payload = await getPayload({ config: configPromise });

  const posts = await payload.find({
    collection: 'posts',
    depth: 1,
    limit: POSTS_SIZE,
    overrideAccess: false,
    select: {
      title: true,
      slug: true,
      meta: true,
    },
  });

  return (
    <div className="pb-24 pt-24">
      <PageClient />
      <div className="container mb-12">
        <div className="prose max-w-none dark:prose-invert">
          <h1>Posts</h1>
        </div>
      </div>

      <div className="container mb-8">
        <PageRange collection="posts" currentPage={posts.page} limit={POSTS_SIZE} totalDocs={posts.totalDocs} />
      </div>

      <CollectionArchive posts={posts.docs} />

      <div className="container mt-8">{posts.totalPages > 1 && posts.page && <Pagination page={posts.page} totalPages={posts.totalPages} />}</div>
    </div>
  );
}

export function generateMetadata(): Metadata {
  return {
    title: `Payload Website Template Posts`,
  };
}
