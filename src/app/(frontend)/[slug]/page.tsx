import type { Metadata } from 'next';

import { PayloadRedirects } from '@/components/PayloadRedirects';
import configPromise from '@payload-config';
import { draftMode } from 'next/headers';
import { getPayload } from 'payload';
import { cache } from 'react';

import type { Page as PageType } from '@/payload-types';

import { homeStatic } from '@/app/(payload)/next/seed/seedData/home-static';
import { LivePreviewListener } from '@/components/LivePreviewListener';
import { generateMeta } from '@/lib/utils/generateMeta';
import { RenderBlocks } from '@/payload/blocks/RenderBlocks';
import PageClient from './page.client';

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise });
  const pages = await payload.find({
    collection: 'pages',
    draft: false,
    limit: 1000,
    overrideAccess: false,
    pagination: false,
    select: {
      slug: true,
    },
  });

  const params = pages.docs
    ?.filter(doc => {
      return doc.slug !== 'home';
    })
    .map(({ slug }) => {
      return { slug };
    });

  return params;
}

type Args = {
  params: Promise<{
    slug?: string;
  }>;
};

export default async function Page({ params: paramsPromise }: Args) {
  const { isEnabled: draft } = await draftMode();
  const { slug = 'home' } = await paramsPromise;
  const url = '/' + slug;

  let page: PageType | null;

  page = await queryPageBySlug({
    slug,
  });

  // Remove this code once your website is seeded
  if (!page && slug === 'home') {
    page = homeStatic as PageType;
  }

  if (!page) {
    return <PayloadRedirects url={url} />;
  }

  const { blocks } = page;

  return (
    <article className="pb-24 pt-16">
      <PageClient />
      {/* Allows redirects for valid pages too */}
      <PayloadRedirects disableNotFound url={url} />

      {draft && <LivePreviewListener />}

      <RenderBlocks blocks={blocks} />
    </article>
  );
}

export async function generateMetadata({ params: paramsPromise }): Promise<Metadata> {
  const { slug = 'home' } = await paramsPromise;
  const page = await queryPageBySlug({
    slug,
  });

  return generateMeta({ doc: page });
}

const queryPageBySlug = cache(async ({ slug }: { slug: string }) => {
  const { isEnabled: draft } = await draftMode();

  const payload = await getPayload({ config: configPromise });

  const result = await payload.find({
    collection: 'pages',
    draft,
    limit: 1,
    pagination: false,
    overrideAccess: draft,
    where: {
      slug: {
        equals: slug,
      },
    },
  });

  return result.docs?.[0] || null;
});
