let searchBtn = document.querySelector('#search-btn');
let searchBar = document.querySelector('.search-bar-container');
let formBtn = document.querySelector('#login-btn');
let loginForm = document.querySelector('.login-form-container');
let formClose = document.querySelector('#form-close');
let menu = document.querySelector('#menu-bar');
let navbar = document.querySelector('.navbar');

window.onscroll = () =>{
    searchBtn.classList.remove('fa-times');
    searchBar.classList.remove('active');
    menu.classList.remove('fa-times');
    navbar.classList.remove('active');
    loginForm.classList.remove('active');
}

menu.addEventListener('click', () =>{
    menu.classList.toggle('fa-times');
    navbar.classList.toggle('active');
});

searchBtn.addEventListener('click', () =>{
    searchBtn.classList.toggle('fa-times');
    searchBar.classList.toggle('active');
});

formBtn.addEventListener('click', () =>{
    loginForm.classList.add('active');
    setTimeout(() => {
        const loginFormElement = document.getElementById('login-form');
        const registerFormElement = document.getElementById('register-form');
        if(loginFormElement) loginFormElement.style.display = 'block';
        if(registerFormElement) registerFormElement.style.display = 'none';
    }, 10);
});

formClose.addEventListener('click', () =>{
    loginForm.classList.remove('active');
});

