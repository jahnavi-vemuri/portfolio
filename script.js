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
