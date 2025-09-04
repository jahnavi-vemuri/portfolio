document.addEventListener("DOMContentLoaded", () => {
    const navLinks = document.querySelectorAll('.nav-items li a');
    const sections = document.querySelectorAll('section');

    // Function to handle active link on click
    function activateLink() {
      navLinks.forEach(link => link.classList.remove('active'));
      this.classList.add('active');
    }

    // Function to handle active link on scroll
    function activateOnScroll() {
      const scrollPosition = window.scrollY;

      sections.forEach(section => {
        const sectionTop = section.offsetTop - 50;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');

        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
          navLinks.forEach(link => link.classList.remove('active'));
          const activeLink = document.querySelector(`.nav-items li a[href="#${sectionId}"]`);
          if (activeLink) {
            activeLink.classList.add('active');
          }
        }
      });
    }

    navLinks.forEach(link => link.addEventListener('click', activateLink));
    window.addEventListener('scroll', activateOnScroll);

    // Scroll down button
    const scrollDownBtn = document.querySelector('.scroll-down');
    if (scrollDownBtn) {
        scrollDownBtn.addEventListener('click', (e) => {
            e.preventDefault();
            document.querySelector(scrollDownBtn.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    }

    // Scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animateElements = document.querySelectorAll('.timeline-item, .project-card, .education-item, .contact-card');
    animateElements.forEach(el => {
        el.classList.add('animate-on-scroll');
        observer.observe(el);
    });

    // Projects Carousel
    initProjectsCarousel();

  // Contact form snackbar handler
  const contactForm = document.querySelector('.contact-form');
  const snackbar = document.getElementById('snackbar');
  function showSnackbar(message, type = 'success') {
    if (!snackbar) return;
    snackbar.textContent = message;
    snackbar.className = `snackbar show ${type}`;
    setTimeout(() => {
      snackbar.className = 'snackbar';
    }, 3000);
  }

  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      // Use AJAX to avoid redirect; comment this out if you want default submit
      e.preventDefault();
      const formData = new FormData(contactForm);
      try {
        const res = await fetch(contactForm.action, { method: 'POST', body: formData, mode: 'no-cors' });
        // With no-cors, we cannot inspect res.ok, so we optimistically show success
        showSnackbar('Message sent! I will get back to you soon.', 'success');
        contactForm.reset();
      } catch (err) {
        showSnackbar('Failed to send. Please try again later.', 'error');
      }
    });
  }

});


// Projects Carousel Functionality
function initProjectsCarousel() {
    const track = document.getElementById('projectsTrack');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const projectCards = document.querySelectorAll('.project-card');

    if (!track || !prevBtn || !nextBtn || projectCards.length === 0) return;

    const totalCards = projectCards.length;
    let currentIndex = Math.floor(totalCards / 2); // center card featured
    let autoInterval = null;

    function updateCarousel() {
        // Remove featured class from all cards
        projectCards.forEach(card => card.classList.remove('featured'));

        // Add featured class to current card
        if (projectCards[currentIndex]) {
            projectCards[currentIndex].classList.add('featured');
        }

        // Calculate transform dynamically
        const card = projectCards[0];
        const styles = window.getComputedStyle(card);
        const width = card.offsetWidth;
        const gap = parseInt(styles.marginRight || 30) || 30; // fallback gap
        const cardWidth = width + gap;
        const containerWidth = track.parentElement.offsetWidth;
        const offset = -currentIndex * cardWidth + (containerWidth / 2) - (cardWidth / 2);
        track.style.transform = `translateX(${offset}px)`;
    }

    function startAutoRotate() {
        if (autoInterval) return;
        autoInterval = setInterval(() => {
            currentIndex = currentIndex < totalCards - 1 ? currentIndex + 1 : 0;
            updateCarousel();
        }, 5000);
    }

    function stopAutoRotate() {
        if (autoInterval) {
            clearInterval(autoInterval);
            autoInterval = null;
        }
    }

    // expose controls to other scripts (modal open/close)
    window.pauseCarousel = stopAutoRotate;
    window.resumeCarousel = () => { updateCarousel(); startAutoRotate(); };

    // Recenter on resize
    window.addEventListener('resize', updateCarousel);

    prevBtn.addEventListener('click', () => {
        stopAutoRotate();
        currentIndex = currentIndex > 0 ? currentIndex - 1 : totalCards - 1;
        updateCarousel();
        startAutoRotate();
    });

    nextBtn.addEventListener('click', () => {
        stopAutoRotate();
        currentIndex = currentIndex < totalCards - 1 ? currentIndex + 1 : 0;
        updateCarousel();
        startAutoRotate();
    });

    // Pause on hover/focus within carousel area
    const container = track.parentElement;
    container.addEventListener('mouseenter', stopAutoRotate);
    container.addEventListener('mouseleave', startAutoRotate);
    container.addEventListener('focusin', stopAutoRotate);
    container.addEventListener('focusout', startAutoRotate);

    // Initialize carousel
    updateCarousel();
    startAutoRotate();
}

// Modal functionality for projects
const projectCards = document.querySelectorAll('.project-card');
const modalCloseBtns = document.querySelectorAll('.modal-close');

// Function to open the modal
projectCards.forEach(card => {
    card.addEventListener('click', function() {
        const projectType = this.getAttribute('data-project');
        const modal = document.getElementById(`modal-${projectType}`);
        if (modal) {
            if (window.pauseCarousel) window.pauseCarousel();
            modal.style.display = 'flex';
            document.body.classList.add('modal-open');
        }
    });
});

// Function to close the modal
modalCloseBtns.forEach(btn => {
    btn.addEventListener('click', function() {
        const modalId = this.getAttribute('data-target');
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'none';
            document.body.classList.remove('modal-open');
            if (window.resumeCarousel) window.resumeCarousel();
        }
    });
});

// Close modal when clicking outside of it
window.addEventListener('click', function(event) {
    if (event.target.classList.contains('modal-container')) {
        event.target.style.display = 'none';
        document.body.classList.remove('modal-open');
        if (window.resumeCarousel) window.resumeCarousel();
    }
});

// Mobile menu toggle
const navMenuBtn = document.querySelector('.nav-menu-btn');
const navigation = document.querySelector('.navigation');

if (navMenuBtn && navigation) {
    navMenuBtn.addEventListener('click', () => {
        navigation.classList.toggle('active');
        navMenuBtn.classList.toggle('active');
    });
}

// Smooth scrolling for all internal links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Header background on scroll
window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    if (window.scrollY > 100) {
        header.classList.add('sticky');
    } else {
        header.classList.remove('sticky');
    }
});