// ========== ALL FUNCTIONALITY IN ONE DOMCONTENTLOADED ==========
document.addEventListener('DOMContentLoaded', function() {
    console.log('Initializing website functionality...');

    // ===== LOGIN/REGISTER TOGGLE =====
    const showRegister = document.getElementById('show-register');
    const showLogin = document.getElementById('show-login');
    const loginFormElement = document.getElementById('login-form');
    const registerFormElement = document.getElementById('register-form');
    
    if(showRegister && loginFormElement && registerFormElement) {
        showRegister.addEventListener('click', (e) => {
            e.preventDefault();
            loginFormElement.style.display = 'none';
            registerFormElement.style.display = 'block';
        });
    }
    
    if(showLogin && loginFormElement && registerFormElement) {
        showLogin.addEventListener('click', (e) => {
            e.preventDefault();
            registerFormElement.style.display = 'none';
            loginFormElement.style.display = 'block';
        });
    }

    // ===== VIDEO BUTTON FUNCTIONALITY =====
    const videoButtons = document.querySelectorAll('.controls .vid-btn');
    const videos = document.querySelectorAll('.video-slider');
    
    if(videoButtons.length > 0 && videos.length > 0) {
        videoButtons.forEach((button, index) => {
            button.addEventListener('click', function() {
                // Remove active class from all buttons
                videoButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                
                // Hide and pause all videos
                videos.forEach(video => {
                    video.style.display = 'none';
                    video.pause();
                });
                
                // Show and play the selected video
                const videoToPlay = videos[index];
                if(videoToPlay) {
                    videoToPlay.style.display = 'block';
                    videoToPlay.currentTime = 0;
                    videoToPlay.play().catch(err => console.log('Video play error:', err));
                }
            });
        });
        console.log('Video controls initialized');
    }

    // ===== USER SESSION MANAGEMENT =====
    let currentUser = localStorage.getItem('currentUser');
    if(currentUser) {
        try {
            currentUser = JSON.parse(currentUser);
            if(formBtn && currentUser.email) {
                formBtn.title = `Logged in as ${currentUser.email}`;
            }
        } catch(e) {
            currentUser = null;
        }
    }

    // ===== LOGIN FORM SUBMISSION =====
    if(loginFormElement) {
        loginFormElement.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value;
            const password = this.querySelector('input[type="password"]').value;
            
            if(email && password) {
                const user = {email: email, loginTime: new Date().toISOString()};
                localStorage.setItem('currentUser', JSON.stringify(user));
                alert(`Welcome back!\nLogged in as ${email}`);
                loginForm.classList.remove('active');
                this.reset();
                currentUser = user;
            } else {
                alert('Please fill in all fields');
            }
        });
        console.log('Login form ready');
    }

    // ===== REGISTER FORM SUBMISSION =====
    if(registerFormElement) {
        registerFormElement.addEventListener('submit', function(e) {
            e.preventDefault();
            const inputs = this.querySelectorAll('input');
            const name = inputs[0]?.value || '';
            const email = inputs[1]?.value || '';
            const password = inputs[2]?.value || '';
            const confirmPassword = inputs[3]?.value || '';
            
            if(!name || !email || !password || !confirmPassword) {
                alert('Please fill in all required fields');
                return;
            }
            
            if(password !== confirmPassword) {
                alert('Passwords do not match!');
                return;
            }
            
            if(password.length < 6) {
                alert('Password must be at least 6 characters long');
                return;
            }
            
            const user = {name, email, registeredDate: new Date().toISOString()};
            localStorage.setItem('currentUser', JSON.stringify(user));
            
            alert(`Account created successfully!\nWelcome ${name}!`);
            loginForm.classList.remove('active');
            this.reset();
            registerFormElement.style.display = 'none';
            loginFormElement.style.display = 'block';
            currentUser = user;
        });
        console.log('Registration form ready');
    }

    // ===== BOOKING FORM =====
    const bookingForm = document.querySelector('.book form');
    if(bookingForm) {
        bookingForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const place = this.querySelector('input[type="text"]')?.value || '';
            const guests = this.querySelector('input[type="number"]')?.value || 0;
            const dateInputs = this.querySelectorAll('input[type="date"]');
            const arrival = dateInputs[0]?.value || '';
            const leaving = dateInputs[1]?.value || '';
            
            if(!place || !guests || !arrival || !leaving) {
                alert('Please fill in all booking details');
                return;
            }
            
            if(new Date(leaving) <= new Date(arrival)) {
                alert('Leaving date must be after arrival date');
                return;
            }
            
            if(guests < 1) {
                alert('Number of guests must be at least 1');
                return;
            }
            
            const days = Math.ceil((new Date(leaving) - new Date(arrival)) / (1000 * 60 * 60 * 24));
            const estimatedCost = days * guests * 2500;
            const bookingId = 'BK' + Date.now();
            
            // Save booking
            let bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
            bookings.push({
                id: bookingId,
                place, 
                guests, 
                arrival, 
                leaving, 
                cost: estimatedCost,
                user: currentUser?.email || 'guest',
                date: new Date().toISOString()
            });
            localStorage.setItem('bookings', JSON.stringify(bookings));
            
            alert(`Booking Confirmed!\n\nBooking ID: ${bookingId}\nDestination: ${place}\nGuests: ${guests}\nDuration: ${days} days\nEstimated Cost: ₹${estimatedCost.toLocaleString()}\n\nThank you for choosing us!`);
            this.reset();
        });
        
        // Set minimum date to today
        const dateInputs = bookingForm.querySelectorAll('input[type="date"]');
        const today = new Date().toISOString().split('T')[0];
        dateInputs.forEach(input => input.setAttribute('min', today));
        
        console.log('Booking form ready');
    }

    // ===== CONTACT FORM =====
    const contactForm = document.querySelector('.contact form');
    if(contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const inputs = this.querySelectorAll('input');
            const name = inputs[0]?.value || '';
            const email = inputs[1]?.value || '';
            const number = inputs[2]?.value || '';
            const subject = inputs[3]?.value || '';
            const message = this.querySelector('textarea')?.value || '';
            
            if(!name || !email || !number || !subject || !message) {
                alert('Please fill in all fields');
                return;
            }
            
            if(!email.includes('@')) {
                alert('Please enter a valid email address');
                return;
            }
            
            // Save contact
            let contacts = JSON.parse(localStorage.getItem('contacts') || '[]');
            contacts.push({
                name, email, number, subject, message, 
                date: new Date().toISOString(),
                ticketId: 'MSG' + Date.now()
            });
            localStorage.setItem('contacts', JSON.stringify(contacts));
            
            alert(`Message Sent Successfully!\n\nTicket ID: MSG${Date.now()}\nWe will contact you soon at ${email}`);
            this.reset();
        });
        console.log('Contact form ready');
    }

    // ===== SMOOTH SCROLLING =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if(href && href !== '#') {
                const target = document.querySelector(href);
                if(target) {
                    e.preventDefault();
                    target.scrollIntoView({behavior: 'smooth'});
                    menu.classList.remove('fa-times');
                    navbar.classList.remove('active');
                }
            }
        });
    });
    console.log('Smooth scrolling enabled');

    // ===== SEARCH FUNCTIONALITY =====
    const searchInput = document.getElementById('search-bar');
    if(searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const packages = document.querySelectorAll('.packages .box');
            
            if(searchTerm.length < 2) {
                packages.forEach(pkg => pkg.style.display = 'block');
                return;
            }
            
            packages.forEach(pkg => {
                const title = pkg.querySelector('h3')?.textContent.toLowerCase() || '';
                const description = pkg.querySelector('p')?.textContent.toLowerCase() || '';
                
                if(title.includes(searchTerm) || description.includes(searchTerm)) {
                    pkg.style.display = 'block';
                } else {
                    pkg.style.display = 'none';
                }
            });
        });
        console.log('Search functionality ready');
    }

    // ===== PACKAGE BOOKING BUTTONS =====
    document.querySelectorAll('.packages .box .btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const box = this.closest('.box');
            const packageName = box.querySelector('h3')?.textContent.trim() || '';
            const price = box.querySelector('.price')?.textContent.trim() || '';
            
            if(confirm(`Book this package?\n\n${packageName}\n${price}`)) {
                document.querySelector('#book')?.scrollIntoView({behavior: 'smooth'});
                setTimeout(() => {
                    const placeInput = document.querySelector('.book input[type="text"]');
                    if(placeInput) {
                        const cleanName = packageName.replace(/.*alt\"\>\s*/, '').trim();
                        placeInput.value = cleanName;
                        placeInput.focus();
                    }
                }, 500);
            }
        });
    });
    console.log('Package booking buttons ready');

    // ===== HOVER EFFECTS =====
    document.querySelectorAll('.packages .box').forEach(box => {
        box.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
            this.style.transition = 'all 0.3s ease';
        });
        box.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    // ===== SCROLL PROGRESS BAR =====
    const progressBar = document.createElement('div');
    progressBar.style.cssText = 'position:fixed;top:0;left:0;height:3px;background:linear-gradient(to right,#ffa500,#ff6347);z-index:9999;width:0;transition:width 0.1s;';
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', function() {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        progressBar.style.width = scrolled + '%';
    });
    console.log('Scroll progress bar added');

    // ===== BACK TO TOP BUTTON =====
    const backToTop = document.createElement('div');
    backToTop.innerHTML = '<i class="fas fa-arrow-up"></i>';
    backToTop.style.cssText = 'position:fixed;bottom:30px;right:30px;width:50px;height:50px;background:#ffa500;color:#fff;border-radius:50%;display:none;align-items:center;justify-content:center;cursor:pointer;z-index:1000;font-size:20px;box-shadow:0 4px 10px rgba(0,0,0,0.3);';
    document.body.appendChild(backToTop);
    
    window.addEventListener('scroll', function() {
        backToTop.style.display = window.scrollY > 300 ? 'flex' : 'none';
    });
    
    backToTop.addEventListener('click', function() {
        window.scrollTo({top: 0, behavior: 'smooth'});
    });
    console.log('Back to top button added');

    // ===== KEYBOARD SHORTCUTS =====
    document.addEventListener('keydown', function(e) {
        if(e.altKey) {
            e.preventDefault();
            if(e.key === 'h') document.getElementById('home')?.scrollIntoView({behavior: 'smooth'});
            if(e.key === 'b') document.getElementById('book')?.scrollIntoView({behavior: 'smooth'});
            if(e.key === 'p') document.getElementById('packages')?.scrollIntoView({behavior: 'smooth'});
            if(e.key === 'c') document.getElementById('contact')?.scrollIntoView({behavior: 'smooth'});
        }
        if(e.key === 'Escape') {
            loginForm?.classList.remove('active');
            searchBar?.classList.remove('active');
            navbar?.classList.remove('active');
        }
    });
    console.log('Keyboard shortcuts enabled (Alt+H/B/P/C, Escape)');

    // ===== VISIT COUNTER =====
    let visitCount = parseInt(localStorage.getItem('visitCount') || '0') + 1;
    localStorage.setItem('visitCount', visitCount);
    console.log(`Welcome! Visit #${visitCount}`);

    console.log('All functionality loaded successfully!');
});

// ===== SWIPER SLIDERS =====
var reviewSwiper = new Swiper(".review-slider", {
    spaceBetween: 20,
    loop: true,
    autoplay: {
        delay: 3000,
        disableOnInteraction: false,
    },
    breakpoints: {
        640: { slidesPerView: 1 },
        768: { slidesPerView: 2 },
        1024: { slidesPerView: 3 },
    },
});

var brandSwiper = new Swiper(".brand-slider", {
    spaceBetween: 20,
    loop: true,
    autoplay: {
        delay: 2500,
        disableOnInteraction: false,
    },
    breakpoints: {
        450: { slidesPerView: 2 },
        768: { slidesPerView: 3 },
        991: { slidesPerView: 4 },
        1200: { slidesPerView: 5 },
    },
});
