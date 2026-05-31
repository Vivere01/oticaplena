/**
 * Ótica Plena - Javascript Interactivity
 * Custom animations, 3D tilt effects, and responsive navigation controls.
 */

document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // 1. Header Scroll Styling
    // ==========================================
    const header = document.getElementById('main-header');
    
    const handleScroll = () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };
    
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check on load


    // ==========================================
    // 2. Mobile Menu Toggle
    // ==========================================
    const menuToggleBtn = document.getElementById('menu-toggle-btn');
    const navigationBar = document.getElementById('navigation-bar');
    const navLinks = document.querySelectorAll('.nav-link');

    if (menuToggleBtn && navigationBar) {
        menuToggleBtn.addEventListener('click', () => {
            const isOpen = navigationBar.classList.toggle('open');
            menuToggleBtn.setAttribute('aria-expanded', isOpen);
            
            // Toggle hamburger animation state if class is added
            menuToggleBtn.classList.toggle('active');
        });

        // Close menu when a link is clicked
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navigationBar.classList.remove('open');
                menuToggleBtn.setAttribute('aria-expanded', 'false');
                menuToggleBtn.classList.remove('active');
            });
        });
    }


    // ==========================================
    // 3. Scroll Reveal Animations (Intersection Observer)
    // ==========================================
    const animateElements = document.querySelectorAll('.animate-on-scroll');

    const revealCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('appear');
                // Optional: unobserve if we only want animation once
                observer.unobserve(entry.target);
            }
        });
    };

    const revealObserver = new IntersectionObserver(revealCallback, {
        root: null, // viewport
        threshold: 0.15, // trigger when 15% visible
        rootMargin: '0px'
    });

    animateElements.forEach(el => revealObserver.observe(el));


    // ==========================================
    // 4. Sync Active Nav Links on Scroll
    // ==========================================
    const sections = document.querySelectorAll('section');
    
    const navObserverCallback = (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    } else {
                        link.classList.remove('active');
                    }
                });
            }
        });
    };

    const navObserver = new IntersectionObserver(navObserverCallback, {
        root: null,
        threshold: 0.6 // trigger when 60% of the section is visible
    });

    sections.forEach(sec => navObserver.observe(sec));


    // ==========================================
    // 5. Interactive 3D Tilt for Hero Glasses
    // ==========================================
    const glassesContainer = document.getElementById('glasses-3d-container');
    const glassesCard = document.getElementById('glasses-card');
    
    if (glassesContainer && glassesCard) {
        let isHovered = false;

        glassesContainer.addEventListener('mouseenter', () => {
            isHovered = true;
            // Stop automatic continuous rotation transition properties
            glassesCard.style.animation = 'none';
            glassesCard.style.transition = 'transform 0.15s ease-out';
        });

        glassesContainer.addEventListener('mousemove', (e) => {
            if (!isHovered) return;

            // Get boundaries of the container
            const rect = glassesContainer.getBoundingClientRect();
            
            // Mouse coordinates relative to container center (from -1 to 1)
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;

            // Define maximum tilt angles
            const maxRotateX = 25; // degrees
            const maxRotateY = 35; // degrees

            // Calculate rotation values based on mouse coordinates
            // Moving mouse to the right tilts glasses to rotate Y (horizontal)
            // Moving mouse down tilts glasses to rotate X (vertical)
            const rotateX = -y * maxRotateX;
            const rotateY = x * maxRotateY;

            // Apply 3D rotation transform
            glassesCard.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });

        glassesContainer.addEventListener('mouseleave', () => {
            isHovered = false;
            // Reset position smoothly
            glassesCard.style.transition = 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
            glassesCard.style.transform = 'rotateX(0deg) rotateY(0deg)';
            
            // Wait for transition to complete before re-applying floating/rotating animation
            setTimeout(() => {
                if (!isHovered) {
                    glassesCard.style.transition = 'none';
                    // Reapply the original CSS animation
                    glassesCard.style.animation = 'premiumFloat 25s ease-in-out infinite alternate, continuousRotateY 32s linear infinite';
                }
            }, 800);
        });
    }

});
