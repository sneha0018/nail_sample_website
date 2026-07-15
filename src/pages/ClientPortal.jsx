import React, { useState, useEffect } from 'react';
import { dbAddAppointment, dbAddOrder, dbAddSubscriber } from '../firebase';

// Pricing configuration
const servicesMap = {
  "Signature Bridal Artistry": 120.00,
  "Mirror Chrome & Metallic Design": 95.00,
  "Ethereal Korean Gel Artistry": 85.00,
  "Minimalist Fine-Line Artistry": 75.00
};

// Gallery Items
const galleryItems = [
  {
    id: "g1",
    category: "bridal",
    title: "The Editorial Pearl",
    desc: "A romantic composition featuring custom 3D floral sculpting, miniature freshwater pearl overlays, and micro-embroidered lace textures on a premium soft white finish.",
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuCfsvjRhxK_BjZdn1VWUEDcHwhjHXt8pS0nC23uX9QcVQjFmlTsoweWSIjn_NeTd5NPz47YkKmsCqwK4PvIf0Y0_evMw7a-BHUNH4a0BK_osh_qN-F3DlEEMg82tTYkS_ZEbxaPmOEwH8iu0nrmyI2diJfPy0J-9vJfgZwGrQHoA9mHJn9Eqqa2pHTlteYDw8o532xtml3JAZT1fb-r6hrEYb2CfYcQMQxnH71_TMFBCQ3OSDp7Yzh3"
  },
  {
    id: "g2",
    category: "bridal",
    title: "Crimson Gold Velvet",
    desc: "Deep crimson tones with dynamic velvet particles, embellished with authentic 24k gold leaf flakes for a regal texture layout.",
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuAHdPm5iVv1M9dViAYluDwZcGg1_S-73kc1_u86XiZDU5lQRtuCzT-7t4MIxOsrQ_tUA4XCPBJgVL_MVDi-PX7j7FzLZWJvUYSAp6KSSehI-WTir8g6JnHixgRol_Zkzw9H_r2m2l0UGPQNrM3IQNeublWIqLJA3byDVLIKH255HNP5Bs85m4c9Z1DLvUasiTzyIPUWk9pKA98kbNrlGcKa30Qkhzfjr7CDberclJ5LUZQM6BGvZ_6Y"
  },
  {
    id: "g3",
    category: "chrome",
    title: "Copper Liquid Light",
    desc: "An ultra-reflective mirror chrome finish built over warm copper undercoats. Perfect geometry with a clean studio reflection.",
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuBDd5JAbct7N_7MHQs2i7O9Ul2vumzpvITK7AHQ7hteodUUmT6EEc8NLpVToA5-n2-QcP8_sxI9RPFDK6O75EunjICMxJYu-PvbtUKMaz8l40kus_dMWQPIPjNKD6NMqu0Sdp7GYXm0vNYGr98EkOGrnmBOc4A_-2cV1NdJzK6GAHbKrHYLY0cTv4B-zs_dErqt2EspH5IBRtZ9JRxWopeADRDXZDmSyVlNnqSqA8OLlFdctXReP7Rx"
  },
  {
    id: "g4",
    category: "minimal",
    title: "Carrara Marble Swirl",
    desc: "Delicate smoky veins layered over semi-translucent soft white gel base, recreating real Carrara marble depth.",
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuDP2FKUq87zBHAmndM_LKobWc8xRxV6dlxlttNLsBMRYX-ujR3dB0nBQuBwC3hVrqd4X2P9MDZx2naG8NXnmp8jOtUmP5I5Hwrfw7Vil_0Wmb2qv2odRHlkiVrAzko6lLnNLnfrQfejCSsnRIB38x5TWSZD9Y8CHtnHOegUrhKKYmo0pE5cLWFjMaMle3DXuvh2rVEQe0ScYSQStcZKedcgyhvy8uS2JH1KEmovpyU4M0Rpw8oLOhLR"
  },
  {
    id: "g5",
    category: "korean",
    title: "Pressed Meadow Blossom",
    desc: "Real microscopic pressed flora embedded in high-shine syrup gel, highlighted by tiny gold beads for a dreamy finish.",
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuBMQnCCKgRi4Nqpeds0FgBza8MADRAZDhEQ17zQbKqpwDOP1xEfmp7U6hirixjdPkdtDzHGYUIpugZ7A6DjRStlyhzqnsfQdiWOT-3n3WgfuWSVkntb4NdPMBo3ZmRprsezL0-szJL0ay_PrW8Y8BR9aqhcWyLJJUhkNEggOuCB4fCVJWQ1WV-4PMH9Aj-Onm83Tjo3lFXLWhpANJ3MsvKQmt8C88gYdY38IlRMFqp8H7DhPc9of6lP"
  },
  {
    id: "g6",
    category: "minimal",
    title: "Linear French Twist",
    desc: "A sleek modernization of the classic French manicure utilizing ultra-thin metallic gold ribbons flanking negative space contours.",
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuBdktxvjmFl7HblehSimFHR7VL4usoBuVu6wOm-oQLxUsi1C6axxX7uKpxon3Vn6bLgw_WeqwKxEIv4uti2LuPBP-Afg2ZJVuiL9Vd26qZjBaat1nsXEkvQjxIxanu0k_lkNEoJENRlMfYb_zm1zVXRY9ZJvFMlXpu3dtHDZf6PbHfJ03FFKOoR4FPDVa76OMwm4Imlq1orsfi5YVp3nvmNsFE5a7SM0ad9pMZt1vx1WJSuBm6fGnuo"
  },
  {
    id: "g7",
    category: "chrome",
    title: "Geometric Obsidian",
    desc: "Deep volcanic charcoal base in soft matte texture, segmented by architectural lines of high-gloss lacquer coating.",
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuAm-Np6XnNtBJd6unEFg-6rGcR_12n7zUz0Th8H0mp7XiQjeT4qtwJ4BvPdd-FKXK02B5AaYVGtGb6RlRUsjom0Os2t4HOBWxLMne9U1PLGZ90qjVC_XxsRxR6sVVNgsCWrUKPvetLQHSqN9Cbke4BDcRwgQr6xi7W80jFwbOXTl6IKxSwllN3WyP8o9-FKM3viXt0jrNfuGiU3pbcurgFdropYZexHO7nNNLQB-wyzGww6kXN6M1G0"
  },
  {
    id: "g8",
    category: "korean",
    title: "Ethereal Opal Dream",
    desc: "Iridescent layers of soft lavender syrup gel containing micro-flakes that shifting color under warm studio highlights.",
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuD0hSmKnCaTcIT-P7yzG4BWLvQymk6s33wmZgGwf654oPlVuHkbMynZwPYwCe51sGN3tiCQBQ9FOFN2mDRDU8UUd6QAX72i0hpNt6DQTjaO_3PpBij66tsMLr9iHYAdcAzVfxAH8g0NWFwy729rlUHp65XDwnV_ceDi2ShWpiUbppopc2DOw72pzRaO1IJoR4d44OvGnI2qHUe7JUbBDcGx1vR8VUFqJoM7kF23JBMbWlDomTdagJOU"
  },
  {
    id: "g9",
    category: "chrome",
    title: "Emerald Velvet Aura",
    desc: "Deep jewel-toned emerald base with magnetic cat-eye particles that gather in waves, finished with a subtle dust of micro-gold powder.",
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuAiwGjmeHYEkDHnSint1OVpXekd-2h10AHJDeA7Fu0U7q1peZ18hn73PJCl3ffZaeD9Airnhn7NehHcFazoRRBt0jYpUkcpPyiUdHTg0Tz1TT7vzZAf5Z726M40JXNKNv5YKRZ-EKtwIA4Vub_idso2AR4IIRfqYV9vPkGoYA0rTyJ2-jHISaJLTm0unFiE8qxJtOKQe-rhl9VfrQVOaCfGutta29vFZNcUZadN-4jSOSmUOg9-N7Nr"
  }
];

