// generateSitemap.js
import fs from 'fs';
import { create } from 'xmlbuilder';
import { INITIAL_POSTS, INITIAL_CATEGORIES, INITIAL_PAGES } from './src/data.js';

const BASE_URL = 'https://aiwithvishu.in';

// 📌 Static Pages (jo sitemap mein already hain)
const staticPages = [
  { loc: '/', changefreq: 'daily', priority: 1.0 },
  { loc: '/about', changefreq: 'monthly', priority: 0.9 },
  { loc: '/contact', changefreq: 'monthly', priority: 0.7 },
  { loc: '/privacy-policy', changefreq: 'yearly', priority: 0.5 },
  { loc: '/terms-and-condition', changefreq: 'yearly', priority: 0.5 },
  { loc: '/disclaimer', changefreq: 'yearly', priority: 0.5 },
];

// 🔥 Blog Posts se dynamic URLs generate karein
const postUrls = INITIAL_POSTS.map(post => {
  // Category slug find karein
  const category = INITIAL_CATEGORIES.find(c => c.id === post.categoryId);
  const categorySlug = category ? category.slug : 'uncategorized';
  
  // Title se slug banayein (same as createPostSlug function)
  const postSlug = post.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  return {
    loc: `/${categorySlug}/${postSlug}`,
    changefreq: 'weekly',
    priority: 0.9,
    lastmod: new Date(post.date).toISOString().split('T')[0], // YYYY-MM-DD
  };
});

// 🔥 Categories ke pages bhi add karein (optional but recommended)
const categoryUrls = INITIAL_CATEGORIES.map(cat => ({
  loc: `/${cat.slug}`,
  changefreq: 'weekly',
  priority: 0.7,
}));

// Sab URLs combine karein
const allUrls = [...staticPages, ...categoryUrls, ...postUrls];

// ✅ XML sitemap build karein
const root = create('urlset', {
  version: '1.0',
  encoding: 'UTF-8',
})
  .att('xmlns', 'http://www.sitemaps.org/schemas/sitemap/0.9');

allUrls.forEach(({ loc, changefreq, priority, lastmod }) => {
  const url = root.ele('url');
  url.ele('loc', `${BASE_URL}${loc}`);
  url.ele('changefreq', changefreq);
  url.ele('priority', priority);
  if (lastmod) {
    url.ele('lastmod', lastmod);
  }
});

// Pretty print XML
const xml = root.end({ pretty: true });

// public folder mein save karein
fs.writeFileSync('./public/sitemap.xml', xml);
console.log('✅ Sitemap generated successfully!');
console.log(`📄 Total URLs: ${allUrls.length}`);
console.log(`   📂 Static Pages: ${staticPages.length}`);
console.log(`   📁 Categories: ${categoryUrls.length}`);
console.log(`   📝 Blog Posts: ${postUrls.length}`);
console.log('\n📋 Generated URLs:');
allUrls.forEach(({ loc }) => {
  console.log(`   - ${BASE_URL}${loc}`);
});