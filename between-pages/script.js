/**
 * ============================================================================
 * BETWEEN PAGES — Application Script
 * A Personal Digital Library & Reading Journal
 * ============================================================================
 * Clean vanilla JavaScript handling all application logic, Local Storage
 * persistence, UI state transitions, responsive interactions, and audio feedback.
 */

// Global Application State Object
const AppState = {
  books: [],
  shelves: [],
  journalEntries: [],
  quotes: [],
  goals: {
    annualTarget: 24,
    monthlyTarget: 2,
    dailyMinutesTarget: 30,
    dailyMinutesLogged: 0,
    lastActiveDate: '',
    streakDays: 0
  },
  theme: 'light',
  activeView: 'overview',
  libraryFilter: {
    status: 'all',
    genre: 'all',
    mood: 'all',
    shelf: 'all',
    sort: 'dateAdded-desc',
    search: '',
    viewMode: 'grid'
  },
  activeShelfId: null,
  activeDetailBookId: null,
  ambientTimer: {
    intervalId: null,
    totalSeconds: 25 * 60,
    remainingSeconds: 25 * 60,
    isRunning: false
  }
};

// Storage Keys Constants
const STORAGE_KEYS = {
  BOOKS: 'between_pages_books_v1',
  SHELVES: 'between_pages_shelves_v1',
  JOURNAL: 'between_pages_journal_v1',
  QUOTES: 'between_pages_quotes_v1',
  GOALS: 'between_pages_goals_v1',
  THEME: 'between_pages_theme_v1',
  DEMO_DISMISSED: 'between_pages_demo_dismissed_v1'
};

// Public Domain & Classic Literary Inspiration Quotes Collection
const LITERARY_INSPIRATION_QUOTES = [
  { text: "I have always imagined that Paradise will be a kind of library.", author: "Jorge Luis Borges" },
  { text: "There is no friend as loyal as a book.", author: "Ernest Hemingway" },
  { text: "You can never get a cup of tea large enough or a book long enough to suit me.", author: "C.S. Lewis" },
  { text: "She read books as one would breathe air, to fill up and live.", author: "Annie Dillard" },
  { text: "There is no charm equal to tenderness of heart.", author: "Jane Austen" },
  { text: "Books are a uniquely portable magic.", author: "Stephen King" },
  { text: "I declare after all there is no enjoyment like reading!", author: "Jane Austen" },
  { text: "To learn to read is to light a fire; every syllable that is spelled out is a spark.", author: "Victor Hugo" },
  { text: "We read to know we are not alone.", author: "C.S. Lewis" },
  { text: "Until I feared I would lose it, I never loved to read. One does not love breathing.", author: "Harper Lee" },
  { text: "A room without books is like a body without a soul.", author: "Cicero" }
];

// Predefined Shelf Suggestions
const DEFAULT_SHELVES = [
  { id: 'shelf-classics', name: 'The Classics', description: 'Timeless masterpieces of world literature.', color: '#C98F98', isDefault: true },
  { id: 'shelf-love', name: 'Love & Longing', description: 'Stories of deep affection, heartbreak and devotion.', color: '#805B6B', isDefault: true },
  { id: 'shelf-philosophy', name: 'Philosophy Corner', description: 'Profound questions on human existence and meaning.', color: '#6F8877', isDefault: true },
  { id: 'shelf-mystery', name: 'Mystery & Mayhem', description: 'Enigmas, suspense, and dark corridors.', color: '#6B7B94', isDefault: true },
  { id: 'shelf-comfort', name: 'Comfort Reads', description: 'Gentle stories like warm tea on rainy afternoons.', color: '#BA7E66', isDefault: true },
  { id: 'shelf-afterdark', name: 'After Dark', description: 'Gothic atmosphere, shadows, and moody tales.', color: '#544B47', isDefault: true }
];

// 5 Curated Demo Books as Specified in Technical Requirements
const DEMO_BOOKS = [
  {
    id: 'demo-1',
    title: 'The Brothers Karamazov',
    author: 'Fyodor Dostoevsky',
    coverUrl: 'https://covers.openlibrary.org/b/id/12848529-M.jpg',
    genre: 'Philosophy',
    format: 'Hardcover',
    totalPages: 840,
    currentPage: 345,
    status: 'Currently Reading',
    rating: 5,
    moods: ['Thought-provoking', 'Dark & Twisted'],
    shelves: ['shelf-classics', 'shelf-philosophy'],
    dateStarted: '2026-10-12',
    dateFinished: '',
    review: "A monumental exploration of faith, doubt, morality, and brotherly love. Ivan's poem 'The Grand Inquisitor' remains one of the most piercing pieces of literature ever written.",
    notes: 'Reading the translation with commentary. The psychological depth of Alyosha and Dmitri is breathtaking.',
    dateAdded: '2026-10-10T10:00:00.000Z',
    isDemo: true
  },
  {
    id: 'demo-2',
    title: 'The Picture of Dorian Gray',
    author: 'Oscar Wilde',
    coverUrl: 'https://covers.openlibrary.org/b/id/12715764-M.jpg',
    genre: 'Classics',
    format: 'Paperback',
    totalPages: 272,
    currentPage: 272,
    status: 'Completed',
    rating: 5,
    moods: ['Dark & Twisted', 'Thought-provoking'],
    shelves: ['shelf-classics', 'shelf-afterdark'],
    dateStarted: '2026-09-01',
    dateFinished: '2026-09-18',
    review: "Brilliantly cynical, poetic, and hypnotic. Wilde's epigrams sparkle on every page while chronicling the soul's gradual decay.",
    notes: 'Lord Henry Wotton is delightfully wicked. Loved the lavish Victorian aesthetic.',
    dateAdded: '2026-08-28T14:30:00.000Z',
    isDemo: true
  },
  {
    id: 'demo-3',
    title: 'Pride and Prejudice',
    author: 'Jane Austen',
    coverUrl: 'https://covers.openlibrary.org/b/id/14352704-M.jpg',
    genre: 'Romance',
    format: 'Hardcover',
    totalPages: 432,
    currentPage: 432,
    status: 'Completed',
    rating: 5,
    moods: ['Romantic', 'Comfort Read', 'Funny'],
    shelves: ['shelf-classics', 'shelf-love', 'shelf-comfort'],
    dateStarted: '2026-08-10',
    dateFinished: '2026-08-25',
    review: "Endlessly re-readable. Elizabeth Bennet's quick wit and Mr. Darcy's painful journey towards humility make this an absolute masterpiece of romantic fiction.",
    notes: 'The letter at Rosings Park changes everything. A perfect cosy comfort read.',
    dateAdded: '2026-08-05T09:15:00.000Z',
    isDemo: true
  },
  {
    id: 'demo-4',
    title: 'The Stranger',
    author: 'Albert Camus',
    coverUrl: 'https://covers.openlibrary.org/b/id/8231990-M.jpg',
    genre: 'Philosophy',
    format: 'Paperback',
    totalPages: 123,
    currentPage: 123,
    status: 'Completed',
    rating: 4,
    moods: ['Thought-provoking', 'Mind-bending'],
    shelves: ['shelf-philosophy'],
    dateStarted: '2026-07-02',
    dateFinished: '2026-07-06',
    review: "Stark, detached, and deeply unsettling. Meursault's passive observation of his own life and trial forces the reader to confront existential absurdity.",
    notes: 'Short yet haunting. The courtroom scenes demonstrate society demanding performative grief.',
    dateAdded: '2026-07-01T12:00:00.000Z',
    isDemo: true
  },
  {
    id: 'demo-5',
    title: 'Wuthering Heights',
    author: 'Emily Brontë',
    coverUrl: 'https://covers.openlibrary.org/b/id/12586749-M.jpg',
    genre: 'Romance',
    format: 'Paperback',
    totalPages: 416,
    currentPage: 0,
    status: 'Want to Read',
    rating: null,
    moods: ['Heartbreaking', 'Dark & Twisted', 'Romantic'],
    shelves: ['shelf-classics', 'shelf-love', 'shelf-afterdark'],
    dateStarted: '',
    dateFinished: '',
    review: '',
    notes: 'Recommended for stormy autumn nights. Looking forward to experiencing Heathcliff and Catherine on the moors.',
    dateAdded: '2026-10-15T16:20:00.000Z',
    isDemo: true
  }
];

// Sample Demo Quotes & Journal Reflections
const DEMO_QUOTES = [
  {
    id: 'quote-demo-1',
    text: 'Whatever our souls are made of, his and mine are the same.',
    bookTitle: 'Wuthering Heights',
    author: 'Emily Brontë',
    page: '82',
    date: '2026-10-16',
    isDemo: true
  },
  {
    id: 'quote-demo-2',
    text: 'The mystery of human existence lies not in just staying alive, but in finding something to live for.',
    bookTitle: 'The Brothers Karamazov',
    author: 'Fyodor Dostoevsky',
    page: '238',
    date: '2026-10-18',
    isDemo: true
  },
  {
    id: 'quote-demo-3',
    text: 'To define is to limit.',
    bookTitle: 'The Picture of Dorian Gray',
    author: 'Oscar Wilde',
    page: '191',
    date: '2026-09-15',
    isDemo: true
  },
  {
    id: 'quote-demo-4',
    text: 'I must learn to be content with being happier than I deserve.',
    bookTitle: 'Pride and Prejudice',
    author: 'Jane Austen',
    page: '378',
    date: '2026-08-24',
    isDemo: true
  }
];

const DEMO_JOURNAL = [
  {
    id: 'journal-demo-1',
    bookId: 'demo-2',
    bookTitle: 'The Picture of Dorian Gray',
    favCharacter: 'Lord Henry Wotton',
    thoughts: 'How society values youth, external beauty, and hedonism over integrity of soul.',
    impression: 'Aesthetic, intoxicating, and cautionary',
    reviewText: 'Wilde writes with an elegance that feels almost sinful. Every aphorism is polished like a gem, yet beneath the wit lies an existential horror about what happens when you sever actions from conscience.',
    date: '2026-09-18',
    isDemo: true
  },
  {
    id: 'journal-demo-2',
    bookId: 'demo-3',
    bookTitle: 'Pride and Prejudice',
    favCharacter: 'Elizabeth Bennet',
    thoughts: 'The bravery required to admit you were wrong about someone and revise your first impression.',
    impression: 'Warm, witty, and profoundly comforting',
    reviewText: 'There is something eternal about Elizabeth and Darcy. Every conversation crackles with intellectual tension and subtle vulnerability.',
    date: '2026-08-25',
    isDemo: true
  }
];

// Predefined Palette for Procedural Book Covers
const COVER_PALETTES = [
  { bg: '#5A3540', border: '#E8D2AA', text: '#FAF4EB' }, // Muted Wine
  { bg: '#344738', border: '#E5D6B6', text: '#FAF6EE' }, // Antique Forest
  { bg: '#2B394A', border: '#D9C8A9', text: '#F4F7FB' }, // Midnight Slate
  { bg: '#6B4234', border: '#EACDA3', text: '#FDFBF7' }, // Vintage Terracotta
  { bg: '#4A3449', border: '#E7D1B5', text: '#FAF5FB' }, // Velvet Plum
  { bg: '#403833', border: '#DEC8A0', text: '#F9F5EE' }  // Warm Umber
];

/* ============================================================================
   1. LOCAL STORAGE OPERATIONS & INITIALIZATION
   ============================================================================ */

/**
 * Loads all application data from browser Local Storage.
 * Falls back to clean defaults if nothing is saved yet.
 */
function loadDataFromStorage() {
  try {
    const savedBooks = localStorage.getItem(STORAGE_KEYS.BOOKS);
    AppState.books = savedBooks ? JSON.parse(savedBooks) : [];

    const savedShelves = localStorage.getItem(STORAGE_KEYS.SHELVES);
    AppState.shelves = savedShelves ? JSON.parse(savedShelves) : JSON.parse(JSON.stringify(DEFAULT_SHELVES));

    const savedJournal = localStorage.getItem(STORAGE_KEYS.JOURNAL);
    AppState.journalEntries = savedJournal ? JSON.parse(savedJournal) : [];

    const savedQuotes = localStorage.getItem(STORAGE_KEYS.QUOTES);
    AppState.quotes = savedQuotes ? JSON.parse(savedQuotes) : [];

    const savedGoals = localStorage.getItem(STORAGE_KEYS.GOALS);
    if (savedGoals) {
      AppState.goals = { ...AppState.goals, ...JSON.parse(savedGoals) };
    }

    const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME);
    if (savedTheme) {
      AppState.theme = savedTheme;
    }

    checkDailyReadingStreak();
  } catch (err) {
    console.error('Error loading data from Local Storage:', err);
    showToast('Failed to load saved data from browser storage.', 'error');
  }
}

/**
 * Safely saves the given key and data to browser Local Storage.
 */
function saveDataToStorage(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    updateStorageUsageIndicator();
  } catch (err) {
    console.error(`Error saving to storage key ${key}:`, err);
    if (err.name === 'QuotaExceededError' || err.code === 22) {
      showToast('Browser storage quota reached! Try compressing images or exporting a backup.', 'error');
    } else {
      showToast('Could not save data to browser Local Storage.', 'error');
    }
  }
}

/**
 * Persists all collections in AppState to Local Storage immediately.
 */
function persistAllData() {
  saveDataToStorage(STORAGE_KEYS.BOOKS, AppState.books);
  saveDataToStorage(STORAGE_KEYS.SHELVES, AppState.shelves);
  saveDataToStorage(STORAGE_KEYS.JOURNAL, AppState.journalEntries);
  saveDataToStorage(STORAGE_KEYS.QUOTES, AppState.quotes);
  saveDataToStorage(STORAGE_KEYS.GOALS, AppState.goals);
  saveDataToStorage(STORAGE_KEYS.THEME, AppState.theme);
}

/**
 * Calculates and displays the estimated LocalStorage usage in Settings.
 */
function updateStorageUsageIndicator() {
  const indicator = document.getElementById('storageUsageIndicator');
  if (!indicator) return;

  try {
    let totalBytes = 0;
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        totalBytes += (localStorage[key].length + key.length) * 2;
      }
    }
    const kb = (totalBytes / 1024).toFixed(1);
    const mb = (totalBytes / (1024 * 1024)).toFixed(2);
    indicator.textContent = totalBytes > 1024 * 1024
      ? `Storage used: ~${mb} MB of browser quota`
      : `Storage used: ~${kb} KB of browser quota`;
  } catch (e) {
    indicator.textContent = 'Storage status: Active';
  }
}

/**
 * Checks and updates daily reading streak based on last active date.
 */
function checkDailyReadingStreak() {
  const todayStr = new Date().toISOString().split('T')[0];
  const lastActive = AppState.goals.lastActiveDate;

  if (!lastActive) {
    return;
  }

  const today = new Date(todayStr);
  const last = new Date(lastActive);
  const diffTime = Math.abs(today - last);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays > 1) {
    // Streak broken if more than 1 day skipped
    AppState.goals.streakDays = 0;
    saveDataToStorage(STORAGE_KEYS.GOALS, AppState.goals);
  }
}

/* ============================================================================
   2. DEMO DATA HANDLING
   ============================================================================ */

/**
 * Populates the application with the 5 curated demo classics and sample entries.
 * Does not overwrite personal books.
 */
function loadDemoLibrary() {
  // Deep clone to prevent mutating original templates
  const clonedBooks = JSON.parse(JSON.stringify(DEMO_BOOKS));
  const clonedQuotes = JSON.parse(JSON.stringify(DEMO_QUOTES));
  const clonedJournal = JSON.parse(JSON.stringify(DEMO_JOURNAL));

  // Filter out any existing demo books first to avoid duplicates
  AppState.books = AppState.books.filter(b => !b.isDemo);
  AppState.books.unshift(...clonedBooks);

  // Add demo shelves if not present
  DEFAULT_SHELVES.forEach(defShelf => {
    if (!AppState.shelves.some(s => s.id === defShelf.id)) {
      AppState.shelves.push({ ...defShelf });
    }
  });

  // Add demo quotes and journal reflections
  AppState.quotes = AppState.quotes.filter(q => !q.isDemo);
  AppState.quotes.unshift(...clonedQuotes);

  AppState.journalEntries = AppState.journalEntries.filter(j => !j.isDemo);
  AppState.journalEntries.unshift(...clonedJournal);

  persistAllData();
  renderAllViews();
  hideDemoBanner();
  showToast('Demo library loaded! Explore the classics.', 'success');
}

/**
 * Safely removes demo data without touching user's personally added books.
 */
