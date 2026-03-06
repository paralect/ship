import type { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useMDXComponent } from '@content-collections/mdx/react';
import { allPosts, Post } from 'content-collections';
import { ArrowLeft, User } from 'lucide-react';

import { LayoutType, Page } from 'components';

import { Button } from '@/components/ui/button';

interface PostPageProps {
  post: Post;
}

const PostPage = ({ post }: PostPageProps) => {
  const MDXContent = useMDXComponent(post.mdx);

  return (
    <Page layout={LayoutType.PUBLIC_PAGE}>
      <Head>
        <title>{post.title}</title>
        <meta name="description" content={post.excerpt} />
      </Head>

      <article className="mx-auto max-w-3xl p-4 sm:p-6">
        <Button variant="ghost" size="sm" asChild className="mb-6">
          <Link href="/blog">
            <ArrowLeft className="mr-2 size-4" />
            Back to Blog
          </Link>
        </Button>

        <header className="mb-8">
          <div className="mb-4 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span key={tag} className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                {tag}
              </span>
            ))}
          </div>

          <h1 className="mb-4 text-3xl font-bold leading-tight text-foreground sm:text-4xl">{post.title}</h1>

          <div className="flex items-center gap-3">
            <div className="relative flex size-10 items-center justify-center overflow-hidden rounded-full bg-muted">
              {post.authorImage ? (
                <Image src={post.authorImage} alt={post.authorName} fill className="object-cover" />
              ) : (
                <User className="size-5 text-muted-foreground" />
              )}
            </div>
            <div className="flex flex-col">
              <span className="font-medium">{post.authorName}</span>
              <span className="text-sm text-muted-foreground">{post.date}</span>
            </div>
          </div>
        </header>

        {post.image && (
          <div className="relative mb-8 aspect-video overflow-hidden rounded-2xl">
            <Image src={post.image} alt={post.title} fill className="object-cover" priority />
          </div>
        )}

        <div className="prose max-w-none text-foreground prose-headings:text-foreground prose-p:text-foreground prose-strong:text-foreground prose-code:text-foreground prose-li:text-foreground prose-a:text-primary prose-pre:bg-muted prose-pre:text-foreground">
          <MDXContent />
        </div>
      </article>
    </Page>
  );
};

export const getStaticPaths: GetStaticPaths = () => {
  const paths = allPosts
    .filter((post) => post.published)
    .map((post) => ({
      params: { slug: post.slug },
    }));

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<PostPageProps> = ({ params }) => {
  const slug = params?.slug as string;
  const post = allPosts.find((p) => p.slug === slug);

  if (!post) {
    return { notFound: true };
  }

  return {
    props: { post },
  };
};

export default PostPage;
