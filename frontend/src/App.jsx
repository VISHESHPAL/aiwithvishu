import { useState, useEffect, lazy, Suspense, useMemo } from "react";
import { BrowserRouter, useNavigate, useLocation } from "react-router-dom";
import { ChevronUp, ChevronLeft, ChevronRight } from "lucide-react";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import PostCard from "./components/PostCard";
import { INITIAL_POSTS, INITIAL_CATEGORIES, INITIAL_PAGES, DATA_VERSION } from "./data";

// ✅ Lazy Loading
const PostDetail = lazy(() => import("./components/PostDetail"));
const PageContent = lazy(() => import("./components/PageContent"));

function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();

  // 🔥 POSTS with VERSION CHECK
  const [posts, setPosts] = useState(() => {
    const savedVersion = localStorage.getItem("vishu_data_version");
    const saved = localStorage.getItem("vishu_posts");
    
    if (savedVersion !== DATA_VERSION || !saved) {
      localStorage.setItem("vishu_data_version", DATA_VERSION);
      localStorage.setItem("vishu_posts", JSON.stringify(INITIAL_POSTS));
      return INITIAL_POSTS;
    }
    return JSON.parse(saved);
  });

  // 🔥 CATEGORIES with VERSION CHECK
  const [categories, setCategories] = useState(() => {
    const savedVersion = localStorage.getItem("vishu_data_version");
    const saved = localStorage.getItem("vishu_categories");
    
    if (savedVersion !== DATA_VERSION || !saved) {
      localStorage.setItem("vishu_categories", JSON.stringify(INITIAL_CATEGORIES));
      return INITIAL_CATEGORIES;
    }
    return JSON.parse(saved);
  });

  // 🔥 PAGES with VERSION CHECK
  const [pages, setPages] = useState(() => {
    const savedVersion = localStorage.getItem("vishu_data_version");
    const saved = localStorage.getItem("vishu_pages");
    
    if (savedVersion !== DATA_VERSION || !saved) {
      localStorage.setItem("vishu_pages", JSON.stringify(INITIAL_PAGES));
      return INITIAL_PAGES;
    }
    return JSON.parse(saved);
  });

  const [activeTab, setActiveTab] = useState(() => {
    const saved = localStorage.getItem("vishu_active_tab");
    return saved || "home";
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("vishu_dark_mode") === "true";
  });

  const [editingPost, setEditingPost] = useState(null);
  const [isCreatingPost, setIsCreatingPost] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // ✅ PAGINATION STATE
  const [currentPage, setCurrentPage] = useState(1);
  const POSTS_PER_PAGE = 10;

  // ✅ Scroll debounce
  useEffect(() => {
    let timeoutId;
    const handleScroll = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setShowScrollTop(window.scrollY > 300);
      }, 100);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(timeoutId);
    };
  }, []);

  // ✅ Reset page when category or search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, searchQuery]);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem("vishu_posts", JSON.stringify(posts));
    localStorage.setItem("vishu_data_version", DATA_VERSION);
  }, [posts]);

  useEffect(() => {
    localStorage.setItem("vishu_categories", JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem("vishu_pages", JSON.stringify(pages));
  }, [pages]);

  useEffect(() => {
    localStorage.setItem("vishu_active_tab", activeTab);
  }, [activeTab]);

  useEffect(() => {
    localStorage.setItem("vishu_dark_mode", String(darkMode));
  }, [darkMode]);

  // Helper functions
  const createPostSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const getCategoryBySlug = (slug) => {
    return categories.find(c => c.slug === slug);
  };

  const getPageBySlug = (slug) => {
    return pages.find(p => p.id === slug);
  };

  const getPostBySlugs = (categorySlug, postSlug) => {
    const category = getCategoryBySlug(categorySlug);
    if (!category) return null;
    return posts.find(p => 
      p.categoryId === category.id && 
      createPostSlug(p.title) === postSlug
    );
  };

  // Sync URL with activeTab
  useEffect(() => {
    const path = location.pathname;
    
    if (path === "/") {
      setActiveTab("home");
      return;
    }

    const pathParts = path.split('/').filter(Boolean);
    
    if (pathParts.length === 0) {
      setActiveTab("home");
      return;
    }

    const firstPart = pathParts[0];

    const page = getPageBySlug(firstPart);
    if (page) {
      setActiveTab(`page-${page.id}`);
      return;
    }

    const category = getCategoryBySlug(firstPart);
    if (category) {
      if (pathParts.length === 1) {
        setActiveTab(`cat-${category.id}`);
        return;
      } else if (pathParts.length === 2) {
        const postSlug = pathParts[1];
        const post = getPostBySlugs(firstPart, postSlug);
        if (post) {
          setActiveTab(`post-${post.id}`);
          return;
        }
      }
    }

    setActiveTab("home");
  }, [location.pathname, categories, posts, pages]);

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Navigation functions
  const navigateToHome = () => {
    navigate("/");
    setActiveTab("home");
    setSearchQuery("");
    setCurrentPage(1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const navigateToCategory = (catId) => {
    const category = categories.find(c => c.id === catId);
    if (category) {
      navigate(`/${category.slug}`);
      setActiveTab(`cat-${catId}`);
      setCurrentPage(1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const navigateToPost = (postId) => {
    const post = posts.find(p => p.id === postId);
    if (post) {
      const category = categories.find(c => c.id === post.categoryId);
      if (category) {
        const postSlug = createPostSlug(post.title);
        navigate(`/${category.slug}/${postSlug}`);
        setActiveTab(`post-${postId}`);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  };

  const navigateToPage = (pageId) => {
    navigate(`/${pageId}`);
    setActiveTab(`page-${pageId}`);
    setCurrentPage(1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // FORCE RESET
  const forceResetData = () => {
    if (window.confirm('⚠️ Reset all data to default?')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  // CATEGORY OPERATIONS
  const handleAddCategory = (name) => {
    const newSlug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const newCat = {
      id: "cat-" + Date.now(),
      name,
      slug: newSlug,
    };
    setCategories([...categories, newCat]);
  };

  const handleEditCategory = (id, newName) => {
    const newSlug = newName.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    setCategories(
      categories.map((c) =>
        c.id === id ? { ...c, name: newName, slug: newSlug } : c,
      ),
    );
  };

  const handleDeleteCategory = (id) => {
    setCategories(categories.filter((c) => c.id !== id));
    setPosts(
      posts.map((p) => (p.categoryId === id ? { ...p, categoryId: "" } : p)),
    );
    if (activeTab === `cat-${id}`) {
      navigate("/");
      setActiveTab("home");
    }
  };

  // POST OPERATIONS
  const handleSavePost = (savedPost) => {
    const exists = posts.some((p) => p.id === savedPost.id);
    let updatedPosts;
    if (exists) {
      updatedPosts = posts.map((p) => (p.id === savedPost.id ? savedPost : p));
    } else {
      updatedPosts = [savedPost, ...posts];
    }
    setPosts(updatedPosts);
    setEditingPost(null);
    setIsCreatingPost(false);
    
    const category = categories.find(c => c.id === savedPost.categoryId);
    if (category) {
      const postSlug = createPostSlug(savedPost.title);
      navigate(`/${category.slug}/${postSlug}`);
      setActiveTab(`post-${savedPost.id}`);
    } else {
      navigate("/");
      setActiveTab("home");
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDeletePost = (postId) => {
    setPosts(posts.filter((p) => p.id !== postId));
    if (activeTab === `post-${postId}`) {
      navigate("/");
      setActiveTab("home");
    }
  };

  // PAGE OPERATIONS
  const handleSavePage = (updatedPage) => {
    setPages(pages.map((p) => (p.id === updatedPage.id ? updatedPage : p)));
  };

  // ADD COMMENT
  const handleAddComment = (postId, commentDetails) => {
    const newComment = {
      id: "comm-" + Date.now(),
      author: commentDetails.author,
      email: commentDetails.email,
      content: commentDetails.content,
      date: new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    };

    setPosts(
      posts.map((p) => {
        if (p.id === postId) {
          return {
            ...p,
            comments: [newComment, ...p.comments],
          };
        }
        return p;
      }),
    );
  };

  // FILTER LOGIC
  const getFilteredPosts = () => {
    let result = posts;

    if (activeTab.startsWith("cat-")) {
      const catId = activeTab.replace("cat-", "");
      result = posts.filter((p) => p.categoryId === catId);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(query) ||
          p.introduction.toLowerCase().includes(query) ||
          p.tags.some((t) => t.toLowerCase().includes(query)),
      );
    }

    return result;
  };

  const filteredPosts = getFilteredPosts();
  
  // ✅ PAGINATION CALCULATIONS
  const totalPosts = filteredPosts.length;
  const totalPages = Math.ceil(totalPosts / POSTS_PER_PAGE);
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
  const endIndex = startIndex + POSTS_PER_PAGE;
  const currentPosts = filteredPosts.slice(startIndex, endIndex);

  // ✅ Pagination Handlers
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const goToPage = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Get page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    let start = Math.max(1, currentPage - 2);
    let end = Math.min(totalPages, start + maxVisible - 1);
    
    if (end - start < maxVisible - 1) {
      start = Math.max(1, end - maxVisible + 1);
    }
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  const currentCategory = activeTab.startsWith("cat-")
    ? categories.find((c) => c.id === activeTab.replace("cat-", ""))
    : null;

  const getCurrentPost = () => {
    if (activeTab.startsWith("post-")) {
      const postId = activeTab.replace("post-", "");
      return posts.find(p => p.id === postId);
    }
    return null;
  };

  const currentPost = getCurrentPost();

  const getCurrentPageContent = () => {
    if (activeTab.startsWith("page-")) {
      const pageId = activeTab.replace("page-", "");
      return pages.find(p => p.id === pageId);
    }
    return null;
  };

  const currentPageContent = getCurrentPageContent();

  // Loading component
  const LoadingFallback = () => (
    <div className="flex justify-center items-center py-12">
      <div className="animate-pulse flex flex-col items-center gap-2">
        <div className="w-12 h-12 border-4 border-sky-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm text-gray-500 dark:text-gray-400">Loading...</p>
      </div>
    </div>
  );

  // Render main content
  const renderMainContent = () => {
    // Post Detail View
    if (activeTab.startsWith("post-") && currentPost) {
      return (
        <Suspense fallback={<LoadingFallback />}>
          <PostDetail
            post={currentPost}
            categories={categories}
            allPosts={posts}
            darkMode={darkMode}
            onBack={() => {
              const category = categories.find(c => c.id === currentPost.categoryId);
              if (category) {
                navigate(`/${category.slug}`);
                setActiveTab(`cat-${category.id}`);
                setCurrentPage(1);
              } else {
                navigate("/");
                setActiveTab("home");
              }
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            onSelectPost={navigateToPost}
            onSelectCategory={navigateToCategory}
            onEdit={setEditingPost}
            onDelete={handleDeletePost}
            onAddComment={handleAddComment}
          />
        </Suspense>
      );
    }

    // Post not found
    if (activeTab.startsWith("post-") && !currentPost) {
      return (
        <div className="p-8 text-center bg-white dark:bg-neutral-900 border dark:border-neutral-800">
          <h3 className="font-bold text-lg text-red-500">Tutorial not found!</h3>
          <button
            onClick={() => navigate("/")}
            className="mt-4 px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs cursor-pointer rounded"
          >
            Go Back Home
          </button>
        </div>
      );
    }

    // Page View
    if (activeTab.startsWith("page-") && currentPageContent) {
      return (
        <Suspense fallback={<LoadingFallback />}>
          <PageContent
            page={currentPageContent}
            darkMode={darkMode}
            onSavePage={handleSavePage}
          />
        </Suspense>
      );
    }

    // Page not found
    if (activeTab.startsWith("page-") && !currentPageContent) {
      return (
        <div className="p-8 text-center bg-white dark:bg-neutral-900 border dark:border-neutral-800">
          <h3 className="font-bold text-lg text-red-500">Page not found!</h3>
          <button
            onClick={() => navigate("/")}
            className="mt-4 px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs cursor-pointer rounded"
          >
            Go Back Home
          </button>
        </div>
      );
    }

    // Home/Category View with Pagination
    return (
      <div className="flex flex-col gap-4 sm:gap-6">
        {currentCategory && (
          <div className="p-4 sm:p-5 bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800">
            <p className="text-[10px] font-black uppercase text-sky-600 dark:text-sky-400 tracking-widest">
              Currently Viewing Category
            </p>
            <h2 className="text-lg sm:text-xl md:text-2xl font-black text-gray-900 dark:text-white mt-1">
              {currentCategory.name}
            </h2>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              Find the latest expert level step-by-step video and photo editing
              tutorials for {currentCategory.name}.
            </p>
          </div>
        )}

        {searchQuery.trim() && (
          <div className="p-3 sm:p-4 bg-gray-100 dark:bg-neutral-900 border dark:border-neutral-800 flex flex-wrap justify-between items-center gap-2 text-xs">
            <span className="text-gray-700 dark:text-gray-300 text-[10px] sm:text-xs">
              Showing results for:{" "}
              <strong className="text-sky-600 dark:text-sky-400">
                "{searchQuery}"
              </strong>{" "}
              ({totalPosts} matches)
            </span>
            <button
              onClick={() => setSearchQuery("")}
              className="text-gray-500 hover:text-red-500 font-bold dark:text-gray-400 text-[10px] sm:text-xs"
            >
              Clear Search
            </button>
          </div>
        )}

        {totalPosts === 0 ? (
          <div className="p-8 sm:p-12 text-center bg-white dark:bg-neutral-900 border dark:border-neutral-800 flex flex-col items-center gap-3">
            <p className="text-gray-700 dark:text-gray-300 font-bold text-sm">
              No tutorials match your request.
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Try adjusting your search filters or browse other categories.
            </p>
            <button
              onClick={() => {
                navigate("/");
                setSearchQuery("");
                setCurrentPage(1);
              }}
              className="mt-2 bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 text-xs font-bold cursor-pointer rounded"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <>
            {/* Posts Grid */}
            <div className="flex flex-col gap-4 sm:gap-6">
              {currentPosts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  categoryName={
                    categories.find((c) => c.id === post.categoryId)?.name ||
                    "Uncategorized"
                  }
                  darkMode={darkMode}
                  onSelect={navigateToPost}
                  onSelectCategory={navigateToCategory}
                  onEdit={setEditingPost}
                  onDelete={handleDeletePost}
                />
              ))}
            </div>

            {/* ✅ PAGINATION */}
            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-200 dark:border-neutral-800">
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Showing {startIndex + 1} - {Math.min(endIndex, totalPosts)} of {totalPosts} posts
                </div>
                
                <div className="flex items-center gap-1 flex-wrap justify-center">
                  {/* Previous Button */}
                  <button
                    onClick={goToPrevPage}
                    disabled={currentPage === 1}
                    className={`flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                      currentPage === 1
                        ? "text-gray-400 dark:text-gray-600 cursor-not-allowed"
                        : "text-gray-700 dark:text-gray-300 hover:bg-sky-50 dark:hover:bg-neutral-800 hover:text-sky-600 dark:hover:text-sky-400"
                    }`}
                    aria-label="Previous page"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                    <span>Prev</span>
                  </button>

                  {/* Page Numbers */}
                  {getPageNumbers().map((page) => (
                    <button
                      key={page}
                      onClick={() => goToPage(page)}
                      className={`min-w-[32px] h-8 px-2 text-xs font-medium rounded transition-colors ${
                        page === currentPage
                          ? "bg-sky-600 text-white"
                          : "text-gray-700 dark:text-gray-300 hover:bg-sky-50 dark:hover:bg-neutral-800 hover:text-sky-600 dark:hover:text-sky-400"
                      }`}
                      aria-label={`Go to page ${page}`}
                      aria-current={page === currentPage ? "page" : undefined}
                    >
                      {page}
                    </button>
                  ))}

                  {/* Next Button */}
                  <button
                    onClick={goToNextPage}
                    disabled={currentPage === totalPages}
                    className={`flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                      currentPage === totalPages
                        ? "text-gray-400 dark:text-gray-600 cursor-not-allowed"
                        : "text-gray-700 dark:text-gray-300 hover:bg-sky-50 dark:hover:bg-neutral-800 hover:text-sky-600 dark:hover:text-sky-400"
                    }`}
                    aria-label="Next page"
                  >
                    <span>Next</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    );
  };

  return (
    <div
      className={
        darkMode
          ? "dark bg-neutral-950 text-white min-h-screen transition-all"
          : "bg-gray-50 text-black min-h-screen transition-all"
      }
    >
      {/* Reset Button */}
      <button
        onClick={forceResetData}
        className="fixed bottom-24 right-6 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 text-[10px] font-bold z-50 shadow-lg rounded"
        aria-label="Refresh Website Data"
      >
        🔄 Refresh Website Data
      </button>

      <Navbar
        categories={categories}
        pages={pages}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        darkMode={darkMode}
        toggleDarkMode={() => setDarkMode(!darkMode)}
        onAddPost={() => setIsCreatingPost(true)}
        navigateToHome={navigateToHome}
        navigateToCategory={navigateToCategory}
        navigateToPage={navigateToPage}
      />

      <main className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
          <section className="lg:col-span-8 flex flex-col">
            {renderMainContent()}
          </section>

          <aside className="lg:col-span-4 flex flex-col mt-6 lg:mt-0">
            <Sidebar
              categories={categories}
              posts={posts}
              darkMode={darkMode}
              onSelectPost={navigateToPost}
              onSelectCategory={navigateToCategory}
              onAddCategory={handleAddCategory}
              onEditCategory={handleEditCategory}
              onDeleteCategory={handleDeleteCategory}
            />
          </aside>
        </div>
      </main>

      <footer
        className={`mt-8 sm:mt-12 py-6 sm:py-8 px-4 text-center border-t ${
          darkMode
            ? "bg-neutral-900/60 border-neutral-800 text-gray-400"
            : "bg-white border-slate-200 text-gray-600"
        } text-[10px] sm:text-xs font-medium`}
      >
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4">
          <p>
            © {new Date().getFullYear()} AI with Vishu - All Rights Reserved
          </p>
          <div className="flex flex-wrap justify-center gap-2 sm:gap-4">
            <button
              onClick={() => navigateToPage("about-us")}
              className="hover:underline hover:text-black dark:hover:text-white"
            >
              About Us
            </button>
            <span>•</span>
            <button
              onClick={() => navigateToPage("privacy-policy")}
              className="hover:underline hover:text-black dark:hover:text-white"
            >
              Privacy Policy
            </button>
            <span>•</span>
            <button
              onClick={() => navigateToPage("terms-and-condition")}
              className="hover:underline hover:text-black dark:hover:text-white"
            >
              Terms
            </button>
            <span>•</span>
            <button
              onClick={() => navigateToPage("disclaimer")}
              className="hover:underline hover:text-black dark:hover:text-white"
            >
              Disclaimer
            </button>
            <span>•</span>
            <button
              onClick={() => navigateToPage("contact-us")}
              className="hover:underline hover:text-black dark:hover:text-white"
            >
              Contact Us
            </button>
          </div>
        </div>
      </footer>

      {showScrollTop && (
        <button
          onClick={handleScrollToTop}
          className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 bg-slate-900 hover:bg-slate-800 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-white p-3 sm:p-3.5 rounded-full shadow-lg transition-all z-50 hover:scale-105 cursor-pointer"
          aria-label="Scroll back to top"
        >
          <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      )}
    </div>
  );
}

// Main App component with Router
export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}