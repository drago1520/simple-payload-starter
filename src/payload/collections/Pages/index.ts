import type { CollectionConfig, Field } from 'payload';

import { authenticated } from '@/payload/auth/authenticated';
import { authenticatedOrPublished } from '@/payload/auth/authenticatedOrPublished';
import { Archive } from '@/payload/blocks/ArchiveBlock/config';
import { CallToAction } from '@/payload/blocks/CallToAction/config';
import { Content } from '@/payload/blocks/Content/config';
import { MediaBlock } from '@/payload/blocks/MediaBlock/config';
import { slugField } from '@/payload/fields/slug';
import { populatePublishedAt } from '@/payload/hooks/populatePublishedAt';
import { generatePreviewPath } from '@/lib/utils/generatePreviewPath';
import { revalidateDelete, revalidatePage } from './hooks/revalidatePage';

import { MetaDescriptionField, MetaImageField, MetaTitleField, OverviewField, PreviewField } from '@payloadcms/plugin-seo/fields';
import { HighImpactHero } from '@/payload/blocks/HighImpact/config';
import { MediumImpactHero } from '@/payload/blocks/MediumImpact/config';
import { LowImpactHero } from '@/payload/blocks/LowImpact/config';

export const Pages: CollectionConfig<'pages'> = {
  slug: 'pages',
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
  },
  // This config controls what's populated by default when a page is referenced
  // https://payloadcms.com/docs/queries/select#defaultpopulate-collection-config-property
  // Type safe if the collection slug generic is passed to `CollectionConfig` - `CollectionConfig<'pages'>
  defaultPopulate: {
    title: true,
    slug: true,
  },
  admin: {
    defaultColumns: ['title', 'slug', 'updatedAt'],
    livePreview: {
      url: ({ data, req }) => {
        const path = generatePreviewPath({
          slug: typeof data?.slug === 'string' ? data.slug : '',
          collection: 'pages',
          req,
        });

        return path;
      },
    },
    preview: (data, { req }) =>
      generatePreviewPath({
        slug: typeof data?.slug === 'string' ? data.slug : '',
        collection: 'pages',
        req,
      }),
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Content',
          fields: [
            {
              type: 'blocks',
              name: 'blocks',
              label: false,
              labels: {
                singular: 'block',
                plural: 'blocks',
              },
              blocks: [HighImpactHero, MediumImpactHero, LowImpactHero, CallToAction, Content, MediaBlock, Archive],
              admin: {
                initCollapsed: true,
              },
            },
          ],
        },
        {
          label: 'SEO',
          name: 'meta',
          fields: [
            OverviewField({
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
              imagePath: 'meta.image',
            }),
            MetaTitleField({
              hasGenerateFn: true,
            }),
            MetaImageField({
              relationTo: 'media',
            }),
            MetaDescriptionField({}),
            PreviewField({
              // if the `generateUrl` function is configured
              hasGenerateFn: true,
              // field paths to match the target field for data
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
            }),
          ],
        },
      ],
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        position: 'sidebar',
      },
    },
    ...slugField(),
  ],
  hooks: {
    afterChange: [revalidatePage],
    beforeChange: [populatePublishedAt],
    beforeDelete: [revalidateDelete],
  },
  versions: {
    drafts: {
      autosave: {
        interval: 100, // We set this interval for optimal live preview
      },
      schedulePublish: true,
    },
    maxPerDoc: 50,
  },
};
