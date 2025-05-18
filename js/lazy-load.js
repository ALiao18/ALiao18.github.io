/**
 * Lazy Image Loader
 * Defers loading of images until they're in or near the viewport
 */

// Options for the Intersection Observer
const OBSERVER_OPTIONS = {
  root: null, // viewport is used as the root
  rootMargin: '100px 0px', // 100px margin to start loading earlier
  threshold: 0.1 // 10% of the element must be visible
};

// Elements to lazy load (images and background elements)
const SELECTORS = {
  images: 'img[data-src]',
  backgrounds: '[data-bg-src]'
};

// Array to store loaded image URLs to prevent duplicate loading
let loadedImages = [];

/**
 * Initialize the lazy loader
 */
function initLazyLoader() {
  // Check if IntersectionObserver is supported
  if ('IntersectionObserver' in window) {
    // Create an observer instance
    const observer = new IntersectionObserver(onElementObserved, OBSERVER_OPTIONS);
    
    // Select all elements with data-src attribute and observe them
    const lazyImages = document.querySelectorAll(SELECTORS.images);
    lazyImages.forEach(image => observer.observe(image));
    
    // Select all elements with data-bg-src attribute and observe them
    const lazyBackgrounds = document.querySelectorAll(SELECTORS.backgrounds);
    lazyBackgrounds.forEach(bg => observer.observe(bg));
    
    // Listen for dynamic content changes
    listenForContentChanges(observer);
  } else {
    // Fallback for browsers that don't support IntersectionObserver
    loadAllImagesImmediately();
  }
}

/**
 * Handle observed elements that enter the viewport
 * @param {IntersectionObserverEntry[]} entries - The observed entries
 * @param {IntersectionObserver} observer - The observer instance
 */
function onElementObserved(entries, observer) {
  entries.forEach(entry => {
    // Check if the element is intersecting with the viewport
    if (entry.isIntersecting) {
      const element = entry.target;
      
      // Load the image or background
      if (element.tagName === 'IMG') {
        loadLazyImage(element);
      } else if (element.dataset.bgSrc) {
        loadLazyBackground(element);
      }
      
      // Stop observing the element
      observer.unobserve(element);
    }
  });
}

/**
 * Load an image that has entered the viewport
 * @param {HTMLImageElement} img - The image element to load
 */
function loadLazyImage(img) {
  const src = img.dataset.src;
  
  // Skip if already loaded or no source
  if (!src || loadedImages.includes(src)) return;
  
  // Get additional image attributes
  const srcset = img.dataset.srcset;
  const sizes = img.dataset.sizes;
  
  // Create a new image to preload
  const tempImage = new Image();
  
  // When the image is loaded, update the actual image element
  tempImage.onload = function() {
    if (srcset) img.srcset = srcset;
    if (sizes) img.sizes = sizes;
    img.src = src;
    
    // Add loaded class for animation if needed
    img.classList.add('lazy-loaded');
    
    // Remove data attributes to prevent future loading attempts
    clearLazyLoadAttributes(img);
    
    // Track that we've loaded this image
    loadedImages.push(src);
  };
  
  // Handle loading errors
  tempImage.onerror = function() {
    console.warn(`Failed to load image: ${src}`);
    
    // Set a fallback image or placeholder if needed
    if (img.dataset.fallback) {
      img.src = img.dataset.fallback;
    }
    
    clearLazyLoadAttributes(img);
  };
  
  // Start loading the image
  tempImage.src = src;
}

/**
 * Load a background image that has entered the viewport
 * @param {HTMLElement} element - The element to set background image for
 */
function loadLazyBackground(element) {
  const src = element.dataset.bgSrc;
  
  // Skip if already loaded or no source
  if (!src || loadedImages.includes(src)) return;
  
  // Create a new image to preload
  const tempImage = new Image();
  
  // When the image is loaded, set as background
  tempImage.onload = function() {
    element.style.backgroundImage = `url('${src}')`;
    
    // Add loaded class for animation if needed
    element.classList.add('lazy-loaded');
    
    // Remove data attribute to prevent future loading attempts
    delete element.dataset.bgSrc;
    
    // Track that we've loaded this image
    loadedImages.push(src);
  };
  
  // Handle loading errors
  tempImage.onerror = function() {
    console.warn(`Failed to load background image: ${src}`);
    
    // Set a fallback background if needed
    if (element.dataset.bgFallback) {
      element.style.backgroundImage = `url('${element.dataset.bgFallback}')`;
    }
    
    delete element.dataset.bgSrc;
  };
  
  // Start loading the image
  tempImage.src = src;
}

/**
 * Remove lazy loading data attributes from an element
 * @param {HTMLElement} element - The element to clean
 */
function clearLazyLoadAttributes(element) {
  delete element.dataset.src;
  delete element.dataset.srcset;
  delete element.dataset.sizes;
}

/**
 * Fallback for browsers without IntersectionObserver
 * Loads all images immediately
 */
function loadAllImagesImmediately() {
  const lazyImages = document.querySelectorAll(SELECTORS.images);
  lazyImages.forEach(loadLazyImage);
  
  const lazyBackgrounds = document.querySelectorAll(SELECTORS.backgrounds);
  lazyBackgrounds.forEach(loadLazyBackground);
}

/**
 * Listen for dynamic content changes to lazy load new images
 * @param {IntersectionObserver} observer - The observer instance
 */
function listenForContentChanges(observer) {
  // Use MutationObserver to detect new content
  if ('MutationObserver' in window) {
    const mutationObserver = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        // Check for newly added nodes
        mutation.addedNodes.forEach(node => {
          // Skip non-element nodes
          if (node.nodeType !== Node.ELEMENT_NODE) return;
          
          // Check if the node itself should be lazy loaded
          if ((node.tagName === 'IMG' && node.dataset.src) || 
              node.dataset.bgSrc) {
            observer.observe(node);
          }
          
          // Check for lazy load elements inside the added node
          const nestedImages = node.querySelectorAll(SELECTORS.images);
          nestedImages.forEach(img => observer.observe(img));
          
          const nestedBgs = node.querySelectorAll(SELECTORS.backgrounds);
          nestedBgs.forEach(bg => observer.observe(bg));
        });
      });
    });
    
    // Observe changes to the entire document body
    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true
    });
  }
}

/**
 * Add a new element to be lazy loaded
 * @param {HTMLElement} element - Element to observe for lazy loading
 */
function observeNewElement(element) {
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(onElementObserved, OBSERVER_OPTIONS);
    observer.observe(element);
  } else {
    // Fallback for browsers without IntersectionObserver
    if (element.tagName === 'IMG') {
      loadLazyImage(element);
    } else if (element.dataset.bgSrc) {
      loadLazyBackground(element);
    }
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initLazyLoader);

// Export public methods
window.lazyLoader = {
  observeNewElement
}; 