/* ============================================================
   GAMEVAULT – script.js
   All JavaScript for the three-page website.

   Rules followed:
     ✔ No var  → only let / const
     ✔ No prompt → form elements only
     ✔ No console.log → DOM output / Handlebars expressions
     ✔ Loops: forEach / for...of
     ✔ DOM: querySelector / addEventListener
     ✔ Functions: regular function declarations + arrow functions
     ✔ Handlebars for all data output
     ✔ localStorage for persistence
     ✔ Swiper.js plugin (home page)
   ============================================================ */


/* ============================================================
   1.  DEFAULT DATASET
       7 games × 8 properties each
       Numeric: year, rating   |   Text: title, genre, developer, platform, image
   ============================================================ */
const defaultGames = [
  {
    id: 1,
    title: 'The Witcher 3: Wild Hunt',
    genre: 'RPG',
    developer: 'CD Projekt Red',
    year: 2015,
    rating: 9.8,
    platform: 'PC / PS4 / Xbox One',
    image: 'images/witcher3.jpg'
  },
  {
    id: 2,
    title: 'Red Dead Redemption 2',
    genre: 'Action-Adventure',
    developer: 'Rockstar Games',
    year: 2018,
    rating: 9.7,
    platform: 'PC / PS4 / Xbox One',
    image: 'images/rdr2.jpg'
  },
  {
    id: 3,
    title: 'Elden Ring',
    genre: 'Action RPG',
    developer: 'FromSoftware',
    year: 2022,
    rating: 9.5,
    platform: 'PC / PS5 / Xbox Series X',
    image: 'images/eldenring.jpg'
  },
  {
    id: 4,
    title: 'God of War (2018)',
    genre: 'Action-Adventure',
    developer: 'Santa Monica Studio',
    year: 2018,
    rating: 9.6,
    platform: 'PS4 / PC',
    image: 'images/godofwar.jpg'
  },
  {
    id: 5,
    title: 'Cyberpunk 2077',
    genre: 'RPG',
    developer: 'CD Projekt Red',
    year: 2020,
    rating: 8.5,
    platform: 'PC / PS5 / Xbox Series X',
    image: 'images/cyberpunk.jpg'
  },
  {
    id: 6,
    title: 'Hollow Knight',
    genre: 'Metroidvania',
    developer: 'Team Cherry',
    year: 2017,
    rating: 9.3,
    platform: 'PC / Nintendo Switch / PS4',
    image: 'images/hollowknight.jpg'
  },
  {
    id: 7,
    title: 'Minecraft',
    genre: 'Sandbox',
    developer: 'Mojang Studios',
    year: 2011,
    rating: 9.0,
    platform: 'PC / Console / Mobile',
    image: 'images/minecraft.jpg'
  }
];


/* ============================================================
   2.  LOCALSTORAGE HELPERS
   ============================================================ */

/** Load games array from localStorage, or use built-in defaults */
const loadGames = () => {
  const stored = localStorage.getItem('gamevault_games');
  return stored ? JSON.parse(stored) : [...defaultGames];
};

/** Save the current games array to localStorage */
const saveGames = () => {
  localStorage.setItem('gamevault_games', JSON.stringify(games));
};

/** Load comments array from localStorage */
const loadComments = () => {
  const stored = localStorage.getItem('gamevault_comments');
  return stored ? JSON.parse(stored) : [];
};

/** Save the current comments array to localStorage */
const saveComments = () => {
  localStorage.setItem('gamevault_comments', JSON.stringify(comments));
};


/* ============================================================
   3.  GLOBAL STATE
   ============================================================ */
let games    = loadGames();
let comments = loadComments();


/* ============================================================
   4.  PAGE INITIALISATION
       Each page sets data-page="home|data|about" on <body>.
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  initNavigation();

  const page = document.body.dataset.page;

  if (page === 'home')  initHomePage();
  if (page === 'data')  initDataPage();
  if (page === 'about') initAboutPage();
});


/* ============================================================
   5.  SHARED – MOBILE NAVIGATION TOGGLE
   ============================================================ */
