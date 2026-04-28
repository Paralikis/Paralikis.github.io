/* ════════════════════════════════════════
   PORTFOLIO — main.js
   Αυτό το αρχείο φορτώνει ΜΕΤΑ το HTML
   (το <script> είναι στο τέλος του <body>)

   Περιεχόμενα:
   1. Fade-in animation με IntersectionObserver
   2. Active nav link ανάλογα με το scroll
════════════════════════════════════════ */


/* ── 0. TYPEWRITER EFFECT ──
   Πληκτρολογεί το όνομα γράμμα-γράμμα μόλις φορτώσει η σελίδα.
   Μετά από μικρή παύση, σβήνει τον cursor.
────────────────────────────────────────── */
const typewriterEl = document.getElementById('typewriter');
const nameText     = 'Γεια σας, είμαι ο Γεώργιος Παραλίκης';  /* ← αλλαξέ το με το όνομά σου */
const typeSpeed    = 100;              /* ms μεταξύ κάθε γράμματος */
const startDelay   = 600;             /* ms αναμονή πριν ξεκινήσει */
const cursorDelay  = 1500;            /* ms αναμονή πριν εξαφανιστεί ο cursor */

function typeWriter(text, el, speed, onDone) {
  let i = 0;

  function typeNext() {
    if (i < text.length) {
      el.textContent += text.charAt(i);  /* προσθέτει ένα γράμμα */
      i++;
      setTimeout(typeNext, speed);
    } else {
      /* Τέλος — καλεί το callback αν υπάρχει */
      if (onDone) onDone();
    }
  }

  /* Ξεκινά μετά από startDelay */
  setTimeout(typeNext, startDelay);
}

/* Εκκίνηση — μετά το τέλος, αφαιρεί τον cursor */
typeWriter(nameText, typewriterEl, typeSpeed, () => {
  setTimeout(() => {
    typewriterEl.classList.add('done');
  }, cursorDelay);
});



/* ── 1. FADE-IN ANIMATION ──
   Παρακολουθεί κάθε στοιχείο με class "fade-in".
   Μόλις μπει στο viewport, προσθέτει την class "visible"
   που ενεργοποιεί το CSS transition (opacity + translateY).
────────────────────────────────────────── */
const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, index) => {
    if (entry.isIntersecting) {
      /* Μικρή καθυστέρηση για stagger effect
         (τα στοιχεία εμφανίζονται ένα-ένα) */
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, index * 80);

      /* Σταματάμε να παρακολουθούμε αφού εμφανιστεί */
      fadeObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.12  /* εμφανίζεται όταν το 12% του element είναι ορατό */
});

/* Εφαρμόζουμε τον observer σε όλα τα .fade-in elements */
document.querySelectorAll('.fade-in').forEach(el => {
  fadeObserver.observe(el);
});


/* ── 2. CV MODAL ──
   Ανοίγει όταν πατάς "Κατέβασε CV".
   Κλείνει με: × κουμπί, κλικ έξω από το box, ή Escape.
────────────────────────────────────────── */
const cvBtn    = document.getElementById('cv-btn');
const modal    = document.getElementById('cv-modal');
const modalBox = modal.querySelector('.modal-box');
const closeBtn = document.getElementById('modal-close');

/* Άνοιγμα */
function openModal() {
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  closeBtn.focus();  /* focus στο × για accessibility */
}

/* Κλείσιμο */
function closeModal() {
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  cvBtn.focus();  /* επιστρέφουμε focus στο κουμπί */
}

/* Πάτημα του κουμπιού CV */
cvBtn.addEventListener('click', openModal);

/* Πάτημα του × */
closeBtn.addEventListener('click', closeModal);

/* Κλικ έξω από το modal box (στο overlay) */
modal.addEventListener('click', (e) => {
  /* Αν το click ΔΕΝ είναι μέσα στο box, κλείνουμε */
  if (!modalBox.contains(e.target)) {
    closeModal();
  }
});

/* Κλείσιμο με Escape */
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && modal.classList.contains('open')) {
    closeModal();
  }
});


/* ── 3. ACTIVE NAV LINK ──
   Καθώς κάνεις scroll, το αντίστοιχο nav link
   γίνεται λευκό (active) ανάλογα με το section που βλέπεις.
────────────────────────────────────────── */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

const navObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      /* Αφαιρούμε active από όλα */
      navLinks.forEach(link => link.classList.remove('active'));

      /* Προσθέτουμε active στο link που αντιστοιχεί στο section */
      const activeLink = document.querySelector(
        `.nav-links a[href="#${entry.target.id}"]`
      );
      if (activeLink) activeLink.classList.add('active');
    }
  });
}, {
  rootMargin: '-40% 0px -55% 0px'  /* ενεργοποιείται όταν το section είναι στο κέντρο της οθόνης */
});

sections.forEach(section => navObserver.observe(section));

const photosModal    = document.getElementById('photos-modal');
const photosModalBox = photosModal.querySelector('.modal-box');
const photosCloseBtn = document.getElementById('photos-modal-close');

document.getElementById('photos-open-btn').addEventListener('click', () => {
  photosModal.classList.add('open');
  photosModal.setAttribute('aria-hidden', 'false');
  photosCloseBtn.focus();
});

photosCloseBtn.addEventListener('click', () => {
  photosModal.classList.remove('open');
  photosModal.setAttribute('aria-hidden', 'true');
});

photosModal.addEventListener('click', (e) => {
  if (!photosModalBox.contains(e.target)) {
    photosModal.classList.remove('open');
    photosModal.setAttribute('aria-hidden', 'true');
  }
});
/* ── SCROLL ZOOM + DRAG TO PAN ── */
let activeImg = null;
let startX, startY;

document.querySelectorAll('.photo-img').forEach(img => {
  img._scale      = 1;
  img._translateX = 0;
  img._translateY = 0;

  const MIN  = 1;
  const MAX  = 3;
  const STEP = 0.1;

  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  /* Υπολογίζει τα μέγιστα όρια κίνησης ανάλογα με το zoom */
  function maxTranslate() {
    const w = img.offsetWidth;
    const h = img.offsetHeight;
    return {
      x: (w * (img._scale - 1)) / 2,
      y: (h * (img._scale - 1)) / 2
    };
  }

  function applyTransform() {
    /* Κλειδώνει τη θέση εντός ορίων πριν εφαρμοστεί */
    const limits = maxTranslate();
    img._translateX = clamp(img._translateX, -limits.x, limits.x);
    img._translateY = clamp(img._translateY, -limits.y, limits.y);
    img.style.transform =
      `scale(${img._scale}) translate(${img._translateX}px, ${img._translateY}px)`;
  }

  /* ── Zoom με ρολό ── */
  img.addEventListener('wheel', (e) => {
    e.preventDefault();
    if (e.deltaY < 0) {
      img._scale = Math.min(img._scale + STEP, MAX);
    } else {
      img._scale = Math.max(img._scale - STEP, MIN);
      if (img._scale === MIN) {
        img._translateX = 0;
        img._translateY = 0;
      }
    }
    applyTransform();
  }, { passive: false });

  /* ── Drag: αρχή ── */
  img.addEventListener('mousedown', (e) => {
    if (img._scale === 1) return;
    e.preventDefault();
    activeImg = img;
    startX = e.clientX - img._translateX;
    startY = e.clientY - img._translateY;
    img.style.cursor = 'grabbing';
  });
});

/* ── Drag: κίνηση ── */
document.addEventListener('mousemove', (e) => {
  if (!activeImg) return;
  activeImg._translateX = e.clientX - startX;
  activeImg._translateY = e.clientY - startY;

  /* Εφαρμόζει clamp ώστε να μην φεύγει εκτός ορίων */
  const w = activeImg.offsetWidth;
  const h = activeImg.offsetHeight;
  const maxX = (w * (activeImg._scale - 1)) / 2;
  const maxY = (h * (activeImg._scale - 1)) / 2;

  activeImg._translateX = Math.min(Math.max(activeImg._translateX, -maxX), maxX);
  activeImg._translateY = Math.min(Math.max(activeImg._translateY, -maxY), maxY);

  activeImg.style.transform =
    `scale(${activeImg._scale}) translate(${activeImg._translateX}px, ${activeImg._translateY}px)`;
});

/* ── Drag: τέλος ── */
document.addEventListener('mouseup', () => {
  if (!activeImg) return;
  activeImg.style.cursor = 'zoom-in';
  activeImg = null;
});