import { useState, useEffect } from 'react';

const quotes = [
  {
    text: "Đêm về, khi thành phố chìm vào tĩnh lặng, là lúc tâm hồn thức giấc.",
    author: "Tâm Sự Đêm"
  },
  {
    text: "Sau 50, tài sản lớn nhất không phải là tiền bạc, mà là sức khỏe và những kỷ niệm đẹp.",
    author: "Tâm Sự Đêm"
  },
  {
    text: "Đôi khi, nỗi cô đơn không phải là không có ai bên cạnh, mà là không có ai hiểu mình.",
    author: "Tâm Sự Đêm"
  },
  {
    text: "Hạnh phúc đơn giản là được sống như chính mình, không phải sống để làm hài lòng người khác.",
    author: "Tâm Sự Đêm"
  },
  {
    text: "Đừng để nỗi sợ hãi về ngày mai làm mất đi niềm vui của ngày hôm nay.",
    author: "Tâm Sự Đêm"
  }
];

export default function QuoteRotator() {
  const [currentQuote, setCurrentQuote] = useState(0);
  const [fadeIn, setFadeIn] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFadeIn(false);
      
      setTimeout(() => {
        setCurrentQuote((prev) => (prev + 1) % quotes.length);
        setFadeIn(true);
      }, 1000);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-gray-900 rounded-lg p-8 shadow-lg">
      <h3 className="text-xl font-serif text-white mb-6 text-center">Quote of the Night</h3>
      
      <div className={`transition-opacity duration-1000 ${fadeIn ? 'opacity-100' : 'opacity-0'}`}>
        <blockquote className="text-xl font-serif text-gray-300 italic mb-4 text-center">
          "{quotes[currentQuote].text}"
        </blockquote>
        
        <p className="text-right text-gray-400">
          — {quotes[currentQuote].author}
        </p>
      </div>
    </div>
  );
}