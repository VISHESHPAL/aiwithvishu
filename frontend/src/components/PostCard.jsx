import React from "react";
import {
  Calendar,
  User,
  MessageSquare,
  ArrowRight,
  Edit,
  Trash2,
  Zap,
} from "lucide-react";

export default function PostCard({
  post,
  categoryName,
  darkMode,
  onSelect,
  onSelectCategory,
  onEdit,
  onDelete,
}) {
  // Truncate introduction for card snippet
  const getExcerpt = (text, limit = 200) => {
    if (text.length <= limit) return text;
    return text.substring(0, limit).trim() + "...";
  };

  return (
    <article
      className={`group flex flex-col border-b ${
        darkMode
          ? "bg-neutral-900 border-neutral-800"
          : "bg-white border-slate-200"
      }`}
    >
      {/* Post Thumbnail - Better responsive for mobile with more height */}
      <div
        onClick={() => onSelect(post.id)}
        className="w-full overflow-hidden relative cursor-pointer"
      >
        <div className="relative w-full" style={{ paddingBottom: '65%', minHeight: '220px' }}>
          <img
            src={post.image}
            alt={post.title}
            className="absolute inset-0 w-full h-full "
            onError={(e) => {
              e.target.src =
                "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80";
            }}
          />
        </div>
        
        {/* Category Badge on Thumbnail */}
        <span
          onClick={(e) => {
            e.stopPropagation();
            onSelectCategory(post.categoryId);
          }}
          className="absolute bottom-3 left-3 bg-sky-600 dark:bg-sky-500 text-white text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 hover:bg-sky-700 dark:hover:bg-sky-600 transition-colors cursor-pointer z-10"
        >
          {categoryName}
        </span>

        {/* Trending indicator */}
        {post.isTrending && (
          <span className="absolute top-3 right-3 bg-rose-600 text-white text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 flex items-center gap-1 z-10">
            <Zap className="w-2.5 h-2.5 fill-white" />
            <span>Trending</span>
          </span>
        )}
      </div>

      {/* Card Content - Below image with more top padding */}
      <div className="p-4 sm:p-5 md:p-6 pt-5 sm:pt-6 md:pt-7 flex-1 flex flex-col gap-3">
        <div>
          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] sm:text-[11px] font-medium text-gray-500 dark:text-gray-400">
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              <span>{post.date}</span>
            </span>
            <span className="flex items-center gap-1">
              <User className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              <span className="hidden sm:inline">By </span>{post.author}
            </span>
            <span className="flex items-center gap-1">
              <MessageSquare className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              <span>
                {post.comments.length} {post.comments.length !== 1 ? "Comments" : "Comment"}
              </span>
            </span>
          </div>

          {/* Title */}
          <h3
            onClick={() => onSelect(post.id)}
            className={`text-base sm:text-lg md:text-xl lg:text-2xl font-bold leading-snug cursor-pointer transition-colors mt-2 ${
              darkMode ? 'text-white hover:text-sky-400' : 'text-black hover:text-sky-600'
            }`}
          >
            {post.title}
          </h3>

          {/* Introduction Snippet */}
          <p className={`text-xs sm:text-sm leading-relaxed mt-2 line-clamp-3 ${
            darkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>
            {getExcerpt(post.introduction)}
          </p>
        </div>

        {/* Bottom Actions */}
        <div className="pt-3 border-t border-slate-100 dark:border-neutral-800 flex justify-between items-center mt-2">
          <button
            onClick={() => onSelect(post.id)}
            className="flex items-center gap-1 text-[10px] sm:text-xs font-bold text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 transition-colors"
          >
            <span>Continue Reading</span>
            <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
          </button>
        </div>
      </div>
    </article>
  );
}