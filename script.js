// ========================================
// GLACIER WATER LAB — JAVASCRIPT
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    initSmoothScrolling();
    initMobileNav();
    initEcoQuest();
    initEcoQuestModal();
    initScrollAnimations();
});

// ========================================
// SMOOTH SCROLLING
// ========================================
function initSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Close mobile nav if open
                const navList = document.querySelector('.nav__list');
                navList.classList.remove('active');
            }
        });
    });
}

// ========================================
// MOBILE NAVIGATION
// ========================================
function initMobileNav() {
    const toggle = document.querySelector('.nav__toggle');
    const navList = document.querySelector('.nav__list');
    
    if (toggle) {
        toggle.addEventListener('click', () => {
            navList.classList.toggle('active');
        });
    }
    
    // Close nav when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.nav') && !e.target.closest('.nav__toggle')) {
            navList.classList.remove('active');
        }
    });
}

// ========================================
// ECO QUEST MODAL
// ========================================
function initEcoQuestModal() {
    const openBtn = document.getElementById('open-ecoquest');
    const openBtnMobile = document.getElementById('open-ecoquest-mobile');
    const closeBtn = document.getElementById('close-ecoquest');
    const modal = document.getElementById('ecoquest-modal');
    const overlay = document.getElementById('ecoquest-overlay');
    
    if (!modal) return;
    
    function openModal() {
        modal.classList.add('active');
        document.body.classList.add('modal-open');
    }
    
    // Open modal
    if (openBtn) openBtn.addEventListener('click', openModal);
    if (openBtnMobile) openBtnMobile.addEventListener('click', openModal);
    
    // Close modal
    closeBtn.addEventListener('click', closeModal);
    overlay.addEventListener('click', closeModal);
    
    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
    
    function closeModal() {
        modal.classList.remove('active');
        document.body.classList.remove('modal-open');
    }
}

// ========================================
// ECO QUEST MINI-GAME - EXPANDED
// ========================================
function initEcoQuest() {
    const calculateBtn = document.getElementById('calculate-btn');
    const resultValue = document.getElementById('result-value');
    const resultLiters = document.getElementById('result-liters');
    const resultBadge = document.getElementById('result-badge');
    const progressFill = document.getElementById('progress-fill');
    const progressText = document.getElementById('progress-text');
    const meterWater = document.getElementById('meter-water');
    
    if (!calculateBtn) return;
    
    const maxMl = 3000; // Max for progress bar
    const totalActions = document.querySelectorAll('input[name="action"]').length;
    
    // Real-time update on checkbox change
    const checkboxes = document.querySelectorAll('input[name="action"]');
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            updateResults(false);
        });
    });
    
    calculateBtn.addEventListener('click', () => {
        updateResults(true);
        // Scroll to results
        const resultEl = document.getElementById('ecoquest-result');
        if (resultEl) {
            resultEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    });
    
    function updateResults(animate) {
        const checkedBoxes = document.querySelectorAll('input[name="action"]:checked');
        let totalMl = 0;
        
        checkedBoxes.forEach(checkbox => {
            totalMl += parseInt(checkbox.value, 10);
        });
        
        // Animate the result value
        if (animate) {
            animateValue(resultValue, parseInt(resultValue.textContent) || 0, totalMl, 800);
        } else {
            resultValue.textContent = totalMl;
        }
        
        // Update progress bar
        const progressPercent = Math.min((totalMl / maxMl) * 100, 100);
        progressFill.style.width = progressPercent + '%';
        progressText.textContent = `${totalMl} / ${maxMl} ml`;
        
        // Update meter
        if (meterWater) {
            const meterPercent = Math.min((totalMl / maxMl) * 100, 100);
            meterWater.style.height = meterPercent + '%';
        }
        
        // Show liters if >= 1000ml
        if (totalMl >= 1000) {
            const liters = (totalMl / 1000).toFixed(1);
            resultLiters.textContent = `That's ${liters} liter${parseFloat(liters) !== 1 ? 's' : ''} of water!`;
        } else {
            resultLiters.textContent = '';
        }
        
        // Determine badge
        const badge = getBadge(totalMl);
        updateBadge(resultBadge, badge);
        
        // Update achievements
        updateAchievements(totalMl, checkedBoxes.length, totalActions);
    }
}

function animateValue(element, start, end, duration) {
    const startTime = performance.now();
    
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const current = Math.floor(start + (end - start) * easeOutQuart);
        
        element.textContent = current;
        
        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }
    
    requestAnimationFrame(update);
}

function getBadge(ml) {
    if (ml >= 2500) {
        return { icon: '👑', text: 'Water Guardian Supreme!' };
    } else if (ml >= 2000) {
        return { icon: '🌍', text: 'Eco Warrior' };
    } else if (ml >= 1000) {
        return { icon: '🌊', text: 'Liter Hero' };
    } else if (ml >= 500) {
        return { icon: '💧', text: 'Water Saver' };
    } else if (ml > 0) {
        return { icon: '🌱', text: 'Water Learner' };
    } else {
        return { icon: '💧', text: 'Start checking actions!' };
    }
}

function updateBadge(badgeElement, badge) {
    badgeElement.style.animation = 'none';
    badgeElement.offsetHeight;
    badgeElement.style.animation = 'fadeIn 0.5s ease';
    
    const iconEl = badgeElement.querySelector('.badge__icon');
    const textEl = badgeElement.querySelector('.badge__text');
    
    iconEl.textContent = badge.icon;
    textEl.textContent = badge.text;
}

function updateAchievements(totalMl, checkedCount, totalActions) {
    const achievements = {
        'ach-first': totalMl > 0,
        'ach-500': totalMl >= 500,
        'ach-1000': totalMl >= 1000,
        'ach-2000': totalMl >= 2000,
        'ach-all': checkedCount === totalActions,
        'ach-max': totalMl >= 3000
    };
    
    Object.entries(achievements).forEach(([id, unlocked]) => {
        const el = document.getElementById(id);
        if (el) {
            const wasUnlocked = el.dataset.unlocked === 'true';
            el.dataset.unlocked = unlocked;
            
            // Add celebration animation if just unlocked
            if (unlocked && !wasUnlocked) {
                el.style.animation = 'none';
                el.offsetHeight;
                el.style.animation = 'achievementUnlock 0.6s ease';
            }
        }
    });
}

// Add achievement unlock animation
const achievementStyle = document.createElement('style');
achievementStyle.textContent = `
    @keyframes achievementUnlock {
        0% { transform: scale(1); }
        50% { transform: scale(1.2); }
        100% { transform: scale(1); }
    }
`;
document.head.appendChild(achievementStyle);

// ========================================
// SCROLL ANIMATIONS
// ========================================
function initScrollAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe cards and sections
    const animateElements = document.querySelectorAll('.card, .glass, .quality__card, .target');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
    
    // Add CSS class for animated elements
    const style = document.createElement('style');
    style.textContent = `
        .animate-in {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);
}

// ========================================
// ACTIVE NAV LINK HIGHLIGHTING
// ========================================
function initActiveNavHighlight() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav__link');
    
    window.addEventListener('scroll', () => {
        const scrollY = window.pageYOffset;
        const headerHeight = document.querySelector('.header').offsetHeight;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - headerHeight - 100;
            const sectionBottom = sectionTop + section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollY >= sectionTop && scrollY < sectionBottom) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    });
}

// Initialize active nav highlighting
initActiveNavHighlight();