function clearDemoLibrary() {
  const initialBookCount = AppState.books.length;
  AppState.books = AppState.books.filter(b => !b.isDemo);
  AppState.quotes = AppState.quotes.filter(q => !q.isDemo);
  AppState.journalEntries = AppState.journalEntries.filter(j => !j.isDemo);

  const removedCount = initialBookCount - AppState.books.length;

  persistAllData();
  renderAllViews();
  showToast(removedCount > 0 ? `Removed ${removedCount} demo books.` : 'No demo books found in library.', 'info');
}

function hideDemoBanner() {
  const banner = document.getElementById('demoBanner');
  if (banner) banner.style.display = 'none';
  localStorage.setItem(STORAGE_KEYS.DEMO_DISMISSED, 'true');
}

function checkDemoBannerState() {
  const banner = document.getElementById('demoBanner');
  if (!banner) return;
  const isDismissed = localStorage.getItem(STORAGE_KEYS.DEMO_DISMISSED);
  const hasBooks = AppState.books.length > 0;
  if (isDismissed || hasBooks) {
    banner.style.display = 'none';
  } else {
    banner.style.display = 'flex';
  }
}

/* ============================================================================
   3. THEME TOGGLING (WARM LIGHT / DARK READING MODE)
   ============================================================================ */

function applyTheme(themeName) {
  AppState.theme = themeName;
  document.body.setAttribute('data-theme', themeName);
  localStorage.setItem(STORAGE_KEYS.THEME, themeName);

  // Update settings theme buttons
  document.querySelectorAll('.theme-choice-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.setTheme === themeName);
  });
}

function toggleTheme() {
  const nextTheme = AppState.theme === 'light' ? 'dark' : 'light';
  applyTheme(nextTheme);
  showToast(nextTheme === 'dark' ? 'Dark Reading Mode activated.' : 'Warm Cream theme activated.', 'info');
}

/* ============================================================================
   4. NAVIGATION & VIEW ROUTING
   ============================================================================ */

function switchView(viewName) {
  AppState.activeView = viewName;

  // Update navigation items
  document.querySelectorAll('.sidebar-nav .nav-item').forEach(item => {
    item.classList.toggle('active', item.dataset.view === viewName);
  });

  // Switch visible section
  document.querySelectorAll('.view-section').forEach(section => {
    section.classList.remove('active');
  });

  const targetSection = document.getElementById(`view-${viewName}`);
  if (targetSection) {
    targetSection.classList.add('active');
  }

  // Close mobile drawer if open
  closeMobileMenu();

  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' });

  // Refresh current view's specific data
  renderActiveViewData(viewName);
}

function renderActiveViewData(viewName) {
  switch (viewName) {
    case 'overview':
      renderOverview();
      break;
    case 'library':
      renderLibrary();
      break;
    case 'reading-now':
      renderReadingNow();
      break;
    case 'wishlist':
      renderWishlist();
      break;
    case 'shelves':
      renderShelves();
      break;
    case 'journal':
      renderJournal();
      break;
    case 'goals':
      renderGoals();
      break;
    case 'statistics':
      renderStatistics();
      break;
    case 'settings':
      updateStorageUsageIndicator();
      break;
  }
  updateNavCounters();
}

function updateNavCounters() {
  const totalCount = AppState.books.length;
  const readingCount = AppState.books.filter(b => b.status === 'Currently Reading' || b.status === 'Rereading').length;
  const wishlistCount = AppState.books.filter(b => b.status === 'Want to Read').length;

  const navLibEl = document.getElementById('navLibraryCount');
  if (navLibEl) navLibEl.textContent = totalCount;

  const navReadEl = document.getElementById('navReadingNowCount');
  if (navReadEl) navReadEl.textContent = readingCount;

  const navWishEl = document.getElementById('navWishlistCount');
  if (navWishEl) navWishEl.textContent = wishlistCount;
}

function openMobileMenu() {
  document.getElementById('sidebar').classList.add('mobile-open');
  document.getElementById('sidebarBackdrop').classList.add('active');
}

function closeMobileMenu() {
  document.getElementById('sidebar').classList.remove('mobile-open');
  document.getElementById('sidebarBackdrop').classList.remove('active');
}

/* ============================================================================
   5. PROCEDURAL COVER GENERATOR & COVER FALLBACK
   ============================================================================ */

/**
 * Computes a deterministic integer hash from a string.
 */
function hashString(str) {
  let hash = 0;
  if (!str) return 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return Math.abs(hash);
}

/**
 * Generates an elegant procedural literary cloth book cover when no image exists.
 */
function createProceduralCoverHTML(title, author) {
  const paletteIndex = hashString(title + author) % COVER_PALETTES.length;
  const palette = COVER_PALETTES[paletteIndex];
  const safeTitle = escapeHTML(title);
  const safeAuthor = escapeHTML(author);

  return `
    <div class="procedural-cover" style="background-color: ${palette.bg};">
      <div class="procedural-cover-border" style="border-color: ${palette.border};"></div>
      <div class="procedural-cover-title" style="color: ${palette.text};">${safeTitle}</div>
      <div class="procedural-cover-ornament" style="color: ${palette.border};">❦</div>
      <div class="procedural-cover-author" style="color: ${palette.border};">${safeAuthor}</div>
    </div>
  `;
}

/**
 * Global fallback handler for broken book cover images.
 */
window.handleCoverError = function(imgElement) {
  if (!imgElement || !imgElement.parentElement) return;
  const title = imgElement.getAttribute('data-title') || 'Book';
  const author = imgElement.getAttribute('data-author') || 'Author';
  const status = imgElement.getAttribute('data-status') || '';

  imgElement.parentElement.innerHTML = createProceduralCoverHTML(title, author) + renderCoverStatusBadge(status);
};

/**
 * Generates the complete HTML for a book's cover wrapper (image or procedural).
 */
function renderBookCoverElement(book, customClass = '') {
  if (book.coverUrl && book.coverUrl.trim().length > 0) {
    return `
      <div class="book-card-cover-wrapper ${customClass}" data-book-id="${book.id}">
        <img class="book-card-cover-img" 
             src="${escapeHTML(book.coverUrl)}" 
             alt="${escapeHTML(book.title)} cover"
             data-title="${escapeHTML(book.title)}"
             data-author="${escapeHTML(book.author)}"
             data-status="${escapeHTML(book.status)}"
             loading="lazy"
             onerror="window.handleCoverError && window.handleCoverError(this);" />
        ${renderCoverStatusBadge(book.status)}
      </div>
    `;
  } else {
    return `
      <div class="book-card-cover-wrapper ${customClass}" data-book-id="${book.id}">
        ${createProceduralCoverHTML(book.title, book.author)}
        ${renderCoverStatusBadge(book.status)}
      </div>
    `;
  }
}

function renderCoverStatusBadge(status) {
  if (!status) return '';
  const statusSlug = status.toLowerCase().replace(/[^a-z0-9]/g, '-');
  let label = status;
  if (status === 'Did Not Finish (DNF)') label = 'DNF';
  return `<span class="cover-status-badge badge-${statusSlug}">${escapeHTML(label)}</span>`;
}

/* ============================================================================
   6. OVERVIEW DASHBOARD RENDERING
   ============================================================================ */

function renderOverview() {
  // Update Summary Cards
  const totalBooks = AppState.books.length;
  const currentlyReading = AppState.books.filter(b => b.status === 'Currently Reading' || b.status === 'Rereading').length;
  const completedBooks = AppState.books.filter(b => b.status === 'Completed').length;
  const wishlistBooks = AppState.books.filter(b => b.status === 'Want to Read').length;

  document.getElementById('statTotalBooks').textContent = totalBooks;
  document.getElementById('statCurrentlyReading').textContent = currentlyReading;
  document.getElementById('statCompletedBooks').textContent = completedBooks;
  document.getElementById('statWishlist').textContent = wishlistBooks;

  // Render "Currently on Your Nightstand"
  renderNightstandSection();

  // Render "Your Reading Journey"
  renderReadingJourneySection();

  // Render "Recently Added"
  renderRecentlyAddedSection();

  // Update Date Display
  updateDateGreeting();
}

function updateDateGreeting() {
  const now = new Date();
  const options = { weekday: 'long', month: 'long', day: 'numeric' };
  const dateStr = now.toLocaleDateString(undefined, options);

  const dateEl = document.getElementById('currentDateDisplay');
  if (dateEl) dateEl.textContent = dateStr;

  const hours = now.getHours();
  let greeting = 'Good day, reader';
  if (hours < 12) greeting = 'Good morning, reader';
  else if (hours < 18) greeting = 'Good afternoon, reader';
  else greeting = 'Good evening, reader';

  const topGreeting = document.getElementById('topGreeting');
  if (topGreeting) topGreeting.textContent = greeting;
}

