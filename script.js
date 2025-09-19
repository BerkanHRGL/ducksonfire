
// Simple Page Transition System
class PageTransition {
    constructor() {
        this.createOverlay();
        this.bindEvents();
    }

    createOverlay() {
        const overlay = document.createElement('div');
        overlay.className = 'page-transition';
        overlay.innerHTML = '<div class="transition-text">LOADING...</div>';
        document.body.appendChild(overlay);
        this.overlay = overlay;
    }

    bindEvents() {
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a[href]');
            if (link && this.shouldTransition(link)) {
                e.preventDefault();
                this.transitionToPage(link.href);
            }
        });
    }

    shouldTransition(link) {
        const href = link.getAttribute('href');
        return href && !href.startsWith('#') && !href.startsWith('http') &&
               !href.includes('.zip') && href.includes('.html');
    }

    async transitionToPage(url) {
        // Update text based on destination
        let text = 'HOME';
        if (url.includes('about')) {
            text = 'ABOUT US';
        } else if (url.includes('game')) {
            text = 'GAME';
        } else if (url.includes('services')) {
            text = 'SERVICES';
        }
        this.overlay.querySelector('.transition-text').textContent = text;

        // Hide current page content immediately
        document.body.classList.add('transitioning');

        // Show overlay slightly after
        await this.delay(50);
        this.overlay.classList.add('active');

        // Wait for fade-in animations
        await this.delay(750);

        // Start fade-out
        this.overlay.classList.add('fade-out');

        // Wait for fade-out to complete then navigate
        await this.delay(600);
        window.location.href = url;
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// ===== RETRO LOADING SCREEN (FIRST VISIT ONLY) =====
// Check immediately when script loads, before DOM is ready
if (sessionStorage.getItem('hasVisited')) {
    // Hide loading screen immediately with CSS if already visited
    const style = document.createElement('style');
    style.textContent = '.loading-screen { display: none !important; }';
    document.head.appendChild(style);
}

window.addEventListener('load', function() {
    const loadingScreen = document.getElementById('loadingScreen');

    // Only show loading screen on first visit to the website
    if (loadingScreen && !sessionStorage.getItem('hasVisited')) {
        // Mark as visited for this session
        sessionStorage.setItem('hasVisited', 'true');

        // Minimum loading time for effect (3.5 seconds to match animation)
        setTimeout(() => {
            loadingScreen.classList.add('fade-out');

            // Remove loading screen from DOM after fade
            setTimeout(() => {
                loadingScreen.remove();
            }, 800);
        }, 3500);
    } else if (loadingScreen) {
        // If already visited, remove loading screen immediately
        loadingScreen.remove();
    }
});

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {

    // Initialize page transitions
    new PageTransition();

    // ===== SUBTLE SLOGAN INTERACTIONS (HOME PAGE ONLY) =====
    if (!document.body.classList.contains('about-page') &&
        !document.body.classList.contains('game-page') &&
        !document.body.classList.contains('services-page')) {

        const weIgnite = document.querySelector('.we-ignite');
        const ideas = document.querySelector('.ideas');

        // Simple parallax effect on scroll
        if (weIgnite && ideas) {
            let scrollTicking = false;

            function updateSloganParallax() {
                const scrolled = window.pageYOffset;
                const rate = scrolled * -0.1;

                if (scrolled > 30) {
                    weIgnite.style.transform = `translateY(${rate}px)`;
                    ideas.style.transform = `translateY(${rate * 0.8}px)`;
                } else {
                    weIgnite.style.transform = '';
                    ideas.style.transform = '';
                }

                scrollTicking = false;
            }

            function requestScrollTick() {
                if (!scrollTicking) {
                    window.requestAnimationFrame(updateSloganParallax);
                    scrollTicking = true;
                }
            }

            window.addEventListener('scroll', requestScrollTick);
        }
    }




    // Smooth scroll for navigation links
    const navLinks = document.querySelectorAll('nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            if (this.getAttribute('href').startsWith('#')) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                if (targetSection) {
                    targetSection.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });

    const videos = document.querySelectorAll('.video-container');
    if (videos.length > 0 && !document.body.classList.contains('about-page')) {
        let ticking = false;

        function updateParallax() {
            const scrolled = window.pageYOffset;

            videos.forEach((video, index) => {
                const speed = index === 0 ? 0.5 : 0.3;
                const yPos = -(scrolled * speed);
                video.style.transform = `translateY(${yPos}px)`;
            });

            ticking = false;
        }

        function requestTick() {
            if (!ticking) {
                window.requestAnimationFrame(updateParallax);
                ticking = true;
            }
        }

        window.addEventListener('scroll', requestTick);
    }

    // Animate title on load (main page)
    const titleWords = document.querySelectorAll('.main-title span');
    if (titleWords.length > 0) {
        titleWords.forEach((word, index) => {
            word.style.opacity = '0';
            word.style.transform = 'translateY(30px)';
            word.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';

            setTimeout(() => {
                word.style.opacity = '1';
                word.style.transform = 'translateY(0)';
            }, 200 + (index * 200));
        });
    }

    // Animate about title on load (about page)
    const aboutTitleWords = document.querySelectorAll('.about-title span');
    if (aboutTitleWords.length > 0) {
        aboutTitleWords.forEach((word, index) => {
            word.style.opacity = '0';
            word.style.transform = 'translateY(30px)';
            word.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';

            setTimeout(() => {
                word.style.opacity = '1';
                word.style.transform = 'translateY(0)';
            }, 200 + (index * 300));
        });
    }

    // Animate lines on load
    const lines = [
        '.line-logo-to-nav',
        '.nav-frame-top',
        '.nav-frame-right',
        '.nav-frame-bottom',
        '.nav-frame-left',
        '.nav-to-content-connector',
        '.content-frame-top',
        '.content-frame-right',
        '.content-frame-bottom',
        '.content-frame-left'
    ];

    lines.forEach((lineSelector, index) => {
        const line = document.querySelector(lineSelector);
        if (line) {
            if (lineSelector.includes('horizontal')) {
                line.style.width = '0';
                line.style.transition = 'width 1s cubic-bezier(0.4, 0, 0.2, 1)';
                setTimeout(() => {
                    line.style.width = '';
                }, 500 + (index * 100));
            } else {
                line.style.height = '0';
                line.style.transition = 'height 1s cubic-bezier(0.4, 0, 0.2, 1)';
                setTimeout(() => {
                    line.style.height = '';
                }, 500 + (index * 100));
            }
        }
    });

    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe content elements (main page and about page)
    const contentElements = document.querySelectorAll('.video-container, .text-content, .animate-on-scroll');
    contentElements.forEach(el => {
        if (!el.style.opacity) {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
        }
        observer.observe(el);
    });

    // Add fade-in class styles dynamically
    const style = document.createElement('style');
    style.textContent = `
        .fade-in {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);

    // Button hover effect
    const ctaButtons = document.querySelectorAll('.cta-button');
    ctaButtons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.boxShadow = '0 8px 25px rgba(10, 139, 139, 0.3)';
        });

        button.addEventListener('mouseleave', function() {
            this.style.boxShadow = '0 4px 15px rgba(10, 139, 139, 0.2)';
        });
    });

    // Add subtle hover effect to nav links
    navLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
            this.style.transform = 'translateX(3px)';
            this.style.transition = 'transform 0.3s ease';
        });

        link.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });
    });

    // Handle video loading (when you add your videos)
    const videoElements = document.querySelectorAll('video');
    videoElements.forEach(video => {
        // Ensure videos play smoothly
        video.addEventListener('loadeddata', function() {
            this.play().catch(e => {
                console.log('Video autoplay was prevented:', e);
            });
        });
    });

    // Team member hover effects (about page only)
    const teamMembers = document.querySelectorAll('.team-member');
    teamMembers.forEach(member => {
        member.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
            this.style.boxShadow = '0 15px 40px rgba(58, 48, 41, 0.15)';
            this.style.borderColor = '#e85e3a';
        });

        member.addEventListener('mouseleave', function() {
            this.style.transform = '';
            this.style.boxShadow = '';
            this.style.borderColor = 'transparent';
        });
    });

    // Value items subtle animation on hover (about page only)
    const valueItems = document.querySelectorAll('.value-item');
    valueItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            const icon = this.querySelector('.value-icon');
            if (icon) {
                icon.style.transform = 'scale(1.1)';
                icon.style.transition = 'transform 0.3s ease';
            }
        });

        item.addEventListener('mouseleave', function() {
            const icon = this.querySelector('.value-icon');
            if (icon) {
                icon.style.transform = '';
            }
        });
    });

    // Enhanced scroll animations for about page sections
    if (document.body.classList.contains('about-page')) {
        // Staggered animation for team members
        const teamMemberElements = document.querySelectorAll('.team-member');
        teamMemberElements.forEach((member, index) => {
            member.style.transitionDelay = `${index * 0.1}s`;
        });

        // Staggered animation for value items
        const valueItemElements = document.querySelectorAll('.value-item');
        valueItemElements.forEach((item, index) => {
            item.style.transitionDelay = `${index * 0.15}s`;
        });
    }

    // Add loading animation for hero image on about page
    const heroImage = document.querySelector('.hero-image');
    if (heroImage) {
        // Add a subtle loading animation
        heroImage.style.background = 'linear-gradient(135deg, #d4c4b4 0%, #a89484 100%)';
        heroImage.style.position = 'relative';

        // Add a placeholder content
        const placeholder = document.createElement('div');
        placeholder.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: 48px;
            color: rgba(58, 48, 41, 0.3);
            font-weight: bold;
        `;
        placeholder.textContent = 'TEAM';
        heroImage.appendChild(placeholder);
    }

    // Advanced cinematic video animations (About page only)
    if (document.body.classList.contains('about-page')) {
        const cinematicVideos = document.querySelectorAll('.about-gif');

        // Magnetic mouse follow effect
        cinematicVideos.forEach(video => {
            video.addEventListener('mousemove', (e) => {
                const rect = video.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;

                const deltaX = (x - centerX) / centerX;
                const deltaY = (y - centerY) / centerY;

                const rotateX = deltaY * -10;
                const rotateY = deltaX * 10;

                video.style.transform = `
                    translateY(-10px)
                    scale(1.02)
                    perspective(1000px)
                    rotateX(${rotateX}deg)
                    rotateY(${rotateY}deg)
                `;
            });

            video.addEventListener('mouseleave', () => {
                video.style.transform = '';
            });
        });

        // Parallax scroll effect for videos
        let ticking = false;

        function updateVideoParallax() {
            const scrolled = window.pageYOffset;

            cinematicVideos.forEach((video, index) => {
                const rect = video.getBoundingClientRect();
                const speed = (index + 1) * 0.1;
                const yPos = scrolled * speed;

                if (rect.top < window.innerHeight && rect.bottom > 0) {
                    const videoElement = video.querySelector('.cinematic-video');
                    if (videoElement) {
                        videoElement.style.transform = `translateY(${yPos}px) scale(1.05)`;
                    }
                }
            });

            ticking = false;
        }

        function requestVideoTick() {
            if (!ticking) {
                window.requestAnimationFrame(updateVideoParallax);
                ticking = true;
            }
        }

        window.addEventListener('scroll', requestVideoTick);

        // Staggered entrance animation
        cinematicVideos.forEach((video, index) => {
            video.style.opacity = '0';
            video.style.transform = 'translateY(50px) scale(0.8)';
            video.style.transition = 'all 1s cubic-bezier(0.23, 1, 0.320, 1)';

            setTimeout(() => {
                video.style.opacity = '1';
                video.style.transform = 'translateY(0) scale(1)';
            }, 200 + (index * 300));
        });
    }
});