import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { serialize } from 'next-mdx-remote/serialize';
import { MDXRemote } from 'next-mdx-remote';
import SoundToggle from '../../components/SoundToggle';

export default function Post({ post, mdxSource }) {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(!post.password_protected);
  const [error, setError] = useState('');

  if (router.isFallback) {
    return <div className="min-h-screen bg-night-black flex items-center justify-center">Loading...</div>;
  }

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    // In a real app, you would verify against a hashed password
    // This is a simplified example
    if (password === 'tamsudem') {
      setIsUnlocked(true);
      setError('');
    } else {
      setError('Incorrect password');
    }
  };

  return (
    <div className="min-h-screen bg-night-black">
      <Head>
        <title>{post.title} | Tâm Sự Đêm</title>
        <meta name="description" content={post.excerpt || 'Tâm Sự Đêm'} />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Inter:wght@300;400;600&display=swap" rel="stylesheet" />
      </Head>

      <main className="max-w-4xl mx-auto py-12 px-4">
        <div className="absolute top-4 right-4 z-20">
          <SoundToggle />
        </div>

        <Link href="/" className="text-deep-blue hover:underline mb-8 inline-block">
          ← Trở về trang chủ
        </Link>

        {post.password_protected && !isUnlocked ? (
          <div className="bg-gray-900 rounded-lg p-8 shadow-lg max-w-md mx-auto mt-12">
            <h1 className="text-2xl font-serif font-bold text-white mb-6 text-center">
              Bài viết được bảo vệ
            </h1>
            <p className="text-gray-300 mb-6 text-center">
              Vui lòng nhập mật khẩu để đọc bài viết này.
            </p>
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Nhập mật khẩu"
                  className="w-full p-3 rounded bg-gray-800 text-white border border-gray-700 focus:border-deep-blue focus:outline-none"
                />
                {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
              </div>
              <button
                type="submit"
                className="w-full bg-deep-blue text-white py-3 rounded hover:bg-opacity-90 transition-all"
              >
                Mở khóa
              </button>
            </form>
          </div>
        ) : (
          <>
            <div className="mb-8">
              <div className="flex flex-wrap gap-2 mb-4">
                {post.tags.map(tag => (
                  <span key={tag} className="text-xs bg-deep-blue px-2 py-1 rounded-full text-white">
                    {tag}
                  </span>
                ))}
              </div>

              <h1 className="text-4xl font-serif font-bold text-white text-glow mb-4">
                {post.title}
              </h1>

              <p className="text-gray-400 mb-8">
                {new Date(post.date).toLocaleDateString('vi-VN', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>

              {post.featured_image && (
                <div className="relative h-64 md:h-96 mb-8 rounded-lg overflow-hidden">
                  <Image
                    src={post.featured_image}
                    alt={post.title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
            </div>

            <article className="prose prose-invert prose-lg max-w-none">
              <MDXRemote {...mdxSource} />
            </article>

            <div className="mt-12 pt-8 border-t border-gray-800">
              <h3 className="text-xl font-serif text-white mb-4">Chia sẻ bài viết</h3>
              <div className="flex space-x-4">
                <button
                  aria-label="Share on Facebook"
                  className="text-gray-400 hover:text-blue-500"
                  onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank')}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                  </svg>
                </button>
                <button
                  aria-label="Share on Zalo"
                  className="text-gray-400 hover:text-blue-600"
                  onClick={() => window.open(`https://zalo.me/share?u=${encodeURIComponent(window.location.href)}&t=${encodeURIComponent(post.title)}`, '_blank')}
                >
                  <span className="font-bold">Zalo</span>
                </button>
              </div>
            </div>
          </>
        )}
      </main>

      <footer className="py-8 text-center text-gray-400">
        <p>© {new Date().getFullYear()} Tâm Sự Đêm. All rights reserved.</p>
      </footer>
    </div>
  );
}

export async function getStaticPaths() {
  const postsDirectory = path.join(process.cwd(), 'posts');
  const filenames = fs.readdirSync(postsDirectory);

  const paths = filenames.map((filename) => ({
    params: {
      slug: filename.replace(/\.md$/, ''),
    },
  }));

  return {
    paths,
    fallback: 'blocking',
  };
}

export async function getStaticProps({ params }) {
  const { slug } = params;
  const filePath = path.join(process.cwd(), 'posts', `${slug}.md`);
  const fileContents = fs.readFileSync(filePath, 'utf8');
  
  const { data, content } = matter(fileContents);
  const mdxSource = await serialize(content);

  return {
    props: {
      post: {
        slug,
        title: data.title,
        date: data.date,
        tags: data.tags,
        excerpt: data.excerpt || '',
        featured_image: data.featured_image || null,
        password_protected: data.password_protected || false,
      },
      mdxSource,
    },
  };
}