function renderNightstandSection() {
  const container = document.getElementById('nightstandContainer');
  if (!container) return;

  const readingBooks = AppState.books.filter(b => b.status === 'Currently Reading' || b.status === 'Rereading');

  if (readingBooks.length === 0) {
    container.innerHTML = `
      <div class="empty-state" style="grid-column: 1 / -1; padding: 36px 20px;">
        <p class="empty-state-text" style="margin: 0 0 14px;">No books currently on your nightstand.</p>
        <button class="btn btn-primary btn-sm" onclick="switchView('library');">Pick a Book to Read</button>
      </div>
    `;
    return;
  }

  container.innerHTML = readingBooks.map(book => {
    const total = book.totalPages || 0;
    const current = book.currentPage || 0;
    const percent = total > 0 ? Math.min(100, Math.round((current / total) * 100)) : 0;
    const remaining = Math.max(0, total - current);

    return `
      <div class="nightstand-card" data-book-id="${book.id}">
        <div class="nightstand-cover" onclick="openBookDetailsModal('${book.id}')">
          ${book.coverUrl 
            ? `<img src="${escapeHTML(book.coverUrl)}" alt="${escapeHTML(book.title)}" data-title="${escapeHTML(book.title)}" data-author="${escapeHTML(book.author)}" data-status="${escapeHTML(book.status)}" onerror="window.handleCoverError && window.handleCoverError(this);" />` 
            : createProceduralCoverHTML(book.title, book.author)}
        </div>
        <div class="nightstand-details">
          <div class="nightstand-meta">
            <h4 class="nightstand-title" onclick="openBookDetailsModal('${book.id}')">${escapeHTML(book.title)}</h4>
            <span class="nightstand-author">${escapeHTML(book.author)}</span>
          </div>
          <div class="nightstand-progress-section">
            <div class="nightstand-progress-header">
              <span>Page ${current} of ${total || '—'}</span>
              <span class="nightstand-percent">${percent}%</span>
            </div>
            <div class="progress-bar-track">
              <div class="progress-bar-fill" style="width: ${percent}%;"></div>
            </div>
          </div>
          <div class="nightstand-actions">
            <span style="font-size: 0.76rem; color: var(--text-secondary);">${remaining > 0 ? `${remaining} pgs left` : 'Completed'}</span>
            <button class="btn btn-secondary btn-sm" onclick="openProgressModal('${book.id}')">
              <span>Update Page</span>
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function renderRecentlyAddedSection() {
  const container = document.getElementById('recentlyAddedContainer');
  if (!container) return;

  const sorted = [...AppState.books].sort((a, b) => new Date(b.dateAdded || 0) - new Date(a.dateAdded || 0));
  const recent = sorted.slice(0, 5);

  if (recent.length === 0) {
    container.innerHTML = `
      <div class="empty-state" style="grid-column: 1 / -1; padding: 36px 20px;">
        <p class="empty-state-text" style="margin: 0 0 14px;">Your library is currently empty.</p>
        <button class="btn btn-primary btn-sm" onclick="openAddBookModal();">Add Your First Book</button>
      </div>
    `;
    return;
  }

  container.innerHTML = recent.map(book => renderBookCardHTML(book)).join('');
}

function renderReadingJourneySection() {
  const currentYear = new Date().getFullYear();
  document.getElementById('journeyYear').textContent = currentYear;

  // Completed this year
  const completedThisYear = AppState.books.filter(b => {
    if (b.status !== 'Completed') return false;
    if (!b.dateFinished) return true; // Include completed if no specific year
    return new Date(b.dateFinished).getFullYear() === currentYear;
  }).length;

  document.getElementById('journeyCompletedThisYear').textContent = completedThisYear;

  // Total pages read across all books
  const totalPagesRead = AppState.books.reduce((sum, b) => {
    if (b.status === 'Completed') return sum + (Number(b.totalPages) || Number(b.currentPage) || 0);
    return sum + (Number(b.currentPage) || 0);
  }, 0);
  document.getElementById('journeyPagesRead').textContent = totalPagesRead.toLocaleString();

  // Streak
  document.getElementById('journeyStreak').textContent = AppState.goals.streakDays;

  // Annual Goal Progress
  const annualTarget = AppState.goals.annualTarget || 24;
  const progressPercent = Math.min(100, Math.round((completedThisYear / annualTarget) * 100));

  document.getElementById('dashboardGoalProgressText').textContent = `${completedThisYear} / ${annualTarget} books (${progressPercent}%)`;
  document.getElementById('dashboardGoalProgressBar').style.width = `${progressPercent}%`;

  // Dynamic encouragement message
  let encouragement = "Every book opens another doorway.";
  if (completedThisYear === 0) {
    encouragement = "The year is young. Your next unforgettable adventure awaits.";
  } else if (progressPercent >= 100) {
    encouragement = "🎉 Magnificent! You have achieved your annual reading goal.";
  } else if (progressPercent >= 50) {
    encouragement = "You're over halfway there! What an inspiring reading journey.";
  } else {
    encouragement = "Wonderful progress. Savor every chapter and turn of the page.";
  }
  document.getElementById('dashboardGoalEncouragement').textContent = encouragement;
}

function refreshInspirationQuote() {
  const quote = LITERARY_INSPIRATION_QUOTES[Math.floor(Math.random() * LITERARY_INSPIRATION_QUOTES.length)];
  const quoteText = document.getElementById('inspirationQuoteText');
  const quoteAuthor = document.getElementById('inspirationQuoteAuthor');
  
  if (quoteText && quoteAuthor) {
    quoteText.style.opacity = '0';
    quoteAuthor.style.opacity = '0';
    setTimeout(() => {
      quoteText.textContent = `“${quote.text}”`;
      quoteAuthor.textContent = `— ${quote.author}`;
      quoteText.style.opacity = '1';
      quoteAuthor.style.opacity = '1';
    }, 200);
  }
}

/* ============================================================================
   7. MY LIBRARY VIEW RENDERING, SEARCH & FILTERS
   ============================================================================ */

function renderLibrary() {
  populateLibraryFilterDropdowns();

  const container = document.getElementById('libraryBooksContainer');
  const emptyState = document.getElementById('libraryEmptyState');
  const countText = document.getElementById('libraryCountText');

  let filtered = [...AppState.books];

  // 1. Status Filter
  if (AppState.libraryFilter.status !== 'all') {
    filtered = filtered.filter(b => b.status === AppState.libraryFilter.status);
  }

  // 2. Genre Filter
  if (AppState.libraryFilter.genre !== 'all') {
    filtered = filtered.filter(b => b.genre === AppState.libraryFilter.genre);
  }

  // 3. Mood Filter
  if (AppState.libraryFilter.mood !== 'all') {
    filtered = filtered.filter(b => b.moods && b.moods.includes(AppState.libraryFilter.mood));
  }

  // 4. Shelf Filter
  if (AppState.libraryFilter.shelf !== 'all') {
    filtered = filtered.filter(b => b.shelves && b.shelves.includes(AppState.libraryFilter.shelf));
  }

  // 5. Search Filter (Title and Author)
  const searchQuery = AppState.libraryFilter.search.trim().toLowerCase();
  if (searchQuery.length > 0) {
    filtered = filtered.filter(b => 
      (b.title && b.title.toLowerCase().includes(searchQuery)) ||
      (b.author && b.author.toLowerCase().includes(searchQuery)) ||
      (b.genre && b.genre.toLowerCase().includes(searchQuery))
    );
  }

  // 6. Sorting
  sortBookCollection(filtered, AppState.libraryFilter.sort);

  // Update layout mode
  container.className = `books-grid ${AppState.libraryFilter.viewMode === 'list' ? 'list-view' : ''}`;

  // Update active filters bar
  renderActiveFiltersBar();

  // Results Count
  countText.textContent = `Showing ${filtered.length} of ${AppState.books.length} book${AppState.books.length === 1 ? '' : 's'}`;

  // Render Grid or Empty State
  if (filtered.length === 0) {
    container.innerHTML = '';
    emptyState.style.display = 'block';
  } else {
    emptyState.style.display = 'none';
    container.innerHTML = filtered.map(book => renderBookCardHTML(book, AppState.libraryFilter.viewMode)).join('');
  }
}

function sortBookCollection(booksArray, sortType) {
  switch (sortType) {
    case 'title-asc':
      booksArray.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
      break;
    case 'title-desc':
      booksArray.sort((a, b) => (b.title || '').localeCompare(a.title || ''));
      break;
    case 'rating-desc':
      booksArray.sort((a, b) => (Number(b.rating) || 0) - (Number(a.rating) || 0));
      break;
    case 'dateFinished-desc':
      booksArray.sort((a, b) => new Date(b.dateFinished || 0) - new Date(a.dateFinished || 0));
      break;
    case 'pages-desc':
      booksArray.sort((a, b) => (Number(b.totalPages) || 0) - (Number(a.totalPages) || 0));
      break;
    case 'dateAdded-desc':
    default:
      booksArray.sort((a, b) => new Date(b.dateAdded || 0) - new Date(a.dateAdded || 0));
      break;
  }
}

function populateLibraryFilterDropdowns() {
  // Genres dropdown
  const genreSelect = document.getElementById('libraryGenreFilter');
  if (genreSelect) {
    const currentVal = AppState.libraryFilter.genre;
    const uniqueGenres = Array.from(new Set(AppState.books.map(b => b.genre).filter(Boolean))).sort();
    
    let html = `<option value="all">All Genres (${AppState.books.length})</option>`;
    uniqueGenres.forEach(genre => {
      const count = AppState.books.filter(b => b.genre === genre).length;
      html += `<option value="${escapeHTML(genre)}" ${currentVal === genre ? 'selected' : ''}>${escapeHTML(genre)} (${count})</option>`;
    });
    genreSelect.innerHTML = html;
  }

  // Moods dropdown
  const moodSelect = document.getElementById('libraryMoodFilter');
  if (moodSelect) {
    const currentVal = AppState.libraryFilter.mood;
    const allMoods = AppState.books.flatMap(b => b.moods || []).filter(Boolean);
    const uniqueMoods = Array.from(new Set(allMoods)).sort();

    let html = `<option value="all">All Moods</option>`;
    uniqueMoods.forEach(mood => {
      const count = allMoods.filter(m => m === mood).length;
      html += `<option value="${escapeHTML(mood)}" ${currentVal === mood ? 'selected' : ''}>${escapeHTML(mood)} (${count})</option>`;
    });
    moodSelect.innerHTML = html;
  }

  // Shelves dropdown
  const shelfSelect = document.getElementById('libraryShelfFilter');
  if (shelfSelect) {
    const currentVal = AppState.libraryFilter.shelf;
    let html = `<option value="all">All Shelves</option>`;
    AppState.shelves.forEach(shelf => {
      const count = AppState.books.filter(b => b.shelves && b.shelves.includes(shelf.id)).length;
      html += `<option value="${shelf.id}" ${currentVal === shelf.id ? 'selected' : ''}>${escapeHTML(shelf.name)} (${count})</option>`;
    });
    shelfSelect.innerHTML = html;
  }
}

function renderActiveFiltersBar() {
  const bar = document.getElementById('activeFiltersBar');
  const chipsContainer = document.getElementById('activeFilterChips');
  if (!bar || !chipsContainer) return;

  const chips = [];

  if (AppState.libraryFilter.status !== 'all') {
    chips.push({ label: `Status: ${AppState.libraryFilter.status}`, key: 'status' });
  }
  if (AppState.libraryFilter.genre !== 'all') {
    chips.push({ label: `Genre: ${AppState.libraryFilter.genre}`, key: 'genre' });
  }
  if (AppState.libraryFilter.mood !== 'all') {
    chips.push({ label: `Mood: ${AppState.libraryFilter.mood}`, key: 'mood' });
  }
  if (AppState.libraryFilter.shelf !== 'all') {
    const shelf = AppState.shelves.find(s => s.id === AppState.libraryFilter.shelf);
    chips.push({ label: `Shelf: ${shelf ? shelf.name : 'Custom'}`, key: 'shelf' });
  }
  if (AppState.libraryFilter.search.trim().length > 0) {
    chips.push({ label: `Search: "${AppState.libraryFilter.search}"`, key: 'search' });
  }

  if (chips.length > 0) {
    bar.style.display = 'flex';
    chipsContainer.innerHTML = chips.map(chip => `
      <span class="filter-chip-item">
        ${escapeHTML(chip.label)}
        <span class="filter-chip-remove" onclick="removeSpecificFilter('${chip.key}')">&times;</span>
      </span>
    `).join('');
  } else {
    bar.style.display = 'none';
    chipsContainer.innerHTML = '';
  }
}

function removeSpecificFilter(filterKey) {
  if (filterKey === 'status') {
    AppState.libraryFilter.status = 'all';
    document.querySelectorAll('#statusFilterPills .filter-pill').forEach(pill => {
      pill.classList.toggle('active', pill.dataset.status === 'all');
    });
  } else if (filterKey === 'genre') {
    AppState.libraryFilter.genre = 'all';
  } else if (filterKey === 'mood') {
    AppState.libraryFilter.mood = 'all';
  } else if (filterKey === 'shelf') {
    AppState.libraryFilter.shelf = 'all';
  } else if (filterKey === 'search') {
    AppState.libraryFilter.search = '';
    const searchInput = document.getElementById('globalSearchInput');
    if (searchInput) searchInput.value = '';
    const clearBtn = document.getElementById('clearSearchBtn');
    if (clearBtn) clearBtn.style.display = 'none';
  }

  renderLibrary();
}

function resetAllLibraryFilters() {
  AppState.libraryFilter.status = 'all';
  AppState.libraryFilter.genre = 'all';
  AppState.libraryFilter.mood = 'all';
  AppState.libraryFilter.shelf = 'all';
  AppState.libraryFilter.search = '';

  const searchInput = document.getElementById('globalSearchInput');
  if (searchInput) searchInput.value = '';
  const clearBtn = document.getElementById('clearSearchBtn');
  if (clearBtn) clearBtn.style.display = 'none';

  document.querySelectorAll('#statusFilterPills .filter-pill').forEach(pill => {
    pill.classList.toggle('active', pill.dataset.status === 'all');
  });

  renderLibrary();
  showToast('Filters cleared.', 'info');
}

/**
 * Standard reusable HTML renderer for a Book Card.
 */
function renderBookCardHTML(book, viewMode = 'grid') {
  const total = Number(book.totalPages) || 0;
  const current = Number(book.currentPage) || 0;
  const percent = total > 0 ? Math.min(100, Math.round((current / total) * 100)) : 0;
  const ratingStars = renderStarRatingDisplay(book.rating);

  if (viewMode === 'list') {
    return `
      <div class="book-card" data-book-id="${book.id}">
        ${renderBookCoverElement(book)}
        <div class="book-card-body">
          <div class="book-card-info-col">
            <span class="book-card-genre">${escapeHTML(book.genre || 'General')}</span>
            <h4 class="book-card-title" onclick="openBookDetailsModal('${book.id}')">${escapeHTML(book.title)}</h4>
            <span class="book-card-author">${escapeHTML(book.author)}</span>
            <div class="book-card-rating">${ratingStars}</div>
          </div>
          <div class="book-card-progress-col">
            <span class="detail-pill">${escapeHTML(book.status)}</span>
            ${(book.status === 'Currently Reading' || book.status === 'Rereading') ? `
              <div class="book-card-progress">
                <div class="book-card-progress-text">
                  <span>${current} / ${total} pgs</span>
                  <span>${percent}%</span>
                </div>
                <div class="progress-bar-track">
                  <div class="progress-bar-fill" style="width: ${percent}%;"></div>
                </div>
              </div>
            ` : ''}
          </div>
          <div class="book-card-actions">
            <button class="btn btn-secondary btn-sm" onclick="openBookDetailsModal('${book.id}')">Details</button>
            <button class="icon-btn-subtle" onclick="openEditBookModal('${book.id}')" title="Edit book">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
            </button>
          </div>
        </div>
      </div>
    `;
  }

  // Default Grid View
  return `
    <div class="book-card" data-book-id="${book.id}">
      <div onclick="openBookDetailsModal('${book.id}')">
        ${renderBookCoverElement(book)}
      </div>
      <div class="book-card-body">
        <div class="book-card-header">
          <span class="book-card-genre">${escapeHTML(book.genre || 'General')}</span>
          <h4 class="book-card-title" onclick="openBookDetailsModal('${book.id}')">${escapeHTML(book.title)}</h4>
          <span class="book-card-author">${escapeHTML(book.author)}</span>
        </div>

        <div class="book-card-rating">
          ${ratingStars}
          ${book.rating ? `<span class="book-card-rating-text">${book.rating}.0</span>` : ''}
        </div>

        ${(book.status === 'Currently Reading' || book.status === 'Rereading') ? `
          <div class="book-card-progress">
            <div class="book-card-progress-text">
              <span>Page ${current} / ${total || '—'}</span>
              <span>${percent}%</span>
            </div>
            <div class="progress-bar-track">
              <div class="progress-bar-fill" style="width: ${percent}%;"></div>
            </div>
          </div>
        ` : ''}

        ${book.moods && book.moods.length > 0 ? `
          <div class="book-card-moods">
            ${book.moods.slice(0, 2).map(m => `<span class="mood-tag-mini">${escapeHTML(m)}</span>`).join('')}
            ${book.moods.length > 2 ? `<span class="mood-tag-mini">+${book.moods.length - 2}</span>` : ''}
          </div>
        ` : ''}

        <div class="book-card-actions">
          <button class="card-action-btn" onclick="openBookDetailsModal('${book.id}')">View Details &rarr;</button>
          <div class="card-action-icons">
            ${(book.status === 'Currently Reading' || book.status === 'Rereading') ? `
              <button class="icon-btn-subtle" onclick="openProgressModal('${book.id}')" title="Update progress">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
              </button>
            ` : ''}
            <button class="icon-btn-subtle" onclick="openEditBookModal('${book.id}')" title="Edit book">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderStarRatingDisplay(rating) {
  if (!rating) {
    return `<span style="font-size: 0.76rem; color: var(--text-muted);">Unrated</span>`;
  }
  let stars = '';
  for (let i = 1; i <= 5; i++) {
    stars += `<span class="${i <= rating ? 'star-filled' : 'star-empty'}">★</span>`;
  }
  return stars;
}

/* ============================================================================
   8. READING NOW VIEW & AMBIENT SESSION TIMER
   ============================================================================ */

function renderReadingNow() {
  const container = document.getElementById('readingNowList');
  if (!container) return;

  const readingBooks = AppState.books.filter(b => b.status === 'Currently Reading' || b.status === 'Rereading');

  if (readingBooks.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
          </svg>
        </div>
        <h3 class="empty-state-title">No books currently in progress</h3>
        <p class="empty-state-text">Choose a title from your library or wishlist to start reading today.</p>
        <button class="btn btn-primary" onclick="switchView('library');">Browse Library</button>
      </div>
    `;
    return;
  }

  container.innerHTML = readingBooks.map(book => {
    const total = Number(book.totalPages) || 0;
    const current = Number(book.currentPage) || 0;
    const percent = total > 0 ? Math.min(100, Math.round((current / total) * 100)) : 0;
    const remaining = Math.max(0, total - current);

    return `
      <div class="reading-now-item">
        <div class="reading-now-cover" onclick="openBookDetailsModal('${book.id}')">
          ${book.coverUrl 
            ? `<img src="${escapeHTML(book.coverUrl)}" alt="${escapeHTML(book.title)}" data-title="${escapeHTML(book.title)}" data-author="${escapeHTML(book.author)}" data-status="${escapeHTML(book.status)}" onerror="window.handleCoverError && window.handleCoverError(this);" />` 
            : createProceduralCoverHTML(book.title, book.author)}
        </div>
        <div class="reading-now-content">
          <div>
            <span class="detail-pill" style="margin-bottom: 8px;">${escapeHTML(book.genre || 'General')}</span>
            <h3 class="reading-now-title" onclick="openBookDetailsModal('${book.id}')">${escapeHTML(book.title)}</h3>
            <span class="reading-now-author">${escapeHTML(book.author)}</span>
          </div>

          <div class="reading-now-tracker-card">
            <div class="reading-now-tracker-stats">
              <div>
                <span class="reading-now-big-percent">${percent}%</span>
                <span style="font-size: 0.8rem; color: var(--text-secondary); margin-left: 6px;">completed</span>
              </div>
              <div class="reading-now-pages-info">
                <strong>Page ${current}</strong> of ${total || '—'} (${remaining} pages left)
              </div>
            </div>
            <div class="progress-bar-track large">
              <div class="progress-bar-fill rose-fill" style="width: ${percent}%;"></div>
            </div>

            <div class="reading-now-quick-buttons">
              <span style="font-size: 0.78rem; color: var(--text-secondary);">Quick log:</span>
              <button class="btn-chip" onclick="quickIncrementBookPage('${book.id}', 5)">+5 pgs</button>
              <button class="btn-chip" onclick="quickIncrementBookPage('${book.id}', 10)">+10 pgs</button>
              <button class="btn-chip" onclick="quickIncrementBookPage('${book.id}', 25)">+25 pgs</button>
            </div>
          </div>

          <div class="reading-now-actions-row">
            <button class="btn btn-secondary btn-sm" onclick="openBookDetailsModal('${book.id}')">View Details</button>
            <div style="display:flex; gap:10px;">
              <button class="btn btn-outline btn-sm" onclick="quickMarkBookCompleted('${book.id}')">Mark as Completed</button>
              <button class="btn btn-primary btn-sm" onclick="openProgressModal('${book.id}')">Full Progress Tracker</button>
            </div>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function quickIncrementBookPage(bookId, pagesToAdd) {
  const book = AppState.books.find(b => b.id === bookId);
  if (!book) return;

  const total = Number(book.totalPages) || 9999;
  const newCurrent = Math.min(total, (Number(book.currentPage) || 0) + pagesToAdd);
  book.currentPage = newCurrent;

  // Log daily reading streak/activity
  logDailyReadingHabit(15);

  if (newCurrent >= total && total > 0) {
    showCompletionPromptForBook(book);
  } else {
    persistAllData();
    renderReadingNow();
    renderOverview();
    showToast(`Updated to page ${newCurrent}. Happy reading!`, 'success');
  }
}

function quickMarkBookCompleted(bookId) {
  const book = AppState.books.find(b => b.id === bookId);
  if (!book) return;

  book.status = 'Completed';
  book.currentPage = book.totalPages || book.currentPage;
  if (!book.dateFinished) {
    book.dateFinished = new Date().toISOString().split('T')[0];
  }

  persistAllData();
  renderAllViews();
  showToast(`Congratulations on finishing "${book.title}"! 🎉`, 'success');
}

/**
 * Ambient Timer Implementation (Web Audio API synthesised chime when finished)
 */
function initAmbientTimer() {
  const startBtn = document.getElementById('startTimerBtn');
  const resetBtn = document.getElementById('resetTimerBtn');
  const timerDisplay = document.getElementById('ambientTimerDisplay');
  const durationPills = document.querySelectorAll('.timer-duration-pills .timer-pill');

  durationPills.forEach(pill => {
    pill.addEventListener('click', () => {
      durationPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      const mins = parseInt(pill.dataset.minutes, 10);
      AppState.ambientTimer.totalSeconds = mins * 60;
      AppState.ambientTimer.remainingSeconds = mins * 60;
      updateTimerDisplay();
      if (AppState.ambientTimer.isRunning) {
        pauseAmbientTimer();
      }
    });
  });

  if (startBtn) {
    startBtn.addEventListener('click', () => {
      if (AppState.ambientTimer.isRunning) {
        pauseAmbientTimer();
      } else {
        startAmbientTimer();
      }
    });
  }

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      pauseAmbientTimer();
      AppState.ambientTimer.remainingSeconds = AppState.ambientTimer.totalSeconds;
      updateTimerDisplay();
    });
  }
}

function updateTimerDisplay() {
  const display = document.getElementById('ambientTimerDisplay');
  if (!display) return;
  const mins = Math.floor(AppState.ambientTimer.remainingSeconds / 60);
  const secs = AppState.ambientTimer.remainingSeconds % 60;
  display.textContent = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

function startAmbientTimer() {
  const startBtn = document.getElementById('startTimerBtn');
  AppState.ambientTimer.isRunning = true;
  if (startBtn) startBtn.textContent = 'Pause Session';

  AppState.ambientTimer.intervalId = setInterval(() => {
    if (AppState.ambientTimer.remainingSeconds > 0) {
      AppState.ambientTimer.remainingSeconds--;
      updateTimerDisplay();
    } else {
      pauseAmbientTimer();
      playChimeAudio();
      showToast('Session complete! Take a gentle breath.', 'success');
      logDailyReadingHabit(Math.round(AppState.ambientTimer.totalSeconds / 60));
    }
  }, 1000);
}

function pauseAmbientTimer() {
  const startBtn = document.getElementById('startTimerBtn');
  AppState.ambientTimer.isRunning = false;
  clearInterval(AppState.ambientTimer.intervalId);
  if (startBtn) startBtn.textContent = 'Resume Session';
}

/**
 * Pure offline synthesized chime using Web Audio API (no external MP3 file needed).
 */
function playChimeAudio() {
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
    osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.3); // A5

    gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 1.2);

    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + 1.2);
  } catch (e) {
    // Audio context may be restricted by autoplay policy
  }
}

