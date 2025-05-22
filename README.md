# ALiao18.github.io - Personal Website (Work in Progress)

A personal website designed for academic and professional presence with multilingual support, dark mode, and multiple sections.

## Contents

- [Overview](#overview)
- [Features](#features)
  - [Current Features](#current-features)
  - [Future Plans](#future-plans)
- [Structure](#structure)
- [Technical Implementation](#technical-implementation)
- [Adding Content](#adding-content)
  - [Blog Posts](#adding-blog-posts)
  - [Notes](#adding-notes)
  - [Publications](#adding-publications)
  - [Projects](#adding-projects)
  - [Videos](#adding-videos)
- [Multilingual Support](#multilingual-support)
- [Personalization Features](#personalization-features)
- [Performance Optimizations](#performance-optimizations)
- [Security](#security)
- [Contributing](#contributing)
- [License](#license)

## Overview

This website serves as a personal portfolio for Andrew Liao, including sections for projects, publications, CV, blog posts, notes, and videos. It features a clean, responsive design with both light and dark modes, multilingual support, and is optimized for accessibility and performance.

## Features

### Current Features

- **Responsive Design**: Adapts to various screen sizes and devices
- **Dark Mode**: Toggle between light and dark themes with persistent preference
- **Social Links**: GitHub, LinkedIn, and Email with theme-aware icons
- **Accessibility**: ARIA labels, keyboard navigation, and semantic HTML
- **Full Multilingual Support**: 
  - Complete English and Traditional Chinese (Taiwan) translations
  - Language detection based on browser settings
  - Language selector in the navigation
- **Personalization System**:
  - Welcome page with user type selection (Recruiter, Academic, Friends & Family)
  - Type-specific content and recommendations
  - Password protection for personal content
- **Performance Optimizations**:
  - Loading animations and page transitions
  - Lazy image loading
  - Animate-on-scroll effects
  - Optimized caching with .htaccess configuration
- **Error Handling**: Custom 404 page with multilingual support
- **Section Pages**:
  - Home/About
  - Projects
  - Publications
  - CV/Resume
  - Blog (with Markdown support)
  - Notes (with Markdown support)
  - Videos
- **Typography**: Space Mono for headings, Work Sans for body text, Noto Sans TC for Chinese

### Future Plans

1. **Image Optimization**: Further improvements for responsive image loading
2. **Publications Schema**: Advanced filtering and organization for academic publications
3. **Blog Architecture**: Category-based filtering and improved folder structure
4. **Interactive CV**: Dynamic, interactive curriculum vitae display
5. **Contact Form**: Allow visitors to leave messages without sending emails
6. **SEO Improvements**: Structured data and meta tag optimizations

## Structure

```
/
├── assets/                 # Images, icons, and other static files
│   ├── headshot.jpg        # Profile photo
│   ├── AndrewLiao_Resume.pdf # CV/Resume PDF
│   ├── github.black.svg    # SVG icons (dark theme versions)
│   ├── github.white.svg    # SVG icons (light theme versions)
│   └── ...
├── blog/                   # Blog section
│   ├── index.html          # Blog landing page
│   └── posts/              # Individual blog posts
├── notes/                  # Notes section
│   ├── index.html          # Notes landing page
│   └── ...                 # Individual note files
├── css/                    # CSS stylesheets
│   ├── i18n.css            # Internationalization styles
│   ├── personalization.css # User type personalization styles
│   ├── animations.css      # Animation styles
│   └── ...
├── js/                     # JavaScript files
│   ├── i18n.js             # Multilingual support
│   ├── user-personalization.js # User type handling
│   ├── lazy-load.js        # Lazy loading for images
│   ├── loader.js           # Page loading animations
│   ├── aos.js              # Animate-on-scroll functionality
│   └── ...
├── locales/                # Translation files
│   ├── en.json             # English translations
│   └── zh.json             # Traditional Chinese translations
├── index.html              # Home page
├── welcome.html            # Welcome/personalization page
├── projects.html           # Projects page
├── publications.html       # Publications page
├── videos.html             # Videos page
├── cv.html                 # CV/Resume page
├── 404.html                # Custom error page
├── .htaccess               # Server configuration
└── style.css               # Main stylesheet
```

## Technical Implementation

The website is built with vanilla HTML, CSS, and JavaScript, with no dependencies on heavy frameworks. Key technical aspects include:

- **Vanilla JavaScript**: For interactive elements, dark mode, and language switching
- **CSS Variables**: For consistent theming and easy customization
- **Internationalization**: Custom i18n system with JSON translation files
- **User Personalization**: User type detection and content customization
- **Performance Optimizations**: Lazy loading, animations, and caching
- **Markdown Support**: Using marked.js for rendering blog posts and notes
- **Math Typesetting**: Using KaTeX for mathematical notation
- **Responsive Design**: Using flexbox and media queries

## Adding Content

### Adding Blog Posts

1. Create a new markdown file in the `blog/posts/` directory with the format `YYYY-MM-DD-title.md`
2. Add frontmatter at the top of the file:
   ```markdown
   ---
   title: "Your Blog Post Title"
   date: "YYYY-MM-DD"
   description: "Short description of your post"
   tags: ["tag1", "tag2"]
   ---
   ```
3. Add your content below the frontmatter using Markdown syntax
4. The post will automatically appear in the blog index

### Adding Notes

1. Create a new markdown file in the `notes/` directory with a descriptive name
2. Add frontmatter similar to blog posts if needed
3. Write your note content using Markdown
4. Mathematical notation can be included using LaTeX syntax between `$` (inline) or `$$` (block) delimiters

### Adding Publications

To add a new publication:

1. Open `publications.html`
2. Find the publications section
3. Add a new publication entry following the existing format:
   ```html
   <div class="publication">
     <h3>Title of Publication</h3>
     <p class="authors">Author 1, Author 2, ...</p>
     <p class="venue">Conference/Journal Name, Year</p>
     <p class="description">Brief description of the publication.</p>
     <div class="publication-links">
       <a href="link-to-paper" target="_blank">Paper</a>
       <a href="link-to-code" target="_blank">Code</a>
     </div>
   </div>
   ```

### Adding Projects

To add a new project:

1. Open `projects.html`
2. Find the projects section
3. Add a new project entry following the existing format:
   ```html
   <div class="project">
     <h3>Project Name</h3>
     <p class="project-description">Description of your project.</p>
     <div class="project-links">
       <a href="link-to-demo" target="_blank">Demo</a>
       <a href="link-to-code" target="_blank">Code</a>
     </div>
   </div>
   ```

### Adding Videos

To add a new video:

1. Open `videos.html`
2. Find the videos section
3. Add a new video entry:
   ```html
   <div class="video">
     <h3>Video Title</h3>
     <div class="video-container">
       <iframe src="https://www.youtube.com/embed/VIDEO_ID" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
     </div>
     <p class="video-description">Description of the video.</p>
   </div>
   ```

## Multilingual Support

### Current Implementation

The site now has full multilingual support:

- **Language Toggle**: A dropdown in the navigation to switch languages
- **Translation Files**: JSON files containing translations for all UI elements and content
- **URL Structure**: Language query parameter support (e.g., `?lang=zh` for Chinese)
- **Content Management**: Translations managed through data attributes
- **Auto-Detection**: Automatically detects user's preferred language on first visit
- **Persistence**: Remembers language preference across visits

### Internationalization Features

1. **Language Switcher**: Easy language selection in the navigation
2. **Data Attributes**: HTML elements use `data-i18n` attributes to specify translation keys
3. **Dynamic Updates**: Real-time language switching without page reload
4. **Language-Specific Styling**: Adjusted typography and spacing for Chinese characters
5. **Fallback System**: Falls back to English when translations are missing

### Code Structure

```
/
├── locales/               # Translation files
│   ├── en.json            # English translations
│   └── zh.json            # Traditional Chinese translations
├── css/
│   └── i18n.css           # Language-specific styles
└── js/
    └── i18n.js            # Language switching logic
```

### Usage

Adding translatable content:

```html
<h1 data-i18n="home.title">Default English Text</h1>
<p data-i18n="home.description">This will be replaced with translation.</p>
```

Translation files structure:

```json
{
  "home": {
    "title": "Page Title",
    "description": "Translated description text."
  }
}
```

## Personalization Features

The website includes a personalization system that tailors content based on visitor type.

### User Types

1. **Recruiter**: Emphasizes professional accomplishments, projects, and skills
2. **Academic**: Highlights research interests, publications, and academic background
3. **Personal**: Shows more personal content for friends and family (password protected)

### Implementation

- **Welcome Page**: Initial selection screen for user type
- **Password Protection**: Secure access to personal content
- **Persistent Preferences**: Remembers user type across visits
- **Visual Indicators**: Shows current personalization mode in the navigation
- **Recommended Content**: Highlights relevant sections based on user type

### Usage

The personalization system is implemented with:

- `welcome.html`: User type selection page
- `js/user-personalization.js`: Logic for handling user types
- `css/personalization.css`: Styling for personalized content

## Performance Optimizations

The website includes several performance optimizations:

### Loading Animations

- **Page Transitions**: Smooth fade transitions between pages
- **Minimum Display Time**: Ensures loading animations don't flash briefly
- **Conditional Display**: Only shows loader for slow-loading pages

### Lazy Loading

- **Image Lazy Loading**: Defers loading images until they're near the viewport
- **Background Images**: Support for lazy loading CSS background images
- **Intersection Observer**: Uses modern browser APIs for efficiency
- **Fallbacks**: Graceful degradation for older browsers

### Animation System

- **Animate on Scroll**: Elements animate as they enter the viewport
- **Staggered Animations**: Support for sequenced animations
- **Performance Considerations**: Respects "reduced motion" preferences
- **Utility Classes**: Reusable animation classes for consistent effects

### Caching and Optimization

- **.htaccess Configuration**: Server-side optimizations for caching
- **GZIP Compression**: Reduces file sizes for faster loading
- **Cache Control**: Appropriate cache headers for static assets
- **Error Pages**: Custom 404 page with proper status codes

## Security

### Password Protection

For the friends and family section, there's client-side password protection:

- **Hashed Password**: Uses SHA-256 for client-side verification
- **User Token**: Generates authentication token on successful login
- **Scope Limitation**: Clear boundaries between public and private content

## Contributing

This is a personal website, but suggestions and bug reports are welcome. Please open an issue to discuss potential changes.

## License

All rights reserved. This code is provided for reference only.
