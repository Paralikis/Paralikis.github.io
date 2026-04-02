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
