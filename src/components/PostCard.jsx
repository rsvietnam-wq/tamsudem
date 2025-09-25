import Link from 'next/link';
import Image from 'next/image';

export default function PostCard({ post }) {
  return (
    <div className={`post-card bg-gray-900 rounded-lg overflow-hidden shadow-lg ${post.password_protected ? 'password-protected' : ''}`}>
      {post.featured_image && (
        <div className="relative h-48">
          <Image 
            src={post.featured_image}
            alt={post.title}
            fill
            className="object-cover"
          />
        </div>
      )}
      
      <div className="p-6">
        <div className="flex flex-wrap gap-2 mb-3">
          {post.tags.map(tag => (
            <span key={tag} className="text-xs bg-deep-blue px-2 py-1 rounded-full text-white">
              {tag}
            </span>
          ))}
        </div>
        
        <Link href={`/posts/${post.slug}`}>
          <h3 className="text-xl font-serif font-bold text-white mb-2 hover:text-glow transition-all">
            {post.title}
          </h3>
        </Link>
        
        <p className="text-gray-400 text-sm mb-4">
          {new Date(post.date).toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </p>
        
        {post.excerpt && (
          <p className="text-gray-300 mb-4">{post.excerpt}</p>
        )}
        
        <div className="flex justify-between items-center">
          <Link href={`/posts/${post.slug}`} className="text-deep-blue hover:underline">
            Đọc tiếp →
          </Link>
          
          <div className="flex space-x-2">
            <button 
              aria-label="Share on Facebook"
              className="text-gray-400 hover:text-blue-500"
              onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.origin + '/posts/' + post.slug)}`, '_blank')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
              </svg>
            </button>
            <button 
              aria-label="Share on Zalo"
              className="text-gray-400 hover:text-blue-600"
              onClick={() => window.open(`https://zalo.me/share?u=${encodeURIComponent(window.location.origin + '/posts/' + post.slug)}&t=${encodeURIComponent(post.title)}`, '_blank')}
            >
              <span className="font-bold text-sm">Zalo</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}