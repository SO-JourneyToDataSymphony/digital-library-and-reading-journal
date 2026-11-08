# Between Pages 📖✨

> *“A little world for the stories you love.”*

A romantic, vintage-inspired personal digital library and reading journal crafted with pure HTML5, CSS3, and vanilla JavaScript.

---

## 🌸 Aesthetic & Visual Identity

- **Palette**: Warm Cream (`#FAF6F1`), Soft Beige (`#F0E7E0`), Dusty Rose (`#C98F98`), Muted Plum (`#805B6B`), Soft Pink (`#EAD4D5`), and Warm Charcoal (`#393331`).
- **Typography**:
  - *Playfair Display* for headings and literary titles.
  - *DM Sans* for interface controls, labels, and forms.
  - *Cormorant Garamond* for quotes, reflections, and decorative accents.
- **Dark Reading Mode**: Deep plum, warm charcoal, and muted burgundy theme for comfortable evening reading.

---

## 📚 Key Features

1. **Overview Dashboard**:
   - Dynamic greetings and summary cards (*Total Books, Currently Reading, Completed, Wishlist*).
   - "Currently on Your Nightstand" with real-time reading progress bars.
   - "Your Reading Journey" tracking books finished this year, total pages, and active reading streaks.
   - Curated public-domain literary inspiration quotes.

2. **My Library**:
   - Dual view modes: Responsive Card Grid and Compact List View.
   - Procedural book cover generator with gold-embossed foil styling for titles without cover images.
   - Comprehensive multi-filter engine: search by title/author, filter by reading status, genre, shelf, or emotional reading mood.
   - Multi-criteria sorting (*Recently Added, Title A–Z, Highest Rated, etc.*).

3. **Reading Now**:
   - Focus view for active books with quick `+5`, `+10`, `+25` page logging.
   - **Ambient Reading Companion**: Built-in 15m, 25m, 45m, and 60m focus timer with synthesized audio chime via the Web Audio API.

4. **My Wishlist & "Surprise Me"**:
   - Organise upcoming reads and dream books.
   - "Surprise Me" random selector to help you pick your next story.

5. **My Shelves**:
   - Default collections (*The Classics, Love & Longing, Philosophy Corner, Mystery & Mayhem, Comfort Reads, After Dark*).
   - Create, edit, and customise custom shelves with vintage color swatches.
   - Books can belong to multiple shelves simultaneously.

6. **Reading Journal**:
   - **Reviews & Reflections**: Deep dives into favourite characters, philosophical thoughts, and personal reviews.
   - **Favourite Quotes**: Elegant literary quote cards in Cormorant Garamond.

7. **Reading Goals & Analytics**:
   - Annual book challenge, monthly pace targets, and daily minutes habit tracking.
   - Milestone badges (*First Voyage, Passionate Reader, Literary Devotee, Thousand Pages, etc.*).
   - CSS-based monthly reading activity bar chart and format breakdowns with zero external dependencies.

8. **Local Storage & Privacy**:
   - 100% client-side: all data stays private in your browser's Local Storage.
   - Device image compression: uploaded covers are resized and compressed via HTML5 Canvas.
   - Complete JSON backup export and import functionality.

9. **Sample Demo Library**:
   - Optional 5 curated classics (*The Brothers Karamazov, The Picture of Dorian Gray, Pride and Prejudice, The Stranger, Wuthering Heights*).
   - Safely remove demo data at any time without affecting your personal books.

---

## 🛠️ Tech Stack & File Structure

Built without external frameworks, preprocessors, or backend dependencies:

```
between-pages/
│
├── index.html     # Semantic structure and application layout
├── style.css      # Typography, animations, responsive design, dark mode
├── script.js      # App logic, Local Storage engine, audio timer, charts
└── README.md      # Documentation and overview
```

---

## 📱 Mobile Responsiveness & iPhone Optimization

The application has been extensively tested and optimized for mobile devices, specifically engineered for iPhone screens (with iPhone 390px as the primary mobile reference) as well as tablets and desktops:

- **Safe Area Insets**: Native support for iPhone notch, Dynamic Island, and bottom gesture home bar using `viewport-fit=cover` and CSS `env(safe-area-inset-*)`.
- **Zero Horizontal Overflow**: Guaranteed fit across all screens with strict boundary guards and fluid flex/grid layouts.
- **Collapsible Navigation Drawer**: Smooth slide-out mobile navigation drawer with backdrop blur, dedicated close button, and generous touch targets (≥44px) preventing icon/text collisions.
- **Adaptive Summary Cards**: Dynamic 2-column layout on standard phones (176px width per card on 390px iPhone) and 1-column layout on extra narrow screens (≤360px).
- **Proportional Book Cards**: Responsive book cards with gracefully wrapped action buttons ("View Details", Edit, Delete) preventing layout breaks.
- **Mobile-Optimized Modals & Forms**: Full-height dynamic viewport scaling (`100dvh`), vertically stacked input fields on mobile, sticky action footers, and `16px` form inputs to prevent iOS Safari auto-zooming.
- **Verified Breakpoints**:
  - 320px (iPhone SE 1st Gen)
  - 375px (iPhone SE 2nd/3rd Gen, iPhone X/XS/11 Pro/12 mini/13 mini)
  - 390px (iPhone 12/13/14/15/16 Pro — primary reference)
  - 430px (iPhone Pro Max / Plus)
  - 768px (iPad Portrait)
  - 1024px (iPad Landscape / Desktop)
  - Landscape orientation (844x390)

---

## 🚀 Getting Started

Simply open `index.html` in any modern web browser (Chrome, Firefox, Safari, Edge) or access the live GitHub Pages deployment. No build steps or server setup required!

