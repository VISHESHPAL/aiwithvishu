import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Mail,
  Phone,
  Edit,
  Check,
  FileText,
  Copy,
  ExternalLink,
} from "lucide-react";

export default function PageContent({ page, darkMode, onSavePage }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(page.title);
  const [editContent, setEditContent] = useState(page.content);
  const [editEmail, setEditEmail] = useState(page.email || "");
  const [editPhone, setEditPhone] = useState(page.phone || "");
  const [copied, setCopied] = useState(false);

  // Reset local states when page change triggers
  useEffect(() => {
    setEditTitle(page.title);
    setEditContent(page.content);
    setEditEmail(page.email || "");
    setEditPhone(page.phone || "");
    setIsEditing(false);
  }, [page]);

  const copyToClipboard = useCallback((text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, []);

  // ✅ Pehle SAB helper functions define karein
  const renderRegularContent = (text, index) => {
    if (text.startsWith("###")) {
      return (
        <h3
          key={index}
          className={`text-base md:text-lg font-black uppercase mt-5 mb-2 border-b pb-1 ${
            darkMode ? 'text-white border-neutral-800' : 'text-black border-gray-200'
          }`}
        >
          {text.replace("###", "").trim()}
        </h3>
      );
    }
    if (text.startsWith("####")) {
      return (
        <h4
          key={index}
          className={`text-xs md:text-sm font-bold uppercase mt-4 mb-1 ${
            darkMode ? 'text-sky-400' : 'text-sky-600'
          }`}
        >
          {text.replace("####", "").trim()}
        </h4>
      );
    }

    if (text.includes("\n- ")) {
      const lines = text.split("\n");
      return (
        <ul
          key={index}
          className={`list-disc pl-5 my-3 flex flex-col gap-1.5 text-xs md:text-sm ${
            darkMode ? 'text-gray-300' : 'text-gray-700'
          }`}
        >
          {lines.map((line, lIdx) => {
            const item = line.replace(/^[-\*]\s*/, "").trim();
            if (!item) return null;
            return (
              <li
                key={lIdx}
                className="leading-relaxed"
                dangerouslySetInnerHTML={{
                  __html: item.replace(
                    /\*\*(.*?)\*\*/g,
                    `<strong class="${darkMode ? 'text-white' : 'text-black'}">$1</strong>`,
                  ),
                }}
              />
            );
          })}
        </ul>
      );
    }

    return (
      <p
        key={index}
        className={`text-xs md:text-sm leading-relaxed mb-4 whitespace-pre-wrap ${
          darkMode ? 'text-gray-300' : 'text-gray-700'
        }`}
        dangerouslySetInnerHTML={{
          __html: text.replace(
            /\*\*(.*?)\*\*/g,
            `<strong class="${darkMode ? 'text-white' : 'text-black'}">$1</strong>`,
          ),
        }}
      />
    );
  };

  const renderStepsSection = (text, index) => {
    const lines = text.split('\n');
    const title = lines[0].replace(/^###\s*/, '').trim();
    const steps = lines.slice(1).filter(line => line.trim().startsWith('-') || line.trim().startsWith('*'));

    return (
      <div key={index} className="my-6">
        <h3 className={`text-base md:text-lg font-black uppercase mt-5 mb-4 border-b pb-1 ${
          darkMode ? 'text-white border-neutral-800' : 'text-black border-gray-200'
        }`}>
          {title}
        </h3>
        <ul className={`list-disc pl-5 space-y-2 text-xs md:text-sm ${
          darkMode ? 'text-gray-300' : 'text-gray-700'
        }`}>
          {steps.map((step, i) => (
            <li key={i} className="leading-relaxed">{step.replace(/^[-*]\s*/, '')}</li>
          ))}
        </ul>
      </div>
    );
  };

  const renderVideoSection = (text, index) => {
    const lines = text.split('\n');
    const title = lines[0].replace(/^###\s*/, '').trim();
    const content = lines.slice(1).join('\n').trim();

    const promptMatch = content.match(/VIDEO\s*PROMPT\s*[:：]\s*["']?(.*?)["']?/i) || 
                        content.match(/["'](.*?)["']/);
    const promptText = promptMatch ? promptMatch[1] : '';

    const stepsMatch = content.match(/(\d+\.|\-)\s*(.*?)(?=\n\n|$)/g);
    const steps = stepsMatch ? stepsMatch.map(s => s.replace(/^\d+\.\s*|-\s*/, '').trim()) : [];

    const imageMatch = content.match(/!\[.*?\]\((.*?)\)/);
    const imageUrl = imageMatch ? imageMatch[1] : 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80';

    return (
      <div key={index} className="my-6">
        <h3 className={`text-base md:text-lg font-black uppercase mt-5 mb-4 border-b pb-1 ${
          darkMode ? 'text-white border-neutral-800' : 'text-black border-gray-200'
        }`}>
          {title}
        </h3>

        <div className={`border p-4 md:p-6 ${
          darkMode ? 'border-neutral-800' : 'border-slate-200'
        }`}>
          <div className="w-full mb-4">
            <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
              <img
                src={imageUrl}
                alt={title}
                loading="lazy"
                decoding="async"
                className="absolute inset-0 w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80";
                }}
              />
            </div>
          </div>

          {promptText && (
            <div className={`border p-3 md:p-4 relative ${
              darkMode ? 'border-neutral-700 bg-neutral-800/50' : 'border-slate-200 bg-slate-50'
            }`}>
              <div className="flex justify-between items-start gap-2">
                <p className={`text-xs md:text-sm font-medium ${
                  darkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  <span className="font-bold text-sky-600 dark:text-sky-400">VIDEO PROMPT :</span>{" "}
                  {promptText}
                </p>
                <button
                  onClick={() => copyToClipboard(promptText)}
                  className={`flex-shrink-0 p-1.5 transition-colors focus:outline-none focus:ring-2 focus:ring-sky-500 rounded ${
                    copied
                      ? "bg-green-600 text-white"
                      : darkMode
                      ? "bg-neutral-700 text-gray-300 hover:bg-neutral-600"
                      : "bg-white text-gray-600 hover:bg-gray-100"
                  }`}
                  title="Copy Prompt"
                  aria-label="Copy video prompt"
                >
                  {copied ? (
                    <Check className="w-4 h-4" aria-hidden="true" />
                  ) : (
                    <Copy className="w-4 h-4" aria-hidden="true" />
                  )}
                </button>
              </div>
            </div>
          )}

          {steps.length > 0 && (
            <div className="mt-4">
              <ul className={`list-decimal pl-5 space-y-2 text-xs md:text-sm ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                {steps.map((step, i) => (
                  <li key={i} className="leading-relaxed">{step}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    );
  };

  // ✅ Ab formatContent define karein (sab helper functions available hain)
  const formatContent = (text) => {
    const sections = text.split(/(?=###)/);
    
    return sections.map((section, index) => {
      const trimmed = section.trim();
      if (!trimmed) return null;

      if (trimmed.includes("VIDEO PROMPT") || trimmed.includes("Steps to Make")) {
        return renderVideoSection(trimmed, index);
      }

      if (trimmed.includes("Steps to Create") || trimmed.includes("Steps to Make")) {
        return renderStepsSection(trimmed, index);
      }

      return renderRegularContent(trimmed, index);
    });
  };

  // ✅ Ab useMemo safely use kar sakte hain
  const formattedContent = useMemo(() => {
    return formatContent(page.content);
  }, [page.content, darkMode]);

  const handleSave = useCallback(() => {
    onSavePage({
      ...page,
      title: editTitle,
      content: editContent,
      email: editEmail || undefined,
      phone: editPhone || undefined,
      lastUpdated: new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    });
    setIsEditing(false);
  }, [page, editTitle, editContent, editEmail, editPhone, onSavePage]);

  return (
    <div className="w-full font-sans">
      <div
        className={`p-6 md:p-8 border ${
          darkMode
            ? "bg-neutral-900 border-neutral-800"
            : "bg-white border-slate-200"
        }`}
        role="main"
        aria-label={`${page.title} page content`}
      >
        {/* Header Section */}
        <div className="flex justify-between items-center pb-4 mb-6 border-b border-slate-100 dark:border-neutral-800">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-sky-50 dark:bg-neutral-850 text-sky-600 dark:text-sky-400" aria-hidden="true">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              {isEditing ? (
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className={`font-black text-xl md:text-2xl bg-transparent border-b border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500 ${
                    darkMode ? 'text-white' : 'text-black'
                  }`}
                  aria-label="Edit page title"
                />
              ) : (
                <h1 className={`font-black text-xl md:text-2xl capitalize ${
                  darkMode ? 'text-white' : 'text-black'
                }`}>
                  {page.title}
                </h1>
              )}
              {page.lastUpdated && (
                <p className="text-[10px] text-gray-400 mt-0.5">
                  Last updated: {page.lastUpdated}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Live editing block or Formatted Content block */}
        {isEditing ? (
          <div className="flex flex-col gap-4 text-xs md:text-sm">
            <div className="flex flex-col gap-1">
              <label className={`font-bold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`} htmlFor="page-content">
                Page Content (Support Linebreaks, ### for Main Headings, ####
                for Subheadings, - for List items):
              </label>
              <textarea
                id="page-content"
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                rows={12}
                className={`w-full font-mono p-3 border focus:outline-none focus:ring-2 focus:ring-sky-600 rounded ${
                  darkMode
                    ? "bg-neutral-800 border-neutral-700 text-white"
                    : "bg-gray-50 border-gray-200 text-black"
                }`}
                aria-label="Edit page content"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className={`font-bold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`} htmlFor="page-email">
                  Contact Email (Optional):
                </label>
                <input
                  id="page-email"
                  type="email"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  placeholder="vseditor630@gmail.com"
                  className={`w-full px-3 py-2 border focus:outline-none focus:ring-2 focus:ring-sky-600 rounded ${
                    darkMode
                      ? "bg-neutral-800 border-neutral-700 text-white placeholder-gray-400"
                      : "bg-gray-50 border-gray-200 text-black placeholder-gray-400"
                  }`}
                  aria-label="Edit contact email"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className={`font-bold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`} htmlFor="page-phone">
                  Contact Phone (Optional):
                </label>
                <input
                  id="page-phone"
                  type="text"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  placeholder="6307742335"
                  className={`w-full px-3 py-2 border focus:outline-none focus:ring-2 focus:ring-sky-600 rounded ${
                    darkMode
                      ? "bg-neutral-800 border-neutral-700 text-white placeholder-gray-400"
                      : "bg-gray-50 border-gray-200 text-black placeholder-gray-400"
                  }`}
                  aria-label="Edit contact phone"
                />
              </div>
            </div>

            <button
              onClick={handleSave}
              className="bg-sky-600 hover:bg-sky-700 text-white py-2.5 font-bold uppercase tracking-wider text-xs transition-colors self-start px-6 rounded focus:outline-none focus:ring-2 focus:ring-sky-500"
              aria-label="Apply page updates"
            >
              Apply Page Updates
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <div className="max-w-none">
              {formattedContent}
            </div>

            {(page.email || page.phone) && (
              <div className="mt-6 pt-6 border-t border-slate-100 dark:border-neutral-800 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {page.email && (
                  <div
                    className={`p-4 flex items-center gap-3 border ${
                      darkMode
                        ? "bg-neutral-800/40 border-neutral-800"
                        : "bg-slate-50 border-slate-200"
                    } rounded`}
                  >
                    <div className="p-2.5 bg-sky-50 dark:bg-neutral-850 text-sky-600 dark:text-sky-400 rounded-full" aria-hidden="true">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                        Inquiries Email
                      </p>
                      <a
                        href={`mailto:${page.email}`}
                        className={`text-xs font-bold hover:underline focus:outline-none focus:ring-2 focus:ring-sky-500 rounded ${
                          darkMode ? 'text-sky-400' : 'text-sky-600'
                        }`}
                        aria-label={`Email us at ${page.email}`}
                      >
                        {page.email}
                      </a>
                    </div>
                  </div>
                )}

                {page.phone && (
                  <div
                    className={`p-4 flex items-center gap-3 border ${
                      darkMode
                        ? "bg-neutral-800/40 border-neutral-800"
                        : "bg-slate-50 border-slate-200"
                    } rounded`}
                  >
                    <div className="p-2.5 bg-sky-50 dark:bg-neutral-850 text-sky-600 dark:text-sky-400 rounded-full" aria-hidden="true">
                      <Phone className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                        Contact Phone
                      </p>
                      <a
                        href={`tel:${page.phone}`}
                        className={`text-xs font-bold hover:underline focus:outline-none focus:ring-2 focus:ring-sky-500 rounded ${
                          darkMode ? 'text-sky-400' : 'text-sky-600'
                        }`}
                        aria-label={`Call us at ${page.phone}`}
                      >
                        {page.phone}
                      </a>
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="mt-8 pt-4 border-t border-gray-100 dark:border-neutral-800 text-center">
              <p className="text-[10px] text-gray-400">
                &copy; {new Date().getFullYear()} AI with Vishu - All Rights
                Reserved | Theme: News Portal customized by Vishu.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}