export default function ClientPortal() {
  // --- STATES ---
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutSuccess, setIsCheckoutSuccess] = useState(false);
  
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [bookingStep, setBookingStep] = useState(1);
  const [selectedService, setSelectedService] = useState("Signature Bridal Artistry");
  const [selectedDate, setSelectedDate] = useState("Jul 16");
  const [selectedTime, setSelectedTime] = useState("10:00 AM");
  
  const [bName, setBName] = useState("");
  const [bEmail, setBEmail] = useState("");
  const [bPhone, setBPhone] = useState("");
  const [bNotes, setBNotes] = useState("");
  const [bookingRef, setBookingRef] = useState("VV-783921");
  
  const [galleryCategory, setGalleryCategory] = useState("all");
  const [lightboxItem, setLightboxItem] = useState(null);
  
  const [faqOpenIndex, setFaqOpenIndex] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [toasts, setToasts] = useState([]);

  // Trigger scroll-reveal effect on load
  useEffect(() => {
    const handleScroll = () => {
      const reveals = document.querySelectorAll('.reveal');
      reveals.forEach(el => {
        const windowHeight = window.innerHeight;
        const revealTop = el.getBoundingClientRect().top;
        const revealPoint = 80;
        if (revealTop < windowHeight - revealPoint) {
          el.classList.add('active');
        }
      });
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Run immediately
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // --- UTILITIES ---
  const showToast = (message, type = "success") => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  };

  // --- CART E-COMMERCE ---
  const cartBadgeCount = cart.reduce((sum, item) => sum + item.qty, 0);
  const cartSubtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

  const addToCart = (id, name, price) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === id);
      if (existing) {
        return prev.map(item => item.id === id ? { ...item, qty: item.qty + 1 } : item);
      }
      return [...prev, { id, name, price, qty: 1 }];
    });
    showToast(`"${name}" added to bag.`);
  };

  const updateCartQty = (id, change) => {
    setCart(prev => {
      return prev.map(item => {
        if (item.id === id) {
          const newQty = item.qty + change;
          return newQty <= 0 ? null : { ...item, qty: newQty };
        }
        return item;
      }).filter(Boolean);
    });
  };

  const handleCheckout = async () => {
    try {
      await dbAddOrder(cart, cartSubtotal);
      setIsCheckoutSuccess(true);
    } catch (e) {
      showToast("Checkout failed. Please try again.", "error");
    }
  };

  const closeCart = () => {
    setIsCartOpen(false);
    if (isCheckoutSuccess) {
      setCart([]);
      setIsCheckoutSuccess(false);
    }
  };

  // --- BOOKING LOGIC ---
  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    const apptData = {
      name: bName,
      email: bEmail,
      phone: bPhone,
      service: selectedService,
      date: selectedDate,
      time: selectedTime,
      notes: bNotes
    };
    try {
      const refId = await dbAddAppointment(apptData);
      setBookingRef(refId);
      setBookingStep(4);
      showToast("Appointment successfully booked.");
    } catch (err) {
      showToast("Booking failed. Please try again.", "error");
    }
  };

  const prefillBooking = (serviceName) => {
    setSelectedService(serviceName);
    setBookingStep(1);
    setIsBookingOpen(true);
  };

  const triggerLightboxBooking = () => {
    const title = lightboxItem.title;
    setLightboxItem(null);
    let serviceKey = "Signature Bridal Artistry";
    if (title.includes("Chrome") || title.includes("Liquid") || title.includes("Obsidian") || title.includes("Velvet Aura")) {
      serviceKey = "Mirror Chrome & Metallic Design";
    } else if (title.includes("Blossom") || title.includes("Opal")) {
      serviceKey = "Ethereal Korean Gel Artistry";
    } else if (title.includes("French") || title.includes("Marble")) {
      serviceKey = "Minimalist Fine-Line Artistry";
    }
    prefillBooking(serviceKey);
  };

  // --- NEWSLETTER ---
  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    try {
      await dbAddSubscriber(newsletterEmail);
      showToast("Successfully added to the Velvet list.");
      setNewsletterEmail("");
    } catch (err) {
      showToast("Subscription failed.", "error");
    }
  };

  return (
    <div className="min-h-screen">
      {/* Toast Notifications */}
      <div className="fixed top-24 right-6 z-50 flex flex-col gap-3 pointer-events-none">
        {toasts.map(toast => (
          <div key={toast.id} className={`p-4 glass-card rounded-sm shadow-xl flex items-center gap-3 transition-all duration-300 pointer-events-auto border-l-4 ${toast.type === 'success' ? 'border-l-primary' : 'border-l-error'}`}>
            <span className="material-symbols-outlined text-primary">{toast.type === 'success' ? 'check_circle' : 'error'}</span>
            <span className="text-xs font-label-caps text-on-surface tracking-wider">{toast.message}</span>
          </div>
        ))}
      </div>

      {/* Top Header */}
      <header className="fixed top-0 w-full z-40 border-b border-outline-variant/10 glass-nav shadow-sm shadow-primary/5">
        <nav className="flex justify-between items-center px-6 md:px-gutter py-4 max-w-container-max mx-auto h-20">
          <div class="flex items-center gap-4">
            <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 rounded-full hover:bg-primary/5 transition-colors focus:outline-none" aria-label="Open Menu">
              <span className="material-symbols-outlined text-primary text-2xl">menu</span>
            </button>
            <button onClick={() => setIsBookingOpen(true)} className="hidden md:inline-flex items-center px-5 py-2 border border-primary/20 rounded-full font-label-caps text-[10px] text-primary hover:bg-primary hover:text-white transition-all duration-300 tracking-wider">
              BOOK AN APPOINTMENT
            </button>
          </div>
          
          <div className="flex items-center absolute left-1/2 -translate-x-1/2">
            <a href="#" className="focus:outline-none">
              <img alt="VELVET NAILS Logo" className="h-10 md:h-12 w-auto object-contain" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDxd_knI4-mk2A2gdQw7iPqHP-nTH5S4AbvLt_40LPxYWVZhcHtKwVpNZj5ASQaLja_6vjn_FqM00ldkdFJnu86l8kpEVZ5X7CocnaXsQQDjWkpbrlW2pMVVmVIhm5FxnFjxyCGPmciTQZfgwM3CaJyoclVKSpTCloHZHhA6nPINZR2rzil2fBCYVAi7TZnlc4aDwBE7w1ulRTAWrjVnz0AUo9liDzkGSKEMVEoxMUBG0UkHcXT32Li"/>
            </a>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="hidden md:flex gap-8">
              <a className="font-label-caps text-label-caps text-secondary hover:text-primary transition-all duration-300 py-1" href="#collections">COLLECTIONS</a>
              <a className="font-label-caps text-label-caps text-secondary hover:text-primary transition-all duration-300 py-1" href="#gallery">GALLERY</a>
              <a className="font-label-caps text-label-caps text-secondary hover:text-primary transition-all duration-300 py-1" href="#about">ABOUT</a>
            </div>
            
            <button onClick={() => setIsCartOpen(true)} className="relative p-2 rounded-full hover:bg-primary/5 transition-colors focus:outline-none flex items-center justify-center" aria-label="Open Shopping Bag">
              <span className="material-symbols-outlined text-primary text-2xl">shopping_bag</span>
              {cartBadgeCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-primary text-white text-[9px] font-bold rounded-full w-5 h-5 flex items-center justify-center border border-white transition-transform duration-300 scale-100">
                  {cartBadgeCount}
                </span>
              )}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Drawer Menu */}
      <div className={`fixed inset-0 z-50 transition-all duration-500 overflow-hidden ${isMobileMenuOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}>
        <div className={`absolute inset-0 bg-black/40 transition-opacity duration-500 ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0'}`} onClick={() => setIsMobileMenuOpen(false)}></div>
        <div className={`absolute top-0 left-0 bottom-0 w-80 max-w-[85vw] bg-background shadow-2xl flex flex-col p-8 transition-transform duration-500 ease-in-out ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="flex justify-between items-center mb-12">
            <span className="font-display-lg text-xl tracking-wider text-primary">VELVET NAILS</span>
            <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 rounded-full hover:bg-primary/5 transition-colors" aria-label="Close Mobile Menu">
              <svg className="w-6 h-6 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
          </div>
          <div className="flex flex-col gap-6 font-label-caps text-sm tracking-widest text-secondary flex-1">
            <a onClick={() => setIsMobileMenuOpen(false)} className="hover:text-primary py-2 border-b border-outline-variant/10 transition-colors" href="#collections">COLLECTIONS</a>
            <a onClick={() => setIsMobileMenuOpen(false)} className="hover:text-primary py-2 border-b border-outline-variant/10 transition-colors" href="#gallery">GALLERY</a>
            <a onClick={() => setIsMobileMenuOpen(false)} className="hover:text-primary py-2 border-b border-outline-variant/10 transition-colors" href="#about">ABOUT</a>
            <button onClick={() => { setIsMobileMenuOpen(false); setIsBookingOpen(true); }} className="text-left hover:text-primary py-2 border-b border-outline-variant/10 transition-colors flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">calendar_today</span> BOOKING SERVICES
            </button>
          </div>
          <div className="space-y-6">
            <button onClick={() => { setIsMobileMenuOpen(false); setIsBookingOpen(true); }} className="w-full bg-primary hover:bg-primary-dark text-white font-label-caps text-xs py-4 tracking-widest transition-colors rounded-sm shadow-md">
              BOOK APPOINTMENT
            </button>
            <p className="text-[10px] text-outline text-center tracking-wider">EST. 2024 • THE MODERN ARTISAN</p>
          </div>
        </div>
      </div>

      {/* Floating Action Button (Mobile Only) */}
      <button onClick={() => setIsBookingOpen(true)} className="md:hidden fixed bottom-6 right-6 z-30 bg-primary hover:bg-primary-dark text-white rounded-full p-4 shadow-xl flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95" aria-label="Book Appointment">
        <span className="material-symbols-outlined text-2xl">calendar_today</span>
      </button>

      {/* Hero Section */}
      <section className="relative h-screen w-full overflow-hidden flex flex-col items-center justify-center text-center px-margin-mobile md:px-0">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-black/25 z-10"></div>
          <img className="w-full h-full object-cover ken-burns" alt="Elegant editorial bridal nail art close up with pearl and lace designs" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCfsvjRhxK_BjZdn1VWUEDcHwhjHXt8pS0nC23uX9QcVQjFmlTsoweWSIjn_NeTd5NPz47YkKmsCqwK4PvIf0Y0_evMw7a-BHUNH4a0BK_osh_qN-F3DlEEMg82tTYkS_ZEbxaPmOEwH8iu0nrmyI2diJfPy0J-9vJfgZwGrQHoA9mHJn9Eqqa2pHTlteYDw8o532xtml3JAZT1fb-r6hrEYb2CfYcQMQxnH71_TMFBCQ3OSDp7Yzh3"/>
        </div>
        
        <div className="relative z-20 space-y-6 max-w-2xl px-6">
          <span className="font-label-caps text-[11px] text-white/80 tracking-[0.4em] uppercase block">Bespoke Editorial Artistry</span>
          <h1 className="font-display-lg text-display-lg-mobile md:text-display-lg text-white drop-shadow-md leading-tight reveal active">
            Luxury Nail Art.<br/>Crafted to Perfection.
          </h1>
          <p className="font-body-lg text-body-lg text-white/90 max-w-lg mx-auto font-light leading-relaxed reveal active">
            A curation of elegance and modern artistry designed to elevate your unique expression.
          </p>
          <div className="pt-4 reveal active">
            <button onClick={() => setIsBookingOpen(true)} className="bg-white/10 hover:bg-white text-white hover:text-primary border border-white/30 backdrop-blur-md rounded-full px-8 py-3.5 font-label-caps text-xs tracking-widest transition-all duration-300 hover:shadow-lg">
              EXPERIENCE THE STUDIO
            </button>
          </div>
        </div>
        
        <a href="#collections" className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/70 hover:text-white transition-colors animate-bounce focus:outline-none" aria-label="Scroll to collections">
          <span className="font-label-caps text-[9px] tracking-[0.25em]">EXPLORE</span>
          <span className="material-symbols-outlined text-base">expand_more</span>
        </a>
      </section>

      {/* Signature Collections */}
      <section className="py-section-gap px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto overflow-hidden" id="collections">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="space-y-3">
            <span class="font-label-caps text-label-caps text-primary tracking-widest block">SEASONAL CURATION</span>
            <h2 className="font-headline-lg text-headline-md md:text-headline-lg text-primary reveal">Signature Collections</h2>
          </div>
          <p className="font-body-md text-secondary max-w-md reveal leading-relaxed">
            Exploring the delicate intersection of avant-garde high fashion and timeless minimalist aesthetic.
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-gutter">
          {/* Bridal */}
          <div className="group relative overflow-hidden aspect-[3/5] bg-surface-container-low reveal staggered-item shadow-sm hover:shadow-xl rounded-sm">
            <img className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700" alt="Bridal nail art design" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCfsvjRhxK_BjZdn1VWUEDcHwhjHXt8pS0nC23uX9QcVQjFmlTsoweWSIjn_NeTd5NPz47YkKmsCqwK4PvIf0Y0_evMw7a-BHUNH4a0BK_osh_qN-F3DlEEMg82tTYkS_ZEbxaPmOEwH8iu0nrmyI2diJfPy0J-9vJfgZwGrQHoA9mHJn9Eqqa2pHTlteYDw8o532xtml3JAZT1fb-r6hrEYb2CfYcQMQxnH71_TMFBCQ3OSDp7Yzh3"/>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6 md:p-8">
              <span className="font-label-caps text-[10px] text-white/60 mb-1 tracking-widest">CATEGORY 01</span>
              <h3 className="font-headline-md text-2xl text-white mb-3">Bridal</h3>
              <button onClick={() => prefillBooking('Signature Bridal Artistry')} className="text-left font-label-caps text-[9px] text-white tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-1.5 hover:underline">
                VIEW DETAILS <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
              </button>
            </div>
          </div>
          
          {/* Chrome */}
          <div className="group relative overflow-hidden aspect-[3/5] bg-surface-container-low md:mt-16 reveal staggered-item shadow-sm hover:shadow-xl rounded-sm">
            <img className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700" alt="Rose gold chrome finish" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBDd5JAbct7N_7MHQs2i7O9Ul2vumzpvITK7AHQ7hteodUUmT6EEc8NLpVToA5-n2-QcP8_sxI9RPFDK6O75EunjICMxJYu-PvbtUKMaz8l40kus_dMWQPIPjNKD6NMqu0Sdp7GYXm0vNYGr98EkOGrnmBOc4A_-2cV1NdJzK6GAHbKrHYLY0cTv4B-zs_dErqt2EspH5IBRtZ9JRxWopeADRDXZDmSyVlNnqSqA8OLlFdctXReP7Rx"/>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6 md:p-8">
              <span className="font-label-caps text-[10px] text-white/60 mb-1 tracking-widest">CATEGORY 02</span>
              <h3 className="font-headline-md text-2xl text-white mb-3">Chrome</h3>
              <button onClick={() => prefillBooking('Mirror Chrome & Metallic Design')} className="text-left font-label-caps text-[9px] text-white tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-1.5 hover:underline">
                VIEW DETAILS <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
              </button>
            </div>
          </div>
          
          {/* Korean */}
          <div className="group relative overflow-hidden aspect-[3/5] bg-surface-container-low reveal staggered-item shadow-sm hover:shadow-xl rounded-sm">
            <img className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700" alt="Korean floral details" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBMQnCCKgRi4Nqpeds0FgBza8MADRAZDhEQ17zQbKqpwDOP1xEfmp7U6hirixjdPkdtDzHGYUIpugZ7A6DjRStlyhzqnsfQdiWOT-3n3WgfuWSVkntb4NdPMBo3ZmRprsezL0-szJL0ay_PrW8Y8BR9aqhcWyLJJUhkNEggOuCB4fCVJWQ1WV-4PMH9Aj-Onm83Tjo3lFXLWhpANJ3MsvKQmt8C88gYdY38IlRMFqp8H7DhPc9of6lP"/>
            <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6 md:p-8">
              <span className="font-label-caps text-[10px] text-white/60 mb-1 tracking-widest">CATEGORY 03</span>
              <h3 className="font-headline-md text-2xl text-white mb-3">Korean</h3>
              <button onClick={() => prefillBooking('Ethereal Korean Gel Artistry')} className="text-left font-label-caps text-[9px] text-white tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-1.5 hover:underline">
                VIEW DETAILS <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
              </button>
            </div>
          </div>
          
          {/* Minimal */}
          <div className="group relative overflow-hidden aspect-[3/5] bg-surface-container-low md:mt-16 reveal staggered-item shadow-sm hover:shadow-xl rounded-sm">
            <img className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700" alt="Minimal negative space style" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDfpMwTtYfyNH-CWcj-KEnBX9cOoGlNaCUny8Z-aCshrLyDcgXcpGykcWizQuj2nM4oIucS_lxNSfvmXAqMU9dcmCPWc8jNaaSjQHlnlcIB7Rvxj-NTl1hPNroL-L9_qsI4NDO1h7TqxqH9ggITJBeYUyBCIm3eaNcZFC1tN4c0nLZpt781vp7HK4f4lRlMwuiMjfF-ravC6QSqnj6QjEp42pN7JJJWGp0K6tegr9QdJyYIlw1ea79Q"/>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6 md:p-8">
              <span className="font-label-caps text-[10px] text-white/60 mb-1 tracking-widest">CATEGORY 04</span>
              <h3 class="font-headline-md text-2xl text-white mb-3">Minimal</h3>
              <button onClick={() => prefillBooking('Minimalist Fine-Line Artistry')} className="text-left font-label-caps text-[9px] text-white tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-1.5 hover:underline">
                VIEW DETAILS <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Luxury Boutique Care Products */}
      <section className="py-section-gap bg-surface-container/30 border-t border-b border-outline-variant/10">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
          <div className="text-center mb-16 space-y-3">
            <span className="font-label-caps text-label-caps text-primary tracking-[0.25em]">VELVET AT HOME</span>
            <h2 className="font-display-lg text-display-lg-mobile md:text-headline-lg text-on-surface">Luxury Care & Press-Ons</h2>
            <p className="font-body-md text-secondary max-w-md mx-auto">Elevate your nail wellness between studio sessions with our curated editorial items.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-background border border-outline-variant/20 p-6 flex flex-col justify-between hover:shadow-lg transition-shadow duration-300 rounded-sm">
              <div>
                <span className="font-label-caps text-[10px] text-primary tracking-widest block mb-2">ACCESSORIES</span>
                <h3 className="font-headline-md text-xl mb-2 text-on-surface">Bespoke Press-On Sizing Kit</h3>
                <p className="font-body-md text-[14px] text-secondary mb-6 leading-relaxed">Find your exact measurements for custom creations. Includes all shapes and buffer.</p>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-body-lg text-[18px] text-primary">$15.00</span>
                <button onClick={() => addToCart(1, 'Bespoke Press-On Sizing Kit', 15.00)} className="bg-primary hover:bg-primary-dark text-white px-5 py-2 font-label-caps text-[10px] tracking-wider transition-colors rounded-sm flex items-center gap-1.5">
                  ADD TO BAG <span className="material-symbols-outlined text-[16px]">shopping_bag</span>
                </button>
              </div>
            </div>
            
            <div className="bg-background border border-outline-variant/20 p-6 flex flex-col justify-between hover:shadow-lg transition-shadow duration-300 rounded-sm">
              <div>
                <span className="font-label-caps text-[10px] text-primary tracking-widest block mb-2">WELLNESS</span>
                <h3 className="font-headline-md text-xl mb-2 text-on-surface">Organic Revitalizing Oil</h3>
                <p className="font-body-md text-[14px] text-secondary mb-6 leading-relaxed">Infused with jasmine, sweet almond oil, and gold leaf flecks to nourish cuticles deeply.</p>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-body-lg text-[18px] text-primary">$28.00</span>
                <button onClick={() => addToCart(2, 'Organic Revitalizing Oil', 28.00)} className="bg-primary hover:bg-primary-dark text-white px-5 py-2 font-label-caps text-[10px] tracking-wider transition-colors rounded-sm flex items-center gap-1.5">
                  ADD TO BAG <span className="material-symbols-outlined text-[16px]">shopping_bag</span>
                </button>
              </div>
            </div>
            
            <div className="bg-background border border-outline-variant/20 p-6 flex flex-col justify-between hover:shadow-lg transition-shadow duration-300 rounded-sm">
              <div>
                <span className="font-label-caps text-[10px] text-primary tracking-widest block mb-2">LIMITED EDITION</span>
                <h3 className="font-headline-md text-xl mb-2 text-on-surface">Velvet Chrome Press-On Set</h3>
                <p class="font-body-md text-[14px] text-secondary mb-6 leading-relaxed">Our iconic rose gold liquid chrome design custom sized, ready to wear.</p>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-body-lg text-[18px] text-primary">$65.00</span>
                <button onClick={() => addToCart(3, 'Velvet Chrome Press-On Set', 65.00)} className="bg-primary hover:bg-primary-dark text-white px-5 py-2 font-label-caps text-[10px] tracking-wider transition-colors rounded-sm flex items-center gap-1.5">
                  ADD TO BAG <span className="material-symbols-outlined text-[16px]">shopping_bag</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Luxury Gallery */}
      <section className="py-section-gap bg-surface-container-lowest" id="gallery">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
          <div className="text-center mb-16 space-y-4">
            <span className="font-label-caps text-label-caps text-primary tracking-[0.3em]">CURATED WORKS</span>
            <h2 className="font-display-lg text-display-lg-mobile md:text-display-lg">The Gallery</h2>
            
            <div className="flex flex-wrap justify-center gap-3 pt-6 font-label-caps text-[10px] tracking-widest text-secondary">
              {['all', 'bridal', 'chrome', 'korean', 'minimal'].map(cat => (
                <button 
                  key={cat} 
                  onClick={() => setGalleryCategory(cat)} 
                  className={`px-6 py-2 border rounded-full transition-all duration-300 uppercase ${galleryCategory === cat ? 'border-primary text-primary bg-primary/5' : 'border-outline-variant/30 hover:border-primary'}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
          
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
            {galleryItems
              .filter(item => galleryCategory === 'all' || item.category === galleryCategory)
              .map(item => (
                <div key={item.id} className="gallery-item break-inside-avoid relative group overflow-hidden ambient-glow cursor-pointer rounded-sm" onClick={() => setLightboxItem(item)}>
                  <img className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700" alt={item.title} src={item.src}/>
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <span className="font-label-caps text-[10px] text-white tracking-widest border border-white/30 px-6 py-3 rounded-full backdrop-blur-sm">VIEW WORK</span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </section>

      {/* Featured Alternating layouts */}
      <section className="py-section-gap px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto overflow-hidden">
        <div className="flex flex-col md:flex-row items-center gap-16 md:gap-32 mb-32">
          <div className="w-full md:w-1/2 reveal">
            <div className="relative group overflow-hidden rounded-sm shadow-xl">
              <img className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-700" alt="Metallic series nails" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBDd5JAbct7N_7MHQs2i7O9Ul2vumzpvITK7AHQ7hteodUUmT6EEc8NLpVToA5-n2-QcP8_sxI9RPFDK6O75EunjICMxJYu-PvbtUKMaz8l40kus_dMWQPIPjNKD6NMqu0Sdp7GYXm0vNYGr98EkOGrnmBOc4A_-2cV1NdJzK6GAHbKrHYLY0cTv4B-zs_dErqt2EspH5IBRtZ9JRxWopeADRDXZDmSyVlNnqSqA8OLlFdctXReP7Rx"/>
            </div>
          </div>
          <div className="w-full md:w-1/2 space-y-6 reveal">
            <span className="font-label-caps text-label-caps text-primary tracking-widest uppercase block">The Metallic Series</span>
            <h3 className="font-headline-lg text-headline-md md:text-display-lg-mobile lg:text-headline-lg">Liquid Light</h3>
            <p className="font-body-lg text-secondary leading-relaxed font-light">
              Our chrome collections are engineered to capture the movement of light across the nail's surface. Achieving a perfect mirror finish requires a meticulous multi-step process that merges chemistry with high-fashion artistry.
            </p>
            <div className="pt-4">
              <button onClick={() => prefillBooking('Mirror Chrome & Metallic Design')} className="font-label-caps text-xs text-primary hover:text-primary-dark tracking-widest border-b border-primary/30 pb-2 transition-all hover:border-primary flex items-center gap-2">
                BOOK METALLIC SESSION <span className="material-symbols-outlined text-sm">chevron_right</span>
              </button>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row-reverse items-center gap-16 md:gap-32">
          <div className="w-full md:w-1/2 reveal">
            <div className="relative group overflow-hidden rounded-sm shadow-xl">
              <img className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-700" alt="Botanical flora nails" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBMQnCCKgRi4Nqpeds0FgBza8MADRAZDhEQ17zQbKqpwDOP1xEfmp7U6hirixjdPkdtDzHGYUIpugZ7A6DjRStlyhzqnsfQdiWOT-3n3WgfuWSVkntb4NdPMBo3ZmRprsezL0-szJL0ay_PrW8Y8BR9aqhcWyLJJUhkNEggOuCB4fCVJWQ1WV-4PMH9Aj-Onm83Tjo3lFXLWhpANJ3MsvKQmt8C88gYdY38IlRMFqp8H7DhPc9of6lP"/>
            </div>
          </div>
          <div className="w-full md:w-1/2 space-y-6 reveal">
            <span className="font-label-caps text-label-caps text-primary tracking-widest uppercase block">The Botanical Archive</span>
            <h3 className="font-headline-lg text-headline-md md:text-display-lg-mobile lg:text-headline-lg">Eternal Spring</h3>
            <p className="font-body-lg text-secondary leading-relaxed font-light">
              Each design in our Botanical collection features authentic pressed flora. It is a celebration of the delicate, ephemeral beauty of nature, preserved in a crystal glass-like finish for a timeless look.
            </p>
            <div className="pt-4">
              <button onClick={() => prefillBooking('Ethereal Korean Gel Artistry')} className="font-label-caps text-xs text-primary hover:text-primary-dark tracking-widest border-b border-primary/30 pb-2 transition-all hover:border-primary flex items-center gap-2">
                BOOK BOTANICAL SESSION <span className="material-symbols-outlined text-sm">chevron_right</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-section-gap bg-surface-container-low" id="about">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
          <div className="reveal">
            <div className="relative group">
              <div className="absolute inset-0 border border-primary/20 translate-x-4 translate-y-4 rounded-sm transition-transform duration-500 group-hover:translate-x-2 group-hover:translate-y-2"></div>
              <img className="w-full aspect-[4/5] object-cover rounded-sm shadow-2xl relative z-10 transition-transform duration-500 group-hover:-translate-x-1 group-hover:-translate-y-1" alt="Studio owner portrait" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCn1dGXK8VQLy-ZtG9IewGo_bfYMpZpcLozWCzPyrzKXdaJPV_5HWKL9E5VNr0VTwZmhrSzRIJ5ZVM-RNIuvr0gxLo9Bu06zfDo-RtlcvX00AF8IqgpwAMoqP0BdSXfz1Z65ICAcI_Ab0sHNJsrjM9ewRzBSbOir-KSVCJ7f-XZMTLLc6iXaowiyz6LPAyFLkMY6wVqENM4tuDl7904L-DZWkC2VsY6rDx0VZtTERn2dS0Idh806C1J"/>
            </div>
          </div>
          <div className="space-y-8 reveal">
            <span className="font-label-caps text-label-caps text-primary tracking-widest block">THE CREATIVE MIND</span>
            <h2 className="font-display-lg text-display-lg-mobile md:text-display-lg text-primary">The Vision</h2>
            <div className="h-px w-24 bg-primary/30"></div>
            <p className="font-body-lg text-on-surface-variant italic leading-relaxed font-light">
              "I believe nail art is the most intimate form of self-expression. It is a canvas that moves with you, reflecting your rhythm and your grace. At Velvet Nails, we don't just apply polish; we curate a feeling of quiet confidence and effortless luxury."
            </p>
            <p className="font-body-md text-secondary leading-relaxed">
              Founded on the principles of minimalist editorial design, Velvet Nails has become a sanctuary for those seeking refined craftsmanship and a modern aesthetic. Each session is a collaborative journey into the world of high-fashion artistry, utilizing only premium non-toxic Japanese gels and custom-cast charms.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-section-gap max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop border-b border-outline-variant/10">
        <div className="text-center mb-16 space-y-3">
          <span className="font-label-caps text-label-caps text-primary tracking-[0.2em] block">STUDIO POLICIES</span>
          <h3 className="font-headline-lg text-3xl md:text-4xl text-on-surface">Frequently Asked Questions</h3>
        </div>
        
        <div className="max-w-3xl mx-auto space-y-4">
          {[
            {
              q: "How do I choose the correct size for custom press-ons?",
              a: "We highly recommend ordering a Bespoke Sizing Kit first. Alternatively, you can measure your nails with clear tape and a millimeter ruler. Details on our measuring guide are sent via email with every inquiry."
            },
            {
              q: "What is your cancellation and booking policy?",
              a: "We require at least 48 hours notice for rescheduling or cancellations. Bookings cancelled within 48 hours are subject to a 50% fee. Deposits for custom press-on orders are non-refundable once production begins."
            },
            {
              q: "How long do the press-ons last?",
              a: "With adhesive tabs, they last 1-3 days (perfect for events). With our professional-grade nail glue and proper preparation, they can last up to 2-3 weeks. Our sets are fully reusable if removed correctly."
            }
          ].map((faq, idx) => (
            <div key={idx} className={`border-b border-outline-variant/20 relative ${faqOpenIndex === idx ? 'faq-active' : ''}`}>
              <div 
                className="faq-trigger flex justify-between items-center py-5 cursor-pointer select-none"
                onClick={() => setFaqOpenIndex(faqOpenIndex === idx ? null : idx)}
              >
                <span className="font-body-md font-medium text-on-surface">{faq.q}</span>
                <svg className="faq-trigger-icon w-4 h-4 text-primary transform transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/></svg>
              </div>
              <div className="faq-drawer text-secondary text-sm leading-relaxed">
                <p>{faq.a}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Instagram Grid */}
      <section className="py-section-gap px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto text-center">
        <div className="mb-16 space-y-2 reveal">
          <span className="font-label-caps text-label-caps text-primary tracking-widest block">FOLLOW THE JOURNEY</span>
          <h3 className="font-headline-md text-secondary">@VELVET_NAILS</h3>
        </div>
        
        <div className="grid grid-cols-3 md:grid-cols-9 gap-2 md:gap-4 reveal">
          {[
            { src: "https://lh3.googleusercontent.com/aida-public/AB6AXuDLxxD5Vs0jibKHYeVVZIv2_UpToIX0ZtaemAuDYXBQbqpVyiflkBHjPmcesVlNHeSIzo-JuBlePRlKn0nCvQh9vKQa8VitN0N10hOvufYKXbN6Yrj8fGOmUaDDQhzOqAtgsttw1fZCqQTSQxBvoeeI6tdAz7-HqFr_zcZ2bIlUy_xY-rRgBDh5I8lN_2jiU95W8y-59ry5zdfShd1Br5twYMXzhENW3bmNwGOXEEkaclHZmtbJuCaP", likes: "1.2k" },
            { src: "https://lh3.googleusercontent.com/aida-public/AB6AXuChS6qvMRUdQrpaq4LktSYjE4jtU7CKSOBMIuZV-JnYTlONfI5sRkB9evhD1xa_6XuGQFpF5WKCahUmpY4wwKgJG_cLA9SpgH_fXC4wgU2wAWgZuDUdKFStDcnLvG-4z4y9Q07Yj0Lp5gOTiB6uYZw5B7Pg-lFutbPEAJxRCv3zkBcKLuiidqD72OZnQkamfBvkUDCk-2uION23RaQyTAn7odamiFapihofNG4v3o9_xgGzlLMYDNip", likes: "945" },
            { src: "https://lh3.googleusercontent.com/aida-public/AB6AXuDKcuL3r2_SxTH-CnIHFwQWuZxTxTBUMktifGvHpp9zbYdizwBDeCxXCsvw2bmo8V08nMlJJhuXbpbesBlNzCTqYjdcYfge5t7X0bqfLftVawtadWaBLpcfuoEzm-K7VdR2vz2FGyWj0wCiwfIfon4IPBT5uK9b3j2VrocdkSlafM2qDlf4BRaKEOnDQN5EPlPASf02yjnmlGF73D-6ZxXNyoKu5ES1xLBOmeAWhM26U79EVcmBxiT7", likes: "2.1k" },
            { src: "https://lh3.googleusercontent.com/aida-public/AB6AXuBZTtCu_1F7kAzzvEaoB2twvpCbPutyxls550GACxBpfm0U0t9fk3tGSgeOetMzF7POHUYgnLAHFpOIO45iKNxxDNp3MnjFrwXWmdLIIoCOMUqoAFYk0Eeiztx9Ld2h13CcmfVhRPjsK0oAXuywmG23pcIbSQbxt4eSZhA23n6faKUS42ZsThB7n2cpdPDZFVEf0n-2-7j31f-D4j2P3jjE9WAd78dt_X23Dx8CI2uWtw2wtjudT_Ay", likes: "1.8k" },
            { src: "https://lh3.googleusercontent.com/aida-public/AB6AXuAEurUMKVghQk6PXXQGeFnA4be-_--8XdrmY0saGGcoGYGm-vU3O60fOQZ2mcambWiUvUIzo4i7W_dQdi-ue5oUcPNh5FY3Cf25YONkP6r8TyRK6iXetexRkHGV35c8Q1zQQLwWVcAmLyQCO_eL1WZTIwuXHVAvEJTGj7v2vEbT1oxN-gbhi4mFkTFP_zc1yTonHAUIuyEsXRHkrfFUP-0UFlP03IUVuv3TcAeJBYFGTS46MY9k1VWP", likes: "1.1k" },
            { src: "https://lh3.googleusercontent.com/aida-public/AB6AXuB1MPFFWhXVIszH9BpTrPdvp4h5zuat0AWYRKrs4nNgSNQLc-Hd0UPfr2tttxQIQg58gCOGkRtcT4gTjnylNSGOa6Geb-n5_EEWOwK4oCe61d2QP_mmLcc4J4W5nT_Ne3_kdMIpkLTAP6Jo44k1Xg5aLd-r8oeowDotevPh6bwIHsuZValixlvqYfxpXf6tel4zzGv0fDuq4Iz8xn53znJcVFPBug4wluZ1H0c6cKCTEavlfWQecvHc", likes: "890" },
            { src: "https://lh3.googleusercontent.com/aida-public/AB6AXuCE4-mXLMUejE3ENhtXhPDi9HBwslIqXtTxF8qI_mevqk14ka3A3qN4vHE97-3tdpgcvDwLDKtV_2oL1IjDkjTVApcy7iSDhJEn1oIXJQv5gf2olEqskbklG-hxVjdDX76ikgGMVdRhLnd4L6GG0lQ5nU-JXZu6cIJod-Tmw8mTbF32NFkuI-lo47jmI8zDISvlmPV3nJoibFsWCMCnrwphgy_9xFJ5rTYfRNsQ3aGDd9Nr-2XKLXdY", likes: "1.4k" },
            { src: "https://lh3.googleusercontent.com/aida-public/AB6AXuBK1dwnfd7IVjwWNaB5tVzVl6DR-fnmxaYV99M5B3PFwPFWZ3vAWRbLcGAEMN1pgYLMpclxOoGgJ-k_sPLT9Ky3ZU7CD2s8BqeGB50Au2x6fRPEphJfA0ihoFLV0eo-z8tRSNvZAOaWsT3Y_nllX3PebHC2DvSu8cnSyofSVRR1lmhsfuPNIHVUldb6qcxK1sXqB_egi704NVZhej01ukC7bpE3YOWBcM71rFsYJ3kJYUrqiWGuU695", likes: "2.5k" },
            { src: "https://lh3.googleusercontent.com/aida-public/AB6AXuACGA8qmusLXBMzLTjSvEYzzK1Ahmtci4kBXDfb83Kr2vNPaTEdaOEhfrXJ9zbWIjky2_zJ_KX6A8WIMqO47ldYN1buv_NVGXLItKWSjuG5CBe2MPgsWOdfrA6PZa2h1Ug_Y_Wy12X8RO0TJAqRe5kGIkZM4Q9l-XikL8EjeVJ877sj6a3JpllguGpl4_E6PjKDkjHJGHZQr7wMdtOhGYZjPEDiMoV4FSmWIZUWrx7YWJh4rqbUe7B5", likes: "3.1k" }
          ].map((ig, idx) => (
            <div key={idx} className="aspect-square bg-surface-container overflow-hidden rounded-sm group relative cursor-pointer">
              <img className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" alt="Instagram post" src={ig.src}/>
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs gap-1 font-semibold">
                <span>❤️ {ig.likes}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full py-section-gap bg-surface-container-lowest border-t border-outline-variant/20">
        <div className="flex flex-col md:flex-row justify-between items-start px-6 md:px-margin-desktop gap-12 max-w-container-max mx-auto">
          <div className="flex flex-col items-center md:items-start gap-4 max-w-xs w-full">
            <img alt="VELVET NAILS Logo" className="h-10 w-auto opacity-80" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDxd_knI4-mk2A2gdQw7iPqHP-nTH5S4AbvLt_40LPxYWVZhcHtKwVpNZj5ASQaLja_6vjn_FqM00ldkdFJnu86l8kpEVZ5X7CocnaXsQQDjWkpbrlW2pMVVmVIhm5FxnFjxyCGPmciTQZfgwM3CaJyoclVKSpTCloHZHhA6nPINZR2rzil2fBCYVAi7TZnlc4aDwBE7w1ulRTAWrjVnz0AUo9liDzkGSKEMVEoxMUBG0UkHcXT32Li"/>
            <p className="font-label-caps text-[9px] text-on-surface-variant tracking-[0.2em] text-center md:text-left leading-relaxed">
              ESTABLISHED 2024. CRAFTED FOR THE MODERN ARTISAN.
            </p>
            <p className="font-body-md text-xs text-secondary/70 mt-2 text-center md:text-left">
              A sanctuary dedicated to clean, non-toxic luxury nail styling.
            </p>
          </div>
          
          <div className="flex flex-wrap md:flex-nowrap gap-16 w-full md:w-auto">
            <div className="space-y-4 min-w-[120px]">
              <h4 className="font-label-caps text-label-caps text-primary tracking-widest">NAVIGATION</h4>
              <ul className="space-y-2 font-label-caps text-[10px] text-on-surface-variant">
                <li><a href="#collections" className="hover:text-primary transition-colors">COLLECTIONS</a></li>
                <li><a href="#gallery" className="hover:text-primary transition-colors">THE GALLERY</a></li>
                <li><a href="#about" className="hover:text-primary transition-colors">OUR STUDIO</a></li>
                <li><button onClick={() => setIsBookingOpen(true)} className="hover:text-primary transition-colors text-left">APPOINTMENTS</button></li>
              </ul>
            </div>
            <div className="space-y-4 min-w-[120px]">
              <h4 class="font-label-caps text-label-caps text-primary tracking-widest">CONNECT</h4>
              <ul className="space-y-2 font-label-caps text-[10px] text-on-surface-variant">
                <li><a href="#" className="hover:text-primary transition-colors">INSTAGRAM</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">PINTEREST</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">JOURNAL</a></li>
              </ul>
            </div>
          </div>
          
          <div className="w-full md:max-w-xs space-y-4">
            <h4 className="font-label-caps text-label-caps text-primary tracking-widest">THE VELVET LIST</h4>
            <p className="font-body-md text-xs text-secondary leading-relaxed">Subscribe for seasonal collections, event invites, and private booking openings.</p>
            <form onSubmit={handleSubscribe} className="flex border-b border-primary/30 py-2 focus-within:border-primary transition-colors">
              <input 
                type="email" 
                value={newsletterEmail} 
                onChange={(e) => setNewsletterEmail(e.target.value)} 
                placeholder="Your email address" 
                required 
                className="bg-transparent border-none outline-none text-xs w-full py-1 text-on-background placeholder:text-outline/70 focus:ring-0 px-0"
              />
              <button type="submit" className="font-label-caps text-[10px] text-primary hover:text-primary-dark tracking-widest font-bold px-2 uppercase focus:outline-none">JOIN</button>
            </form>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-center px-6 md:px-margin-desktop mt-16 pt-8 border-t border-outline-variant/10 max-w-container-max mx-auto gap-4">
          <p className="font-label-caps text-[10px] text-secondary">© 2024 VELVET NAILS.</p>
          <p className="font-label-caps text-[9px] text-outline tracking-widest uppercase">ALL RIGHTS RESERVED. DESIGNED FOR QUIET LUXURY.</p>
        </div>
      </footer>

      {/* Cart Drawer Sidebar */}
      <div className={`fixed inset-0 z-50 transition-all duration-500 overflow-hidden ${isCartOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}>
        <div className={`absolute inset-0 bg-black/40 transition-opacity duration-500 ${isCartOpen ? 'opacity-100' : 'opacity-0'}`} onClick={closeCart}></div>
        <div className={`absolute top-0 right-0 bottom-0 w-96 max-w-[90vw] bg-background shadow-2xl flex flex-col p-6 transition-transform duration-500 ease-in-out ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="flex justify-between items-center pb-6 border-b border-outline-variant/10">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-xl">shopping_bag</span>
              <h3 className="font-headline-md text-lg font-medium text-on-surface">Your Bag</h3>
            </div>
            <button onClick={closeCart} className="p-2 rounded-full hover:bg-primary/5 transition-colors focus:outline-none" aria-label="Close Bag">
              <svg className="w-5 h-5 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto py-6 space-y-6 custom-scrollbar pr-2 relative">
            {isCheckoutSuccess ? (
              <div className="absolute inset-0 bg-background flex flex-col items-center justify-center text-center p-6 space-y-6">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary mx-auto">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/></svg>
                </div>
                <div className="space-y-2">
                  <h3 className="font-headline-md text-2xl text-on-surface">Order Confirmed</h3>
                  <p className="font-body-md text-xs text-secondary leading-relaxed">Thank you for your purchase. We are preparing your custom care kit. Shipping confirmation details have been sent.</p>
                </div>
                <button onClick={closeCart} className="w-full bg-primary hover:bg-primary-dark text-white font-label-caps text-xs py-4 tracking-widest transition-colors rounded-sm shadow-md">
                  RETURN TO GALLERY
                </button>
              </div>
            ) : cart.length === 0 ? (
              <div className="text-center py-20 space-y-4">
                <span className="material-symbols-outlined text-outline text-5xl font-light">shopping_bag</span>
                <p className="font-body-md text-secondary">Your shopping bag is currently empty.</p>
                <button onClick={closeCart} className="inline-block border border-primary/20 text-primary hover:bg-primary hover:text-white px-6 py-2.5 rounded-full font-label-caps text-[9px] tracking-widest transition-all duration-300">
                  CONTINUE BROWSING
                </button>
              </div>
            ) : (
              cart.map(item => (
                <div key={item.id} className="flex justify-between items-start gap-4 border-b border-outline-variant/10 pb-4">
                  <div className="flex-1 space-y-1">
                    <h4 className="font-body-md font-semibold text-sm text-on-surface">{item.name}</h4>
                    <p className="text-xs text-secondary font-light">${item.price.toFixed(2)} each</p>
                    
                    <div className="flex items-center gap-3 pt-2">
                      <button onClick={() => updateCartQty(item.id, -1)} className="w-6 h-6 flex items-center justify-center border border-outline-variant/30 hover:border-primary text-secondary hover:text-primary rounded-full transition-colors font-bold text-xs">-</button>
                      <span className="text-xs font-semibold text-on-surface">{item.qty}</span>
                      <button onClick={() => updateCartQty(item.id, 1)} className="w-6 h-6 flex items-center justify-center border border-outline-variant/30 hover:border-primary text-secondary hover:text-primary rounded-full transition-colors font-bold text-xs">+</button>
                    </div>
                  </div>
                  <div className="text-right space-y-1">
                    <span className="font-body-lg text-primary text-sm font-semibold block">${(item.price * item.qty).toFixed(2)}</span>
                    <button onClick={() => updateCartQty(item.id, -item.qty)} className="text-[10px] text-outline hover:text-error hover:underline transition-colors tracking-wide uppercase font-semibold">REMOVE</button>
                  </div>
                </div>
              ))
            )}
          </div>
          
          {cart.length > 0 && !isCheckoutSuccess && (
            <div className="border-t border-outline-variant/10 pt-6 space-y-4">
              <div className="flex justify-between items-center text-sm font-label-caps text-secondary">
                <span>SUBTOTAL</span>
                <span className="text-base text-primary font-bold">${cartSubtotal.toFixed(2)}</span>
              </div>
              <p className="text-[10px] text-outline leading-relaxed">Tax & shipping calculated at checkout. Enjoy complimentary shipping on orders over $100.</p>
              <button onClick={handleCheckout} className="w-full bg-primary hover:bg-primary-dark text-white font-label-caps text-xs py-4 tracking-widest transition-all duration-300 rounded-sm shadow-md">
                PROCEED TO CHECKOUT
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Booking Stepper Modal */}
      <div className={`fixed inset-0 z-50 transition-all duration-500 overflow-hidden flex items-center justify-center p-4 md:p-6 ${isBookingOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}>
        <div className={`absolute inset-0 bg-black/50 transition-opacity duration-500 ${isBookingOpen ? 'opacity-100' : 'opacity-0'}`} onClick={() => setIsBookingOpen(false)}></div>
        
        <div className={`relative w-full max-w-xl bg-background rounded-sm shadow-2xl flex flex-col max-h-[90vh] transition-all duration-500 ease-out overflow-hidden ${isBookingOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
          <button onClick={() => setIsBookingOpen(false)} className="absolute top-5 right-5 p-2 rounded-full hover:bg-primary/5 transition-colors focus:outline-none z-10" aria-label="Close Modal">
            <svg className="w-5 h-5 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
          
          <div className="p-6 md:p-8 border-b border-outline-variant/10 bg-surface-container-low/50">
            <h3 className="font-headline-md text-xl text-primary mb-4">Book Your Session</h3>
            <div className="flex items-center justify-between text-[10px] font-label-caps text-outline tracking-wider relative pt-2">
              <div className="absolute top-0.5 left-0 right-0 h-[2px] bg-outline-variant/30 z-0">
                <div className="h-full bg-primary transition-all duration-500" style={{ width: `${(bookingStep - 1) * 50}%` }}></div>
              </div>
              <div className="flex flex-col items-center gap-1 z-10">
                <span className={`w-4 h-4 rounded-full border-4 border-white shadow-sm flex items-center justify-center transition-colors ${bookingStep >= 1 ? 'bg-primary' : 'bg-outline-variant/30'}`}></span>
                <span className={bookingStep === 1 ? "text-primary font-semibold" : ""}>1. SERVICE</span>
              </div>
              <div className="flex flex-col items-center gap-1 z-10">
                <span className={`w-4 h-4 rounded-full border-4 border-white shadow-sm flex items-center justify-center transition-colors ${bookingStep >= 2 ? 'bg-primary' : 'bg-outline-variant/30'}`}></span>
                <span className={bookingStep === 2 ? "text-primary font-semibold" : ""}>2. DATE & TIME</span>
              </div>
              <div className="flex flex-col items-center gap-1 z-10">
                <span className={`w-4 h-4 rounded-full border-4 border-white shadow-sm flex items-center justify-center transition-colors ${bookingStep >= 3 ? 'bg-primary' : 'bg-outline-variant/30'}`}></span>
                <span className={bookingStep === 3 ? "text-primary font-semibold" : ""}>3. DETAILS</span>
              </div>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar">
            {/* Step 1 */}
            {bookingStep === 1 && (
              <div className="space-y-4">
                <p className="font-body-md text-xs text-secondary pb-2">Select a signature curation. Each appointment includes an editorial manicure and nourishing hand massage.</p>
                <div className="space-y-3">
                  {Object.entries(servicesMap).map(([service, price]) => (
                    <label key={service} className="flex justify-between items-center p-4 border border-outline-variant/35 rounded-sm hover:border-primary cursor-pointer transition-colors bg-white">
                      <div className="flex items-start gap-3">
                        <input 
                          type="radio" 
                          name="booking-service" 
                          value={service} 
                          checked={selectedService === service}
                          onChange={(e) => setSelectedService(e.target.value)}
                          className="text-primary focus:ring-primary border-outline/50 mt-1"
                        />
                        <div>
                          <span className="font-body-md font-semibold text-on-surface block">{service}</span>
                          <span className="text-xs text-secondary font-light">Custom 3D gel design overlays. (90-120 mins)</span>
                        </div>
                      </div>
                      <span className="font-body-lg text-primary font-semibold text-sm">${price}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
            
            {/* Step 2 */}
            {bookingStep === 2 && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="block font-label-caps text-[10px] text-primary tracking-widest">SELECT DATE</label>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { key: "Jul 16", day: "THU", num: "16" },
                      { key: "Jul 17", day: "FRI", num: "17" },
                      { key: "Jul 18", day: "SAT", num: "18" },
                      { key: "Jul 20", day: "MON", num: "20" }
                    ].map(d => (
                      <label key={d.key} className={`border rounded-sm p-3 text-center cursor-pointer block transition-colors ${selectedDate === d.key ? 'border-primary bg-primary/5' : 'border-outline-variant/35 bg-white hover:border-primary'}`}>
                        <input type="radio" name="booking-date" value={d.key} checked={selectedDate === d.key} onChange={() => setSelectedDate(d.key)} className="sr-only"/>
                        <span className="block text-[10px] text-outline font-semibold">{d.day}</span>
                        <span className="block text-lg font-bold text-on-surface">{d.num}</span>
                        <span className="block text-[9px] text-secondary">JULY</span>
                      </label>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="block font-label-caps text-[10px] text-primary tracking-widest">SELECT TIME SLOT</label>
                  <div className="grid grid-cols-3 gap-2">
                    {["10:00 AM", "1:00 PM", "4:00 PM"].map(time => (
                      <label key={time} className={`border rounded-sm py-3 text-center cursor-pointer block transition-colors ${selectedTime === time ? 'border-primary bg-primary/5' : 'border-outline-variant/35 bg-white hover:border-primary'}`}>
                        <input type="radio" name="booking-time" value={time} checked={selectedTime === time} onChange={() => setSelectedTime(time)} className="sr-only"/>
                        <span className="block text-xs font-semibold text-on-surface">{time}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            {/* Step 3 */}
            {bookingStep === 3 && (
              <form id="booking-details-form" onSubmit={handleBookingSubmit} className="space-y-4">
                <div>
                  <label htmlFor="b-name" className="block font-label-caps text-[9px] tracking-widest text-secondary mb-1">YOUR FULL NAME</label>
                  <input type="text" id="b-name" value={bName} onChange={(e) => setBName(e.target.value)} required className="w-full border-outline-variant/30 focus:border-primary rounded-sm text-sm py-2 px-3 focus:ring-0" placeholder="Eleanor Vance"/>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="b-email" className="block font-label-caps text-[9px] tracking-widest text-secondary mb-1">EMAIL ADDRESS</label>
                    <input type="email" id="b-email" value={bEmail} onChange={(e) => setBEmail(e.target.value)} required className="w-full border-outline-variant/30 focus:border-primary rounded-sm text-sm py-2 px-3 focus:ring-0" placeholder="eleanor@vance.com"/>
                  </div>
                  <div>
                    <label htmlFor="b-phone" className="block font-label-caps text-[9px] tracking-widest text-secondary mb-1">PHONE NUMBER</label>
                    <input type="tel" id="b-phone" value={bPhone} onChange={(e) => setBPhone(e.target.value)} required className="w-full border-outline-variant/30 focus:border-primary rounded-sm text-sm py-2 px-3 focus:ring-0" placeholder="(555) 019-2834"/>
                  </div>
                </div>
                <div>
                  <label htmlFor="b-notes" class="block font-label-caps text-[9px] tracking-widest text-secondary mb-1">SPECIAL NOTES</label>
                  <textarea id="b-notes" rows="2" value={bNotes} onChange={(e) => setBNotes(e.target.value)} className="w-full border-outline-variant/30 focus:border-primary rounded-sm text-sm py-2 px-3 focus:ring-0" placeholder="Almond shape preferred..."></textarea>
                </div>
                
                <div className="bg-surface-container-low p-4 border border-outline-variant/10 rounded-sm space-y-2 mt-4">
                  <div className="flex justify-between items-center text-xs font-semibold text-primary">
                    <span>SUMMARY</span>
                    <span>${(servicesMap[selectedService] || 0.00).toFixed(2)}</span>
                  </div>
                  <div className="text-[11px] text-secondary space-y-1">
                    <p><strong>Service:</strong> {selectedService}</p>
                    <p><strong>Date/Time:</strong> {selectedDate} at {selectedTime}</p>
                  </div>
                </div>
                <button type="submit" id="submit-hidden-trigger" className="hidden"></button>
              </form>
            )}
            
            {/* Step 4 */}
            {bookingStep === 4 && (
              <div className="text-center py-10 space-y-6">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto text-primary">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/></svg>
                </div>
                <div className="space-y-2">
                  <h4 className="font-headline-md text-2xl text-on-surface">Appointment Secured</h4>
                  <p className="font-body-md text-xs text-secondary">Your booking has been registered. A confirmation email and calendar invite has been sent to your address.</p>
                </div>
                <div className="bg-surface-container-low p-4 max-w-sm mx-auto border border-outline-variant/10 rounded-sm">
                  <p className="font-label-caps text-[10px] text-outline">BOOKING REFERENCE</p>
                  <p className="font-display-lg text-lg font-bold text-primary tracking-widest mt-1">{bookingRef}</p>
                </div>
                <button onClick={() => setIsBookingOpen(false)} className="inline-block border border-primary/20 text-primary hover:bg-primary hover:text-white px-8 py-3 rounded-full font-label-caps text-[9px] tracking-widest transition-all duration-300">
                  DONE
                </button>
              </div>
            )}
          </div>
          
          {bookingStep < 4 && (
            <div className="p-6 md:p-8 border-t border-outline-variant/10 bg-surface-container-low/30 flex justify-between">
              <button 
                onClick={() => setBookingStep(prev => prev - 1)} 
                disabled={bookingStep === 1}
                className={`px-6 py-2 border border-outline-variant/40 rounded-full font-label-caps text-[9px] tracking-widest text-secondary hover:text-primary transition-all duration-300 ${bookingStep === 1 ? 'opacity-0 pointer-events-none' : ''}`}
              >
                BACK
              </button>
              <button 
                onClick={() => {
                  if (bookingStep === 3) {
                    document.getElementById('submit-hidden-trigger').click();
                  } else {
                    setBookingStep(prev => prev + 1);
                  }
                }}
                className="px-8 py-2.5 bg-primary hover:bg-primary-dark text-white rounded-full font-label-caps text-[9px] tracking-widest transition-colors shadow-md"
              >
                {bookingStep === 3 ? "CONFIRM APPOINTMENT" : "CONTINUE"}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Lightbox Modal */}
      {lightboxItem && (
        <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-4 md:p-6">
          <div className="absolute inset-0 bg-black/90 opacity-100 pointer-events-auto" onClick={() => setLightboxItem(null)}></div>
          
          <div className="relative max-w-4xl w-full bg-background rounded-sm shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2 z-10 max-h-[90vh] md:max-h-[80vh]">
            <button onClick={() => setLightboxItem(null)} className="absolute top-4 right-4 p-2 rounded-full bg-black/20 hover:bg-black/40 text-white z-10 transition-colors focus:outline-none" aria-label="Close Lightbox">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
            
            <div className="relative bg-surface-container flex items-center justify-center h-[40vh] md:h-full">
              <img className="w-full h-full object-cover" src={lightboxItem.src} alt={lightboxItem.title}/>
            </div>
            
            <div className="p-8 flex flex-col justify-between overflow-y-auto custom-scrollbar bg-background">
              <div className="space-y-6">
                <div>
                  <span className="font-label-caps text-[10px] text-primary tracking-widest block mb-2">{lightboxItem.category.toUpperCase()} ARTISTRY</span>
                  <h3 className="font-headline-md text-2xl text-on-surface">{lightboxItem.title}</h3>
                </div>
                <div className="h-px w-16 bg-primary/20"></div>
                <p className="font-body-md text-sm text-secondary leading-relaxed">{lightboxItem.desc}</p>
                
                <div className="bg-surface-container-low p-4 border border-outline-variant/10 rounded-sm">
                  <h4 className="font-label-caps text-[9px] text-outline mb-2">INCLUDED TECHNIQUES</h4>
                  <ul className="text-xs text-secondary space-y-1.5 list-disc pl-4 font-light">
                    <li>Premium non-toxic Japanese base coat structure</li>
                    <li>High-precision custom gel color mixing</li>
                    <li>High-gloss mirror top coat protection</li>
                  </ul>
                </div>
              </div>
              
              <div className="pt-8">
                <button onClick={triggerLightboxBooking} className="w-full bg-primary hover:bg-primary-dark text-white font-label-caps text-xs py-4 tracking-widest transition-colors rounded-sm shadow-md flex items-center justify-center gap-2">
                  BOOK THIS LOOK <span className="material-symbols-outlined text-[16px]">calendar_today</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
