import type { Block, Field } from 'payload';

import { FixedToolbarFeature, HeadingFeature, InlineToolbarFeature, lexicalEditor } from '@payloadcms/richtext-lexical';

import { linkGroup } from '@/payload/fields/Link/linkGroup';

export const LowImpactHero: Block = {
  slug: 'LowImpactHero',
  interfaceName: 'LowImpactHeroBlock',
  fields: [
    {
      name: 'richText',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [...rootFeatures, HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }), FixedToolbarFeature(), InlineToolbarFeature()];
        },
      }),
      label: false,
    },
    linkGroup({
      overrides: {
        maxRows: 2,
      },
    }),
  ],
};
