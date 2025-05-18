/**
 * Internationalization (i18n) handler for the website
 * Manages language switching and text translation
 */

// Default language settings
const DEFAULT_LANG = 'en';
const SUPPORTED_LANGS = ['en', 'zh'];
const LANG_STORAGE_KEY = 'preferred_language';

// Cache for the loaded translations
let translations = {};
let currentLang = DEFAULT_LANG;

/**
 * Initialize the i18n system
 * Detects user's preferred language and loads the appropriate translations
 */
async function initializeI18n() {
  // Check for stored preference
  const storedLang = localStorage.getItem(LANG_STORAGE_KEY);
  
  // Check URL param for language
  const urlParams = new URLSearchParams(window.location.search);
  const paramLang = urlParams.get('lang');
  
  // Check browser language
  const browserLang = navigator.language.split('-')[0];
  
  // Determine which language to use
  let detectedLang = storedLang || paramLang || 
                    (SUPPORTED_LANGS.includes(browserLang) ? browserLang : DEFAULT_LANG);
  
  // Load translations and update UI
  await setLanguage(detectedLang);
  
  // Setup language selector
  setupLanguageSelector();
}

/**
 * Set the active language and update the UI
 * @param {string} lang - The language code to use (e.g., 'en', 'zh')
 */
async function setLanguage(lang) {
  if (!SUPPORTED_LANGS.includes(lang)) {
    console.warn(`Language ${lang} is not supported. Falling back to ${DEFAULT_LANG}`);
    lang = DEFAULT_LANG;
  }
  
  // Set document language attribute
  document.documentElement.lang = lang;
  document.documentElement.setAttribute('data-lang', lang);
  
  // Load translations if not already loaded
  if (!translations[lang]) {
    try {
      const response = await fetch(`/locales/${lang}.json`);
      if (!response.ok) throw new Error(`Failed to load translations for ${lang}`);
      translations[lang] = await response.json();
    } catch (error) {
      console.error('Error loading translations:', error);
      return;
    }
  }
  
  // Update current language
  currentLang = lang;
  localStorage.setItem(LANG_STORAGE_KEY, lang);
  
  // Add fade transition to content
  document.body.classList.add('fade-out');
  
  // Translate the page
  setTimeout(() => {
    translatePage();
    document.body.classList.remove('fade-out');
  }, 150);
  
  // Update the language selector
  updateLanguageSelector();
}

/**
 * Add translations to the current translation set
 * @param {string} lang - The language code to add translations for
 * @param {object} newTranslations - The translations to add
 */
function addTranslations(lang, newTranslations) {
  if (!SUPPORTED_LANGS.includes(lang)) {
    console.warn(`Language ${lang} is not supported.`);
    return;
  }
  
  if (!translations[lang]) {
    translations[lang] = {};
  }
  
  // Deep merge the translations
  translations[lang] = deepMerge(translations[lang], newTranslations);
  
  // If this is the current language, retranslate the page
  if (currentLang === lang) {
    translatePage();
  }
}

/**
 * Deep merge two objects
 * @param {object} target - Target object
 * @param {object} source - Source object
 * @returns {object} - Merged object
 */
function deepMerge(target, source) {
  const output = Object.assign({}, target);
  
  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach(key => {
      if (isObject(source[key])) {
        if (!(key in target)) {
          Object.assign(output, { [key]: source[key] });
        } else {
          output[key] = deepMerge(target[key], source[key]);
        }
      } else {
        Object.assign(output, { [key]: source[key] });
      }
    });
  }
  
  return output;
}

/**
 * Check if a value is an object
 * @param {*} item - Item to check
 * @returns {boolean} - Whether the item is an object
 */
function isObject(item) {
  return (item && typeof item === 'object' && !Array.isArray(item));
}

/**
 * Translate the entire page based on data-i18n attributes
 */
