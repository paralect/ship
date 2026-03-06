import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { allPosts } from 'content-collections';
import { User } from 'lucide-react';

import { LayoutType, Page } from 'components';

const Blog = () => {
  const publishedPosts = allPosts.filter((post) => post.published);

  return (
    <Page layout={LayoutType.PUBLIC_PAGE}>
      <Head>
        <title>Blog</title>
      </Head>

      <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {publishedPosts.map((post) => (
            <Link key={post._meta.path} href={`/posts/${post.slug}`}>
              <article className="group relative cursor-pointer overflow-hidden rounded-2xl">
                <div className="relative aspect-[4/3] bg-muted">
                  {post.image && (
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/10 transition-opacity duration-300 group-hover:opacity-90" />
                </div>

                <div className="absolute inset-0 flex flex-col justify-end p-5">
                  <div className="mb-3 flex flex-wrap gap-2">
                    {post.tags.slice(0, 2).map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-white/30 bg-white/10 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm transition-colors group-hover:bg-white/20"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <h3 className="mb-2 text-xl font-bold leading-tight text-white transition-transform duration-300 group-hover:translate-x-1">
                    {post.title}
                  </h3>

                  <p className="mb-4 text-sm text-white/70 line-clamp-2 transition-opacity duration-300 group-hover:text-white/90">
                    {post.excerpt}
                  </p>

                  <div className="flex items-center gap-3">
                    <div className="relative flex size-8 items-center justify-center overflow-hidden rounded-full ring-2 ring-white/20 bg-white/10">
                      {post.authorImage ? (
                        <Image src={post.authorImage} alt={post.authorName} fill className="object-cover" />
                      ) : (
                        <User className="size-4 text-white/70" />
                      )}
                    </div>

                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-white">{post.authorName}</span>
                      <span className="text-xs text-white/60">{post.date}</span>
                    </div>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </Page>
  );
};

export default Blog;
