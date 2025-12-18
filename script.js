document.addEventListener('DOMContentLoaded', () => {
    // --- STAGE NAVIGATION ---
    const btnSave = document.getElementById('btn-save');
    const btnContinue1 = document.getElementById('btn-continue-1');
    const btnHistory = document.getElementById('btn-history');
    const btnFinish = document.getElementById('btn-finish');
    const btnGift = document.getElementById('btn-gift');

    btnSave.addEventListener('click', () => changeStage('stage-1', 'stage-2'));
    btnContinue1.addEventListener('click', () => changeStage('stage-2', 'stage-3'));
    btnHistory.addEventListener('click', () => changeStage('stage-3', 'stage-4'));
    btnFinish.addEventListener('click', () => changeStage('stage-4', 'stage-final'));

    btnGift.addEventListener('click', () => {
        window.location.href = 'https://pontolunar.visionxma.com';
    });

    function changeStage(currentId, nextId) {
        const currentStage = document.getElementById(currentId);
        const nextStage = document.getElementById(nextId);

        // Simple fade out/in effect
        currentStage.style.opacity = '0';

        setTimeout(() => {
            currentStage.classList.add('hidden');
            currentStage.classList.remove('active');

            nextStage.classList.remove('hidden');
            // Trigger reflow
            void nextStage.offsetWidth;

            nextStage.classList.add('active');
            nextStage.style.opacity = '1';

            // If entering timeline, trigger observer setup if not already
            if (nextId === 'stage-4') {
                setupIntersectionObserver();
            }
        }, 500); // Matches CSS transition speed
    }


    // --- TIMELINE SCROLL REVEAL ---
    function setupIntersectionObserver() {
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.2
        };

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        document.querySelectorAll('.reveal-on-scroll').forEach(el => {
            observer.observe(el);
        });
    }


    // --- CAROUSEL LOGIC ---
    // Initialize single carousel
    setupCarousel(document.getElementById('carousel-media'));

    function setupCarousel(carousel) {
        if (!carousel) return;

        const track = carousel.querySelector('.carousel-track');
        const slides = Array.from(track.children);
        const nextButton = carousel.querySelector('.next-btn');
        const prevButton = carousel.querySelector('.prev-btn');
        const dotsNav = carousel.querySelector('.carousel-nav');
        const dots = Array.from(dotsNav.children);

        // Arrange slides next to one another? 
        // Actually CSS flex handles the layout, we just shift the track.
        // But we need to know the width. CSS 100% takes care of it.

        const moveToSlide = (currentSlide, targetSlide, targetIndex) => {
            // Move track
            const amountToMove = targetIndex * 100;
            track.style.transform = `translateX(-${amountToMove}%)`;

            currentSlide.classList.remove('current-slide');
            targetSlide.classList.add('current-slide');
        };

        const updateDots = (currentDot, targetDot) => {
            currentDot.classList.remove('current-slide');
            targetDot.classList.add('current-slide');
        };

        // When I click left, move slides to the left
        prevButton.addEventListener('click', e => {
            const currentSlide = track.querySelector('.current-slide');
            const prevSlide = currentSlide.previousElementSibling;
            const currentDot = dotsNav.querySelector('.current-slide');
            const prevDot = currentDot.previousElementSibling;
            const prevIndex = slides.findIndex(slide => slide === prevSlide);

            if (prevSlide) {
                moveToSlide(currentSlide, prevSlide, prevIndex);
                updateDots(currentDot, prevDot);
            }
        });

        // When I click right, move slides to the right
        nextButton.addEventListener('click', e => {
            const currentSlide = track.querySelector('.current-slide');
            const nextSlide = currentSlide.nextElementSibling;
            const currentDot = dotsNav.querySelector('.current-slide');
            const nextDot = currentDot.nextElementSibling;
            const nextIndex = slides.findIndex(slide => slide === nextSlide);

            if (nextSlide) {
                moveToSlide(currentSlide, nextSlide, nextIndex);
                updateDots(currentDot, nextDot);
            }
        });

        // Loop checks if you want to support infinite scroll, 
        // user requirement didn't specify, standard prev/next is safer/simpler.

        // Dots navigation
        dotsNav.addEventListener('click', e => {
            const targetDot = e.target.closest('button');

            if (!targetDot) return;

            const currentSlide = track.querySelector('.current-slide');
            const currentDot = dotsNav.querySelector('.current-slide');
            const targetIndex = dots.findIndex(dot => dot === targetDot);
            const targetSlide = slides[targetIndex];

            moveToSlide(currentSlide, targetSlide, targetIndex);
            updateDots(currentDot, targetDot);
        });
    }
});
