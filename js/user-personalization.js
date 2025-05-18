/**
 * User Personalization Script
 * Customizes the website based on user type selection
 * (recruiter, academic, personal)
 */

// Constants
const PERSONAL_AUTH_KEY = 'auth_token';
const USER_TYPE_KEY = 'user_type';
const VALID_USER_TYPES = ['recruiter', 'academic', 'personal'];

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initializePersonalization);

/**
 * Initialize website personalization
 * Gets user type from URL params or localStorage and applies customizations
 */
function initializePersonalization() {
  // Get user type from URL or localStorage
  const urlParams = new URLSearchParams(window.location.search);
  const paramUserType = urlParams.get('user');
  const storedUserType = localStorage.getItem(USER_TYPE_KEY);
  
  // Determine which user type to use
  let userType = null;
  
  if (paramUserType && VALID_USER_TYPES.includes(paramUserType)) {
    userType = paramUserType;
    localStorage.setItem(USER_TYPE_KEY, userType);
  } else if (storedUserType && VALID_USER_TYPES.includes(storedUserType)) {
    userType = storedUserType;
  }
  
  // If a valid user type was found, apply that personalization
  if (userType) {
    // For personal section, verify auth token
    if (userType === 'personal') {
      const authToken = localStorage.getItem(PERSONAL_AUTH_KEY);
      if (!authToken) {
        // No auth token, redirect to welcome page
        redirectToWelcome();
        return;
      }
    }
    
    applyPersonalization(userType);
  }
  
  // Add user type selector to site if user is logged in
  addUserTypeIndicator(userType);
}

/**
 * Apply personalizations based on user type
 * @param {string} userType - The user type (recruiter, academic, personal)
 */
function applyPersonalization(userType) {
  // Add a class to the body to enable CSS targeting
  document.body.setAttribute('data-user-type', userType);
  
  // Apply specific personalization logic based on user type
  switch (userType) {
    case 'recruiter':
      personalizeForRecruiter();
      break;
    case 'academic':
      personalizeForAcademic();
      break;
    case 'personal':
      personalizeForPersonal();
      break;
  }
  
  // Dispatch an event that other scripts can listen for
  document.dispatchEvent(new CustomEvent('userTypeChanged', { 
    detail: { userType: userType }
  }));
}

/**
 * Add a small indicator in the nav to show current user type and allow switching
 * @param {string} userType - The current user type
 */
function addUserTypeIndicator(userType) {
  if (!userType) return;
  
  // Create indicator element if it doesn't exist
  const navbar = document.querySelector('.navbar .nav-right');
  if (!navbar) return;
  
  let indicator = document.getElementById('user-type-indicator');
  if (!indicator) {
    indicator = document.createElement('div');
    indicator.id = 'user-type-indicator';
    indicator.className = 'user-type-indicator';
    indicator.setAttribute('title', 'Click to change user type view');
    indicator.setAttribute('aria-label', 'Current user type: ' + userType);
    
    // Create icon based on user type
    const icon = document.createElement('span');
    icon.className = 'user-type-icon';
    
    // Set icon content based on user type
    switch (userType) {
      case 'recruiter':
        icon.textContent = '💼';
        break;
      case 'academic': 
        icon.textContent = '🎓';
        break;
      case 'personal':
        icon.textContent = '👋';
        break;
    }
    
    indicator.appendChild(icon);
    
    // Add event listener to redirect to welcome page
    indicator.addEventListener('click', () => {
      window.location.href = 'welcome.html';
    });
    
    // Insert before language selector
    const langSelector = document.getElementById('language-selector');
    if (langSelector) {
      navbar.insertBefore(indicator, langSelector);
    } else {
      navbar.appendChild(indicator);
    }
  }
}

/**
 * Personalize for recruiters
 * Emphasize professional accomplishments, projects, and skills
 */
function personalizeForRecruiter() {
  // Highlight professional sections
  highlightNavLink('projects');
  highlightNavLink('cv');
  
  // Show recruiter-specific content
  document.querySelectorAll('.recruiter-only').forEach(el => {
    el.style.display = 'block';
  });
  
  // Add recruiter-specific elements dynamically if they don't exist yet
  const main = document.querySelector('main');
  if (main) {
    // Check if we already created the recruiter section
    if (!document.querySelector('.recruiter-highlight')) {
      // Find the position to insert (after first section)
      const firstSection = main.querySelector('section');
      if (firstSection) {
        const recruiterSection = document.createElement('section');
        recruiterSection.className = 'recruiter-highlight';
        
        recruiterSection.innerHTML = `
          <div class="content-wrapper">
            <h2 data-i18n="recruiter.highlight.title">Skills Highlight</h2>
            <div class="skills-container">
              <div class="skill-category">
                <h3 data-i18n="recruiter.skills.languages">Programming Languages</h3>
                <div class="skills-grid">
                  <span class="skill-tag">Python</span>
                  <span class="skill-tag">JavaScript</span>
                  <span class="skill-tag">TypeScript</span>
                  <span class="skill-tag">C++</span>
                  <span class="skill-tag">Java</span>
                </div>
              </div>
              <div class="skill-category">
                <h3 data-i18n="recruiter.skills.frameworks">Frameworks & Libraries</h3>
                <div class="skills-grid">
                  <span class="skill-tag">PyTorch</span>
                  <span class="skill-tag">TensorFlow</span>
                  <span class="skill-tag">React</span>
                  <span class="skill-tag">Node.js</span>
                  <span class="skill-tag">Django</span>
                </div>
              </div>
            </div>
          </div>
        `;
        
        firstSection.after(recruiterSection);
      }
    }
  }
}

