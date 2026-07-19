import React, { useState } from 'react';
import { FolderOpen, Flame, HelpCircle, Edit3, Plus, Trash2, Check, X, ShieldAlert } from 'lucide-react';
import vishesh from '../assets/vishes.jpeg'

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

  // Get post counts per category
  const getCategoryCount = (catId) => {
    return posts.filter(post => post.categoryId === catId).length;
  };

  // Filter trending posts
  const trendingPosts = posts.filter(post => post.isTrending);

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

  return (
    <aside className="w-full flex flex-col gap-6 font-sans">
      {/* 3. Category Count list */}
      <div className={`p-5 rounded-lg shadow-sm border ${
        darkMode ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-slate-200'
      }`}>
        <div className="border-b-2 border-slate-900 dark:border-neutral-700 pb-2 mb-4 flex items-center justify-between">
          <h3 className={`text-xs font-black uppercase tracking-wider flex items-center gap-1.5 ${
            darkMode ? 'text-white' : 'text-black'
          }`}>
            <FolderOpen className="w-3.5 h-3.5" />
            <span>Categories</span>
          </h3>
        </div>
        <div className="flex flex-col divide-y divide-gray-100 dark:divide-neutral-800">
          {categories.map((cat) => {
            const count = getCategoryCount(cat.id);
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`py-2.5 text-left text-[11px] font-bold uppercase tracking-wider flex justify-between items-center group transition-colors ${
                  darkMode ? 'text-gray-300 hover:text-sky-400' : 'text-gray-700 hover:text-sky-600'
                }`}
              >
                <span>{cat.name}</span>
                <span className={`px-2 py-0.5 rounded text-[10px] ${
                  darkMode ? 'bg-neutral-800 text-gray-400' : 'bg-slate-100 text-gray-600'
                } group-hover:bg-sky-600 group-hover:text-white transition-all`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Trending Posts Widget */}
      <div className={`p-5 rounded-lg shadow-sm border ${
        darkMode ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-slate-200'
      }`}>
        <div className="border-b-2 border-slate-900 dark:border-neutral-700 pb-2 mb-4">
          <h3 className={`text-xs font-black uppercase tracking-wider flex items-center gap-1.5 ${
            darkMode ? 'text-white' : 'text-black'
          }`}>
            <Flame className="w-3.5 h-3.5" />
            <span>Trending Tutorials</span>
          </h3>
        </div>

        {trendingPosts.length === 0 ? (
          <p className="text-xs text-gray-400">No trending posts marked.</p>
        ) : (
          <div className="flex flex-col gap-4">
            {trendingPosts.map((post) => (
              <div 
                key={post.id} 
                onClick={() => onSelectPost(post.id)}
                className="flex items-start gap-3 cursor-pointer group"
              >
                <img 
                  src={post.image} 
                  alt={post.title} 
                  className="w-16 h-16 rounded object-cover shrink-0 border dark:border-neutral-800"
                />
                <div className="flex flex-col gap-1">
                  <h4 className={`text-xs font-bold leading-tight line-clamp-2 transition-colors ${
                    darkMode ? 'text-white group-hover:text-sky-400' : 'text-black group-hover:text-sky-600'
                  }`}>
                    {post.title}
                  </h4>
                  <span className="text-[10px] text-gray-400">{post.date}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </aside>
  );
}