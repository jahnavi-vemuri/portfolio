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
          document.querySelector(`.nav-items li a[href="#${sectionId}"]`).classList.add('active');
        }
      });
    }
  
    navLinks.forEach(link => link.addEventListener('click', activateLink));
    window.addEventListener('scroll', activateOnScroll);
    
    // Scroll down button
    const scrollDownBtn = document.querySelector('.scroll-down');
    scrollDownBtn.addEventListener('click', (e) => {
        e.preventDefault();
        document.querySelector(scrollDownBtn.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});


// Select all modal triggers and close buttons
const modalTriggers = document.querySelectorAll('.img-card-container');
const modalCloseBtns = document.querySelectorAll('.modal-close');

// Function to open the modal
modalTriggers.forEach(trigger => {
  trigger.addEventListener('click', function() {
    const modalId = this.id.replace('_open', '');
    document.getElementById(`modal-${modalId}`).style.display = 'flex';
    document.body.classList.add('modal-open');
  });
});

// Function to close the modal
modalCloseBtns.forEach(closeBtn => {
  closeBtn.addEventListener('click', function() {
    const modalId = this.getAttribute('data-target');
    document.getElementById(modalId).style.display = 'none';
    document.body.classList.remove('modal-open');
  });
});

// Close modal on clicking outside
window.addEventListener('click', function(event) {
  const openModals = document.querySelectorAll('.modal-container[style="display: flex;"]');
  openModals.forEach(modal => {
    if (event.target === modal) {
      modal.style.display = 'none';
      document.body.classList.remove('modal-open');
    }
  });
});