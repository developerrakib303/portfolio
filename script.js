document.addEventListener('DOMContentLoaded', () => {
    // Using your original, working API Key and URL structure
    const API_KEY = "AIzaSyCHVmI_Q9iZLR8mU4E8Gp2HYLDLFjymRrc";
    const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${API_KEY}`;

    // --- Robust Mobile Navigation ---
    const navToggle = document.getElementById('navToggle');
    const primaryNav = document.getElementById('primaryNav');

    if (navToggle && primaryNav) {
        const toggleMenu = (forceClose = false) => {
            const isOpen = primaryNav.classList.contains('open');
            const shouldBeOpen = forceClose ? false : !isOpen;

            primaryNav.classList.toggle('open', shouldBeOpen);
            navToggle.classList.toggle('open', shouldBeOpen);
            navToggle.setAttribute('aria-expanded', String(shouldBeOpen));
            document.body.classList.toggle('nav-open', shouldBeOpen);
        };

        navToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleMenu();
        });
        primaryNav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (primaryNav.classList.contains('open')) {
                    toggleMenu(true);
                }
            });
        });
        document.addEventListener('click', (e) => {
            const isOpen = primaryNav.classList.contains('open');
            const isClickInsideNav = primaryNav.contains(e.target);
            const isClickOnToggle = navToggle.contains(e.target);
            if (isOpen && !isClickInsideNav && !isClickOnToggle) {
                toggleMenu(true);
            }
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && primaryNav.classList.contains('open')) {
                toggleMenu(true);
            }
        });
    }

    // --- Active Navigation Link ---
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.primary-nav a').forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.setAttribute('aria-current', 'page');
        }
    });

    // --- Footer Year ---
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    // --- Reveal on Scroll ---
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

    // --- Swiper Carousels ---
    if (typeof Swiper !== 'undefined') {
        new Swiper('.services-carousel', { slidesPerView: 1, spaceBetween: 30, pagination: { el: '.swiper-pagination', clickable: true }, breakpoints: { 640: { slidesPerView: 2 }, 992: { slidesPerView: 3 } } });
        new Swiper('.portfolio-carousel', { slidesPerView: 1, spaceBetween: 30, pagination: { el: '.swiper-pagination', clickable: true }, breakpoints: { 640: { slidesPerView: 2 }, 992: { slidesPerView: 3 } } });
        new Swiper('.blog-carousel', { slidesPerView: 1, spaceBetween: 30, pagination: { el: '.swiper-pagination', clickable: true }, breakpoints: { 640: { slidesPerView: 2 }, 992: { slidesPerView: 3 } } });
        new Swiper('.testimonial-carousel', { slidesPerView: 1, spaceBetween: 30, pagination: { el: '.swiper-pagination', clickable: true }, breakpoints: { 768: { slidesPerView: 2 } } });
    }

    // --- Portfolio Filtering Logic ---
    const filterContainer = document.querySelector('.portfolio-filters');
    if (filterContainer) {
        const filterButtons = filterContainer.querySelectorAll('.filter-btn');
        const projectCards = document.querySelectorAll('#projectGrid .project-card');

        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                const filter = button.dataset.filter;
                projectCards.forEach(card => {
                    const tags = card.dataset.tags || '';
                    const shouldShow = filter === 'all' || tags.includes(filter);
                    card.style.display = shouldShow ? 'block' : 'none';
                });
            });
        });
    }
    
    // --- Portfolio & AI Modal Logic ---
    const initModal = (modalId, triggerSelector) => {
        const modal = document.getElementById(modalId);
        if (!modal) return;
        
        const modalContentEl = modal.querySelector('#ai-modal-content');
        const closeBtn = modal.querySelector('.modal-close');

        // --- START: Gallery Auto-scroll logic ---
// --- START: Gallery Auto-scroll logic (2 visible, bounce left↔right, full show) ---
let galleryAnimationId = null;

const startGalleryScroll = (galleryElement) => {
    stopGalleryScroll();

    const inner = galleryElement.querySelector('.gallery-inner');
    if (!inner) return;

    setTimeout(() => {
        const visibleWidth = galleryElement.clientWidth;
        const totalWidth = inner.scrollWidth;
        const scrollableWidth = totalWidth - visibleWidth;

        if (scrollableWidth <= 0) return;

        let posX = 0;
        let direction = 1;
        const speed = 1.2; // scroll speed (increase for faster motion)

        const animate = () => {
            posX += direction * speed;

            if (posX >= scrollableWidth) direction = -1;
            else if (posX <= 0) direction = 1;

            inner.style.transform = `translateX(${-posX}px)`;
            galleryAnimationId = requestAnimationFrame(animate);
        };

        requestAnimationFrame(animate);
    }, 500); // wait for DOM paint
};

const stopGalleryScroll = () => {
    if (galleryAnimationId) {
        cancelAnimationFrame(galleryAnimationId);
        galleryAnimationId = null;
    }
};
// --- END: Gallery Auto-scroll logic ---

        // --- END: Gallery Auto-scroll logic ---

        // --- START: Main Image Vertical Scroll Animation (FIXED) ---
// --- START: Main Image Vertical Scroll Animation (FIXED) ---
        let imageAnimationId = null;

        const startImageScroll = (wrapper, image) => {
            stopImageScroll(); // Ensure any previous animation is stopped
            
            setTimeout(() => {
                const wrapperHeight = wrapper.clientHeight;
                const imageHeight = image.scrollHeight;
                const scrollableDist = imageHeight - wrapperHeight;

                if (scrollableDist <= 0) {
                    image.style.transform = 'translateY(0)';
                    return;
                }

                let yOffset = 0;
                let direction = -1; // -1 scrolls down (image moves up)
                const speed = 2;    // Slower speed for smoother effect

                const animate = () => {
                    // Calculate the next potential position
                    let nextY = yOffset + (speed * direction);

                    // --- THIS IS THE FIX ---
                    // Clamp the value to ensure it never goes out of bounds
                    if (nextY < -scrollableDist) {
                        nextY = -scrollableDist; // Set to the max bottom position
                        direction = 1;           // Reverse direction
                    } else if (nextY > 0) {
                        nextY = 0;               // Set to the max top position
                        direction = -1;          // Reverse direction
                    }
                    
                    yOffset = nextY; // Update the position with the corrected value

                    image.style.transform = `translateY(${yOffset}px)`;
                    imageAnimationId = requestAnimationFrame(animate);
                };
                animate();
            }, 300);
        };

        const stopImageScroll = () => {
            if (imageAnimationId) {
                cancelAnimationFrame(imageAnimationId);
                imageAnimationId = null;
            }
        };
        // --- END: Main Image Scroll Animation ---
        // --- END: Main Image Scroll Animation ---

        const openModal = async (trigger) => {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';

            if (modalId === 'portfolioModal') {
                const content = { 
                    image: modal.querySelector('#modalImage'), title: modal.querySelector('#modalTitle'), 
                    description: modal.querySelector('#modalDescription'), tags: modal.querySelector('#modalTags'),
                    gallery: modal.querySelector('#modalGallery') 
                };
                
                // Main Image setup and animation start
                if (content.image) {
                    // Reset transform before changing src to ensure it starts from the top
                    content.image.style.transform = 'translateY(0)';
                    content.image.src = trigger.dataset.image || '';
                    
                    // Add a listener to start animation only after the new image is fully loaded
                    content.image.onload = () => {
                        const wrapper = modal.querySelector('.modal-image-wrapper');
                        startImageScroll(wrapper, content.image);
                    };
                }

                // Other details
                if (content.title) content.title.textContent = trigger.dataset.title || '';
                if (content.description) content.description.textContent = trigger.dataset.description || '';
                if (content.tags) {
                    content.tags.innerHTML = '';
                    (trigger.dataset.tags || '').split(',').forEach(tag => {
                        if (tag) content.tags.innerHTML += `<li>${tag.trim()}</li>`;
                    });
                }
                
                // Gallery setup and animation start
// Gallery setup and animation start (Fixed)
if (content.gallery) {
    // gallery-inner select or create
    let inner = content.gallery.querySelector('.gallery-inner');
    if (!inner) {
        inner = document.createElement('div');
        inner.className = 'gallery-inner';
        content.gallery.appendChild(inner);
    }

    // clear previous images
    inner.innerHTML = '';

    // split gallery images from dataset
    const galleryImagesData = (trigger.dataset.gallery || '').split('|');

    if (galleryImagesData.length > 0 && galleryImagesData[0].trim() !== '') {
        galleryImagesData.forEach(src => {
            if (src) {
                const img = document.createElement('img');
                img.src = src.trim();
                img.alt = 'Project gallery image';
                inner.appendChild(img);
            }
        });
        startGalleryScroll(content.gallery);
    } else {
        inner.innerHTML = '<p>No additional screenshots available.</p>';
    }
}

            } else if (modalId === 'ai-modal' && modalContentEl) {
                modalContentEl.innerHTML = '<p>Generating insights...</p>';
                const prompt = trigger.dataset.aiPrompt;
                const systemPrompt = "You are an expert web developer and marketing analyst. Provide a short, insightful, one-paragraph summary based on the user's prompt. Focus on benefits, technology, or business value. Use simple Markdown for emphasis (**bold**).";
                const summary = await callGemini(systemPrompt, prompt);
                modalContentEl.innerHTML = summary.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>');
            }
        };

        const closeModal = () => {
            modal.classList.remove('active');
            document.body.style.overflow = '';
            if (modalId === 'portfolioModal') {
                stopGalleryScroll();
                stopImageScroll(); // Stop the main image scroll
                const img = modal.querySelector('#modalImage');
                if (img) {
                    img.style.transform = 'translateY(0)'; // Reset image position
                    img.onload = null; // Important: Clear the onload event to prevent unexpected behavior
                }
            }
        };

        document.addEventListener('click', (e) => {
            const trigger = e.target.closest(triggerSelector);
            if (trigger) openModal(trigger);
        });
        
        if(closeBtn) closeBtn.addEventListener('click', closeModal);
        modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
        document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && modal.classList.contains('active')) closeModal(); });
    };

    initModal('portfolioModal', '.project-card');
    initModal('ai-modal', '.ai-popup-btn');

    // --- RAKIB AI Chat ---
    const chatBtn = document.getElementById('chatBtn');
    if (chatBtn) {
        const chatWindow = document.getElementById('chatWindow');
        const chatForm = document.getElementById('chatForm');
        const chatInput = document.getElementById('chatInput');
        const chatBody = document.getElementById('chatBody');

        chatBtn.addEventListener('click', () => {
            chatWindow.classList.toggle('active');
            if (chatWindow.classList.contains('active')) chatInput.focus();
        });

        if (chatForm) {
            chatForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const userInput = chatInput.value.trim();
                if (!userInput) return;
                addMessage(userInput, 'user');
                chatInput.value = '';
                showTypingIndicator();

                const systemPrompt = `
                    You are RAKIB AI, a helpful assistant for MD RAKIBUZZAMAN's portfolio.
                    If a user asks for contact information or how to get in touch, your primary instruction is to first ask them how they would prefer to connect. Offer them three options: WhatsApp, Email, or the Contact Page.
                    
                    Based on their reply, you must provide ONLY ONE of the following responses, using the exact HTML link format:
                    - If they choose WhatsApp, respond with: "Sure, you can reach him on WhatsApp: <a href='https://wa.me/8801629950303' target='_blank'>+8801629950303</a>"
                    - If they choose Email, respond with: "Of course, here is the email address: <a href='mailto:your.email@example.com'>your.email@example.com</a>"
                    - If they choose the Contact Page, respond with: "Great! You can find the contact form and more details here: <a href='contact.html'>Contact Page</a>"

                    For all other questions, keep your answers concise and professional.
                `;

                const responseText = await callGemini(systemPrompt, userInput);
                removeTypingIndicator();
                addMessage(responseText, 'agent');
            });
        }

        const addMessage = (text, sender) => {
            const msg = document.createElement('div');
            msg.className = `chat-message ${sender}`;
            msg.innerHTML = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
            if (chatBody) {
                chatBody.appendChild(msg);
                chatBody.scrollTop = chatBody.scrollHeight;
            }
        };

        const showTypingIndicator = () => {
            if(document.getElementById('typingIndicator')) return;
            const indicator = document.createElement('div');
            indicator.id = 'typingIndicator';
            indicator.className = 'chat-message agent typing';
            indicator.innerHTML = `<span class="dot"></span><span class="dot"></span><span class="dot"></span>`;
            if (chatBody) {
                 chatBody.appendChild(indicator);
                 chatBody.scrollTop = chatBody.scrollHeight;
            }
        };
        const removeTypingIndicator = () => document.getElementById('typingIndicator')?.remove();
    }

    // --- Gemini API Call ---
    async function callGemini(systemInstruction, userQuery) {
        try {
            const response = await fetch(GEMINI_API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: userQuery }] }],
                    systemInstruction: { parts: [{ text: systemInstruction }] },
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                console.error("Gemini API Error Response:", data);
                const errorMsg = data?.error?.message || `An API error occurred. Status: ${response.status}`;
                throw new Error(errorMsg);
            }

            if (data.candidates && data.candidates.length > 0 && data.candidates[0].content?.parts?.length > 0) {
                return data.candidates[0].content.parts[0].text;
            } else {
                console.warn("Gemini API call successful but returned no content. Response:", data);
                return "I'm sorry, I couldn't generate a response. Please try a different query.";
            }

        } catch (error) {
            console.error("Error calling Gemini API:", error.message);
            return "Apologies, the AI service is currently unavailable. Please check the console for details.";
        }
    }
});