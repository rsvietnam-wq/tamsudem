import { useState, useEffect } from 'react';
import Head from 'next/head';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import PostCard from '../components/PostCard';
import QuoteRotator from '../components/QuoteRotator';
import SoundToggle from '../components/SoundToggle';

export default function Home({ posts }) {
  const [stars, setStars] = useState([]);
  
  useEffect(() => {
    // Create stars for the background
    const newStars = [];
    for (let i = 0; i < 100; i++) {
      newStars.push({
        id: i,
        top: Math.random() * 100 + '%',
        left: Math.random() * 100 + '%',
        size: Math.random() * 3 + 1 + 'px',
        delay: Math.random() * 4 + 's'
      });
    }
    setStars(newStars);
  }, []);

  return (
    <div className="min-h-screen bg-night-black">
      <Head>
        <title>Tâm Sự Đêm</title>
        <meta name="description" content="Những tâm sự khi đêm về" />
        <link rel="icon" href="/favicon.ico" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Inter:wght@300;400;600&display=swap" rel="stylesheet" />
      </Head>

      <main>
        {/* Hero Section with Moon and Stars */}
        <div className="relative h-screen flex flex-col items-center justify-center overflow-hidden">
          {stars.map(star => (
            <div
              key={star.id}
              className="star"
              style={{
                top: star.top,
                left: star.left,
                width: star.size,
                height: star.size,
                animationDelay: star.delay
              }}
            />
          ))}
          
          <div className="moon mx-auto mb-12"></div>
          
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-white text-glow text-center mb-6 z-10">
            Tâm Sự Đêm
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl text-center mb-8 z-10">
            Những tâm tư, suy nghĩ chỉ có thể thổ lộ khi đêm về
          </p>
          
          <div className="absolute top-4 right-4 z-20">
            <SoundToggle />
          </div>
        </div>

        {/* Quote Rotator */}
        <div className="max-w-4xl mx-auto py-12 px-4">
          <QuoteRotator />
        </div>

        {/* Blog Posts */}
        <div className="max-w-6xl mx-auto py-12 px-4">
          <h2 className="text-3xl font-serif font-bold text-white mb-8 text-center">Bài Viết Mới Nhất</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        </div>
      </main>

      <footer className="py-8 text-center text-gray-400">
        <p>© {new Date().getFullYear()} Tâm Sự Đêm. All rights reserved.</p>
      </footer>
    </div>
  );
}

export async function getStaticProps() {
  const postsDirectory = path.join(process.cwd(), 'posts');
  const filenames = fs.readdirSync(postsDirectory);

  const posts = filenames.map((filename) => {
    const filePath = path.join(postsDirectory, filename);
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { data } = matter(fileContents);
    
    return {
      slug: filename.replace(/\.md$/, ''),
      title: data.title,
      date: data.date,
      tags: data.tags,
      excerpt: data.excerpt || '',
      featured_image: data.featured_image || null,
      password_protected: data.password_protected || false,
    };
  });

  // Sort posts by date (newest first)
  return {
    props: {
      posts: posts.sort((a, b) => new Date(b.date) - new Date(a.date)),
    },
  };
}