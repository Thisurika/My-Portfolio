document.addEventListener('DOMContentLoaded', () => {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.3
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('expanded');
            } else {
                entry.target.classList.remove('expanded');
            }
        });
    }, observerOptions);

    const scrollElements = document.querySelectorAll('.about-section .scroll-reveal');
    scrollElements.forEach(el => observer.observe(el));

    const typingText = document.getElementById('typing-text');
    const words = ["DATA SCIENTIST", "ML ENGINEER", "AI ENTHUSIAST", "RESEARCHER", "ANALYST"];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const typeSpeed = 100;
    const deleteSpeed = 60;
    const wordPause = 1500;

    function type() {
        const currentWord = words[wordIndex];

        if (isDeleting) {
            typingText.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typingText.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
        }

        let speed = isDeleting ? deleteSpeed : typeSpeed;

        if (!isDeleting && charIndex === currentWord.length) {
            speed = wordPause;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            speed = 500;
        }

        setTimeout(type, speed);
    }

    if (typingText) {
        type();
    }

    const cursorDot = document.querySelector('[data-cursor-dot]');
    const cursorOutline = document.querySelector('[data-cursor-outline]');

    window.addEventListener('mousemove', function (e) {
        const posX = e.clientX;
        const posY = e.clientY;

        cursorDot.style.left = `${posX}px`;
        cursorDot.style.top = `${posY}px`;

        cursorOutline.animate({
            left: `${posX}px`,
            top: `${posY}px`
        }, { duration: 500, fill: "forwards" });
    });

    const interactables = document.querySelectorAll('a, button, .floating-icon');
    interactables.forEach(el => {
        el.addEventListener('mouseenter', () => cursorOutline.classList.add('hovered'));
        el.addEventListener('mouseleave', () => cursorOutline.classList.remove('hovered'));
    });

    const timelineSections = document.querySelectorAll('.timeline');

    timelineSections.forEach(timelineSection => {
        const timelineProgress = timelineSection.querySelector('.timeline-progress');
        const timelineDots = timelineSection.querySelectorAll('.timeline-dot');

        if (timelineProgress) {
            window.addEventListener('scroll', () => {
                const sectionRect = timelineSection.getBoundingClientRect();
                const sectionTop = sectionRect.top;
                const sectionHeight = sectionRect.height;
                const windowHeight = window.innerHeight;

                const startOffset = windowHeight / 2;
                let scrollDistance = startOffset - sectionTop;

                let progressPercentage = (scrollDistance / sectionHeight) * 100;
                progressPercentage = Math.max(0, Math.min(100, progressPercentage));

                timelineProgress.style.height = `${progressPercentage}%`;

                timelineDots.forEach(dot => {
                    const dotRect = dot.getBoundingClientRect();
                    const dotTop = dotRect.top;
                    const lineBottom = timelineProgress.getBoundingClientRect().bottom;

                    if (lineBottom > dotTop) {
                        dot.classList.add('active');
                    } else {
                        dot.classList.remove('active');
                    }
                });
            });
        }
    });

    const experienceCards = document.querySelectorAll('.experience-card');
    experienceCards.forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });

    const backToTopBtn = document.getElementById('backToTop');

    // Hamburger Menu Toggle
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('open');
        });
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navLinks.classList.remove('open');
            });
        });
    }

    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });

        window.addEventListener('scroll', () => {
            if ((window.innerHeight + window.scrollY) >= document.documentElement.scrollHeight - 50) {
                backToTopBtn.classList.add('bounce');
            } else {
                backToTopBtn.classList.remove('bounce');
            }
        });
    }

    const aboutCard = document.querySelector('.glass-card');
    if (aboutCard) {
        aboutCard.addEventListener('mousemove', (e) => {
            if (!aboutCard.classList.contains('expanded')) return;

            const rect = aboutCard.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -10;
            const rotateY = ((x - centerX) / centerX) * 10;

            const title = aboutCard.querySelector('h2');
            const para = aboutCard.querySelector('p');

            if (title) title.style.transform = `translateZ(40px)`;
            if (para) para.style.transform = `translateZ(20px)`;

            aboutCard.style.transition = 'transform 0.1s ease-out';
            aboutCard.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
        });

        aboutCard.addEventListener('mouseleave', () => {
            if (!aboutCard.classList.contains('expanded')) return;

            aboutCard.style.transition = 'transform 0.6s cubic-bezier(0.23, 1, 0.32, 1)';
            aboutCard.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';

            const title = aboutCard.querySelector('h2');
            const para = aboutCard.querySelector('p');
            if (title) title.style.transform = 'translateZ(0)';
            if (para) para.style.transform = 'translateZ(0)';

            setTimeout(() => {
                aboutCard.style.transition = '';
            }, 600);
        });
    }

    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const btn = contactForm.querySelector('button');
            const originalText = btn.innerHTML;

            btn.innerHTML = '<span>Sending...</span> <i class="fa-solid fa-spinner fa-spin"></i>';
            btn.style.opacity = '0.7';
            btn.style.pointerEvents = 'none';

            setTimeout(() => {
                btn.innerHTML = '<span>Message Delivered!</span> <i class="fa-solid fa-check"></i>';
                btn.style.background = 'linear-gradient(90deg, #22c55e, #16a34a, #22c55e)';
                btn.style.borderColor = '#4ade80';
                contactForm.reset();

                setTimeout(() => {
                    btn.innerHTML = originalText;
                    btn.style.background = '';
                    btn.style.borderColor = '';
                    btn.style.opacity = '1';
                    btn.style.pointerEvents = 'all';
                }, 3000);
            }, 1500);
        });
    }

    const resumeModal = document.getElementById('resumeModal');
    const openResumeBtn = document.getElementById('openResumeBtn');
    const closeResumeBtn = document.getElementById('closeResumeBtn');

    if (resumeModal && closeResumeBtn) {
        const openModal = (e) => {
            if (e) e.preventDefault();
            resumeModal.classList.add('show');
            document.body.style.overflow = 'hidden';
        };

        const closeModal = () => {
            resumeModal.classList.remove('show');
            document.body.style.overflow = 'auto';
        };

        if (openResumeBtn) openResumeBtn.addEventListener('click', openModal);
        closeResumeBtn.addEventListener('click', closeModal);

        resumeModal.addEventListener('click', (e) => {
            if (e.target === resumeModal) {
                closeModal();
            }
        });
    }

    // Floating Tech Logos Background
    const techIcons = [
        'fa-brands fa-python',
        'devicon-tensorflow-original',
        'devicon-pytorch-original',
        'devicon-scikitlearn-plain',
        'devicon-pandas-original',
        'devicon-numpy-original',
        'devicon-matplotlib-original',
        'devicon-jupyter-plain',
        'devicon-r-plain',
        'devicon-docker-plain',
        'devicon-git-plain',
        'devicon-amazonwebservices-plain',
        'devicon-googlecloud-plain',
        'devicon-postgresql-plain',
        'devicon-mongodb-plain',
        'fa-solid fa-brain',
        'fa-solid fa-chart-line',
        'fa-solid fa-robot',
        'fa-solid fa-database',
        'fa-solid fa-microchip',
        'devicon-opencv-original',
        'devicon-keras-original',
        'fa-solid fa-chart-bar',
        'devicon-linux-plain',
        'devicon-vscode-plain'
    ];

    const floatingContainer = document.getElementById('floatingTechLogos');
    if (floatingContainer) {
        const cols = 6;
        const rows = 5;
        techIcons.forEach((icon, i) => {
            if (i >= cols * rows) return;
            const el = document.createElement('div');
            el.className = 'floating-tech-logo';
            el.innerHTML = `<i class="${icon}"></i>`;
            const col = i % cols;
            const row = Math.floor(i / cols);
            const xBase = (100 / cols) * col + (100 / cols) * 0.5;
            const yBase = (100 / rows) * row + (100 / rows) * 0.5;
            const xOff = (Math.random() - 0.5) * 8;
            const yOff = (Math.random() - 0.5) * 8;
            el.style.left = `${xBase + xOff}%`;
            el.style.top = `${yBase + yOff}%`;
            el.style.animationDelay = `${Math.random() * 8}s`;
            el.style.animationDuration = `${18 + Math.random() * 12}s`;
            el.style.fontSize = `${1.2 + Math.random() * 0.8}rem`;
            floatingContainer.appendChild(el);
        });
    }
});
