# ALiao18.github.io - Personal Website

A clean, responsive personal website designed for academic and professional presence with multilingual support, dark mode, and multiple sections.

![Andrew Liao's Website](assets/screenshot.png)

## Contents

- [Overview](#overview)
- [Features](#features)
  - [Current Features](#current-features)
  - [Planned Features](#planned-features)
- [Structure](#structure)
- [Technical Implementation](#technical-implementation)
- [Adding Content](#adding-content)
  - [Blog Posts](#adding-blog-posts)
  - [Notes](#adding-notes)
  - [Publications](#adding-publications)
  - [Projects](#adding-projects)
  - [Videos](#adding-videos)
- [Multilingual Support](#multilingual-support)
- [Security](#security)
- [Optimization](#optimization)
- [Contributing](#contributing)
- [License](#license)

## Overview

This website serves as a personal portfolio for Andrew Liao, including sections for projects, publications, CV, blog posts, notes, and videos. It features a clean, responsive design with both light and dark modes, multilingual support, and is optimized for accessibility and performance.

## Features

### Current Features

- **Responsive Design**: Adapts to various screen sizes and devices
- **Dark Mode**: Toggle between light and dark themes
- **Accessibility**: ARIA labels, keyboard navigation, and semantic HTML
- **Multilingual Elements**: Support for Chinese name display (廖英劭)
- **Section Pages**:
  - Home/About
  - Projects
  - Publications
  - CV/Resume
  - Blog (with Markdown support)
  - Notes (with Markdown support)
  - Videos
- **Social Links**: GitHub, LinkedIn, Email
- **Clean Typography**: Space Mono for headings, Work Sans for body text

### Planned Features

1. **Loading Animations**: Smooth transitions and loading effects between pages and for content
2. **Image Optimization**: Automated compression and responsive image loading
3. **Publications Schema**: Advanced filtering and organization for academic publications
4. **Blog Architecture**: Category-based filtering and improved folder structure
5. **Interactive CV**: Dynamic, interactive curriculum vitae display
6. **Contact Form**: Allow visitors to leave messages without sending emails
7. **Full Multilingual Support**: Toggle between English and Chinese versions of all content
8. **Password Protection**: Secure access to specific content for friends and family

## Structure

```
/
├── assets/                 # Images, icons, and other static files
│   ├── headshot.jpg        # Profile photo
│   ├── AndrewLiao_Resume.pdf # CV/Resume PDF
│   ├── github.svg          # SVG icons
│   └── ...
├── blog/                   # Blog section
│   ├── index.html          # Blog landing page
│   └── posts/              # Individual blog posts as markdown files
├── notes/                  # Notes section
│   ├── index.html          # Notes landing page
│   └── ...                 # Individual note files
├── index.html              # Home page
├── projects.html           # Projects page
├── publications.html       # Publications page
├── videos.html             # Videos page
├── cv.html                 # CV/Resume page
└── style.css               # Main stylesheet
```

## Technical Implementation

The website is built with vanilla HTML, CSS, and JavaScript, with no dependencies on heavy frameworks. Key technical aspects include:

- **Vanilla JavaScript**: For interactive elements and dark mode toggle
- **CSS Variables**: For consistent theming and easy customization
- **Markdown Support**: Using marked.js for rendering blog posts and notes
- **Math Typesetting**: Using KaTeX for mathematical notation
- **SVG Icons**: Lightweight, responsive icons for social links
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

The site currently has basic multilingual elements:
- Chinese name (廖英劭) displayed alongside English name

### Planned Full Implementation

The website will support complete language switching between English and Chinese versions:

1. **Language Toggle**: A button/dropdown in the navigation to switch languages
2. **Translation Files**: JSON files containing translations for UI elements and content
3. **URL Structure**: Language-specific URLs (e.g., `/zh/` for Chinese pages)
4. **Content Management**: Parallel content structure for both languages
5. **Auto-Detection**: Automatically detect user's preferred language on first visit

#### Implementation Plan

1. Create a language toggle in the navigation
2. Set up translation files for UI elements
3. Modify the JavaScript to handle language switching
4. Create parallel content files for both languages
5. Implement language detection based on browser settings

#### Code Structure

```
/
├── locales/               # Translation files
│   ├── en.json            # English translations
│   └── zh.json            # Chinese translations
├── en/                    # English content (optional structure)
│   ├── blog/
│   └── ...
└── zh/                    # Chinese content
    ├── blog/
    └── ...
```

## Security

### Password Protection

For the friends and family section, we'll implement client-side password protection:

1. **Implementation**: Using PageCrypt for client-side encryption
2. **Access Control**: Separate landing page with password prompt
3. **Security Considerations**: Clear explanations of limitations of client-side protection

#### Usage

```javascript
// Example implementation with PageCrypt
const protectedContent = document.getElementById('protected-content');
const passwordInput = document.getElementById('password-input');
const submitButton = document.getElementById('submit-password');

submitButton.addEventListener('click', () => {
  const password = passwordInput.value;
  if (validatePassword(password)) {
    decryptAndShowContent(password);
  } else {
    showErrorMessage();
  }
});
```

## Optimization

### Image Optimization

1. **Responsive Images**: Use srcset and sizes attributes
2. **Format Selection**: WebP with JPEG fallback
3. **Compression**: Automated optimization using tools like imagemin
4. **Lazy Loading**: Load images only when they scroll into view

### Loading Animations

1. **Initial Loading**: Subtle spinner or progress indicator
2. **Page Transitions**: Smooth fade or slide transitions between pages
3. **Content Reveal**: Progressive loading of content sections
4. **Performance Considerations**: Keep animations lightweight and optional

### Performance Optimization

1. **Minification**: Compress HTML, CSS, and JavaScript
2. **Caching**: Appropriate cache headers for static assets
3. **Code Splitting**: Load JavaScript only when needed
4. **Critical CSS**: Inline critical styles
5. **Preloading**: Preload important resources
6. **Defer Non-Critical**: Defer loading of non-critical assets

## Contributing

This is a personal website, but suggestions and bug reports are welcome. Please open an issue to discuss potential changes.

## License

All rights reserved. The content and design of this website are proprietary and not licensed for reuse without explicit permission. 