/**
 * Personalize for academics
 * Emphasize research, publications, and academic background
 */
function personalizeForAcademic() {
  // Highlight academic sections
  highlightNavLink('publications');
  highlightNavLink('notes');
  
  // Show academic-specific content
  document.querySelectorAll('.academic-only').forEach(el => {
    el.style.display = 'block';
  });
  
  // Add academic-specific elements if they don't exist
  const main = document.querySelector('main');
  if (main) {
    // Check if we already created the academic highlight section
    if (!document.querySelector('.academic-highlight')) {
      // Find the position to insert (after first section)
      const firstSection = main.querySelector('section');
      if (firstSection) {
        const academicSection = document.createElement('section');
        academicSection.className = 'academic-highlight';
        
        academicSection.innerHTML = `
          <div class="content-wrapper">
            <h2 data-i18n="academic.highlight.title">Research Interests</h2>
            <p data-i18n="academic.highlight.description">My current research focuses on reinforcement learning, explainable AI, and physics-informed machine learning. I'm particularly interested in developing robust world models and their applications in healthcare.</p>
            <div class="research-areas">
              <div class="research-area">
                <h3 data-i18n="academic.research.area1.title">Reinforcement Learning</h3>
                <p data-i18n="academic.research.area1.description">Working on sample-efficient and robust RL algorithms for real-world applications.</p>
              </div>
              <div class="research-area">
                <h3 data-i18n="academic.research.area2.title">Explainable AI</h3>
                <p data-i18n="academic.research.area2.description">Developing techniques to make deep learning models more transparent and interpretable.</p>
              </div>
            </div>
          </div>
        `;
        
        firstSection.after(academicSection);
      }
    }
  }
}

/**
 * Personalize for personal contacts
 * Show more personal content, photos, and private information
 */
function personalizeForPersonal() {
  // Verify auth token
  const authToken = localStorage.getItem(PERSONAL_AUTH_KEY);
  if (!authToken) {
    redirectToWelcome();
    return;
  }

  // Show personal-only content
  document.querySelectorAll('.personal-only').forEach(el => {
    el.style.display = 'block';
  });
  
  // Add personal content if it doesn't exist
  const main = document.querySelector('main');
  if (main) {
    // Check if we already created the personal section
    if (!document.querySelector('.personal-highlight')) {
      // Find the position to insert (after first section)
      const firstSection = main.querySelector('section');
      if (firstSection) {
        const personalSection = document.createElement('section');
        personalSection.className = 'personal-highlight';
        
        personalSection.innerHTML = `
          <div class="content-wrapper">
            <h2 data-i18n="personal.highlight.title">Personal Updates</h2>
            <p data-i18n="personal.highlight.description">Hey friends! Thanks for stopping by my website. Here are some recent personal updates:</p>
            <div class="personal-updates">
              <div class="personal-update">
                <h3 data-i18n="personal.update1.title">Recent Trip</h3>
                <p data-i18n="personal.update1.description">Photos from my recent trip to Taiwan. Visited family and explored some beautiful places.</p>
                <div class="photo-gallery">
                  <div class="photo-placeholder">Photo 1</div>
                  <div class="photo-placeholder">Photo 2</div>
                  <div class="photo-placeholder">Photo 3</div>
                </div>
              </div>
            </div>
            <div class="private-section">
              <h3 data-i18n="personal.private.title">Private Content</h3>
              <p data-i18n="personal.private.description">This section is only visible to friends and family with the password.</p>
            </div>
          </div>
        `;
        
        firstSection.after(personalSection);
      }
    }
  }
}

/**
 * Helper to visually emphasize a specific navigation link
 * @param {string} linkHref - The href attribute value of the link to highlight
 */
function highlightNavLink(linkHref) {
  const navLinks = document.querySelectorAll('.navbar a');
  navLinks.forEach(link => {
    if (link.getAttribute('href')?.includes(linkHref)) {
      link.classList.add('recommended');
    }
  });
}

/**
 * Redirect to the welcome page
 */
function redirectToWelcome() {
  // Only redirect if we're not already on the welcome page
  if (!window.location.pathname.includes('welcome.html')) {
    window.location.href = 'welcome.html';
  }
}

// Export for use in other scripts
window.personalization = {
  getUserType: () => localStorage.getItem(USER_TYPE_KEY),
  checkAuthToken: () => localStorage.getItem(PERSONAL_AUTH_KEY),
  clearUserType: () => {
    localStorage.removeItem(USER_TYPE_KEY);
    localStorage.removeItem(PERSONAL_AUTH_KEY);
  }
}; 