/* ============================================================================
   9. MY WISHLIST & "SURPRISE ME"
   ============================================================================ */

function renderWishlist() {
  const container = document.getElementById('wishlistContainer');
  const emptyState = document.getElementById('wishlistEmptyState');
  if (!container || !emptyState) return;

  const wishlistBooks = AppState.books.filter(b => b.status === 'Want to Read');

  if (wishlistBooks.length === 0) {
    container.innerHTML = '';
    emptyState.style.display = 'block';
  } else {
    emptyState.style.display = 'none';
    container.innerHTML = wishlistBooks.map(book => `
      <div class="book-card" data-book-id="${book.id}">
        <div onclick="openBookDetailsModal('${book.id}')">
          ${renderBookCoverElement(book)}
        </div>
        <div class="book-card-body">
          <div class="book-card-header">
            <span class="book-card-genre">${escapeHTML(book.genre || 'General')}</span>
            <h4 class="book-card-title" onclick="openBookDetailsModal('${book.id}')">${escapeHTML(book.title)}</h4>
            <span class="book-card-author">${escapeHTML(book.author)}</span>
          </div>

          <div style="font-size: 0.8rem; color: var(--text-secondary); margin: 8px 0;">
            ${book.totalPages ? `${book.totalPages} pages` : 'Length unrecorded'} • ${book.format || 'Book'}
          </div>

          <div class="book-card-actions" style="margin-top: auto;">
            <button class="btn btn-primary btn-sm" onclick="moveWishlistToReading('${book.id}')">
              Start Reading
            </button>
            <button class="icon-btn-subtle" onclick="confirmDeleteBook('${book.id}')" title="Remove from wishlist">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
            </button>
          </div>
        </div>
      </div>
    `).join('');
  }
}

function moveWishlistToReading(bookId) {
  const book = AppState.books.find(b => b.id === bookId);
  if (!book) return;

  book.status = 'Currently Reading';
  book.dateStarted = new Date().toISOString().split('T')[0];
  book.currentPage = book.currentPage || 0;

  persistAllData();
  renderAllViews();
  showToast(`Moved "${book.title}" to Currently Reading!`, 'success');
}

/**
 * "Surprise Me" Wishlist Random Selector Feature
 */
function triggerSurpriseMe() {
  const wishlist = AppState.books.filter(b => b.status === 'Want to Read');

  if (wishlist.length === 0) {
    showToast('Your wishlist has no books yet to pick from!', 'info');
    return;
  }

  const randomIndex = Math.floor(Math.random() * wishlist.length);
  const pickedBook = wishlist[randomIndex];

  const contentBox = document.getElementById('surpriseCardContent');
  if (!contentBox) return;

  contentBox.innerHTML = `
    <div class="surprise-cover-box">
      ${pickedBook.coverUrl 
        ? `<img src="${escapeHTML(pickedBook.coverUrl)}" alt="${escapeHTML(pickedBook.title)}" data-title="${escapeHTML(pickedBook.title)}" data-author="${escapeHTML(pickedBook.author)}" data-status="${escapeHTML(pickedBook.status)}" onerror="window.handleCoverError && window.handleCoverError(this);" />` 
        : createProceduralCoverHTML(pickedBook.title, pickedBook.author)}
    </div>
    <span class="detail-pill" style="margin-bottom: 8px;">${escapeHTML(pickedBook.genre || 'General')}</span>
    <h3 class="surprise-title">${escapeHTML(pickedBook.title)}</h3>
    <span class="surprise-author">${escapeHTML(pickedBook.author)}</span>
    ${pickedBook.notes ? `<p style="font-size:0.86rem; color:var(--text-secondary); margin-top:10px; font-style:italic;">“${escapeHTML(pickedBook.notes)}”</p>` : ''}
  `;

  const startBtn = document.getElementById('surpriseStartReadingBtn');
  startBtn.onclick = () => {
    moveWishlistToReading(pickedBook.id);
    closeModal('surpriseModalOverlay');
    switchView('reading-now');
  };

  openModal('surpriseModalOverlay');
}

/* ============================================================================
   10. MY SHELVES MANAGEMENT
   ============================================================================ */

