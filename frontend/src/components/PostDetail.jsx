import React, { useState, useMemo, useEffect } from "react";
import {
  Calendar,
  User,
  MessageSquare,
  Copy,
  Check,
  ExternalLink,
  ArrowLeft,
  Tag,
  Send,
} from "lucide-react";

export default function PostDetail({
  post,
  categories,
  allPosts,
  darkMode,
  onBack,
  onSelectPost,
  onSelectCategory,
  onEdit,
  onDelete,
  onAddComment,
}) {
  const [copiedItems, setCopiedItems] = useState({});

  // Comments form states
  const [commentAuthor, setCommentAuthor] = useState("");
  const [commentEmail, setCommentEmail] = useState("");
  const [commentContent, setCommentContent] = useState("");
  const [commentSuccess, setCommentSuccess] = useState(false);

  // ✅ useMemo - Related posts cache (performance)
  const relatedPosts = useMemo(() => {
    const filtered = allPosts
      .filter((p) => p.categoryId === post.categoryId && p.id !== post.id)
      .slice(0, 3);
    
    if (filtered.length > 0) return filtered;
    return allPosts.filter((p) => p.id !== post.id).slice(0, 3);
  }, [allPosts, post.categoryId, post.id]);

  const getCategoryName = (catId) => {
    return categories.find((c) => c.id === catId)?.name || "Uncategorized";
  };

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedItems({ ...copiedItems, [id]: true });
    setTimeout(() => setCopiedItems({ ...copiedItems, [id]: false }), 2000);
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!commentAuthor.trim() || !commentEmail.trim() || !commentContent.trim())
      return;

    onAddComment(post.id, {
      author: commentAuthor.trim(),
      email: commentEmail.trim(),
      content: commentContent.trim(),
    });

    setCommentContent("");
    setCommentSuccess(true);
    setTimeout(() => setCommentSuccess(false), 3000);
  };

  // ✅ Keyboard accessibility for related posts
  const handleKeyDown = (e, postId) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onSelectPost(postId);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // ✅ Render Photo Section - with lazy loading
  const renderPhotoSection = () => {
    const hasMultipleImages = post.photoItems && post.photoItems.length > 0;
    const items = hasMultipleImages ? post.photoItems : (post.photoPrompt ? [{ 
      image: post.photoStepImage, 
      prompt: post.photoPrompt,
      title: post.photoStepTitle || "Step 1: Generate Photo"
    }] : []);

    if (items.length === 0) return null;

    return (
      <div className={`border ${darkMode ? 'border-neutral-800' : 'border-slate-200'}`}>
        <div className="p-4 sm:p-5 flex items-center justify-center flex-col">
          <p className="font-bold text-xs uppercase text-sky-600 dark:text-sky-400 mb-3">
            {post.photoStepTitle || "Steps to Generate Photos"}
          </p>
          
          <div className="w-full flex flex-col gap-6">
            {items.map((item, index) => (
              <div key={index} className="flex flex-col gap-3">
                {/* ✅ Lazy loading on images */}
                <div className="w-full">
                  <div className="relative w-full" style={{ paddingBottom: '55%', minHeight: '200px' }}>
                    <img
                      src={item.image}
                      alt={item.title || `Photo ${index + 1}`}
                      loading="lazy"
                      className="absolute inset-0 m-auto h-full object-cover"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80';
                      }}
                    />
                  </div>
                  <p className="text-[10px] font-medium text-gray-500 dark:text-gray-400 text-center mt-1">
                    {item.title || `Photo ${index + 1}`}
                  </p>
                </div>

                <div className={`border p-3 sm:p-4 relative ${
                  darkMode ? 'border-neutral-700 bg-neutral-800/50' : 'border-slate-200 bg-slate-50'
                }`}>
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-2">
                    <p className={`text-xs sm:text-sm font-medium ${
                      darkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      <span className="font-bold text-sky-600 dark:text-sky-400">
                        PROMPT {index + 1} :
                      </span>{" "}
                      {item.prompt}
                    </p>
                    <button
                      onClick={() => copyToClipboard(item.prompt, `photo-${index}`)}
                      className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 transition-colors text-xs font-medium focus:outline-none focus:ring-2 focus:ring-sky-500 rounded ${
                        copiedItems[`photo-${index}`]
                          ? "bg-green-600 text-white"
                          : darkMode
                          ? "bg-neutral-700 text-gray-300 hover:bg-neutral-600"
                          : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                      }`}
                      title="Copy Prompt"
                      aria-label={`Copy prompt ${index + 1}`}
                    >
                      {copiedItems[`photo-${index}`] ? (
                        <>
                          <Check className="w-3.5 h-3.5" aria-hidden="true" />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {index < items.length - 1 && (
                  <div className={`border-t ${darkMode ? 'border-neutral-800' : 'border-slate-200'} my-2`}></div>
                )}
              </div>
            ))}
          </div>

          {post.photoBtnLink && (
            <div className="mt-6 w-full flex justify-start">
              <a
                href={post.photoBtnLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs uppercase px-5 py-2.5 transition-colors m-auto rounded focus:outline-none focus:ring-2 focus:ring-sky-500"
                aria-label={`Create your images (opens in new tab)`}
              >
                <span>{post.photoBtnText || "Create Your Images"}</span>
                <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
              </a>
            </div>
          )}
        </div>
      </div>
    );
  };

  // ✅ Render Video Section - with lazy loading
  const renderVideoSection = () => {
    if (!post.videoPrompt) return null;

    return (
      <div className={`border ${darkMode ? 'border-neutral-800' : 'border-slate-200'}`}>
        <div className="p-4 sm:p-5 flex items-center justify-center flex-col">
          <p className="font-bold text-xs uppercase text-sky-600 dark:text-sky-400 mb-3">
            {post.videoStepTitle || "Step 2: Create Video"}
          </p>
          
          <div className="w-full mb-4">
            <div className="relative w-full" style={{ paddingBottom: '65%', minHeight: '220px' }}>
              <img
                src={post.videoStepImage}
                alt="Step video"
                loading="lazy"
                className="absolute inset-0 m-auto h-full object-cover"
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80';
                }}
              />
            </div>
          </div>

          <div className={`border p-3 sm:p-4 relative ${
            darkMode ? 'border-neutral-700 bg-neutral-800/50' : 'border-slate-200 bg-slate-50'
          }`}>
            <div className="flex flex-col sm:flex-row justify-between items-start gap-2">
              <p className={`text-xs sm:text-sm font-medium ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                <span className="font-bold text-green-600 dark:text-green-400">VIDEO PROMPT :</span>{" "}
                {post.videoPrompt}
              </p>
              <button
                onClick={() => copyToClipboard(post.videoPrompt, "video")}
                className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 transition-colors text-xs font-medium focus:outline-none focus:ring-2 focus:ring-sky-500 rounded ${
                  copiedItems["video"]
                    ? "bg-green-600 text-white"
                    : darkMode
                    ? "bg-neutral-700 text-gray-300 hover:bg-neutral-600"
                    : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                }`}
                title="Copy Prompt"
                aria-label="Copy video prompt"
              >
                {copiedItems["video"] ? (
                  <>
                    <Check className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {post.videoBtnLink && (
            <div className="mt-4">
              <a
                href={post.videoBtnLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold text-xs uppercase px-5 py-2.5 transition-colors rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                aria-label={`Create your video (opens in new tab)`}
              >
                <span>{post.videoBtnText || "Create Your Video"}</span>
                <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
              </a>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full font-sans">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="mb-4 inline-flex items-center gap-1.5 text-xs font-bold text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 transition-colors focus:outline-none focus:ring-2 focus:ring-sky-500 rounded px-2 py-1"
        aria-label="Back to tutorials list"
      >
        <ArrowLeft className="w-4 h-4" aria-hidden="true" />
        <span>Back to Tutorials list</span>
      </button>

      {/* ✅ Main Article - with article schema */}
      <article
        className={`border-b ${
          darkMode
            ? "bg-neutral-900 border-neutral-800"
            : "bg-white border-slate-200"
        }`}
        itemScope
        itemType="https://schema.org/Article"
      >
        {/* Banner Image */}
        <div className="relative w-full overflow-hidden bg-gray-100 dark:bg-neutral-800">
          <div className="relative w-full" style={{ paddingBottom: '65%', minHeight: '220px' }}>
            <img
              src={post.image}
              alt={post.title}
              loading="lazy"
              className="absolute inset-0 m-auto h-full "
              onError={(e) => {
                e.target.src = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80';
              }}
            />
          </div>
          <span
            onClick={() => onSelectCategory(post.categoryId)}
            className="absolute bottom-4 left-4 bg-sky-600 dark:bg-sky-500 text-white text-[10px] font-bold tracking-wider uppercase px-3 py-1.5 hover:bg-sky-700 transition-colors cursor-pointer z-10 rounded"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onSelectCategory(post.categoryId);
              }
            }}
          >
            {getCategoryName(post.categoryId)}
          </span>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-5 md:p-6 pt-5 sm:pt-6 md:pt-7 flex flex-col gap-4 sm:gap-5 md:gap-6">
          {/* ✅ Header with Schema */}
          <div>
            <h1 className={`text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-black leading-tight ${
              darkMode ? 'text-white' : 'text-black'
            }`} itemProp="headline">
              {post.title}
            </h1>

            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] sm:text-[11px] font-medium text-gray-500 dark:text-gray-400 mt-3 pb-4 border-b border-slate-100 dark:border-neutral-800">
              <span className="flex items-center gap-1" itemProp="datePublished">
                <Calendar className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-sky-600" aria-hidden="true" />
                <span>{post.date}</span>
              </span>
              <span className="flex items-center gap-1" itemProp="author">
                <User className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-sky-600" aria-hidden="true" />
                <span className="hidden sm:inline">By </span>{post.author}
              </span>
              <span className="flex items-center gap-1">
                <MessageSquare className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-sky-600" aria-hidden="true" />
                <span>
                  {post.comments.length} {post.comments.length !== 1 ? "Comments" : "Comment"}
                </span>
              </span>
            </div>
          </div>

          {/* Introduction */}
          <div>
            <h2 className={`text-xs font-black uppercase tracking-widest border-b-2 pb-1.5 mb-3 inline-block ${
              darkMode ? 'text-white border-neutral-700' : 'text-black border-black'
            }`}>
              Introduction
            </h2>
            <p className={`text-xs sm:text-sm leading-relaxed whitespace-pre-wrap ${
              darkMode ? 'text-gray-300' : 'text-gray-700'
            }`} itemProp="description">
              {post.introduction}
            </p>
          </div>

          {/* Why Trending */}
          {post.whyTrending && (
            <div>
              <h2 className={`text-xs font-black uppercase tracking-widest border-b-2 pb-1.5 mb-3 inline-block ${
                darkMode ? 'text-white border-neutral-700' : 'text-black border-black'
              }`}>
                Why are these trending?
              </h2>
              <p className={`text-xs sm:text-sm leading-relaxed whitespace-pre-wrap ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                {post.whyTrending}
              </p>
            </div>
          )}

          {/* Creation Guide Intro */}
          {post.creationIntro && (
            <div>
              <h2 className={`text-xs font-black uppercase tracking-widest border-b-2 pb-1.5 mb-3 inline-block ${
                darkMode ? 'text-white border-neutral-700' : 'text-black border-black'
              }`}>
                How to Create the AI Video
              </h2>
              <p className={`text-xs sm:text-sm leading-relaxed whitespace-pre-wrap ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                {post.creationIntro}
              </p>
            </div>
          )}

          {/* Steps */}
          {post.steps && post.steps.length > 0 && (
            <div>
              <h2 className={`text-xs font-black uppercase tracking-widest border-b-2 pb-1.5 mb-3 inline-block ${
                darkMode ? 'text-white border-neutral-700' : 'text-black border-black'
              }`}>
                Steps to Create
              </h2>
              <div className="flex flex-col gap-3">
                {post.steps.map((step, idx) => (
                  <div key={idx} className={`p-4 border ${
                    darkMode ? 'border-neutral-800' : 'border-slate-200'
                  } rounded`}>
                    <p className={`text-xs sm:text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      <span className="font-bold text-sky-600 dark:text-sky-400 mr-2">{idx + 1}.</span>
                      {step}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Photo Section */}
          {renderPhotoSection()}

          {/* Video Section */}
          {renderVideoSection()}

          {/* FAQ */}
          {post.faqs && post.faqs.length > 0 && (
            <div>
              <h2 className={`text-xs font-black uppercase tracking-widest border-b-2 pb-1.5 mb-4 inline-block ${
                darkMode ? 'text-white border-neutral-700' : 'text-black border-black'
              }`}>
                FAQ
              </h2>
              <div className="flex flex-col gap-4">
                {post.faqs.map((faq, idx) => (
                  <div
                    key={faq.id || idx}
                    className={`p-4 border ${
                      darkMode ? "border-neutral-800" : "border-slate-200"
                    } rounded`}
                    itemScope
                    itemProp="mainEntity"
                    itemType="https://schema.org/Question"
                  >
                    <h4 className={`font-bold text-xs sm:text-sm flex items-start gap-2 ${
                      darkMode ? 'text-white' : 'text-black'
                    }`} itemProp="name">
                      <span className="text-sky-600 dark:text-sky-400 font-black">
                        {idx + 1}.
                      </span>
                      <span>{faq.question}</span>
                    </h4>
                    <p className={`text-xs sm:text-sm mt-2 pl-5 leading-relaxed ${
                      darkMode ? 'text-gray-300' : 'text-gray-700'
                    }`} itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
                      <span itemProp="text">{faq.answer}</span>
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Conclusion */}
          {post.conclusion && (
            <div>
              <h2 className={`text-xs font-black uppercase tracking-widest border-b-2 pb-1.5 mb-3 inline-block ${
                darkMode ? 'text-white border-neutral-700' : 'text-black border-black'
              }`}>
                Conclusion
              </h2>
              <p className={`text-xs sm:text-sm leading-relaxed whitespace-pre-wrap ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                {post.conclusion}
              </p>
            </div>
          )}

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="pt-4 border-t border-slate-150 dark:border-neutral-800 flex flex-wrap items-center gap-2">
              <span className={`text-xs font-bold flex items-center gap-1 mr-1 ${
                darkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
                <Tag className="w-3.5 h-3.5" aria-hidden="true" />
                <span>TAGGED:</span>
              </span>
              {post.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className={`text-[10px] font-semibold px-2.5 py-1 ${
                    darkMode ? 'bg-neutral-800 text-gray-300' : 'bg-gray-100 text-gray-700'
                  } rounded`}
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </article>

      {/* Related Posts */}
      <section className="mt-8">
        <h3 className={`text-xs font-black uppercase tracking-widest border-b-2 pb-1.5 mb-4 inline-block ${
          darkMode ? 'text-white border-neutral-700' : 'text-black border-black'
        }`}>
          Related Posts
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {relatedPosts.map((rPost) => (
            <div
              key={rPost.id}
              onClick={() => {
                onSelectPost(rPost.id);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              onKeyDown={(e) => handleKeyDown(e, rPost.id)}
              className={`border cursor-pointer group flex flex-col h-full focus:outline-none focus:ring-2 focus:ring-sky-500 rounded ${
                darkMode
                  ? "bg-neutral-900 border-neutral-800"
                  : "bg-white border-slate-200"
              }`}
              role="button"
              tabIndex={0}
              aria-label={`Read article: ${rPost.title}`}
            >
              <div className="relative w-full" style={{ paddingBottom: '65%', minHeight: '180px' }}>
                <img
                  src={rPost.image}
                  alt={rPost.title}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover rounded-t"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400&q=80';
                  }}
                />
              </div>
              <div className="p-3 sm:p-4 flex-1 flex flex-col gap-2 justify-between">
                <div>
                  <h4 className={`text-xs font-bold leading-snug line-clamp-2 transition-colors ${
                    darkMode ? 'text-white group-hover:text-sky-400' : 'text-black group-hover:text-sky-600'
                  }`}>
                    {rPost.title}
                  </h4>
                  <p className={`text-[10px] mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {rPost.date} | By {rPost.author}
                  </p>
                </div>
                <span className="text-[10px] font-bold text-sky-600 dark:text-sky-400 uppercase tracking-wider group-hover:underline mt-2 inline-block">
                  Read Article &rarr;
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Comments Section */}
      <section
        className={`mt-8 p-4 sm:p-6 md:p-8 border ${
          darkMode
            ? "bg-neutral-900 border-neutral-800"
            : "bg-white border-slate-200"
        } rounded`}
        aria-label="Comments section"
      >
        <h3 className={`text-base font-black uppercase tracking-wide mb-6 ${
          darkMode ? 'text-white' : 'text-black'
        }`}>
          Leave a Reply
        </h3>

        {post.comments.length > 0 && (
          <div className="mb-8 flex flex-col gap-4">
            <h4 className={`text-xs font-bold uppercase tracking-widest border-b pb-2 ${
              darkMode ? 'text-white border-neutral-700' : 'text-black border-gray-200'
            }`}>
              Community Comments ({post.comments.length})
            </h4>
            <div className="flex flex-col gap-4 max-h-96 overflow-y-auto pr-1">
              {post.comments.map((comm) => (
                <div
                  key={comm.id}
                  className={`p-4 text-xs leading-relaxed ${
                    darkMode
                      ? "bg-neutral-800 text-gray-300"
                      : "bg-gray-50 text-gray-700"
                  } rounded`}
                >
                  <div className={`flex justify-between items-center mb-1 font-bold ${
                    darkMode ? 'text-white' : 'text-black'
                  }`}>
                    <span>{comm.author}</span>
                    <span className="text-[10px] text-gray-400 font-normal">
                      {comm.date}
                    </span>
                  </div>
                  <p className="whitespace-pre-wrap">{comm.content}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <form onSubmit={handleCommentSubmit} className="flex flex-col gap-4">
          <p className="text-[11px] text-gray-400">
            Your email address will not be published. Required fields are marked *
          </p>

          <div className="flex flex-col gap-1">
            <label className={`text-xs font-bold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`} htmlFor="comment">
              Comment *
            </label>
            <textarea
              id="comment"
              required
              rows={5}
              value={commentContent}
              onChange={(e) => setCommentContent(e.target.value)}
              placeholder="Type your comment here..."
              className={`w-full text-xs px-3 py-2 border focus:outline-none focus:ring-2 focus:ring-sky-600 rounded ${
                darkMode
                  ? "bg-neutral-800 border-neutral-700 text-white placeholder-gray-400"
                  : "bg-gray-50 border-gray-200 text-black placeholder-gray-400"
              }`}
              aria-label="Comment text"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className={`text-xs font-bold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`} htmlFor="author">
                Name *
              </label>
              <input
                id="author"
                required
                type="text"
                value={commentAuthor}
                onChange={(e) => setCommentAuthor(e.target.value)}
                placeholder="eg. Vishu"
                className={`w-full text-xs px-3 py-2 border focus:outline-none focus:ring-2 focus:ring-sky-600 rounded ${
                  darkMode
                    ? "bg-neutral-800 border-neutral-700 text-white placeholder-gray-400"
                    : "bg-gray-50 border-gray-200 text-black placeholder-gray-400"
                }`}
                aria-label="Your name"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className={`text-xs font-bold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`} htmlFor="email">
                Email *
              </label>
              <input
                id="email"
                required
                type="email"
                value={commentEmail}
                onChange={(e) => setCommentEmail(e.target.value)}
                placeholder="eg. vseditor630@gmail.com"
                className={`w-full text-xs px-3 py-2 border focus:outline-none focus:ring-2 focus:ring-sky-600 rounded ${
                  darkMode
                    ? "bg-neutral-800 border-neutral-700 text-white placeholder-gray-400"
                    : "bg-gray-50 border-gray-200 text-black placeholder-gray-400"
                }`}
                aria-label="Your email address"
              />
            </div>
          </div>

          <div className="flex items-start gap-2 mt-1 select-none">
            <input
              type="checkbox"
              id="save-details"
              defaultChecked
              className="mt-0.5 accent-sky-600 w-4 h-4"
              aria-label="Save my details for next time"
            />
            <label
              htmlFor="save-details"
              className="text-[11px] text-gray-400 cursor-pointer"
            >
              Save my name, email, and website in this browser for the next time I comment.
            </label>
          </div>

          {commentSuccess && (
            <div className="p-3 bg-green-500/15 border border-green-500 text-green-600 dark:text-green-400 text-xs font-bold rounded">
              Comment posted successfully!
            </div>
          )}

          <button
            type="submit"
            className="self-start inline-flex items-center gap-1.5 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs uppercase px-6 py-3 transition-colors cursor-pointer rounded focus:outline-none focus:ring-2 focus:ring-sky-500"
            aria-label="Post comment"
          >
            <Send className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Post Comment</span>
          </button>
        </form>
      </section>
    </div>
  );
}