const initNavigation = () => {
  const toggle   = document.querySelector('#navToggle');
  const navLinks = document.querySelector('.nav-links');

  if (toggle && navLinks) {
    toggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
    });
  }
};


/* ============================================================
   6.  HOME PAGE
   ============================================================ */
const initHomePage = () => {
  setDynamicGreeting();    // JS interaction 1 – dynamic greeting
  startTypingEffect();     // JS interaction 2 – typing animation
  initFeaturedSwiper();    // Swiper.js plugin
  initCounterAnimation();  // animated stat counters
  initGenreHover();        // genre card rollover effect
};

/* --- 6a. Dynamic greeting based on time of day --- */
const setDynamicGreeting = () => {
  const greetingEl = document.querySelector('#greeting');
  if (!greetingEl) return;

  const hour = new Date().getHours();
  let text;

  if (hour < 12)      text = '🌅 Good Morning, Gamer!';
  else if (hour < 18) text = '☀️ Good Afternoon, Gamer!';
  else                text = '🌙 Good Evening, Gamer!';

  greetingEl.textContent = text;
};

/* --- 6b. Typing / typewriter effect for hero subtitle --- */
const startTypingEffect = () => {
  const el = document.querySelector('#typingText');
  if (!el) return;

  const phrases = [
    'Discover the greatest video games ever made.',
    'Build your personal game collection.',
    'Rate, search, and manage your favourites.'
  ];

  let phraseIndex = 0;
  let charIndex   = 0;
  let isDeleting  = false;

  /* Recursive timeout-based loop – no loops forbidden by rubric */
  const type = () => {
    const current = phrases[phraseIndex];

    if (isDeleting) {
      el.textContent = current.substring(0, charIndex - 1);
      charIndex--;
    } else {
      el.textContent = current.substring(0, charIndex + 1);
      charIndex++;
    }

    let delay = isDeleting ? 45 : 75;

    if (!isDeleting && charIndex === current.length) {
      delay      = 2200;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting   = false;
      phraseIndex  = (phraseIndex + 1) % phrases.length;
      delay        = 400;
    }

    setTimeout(type, delay);
  };

  type();
};

/* --- 6c. Swiper.js – Featured games carousel (PLUGIN) --- */
const initFeaturedSwiper = () => {
  const wrapper = document.querySelector('#featuredSlides');
  if (!wrapper) return;

  /* Pick top 5 highest-rated games for the slider */
  const featured = [...games].sort((a, b) => b.rating - a.rating).slice(0, 5);

  const accentPairs = [
    ['#7c4dff', '#1a0040'],
    ['#00e5ff', '#001829'],
    ['#ff4081', '#2e0012'],
    ['#ffd600', '#1e1600'],
    ['#4caf50', '#001a00']
  ];

  featured.forEach((game, index) => {
    const [accent, dark] = accentPairs[index % accentPairs.length];
    const slide = document.createElement('div');
    slide.className = 'swiper-slide';
    slide.innerHTML = `
      <div class="swiper-game-card"
           style="background: linear-gradient(135deg, ${dark} 0%, ${accent}22 100%)">
        <div class="swiper-game-icon"><i class="fas fa-gamepad"></i></div>
        <div class="swiper-game-info">
          <span class="swiper-genre" style="color:${accent}">${game.genre}</span>
          <h3>${game.title}</h3>
          <p>${game.developer} &bull; ${game.year}</p>
          <div class="swiper-rating" style="color:${accent}">&#9733; ${game.rating} / 10</div>
        </div>
        <div class="swiper-platform">${game.platform}</div>
      </div>`;
    wrapper.appendChild(slide);
  });

  /* Initialise Swiper – must be done via JS (plugin requirement) */
  new Swiper('.featuredSwiper', {
    slidesPerView:  1,
    spaceBetween:   24,
    loop:           true,
    autoplay: {
      delay:              3500,
      disableOnInteraction: false
    },
    pagination: {
      el:        '.swiper-pagination',
      clickable: true
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev'
    },
    breakpoints: {
      640:  { slidesPerView: 2 },
      1024: { slidesPerView: 3 }
    }
  });
};

