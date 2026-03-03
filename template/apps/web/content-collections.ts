import { defineCollection, defineConfig } from '@content-collections/core';
import { compileMDX } from '@content-collections/mdx';
import { z } from 'zod';

const posts = defineCollection({
  name: 'posts',
  directory: 'content/posts',
  include: '**/*.md',
  schema: z.object({
    title: z.string(),
    date: z.string(),
    image: z.string().nullable().optional(),
    authorName: z.string(),
    authorImage: z.string().nullable().optional(),
    excerpt: z.string(),
    tags: z.array(z.string()),
    published: z.boolean(),
  }),
  transform: async (document, context) => {
    const slug = document._meta.path;
    const mdx = await compileMDX(context, document);
    return {
      ...document,
      slug,
      mdx,
    };
  },
});

export default defineConfig({
  content: [posts],
});