function translatePage() {
  const currentTranslations = translations[currentLang];
  if (!currentTranslations) return;
  
  // Update the document title
  const titleKey = document.body.dataset.titleKey;
  if (titleKey) {
    const titleParts = titleKey.split('.');
    let titleValue = currentTranslations;
    for (const part of titleParts) {
      if (!titleValue[part]) break;
      titleValue = titleValue[part];
    }
    if (typeof titleValue === 'string') {
      document.title = titleValue;
    }
  }
  
  // Update elements with data-i18n attribute
  document.querySelectorAll('[data-i18n]').forEach(element => {
    const key = element.dataset.i18n;
    const keyParts = key.split('.');
    
    let value = currentTranslations;
    for (const part of keyParts) {
      if (!value[part]) break;
      value = value[part];
    }
    
    if (typeof value === 'string') {
      // Special handling for elements with HTML content
      if (element.dataset.i18nHtml === 'true') {
        element.innerHTML = value;
      } else {
        element.textContent = value;
      }
    }
  });
  
  // Update elements with data-i18n-attr attributes (for attributes like placeholder, aria-label, etc.)
  document.querySelectorAll('[data-i18n-attr]').forEach(element => {
    const attributesToTranslate = element.dataset.i18nAttr.split(',');
    
    attributesToTranslate.forEach(attrSpec => {
      const [attr, key] = attrSpec.trim().split(':');
      if (!attr || !key) return;
      
      const keyParts = key.split('.');
      let value = currentTranslations;
      
      for (const part of keyParts) {
        if (!value[part]) break;
        value = value[part];
      }
      
      if (typeof value === 'string') {
        element.setAttribute(attr, value);
      }
    });
  });
  
  // Emit a custom event that other components can listen for
  document.dispatchEvent(new CustomEvent('languageChanged', { detail: { language: currentLang } }));
}

/**
 * Setup the language selector in the navigation
 */
function setupLanguageSelector() {
  const container = document.getElementById('language-selector');
  if (!container) return;
  
  // Create language selector dropdown if it doesn't exist
  if (container.children.length === 0) {
    const dropdown = document.createElement('select');
    dropdown.id = 'language-dropdown';
    dropdown.setAttribute('aria-label', 'Select language');
    
    SUPPORTED_LANGS.forEach(lang => {
      const option = document.createElement('option');
      option.value = lang;
      
      // Try to get native language name from translations
      let languageName;
      try {
        if (translations[lang]?.meta?.nativeName) {
          languageName = translations[lang].meta.nativeName;
        } else {
          // Fallback names if translations aren't loaded yet
          languageName = lang === 'en' ? 'English' : (lang === 'zh' ? '繁體中文' : lang.toUpperCase());
        }
      } catch (e) {
        languageName = lang.toUpperCase();
      }
      
      option.textContent = languageName;
      dropdown.appendChild(option);
    });
    
    dropdown.addEventListener('change', (e) => {
      setLanguage(e.target.value);
    });
    
    container.appendChild(dropdown);
  }
  
  updateLanguageSelector();
}

/**
 * Update the language selector to reflect the current language
 */
function updateLanguageSelector() {
  const dropdown = document.getElementById('language-dropdown');
  if (dropdown) {
    dropdown.value = currentLang;
  }
}

/**
 * Get a translation by key
 * @param {string} key - The translation key, using dot notation (e.g., 'common.nav.home')
 * @param {object} replacements - Optional key-value pairs for variable replacements
 * @returns {string} The translated text
 */
function translate(key, replacements = {}) {
  const keyParts = key.split('.');
  let value = translations[currentLang];
  
  for (const part of keyParts) {
    if (!value || !value[part]) {
      console.warn(`Translation key not found: ${key}`);
      return key;
    }
    value = value[part];
  }
  
  if (typeof value !== 'string') {
    console.warn(`Translation key is not a string: ${key}`);
    return key;
  }
  
  // Handle variable replacements
  if (Object.keys(replacements).length > 0) {
    Object.entries(replacements).forEach(([placeholder, replacement]) => {
      value = value.replace(new RegExp(`{{${placeholder}}}`, 'g'), replacement);
    });
  }
  
  return value;
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initializeI18n);

// Export functions for use in other scripts
window.i18n = {
  setLanguage,
  translate,
  getCurrentLanguage: () => currentLang,
  addTranslations
}; 