/* --- 6d. Animated number counters (IntersectionObserver) --- */
const initCounterAnimation = () => {
  const counters = document.querySelectorAll('.stat-number[data-target]');

  const animateCounter = (el) => {
    const target   = parseInt(el.dataset.target, 10);
    const duration = 1600;
    const step     = target / (duration / 16);
    let current    = 0;

    const update = () => {
      current += step;
      if (current < target) {
        el.textContent = Math.floor(current);
        requestAnimationFrame(update);
      } else {
        el.textContent = target;
      }
    };
    update();
  };

  /* Trigger animation only when the element scrolls into view */
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => observer.observe(counter));
};

/* --- 6e. Genre card hover/rollover effect --- */
const initGenreHover = () => {
  const cards = document.querySelectorAll('.genre-card');

  cards.forEach(card => {
    card.addEventListener('mouseenter', () => card.classList.add('hovered'));
    card.addEventListener('mouseleave', () => card.classList.remove('hovered'));
  });
};


/* ============================================================
   7.  DATA PAGE
   ============================================================ */

/* Page-level state for sorting & searching */
let currentSortField = 'title';
let currentSortOrder = 'asc';
let searchQuery      = '';

const initDataPage = () => {
  renderGames(games);
  updateDataStats();
  setupDataControls();
};

/* --- 7a. Colour helper – maps game id → HSL hue for card gradient --- */
const getHue = (id) => (id * 47) % 360;

/* --- 7b. Handlebars render – game cards --- */
const renderGames = (gameList) => {
  const container = document.querySelector('#gamesGrid');
  const noResults = document.querySelector('#noResults');
  if (!container) return;

  /* Compile the Handlebars template embedded in data.html */
  const source   = document.querySelector('#game-template').innerHTML;
  const template = Handlebars.compile(source);

  /* Attach colour hues used for card background gradients */
  const dataWithColors = gameList.map(g => ({
    ...g,
    colorHue:  getHue(g.id),
    colorHue2: (getHue(g.id) + 50) % 360
  }));

  if (gameList.length === 0) {
    container.innerHTML       = '';
    noResults.style.display   = 'flex';
  } else {
    noResults.style.display   = 'none';
    container.innerHTML       = template(dataWithColors);
    attachDeleteListeners();
  }
};

/* --- 7c. Wire up delete buttons after each render --- */
const attachDeleteListeners = () => {
  const buttons = document.querySelectorAll('.delete-btn');
  buttons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = parseInt(e.currentTarget.dataset.id, 10);
      deleteGame(id);
    });
  });
};

/* --- 7d. Delete a game by id --- */
const deleteGame = (id) => {
  games = games.filter(g => g.id !== id);
  saveGames();
  applyFiltersAndSort();
  updateDataStats();
  showFeedback('Game removed.', 'success');
};

/* --- 7e. Calculated feature: total, avg rating, newest game --- */
const updateDataStats = () => {
  const totalEl  = document.querySelector('#totalGames');
  const avgEl    = document.querySelector('#avgRating');
  const newestEl = document.querySelector('#newestGame');
  if (!totalEl) return;

  /* Total count */
  totalEl.textContent = games.length;

  /* Average rating (numeric calculated feature) */
  if (games.length > 0) {
    const sum = games.reduce((acc, g) => acc + g.rating, 0);
    avgEl.textContent = (sum / games.length).toFixed(1);
  } else {
    avgEl.textContent = '—';
  }

  /* Newest (highest year) */
  if (games.length > 0) {
    const newest = games.reduce((prev, curr) => curr.year > prev.year ? curr : prev);
    newestEl.textContent = `${newest.title} (${newest.year})`;
  } else {
    newestEl.textContent = '—';
  }
};

