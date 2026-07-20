import React, { useMemo } from "react";
import {
  Calendar,
  User,
  MessageSquare,
  ArrowRight,
  Zap,
} from "lucide-react";

export default function PostCard({
  post,
  categoryName,
  darkMode,
  onSelect,
  onSelectCategory,
}) {
  // ✅ useMemo - Excerpt cache (performance)
  const excerpt = useMemo(() => {
    const limit = 200;
    if (post.introduction.length <= limit) return post.introduction;
    return post.introduction.substring(0, limit).trim() + "...";
  }, [post.introduction]);

  // ✅ Keyboard accessibility
  const handleKeyDown = (e, action) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      action();
    }
  };

  return (
    <article
      className={`group flex flex-col border-b ${
        darkMode
          ? "bg-neutral-900 border-neutral-800"
          : "bg-white border-slate-200"
      }`}
      itemScope
      itemType="https://schema.org/BlogPosting"
    >
      {/* ✅ Post Thumbnail with proper semantics */}
      <div
        onClick={() => onSelect(post.id)}
        onKeyDown={(e) => handleKeyDown(e, () => onSelect(post.id))}
        className="w-full overflow-hidden relative cursor-pointer focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
        role="button"
        tabIndex={0}
        aria-label={`Read article: ${post.title}`}
      >
        <div className="relative w-full" style={{ paddingBottom: '65%', minHeight: '220px' }}>
          {/* ✅ Lazy loading + WebP fallback */}
          <img
            src={post.image}
            alt={post.title}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 w-full h-full  transition-transform duration-300 group-hover:scale-101"
            onError={(e) => {
              e.target.src =
                "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80";
            }}
          />
        </div>
        
        {/* ✅ Category Badge - Keyboard accessible */}
        <span
          onClick={(e) => {
            e.stopPropagation();
            onSelectCategory(post.categoryId);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              e.stopPropagation();
              onSelectCategory(post.categoryId);
            }
          }}
          className="absolute bottom-3 left-3 bg-sky-600 dark:bg-sky-500 text-white text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 hover:bg-sky-700 dark:hover:bg-sky-600 transition-colors cursor-pointer z-10 rounded"
          role="button"
          tabIndex={0}
          aria-label={`Category: ${categoryName}`}
        >
          {categoryName}
        </span>

        {/* ✅ Trending indicator */}
        {post.isTrending && (
          <span className="absolute top-3 right-3 bg-rose-600 text-white text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 flex items-center gap-1 z-10 rounded" aria-label="Trending post">
            <Zap className="w-2.5 h-2.5 fill-white" aria-hidden="true" />
            <span>Trending</span>
          </span>
        )}
      </div>

      {/* ✅ Card Content with Schema */}
      <div className="p-4 sm:p-5 md:p-6 pt-5 sm:pt-6 md:pt-7 flex-1 flex flex-col gap-3">
        <div>
          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] sm:text-[11px] font-medium text-gray-500 dark:text-gray-400">
            <span className="flex items-center gap-1" itemProp="datePublished">
              <Calendar className="w-3 h-3 sm:w-3.5 sm:h-3.5" aria-hidden="true" />
              <span>{post.date}</span>
            </span>
            <span className="flex items-center gap-1" itemProp="author">
              <User className="w-3 h-3 sm:w-3.5 sm:h-3.5" aria-hidden="true" />
              <span className="hidden sm:inline">By </span>{post.author}
            </span>
            <span className="flex items-center gap-1">
              <MessageSquare className="w-3 h-3 sm:w-3.5 sm:h-3.5" aria-hidden="true" />
              <span>
                {post.comments.length} {post.comments.length !== 1 ? "Comments" : "Comment"}
              </span>
            </span>
          </div>

          {/* ✅ Title - Clickable */}
          <h3
            onClick={() => onSelect(post.id)}
            onKeyDown={(e) => handleKeyDown(e, () => onSelect(post.id))}
            className={`text-base sm:text-lg md:text-xl lg:text-2xl font-bold leading-snug cursor-pointer transition-colors mt-2 focus:outline-none focus:ring-2 focus:ring-sky-500 rounded ${
              darkMode ? 'text-white hover:text-sky-400' : 'text-black hover:text-sky-600'
            }`}
            role="button"
            tabIndex={0}
            aria-label={`Read full article: ${post.title}`}
            itemProp="headline"
          >
            {post.title}
          </h3>

          {/* ✅ Introduction Snippet */}
          <p className={`text-xs sm:text-sm leading-relaxed mt-2 line-clamp-3 ${
            darkMode ? 'text-gray-300' : 'text-gray-700'
          }`} itemProp="description">
            {excerpt}
          </p>
        </div>

        {/* ✅ Bottom Actions */}
        <div className="pt-3 border-t border-slate-100 dark:border-neutral-800 flex justify-between items-center mt-2">
          <button
            onClick={() => onSelect(post.id)}
            className="flex items-center gap-1 text-[10px] sm:text-xs font-bold text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 transition-colors focus:outline-none focus:ring-2 focus:ring-sky-500 rounded px-2 py-1"
            aria-label={`Continue reading: ${post.title}`}
          >
            <span>Continue Reading</span>
            <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" aria-hidden="true" />
          </button>
        </div>
      </div>
    </article>
  );
}