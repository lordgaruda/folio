document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Lucide Icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // 2. Responsive Mobile Navigation Menu
    const mobileToggle = document.getElementById('mobile-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', () => {
            mobileToggle.classList.toggle('open');
            navMenu.classList.toggle('open');
            
            // Prevent body scroll when mobile menu is open
            document.body.style.overflow = navMenu.classList.contains('open') ? 'hidden' : 'auto';
        });

        // Close menu when clicking a link
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileToggle.classList.remove('open');
                navMenu.classList.remove('open');
                document.body.style.overflow = 'auto';
            });
        });
    }

    // 3. Sticky Navigation Header Scroll Event
    const header = document.querySelector('.header');
    
    const handleScroll = () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };

    // 4. Scroll Spy (Highlight active navigation item)
    const sections = document.querySelectorAll('section');
    
    const scrollSpy = () => {
        const scrollPosition = window.scrollY + 120; // offset for nav height

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    };

    // Optimized unified scroll handler using requestAnimationFrame
    let isScrolling = false;
    window.addEventListener('scroll', () => {
        if (!isScrolling) {
            window.requestAnimationFrame(() => {
                handleScroll();
                scrollSpy();
                isScrolling = false;
            });
            isScrolling = true;
        }
    }, { passive: true });

    // Trigger on load in case page is already scrolled or loaded at anchor
    handleScroll();
    scrollSpy();

    // 5. Scroll Reveal Animation using Intersection Observer
    const revealElements = document.querySelectorAll('.scroll-reveal');
    
    if ('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    observer.unobserve(entry.target); // Animates only once
                }
            });
        }, {
            threshold: 0.1, // Trigger when 10% of element is visible
            rootMargin: '0px 0px -50px 0px' // Offset trigger point slightly
        });

        revealElements.forEach(element => {
            revealObserver.observe(element);
        });
    } else {
        // Fallback for browsers that don't support IntersectionObserver
        revealElements.forEach(element => {
            element.classList.add('active');
        });
    }

    // 6. Interactive Terminal Typer Simulation (Hero Section)
    const terminalContent = document.getElementById('terminal-content');
    
    if (terminalContent) {
        const script = [
            { type: 'command', text: 'npx deploy-stack --env prod' },
            { type: 'spinner', text: 'Parsing infrastructure configurations...', doneText: 'Configurations parsed successfully.' },
            { type: 'spinner', text: 'Verifying AWS IAM authentication...', doneText: 'AWS authentication validated. Credentials OK.' },
            { type: 'spinner', text: 'Provisioning multi-AZ VPC & subnets...', doneText: 'VPC subnets established in [ap-south-1a, ap-south-1b].' },
            { type: 'spinner', text: 'Deploying docker containers to AWS ECS...', doneText: 'Containers deployed. Task definitions updated.' },
            { type: 'spinner', text: 'Configuring Prometheus metrics exporters...', doneText: 'Prometheus metrics configuration active.' },
            { type: 'success', text: '✔ PIPELINE DEPLOYMENT SUCCESSFUL [100% SUCCESS]' },
            { type: 'success-bold', text: '✔ Infrastructure Online. Target: webssoffers.com // Uptime: 99.99%' },
            { type: 'prompt', text: 'falgun@devops:~$' }
        ];

        let lineIndex = 0;

        const writeLine = (item, callback) => {
            const line = document.createElement('div');
            line.className = 'terminal-line';
            terminalContent.appendChild(line);
            
            // Auto scroll to bottom
            terminalContent.scrollTop = terminalContent.scrollHeight;

            if (item.type === 'command') {
                const promptSpan = document.createElement('span');
                promptSpan.className = 'prompt';
                promptSpan.textContent = 'falgun@devops:~$ ';
                line.appendChild(promptSpan);

                const commandSpan = document.createElement('span');
                commandSpan.className = 'typed-command';
                line.appendChild(commandSpan);

                // Type out the command letter by letter
                let charIndex = 0;
                const typeInterval = setInterval(() => {
                    if (charIndex < item.text.length) {
                        commandSpan.textContent += item.text[charIndex];
                        charIndex++;
                        terminalContent.scrollTop = terminalContent.scrollHeight;
                    } else {
                        clearInterval(typeInterval);
                        setTimeout(callback, 500); // pause before next line
                    }
                }, 40);
            } 
            else if (item.type === 'spinner') {
                const spinners = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
                let spinCount = 0;
                
                const spinnerSpan = document.createElement('span');
                spinnerSpan.className = 'accent-output';
                line.appendChild(spinnerSpan);

                const textSpan = document.createElement('span');
                textSpan.className = 'output';
                textSpan.textContent = ` ${item.text}`;
                line.appendChild(textSpan);

                const spinInterval = setInterval(() => {
                    spinnerSpan.textContent = spinners[spinCount % spinners.length];
                    spinCount++;
                }, 80);

                // Simulate provisioning/networking task delay
                setTimeout(() => {
                    clearInterval(spinInterval);
                    spinnerSpan.className = 'success-output';
                    spinnerSpan.textContent = '✔';
                    textSpan.className = 'output';
                    textSpan.textContent = ` ${item.doneText}`;
                    setTimeout(callback, 400);
                }, 1000 + Math.random() * 800);
            } 
            else if (item.type === 'success') {
                line.className = 'terminal-line success-output';
                line.textContent = item.text;
                setTimeout(callback, 300);
            } 
            else if (item.type === 'success-bold') {
                line.className = 'terminal-line success-output-bold';
                line.textContent = item.text;
                setTimeout(callback, 500);
            } 
            else if (item.type === 'prompt') {
                const promptSpan = document.createElement('span');
                promptSpan.className = 'prompt';
                promptSpan.textContent = item.text;
                line.appendChild(promptSpan);

                const cursorSpan = document.createElement('span');
                cursorSpan.className = 'cursor';
                line.appendChild(cursorSpan);
                
                // End script - terminal stays open with blinking cursor
                if (callback) callback();
            }
        };

        const processNextLine = () => {
            if (lineIndex < script.length) {
                writeLine(script[lineIndex], () => {
                    lineIndex++;
                    processNextLine();
                });
            }
        };

        // Start typing after initial delay
        setTimeout(processNextLine, 1200);
    }

    // 7. Contact Form Submission Handling & Simulation
    const contactForm = document.getElementById('contact-form');
    const submitBtn = document.getElementById('submit-btn');
    const formStatus = document.getElementById('form-status');

    if (contactForm && submitBtn && formStatus) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Form inputs
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const subject = document.getElementById('subject').value.trim();
            const message = document.getElementById('message').value.trim();

            if (!name || !email || !subject || !message) {
                formStatus.className = 'form-status error font-mono';
                formStatus.textContent = '✖ ERROR: All parameters are required.';
                return;
            }

            // Disable submit button and show loading state
            submitBtn.disabled = true;
            const originalBtnHtml = submitBtn.innerHTML;
            submitBtn.innerHTML = `<span class="font-mono">Uploading payload...</span>`;
            
            formStatus.className = 'form-status font-mono';
            formStatus.style.color = 'var(--color-accent)';
            formStatus.style.display = 'block';
            formStatus.textContent = '⠋ Connecting to mail agent, parsing form schema...';

            let dots = 0;
            const statusInterval = setInterval(() => {
                const spinners = ['⠋', '⠙', '⠹', '⠸', '⠼'];
                formStatus.textContent = `${spinners[dots % spinners.length]} Sending payload to falgunpatel.fv@proton.me...`;
                dots++;
            }, 100);

            // Simulate server network latency
            setTimeout(() => {
                clearInterval(statusInterval);
                
                // Success feedback
                formStatus.className = 'form-status success font-mono';
                formStatus.innerHTML = `✔ SUCCESS: SMTP packet transmitted. Response 250 OK.<br>Thank you, ${name}! Your message has been sent successfully.`;
                
                // Reset form inputs
                contactForm.reset();
                
                // Restore button
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnHtml;
                
                // Fade out message status after 7 seconds
                setTimeout(() => {
                    formStatus.style.transition = 'opacity 1s ease';
                    formStatus.style.opacity = '0';
                    setTimeout(() => {
                        formStatus.style.display = 'none';
                        formStatus.style.opacity = '1';
                    }, 1000);
                }, 7000);

            }, 2000);
        });
    }
});
