/**
 * Animate On Scroll (AOS)
 * Adds animations to elements as they enter the viewport
 */

// Options for the Intersection Observer
const AOS_OPTIONS = {
  root: null, // viewport is the root
  rootMargin: '0px', // no margins
  threshold: 0.15 // 15% of the element must be visible
};

// Initialize function
function initAOS() {
  // Check if IntersectionObserver is supported
  if ('IntersectionObserver' in window) {
    // Create an observer instance
    const observer = new IntersectionObserver(onElementsObserved, AOS_OPTIONS);
    
    // Select all elements with aos class
    const animateElements = document.querySelectorAll('.aos');
    animateElements.forEach(element => observer.observe(element));
    
    // Add staggered animation handling
    initStaggeredAnimations();
    
    // Listen for dynamic content changes
    listenForContentChanges(observer);
  } else {
    // Fallback for browsers that don't support IntersectionObserver
    showAllAnimatedElements();
  }
}

/**
 * Handler for when elements are observed entering the viewport
 * @param {IntersectionObserverEntry[]} entries - Observed entries
 * @param {IntersectionObserver} observer - Observer instance
 */
function onElementsObserved(entries, observer) {
  entries.forEach(entry => {
    // Check if the element is intersecting with the viewport
    if (entry.isIntersecting) {
      const element = entry.target;
      
      // Add class to trigger animation
      element.classList.add('in-view');
      
      // If this is a stagger-children container, animate it
      if (element.classList.contains('stagger-children')) {
        element.classList.add('animate');
      }
      
      // Stop observing the element (animate only once)
      observer.unobserve(element);
    }
  });
}

/**
 * Initialize staggered animations
 */
function initStaggeredAnimations() {
  // Check if there are any staggered animation containers already in view
  const staggerContainers = document.querySelectorAll('.stagger-children');
  
  staggerContainers.forEach(container => {
    // If container is already in viewport, animate it immediately
    if (isElementInViewport(container)) {
      container.classList.add('animate');
    }
  });
}

/**
 * Listen for dynamic content changes to animate new elements
 * @param {IntersectionObserver} observer - Observer instance
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
          
          // Check if the node itself should be animated
          if (node.classList.contains('aos')) {
            observer.observe(node);
          }
          
          // Check for animated elements inside the added node
          const nestedAnimations = node.querySelectorAll('.aos');
          nestedAnimations.forEach(el => observer.observe(el));
          
          // Check for staggered containers
          if (node.classList.contains('stagger-children')) {
            if (isElementInViewport(node)) {
              node.classList.add('animate');
            }
          }
          
          const nestedStaggered = node.querySelectorAll('.stagger-children');
          nestedStaggered.forEach(container => {
            if (isElementInViewport(container)) {
              container.classList.add('animate');
            }
          });
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
 * Check if an element is currently in the viewport
 * @param {HTMLElement} element - The element to check
 * @returns {boolean} - Whether the element is in viewport
 */
function isElementInViewport(element) {
  const rect = element.getBoundingClientRect();
  
  return (
    rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.bottom >= 0 &&
    rect.left <= (window.innerWidth || document.documentElement.clientWidth) &&
    rect.right >= 0
  );
}

/**
 * Fallback for browsers without IntersectionObserver
 * Shows all animated elements immediately
 */
function showAllAnimatedElements() {
  // Show all AOS elements
  const animateElements = document.querySelectorAll('.aos');
  animateElements.forEach(element => {
    element.classList.add('in-view');
  });
  
  // Animate all stagger containers
  const staggerContainers = document.querySelectorAll('.stagger-children');
  staggerContainers.forEach(container => {
    container.classList.add('animate');
  });
}

/**
 * Add AOS animation to a newly added element
 * @param {HTMLElement} element - Element to animate
 * @param {string} type - Animation type (fade-up, fade-left, etc.)
 */
function animateElement(element, type = 'fade-up') {
  if (!element) return;
  
  // Add appropriate classes
  element.classList.add('aos');
  element.classList.add(`aos-${type}`);
  
  // Check if the element is already in view
  if (isElementInViewport(element)) {
    setTimeout(() => {
      element.classList.add('in-view');
    }, 100);
  } else if ('IntersectionObserver' in window) {
    // Otherwise, observe it
    const observer = new IntersectionObserver(onElementsObserved, AOS_OPTIONS);
    observer.observe(element);
  } else {
    // Fallback
    element.classList.add('in-view');
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initAOS);

// Export public methods
window.AOS = {
  refresh: initAOS,
  animate: animateElement
}; 