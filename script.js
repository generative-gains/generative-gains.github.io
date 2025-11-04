(function () {
  const docEl = document.documentElement;

  // --- Startup Terminal Animation ---
  const startupOverlay = document.getElementById('startup-overlay');
  const terminal = document.getElementById('terminal');
  const lines = [
    'Initiating boot sequence...',
    'Loading core modules... [OK]',
    'Compiling assets... [OK]',
    'Launching interface...'
  ];
  let lineIndex = 0;

  function typeLine() {
    if (lineIndex < lines.length) {
      terminal.textContent += `> ${lines[lineIndex]}\n`;
      lineIndex++;
      setTimeout(typeLine, Math.random() * 150 + 50);
    } else {
      // Animation finished
      setTimeout(() => {
        startupOverlay.classList.add('hidden');
        // Allow scrolling after animation
        docEl.style.overflow = '';
      }, 600);
    }
  }

  // --- Custom Cursor ---
  const cursorDot = document.getElementById('cursor-dot');
  const cursorOutline = document.getElementById('cursor-outline');
  
  if (cursorDot && cursorOutline) {
    window.addEventListener('mousemove', e => {
      const posX = e.clientX;
      const posY = e.clientY;

      cursorDot.style.left = `${posX}px`;
      cursorDot.style.top = `${posY}px`;

      cursorOutline.animate({
        left: `${posX}px`,
        top: `${posY}px`
      }, { duration: 500, fill: 'forwards' });
    });

    document.querySelectorAll('a, button, .theme-toggle').forEach(el => {
      el.addEventListener('mouseenter', () => document.body.classList.add('cursor-pointer'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-pointer'));
    });
    
    document.addEventListener('mouseleave', () => {
        cursorDot.style.opacity = '0';
        cursorOutline.style.opacity = '0';
    });
    document.addEventListener('mouseenter', () => {
        cursorDot.style.opacity = '1';
        cursorOutline.style.opacity = '1';
    });
  }

  // --- Interactive Card Effect ---
  document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--cursor-x-card', `${x}px`);
      card.style.setProperty('--cursor-y-card', `${y}px`);
    });
  });

  // --- Initial Page Setup ---
  // Prevent scrolling during startup animation
  docEl.style.overflow = 'hidden';
  // Start animations after a brief delay
  setTimeout(typeLine, 400);

  // Set current year in footer
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();


  // Mobile nav toggle
  const nav = document.querySelector("[data-js-nav]");
  const navToggle = document.querySelector("[data-js-nav-toggle]");

  if (nav && navToggle) {
    navToggle.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("is-open");
      navToggle.classList.toggle("is-active");
      navToggle.setAttribute("aria-expanded", isOpen);
    });

    // Close nav when a link is clicked
    nav.addEventListener("click", (e) => {
      if (e.target.tagName === "A") {
        nav.classList.remove("is-open");
        navToggle.classList.remove("is-active");
        navToggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const href = this.getAttribute("href");
      if (href === "#") return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth" });
      }
    });
  });

  // Fade-in elements on intersection
  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );
  document.querySelectorAll(".fade-in").forEach((el) => observer.observe(el));

  // Theme switcher
  const themeToggle = document.getElementById("theme-toggle");

  const setTheme = (theme) => {
    docEl.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
    const newThemeColor = theme === "light" ? "#fdfdfc" : "#0D1117";
    document
      .querySelector('meta[name="theme-color"]')
      .setAttribute("content", newThemeColor);
  };

  const savedTheme =
    localStorage.getItem("theme") ||
    (window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light");
  setTheme(savedTheme);

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const currentTheme = docEl.getAttribute("data-theme");
      setTheme(currentTheme === "dark" ? "light" : "dark");
    });
  }
})();

