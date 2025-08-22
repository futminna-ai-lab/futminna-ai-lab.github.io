/**
 * HausaNLP Custom JavaScript
 * Handles mobile navigation and form interactions
 */

(function() {
    'use strict';

    // Mobile Navigation Toggle
    function initMobileNav() {
        const navToggle = document.getElementById('navToggle');
        const sidebar = document.getElementById('sidebar');
        const body = document.body;

        if (!navToggle || !sidebar) return;

        // Toggle sidebar on button click
        navToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            toggleSidebar();
        });

        // Close sidebar when clicking on overlay area
        document.addEventListener('click', function(e) {
            if (sidebar.classList.contains('active') && 
                !sidebar.contains(e.target) && 
                !navToggle.contains(e.target)) {
                closeSidebar();
            }
        });

        // Close sidebar on escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && sidebar.classList.contains('active')) {
                closeSidebar();
            }
        });

        // Close sidebar when clicking nav links
        const navLinks = sidebar.querySelectorAll('nav a');
        navLinks.forEach(function(link) {
            link.addEventListener('click', function() {
                closeSidebar();
            });
        });

        function toggleSidebar() {
            sidebar.classList.toggle('active');
            navToggle.classList.toggle('active');
            
            if (sidebar.classList.contains('active')) {
                body.classList.add('sidebar-open');
                navToggle.classList.add('sidebar-open');
            } else {
                body.classList.remove('sidebar-open');
                navToggle.classList.remove('sidebar-open');
            }
        }

        function closeSidebar() {
            sidebar.classList.remove('active');
            navToggle.classList.remove('active');
            navToggle.classList.remove('sidebar-open');
            body.classList.remove('sidebar-open');
        }
    }

    // Contact Form Handler
    function initContactForm() {
        const contactForm = document.getElementById('contactForm');
        
        if (!contactForm) return;

        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(contactForm);
            const data = {};
            for (let [key, value] of formData.entries()) {
                data[key] = value;
            }

            // Basic validation
            if (!data.name || !data.email || !data.message) {
                showMessage('Please fill in all required fields.', 'error');
                return;
            }

            if (!isValidEmail(data.email)) {
                showMessage('Please enter a valid email address.', 'error');
                return;
            }

            // Simulate form submission (replace with actual endpoint)
            submitForm(data);
        });
    }

    // Form submission (placeholder - replace with actual implementation)
    function submitForm(data) {
        // Show loading state
        const submitButton = document.querySelector('#contactForm input[type="submit"]');
        const originalText = submitButton.value;
        submitButton.value = 'Sending...';
        submitButton.disabled = true;

        // Simulate API call
        setTimeout(function() {
            showMessage('Thank you for your message! We\'ll get back to you soon.', 'success');
            document.getElementById('contactForm').reset();
            
            // Reset button
            submitButton.value = originalText;
            submitButton.disabled = false;
        }, 2000);
    }

    // Email validation
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Show message to user
    function showMessage(message, type) {
        // Remove existing message
        const existingMessage = document.querySelector('.form-message');
        if (existingMessage) {
            existingMessage.remove();
        }

        // Create new message element
        const messageDiv = document.createElement('div');
        messageDiv.className = `form-message ${type}`;
        messageDiv.innerHTML = message;
        
        // Style the message
        messageDiv.style.cssText = `
            padding: 1em;
            margin: 1em 0;
            border-radius: 4px;
            font-weight: 500;
            text-align: center;
            ${type === 'success' ? 
                'background: rgba(155, 241, 255, 0.1); color: #9bf1ff; border: 1px solid rgba(155, 241, 255, 0.3);' : 
                'background: rgba(255, 107, 107, 0.1); color: #ff6b6b; border: 1px solid rgba(255, 107, 107, 0.3);'
            }
        `;

        // Insert message
        const contactForm = document.getElementById('contactForm');
        if (contactForm) {
            contactForm.insertBefore(messageDiv, contactForm.firstChild);
            
            // Auto-remove after 5 seconds
            setTimeout(function() {
                if (messageDiv.parentNode) {
                    messageDiv.remove();
                }
            }, 5000);
        }
    }

    // Active navigation highlighting
    function initActiveNavigation() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const navLinks = document.querySelectorAll('#sidebar nav a');
        
        navLinks.forEach(function(link) {
            const href = link.getAttribute('href');
            if (href === currentPage || 
                (currentPage === '' && href === 'index.html') ||
                (currentPage === 'index.html' && href === 'index.html')) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    // Smooth scrolling for anchor links (if on same page)
    function initSmoothScrolling() {
        const anchorLinks = document.querySelectorAll('a[href^="#"]');
        
        anchorLinks.forEach(function(link) {
            link.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                const target = document.querySelector(href);
                
                if (target) {
                    e.preventDefault();
                    
                    // Close mobile sidebar if open
                    const sidebar = document.getElementById('sidebar');
                    if (sidebar && sidebar.classList.contains('active')) {
                        const navToggle = document.getElementById('navToggle');
                        const body = document.body;
                        
                        sidebar.classList.remove('active');
                        navToggle.classList.remove('active', 'sidebar-open');
                        body.classList.remove('sidebar-open');
                    }
                    
                    // Smooth scroll to target
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    // Lazy loading for images
    function initLazyLoading() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver(function(entries, observer) {
                entries.forEach(function(entry) {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            img.classList.remove('lazy');
                            imageObserver.unobserve(img);
                        }
                    }
                });
            });

            const lazyImages = document.querySelectorAll('img[data-src]');
            lazyImages.forEach(function(img) {
                imageObserver.observe(img);
            });
        }
    }

    // Enhanced form interactions
    function initFormEnhancements() {
        // Add floating labels effect
        const formFields = document.querySelectorAll('input[type="text"], input[type="email"], textarea, select');
        
        formFields.forEach(function(field) {
            // Add focus/blur classes for styling
            field.addEventListener('focus', function() {
                this.parentElement.classList.add('focused');
            });
            
            field.addEventListener('blur', function() {
                if (!this.value) {
                    this.parentElement.classList.remove('focused');
                } else {
                    this.parentElement.classList.add('has-value');
                }
            });

            // Initialize state for fields with values
            if (field.value) {
                field.parentElement.classList.add('has-value');
            }
        });
    }

    // Analytics and tracking (placeholder)
    function initAnalytics() {
        // Track page views
        if (typeof gtag !== 'undefined') {
            gtag('config', 'GA_MEASUREMENT_ID', {
                page_title: document.title,
                page_location: window.location.href
            });
        }

        // Track form submissions, button clicks, etc.
        document.addEventListener('click', function(e) {
            const element = e.target;
            
            // Track button clicks
            if (element.classList.contains('button')) {
                const buttonText = element.textContent || element.value;
                console.log('Button clicked:', buttonText);
                // Add actual analytics tracking here
            }
        });
    }

    // Initialize all functions when DOM is loaded
    function init() {
        initMobileNav();
        initContactForm();
        initActiveNavigation();
        initSmoothScrolling();
        initLazyLoading();
        initFormEnhancements();
        initAnalytics();
    }

    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();