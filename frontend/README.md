# AI WITH VISHU - Photo & Video Editing Tutorial Platform

A comprehensive React-based web application for sharing AI photo and video editing tutorials, prompts, and resources.

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Features](#features)
3. [Tech Stack](#tech-stack)
4. [Installation](#installation)
5. [Project Structure](#project-structure)
6. [Data Management](#data-management)
7. [Components](#components)
8. [Responsive Design](#responsive-design)
9. [Dark Mode](#dark-mode)
10. [Adding New Content](#adding-new-content)
11. [Deployment](#deployment)
12. [Contributing](#contributing)
13. [License](#license)
14. [Contact](#contact)

---

## 🎯 Overview

**AI WITH VISHU** is a professional content platform designed to share high-quality photo and video editing tutorials. The platform features clean, modern UI with dark/light mode support, fully responsive design (mobile, tablet, desktop), dynamic content management with localStorage, interactive post detail pages with copyable prompts, and category-based content organization.

---

## ✨ Features

### Core Features

| Feature | Description |
|---------|-------------|
| **Post Cards** | Clean, responsive cards displaying tutorial previews |
| **Post Detail Pages** | Full tutorial content with images and prompts |
| **Multiple Image Support** | Each post can have multiple images with individual prompts |
| **Copy to Clipboard** | One-click copy for all prompts |
| **Category Navigation** | Filter posts by category |
| **Search Functionality** | Search posts by title, content, or tags |
| **Dark/Light Mode** | Toggle between themes with persistent storage |
| **Responsive Design** | Optimized for all screen sizes |
| **Comments System** | Users can leave comments on posts |
| **Trending Posts** | Highlight popular content |
| **Related Posts** | Show related content in post detail |
| **Static Pages** | About, Privacy Policy, Terms, Disclaimer, Contact |

### UI/UX Features

- ✅ Clean, flat design (no rounded corners, no shadows)
- ✅ No hover zoom effects (clean and professional)
- ✅ Consistent spacing and typography
- ✅ Accessible color contrast
- ✅ Smooth transitions
- ✅ Mobile-first responsive design

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **React 18** | UI Framework |
| **React Router DOM** | Routing & Navigation |
| **Tailwind CSS** | Styling & Responsive Design |
| **Lucide React** | Icons |
| **React Icons** | Social Media Icons |
| **localStorage** | Data Persistence |

---

## 📦 Installation

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Setup Instructions

```bash
# 1. Clone the repository
git clone https://github.com/yourusername/ai-with-vishu.git
cd ai-with-vishu

# 2. Install dependencies
npm install
# or
yarn install

# 3. Start development server
npm start
# or
yarn start

# 4. Open browser
# Navigate to http://localhost:3000



ai-with-vishu/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Navbar.js          # Navigation bar with categories & pages
│   │   ├── Sidebar.js         # Categories list & trending posts
│   │   ├── PostCard.js        # Post preview card
│   │   ├── PostDetail.js      # Full post with images & prompts
│   │   └── PageContent.js     # Static pages (About, Privacy, etc.)
│   ├── assets/
│   │   └── images/            # Post images
│   ├── data.js                # All content data with version control
│   ├── App.js                 # Main application with routing
│   ├── index.js               # Entry point
│   └── index.css              # Global styles
├── package.json
├── tailwind.config.js
└── README.md

// data.js
export const DATA_VERSION = '1.0.0'; // Increment when data changes

export const INITIAL_POSTS = [ ... ];
export const INITIAL_CATEGORIES = [ ... ];
export const INITIAL_PAGES = [ ... ];