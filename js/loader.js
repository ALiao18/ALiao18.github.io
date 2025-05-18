/**
 * Loading Animation Controller
 * Manages page transitions and loading animations
 */

// DOM elements
let loaderElement;
let overlayElement;

// Configuration options
const LOADER_SETTINGS = {
  minDisplayTime: 300, // Minimum time to show loader (ms)
  fadeOutDuration: 300, // Fade out transition time (ms)
  showDelayThreshold: 100, // Show loader only if page takes longer than this (ms)
  spinnerSize: 40, // Size of the spinner in pixels
  spinnerColor: 'currentColor', // Color of the spinner
};

// Initialization function
function initLoader() {
  // Create the loader overlay if it doesn't exist
  if (!document.getElementById('page-loader-overlay')) {
    createLoaderElements();
  }
  
  // Set up event listeners for page transitions
  setupEventListeners();
  
  // Add a class to the body to enable page transition styling
  document.body.classList.add('has-loader');
  
  // Hide loader on initial page load
  window.addEventListener('load', hideLoader);
  
  // Show loader initially
  showLoader();
}

// Create the loader DOM elements
function createLoaderElements() {
  // Create the overlay
  overlayElement = document.createElement('div');
  overlayElement.id = 'page-loader-overlay';
  overlayElement.className = 'loader-overlay';
  
  // Create the spinner
  loaderElement = document.createElement('div');
  loaderElement.id = 'page-loader';
  loaderElement.className = 'loader-spinner';
  
  // Add spinner to overlay, and overlay to document
  overlayElement.appendChild(loaderElement);
  document.body.appendChild(overlayElement);
  
  // Apply inline styles for the overlay
  const overlayStyle = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: var(--background-color, #f0f0f0);
    z-index: 9999;
    display: flex;
    justify-content: center;
    align-items: center;
    opacity: 0;
    transition: opacity ${LOADER_SETTINGS.fadeOutDuration}ms ease-out;
    pointer-events: none;
  `;
  
  // Apply inline styles for the spinner
  const spinnerStyle = `
    width: ${LOADER_SETTINGS.spinnerSize}px;
    height: ${LOADER_SETTINGS.spinnerSize}px;
    border: 3px solid rgba(0, 0, 0, 0.1);
    border-top: 3px solid var(--accent-color, #000);
    border-radius: 50%;
    animation: spin 1s linear infinite;
  `;
  
  // Add styles to the head
  const styleTag = document.createElement('style');
  styleTag.innerHTML = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    
    .dark-mode #page-loader-overlay {
      background-color: var(--background-color, #121212);
    }
    
    .dark-mode #page-loader {
      border: 3px solid rgba(255, 255, 255, 0.1);
      border-top: 3px solid var(--accent-color, #bb86fc);
    }
    
    .loader-visible {
      opacity: 1 !important;
      pointer-events: all !important;
    }
  `;
  
  document.head.appendChild(styleTag);
  
  // Apply the styles
  overlayElement.setAttribute('style', overlayStyle);
  loaderElement.setAttribute('style', spinnerStyle);
}

// Set up event listeners for page navigation
function setupEventListeners() {
  // Show loader when clicking on internal links
  document.addEventListener('click', function(event) {
    // Check if clicked element is a link
    let target = event.target;
    while (target && target !== document) {
      if (target.tagName === 'A') {
        const href = target.getAttribute('href');
        
        // Only handle internal links that aren't anchors
        if (href && href.startsWith('/') || 
            (href.indexOf('://') === -1 && !href.startsWith('#') && !href.startsWith('javascript:'))) {
          
          showLoader();
        }
        break;
      }
      target = target.parentNode;
    }
  });
  
  // Show loader on form submissions
  document.addEventListener('submit', function(event) {
    // Only handle forms that will navigate the page
    const form = event.target;
    if (form.method === 'get' || form.method === 'post') {
      showLoader();
    }
  });
}

// Show the loading animation
function showLoader() {
  if (!overlayElement) return;
  
  // Only show loader for slow page loads
  let loaderTimeout = setTimeout(() => {
    overlayElement.classList.add('loader-visible');
  }, LOADER_SETTINGS.showDelayThreshold);
  
  // Store the timeout ID so we can clear it if the page loads quickly
  overlayElement.dataset.loaderTimeout = loaderTimeout;
  overlayElement.dataset.showTime = Date.now();
}

// Hide the loading animation
function hideLoader() {
  if (!overlayElement) return;
  
  // Clear any pending timeout for showing the loader
  const timeoutId = parseInt(overlayElement.dataset.loaderTimeout);
  if (timeoutId) {
    clearTimeout(timeoutId);
  }
  
  // Calculate how long the loader has been visible
  const showTime = parseInt(overlayElement.dataset.showTime) || 0;
  const elapsedTime = Date.now() - showTime;
  
  // Ensure the loader is shown for at least the minimum time
  if (elapsedTime < LOADER_SETTINGS.minDisplayTime) {
    setTimeout(() => {
      overlayElement.classList.remove('loader-visible');
    }, LOADER_SETTINGS.minDisplayTime - elapsedTime);
  } else {
    overlayElement.classList.remove('loader-visible');
  }
}

// Initialize on document ready
document.addEventListener('DOMContentLoaded', initLoader);

// Export public methods
window.pageLoader = {
  show: showLoader,
  hide: hideLoader
}; 