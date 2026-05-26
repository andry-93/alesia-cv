'use client';

export function MobileMenuCloseButton() {
  return (
    <button 
      className="mobile-menu-close" 
      onClick={() => document.getElementById('mobileMenu')?.classList.remove('active')} 
      aria-label="Close menu"
    >
      <i className="fas fa-times"></i>
    </button>
  );
}
