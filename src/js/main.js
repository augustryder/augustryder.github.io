// Medieval Ethereal Portfolio JavaScript
document.addEventListener('DOMContentLoaded', function() {
    
    // Sound effects
    const bellSound = document.getElementById('bellSound');
    const pageTurnSound = document.getElementById('pageTurnSound');
    const scrollSound = document.getElementById('scrollSound');
    
    // Play sound function
    function playSound(soundType) {
        let sound;
        switch(soundType) {
            case 'bell':
                sound = bellSound;
                break;
            case 'pageTurn':
                sound = pageTurnSound;
                break;
            case 'scroll':
                sound = scrollSound;
                break;
            default:
                return;
        }
        
        if (sound) {
            sound.currentTime = 0;
            sound.play().catch(e => console.log('Sound play failed:', e));
        }
    }
    
    // Add sound effects to elements with data-sound attribute
    document.querySelectorAll('[data-sound]').forEach(element => {
        element.addEventListener('click', function(e) {
            const soundType = this.getAttribute('data-sound');
            playSound(soundType);
        });
    });
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                playSound('scroll');
            }
        });
    });
    
    // Parallax effect for header background
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const header = document.querySelector('.medieval-header');
        if (header) {
            header.style.transform = `translateY(${scrolled * 0.5}px)`;
        }
    });
    
    // Animate elements on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    document.querySelectorAll('.parchment-container, .project-parchment, .experience-item').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
    
    // Add medieval hover effects
    document.querySelectorAll('.medieval-button, .nav-link, .social-link').forEach(element => {
        element.addEventListener('mouseenter', function() {
            this.style.transform = this.style.transform + ' scale(1.05)';
        });
        
        element.addEventListener('mouseleave', function() {
            this.style.transform = this.style.transform.replace(' scale(1.05)', '');
        });
    });
    
    // Add typing effect to motto
    const motto = document.querySelector('.motto');
    if (motto) {
        const originalText = motto.textContent;
        motto.textContent = '';
        let i = 0;
        
        function typeWriter() {
            if (i < originalText.length) {
                motto.textContent += originalText.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            }
        }
        
        // Start typing effect after a delay
        setTimeout(typeWriter, 4000); // Start after name animation
    }
    
    // Setup name typing animation
    const title = document.querySelector('.medieval-title');
    if (title) {
        title.style.width = '0';
        title.style.animation = 'none';
        
        setTimeout(() => {
            title.style.animation = 'typing 3s steps(20, end)';
            title.style.width = '100%';
        }, 2500); // Start after loading animation completes
    }
    

    

    
    // Add medieval loading animation
    window.addEventListener('load', function() {
        const loader = document.createElement('div');
        loader.style.position = 'fixed';
        loader.style.top = '0';
        loader.style.left = '0';
        loader.style.width = '100%';
        loader.style.height = '100%';
        loader.style.background = '#0a0a0a';
        loader.style.display = 'flex';
        loader.style.justifyContent = 'center';
        loader.style.alignItems = 'center';
        loader.style.zIndex = '10000';
        loader.style.transition = 'opacity 0.5s ease';
        
        loader.innerHTML = `
            <div style="text-align: center; color: #8a2be2; font-family: 'UnifrakturMaguntia', serif;">
                <div style="font-size: 2rem; margin-bottom: 20px;">Loading...</div>
                <div style="width: 100px; height: 4px; background: #2d0a2d; border-radius: 2px; overflow: hidden; margin: 0 auto;">
                    <div style="width: 0%; height: 100%; background: #8a2be2; transition: width 1.5s ease-in-out;"></div>
                </div>
            </div>
        `;
        
        // Animate the progress bar
        setTimeout(() => {
            const progressBar = loader.querySelector('div > div > div');
            progressBar.style.width = '100%';
        }, 200);
        
        document.body.appendChild(loader);
        
        setTimeout(() => {
            loader.style.opacity = '0';
            setTimeout(() => {
                loader.remove();
            }, 500);
        }, 1000);
    });
    
    // Add mystical scroll indicator
    const scrollIndicator = document.createElement('div');
    scrollIndicator.style.position = 'fixed';
    scrollIndicator.style.right = '20px';
    scrollIndicator.style.top = '50%';
    scrollIndicator.style.transform = 'translateY(-50%)';
    scrollIndicator.style.width = '4px';
    scrollIndicator.style.height = '100px';
    scrollIndicator.style.background = '#2d0a2d';
    scrollIndicator.style.borderRadius = '2px';
    scrollIndicator.style.zIndex = '1000';
    scrollIndicator.style.opacity = '0.6';
    scrollIndicator.style.border = '1px solid #8a2be2';
    
    const scrollProgress = document.createElement('div');
    scrollProgress.style.width = '100%';
    scrollProgress.style.background = '#8a2be2';
    scrollProgress.style.borderRadius = '2px';
    scrollProgress.style.transition = 'height 0.3s ease';
    scrollProgress.style.height = '0%';
    scrollProgress.style.boxShadow = '0 0 6px #8a2be2';
    
    scrollIndicator.appendChild(scrollProgress);
    document.body.appendChild(scrollIndicator);
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset;
        const docHeight = document.body.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        scrollProgress.style.height = scrollPercent + '%';
    });
    
    // Add mystical tooltips
    document.querySelectorAll('[title]').forEach(element => {
        const tooltip = document.createElement('div');
        tooltip.style.position = 'absolute';
        tooltip.style.background = '#1a0a1a';
        tooltip.style.color = '#e6e6fa';
        tooltip.style.padding = '8px 12px';
        tooltip.style.borderRadius = '6px';
        tooltip.style.fontSize = '14px';
        tooltip.style.border = '2px solid #8a2be2';
        tooltip.style.zIndex = '10000';
        tooltip.style.opacity = '0';
        tooltip.style.transition = 'opacity 0.3s ease';
        tooltip.style.pointerEvents = 'none';
        tooltip.style.whiteSpace = 'nowrap';
        tooltip.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.5)';
        tooltip.textContent = element.getAttribute('title');
        
        document.body.appendChild(tooltip);
        
        element.addEventListener('mouseenter', function(e) {
            tooltip.style.opacity = '1';
            tooltip.style.left = e.pageX + 10 + 'px';
            tooltip.style.top = e.pageY - 30 + 'px';
        });
        
        element.addEventListener('mouseleave', function() {
            tooltip.style.opacity = '0';
        });
        
        element.removeAttribute('title');
    });
    
    // Add medieval keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey || e.metaKey) {
            switch(e.key) {
                case 'h':
                    e.preventDefault();
                    document.querySelector('a[href="#home"]').click();
                    break;
                case 'a':
                    e.preventDefault();
                    document.querySelector('a[href="#about"]').click();
                    break;
                case 'e':
                    e.preventDefault();
                    document.querySelector('a[href="#experience"]').click();
                    break;
                case 'p':
                    e.preventDefault();
                    document.querySelector('a[href="#projects"]').click();
                    break;
                case 's':
                    e.preventDefault();
                    document.querySelector('a[href="#skills"]').click();
                    break;
            }
        }
    });
    
    // Add medieval loading animation
    window.addEventListener('load', function() {
        const loader = document.createElement('div');
        loader.style.position = 'fixed';
        loader.style.top = '0';
        loader.style.left = '0';
        loader.style.width = '100%';
        loader.style.height = '100%';
        loader.style.background = '#000000';
        loader.style.display = 'flex';
        loader.style.justifyContent = 'center';
        loader.style.alignItems = 'center';
        loader.style.zIndex = '10000';
        loader.style.transition = 'opacity 0.5s ease';
        
        loader.innerHTML = `
            <div style="text-align: center; color: #8a2be2; font-family: 'UnifrakturMaguntia', serif;">
                <div style="font-size: 2rem; margin-bottom: 20px;">Loading...</div>
                <div style="width: 100px; height: 4px; background: #2d0a2d; border-radius: 2px; overflow: hidden; margin: 0 auto;">
                    <div id="progress-bar" style="width: 0%; height: 100%; background: #8a2be2; transition: width 1.5s ease-in-out;"></div>
                </div>
            </div>
        `;
        
        document.body.appendChild(loader);
        
        // Animate the progress bar
        setTimeout(() => {
            const progressBar = document.getElementById('progress-bar');
            if (progressBar) {
                progressBar.style.width = '100%';
            }
        }, 200);
        
        setTimeout(() => {
            loader.style.opacity = '0';
            setTimeout(() => {
                loader.remove();
            }, 500);
        }, 2000);
    });
    
    console.log('🏰 Medieval Ethereal Portfolio loaded successfully! ⚔️');
});
