import React, { useState, useMemo } from 'react';
import { FolderOpen, Flame } from 'lucide-react';

export default function Sidebar({
  categories,
  posts,
  darkMode,
  onSelectPost,
  onSelectCategory,
  onAddCategory,
  onEditCategory,
  onDeleteCategory,
}) {
  // Local states for category edit
  const [newCatName, setNewCatName] = useState('');
  const [editingCatId, setEditingCatId] = useState(null);
  const [editingCatName, setEditingCatName] = useState('');

  // ✅ useMemo - Performance improve (re-calculate only when posts change)
  const getCategoryCount = useMemo(() => {
    return (catId) => posts.filter(post => post.categoryId === catId).length;
  }, [posts]);

  // ✅ useMemo - Trending posts cache
  const trendingPosts = useMemo(() => {
    return posts.filter(post => post.isTrending);
  }, [posts]);

  const handleCreateCategory = (e) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    onAddCategory(newCatName.trim());
    setNewCatName('');
  };

  const handleStartEdit = (cat) => {
    setEditingCatId(cat.id);
    setEditingCatName(cat.name);
  };

  const handleSaveEdit = (catId) => {
    if (!editingCatName.trim()) return;
    onEditCategory(catId, editingCatName.trim());
    setEditingCatId(null);
  };

  // ✅ Keyboard accessibility - Enter key support
  const handleKeyDown = (e, action) => {
    if (e.key === 'Enter') {
      action();
    }
  };

  return (
    <aside className="w-full flex flex-col gap-6 font-sans" role="complementary" aria-label="Sidebar">
      
      {/* ============================================ */}
      {/* CATEGORIES SECTION                          */}
      {/* ============================================ */}
      <div className={`p-5 rounded-lg shadow-sm border ${
        darkMode ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-slate-200'
      }`}>
        <div className="border-b-2 border-slate-900 dark:border-neutral-700 pb-2 mb-4 flex items-center justify-between">
          <h3 className={`text-xs font-black uppercase tracking-wider flex items-center gap-1.5 ${
            darkMode ? 'text-white' : 'text-black'
          }`}>
            <FolderOpen className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Categories</span>
          </h3>
        </div>
        
        <nav className="flex flex-col divide-y divide-gray-100 dark:divide-neutral-800" aria-label="Categories navigation">
          {categories.map((cat) => {
            const count = getCategoryCount(cat.id);
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`py-2.5 text-left text-[11px] font-bold uppercase tracking-wider flex justify-between items-center group transition-colors focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 rounded ${
                  darkMode ? 'text-gray-300 hover:text-sky-400 focus:text-sky-400' : 'text-gray-700 hover:text-sky-600 focus:text-sky-600'
                }`}
                aria-label={`Category: ${cat.name}, ${count} posts`}
              >
                <span>{cat.name}</span>
                <span className={`px-2 py-0.5 rounded text-[10px] ${
                  darkMode ? 'bg-neutral-800 text-gray-400' : 'bg-slate-100 text-gray-600'
                } group-hover:bg-sky-600 group-hover:text-white transition-all`}
                aria-hidden="true">
                  {count}
                </span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* ============================================ */}
      {/* TRENDING POSTS SECTION                      */}
      {/* ============================================ */}
      <div className={`p-5 rounded-lg shadow-sm border ${
        darkMode ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-slate-200'
      }`}>
        <div className="border-b-2 border-slate-900 dark:border-neutral-700 pb-2 mb-4">
          <h3 className={`text-xs font-black uppercase tracking-wider flex items-center gap-1.5 ${
            darkMode ? 'text-white' : 'text-black'
          }`}>
            <Flame className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Trending Tutorials</span>
          </h3>
        </div>

        {trendingPosts.length === 0 ? (
          <p className="text-xs text-gray-400">No trending posts marked.</p>
        ) : (
          <div className="flex flex-col gap-4" role="list">
            {trendingPosts.map((post) => {
              const category = categories.find(c => c.id === post.categoryId);
              return (
                <div 
                  key={post.id} 
                  onClick={() => onSelectPost(post.id)}
                  onKeyDown={(e) => handleKeyDown(e, () => onSelectPost(post.id))}
                  className="flex items-start gap-3 cursor-pointer group focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 rounded p-1"
                  role="listitem"
                  tabIndex={0}
                  aria-label={`Trending: ${post.title}`}
                >
                  {/* ✅ Lazy loading + WebP fallback */}
                  <img 
                    src={post.image} 
                    alt={post.title}
                    loading="lazy"
                    className="w-16 h-16 rounded object-cover shrink-0 border dark:border-neutral-800"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=100&q=80';
                    }}
                  />
                  <div className="flex flex-col gap-1">
                    <h4 className={`text-xs font-bold leading-tight line-clamp-2 transition-colors ${
                      darkMode ? 'text-white group-hover:text-sky-400' : 'text-black group-hover:text-sky-600'
                    }`}>
                      {post.title}
                    </h4>
                    <span className="text-[10px] text-gray-400">{post.date}</span>
                    {category && (
                      <span className="text-[9px] text-sky-600 dark:text-sky-400 font-bold uppercase tracking-wider">
                        {category.name}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </aside>
  );
}