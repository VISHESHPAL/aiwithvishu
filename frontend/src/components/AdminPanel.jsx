import React, { useState, useEffect } from 'react';
import { X, Check, Plus, Trash2, HelpCircle, FileText, Sparkles, Image as ImageIcon, Video, HelpCircle as HelpIcon } from 'lucide-react';

export default function AdminPanel({
  post,
  categories,
  darkMode,
  onSave,
  onClose
}) {
  const [activeFormTab, setActiveFormTab] = useState('general');

  // Form Fields
  const [title, setTitle] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [image, setImage] = useState('');
  const [author, setAuthor] = useState('Vishu');
  const [introduction, setIntroduction] = useState('');
  const [whyTrending, setWhyTrending] = useState('');
  const [creationIntro, setCreationIntro] = useState('');
  
  // Photo step
  const [photoStepTitle, setPhotoStepTitle] = useState('Steps to Create Photo :');
  const [photoStepImage, setPhotoStepImage] = useState('');
  const [photoPrompt, setPhotoPrompt] = useState('');
  const [photoBtnText, setPhotoBtnText] = useState('Create Your Image');
  const [photoBtnLink, setPhotoBtnLink] = useState('https://images.google.com/');

  // Video step
  const [videoStepTitle, setVideoStepTitle] = useState('Steps to Make Video :');
  const [videoStepImage, setVideoStepImage] = useState('');
  const [videoPrompt, setVideoPrompt] = useState('');
  const [videoBtnText, setVideoBtnText] = useState('Create Your Video');
  const [videoBtnLink, setVideoBtnLink] = useState('https://runwayml.com/');

  // FAQ states
  const [faqs, setFaqs] = useState([]);
  const [newFaqQuestion, setNewFaqQuestion] = useState('');
  const [newFaqAnswer, setNewFaqAnswer] = useState('');

  const [conclusion, setConclusion] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [isTrending, setIsTrending] = useState(false);

  // Initialize fields on load or post change
  useEffect(() => {
    if (post) {
      setTitle(post.title);
      setCategoryId(post.categoryId);
      setImage(post.image);
      setAuthor(post.author);
      setIntroduction(post.introduction);
      setWhyTrending(post.whyTrending || '');
      setCreationIntro(post.creationIntro || '');
      setPhotoStepTitle(post.photoStepTitle || 'Steps to Create Photo :');
      setPhotoStepImage(post.photoStepImage || '');
      setPhotoPrompt(post.photoPrompt || '');
      setPhotoBtnText(post.photoBtnText || 'Create Your Image');
      setPhotoBtnLink(post.photoBtnLink || '');
      setVideoStepTitle(post.videoStepTitle || 'Steps to Make Video :');
      setVideoStepImage(post.videoStepImage || '');
      setVideoPrompt(post.videoPrompt || '');
      setVideoBtnText(post.videoBtnText || 'Create Your Video');
      setVideoBtnLink(post.videoBtnLink || '');
      setFaqs(post.faqs || []);
      setConclusion(post.conclusion || '');
      setTagsInput(post.tags ? post.tags.join(', ') : '');
      setIsTrending(post.isTrending || false);
    } else {
      // Clear fields for new post
      setTitle('');
      setCategoryId(categories[0]?.id || '');
      setImage('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80');
      setAuthor('Vishu');
      setIntroduction('');
      setWhyTrending('');
      setCreationIntro('');
      setPhotoStepTitle('Steps to Create Photo :');
      setPhotoStepImage('https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&w=800&q=80');
      setPhotoPrompt('');
      setPhotoBtnText('Create Your Image');
      setPhotoBtnLink('https://images.google.com/');
      setVideoStepTitle('Steps to Make Video :');
      setVideoStepImage('https://images.unsplash.com/photo-1536240478700-b869070f9279?auto=format&fit=crop&w=800&q=80');
      setVideoPrompt('');
      setVideoBtnText('Create Your Video');
      setVideoBtnLink('https://runwayml.com/');
      setFaqs([]);
      setConclusion('');
      setTagsInput('');
      setIsTrending(false);
    }
  }, [post, categories]);

  const handleAddFaq = (e) => {
    e.preventDefault();
    if (!newFaqQuestion.trim() || !newFaqAnswer.trim()) return;
    const newFaq = {
      id: 'faq-' + Date.now(),
      question: newFaqQuestion.trim(),
      answer: newFaqAnswer.trim()
    };
    setFaqs([...faqs, newFaq]);
    setNewFaqQuestion('');
    setNewFaqAnswer('');
  };

  const handleRemoveFaq = (faqId) => {
    setFaqs(faqs.filter(f => f.id !== faqId));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !categoryId) {
      alert('Title and Category are required!');
      return;
    }

    const processedTags = tagsInput
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0);

    const savedPost = {
      id: post ? post.id : 'post-' + Date.now(),
      title: title.trim(),
      categoryId,
      image: image.trim() || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
      date: post ? post.date : new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      author: author.trim() || 'Vishu',
      introduction: introduction.trim(),
      whyTrending: whyTrending.trim(),
      creationIntro: creationIntro.trim(),
      photoStepTitle: photoStepTitle.trim(),
      photoStepImage: photoStepImage.trim(),
      photoPrompt: photoPrompt.trim(),
      photoBtnText: photoBtnText.trim(),
      photoBtnLink: photoBtnLink.trim(),
      videoStepTitle: videoStepTitle.trim(),
      videoStepImage: videoStepImage.trim(),
      videoPrompt: videoPrompt.trim(),
      videoBtnText: videoBtnText.trim(),
      videoBtnLink: videoBtnLink.trim(),
      faqs,
      conclusion: conclusion.trim(),
      tags: processedTags,
      isTrending,
      comments: post ? post.comments : []
    };

    onSave(savedPost);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className={`w-full max-w-4xl rounded-2xl shadow-2xl border flex flex-col max-h-[90vh] overflow-hidden ${
        darkMode ? 'bg-neutral-900 border-neutral-800 text-white' : 'bg-white border-slate-200 text-gray-800'
      }`}>
        
        {/* Modal Header */}
        <div className="p-4 md:p-6 border-b border-slate-100 dark:border-neutral-800 flex justify-between items-center bg-slate-900 text-white">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-sky-400" />
            <h2 className="text-base md:text-lg font-black tracking-widest uppercase">
              {post ? 'Edit Tutorial Post' : 'Create New Tutorial Post'}
            </h2>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 hover:bg-slate-800 rounded-sm transition-colors text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Tabs Nav */}
        <div className="flex overflow-x-auto bg-gray-50 dark:bg-neutral-800/50 border-b border-slate-100 dark:border-neutral-800">
          <button
            onClick={() => setActiveFormTab('general')}
            className={`px-4 py-3 text-xs font-bold uppercase tracking-wider shrink-0 transition-all border-b-2 flex items-center gap-1.5 ${
              activeFormTab === 'general' 
                ? 'border-sky-600 text-sky-600 dark:text-sky-400 bg-white dark:bg-neutral-900' 
                : 'border-transparent text-gray-400 hover:text-gray-600'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>1. General</span>
          </button>
          <button
            onClick={() => setActiveFormTab('intro')}
            className={`px-4 py-3 text-xs font-bold uppercase tracking-wider shrink-0 transition-all border-b-2 flex items-center gap-1.5 ${
              activeFormTab === 'intro' 
                ? 'border-sky-600 text-sky-600 dark:text-sky-400 bg-white dark:bg-neutral-900' 
                : 'border-transparent text-gray-400 hover:text-gray-600'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>2. Introduction</span>
          </button>
          <button
            onClick={() => setActiveFormTab('photo')}
            className={`px-4 py-3 text-xs font-bold uppercase tracking-wider shrink-0 transition-all border-b-2 flex items-center gap-1.5 ${
              activeFormTab === 'photo' 
                ? 'border-sky-600 text-sky-600 dark:text-sky-400 bg-white dark:bg-neutral-900' 
                : 'border-transparent text-gray-400 hover:text-gray-600'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>3. Photo Steps</span>
          </button>
          <button
            onClick={() => setActiveFormTab('video')}
            className={`px-4 py-3 text-xs font-bold uppercase tracking-wider shrink-0 transition-all border-b-2 flex items-center gap-1.5 ${
              activeFormTab === 'video' 
                ? 'border-sky-600 text-sky-600 dark:text-sky-400 bg-white dark:bg-neutral-900' 
                : 'border-transparent text-gray-400 hover:text-gray-600'
            }`}
          >
            <Video className="w-3.5 h-3.5" />
            <span>4. Video Steps</span>
          </button>
          <button
            onClick={() => setActiveFormTab('faqs')}
            className={`px-4 py-3 text-xs font-bold uppercase tracking-wider shrink-0 transition-all border-b-2 flex items-center gap-1.5 ${
              activeFormTab === 'faqs' 
                ? 'border-sky-600 text-sky-600 dark:text-sky-400 bg-white dark:bg-neutral-900' 
                : 'border-transparent text-gray-400 hover:text-gray-600'
            }`}
          >
            <HelpIcon className="w-3.5 h-3.5" />
            <span>5. FAQs & Conclusion</span>
          </button>
        </div>

        {/* Modal Body / Tab Content */}
        <form onSubmit={handleFormSubmit} className="flex-1 overflow-y-auto p-6 flex flex-col gap-5 text-xs md:text-sm">
          
          {/* TAB 1: GENERAL INFO */}
          {activeFormTab === 'general' && (
            <div className="flex flex-col gap-4 animate-fadeIn">
              <div className="flex flex-col gap-1">
                <label className="font-bold text-gray-500">Tutorial Title *</label>
                <input
                  required
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="eg. Motu Patlu City Explore AI Video Editing Tutorial"
                  className={`w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-1 focus:ring-sky-600 ${
                    darkMode ? 'bg-neutral-800 border-neutral-700 text-white' : 'bg-gray-50 border-gray-200'
                  }`}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="font-bold text-gray-500">Category *</label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className={`w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-1 focus:ring-sky-600 ${
                      darkMode ? 'bg-neutral-800 border-neutral-700 text-white' : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="font-bold text-gray-500">Author Name</label>
                  <input
                    type="text"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    placeholder="Vishu"
                    className={`w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-1 focus:ring-sky-600 ${
                      darkMode ? 'bg-neutral-800 border-neutral-700 text-white' : 'bg-gray-50 border-gray-200'
                    }`}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-bold text-gray-500">Main Tutorial Cover Image URL</label>
                <input
                  type="text"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="https://images.unsplash.com/photo-..."
                  className={`w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-1 focus:ring-sky-600 ${
                    darkMode ? 'bg-neutral-800 border-neutral-700 text-white' : 'bg-gray-50 border-gray-200'
                  }`}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                <div className="flex flex-col gap-1">
                  <label className="font-bold text-gray-500">Tags (separated by commas)</label>
                  <input
                    type="text"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    placeholder="AI Video, Capcut Trend, Motu Patlu"
                    className={`w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-1 focus:ring-sky-600 ${
                      darkMode ? 'bg-neutral-800 border-neutral-700 text-white' : 'bg-gray-50 border-gray-200'
                    }`}
                  />
                </div>

                <div className="flex items-center gap-2 h-full mt-5 select-none">
                  <input
                    type="checkbox"
                    id="is-trending-checkbox"
                    checked={isTrending}
                    onChange={(e) => setIsTrending(e.target.checked)}
                    className="w-4 h-4 rounded accent-sky-600 cursor-pointer"
                  />
                  <label htmlFor="is-trending-checkbox" className="font-bold text-gray-500 cursor-pointer">
                    Show as Trending Post on Homepage
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: INTRODUCTION & WHY TRENDING */}
          {activeFormTab === 'intro' && (
            <div className="flex flex-col gap-4 animate-fadeIn">
              <div className="flex flex-col gap-1">
                <label className="font-bold text-gray-500">Introduction Paragraphs *</label>
                <textarea
                  required
                  rows={6}
                  value={introduction}
                  onChange={(e) => setIntroduction(e.target.value)}
                  placeholder="Friends, you all use social media and every day some trend or the other keeps going on..."
                  className={`w-full p-3 rounded-lg border focus:outline-none focus:ring-1 focus:ring-sky-600 ${
                    darkMode ? 'bg-neutral-800 border-neutral-700 text-white' : 'bg-gray-50 border-gray-200'
                  }`}
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-bold text-gray-500">Why are these Trending? (Explain the viral factor)</label>
                <textarea
                  rows={4}
                  value={whyTrending}
                  onChange={(e) => setWhyTrending(e.target.value)}
                  placeholder="Motu Patlu City Explore video is so viral because..."
                  className={`w-full p-3 rounded-lg border focus:outline-none focus:ring-1 focus:ring-sky-600 ${
                    darkMode ? 'bg-neutral-800 border-neutral-700 text-white' : 'bg-gray-50 border-gray-200'
                  }`}
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-bold text-gray-500">Creation Guide Outline Intro (Step explanation intro)</label>
                <textarea
                  rows={3}
                  value={creationIntro}
                  onChange={(e) => setCreationIntro(e.target.value)}
                  placeholder="Making a Motu Patlu city explore ai video is very easy, you will be able to..."
                  className={`w-full p-3 rounded-lg border focus:outline-none focus:ring-1 focus:ring-sky-600 ${
                    darkMode ? 'bg-neutral-800 border-neutral-700 text-white' : 'bg-gray-50 border-gray-200'
                  }`}
                />
              </div>
            </div>
          )}

          {/* TAB 3: PHOTO GENERATION STEP */}
          {activeFormTab === 'photo' && (
            <div className="flex flex-col gap-4 animate-fadeIn">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="font-bold text-gray-500">Photo Step Header Text</label>
                  <input
                    type="text"
                    value={photoStepTitle}
                    onChange={(e) => setPhotoStepTitle(e.target.value)}
                    placeholder="Steps to Create Photo :"
                    className={`w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-1 focus:ring-sky-600 ${
                      darkMode ? 'bg-neutral-800 border-neutral-700 text-white' : 'bg-gray-50 border-gray-200'
                    }`}
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="font-bold text-gray-500">Photo Step Illustration Image URL</label>
                  <input
                    type="text"
                    value={photoStepImage}
                    onChange={(e) => setPhotoStepImage(e.target.value)}
                    placeholder="https://images.unsplash.com/photo-..."
                    className={`w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-1 focus:ring-sky-600 ${
                      darkMode ? 'bg-neutral-800 border-neutral-700 text-white' : 'bg-gray-50 border-gray-200'
                    }`}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-bold text-sky-600 dark:text-sky-400">Image Prompt text (User can copy this prompt!)</label>
                <textarea
                  rows={4}
                  value={photoPrompt}
                  onChange={(e) => setPhotoPrompt(e.target.value)}
                  placeholder="eg. 3D Pixar style cartoon of Motu and Patlu taking a selfie..."
                  className={`w-full p-3 font-mono rounded-lg border focus:outline-none focus:ring-1 focus:ring-sky-600 ${
                    darkMode ? 'bg-neutral-800 border-neutral-700 text-white' : 'bg-gray-50 border-gray-200'
                  }`}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="font-bold text-gray-500">Creation Button CTA Label</label>
                  <input
                    type="text"
                    value={photoBtnText}
                    onChange={(e) => setPhotoBtnText(e.target.value)}
                    placeholder="Create Your Image"
                    className={`w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-1 focus:ring-sky-600 ${
                      darkMode ? 'bg-neutral-800 border-neutral-700 text-white' : 'bg-gray-50 border-gray-200'
                    }`}
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="font-bold text-gray-500">Creation Button Link (Destination)</label>
                  <input
                    type="text"
                    value={photoBtnLink}
                    onChange={(e) => setPhotoBtnLink(e.target.value)}
                    placeholder="https://images.google.com/ or Bing link"
                    className={`w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-1 focus:ring-sky-600 ${
                      darkMode ? 'bg-neutral-800 border-neutral-700 text-white' : 'bg-gray-50 border-gray-200'
                    }`}
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: VIDEO CREATION STEP */}
          {activeFormTab === 'video' && (
            <div className="flex flex-col gap-4 animate-fadeIn">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="font-bold text-gray-500">Video Step Header Text</label>
                  <input
                    type="text"
                    value={videoStepTitle}
                    onChange={(e) => setVideoStepTitle(e.target.value)}
                    placeholder="Steps to Make Video :"
                    className={`w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-1 focus:ring-sky-600 ${
                      darkMode ? 'bg-neutral-800 border-neutral-700 text-white' : 'bg-gray-50 border-gray-200'
                    }`}
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="font-bold text-gray-500">Video Step Illustration Image URL</label>
                  <input
                    type="text"
                    value={videoStepImage}
                    onChange={(e) => setVideoStepImage(e.target.value)}
                    placeholder="https://images.unsplash.com/photo-..."
                    className={`w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-1 focus:ring-sky-600 ${
                      darkMode ? 'bg-neutral-800 border-neutral-700 text-white' : 'bg-gray-50 border-gray-200'
                    }`}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-bold text-green-600 dark:text-green-400">Video Motion Prompt (User can copy this prompt!)</label>
                <textarea
                  rows={4}
                  value={videoPrompt}
                  onChange={(e) => setVideoPrompt(e.target.value)}
                  placeholder="eg. Animate this image: Motu is smiling and waving his hand, Patlu is..."
                  className={`w-full p-3 font-mono rounded-lg border focus:outline-none focus:ring-1 focus:ring-green-500 ${
                    darkMode ? 'bg-neutral-800 border-neutral-700 text-white' : 'bg-gray-50 border-gray-200'
                  }`}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="font-bold text-gray-500">Creation Button CTA Label</label>
                  <input
                    type="text"
                    value={videoBtnText}
                    onChange={(e) => setVideoBtnText(e.target.value)}
                    placeholder="Create Your Video"
                    className={`w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-1 focus:ring-green-500 ${
                      darkMode ? 'bg-neutral-800 border-neutral-700 text-white' : 'bg-gray-50 border-gray-200'
                    }`}
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="font-bold text-gray-500">Creation Button Link (Destination)</label>
                  <input
                    type="text"
                    value={videoBtnLink}
                    onChange={(e) => setVideoBtnLink(e.target.value)}
                    placeholder="https://runwayml.com/ or other tool link"
                    className={`w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-1 focus:ring-green-500 ${
                      darkMode ? 'bg-neutral-800 border-neutral-700 text-white' : 'bg-gray-50 border-gray-200'
                    }`}
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: FAQS & CONCLUSION */}
          {activeFormTab === 'faqs' && (
            <div className="flex flex-col gap-4 animate-fadeIn">
              
              {/* Existing FAQs list */}
              <div className="flex flex-col gap-2">
                <label className="font-bold text-gray-500">Frequently Asked Questions ({faqs.length})</label>
                
                {faqs.length === 0 ? (
                  <p className="text-xs text-gray-400 border border-dashed rounded-lg p-4 text-center">No FAQs added yet.</p>
                ) : (
                  <div className="flex flex-col gap-2 max-h-48 overflow-y-auto border rounded-lg p-2.5 bg-gray-50 dark:bg-neutral-900 dark:border-neutral-800">
                    {faqs.map((faq, idx) => (
                      <div 
                        key={faq.id || idx} 
                        className={`flex items-start justify-between gap-3 p-2.5 rounded text-xs ${
                          darkMode ? 'bg-neutral-800' : 'bg-white'
                        } border dark:border-neutral-700`}
                      >
                        <div className="flex-1">
                          <h5 className="font-bold">{idx + 1}. {faq.question}</h5>
                          <p className="text-gray-500 dark:text-gray-300 mt-1">{faq.answer}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveFaq(faq.id)}
                          className="p-1.5 hover:bg-red-50 text-red-500 rounded-md"
                          title="Delete FAQ"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Add FAQ mini form */}
              <div className={`p-4 rounded-xl border ${
                darkMode ? 'bg-neutral-800/40 border-neutral-800' : 'bg-slate-50 border-slate-200'
              }`}>
                <h5 className="font-bold text-xs uppercase text-sky-600 dark:text-sky-400 mb-3 flex items-center gap-1">
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add a New FAQ Item</span>
                </h5>
                <div className="flex flex-col gap-3">
                  <div className="flex flex-col gap-1">
                    <input
                      type="text"
                      placeholder="Question: eg. Do I need any editing experience?"
                      value={newFaqQuestion}
                      onChange={(e) => setNewFaqQuestion(e.target.value)}
                      className={`w-full px-2.5 py-1.5 rounded border focus:outline-none ${
                        darkMode ? 'bg-neutral-800 border-neutral-700 text-white' : 'bg-white border-gray-200'
                      }`}
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <textarea
                      placeholder="Answer: eg. No. Most AI tools are beginner-friendly..."
                      rows={2}
                      value={newFaqAnswer}
                      onChange={(e) => setNewFaqAnswer(e.target.value)}
                      className={`w-full px-2.5 py-1.5 rounded border focus:outline-none ${
                        darkMode ? 'bg-neutral-800 border-neutral-700 text-white' : 'bg-white border-gray-200'
                      }`}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleAddFaq}
                    className="bg-sky-600 hover:bg-sky-700 text-white px-3.5 py-1.5 rounded-sm font-bold text-xs self-start transition-colors cursor-pointer"
                  >
                    Insert FAQ Item
                  </button>
                </div>
              </div>

              {/* Conclusion field */}
              <div className="flex flex-col gap-1 mt-2">
                <label className="font-bold text-gray-500">Tutorial Conclusion (Wrap-up text) *</label>
                <textarea
                  required
                  rows={5}
                  value={conclusion}
                  onChange={(e) => setConclusion(e.target.value)}
                  placeholder="Creating a Motu Patlu style City Explore AI video is easier than many people think..."
                  className={`w-full p-3 rounded-lg border focus:outline-none focus:ring-1 focus:ring-sky-600 ${
                    darkMode ? 'bg-neutral-800 border-neutral-700 text-white' : 'bg-gray-50 border-gray-200'
                  }`}
                />
              </div>

            </div>
          )}

          {/* Hidden submit trigger */}
          <button type="submit" id="main-admin-form-submit-btn" className="hidden" />
        </form>

        {/* Modal Footer Controls */}
        <div className="p-4 md:p-6 border-t border-slate-100 dark:border-neutral-800 flex justify-between items-center bg-gray-50 dark:bg-neutral-900">
          <div className="flex items-center gap-1.5">
            {activeFormTab !== 'general' && (
              <button
                type="button"
                onClick={() => {
                  if (activeFormTab === 'intro') setActiveFormTab('general');
                  else if (activeFormTab === 'photo') setActiveFormTab('intro');
                  else if (activeFormTab === 'video') setActiveFormTab('photo');
                  else if (activeFormTab === 'faqs') setActiveFormTab('video');
                }}
                className="px-4 py-2 hover:bg-gray-200 dark:hover:bg-neutral-800 rounded-sm text-xs font-bold transition-all text-gray-500 dark:text-gray-300 cursor-pointer"
              >
                &larr; Previous Section
              </button>
            )}

            {activeFormTab !== 'faqs' && (
              <button
                type="button"
                onClick={() => {
                  if (activeFormTab === 'general') setActiveFormTab('intro');
                  else if (activeFormTab === 'intro') setActiveFormTab('photo');
                  else if (activeFormTab === 'photo') setActiveFormTab('video');
                  else if (activeFormTab === 'video') setActiveFormTab('faqs');
                }}
                className="px-4 py-2 bg-sky-50 hover:bg-sky-100 dark:bg-neutral-800 text-sky-600 dark:text-sky-300 rounded-sm text-xs font-bold transition-all cursor-pointer"
              >
                Next Section &rarr;
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 border border-slate-200 dark:border-neutral-800 hover:bg-gray-100 dark:hover:bg-neutral-800 text-gray-500 dark:text-gray-300 rounded-sm text-xs font-bold transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => document.getElementById('main-admin-form-submit-btn')?.click()}
              className="px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-sm text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Save Tutorial Post</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}