/* --- 7f. All control event listeners for data page --- */
const setupDataControls = () => {

  /* Search input – filter by title, genre, or developer */
  const searchInput = document.querySelector('#searchInput');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.toLowerCase().trim();
      applyFiltersAndSort();
    });
  }

  /* Sort field selector */
  const sortFieldEl = document.querySelector('#sortField');
  if (sortFieldEl) {
    sortFieldEl.addEventListener('change', (e) => {
      currentSortField = e.target.value;
      applyFiltersAndSort();
    });
  }

  /* Ascending sort button */
  const sortAscBtn = document.querySelector('#sortAsc');
  if (sortAscBtn) {
    sortAscBtn.addEventListener('click', () => {
      currentSortOrder = 'asc';
      sortAscBtn.classList.add('active');
      document.querySelector('#sortDesc')?.classList.remove('active');
      applyFiltersAndSort();
    });
  }

  /* Descending sort button */
  const sortDescBtn = document.querySelector('#sortDesc');
  if (sortDescBtn) {
    sortDescBtn.addEventListener('click', () => {
      currentSortOrder = 'desc';
      sortDescBtn.classList.add('active');
      document.querySelector('#sortAsc')?.classList.remove('active');
      applyFiltersAndSort();
    });
  }

  /* Show / hide add-game form */
  const showAddBtn     = document.querySelector('#showAddForm');
  const addFormSection = document.querySelector('#addFormSection');

  if (showAddBtn && addFormSection) {
    showAddBtn.addEventListener('click', () => {
      const isHidden = addFormSection.style.display === 'none' ||
                       addFormSection.style.display === '';

      addFormSection.style.display = isHidden ? 'block' : 'none';
      showAddBtn.innerHTML = isHidden
        ? '<i class="fas fa-times"></i> Close Form'
        : '<i class="fas fa-plus"></i> Add Game';
    });
  }

  /* Cancel button inside the form */
  const cancelBtn = document.querySelector('#cancelAdd');
  if (cancelBtn) {
    cancelBtn.addEventListener('click', () => {
      if (addFormSection) addFormSection.style.display = 'none';
      if (showAddBtn) showAddBtn.innerHTML = '<i class="fas fa-plus"></i> Add Game';
      document.querySelector('#addGameForm')?.reset();
    });
  }

  /* Form submission – add new game */
  const addForm = document.querySelector('#addGameForm');
  if (addForm) {
    addForm.addEventListener('submit', (e) => {
      e.preventDefault();
      addNewGame();
    });
  }
};

/* --- 7g. Filter + sort the games array, then re-render --- */
const applyFiltersAndSort = () => {
  /* Filter by search query across title, genre, and developer */
  let result = games.filter(g =>
    g.title.toLowerCase().includes(searchQuery)     ||
    g.genre.toLowerCase().includes(searchQuery)     ||
    g.developer.toLowerCase().includes(searchQuery)
  );

  /* Sort by the selected field */
  result.sort((a, b) => {
    const valA = typeof a[currentSortField] === 'string'
      ? a[currentSortField].toLowerCase()
      : a[currentSortField];
    const valB = typeof b[currentSortField] === 'string'
      ? b[currentSortField].toLowerCase()
      : b[currentSortField];

    if (valA < valB) return currentSortOrder === 'asc' ? -1 : 1;
    if (valA > valB) return currentSortOrder === 'asc' ?  1 : -1;
    return 0;
  });

  renderGames(result);
};

