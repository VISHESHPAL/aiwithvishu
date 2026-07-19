import React, { useState, useEffect } from "react";
import {
  Home as HomeIcon,
  Search,
  Sun,
  Moon,
  Menu,
  X,
  PlusCircle,
} from "lucide-react";
import {
  FaWhatsapp,
  FaTelegramPlane,
  FaInstagram,
  FaYoutube,
} from "react-icons/fa";

export default function Navbar({
  categories,
  pages,
  activeTab,
  setActiveTab,
  searchQuery,
  setSearchQuery,
  darkMode,
  toggleDarkMode,
  onAddPost,
  navigateToHome,
  navigateToCategory,
  navigateToPage,
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [formattedDate, setFormattedDate] = useState(
    "Wednesday, July 15, 2026",
  );

  // Dynamically update date in Header
  useEffect(() => {
    try {
      const options = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      };
      const date = new Date();
      if (date.getFullYear() < 2026) {
        setFormattedDate("Wednesday, July 15, 2026");
      } else {
        setFormattedDate(date.toLocaleDateString("en-US", options));
      }
    } catch (e) {
      setFormattedDate("Wednesday, July 15, 2026");
    }
  }, []);

  const handleCategoryClick = (catId) => {
    navigateToCategory(catId);
    setMobileMenuOpen(false);
  };

  const handlePageClick = (pageId) => {
    navigateToPage(pageId);
    setMobileMenuOpen(false);
  };

  const handleHomeClick = () => {
    navigateToHome();
    setMobileMenuOpen(false);
  };

  return (
    <header className="w-full flex flex-col font-sans">
      {/* Top bar */}
      <div className="bg-slate-900 text-white py-2.5 px-6 text-[11px] uppercase tracking-wider border-b border-slate-850">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-2">
          <div className="flex items-center gap-3 flex-wrap justify-center">
            <span className="opacity-75">{formattedDate}</span>
            <span className="hidden md:inline text-slate-700">|</span>
            <div className="flex flex-wrap justify-center gap-4">
              <button
                onClick={handleHomeClick}
                className={`hover:text-sky-400 transition-colors ${
                  activeTab === "home" 
                    ? "font-bold text-sky-400" 
                    : "text-slate-300"
                }`}
              >
                Home
              </button>
              {pages.map((page) => (
                <React.Fragment key={page.id}>
                  <span className="text-slate-700">|</span>
                  <button
                    onClick={() => handlePageClick(page.id)}
                    className={`hover:text-sky-400 transition-colors capitalize ${
                      activeTab === `page-${page.id}` 
                        ? "font-bold text-sky-400" 
                        : "text-slate-300"
                    }`}
                  >
                    {page.title}
                  </button>
                </React.Fragment>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Social Media links */}
            <div className="flex items-center gap-3 text-slate-300">
              <a
                href="https://www.instagram.com/the_vishesh_001/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-sky-400 transition-colors"
              >
                <FaInstagram />
              </a>
              <a
                href="https://t.me/visheshpal001"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-sky-400 transition-colors"
              >
                <FaTelegramPlane />
              </a>
              <a
                href="https://www.youtube.com/@CricNews-v2l"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-sky-400 transition-colors"
              >
                <FaYoutube />
              </a>
              <a
                href="https://www.youtube.com/@CricNews-v2l"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-sky-400 transition-colors"
              >
                <FaWhatsapp />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Logo Header Area */}
      <div
        className={`py-8 px-8 ${
          darkMode 
            ? "bg-neutral-900 border-neutral-800" 
            : "bg-white border-slate-200"
        } border-b flex justify-center items-center`}
      >
        <div className="max-w-7xl w-full flex flex-col items-center text-center">
          <div
            className="flex items-center cursor-pointer select-none"
            onClick={handleHomeClick}
          >
            <h1
              className={`text-4xl md:text-6xl font-black tracking-tight ${
                darkMode ? "text-white" : "text-black"
              }`}
            >
              <span className={`${darkMode ?"text-white" : "text-black" }`}>AI WITH</span>{" "}
              <span className="text-sky-600 dark:text-sky-400">VISHU</span>{" "}
              <span className="text-gray-400 dark:text-gray-500 text-3xl md:text-4xl font-bold">
                EDITOR
              </span>
            </h1>
          </div>
          <p className={`mt-3 text-xs md:text-sm font-medium tracking-[0.3em] uppercase ${
            darkMode ? 'text-gray-400' : 'text-gray-500'
          }`}>
            Photo & Video Editing Tutorials & Insights
          </p>
        </div>
      </div>

      {/* Category Navbar */}
      <nav
        className={`py-1 px-4 sticky top-0 z-40 ${
          darkMode
            ? "bg-neutral-900 border-neutral-800"
            : "bg-white border-b border-slate-200"
        }`}
      >
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          {/* Home and main categories - Desktop */}
          <div className="hidden lg:flex items-center h-12">
            <button
              onClick={handleHomeClick}
              className={`h-full px-5 flex items-center transition-colors hover:text-sky-600 dark:hover:text-sky-400 border-r ${
                darkMode ? "border-neutral-800" : "border-slate-100"
              } ${
                activeTab === "home"
                  ? "text-sky-600 dark:text-sky-400 font-bold border-b-2 border-sky-600 dark:border-sky-400"
                  : darkMode 
                  ? "text-neutral-200" 
                  : "text-black"
              }`}
            >
              <HomeIcon className="w-4 h-4" />
            </button>

            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategoryClick(cat.id)}
                className={`h-full px-4 text-xs font-bold tracking-wide uppercase transition-colors hover:text-sky-600 dark:hover:text-sky-400 border-r ${
                  darkMode ? "border-neutral-800" : "border-slate-100"
                } ${
                  activeTab === `cat-${cat.id}`
                    ? "text-sky-600 dark:text-sky-400 border-b-2 border-sky-600 dark:border-sky-400 font-black"
                    : darkMode 
                    ? "text-neutral-200" 
                    : "text-black"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Mobile menu */}
          <div className="flex lg:hidden items-center h-12 w-full justify-between">
            <div className="flex items-center gap-1">
              <button
                onClick={handleHomeClick}
                className={`p-2 transition-colors ${
                  activeTab === "home"
                    ? "text-sky-600 dark:text-sky-400"
                    : darkMode 
                    ? "text-neutral-200 hover:text-sky-400" 
                    : "text-black hover:text-sky-600"
                }`}
                aria-label="Home"
              >
                <HomeIcon className="w-5 h-5" />
              </button>
              
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className={`p-2 transition-colors ${
                  darkMode ? "hover:bg-neutral-800" : "hover:bg-slate-100"
                }`}
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? (
                  <X className={`w-5 h-5 ${darkMode ? "text-white" : "text-black"}`} />
                ) : (
                  <Menu className={`w-5 h-5 ${darkMode ? "text-white" : "text-black"}`} />
                )}
              </button>
            </div>



            <div className="flex items-center gap-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`text-xs py-1.5 pl-3 pr-7 w-28 border focus:outline-none focus:ring-1 focus:ring-sky-500 transition-all ${
                    darkMode
                      ? "bg-neutral-800 text-white border-neutral-700 placeholder-neutral-400"
                      : "bg-slate-100 text-black border-slate-200 placeholder-slate-400"
                  }`}
                />
                <Search className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2" />
              </div>
              <button
                onClick={toggleDarkMode}
                className={`p-2 transition-colors ${
                  darkMode ? "hover:bg-neutral-800" : "hover:bg-slate-100"
                }`}
                title="Switch light/dark mode"
              >
                {darkMode ? (
                  <Sun className="w-4 h-4 text-white" />
                ) : (
                  <Moon className="w-4 h-4 text-black" />
                )}
              </button>
            </div>
          </div>

          {/* Navigation Controls - Desktop */}
          <div className="hidden lg:flex items-center gap-2 h-12">
            <div className="relative">
              <input
                type="text"
                placeholder="Search tutorials..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`text-xs py-1.5 pl-4 pr-8 w-44 md:w-56 border focus:outline-none focus:ring-1 focus:ring-sky-500 transition-all ${
                  darkMode
                    ? "bg-neutral-800 text-white border-neutral-700 placeholder-neutral-400"
                    : "bg-slate-100 text-black border-slate-200 placeholder-slate-400"
                }`}
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
            </div>

            <button
              onClick={toggleDarkMode}
              className={`p-2 transition-colors ${
                darkMode ? "hover:bg-neutral-800" : "hover:bg-slate-100"
              }`}
              title="Switch light/dark mode"
            >
              {darkMode ? (
                <Sun className="w-4 h-4 text-white" />
              ) : (
                <Moon className="w-4 h-4 text-black" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div
          className={`lg:hidden block border-b shadow-lg transition-all ${
            darkMode
              ? "bg-neutral-900 border-neutral-800"
              : "bg-white border-gray-100"
          }`}
        >
          <div className="p-4 flex flex-col gap-2">
            <button
              onClick={handleHomeClick}
              className={`w-full py-2.5 px-3 text-left text-xs font-bold uppercase transition-all ${
                activeTab === "home"
                  ? "bg-sky-600 text-white"
                  : darkMode
                  ? "text-white hover:bg-neutral-800"
                  : "text-black hover:bg-sky-50"
              }`}
            >
              Home Page
            </button>

            <div className="mt-2 border-t border-slate-200 dark:border-neutral-800 pt-2">
              <p className={`px-3 text-[10px] font-bold uppercase tracking-widest mb-1 ${
                darkMode ? "text-gray-400" : "text-gray-500"
              }`}>
                Tutorial Categories
              </p>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryClick(cat.id)}
                  className={`w-full py-2.5 px-3 text-left text-xs font-bold uppercase transition-all ${
                    activeTab === `cat-${cat.id}`
                      ? "bg-sky-600 text-white"
                      : darkMode
                      ? "text-white hover:bg-neutral-800"
                      : "text-black hover:bg-sky-50"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            <div className="mt-2 border-t border-slate-200 dark:border-neutral-800 pt-2">
              <p className={`px-3 text-[10px] font-bold uppercase tracking-widest mb-1 ${
                darkMode ? "text-gray-400" : "text-gray-500"
              }`}>
                Information Pages
              </p>
              {pages.map((page) => (
                <button
                  key={page.id}
                  onClick={() => handlePageClick(page.id)}
                  className={`w-full py-2.5 px-3 text-left text-xs transition-all ${
                    activeTab === `page-${page.id}`
                      ? "bg-sky-600 text-white"
                      : darkMode
                      ? "text-white hover:bg-neutral-800"
                      : "text-black hover:bg-sky-50"
                  }`}
                >
                  {page.title}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}