function renderShelves() {
  const container = document.getElementById('shelvesContainer');
  if (!container) return;

  container.innerHTML = AppState.shelves.map(shelf => {
    // Count books belonging to this shelf
    const shelfBooks = AppState.books.filter(b => b.shelves && b.shelves.includes(shelf.id));
    const previewBooks = shelfBooks.slice(0, 4);

    return `
      <div class="shelf-card" style="border-top: 4px solid ${shelf.color || 'var(--accent-rose)'};" onclick="openShelfDetailsModal('${shelf.id}')">
        <div class="shelf-card-header">
          <h4 class="shelf-card-title">${escapeHTML(shelf.name)}</h4>
          <span class="shelf-card-badge">${shelfBooks.length} book${shelfBooks.length === 1 ? '' : 's'}</span>
        </div>

        <p class="shelf-card-desc">${escapeHTML(shelf.description || 'A collection of special stories.')}</p>

        <div class="shelf-preview-covers">
          ${previewBooks.length > 0 ? previewBooks.map(b => `
            <div class="shelf-mini-cover">
              ${b.coverUrl 
                ? `<img src="${escapeHTML(b.coverUrl)}" alt="${escapeHTML(b.title)}" data-title="${escapeHTML(b.title)}" data-author="${escapeHTML(b.author)}" data-status="${escapeHTML(b.status)}" onerror="window.handleCoverError && window.handleCoverError(this);" />` 
                : createProceduralCoverHTML(b.title, b.author)}
            </div>
          `).join('') : '<span style="font-size: 0.78rem; color: var(--text-muted); font-style: italic;">Shelf is currently empty</span>'}
        </div>

        <div class="shelf-card-footer">
          <span class="btn-text">Explore Shelf &rarr;</span>
          <div onclick="event.stopPropagation();">
            <button class="icon-btn-subtle" onclick="openEditShelfModal('${shelf.id}')" title="Edit shelf">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function openShelfDetailsModal(shelfId) {
  AppState.activeShelfId = shelfId;
  const shelf = AppState.shelves.find(s => s.id === shelfId);
  if (!shelf) return;

  document.getElementById('shelfDetailTitle').textContent = shelf.name;
  document.getElementById('shelfDetailDesc').textContent = shelf.description || '';

  const shelfBooks = AppState.books.filter(b => b.shelves && b.shelves.includes(shelf.id));
  const container = document.getElementById('shelfBooksContainer');

  if (shelfBooks.length === 0) {
    container.innerHTML = `
      <div class="empty-state" style="grid-column: 1 / -1; padding: 40px 20px;">
        <p class="empty-state-text">No books have been placed on this shelf yet.</p>
        <button class="btn btn-primary btn-sm" onclick="openManageShelfBooksModal('${shelf.id}')">Add Books to This Shelf</button>
      </div>
    `;
  } else {
    container.innerHTML = shelfBooks.map(book => renderBookCardHTML(book)).join('');
  }

  // Setup toolbar handlers
  document.getElementById('shelfManageBooksBtn').onclick = () => openManageShelfBooksModal(shelf.id);
  document.getElementById('shelfEditMetaBtn').onclick = () => {
    closeModal('shelfDetailModalOverlay');
    openEditShelfModal(shelf.id);
  };
  document.getElementById('shelfDeleteBtn').onclick = () => {
    confirmDeleteShelf(shelf.id);
  };

  openModal('shelfDetailModalOverlay');
}

function openManageShelfBooksModal(shelfId) {
  const shelf = AppState.shelves.find(s => s.id === shelfId);
  if (!shelf) return;

  const container = document.getElementById('shelfBookSelectionList');
  if (!container) return;

  if (AppState.books.length === 0) {
    container.innerHTML = `<p class="form-hint">No books available in library to add.</p>`;
  } else {
    container.innerHTML = AppState.books.map(book => {
      const isChecked = book.shelves && book.shelves.includes(shelf.id);
      return `
        <label class="shelf-selection-item">
          <input type="checkbox" value="${book.id}" ${isChecked ? 'checked' : ''}>
          <div>
            <strong>${escapeHTML(book.title)}</strong>
            <span style="font-size:0.8rem; color:var(--text-secondary); margin-left:6px;">by ${escapeHTML(book.author)}</span>
          </div>
        </label>
      `;
    }).join('');
  }

  document.getElementById('saveShelfBooksSelectionBtn').onclick = () => {
    const selectedIds = Array.from(container.querySelectorAll('input[type="checkbox"]:checked')).map(cb => cb.value);

    // Update each book
    AppState.books.forEach(b => {
      b.shelves = b.shelves || [];
      const hasShelf = b.shelves.includes(shelf.id);
      const shouldHaveShelf = selectedIds.includes(b.id);

      if (shouldHaveShelf && !hasShelf) {
        b.shelves.push(shelf.id);
      } else if (!shouldHaveShelf && hasShelf) {
        b.shelves = b.shelves.filter(sid => sid !== shelf.id);
      }
    });

    persistAllData();
    closeModal('manageShelfBooksOverlay');
    openShelfDetailsModal(shelf.id);
    renderShelves();
    showToast(`Updated shelf books for "${shelf.name}".`, 'success');
  };

  openModal('manageShelfBooksOverlay');
}

function openCreateShelfModal() {
  document.getElementById('shelfModalTitle').textContent = 'Create New Shelf';
  document.getElementById('shelfIdInput').value = '';
  document.getElementById('shelfNameInput').value = '';
  document.getElementById('shelfDescInput').value = '';
  document.getElementById('shelfColorInput').value = '#C98F98';
  document.getElementById('shelfNameError').classList.remove('visible');

  // Reset swatches
  document.querySelectorAll('#shelfColorSwatches .color-swatch').forEach(sw => {
    sw.classList.toggle('active', sw.dataset.color === '#C98F98');
  });

  openModal('shelfModalOverlay');
}

function openEditShelfModal(shelfId) {
  const shelf = AppState.shelves.find(s => s.id === shelfId);
  if (!shelf) return;

  document.getElementById('shelfModalTitle').textContent = 'Edit Shelf';
  document.getElementById('shelfIdInput').value = shelf.id;
  document.getElementById('shelfNameInput').value = shelf.name;
  document.getElementById('shelfDescInput').value = shelf.description || '';
  document.getElementById('shelfColorInput').value = shelf.color || '#C98F98';
  document.getElementById('shelfNameError').classList.remove('visible');

  document.querySelectorAll('#shelfColorSwatches .color-swatch').forEach(sw => {
    sw.classList.toggle('active', sw.dataset.color === shelf.color);
  });

  openModal('shelfModalOverlay');
}

function handleSaveShelf(e) {
  e.preventDefault();
  const idInput = document.getElementById('shelfIdInput').value;
  const nameInput = document.getElementById('shelfNameInput').value.trim();
  const descInput = document.getElementById('shelfDescInput').value.trim();
  const colorInput = document.getElementById('shelfColorInput').value;
  const errorEl = document.getElementById('shelfNameError');

  if (!nameInput) {
    errorEl.classList.add('visible');
    return;
  }
  errorEl.classList.remove('visible');

  if (idInput) {
    // Edit existing
    const shelf = AppState.shelves.find(s => s.id === idInput);
    if (shelf) {
      shelf.name = nameInput;
      shelf.description = descInput;
      shelf.color = colorInput;
    }
    showToast('Shelf updated.', 'success');
  } else {
    // Create new
    const newShelf = {
      id: 'shelf-' + Date.now(),
      name: nameInput,
      description: descInput,
      color: colorInput,
      isDefault: false
    };
    AppState.shelves.push(newShelf);
    showToast(`Created shelf "${nameInput}".`, 'success');
  }

  persistAllData();
  closeModal('shelfModalOverlay');
  renderShelves();
}

function confirmDeleteShelf(shelfId) {
  const shelf = AppState.shelves.find(s => s.id === shelfId);
  if (!shelf) return;

  openConfirmModal(
    'Delete Shelf?',
    `Are you sure you want to remove the shelf "${shelf.name}"? The books will remain in your library.`,
    () => {
      // Remove shelf reference from books
      AppState.books.forEach(b => {
        if (b.shelves) {
          b.shelves = b.shelves.filter(sid => sid !== shelfId);
        }
      });

      // Remove shelf
      AppState.shelves = AppState.shelves.filter(s => s.id !== shelfId);

      persistAllData();
      closeModal('shelfDetailModalOverlay');
      renderShelves();
      showToast(`Shelf "${shelf.name}" deleted.`, 'info');
    }
  );
}

/* ============================================================================
   11. READING JOURNAL (REVIEWS & FAVOURITE QUOTES)
   ============================================================================ */

function renderJournal() {
  renderJournalReviews();
  renderJournalQuotes();
}

function renderJournalReviews() {
  const container = document.getElementById('journalReviewsContainer');
  const emptyState = document.getElementById('journalReviewsEmpty');
  const countBadge = document.getElementById('journalReviewsCount');
  if (!container || !emptyState) return;

  countBadge.textContent = AppState.journalEntries.length;

  if (AppState.journalEntries.length === 0) {
    container.innerHTML = '';
    emptyState.style.display = 'block';
  } else {
    emptyState.style.display = 'none';
    container.innerHTML = AppState.journalEntries.map(entry => `
      <div class="journal-entry-card" data-entry-id="${entry.id}">
        <div class="journal-entry-header">
          <div>
            <h3 class="journal-entry-book">${escapeHTML(entry.bookTitle)}</h3>
            <span class="journal-entry-date">${entry.date || 'Undated'}</span>
          </div>
          <div class="card-action-icons">
            <button class="icon-btn-subtle" onclick="openEditJournalModal('${entry.id}')" title="Edit reflection">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
            </button>
            <button class="icon-btn-subtle" onclick="confirmDeleteJournal('${entry.id}')" title="Delete reflection">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
            </button>
          </div>
        </div>

        <div class="journal-entry-badges">
          ${entry.favCharacter ? `<span class="journal-badge-item">Character: <strong>${escapeHTML(entry.favCharacter)}</strong></span>` : ''}
          ${entry.impression ? `<span class="journal-badge-item">Impression: <em>${escapeHTML(entry.impression)}</em></span>` : ''}
        </div>

        <div class="journal-entry-body">${escapeHTML(entry.reviewText)}</div>

        ${entry.thoughts ? `
          <div class="journal-entry-thoughts">
            💭 ${escapeHTML(entry.thoughts)}
          </div>
        ` : ''}
      </div>
    `).join('');
  }
}

function renderJournalQuotes() {
  const container = document.getElementById('journalQuotesContainer');
  const emptyState = document.getElementById('journalQuotesEmpty');
  const countBadge = document.getElementById('journalQuotesCount');
  if (!container || !emptyState) return;

  countBadge.textContent = AppState.quotes.length;

  if (AppState.quotes.length === 0) {
    container.innerHTML = '';
    emptyState.style.display = 'block';
  } else {
    emptyState.style.display = 'none';
    container.innerHTML = AppState.quotes.map(quote => `
      <div class="quote-card" data-quote-id="${quote.id}">
        <p class="quote-card-text">“${escapeHTML(quote.text)}”</p>
        
        <div class="quote-card-author-row">
          <span class="quote-card-author">— ${escapeHTML(quote.author)}</span>
          <span class="quote-card-book">${escapeHTML(quote.bookTitle)}${quote.page ? `, p. ${escapeHTML(quote.page)}` : ''}</span>
        </div>

        <div class="quote-card-footer">
          <span class="quote-card-page">${quote.date ? `Saved ${quote.date}` : ''}</span>
          <div class="card-action-icons">
            <button class="icon-btn-subtle" onclick="openEditQuoteModal('${quote.id}')" title="Edit quote">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
            </button>
            <button class="icon-btn-subtle" onclick="confirmDeleteQuote('${quote.id}')" title="Delete quote">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
            </button>
          </div>
        </div>
      </div>
    `).join('');
  }
}

// Journal Review Modal Logic
function openNewJournalModal() {
  document.getElementById('journalModalTitle').textContent = 'Write a Reflection';
  document.getElementById('journalEntryId').value = '';
  document.getElementById('journalFavCharacter').value = '';
  document.getElementById('journalThoughts').value = '';
  document.getElementById('journalImpression').value = '';
  document.getElementById('journalReviewText').value = '';
  document.getElementById('journalBookError').classList.remove('visible');
  document.getElementById('journalReviewError').classList.remove('visible');

  // Populate book select
  const select = document.getElementById('journalBookSelect');
  select.innerHTML = `<option value="">-- Choose a book from your library --</option>` +
    AppState.books.map(b => `<option value="${b.id}">${escapeHTML(b.title)} (by ${escapeHTML(b.author)})</option>`).join('');

  openModal('journalModalOverlay');
}

function openEditJournalModal(entryId) {
  const entry = AppState.journalEntries.find(j => j.id === entryId);
  if (!entry) return;

  document.getElementById('journalModalTitle').textContent = 'Edit Reflection';
  document.getElementById('journalEntryId').value = entry.id;
  document.getElementById('journalFavCharacter').value = entry.favCharacter || '';
  document.getElementById('journalThoughts').value = entry.thoughts || '';
  document.getElementById('journalImpression').value = entry.impression || '';
  document.getElementById('journalReviewText').value = entry.reviewText || '';
  document.getElementById('journalBookError').classList.remove('visible');
  document.getElementById('journalReviewError').classList.remove('visible');

  const select = document.getElementById('journalBookSelect');
  select.innerHTML = `<option value="">-- Choose a book from your library --</option>` +
    AppState.books.map(b => `<option value="${b.id}" ${b.id === entry.bookId ? 'selected' : ''}>${escapeHTML(b.title)}</option>`).join('');

  openModal('journalModalOverlay');
}

function handleSaveJournal(e) {
  e.preventDefault();
  const idInput = document.getElementById('journalEntryId').value;
  const bookSelect = document.getElementById('journalBookSelect');
  const bookId = bookSelect.value;
  const reviewText = document.getElementById('journalReviewText').value.trim();
  const favChar = document.getElementById('journalFavCharacter').value.trim();
  const thoughts = document.getElementById('journalThoughts').value.trim();
  const impression = document.getElementById('journalImpression').value.trim();

  let hasError = false;
  if (!bookId) {
    document.getElementById('journalBookError').classList.add('visible');
    hasError = true;
  } else {
    document.getElementById('journalBookError').classList.remove('visible');
  }

  if (!reviewText) {
    document.getElementById('journalReviewError').classList.add('visible');
    hasError = true;
  } else {
    document.getElementById('journalReviewError').classList.remove('visible');
  }

  if (hasError) return;

  const book = AppState.books.find(b => b.id === bookId);
  const bookTitle = book ? book.title : 'Selected Book';

  if (idInput) {
    const entry = AppState.journalEntries.find(j => j.id === idInput);
    if (entry) {
      entry.bookId = bookId;
      entry.bookTitle = bookTitle;
      entry.favCharacter = favChar;
      entry.thoughts = thoughts;
      entry.impression = impression;
      entry.reviewText = reviewText;
    }
    showToast('Reflection updated.', 'success');
  } else {
    const newEntry = {
      id: 'journal-' + Date.now(),
      bookId,
      bookTitle,
      favCharacter: favChar,
      thoughts,
      impression,
      reviewText,
      date: new Date().toISOString().split('T')[0],
      isDemo: false
    };
    AppState.journalEntries.unshift(newEntry);
    showToast('Reflection added to your journal.', 'success');
  }

  // Also sync review back to book object if book review is empty
  if (book && !book.review) {
    book.review = reviewText;
  }

  persistAllData();
  closeModal('journalModalOverlay');
  renderJournalReviews();
}

function confirmDeleteJournal(entryId) {
  openConfirmModal(
    'Delete Reflection?',
    'Are you sure you want to remove this journal entry?',
    () => {
      AppState.journalEntries = AppState.journalEntries.filter(j => j.id !== entryId);
      persistAllData();
      renderJournalReviews();
      showToast('Reflection removed.', 'info');
    }
  );
}

// Quote Modal Logic
function openNewQuoteModal() {
  document.getElementById('quoteModalTitle').textContent = 'Save a Favourite Quote';
  document.getElementById('quoteIdInput').value = '';
  document.getElementById('quoteTextInput').value = '';
  document.getElementById('quoteBookInput').value = '';
  document.getElementById('quoteAuthorInput').value = '';
  document.getElementById('quotePageInput').value = '';
  document.getElementById('quoteDateInput').value = new Date().toISOString().split('T')[0];

  document.getElementById('quoteTextError').classList.remove('visible');
  document.getElementById('quoteBookError').classList.remove('visible');
  document.getElementById('quoteAuthorError').classList.remove('visible');

  openModal('quoteModalOverlay');
}

function openEditQuoteModal(quoteId) {
  const quote = AppState.quotes.find(q => q.id === quoteId);
  if (!quote) return;

  document.getElementById('quoteModalTitle').textContent = 'Edit Quote';
  document.getElementById('quoteIdInput').value = quote.id;
  document.getElementById('quoteTextInput').value = quote.text;
  document.getElementById('quoteBookInput').value = quote.bookTitle;
  document.getElementById('quoteAuthorInput').value = quote.author;
  document.getElementById('quotePageInput').value = quote.page || '';
  document.getElementById('quoteDateInput').value = quote.date || '';

  document.getElementById('quoteTextError').classList.remove('visible');
  document.getElementById('quoteBookError').classList.remove('visible');
  document.getElementById('quoteAuthorError').classList.remove('visible');

  openModal('quoteModalOverlay');
}

function handleSaveQuote(e) {
  e.preventDefault();
  const idInput = document.getElementById('quoteIdInput').value;
  const text = document.getElementById('quoteTextInput').value.trim();
  const bookTitle = document.getElementById('quoteBookInput').value.trim();
  const author = document.getElementById('quoteAuthorInput').value.trim();
  const page = document.getElementById('quotePageInput').value.trim();
  const date = document.getElementById('quoteDateInput').value;

  let hasError = false;
  if (!text) {
    document.getElementById('quoteTextError').classList.add('visible');
    hasError = true;
  } else {
    document.getElementById('quoteTextError').classList.remove('visible');
  }

  if (!bookTitle) {
    document.getElementById('quoteBookError').classList.add('visible');
    hasError = true;
  } else {
    document.getElementById('quoteBookError').classList.remove('visible');
  }

  if (!author) {
    document.getElementById('quoteAuthorError').classList.add('visible');
    hasError = true;
  } else {
    document.getElementById('quoteAuthorError').classList.remove('visible');
  }

  if (hasError) return;

  if (idInput) {
    const q = AppState.quotes.find(item => item.id === idInput);
    if (q) {
      q.text = text;
      q.bookTitle = bookTitle;
      q.author = author;
      q.page = page;
      q.date = date;
    }
    showToast('Quote updated.', 'success');
  } else {
    const newQuote = {
      id: 'quote-' + Date.now(),
      text,
      bookTitle,
      author,
      page,
      date: date || new Date().toISOString().split('T')[0],
      isDemo: false
    };
    AppState.quotes.unshift(newQuote);
    showToast('Quote saved to your collection.', 'success');
  }

  persistAllData();
  closeModal('quoteModalOverlay');
  renderJournalQuotes();
}

function confirmDeleteQuote(quoteId) {
  openConfirmModal(
    'Delete Quote?',
    'Are you sure you want to remove this quote from your collection?',
    () => {
      AppState.quotes = AppState.quotes.filter(q => q.id !== quoteId);
      persistAllData();
      renderJournalQuotes();
      showToast('Quote removed.', 'info');
    }
  );
}

/* ============================================================================
   12. READING GOALS & MILESTONES
   ============================================================================ */

function renderGoals() {
  const currentYear = new Date().getFullYear();
  const currentMonthName = new Date().toLocaleString('default', { month: 'long' });

  document.getElementById('annualYearLabel').textContent = currentYear;
  document.getElementById('currentMonthGoalTitle').textContent = `${currentMonthName} Goal`;

  // Annual Target
  const annualTarget = Number(AppState.goals.annualTarget) || 24;
  const completedThisYear = AppState.books.filter(b => {
    if (b.status !== 'Completed') return false;
    if (!b.dateFinished) return true;
    return new Date(b.dateFinished).getFullYear() === currentYear;
  }).length;

  const annualPercent = Math.min(100, Math.round((completedThisYear / annualTarget) * 100));
  const remainingBooks = Math.max(0, annualTarget - completedThisYear);

  document.getElementById('annualCompletedNum').textContent = completedThisYear;
  document.getElementById('annualTargetNum').textContent = annualTarget;
  document.getElementById('annualGoalProgressBar').style.width = `${annualPercent}%`;
  document.getElementById('annualCompletedText').textContent = `${completedThisYear} books`;
  document.getElementById('annualRemainingText').textContent = `${remainingBooks} books`;
  document.getElementById('annualPercentText').textContent = `${annualPercent}%`;

  // Milestone message
  let milestoneMsg = "The library doors are open. Every book is an adventure awaiting you.";
  if (completedThisYear >= annualTarget) {
    milestoneMsg = "🌟 Exquisite accomplishment! You have fulfilled your annual reading challenge.";
  } else if (annualPercent >= 75) {
    milestoneMsg = "The final stretch! You are reading with inspiring grace and consistency.";
  } else if (annualPercent >= 50) {
    milestoneMsg = "Halfway through your journey! So many worlds already discovered.";
  } else if (annualPercent >= 25) {
    milestoneMsg = "A quarter of your voyage charted. Keep the pages turning gently.";
  } else if (completedThisYear > 0) {
    milestoneMsg = "Your first stories are complete. The momentum has taken flight.";
  }
  document.getElementById('annualMilestoneMessage').textContent = milestoneMsg;

  // Monthly Target
  const monthlyTarget = Number(AppState.goals.monthlyTarget) || 2;
  const completedThisMonth = AppState.books.filter(b => {
    if (b.status !== 'Completed' || !b.dateFinished) return false;
    const finishDate = new Date(b.dateFinished);
    return finishDate.getFullYear() === currentYear && finishDate.getMonth() === new Date().getMonth();
  }).length;

  const monthlyPercent = Math.min(100, Math.round((completedThisMonth / monthlyTarget) * 100));

  document.getElementById('monthlyCompletedNum').textContent = completedThisMonth;
  document.getElementById('monthlyTargetNum').textContent = monthlyTarget;
  document.getElementById('monthlyGoalProgressBar').style.width = `${monthlyPercent}%`;
  document.getElementById('monthlyCompletedText').textContent = `${completedThisMonth} books`;
  document.getElementById('monthlyTargetText').textContent = `${monthlyTarget} books`;
  document.getElementById('monthlyPercentText').textContent = `${monthlyPercent}%`;

  // Daily Habit
  const dailyTarget = Number(AppState.goals.dailyMinutesTarget) || 30;
  const dailyLogged = Number(AppState.goals.dailyMinutesLogged) || 0;
  const dailyPercent = Math.min(100, Math.round((dailyLogged / dailyTarget) * 100));

  document.getElementById('dailyCurrentMinutes').textContent = dailyLogged;
  document.getElementById('dailyTargetMinutes').textContent = dailyTarget;
  document.getElementById('dailyGoalProgressBar').style.width = `${dailyPercent}%`;
  document.getElementById('dailyStreakBadge').textContent = `${AppState.goals.streakDays} day streak`;

  // Render Milestones Badges
  renderMilestoneBadges(completedThisYear, totalPagesReadCalc());
}

function totalPagesReadCalc() {
  return AppState.books.reduce((sum, b) => {
    if (b.status === 'Completed') return sum + (Number(b.totalPages) || Number(b.currentPage) || 0);
    return sum + (Number(b.currentPage) || 0);
  }, 0);
}

function renderMilestoneBadges(completedCount, totalPages) {
  const container = document.getElementById('milestonesContainer');
  if (!container) return;

  const badges = [
    {
      title: "First Voyage",
      desc: "Complete your first book of the year.",
      icon: "🌱",
      unlocked: completedCount >= 1
    },
    {
      title: "Passionate Reader",
      desc: "Complete 5 books in your library.",
      icon: "📚",
      unlocked: completedCount >= 5
    },
    {
      title: "Literary Devotee",
      desc: "Complete 10 books in your library.",
      icon: "⚜️",
      unlocked: completedCount >= 10
    },
    {
      title: "Thousand Pages",
      desc: "Turn over 1,000 pages of stories.",
      icon: "✨",
      unlocked: totalPages >= 1000
    },
    {
      title: "Master of Tomes",
      desc: "Turn over 5,000 pages of literature.",
      icon: "👑",
      unlocked: totalPages >= 5000
    },
    {
      title: "Curator of Shelves",
      desc: "Organise books into 3 or more shelves.",
      icon: "🏛️",
      unlocked: AppState.shelves.length >= 3
    }
  ];

  container.innerHTML = badges.map(badge => `
    <div class="milestone-badge-card ${badge.unlocked ? 'unlocked' : ''}">
      <div class="milestone-icon-box">${badge.icon}</div>
      <div class="milestone-info">
        <h4 class="milestone-title">${escapeHTML(badge.title)}</h4>
        <span class="milestone-desc">${escapeHTML(badge.desc)}</span>
      </div>
    </div>
  `).join('');
}

function logDailyReadingHabit(minutesToAdd) {
  const todayStr = new Date().toISOString().split('T')[0];
  const lastActive = AppState.goals.lastActiveDate;

  if (lastActive !== todayStr) {
    // New day
    AppState.goals.dailyMinutesLogged = minutesToAdd;
    AppState.goals.lastActiveDate = todayStr;
    AppState.goals.streakDays = (AppState.goals.streakDays || 0) + 1;
  } else {
    // Same day, accumulate minutes
    AppState.goals.dailyMinutesLogged = (AppState.goals.dailyMinutesLogged || 0) + minutesToAdd;
  }

  saveDataToStorage(STORAGE_KEYS.GOALS, AppState.goals);
  renderGoals();
  showToast(`Logged ${minutesToAdd} min of reading today. Current streak: ${AppState.goals.streakDays} days! 🔥`, 'success');
}

function openEditGoalsModal() {
  document.getElementById('goalsFormYear').textContent = new Date().getFullYear();
  document.getElementById('annualTargetInput').value = AppState.goals.annualTarget || 24;
  document.getElementById('monthlyTargetInput').value = AppState.goals.monthlyTarget || 2;
  document.getElementById('dailyTargetInput').value = AppState.goals.dailyMinutesTarget || 30;

  openModal('goalsModalOverlay');
}

function handleSaveGoals(e) {
  e.preventDefault();
  const annual = parseInt(document.getElementById('annualTargetInput').value, 10);
  const monthly = parseInt(document.getElementById('monthlyTargetInput').value, 10);
  const daily = parseInt(document.getElementById('dailyTargetInput').value, 10);

  AppState.goals.annualTarget = annual || 24;
  AppState.goals.monthlyTarget = monthly || 2;
  AppState.goals.dailyMinutesTarget = daily || 30;

  saveDataToStorage(STORAGE_KEYS.GOALS, AppState.goals);
  closeModal('goalsModalOverlay');
  renderGoals();
  renderOverview();
  showToast('Reading targets updated successfully.', 'success');
}

/* ============================================================================
   13. READING STATISTICS
   ============================================================================ */

function renderStatistics() {
  const currentYear = new Date().getFullYear();
  document.getElementById('statsChartYear').textContent = currentYear;

  const totalBooks = AppState.books.length;
  const completedThisYear = AppState.books.filter(b => {
    if (b.status !== 'Completed') return false;
    if (!b.dateFinished) return true;
    return new Date(b.dateFinished).getFullYear() === currentYear;
  }).length;

  const totalPages = totalPagesReadCalc();

  // Average rating calculation
  const ratedBooks = AppState.books.filter(b => b.rating && Number(b.rating) > 0);
  const avgRating = ratedBooks.length > 0
    ? (ratedBooks.reduce((sum, b) => sum + Number(b.rating), 0) / ratedBooks.length).toFixed(1)
    : '0.0';

  // Most read genre
  const genreCounts = {};
  AppState.books.forEach(b => {
    if (b.genre) {
      genreCounts[b.genre] = (genreCounts[b.genre] || 0) + 1;
    }
  });

  let topGenre = '—';
  let topCount = 0;
  for (let g in genreCounts) {
    if (genreCounts[g] > topCount) {
      topCount = genreCounts[g];
      topGenre = g;
    }
  }

  document.getElementById('statsTotalBooksCount').textContent = totalBooks;
  document.getElementById('statsCompletedYearCount').textContent = completedThisYear;
  document.getElementById('statsTotalPagesCount').textContent = totalPages.toLocaleString();
  document.getElementById('statsAvgRating').textContent = `${avgRating} ★`;
  document.getElementById('statsTopGenre').textContent = topGenre;

  // Render Status Segmented Bar
  renderStatusSegmentedBar();

  // Render Monthly CSS Bar Chart
  renderMonthlyBarChart(currentYear);

  // Render Format Breakdown
  renderFormatBreakdown();

  // Render Mood Cloud
  renderMoodsCloud();
}

function renderStatusSegmentedBar() {
  const barContainer = document.getElementById('statsStatusBar');
  const legendContainer = document.getElementById('statsStatusLegend');
  if (!barContainer || !legendContainer) return;

  const total = AppState.books.length;
  if (total === 0) {
    barContainer.innerHTML = `<div class="segmented-segment" style="width:100%; background:var(--border-delicate);"></div>`;
    legendContainer.innerHTML = `<span style="font-size:0.8rem; color:var(--text-muted);">No books in library to analyse.</span>`;
    return;
  }

  const statuses = [
    { label: 'Completed', color: 'var(--status-completed)' },
    { label: 'Currently Reading', color: 'var(--status-reading)' },
    { label: 'Want to Read', color: 'var(--status-wishlist)' },
    { label: 'On Hold', color: 'var(--status-onhold)' },
    { label: 'Did Not Finish (DNF)', color: 'var(--status-dnf)', short: 'DNF' },
    { label: 'Rereading', color: 'var(--status-rereading)' }
  ];

  let barHTML = '';
  let legendHTML = '';

  statuses.forEach(s => {
    const count = AppState.books.filter(b => b.status === s.label).length;
    if (count > 0) {
      const pct = ((count / total) * 100).toFixed(1);
      barHTML += `<div class="segmented-segment" style="width:${pct}%; background:${s.color};" title="${s.label}: ${count} (${pct}%)"></div>`;
      legendHTML += `
        <div class="legend-item">
          <span class="legend-dot" style="background:${s.color};"></span>
          <span>${s.short || s.label}: <strong>${count}</strong> (${pct}%)</span>
        </div>
      `;
    }
  });

  barContainer.innerHTML = barHTML;
  legendContainer.innerHTML = legendHTML;
}

function renderMonthlyBarChart(year) {
  const container = document.getElementById('monthlyBarChart');
  if (!container) return;

  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthCounts = new Array(12).fill(0);

  AppState.books.forEach(b => {
    if (b.status === 'Completed' && b.dateFinished) {
      const d = new Date(b.dateFinished);
      if (d.getFullYear() === year) {
        monthCounts[d.getMonth()]++;
      }
    }
  });

  const maxVal = Math.max(1, ...monthCounts);

  container.innerHTML = monthNames.map((month, idx) => {
    const count = monthCounts[idx];
    const heightPercent = count > 0 ? Math.round((count / maxVal) * 100) : 4;

    return `
      <div class="chart-bar-group">
        ${count > 0 ? `<span class="chart-bar-value">${count}</span>` : ''}
        <div class="chart-bar" style="height: ${heightPercent}%;"></div>
        <span class="chart-bar-label">${month}</span>
      </div>
    `;
  }).join('');
}

function renderFormatBreakdown() {
  const container = document.getElementById('statsFormatList');
  if (!container) return;

  const total = AppState.books.length;
  const formats = ['Paperback', 'Hardcover', 'Ebook', 'Audiobook'];

  if (total === 0) {
    container.innerHTML = `<span style="font-size:0.8rem; color:var(--text-muted);">No format records yet.</span>`;
    return;
  }

  container.innerHTML = formats.map(fmt => {
    const count = AppState.books.filter(b => (b.format || 'Paperback') === fmt).length;
    const pct = ((count / total) * 100).toFixed(0);

    return `
      <div class="format-bar-row">
        <div class="format-info-line">
          <span>${fmt}</span>
          <span><strong>${count}</strong> (${pct}%)</span>
        </div>
        <div class="progress-bar-track">
          <div class="progress-bar-fill plum-fill" style="width: ${pct}%;"></div>
        </div>
      </div>
    `;
  }).join('');
}

function renderMoodsCloud() {
  const container = document.getElementById('statsMoodsCloud');
  if (!container) return;

  const moodCounts = {};
  AppState.books.forEach(b => {
    (b.moods || []).forEach(m => {
      moodCounts[m] = (moodCounts[m] || 0) + 1;
    });
  });

  const entries = Object.entries(moodCounts).sort((a, b) => b[1] - a[1]);

  if (entries.length === 0) {
    container.innerHTML = `<span style="font-size:0.8rem; color:var(--text-muted);">Assign reading moods to your books to see an emotional breakdown.</span>`;
    return;
  }

  container.innerHTML = entries.map(([mood, count]) => `
    <div class="mood-bubble">
      <span>${escapeHTML(mood)}</span>
      <span class="mood-bubble-count">${count}</span>
    </div>
  `).join('');
}

/* ============================================================================
   14. ADD / EDIT BOOK MODAL & IMAGE COMPRESSION
   ============================================================================ */

function openAddBookModal() {
  document.getElementById('bookModalTitle').textContent = 'Add a Book';
  document.getElementById('bookIdInput').value = '';
  document.getElementById('bookTitle').value = '';
  document.getElementById('bookAuthor').value = '';
  document.getElementById('bookCoverUrl').value = '';
  document.getElementById('bookCoverFileInput').value = '';
  document.getElementById('uploadFileNameHint').textContent = '';
  document.getElementById('bookGenre').value = 'Fiction';
  document.getElementById('customGenreGroup').style.display = 'none';
  document.getElementById('bookCustomGenre').value = '';
  document.getElementById('bookFormat').value = 'Paperback';
  document.getElementById('bookStatus').value = 'Want to Read';
  document.getElementById('bookTotalPages').value = '';
  document.getElementById('bookCurrentPage').value = '';
  document.getElementById('bookRatingInput').value = '';
  document.getElementById('bookDateStarted').value = '';
  document.getElementById('bookDateFinished').value = '';
  document.getElementById('bookReview').value = '';
  document.getElementById('bookNotes').value = '';

  // Reset star rating widget
  updateStarRatingWidget(0);

  // Reset mood chips
  document.querySelectorAll('#formMoodsSelector .mood-chip').forEach(c => c.classList.remove('selected'));

  // Reset cover preview
  updateFormCoverPreview('');

  // Render shelves checkboxes
  renderFormShelvesCheckboxes([]);

  // Hide validation errors
  document.getElementById('bookTitleError').classList.remove('visible');
  document.getElementById('bookAuthorError').classList.remove('visible');

  openModal('bookModalOverlay');
}

function openEditBookModal(bookId) {
  const book = AppState.books.find(b => b.id === bookId);
  if (!book) return;

  document.getElementById('bookModalTitle').textContent = 'Edit Book';
  document.getElementById('bookIdInput').value = book.id;
  document.getElementById('bookTitle').value = book.title;
  document.getElementById('bookAuthor').value = book.author;
  document.getElementById('bookCoverUrl').value = book.coverUrl || '';
  document.getElementById('bookCoverFileInput').value = '';
  document.getElementById('uploadFileNameHint').textContent = '';

  // Genre handling
  const predefinedGenres = Array.from(document.getElementById('bookGenre').options).map(o => o.value);
  if (predefinedGenres.includes(book.genre)) {
    document.getElementById('bookGenre').value = book.genre;
    document.getElementById('customGenreGroup').style.display = 'none';
    document.getElementById('bookCustomGenre').value = '';
  } else {
    document.getElementById('bookGenre').value = 'Other';
    document.getElementById('customGenreGroup').style.display = 'block';
    document.getElementById('bookCustomGenre').value = book.genre || '';
  }

  document.getElementById('bookFormat').value = book.format || 'Paperback';
  document.getElementById('bookStatus').value = book.status || 'Want to Read';
  document.getElementById('bookTotalPages').value = book.totalPages || '';
  document.getElementById('bookCurrentPage').value = book.currentPage || '';
  document.getElementById('bookRatingInput').value = book.rating || '';
  document.getElementById('bookDateStarted').value = book.dateStarted || '';
  document.getElementById('bookDateFinished').value = book.dateFinished || '';
  document.getElementById('bookReview').value = book.review || '';
  document.getElementById('bookNotes').value = book.notes || '';

  // Rating widget
  updateStarRatingWidget(book.rating || 0);

  // Mood chips
  document.querySelectorAll('#formMoodsSelector .mood-chip').forEach(c => {
    const isSelected = book.moods && book.moods.includes(c.dataset.mood);
    c.classList.toggle('selected', isSelected);
  });

  // Cover preview
  updateFormCoverPreview(book.coverUrl || '');

  // Shelves checkboxes
  renderFormShelvesCheckboxes(book.shelves || []);

  // Validation
  document.getElementById('bookTitleError').classList.remove('visible');
  document.getElementById('bookAuthorError').classList.remove('visible');

  openModal('bookModalOverlay');
}

function updateFormCoverPreview(url) {
  const placeholder = document.getElementById('formCoverPlaceholder');
  const img = document.getElementById('formCoverImagePreview');
  if (url && url.trim().length > 0) {
    img.src = url;
    img.style.display = 'block';
    placeholder.style.display = 'none';
  } else {
    img.src = '';
    img.style.display = 'none';
    placeholder.style.display = 'flex';
  }
}

function renderFormShelvesCheckboxes(assignedShelves) {
  const container = document.getElementById('formShelvesCheckboxes');
  if (!container) return;

  if (AppState.shelves.length === 0) {
    container.innerHTML = `<span style="font-size:0.78rem; color:var(--text-muted);">No shelves created yet.</span>`;
    return;
  }

  container.innerHTML = AppState.shelves.map(shelf => {
    const isChecked = assignedShelves.includes(shelf.id);
    return `
      <label class="shelf-checkbox-item">
        <input type="checkbox" name="shelfCheckbox" value="${shelf.id}" ${isChecked ? 'checked' : ''}>
        <span>${escapeHTML(shelf.name)}</span>
      </label>
    `;
  }).join('');
}

/**
 * Compresses an uploaded image via Canvas to max 400x600 px to preserve LocalStorage space.
 */
function handleImageFileUpload(e) {
  const file = e.target.files[0];
  if (!file) return;

  if (!file.type.startsWith('image/')) {
    showToast('Please select a valid image file.', 'error');
    return;
  }

  const reader = new FileReader();
  reader.onload = function(event) {
    const img = new Image();
    img.onload = function() {
      // Scale down image to preserve LocalStorage capacity
      const MAX_WIDTH = 400;
      const MAX_HEIGHT = 600;
      let width = img.width;
      let height = img.height;

      if (width > height) {
        if (width > MAX_WIDTH) {
          height *= MAX_WIDTH / width;
          width = MAX_WIDTH;
        }
      } else {
        if (height > MAX_HEIGHT) {
          width *= MAX_HEIGHT / height;
          height = MAX_HEIGHT;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);

      // Compress to 0.78 JPEG quality (~25-45 KB)
      const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.78);

      document.getElementById('bookCoverUrl').value = compressedDataUrl;
      updateFormCoverPreview(compressedDataUrl);
      document.getElementById('uploadFileNameHint').textContent = `Uploaded: ${file.name}`;
      showToast('Cover image compressed and loaded.', 'info');
    };
    img.src = event.target.result;
  };
  reader.readAsDataURL(file);
}

function handleSaveBook(e) {
  e.preventDefault();

  const idInput = document.getElementById('bookIdInput').value;
  const title = document.getElementById('bookTitle').value.trim();
  const author = document.getElementById('bookAuthor').value.trim();

  let hasError = false;
  if (!title) {
    document.getElementById('bookTitleError').classList.add('visible');
    hasError = true;
  } else {
    document.getElementById('bookTitleError').classList.remove('visible');
  }

  if (!author) {
    document.getElementById('bookAuthorError').classList.add('visible');
    hasError = true;
  } else {
    document.getElementById('bookAuthorError').classList.remove('visible');
  }

  if (hasError) return;

  // Genre
  let genre = document.getElementById('bookGenre').value;
  if (genre === 'Other') {
    const customGenre = document.getElementById('bookCustomGenre').value.trim();
    genre = customGenre || 'Other';
  }

  const format = document.getElementById('bookFormat').value;
  const status = document.getElementById('bookStatus').value;
  const totalPages = parseInt(document.getElementById('bookTotalPages').value, 10) || 0;
  let currentPage = parseInt(document.getElementById('bookCurrentPage').value, 10) || 0;
  const rating = parseInt(document.getElementById('bookRatingInput').value, 10) || null;
  const coverUrl = document.getElementById('bookCoverUrl').value.trim();
  let dateStarted = document.getElementById('bookDateStarted').value;
  let dateFinished = document.getElementById('bookDateFinished').value;
  const review = document.getElementById('bookReview').value.trim();
  const notes = document.getElementById('bookNotes').value.trim();

  // Smart date & progress adjustments
  const todayStr = new Date().toISOString().split('T')[0];
  if (status === 'Completed') {
    if (!dateFinished) dateFinished = todayStr;
    if (totalPages > 0 && currentPage < totalPages) {
      currentPage = totalPages;
    }
  } else if ((status === 'Currently Reading' || status === 'Rereading') && !dateStarted) {
    dateStarted = todayStr;
  }

  // Moods
  const selectedMoods = Array.from(document.querySelectorAll('#formMoodsSelector .mood-chip.selected'))
    .map(c => c.dataset.mood);

  // Shelves
  const selectedShelves = Array.from(document.querySelectorAll('input[name="shelfCheckbox"]:checked'))
    .map(cb => cb.value);

  if (idInput) {
    // Edit existing book
    const book = AppState.books.find(b => b.id === idInput);
    if (book) {
      book.title = title;
      book.author = author;
      book.coverUrl = coverUrl;
      book.genre = genre;
      book.format = format;
      book.status = status;
      book.totalPages = totalPages;
      book.currentPage = Math.min(totalPages || 99999, currentPage);
      book.rating = rating;
      book.moods = selectedMoods;
      book.shelves = selectedShelves;
      book.dateStarted = dateStarted;
      book.dateFinished = dateFinished;
      book.review = review;
      book.notes = notes;
    }
    showToast(`Updated "${title}".`, 'success');
  } else {
    // Add new book
    const newBook = {
      id: 'book-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
      title,
      author,
      coverUrl,
      genre,
      format,
      status,
      totalPages,
      currentPage: Math.min(totalPages || 99999, currentPage),
      rating,
      moods: selectedMoods,
      shelves: selectedShelves,
      dateStarted,
      dateFinished,
      review,
      notes,
      dateAdded: new Date().toISOString(),
      isDemo: false
    };
    AppState.books.unshift(newBook);
    showToast(`Added "${title}" to your library.`, 'success');
  }

  persistAllData();
  closeModal('bookModalOverlay');
  renderAllViews();
}

function updateStarRatingWidget(value) {
  document.getElementById('bookRatingInput').value = value || '';
  document.querySelectorAll('#formStarRating .star-btn').forEach(star => {
    const starVal = parseInt(star.dataset.value, 10);
    star.classList.toggle('active', starVal <= value);
  });
}

/* ============================================================================
   15. BOOK DETAILS VIEW & MODAL
   ============================================================================ */

function openBookDetailsModal(bookId) {
  AppState.activeDetailBookId = bookId;
  const book = AppState.books.find(b => b.id === bookId);
  if (!book) return;

  const statusBadge = document.getElementById('detailStatusBadge');
  statusBadge.textContent = book.status;
  const statusSlug = book.status.toLowerCase().replace(/[^a-z0-9]/g, '-');
  statusBadge.className = `modal-header-tag badge-${statusSlug}`;

  const body = document.getElementById('detailModalBody');
  const total = Number(book.totalPages) || 0;
  const current = Number(book.currentPage) || 0;
  const percent = total > 0 ? Math.min(100, Math.round((current / total) * 100)) : 0;
  const remaining = Math.max(0, total - current);

  // Shelves names
  const shelfNames = (book.shelves || []).map(sid => {
    const s = AppState.shelves.find(item => item.id === sid);
    return s ? s.name : null;
  }).filter(Boolean);

  body.innerHTML = `
    <div class="detail-cover-wrapper">
      ${book.coverUrl 
        ? `<img src="${escapeHTML(book.coverUrl)}" alt="${escapeHTML(book.title)}" data-title="${escapeHTML(book.title)}" data-author="${escapeHTML(book.author)}" data-status="${escapeHTML(book.status)}" onerror="window.handleCoverError && window.handleCoverError(this);" />` 
        : createProceduralCoverHTML(book.title, book.author)}
    </div>

    <div class="detail-info">
      <h2 class="detail-title" id="detailBookTitle">${escapeHTML(book.title)}</h2>
      <span class="detail-author">by ${escapeHTML(book.author)}</span>

      <div class="detail-meta-pills">
        <span class="detail-pill">${escapeHTML(book.genre || 'General')}</span>
        <span class="detail-pill">${escapeHTML(book.format || 'Paperback')}</span>
        ${total > 0 ? `<span class="detail-pill">${total} pages</span>` : ''}
      </div>

      <div class="detail-rating">
        ${renderStarRatingDisplay(book.rating)}
        ${book.rating ? `<span style="font-size:0.85rem; color:var(--text-secondary); margin-left:6px;">(${book.rating} out of 5 stars)</span>` : ''}
      </div>

      ${(book.status === 'Currently Reading' || book.status === 'Rereading') ? `
        <div class="reading-now-tracker-card" style="margin-top:0; margin-bottom: 20px;">
          <div class="reading-now-tracker-stats">
            <div>
              <span class="reading-now-big-percent">${percent}%</span>
              <span style="font-size: 0.8rem; color: var(--text-secondary); margin-left: 6px;">progress</span>
            </div>
            <div class="reading-now-pages-info">
              Page ${current} of ${total || '—'} (${remaining} pages remaining)
            </div>
          </div>
          <div class="progress-bar-track large">
            <div class="progress-bar-fill rose-fill" style="width: ${percent}%;"></div>
          </div>
        </div>
      ` : ''}

      <div class="detail-dates-row">
        <div>
          <span class="stat-lbl">Added</span>
          <span class="stat-val">${book.dateAdded ? new Date(book.dateAdded).toLocaleDateString() : '—'}</span>
        </div>
        <div>
          <span class="stat-lbl">Started</span>
          <span class="stat-val">${book.dateStarted || '—'}</span>
        </div>
        <div>
          <span class="stat-lbl">Finished</span>
          <span class="stat-val">${book.dateFinished || '—'}</span>
        </div>
      </div>

      ${shelfNames.length > 0 ? `
        <div style="margin-bottom: 16px;">
          <span class="detail-section-title">Shelves</span>
          <div style="display:flex; flex-wrap:wrap; gap:6px; margin-top:4px;">
            ${shelfNames.map(name => `<span class="detail-pill">${escapeHTML(name)}</span>`).join('')}
          </div>
        </div>
      ` : ''}

      ${book.moods && book.moods.length > 0 ? `
        <div style="margin-bottom: 16px;">
          <span class="detail-section-title">Reading Moods</span>
          <div style="display:flex; flex-wrap:wrap; gap:6px; margin-top:4px;">
            ${book.moods.map(m => `<span class="mood-tag-mini">${escapeHTML(m)}</span>`).join('')}
          </div>
        </div>
      ` : ''}

      <div>
        <span class="detail-section-title">Personal Review</span>
        ${book.review ? `
          <div class="detail-text-block">${escapeHTML(book.review)}</div>
        ` : `
          <p class="detail-empty-prompt">You haven't written a review yet. Share what this story made you feel...</p>
        `}
      </div>

      <div>
        <span class="detail-section-title">Personal Notes</span>
        ${book.notes ? `
          <div class="detail-text-block">${escapeHTML(book.notes)}</div>
        ` : `
          <p class="detail-empty-prompt">No private reading notes recorded.</p>
        `}
      </div>
    </div>
  `;

  // Action buttons
  document.getElementById('detailEditBtn').onclick = () => {
    closeModal('bookDetailsModalOverlay');
    openEditBookModal(book.id);
  };
  document.getElementById('detailUpdateProgressBtn').onclick = () => {
    closeModal('bookDetailsModalOverlay');
    openProgressModal(book.id);
  };
  document.getElementById('detailDeleteBtn').onclick = () => {
    confirmDeleteBook(book.id);
  };

  openModal('bookDetailsModalOverlay');
}

function confirmDeleteBook(bookId) {
  const book = AppState.books.find(b => b.id === bookId);
  if (!book) return;

  openConfirmModal(
    'Delete Book?',
    `Are you sure you want to delete "${book.title}"? This will also remove any linked journal reflections.`,
    () => {
      AppState.books = AppState.books.filter(b => b.id !== bookId);
      AppState.journalEntries = AppState.journalEntries.filter(j => j.bookId !== bookId);

      persistAllData();
      closeModal('bookDetailsModalOverlay');
      renderAllViews();
      showToast(`"${book.title}" was removed from your library.`, 'info');
    }
  );
}

/* ============================================================================
   16. READING PROGRESS TRACKER MODAL
   ============================================================================ */

function openProgressModal(bookId) {
  const book = AppState.books.find(b => b.id === bookId);
  if (!book) return;

  document.getElementById('progressBookId').value = book.id;
  document.getElementById('progressBookTitle').textContent = book.title;
  document.getElementById('progressBookAuthor').textContent = `by ${book.author}`;

  const thumb = document.getElementById('progressBookThumb');
  thumb.innerHTML = book.coverUrl 
    ? `<img src="${escapeHTML(book.coverUrl)}" alt="${escapeHTML(book.title)}" data-title="${escapeHTML(book.title)}" data-author="${escapeHTML(book.author)}" data-status="${escapeHTML(book.status)}" onerror="window.handleCoverError && window.handleCoverError(this);" />` 
    : createProceduralCoverHTML(book.title, book.author);

  const total = Number(book.totalPages) || 100;
  const current = Number(book.currentPage) || 0;

  document.getElementById('progCurrentPageInput').value = current;
  document.getElementById('progTotalPagesInput').value = total;

  updateProgressModalDisplay(current, total);
  openModal('progressModalOverlay');
}

function updateProgressModalDisplay(current, total) {
  const validTotal = Math.max(1, total);
  const validCurrent = Math.max(0, Math.min(validTotal, current));
  const percent = ((validCurrent / validTotal) * 100).toFixed(1);
  const remaining = validTotal - validCurrent;

  document.getElementById('progPercentDisplay').textContent = `${percent}%`;
  document.getElementById('progRemainingDisplay').textContent = `${remaining} pgs remaining`;
  document.getElementById('progLiveProgressBar').style.width = `${percent}%`;

  const completionBox = document.getElementById('progCompletionNotice');
  if (validCurrent >= validTotal && validTotal > 0) {
    completionBox.style.display = 'block';
  } else {
    completionBox.style.display = 'none';
  }
}

function handleSaveProgress(e) {
  e.preventDefault();
  const bookId = document.getElementById('progressBookId').value;
  const book = AppState.books.find(b => b.id === bookId);
  if (!book) return;

  const total = parseInt(document.getElementById('progTotalPagesInput').value, 10) || book.totalPages || 1;
  let current = parseInt(document.getElementById('progCurrentPageInput').value, 10) || 0;

  if (current > total) {
    current = total;
  }
  if (current < 0) {
    current = 0;
  }

  const pagesTurned = Math.max(0, current - (book.currentPage || 0));
  book.totalPages = total;
  book.currentPage = current;

  // If marked 100% completed
  const markCompleted = document.getElementById('markCompletedCheck').checked;
  if (current >= total && markCompleted) {
    book.status = 'Completed';
    if (!book.dateFinished) {
      book.dateFinished = new Date().toISOString().split('T')[0];
    }
    showToast(`Congratulations on completing "${book.title}"! 🎉`, 'success');
  } else {
    showToast(`Updated progress for "${book.title}".`, 'success');
  }

  if (pagesTurned > 0) {
    logDailyReadingHabit(Math.round(pagesTurned * 1.5));
  }

  persistAllData();
  closeModal('progressModalOverlay');
  renderAllViews();
}

function showCompletionPromptForBook(book) {
  openConfirmModal(
    'Book Finished! 🎉',
    `You've reached page ${book.currentPage} of ${book.totalPages} in "${book.title}". Would you like to mark it as Completed?`,
    () => {
      book.status = 'Completed';
      book.dateFinished = new Date().toISOString().split('T')[0];
      persistAllData();
      renderAllViews();
      showToast(`Marked "${book.title}" as Completed!`, 'success');
    }
  );
}

/* ============================================================================
   17. JSON BACKUP EXPORT & IMPORT
   ============================================================================ */

function exportLibraryJSON() {
  const exportPayload = {
    appName: "Between Pages",
    version: "1.0",
    exportDate: new Date().toISOString(),
    books: AppState.books,
    shelves: AppState.shelves,
    journalEntries: AppState.journalEntries,
    quotes: AppState.quotes,
    goals: AppState.goals,
    theme: AppState.theme
  };

  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportPayload, null, 2));
  const downloadAnchor = document.createElement('a');
  const dateTag = new Date().toISOString().split('T')[0];
  downloadAnchor.setAttribute("href", dataStr);
  downloadAnchor.setAttribute("download", `between-pages-backup-${dateTag}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();

  showToast('Library backup exported successfully!', 'success');
}

function handleImportFile(e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(event) {
    try {
      const data = JSON.parse(event.target.result);

      if (!data || !Array.isArray(data.books)) {
        showToast('Invalid backup file. Missing books collection.', 'error');
        return;
      }

      openConfirmModal(
        'Restore Backup?',
        `Found ${data.books.length} books in this backup. Choose Confirm to restore your library. (Existing books with the same ID will be updated).`,
        () => {
          // Merge books
          data.books.forEach(importedBook => {
            const existingIndex = AppState.books.findIndex(b => b.id === importedBook.id);
            if (existingIndex >= 0) {
              AppState.books[existingIndex] = importedBook;
            } else {
              AppState.books.push(importedBook);
            }
          });

          // Merge shelves if provided
          if (Array.isArray(data.shelves)) {
            data.shelves.forEach(importedShelf => {
              const idx = AppState.shelves.findIndex(s => s.id === importedShelf.id);
              if (idx >= 0) {
                AppState.shelves[idx] = importedShelf;
              } else {
                AppState.shelves.push(importedShelf);
              }
            });
          }

          // Merge quotes if provided
          if (Array.isArray(data.quotes)) {
            data.quotes.forEach(q => {
              if (!AppState.quotes.some(existing => existing.id === q.id)) {
                AppState.quotes.push(q);
              }
            });
          }

          // Merge journal if provided
          if (Array.isArray(data.journalEntries)) {
            data.journalEntries.forEach(j => {
              if (!AppState.journalEntries.some(existing => existing.id === j.id)) {
                AppState.journalEntries.push(j);
              }
            });
          }

          if (data.goals) {
            AppState.goals = { ...AppState.goals, ...data.goals };
          }

          persistAllData();
          renderAllViews();
          showToast(`Successfully restored ${data.books.length} books from backup!`, 'success');
        }
      );
    } catch (err) {
      console.error('Import parse error:', err);
      showToast('Could not read JSON file. Please ensure it is a valid backup.', 'error');
    }
  };
  reader.readAsText(file);
}

function handleClearAllData() {
  openConfirmModal(
    'Permanently Clear All Data?',
    'This will erase all books, reading progress, shelves, journal entries, and custom goals from this browser. This cannot be undone.',
    () => {
      localStorage.removeItem(STORAGE_KEYS.BOOKS);
      localStorage.removeItem(STORAGE_KEYS.SHELVES);
      localStorage.removeItem(STORAGE_KEYS.JOURNAL);
      localStorage.removeItem(STORAGE_KEYS.QUOTES);
      localStorage.removeItem(STORAGE_KEYS.GOALS);

      AppState.books = [];
      AppState.shelves = JSON.parse(JSON.stringify(DEFAULT_SHELVES));
      AppState.journalEntries = [];
      AppState.quotes = [];
      AppState.goals = {
        annualTarget: 24,
        monthlyTarget: 2,
        dailyMinutesTarget: 30,
        dailyMinutesLogged: 0,
        lastActiveDate: '',
        streakDays: 0
      };

      persistAllData();
      renderAllViews();
      showToast('All library data has been wiped.', 'info');
    }
  );
}

/* ============================================================================
   18. GENERAL MODAL & TOAST SYSTEM
   ============================================================================ */

function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

function openConfirmModal(title, message, onConfirmCallback) {
  document.getElementById('confirmModalTitle').textContent = title;
  document.getElementById('confirmModalMessage').textContent = message;

  const confirmBtn = document.getElementById('confirmActionBtn');
  confirmBtn.onclick = () => {
    closeModal('confirmModalOverlay');
    if (typeof onConfirmCallback === 'function') {
      onConfirmCallback();
    }
  };

  openModal('confirmModalOverlay');
}

/**
 * Displays an elegant non-intrusive floating toast notification.
 */
function showToast(message, type = 'info') {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(8px)';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

function renderAllViews() {
  updateNavCounters();
  renderOverview();
  renderLibrary();
  renderReadingNow();
  renderWishlist();
  renderShelves();
  renderJournal();
  renderGoals();
  renderStatistics();
  updateStorageUsageIndicator();
  checkDemoBannerState();
}

/* ============================================================================
   19. EVENT LISTENERS INITIALIZATION
   ============================================================================ */

function setupEventListeners() {
  // Navigation Sidebar Click Listeners
  document.querySelectorAll('.sidebar-nav .nav-item').forEach(btn => {
    btn.addEventListener('click', () => {
      switchView(btn.dataset.view);
    });
  });

  // Overview Target Cards
  document.querySelectorAll('[data-view-target]').forEach(el => {
    el.addEventListener('click', () => {
      const targetView = el.dataset.viewTarget;
      if (el.dataset.filter) {
        AppState.libraryFilter.status = el.dataset.filter;
        document.querySelectorAll('#statusFilterPills .filter-pill').forEach(pill => {
          pill.classList.toggle('active', pill.dataset.status === el.dataset.filter);
        });
      }
      switchView(targetView);
    });
  });

  // Mobile menu toggle & backdrop
  const mobileToggle = document.getElementById('mobileMenuToggle');
  if (mobileToggle) mobileToggle.addEventListener('click', openMobileMenu);

  const sidebarCloseBtn = document.getElementById('sidebarCloseBtn');
  if (sidebarCloseBtn) sidebarCloseBtn.addEventListener('click', closeMobileMenu);

  const backdrop = document.getElementById('sidebarBackdrop');
  if (backdrop) backdrop.addEventListener('click', closeMobileMenu);

  // Theme Toggles
  const deskThemeToggle = document.getElementById('desktopThemeToggle');
  if (deskThemeToggle) deskThemeToggle.addEventListener('click', toggleTheme);

  const mobThemeToggle = document.getElementById('mobileThemeToggle');
  if (mobThemeToggle) mobThemeToggle.addEventListener('click', toggleTheme);

  document.querySelectorAll('[data-set-theme]').forEach(btn => {
    btn.addEventListener('click', () => applyTheme(btn.dataset.setTheme));
  });

  // Global Top Search Input
  const searchInput = document.getElementById('globalSearchInput');
  const clearSearchBtn = document.getElementById('clearSearchBtn');

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const val = e.target.value;
      AppState.libraryFilter.search = val;
      if (clearSearchBtn) clearSearchBtn.style.display = val.length > 0 ? 'block' : 'none';

      if (AppState.activeView !== 'library') {
        switchView('library');
      } else {
        renderLibrary();
      }
    });

    // Keyboard shortcut '/' to search
    window.addEventListener('keydown', (e) => {
      if (e.key === '/' && document.activeElement !== searchInput && !isInputFocused()) {
        e.preventDefault();
        searchInput.focus();
      }
    });
  }

  if (clearSearchBtn) {
    clearSearchBtn.addEventListener('click', () => {
      searchInput.value = '';
      AppState.libraryFilter.search = '';
      clearSearchBtn.style.display = 'none';
      renderLibrary();
    });
  }

  // Add Book Buttons
  const openAddBtn = document.getElementById('openAddBookBtn');
  if (openAddBtn) openAddBtn.addEventListener('click', openAddBookModal);

  const libAddBtn = document.getElementById('libraryAddBookBtn');
  if (libAddBtn) libAddBtn.addEventListener('click', openAddBookModal);

  const emptyAddBtn = document.getElementById('emptyStateAddBookBtn');
  if (emptyAddBtn) emptyAddBtn.addEventListener('click', openAddBookModal);

  const wishAddBtn = document.getElementById('wishlistAddBookBtn');
  if (wishAddBtn) wishAddBtn.addEventListener('click', () => {
    openAddBookModal();
    document.getElementById('bookStatus').value = 'Want to Read';
  });

  const emptyWishAddBtn = document.getElementById('emptyStateWishlistAddBtn');
  if (emptyWishAddBtn) emptyWishAddBtn.addEventListener('click', () => {
    openAddBookModal();
    document.getElementById('bookStatus').value = 'Want to Read';
  });

  // Library Status Filter Pills
  document.querySelectorAll('#statusFilterPills .filter-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      document.querySelectorAll('#statusFilterPills .filter-pill').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      AppState.libraryFilter.status = pill.dataset.status;
      renderLibrary();
    });
  });

  // Library Dropdown Filters
  const genreFilter = document.getElementById('libraryGenreFilter');
  if (genreFilter) {
    genreFilter.addEventListener('change', (e) => {
      AppState.libraryFilter.genre = e.target.value;
      renderLibrary();
    });
  }

  const moodFilter = document.getElementById('libraryMoodFilter');
  if (moodFilter) {
    moodFilter.addEventListener('change', (e) => {
      AppState.libraryFilter.mood = e.target.value;
      renderLibrary();
    });
  }

  const shelfFilter = document.getElementById('libraryShelfFilter');
  if (shelfFilter) {
    shelfFilter.addEventListener('change', (e) => {
      AppState.libraryFilter.shelf = e.target.value;
      renderLibrary();
    });
  }

  const sortSelect = document.getElementById('librarySortSelect');
  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      AppState.libraryFilter.sort = e.target.value;
      renderLibrary();
    });
  }

  // View Layout Buttons (Grid vs List)
  const gridBtn = document.getElementById('layoutGridBtn');
  const listBtn = document.getElementById('layoutListBtn');
  if (gridBtn && listBtn) {
    gridBtn.addEventListener('click', () => {
      gridBtn.classList.add('active');
      listBtn.classList.remove('active');
      AppState.libraryFilter.viewMode = 'grid';
      renderLibrary();
    });
    listBtn.addEventListener('click', () => {
      listBtn.classList.add('active');
      gridBtn.classList.remove('active');
      AppState.libraryFilter.viewMode = 'list';
      renderLibrary();
    });
  }

  // Reset Filters Button
  const resetFiltersBtn = document.getElementById('resetAllFiltersBtn');
  if (resetFiltersBtn) resetFiltersBtn.addEventListener('click', resetAllLibraryFilters);

  // Book Form Listeners
  const bookForm = document.getElementById('bookForm');
  if (bookForm) bookForm.addEventListener('submit', handleSaveBook);

  const cancelBookBtn = document.getElementById('cancelBookBtn');
  if (cancelBookBtn) cancelBookBtn.addEventListener('click', () => closeModal('bookModalOverlay'));

  const closeBookModalBtn = document.getElementById('closeBookModalBtn');
  if (closeBookModalBtn) closeBookModalBtn.addEventListener('click', () => closeModal('bookModalOverlay'));

  // Genre Change in Form (Show custom genre if "Other")
  const formGenreSelect = document.getElementById('bookGenre');
  if (formGenreSelect) {
    formGenreSelect.addEventListener('change', (e) => {
      const customGroup = document.getElementById('customGenreGroup');
      customGroup.style.display = e.target.value === 'Other' ? 'block' : 'none';
    });
  }

  // Image Upload & URL input in form
  const coverUrlInput = document.getElementById('bookCoverUrl');
  if (coverUrlInput) {
    coverUrlInput.addEventListener('input', (e) => updateFormCoverPreview(e.target.value));
  }

  const fileInput = document.getElementById('bookCoverFileInput');
  if (fileInput) {
    fileInput.addEventListener('change', handleImageFileUpload);
  }

  // Star Rating Click & Hover
  const starBtns = document.querySelectorAll('#formStarRating .star-btn');
  starBtns.forEach(star => {
    star.addEventListener('click', () => {
      const val = parseInt(star.dataset.value, 10);
      updateStarRatingWidget(val);
    });
    star.addEventListener('mouseenter', () => {
      const val = parseInt(star.dataset.value, 10);
      starBtns.forEach(s => s.classList.toggle('hover', parseInt(s.dataset.value, 10) <= val));
    });
  });

  const starContainer = document.getElementById('formStarRating');
  if (starContainer) {
    starContainer.addEventListener('mouseleave', () => {
      starBtns.forEach(s => s.classList.remove('hover'));
    });
  }

  const clearRatingBtn = document.getElementById('clearRatingBtn');
  if (clearRatingBtn) {
    clearRatingBtn.addEventListener('click', () => updateStarRatingWidget(0));
  }

  // Mood chips toggle in form
  document.querySelectorAll('#formMoodsSelector .mood-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      chip.classList.toggle('selected');
    });
  });

  // Book Details Modal Close
  const closeDetailBtn = document.getElementById('closeDetailModalBtn');
  if (closeDetailBtn) closeDetailBtn.addEventListener('click', () => closeModal('bookDetailsModalOverlay'));

  // Progress Modal Listeners
  const progressForm = document.getElementById('progressForm');
  if (progressForm) progressForm.addEventListener('submit', handleSaveProgress);

  const closeProgressBtn = document.getElementById('closeProgressModalBtn');
  if (closeProgressBtn) closeProgressBtn.addEventListener('click', () => closeModal('progressModalOverlay'));

  const cancelProgressBtn = document.getElementById('cancelProgressBtn');
  if (cancelProgressBtn) cancelProgressBtn.addEventListener('click', () => closeModal('progressModalOverlay'));

  const progCurrentInput = document.getElementById('progCurrentPageInput');
  const progTotalInput = document.getElementById('progTotalPagesInput');

  if (progCurrentInput && progTotalInput) {
    const updateProg = () => {
      const cur = parseInt(progCurrentInput.value, 10) || 0;
      const tot = parseInt(progTotalInput.value, 10) || 1;
      updateProgressModalDisplay(cur, tot);
    };
    progCurrentInput.addEventListener('input', updateProg);
    progTotalInput.addEventListener('input', updateProg);
  }

  // Quick Page Add in Progress Modal
  document.querySelectorAll('.quick-add-page-buttons .btn-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const addVal = parseInt(chip.dataset.addPages, 10);
      const curInput = document.getElementById('progCurrentPageInput');
      const totInput = document.getElementById('progTotalPagesInput');
      const maxPages = parseInt(totInput.value, 10) || 9999;
      curInput.value = Math.min(maxPages, (parseInt(curInput.value, 10) || 0) + addVal);
      updateProgressModalDisplay(parseInt(curInput.value, 10), maxPages);
    });
  });

  // Wishlist Surprise Me
  const surpriseBtn = document.getElementById('surpriseMeBtn');
  if (surpriseBtn) surpriseBtn.addEventListener('click', triggerSurpriseMe);

  const closeSurpriseBtn = document.getElementById('closeSurpriseModalBtn');
  if (closeSurpriseBtn) closeSurpriseBtn.addEventListener('click', () => closeModal('surpriseModalOverlay'));

  const pickAnotherBtn = document.getElementById('surpriseAnotherBtn');
  if (pickAnotherBtn) pickAnotherBtn.addEventListener('click', triggerSurpriseMe);

  // Shelves Buttons
  const createShelfBtn = document.getElementById('createShelfBtn');
  if (createShelfBtn) createShelfBtn.addEventListener('click', openCreateShelfModal);

  const shelfForm = document.getElementById('shelfForm');
  if (shelfForm) shelfForm.addEventListener('submit', handleSaveShelf);

  const closeShelfModalBtn = document.getElementById('closeShelfModalBtn');
  if (closeShelfModalBtn) closeShelfModalBtn.addEventListener('click', () => closeModal('shelfModalOverlay'));

  const cancelShelfBtn = document.getElementById('cancelShelfBtn');
  if (cancelShelfBtn) cancelShelfBtn.addEventListener('click', () => closeModal('shelfModalOverlay'));

  // Swatches in Shelf Form
  document.querySelectorAll('#shelfColorSwatches .color-swatch').forEach(sw => {
    sw.addEventListener('click', () => {
      document.querySelectorAll('#shelfColorSwatches .color-swatch').forEach(s => s.classList.remove('active'));
      sw.classList.add('active');
      document.getElementById('shelfColorInput').value = sw.dataset.color;
    });
  });

  // Shelf Details & Book Management Modals Close
  const closeShelfDetailBtn = document.getElementById('closeShelfDetailModalBtn');
  if (closeShelfDetailBtn) closeShelfDetailBtn.addEventListener('click', () => closeModal('shelfDetailModalOverlay'));

  const closeManageShelfBtn = document.getElementById('closeManageShelfBooksBtn');
  if (closeManageShelfBtn) closeManageShelfBtn.addEventListener('click', () => closeModal('manageShelfBooksOverlay'));

  const cancelManageShelfBtn = document.getElementById('cancelManageShelfBooksBtn');
  if (cancelManageShelfBtn) cancelManageShelfBtn.addEventListener('click', () => closeModal('manageShelfBooksOverlay'));

  // Journal Tabs & Forms
  document.querySelectorAll('.journal-tab-btn').forEach(tabBtn => {
    tabBtn.addEventListener('click', () => {
      document.querySelectorAll('.journal-tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.journal-tab-content').forEach(c => c.classList.remove('active'));

      tabBtn.classList.add('active');
      const targetTab = tabBtn.dataset.journalTab;
      if (targetTab === 'reviews') {
        document.getElementById('journalTabReviews').classList.add('active');
        document.getElementById('journalActionBtnText').textContent = 'Write Reflection';
      } else {
        document.getElementById('journalTabQuotes').classList.add('active');
        document.getElementById('journalActionBtnText').textContent = 'Save a Quote';
      }
    });
  });

  const newJournalEntryBtn = document.getElementById('newJournalEntryBtn');
  if (newJournalEntryBtn) {
    newJournalEntryBtn.addEventListener('click', () => {
      const activeTab = document.querySelector('.journal-tab-btn.active').dataset.journalTab;
      if (activeTab === 'reviews') {
        openNewJournalModal();
      } else {
        openNewQuoteModal();
      }
    });
  }

  const emptyReviewsAddBtn = document.getElementById('emptyReviewsAddBtn');
  if (emptyReviewsAddBtn) emptyReviewsAddBtn.addEventListener('click', openNewJournalModal);

  const emptyQuotesAddBtn = document.getElementById('emptyQuotesAddBtn');
  if (emptyQuotesAddBtn) emptyQuotesAddBtn.addEventListener('click', openNewQuoteModal);

  const journalForm = document.getElementById('journalForm');
  if (journalForm) journalForm.addEventListener('submit', handleSaveJournal);

  const closeJournalModalBtn = document.getElementById('closeJournalModalBtn');
  if (closeJournalModalBtn) closeJournalModalBtn.addEventListener('click', () => closeModal('journalModalOverlay'));

  const cancelJournalBtn = document.getElementById('cancelJournalBtn');
  if (cancelJournalBtn) cancelJournalBtn.addEventListener('click', () => closeModal('journalModalOverlay'));

  const quoteForm = document.getElementById('quoteForm');
  if (quoteForm) quoteForm.addEventListener('submit', handleSaveQuote);

  const closeQuoteModalBtn = document.getElementById('closeQuoteModalBtn');
  if (closeQuoteModalBtn) closeQuoteModalBtn.addEventListener('click', () => closeModal('quoteModalOverlay'));

  const cancelQuoteBtn = document.getElementById('cancelQuoteBtn');
  if (cancelQuoteBtn) cancelQuoteBtn.addEventListener('click', () => closeModal('quoteModalOverlay'));

  // Reading Goals Edit & Daily Quick Add
  const editGoalsBtn = document.getElementById('editGoalsBtn');
  if (editGoalsBtn) editGoalsBtn.addEventListener('click', openEditGoalsModal);

  const goalsForm = document.getElementById('goalsForm');
  if (goalsForm) goalsForm.addEventListener('submit', handleSaveGoals);

  const closeGoalsModalBtn = document.getElementById('closeGoalsModalBtn');
  if (closeGoalsModalBtn) closeGoalsModalBtn.addEventListener('click', () => closeModal('goalsModalOverlay'));

  const cancelGoalsBtn = document.getElementById('cancelGoalsBtn');
  if (cancelGoalsBtn) cancelGoalsBtn.addEventListener('click', () => closeModal('goalsModalOverlay'));

  document.querySelectorAll('[data-log-minutes]').forEach(btn => {
    btn.addEventListener('click', () => {
      const mins = parseInt(btn.dataset.logMinutes, 10);
      logDailyReadingHabit(mins);
    });
  });

  // Inspiration Quote Refresh
  const refreshQuoteBtn = document.getElementById('refreshQuoteBtn');
  if (refreshQuoteBtn) refreshQuoteBtn.addEventListener('click', refreshInspirationQuote);

  // Demo Banner Buttons
  const loadDemoBtn = document.getElementById('loadDemoBtn');
  if (loadDemoBtn) loadDemoBtn.addEventListener('click', loadDemoLibrary);

  const dismissDemoBannerBtn = document.getElementById('dismissDemoBannerBtn');
  if (dismissDemoBannerBtn) dismissDemoBannerBtn.addEventListener('click', hideDemoBanner);

  // Settings Buttons
  const settingsLoadDemoBtn = document.getElementById('settingsLoadDemoBtn');
  if (settingsLoadDemoBtn) settingsLoadDemoBtn.addEventListener('click', loadDemoLibrary);

  const settingsClearDemoBtn = document.getElementById('settingsClearDemoBtn');
  if (settingsClearDemoBtn) settingsClearDemoBtn.addEventListener('click', clearDemoLibrary);

  const exportBtn = document.getElementById('exportLibraryBtn');
  if (exportBtn) exportBtn.addEventListener('click', exportLibraryJSON);

  const exportBtnTop = document.getElementById('exportLibraryBtnTop');
  if (exportBtnTop) exportBtnTop.addEventListener('click', exportLibraryJSON);

  const triggerImportBtn = document.getElementById('triggerImportBtn');
  const importFileInput = document.getElementById('importFileInput');
  if (triggerImportBtn && importFileInput) {
    triggerImportBtn.addEventListener('click', () => importFileInput.click());
    importFileInput.addEventListener('change', handleImportFile);
  }

  const clearAllDataBtn = document.getElementById('clearAllDataBtn');
  if (clearAllDataBtn) clearAllDataBtn.addEventListener('click', handleClearAllData);

  // Confirmation Modal Close
  const closeConfirmBtn = document.getElementById('closeConfirmModalBtn');
  if (closeConfirmBtn) closeConfirmBtn.addEventListener('click', () => closeModal('confirmModalOverlay'));

  const cancelConfirmBtn = document.getElementById('confirmCancelBtn');
  if (cancelConfirmBtn) cancelConfirmBtn.addEventListener('click', () => closeModal('confirmModalOverlay'));

  // Close modals when clicking on background overlay
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        closeModal(overlay.id);
      }
    });
  });

  // Escape key closes active modal
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const activeModal = document.querySelector('.modal-overlay.active');
      if (activeModal) {
        closeModal(activeModal.id);
      }
    }
  });

  // Ambient session timer init
  initAmbientTimer();
}

function isInputFocused() {
  const tag = document.activeElement ? document.activeElement.tagName.toLowerCase() : '';
  return tag === 'input' || tag === 'textarea' || tag === 'select';
}

function escapeHTML(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/* ============================================================================
   20. DOM CONTENT LOADED ENTRY POINT
   ============================================================================ */

document.addEventListener('DOMContentLoaded', () => {
  // Load saved data or defaults
  loadDataFromStorage();

  // Apply saved theme
  applyTheme(AppState.theme);

  // Setup all event listeners
  setupEventListeners();

  // Render initial dashboard view
  renderAllViews();
});