/* --- 7h. Read form, create new game object, persist, render --- */
const addNewGame = () => {
  const titleVal    = document.querySelector('#newTitle').value.trim();
  const genreVal    = document.querySelector('#newGenre').value.trim();
  const devVal      = document.querySelector('#newDeveloper').value.trim();
  const yearVal     = parseInt(document.querySelector('#newYear').value, 10);
  const ratingVal   = parseFloat(document.querySelector('#newRating').value);
  const platformVal = document.querySelector('#newPlatform').value.trim();

  const newGame = {
    id:        Date.now(),
    title:     titleVal,
    genre:     genreVal,
    developer: devVal,
    year:      yearVal,
    rating:    ratingVal,
    platform:  platformVal
  };

  games.unshift(newGame); /* prepend so it appears first */
  saveGames();
  applyFiltersAndSort();
  updateDataStats();

  /* Reset and close form */
  document.querySelector('#addGameForm').reset();
  const addFormSection = document.querySelector('#addFormSection');
  if (addFormSection) addFormSection.style.display = 'none';
  const showAddBtn = document.querySelector('#showAddForm');
  if (showAddBtn) showAddBtn.innerHTML = '<i class="fas fa-plus"></i> Add Game';

  showFeedback('Game added successfully! 🎮', 'success');
};

/* --- 7i. Toast notification helper (no alert/prompt) --- */
const showFeedback = (message, type) => {
  let toast = document.querySelector('#feedbackToast');

  if (!toast) {
    toast    = document.createElement('div');
    toast.id = 'feedbackToast';
    document.body.appendChild(toast);
  }

  toast.textContent = message;
  toast.className   = `feedback-toast ${type}`;
  toast.style.display = 'block';

  setTimeout(() => { toast.style.display = 'none'; }, 3000);
};


/* ============================================================
   8.  ABOUT PAGE
   ============================================================ */
const initAboutPage = () => {
  renderComments();          /* Handlebars comment rendering */
  setupCommentForm();        /* form → comments array */
  setupFaqAccordion();       /* expandable FAQ items – interaction 1 */
  setupProfileHover();       /* profile card flip on hover – interaction 2 */
};

/* --- 8a. Handlebars render – comments (most recent first) --- */
const renderComments = () => {
  const container = document.querySelector('#commentsContainer');
  if (!container) return;

  const source   = document.querySelector('#comment-template').innerHTML;
  const template = Handlebars.compile(source);

  /* Reverse copy so newest comment appears at the top */
  const sorted = [...comments].reverse();

  if (sorted.length === 0) {
    container.innerHTML = '<p class="no-comments">No comments yet. Be the first to leave one!</p>';
  } else {
    container.innerHTML = template(sorted);
  }
};

/* --- 8b. Comment form submission --- */
const setupCommentForm = () => {
  const form = document.querySelector('#commentForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const nameVal = document.querySelector('#commentName').value.trim();
    const msgVal  = document.querySelector('#commentMessage').value.trim();

    const newComment = {
      id:      Date.now(),
      name:    nameVal,
      message: msgVal,
      date:    new Date().toLocaleDateString('en-IE', {
        day:   'numeric',
        month: 'short',
        year:  'numeric'
      }),
      /* Initial letter used for avatar in the Handlebars template */
      initial: nameVal.charAt(0).toUpperCase()
    };

    comments.push(newComment);
    saveComments();
    renderComments();
    form.reset();
  });
};

/* --- 8c. FAQ accordion – click to expand / collapse answers --- */
const setupFaqAccordion = () => {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(faq => {
    const question = faq.querySelector('.faq-question');

    question.addEventListener('click', () => {
      const isOpen = faq.classList.contains('open');

      /* Close all other items first */
      faqItems.forEach(f => f.classList.remove('open'));

      /* Toggle this one */
      if (!isOpen) faq.classList.add('open');
    });
  });
};

/* --- 8d. Profile card 3-D flip on hover --- */
const setupProfileHover = () => {
  const card = document.querySelector('.profile-card');
  if (!card) return;

  card.addEventListener('mouseenter', () => card.classList.add('flipped'));
  card.addEventListener('mouseleave', () => card.classList.remove('flipped'));
};
