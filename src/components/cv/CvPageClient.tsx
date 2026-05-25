'use client';

import { useEffect } from 'react';

export function CvPageClient() {
  useEffect(() => {
    const menu = document.getElementById('mobileMenu');
    const burger = document.getElementById('burgerMenu');
    const scrollTop = document.getElementById('scrollTop');
    const header = document.getElementById('header');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg') as HTMLImageElement | null;
    const certificates = document.getElementById('certificatesList');

    const onScroll = () => {
      header?.classList.toggle('scrolled', window.scrollY > 50);
      scrollTop?.classList.toggle('visible', window.scrollY > 400);
    };

    const onBurgerClick = () => menu?.classList.toggle('active');
    const onMenuClick = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target.closest('.mobile-nav-link')) menu?.classList.remove('active');
    };
    const onTopClick = () => window.scrollTo({ top: 0, behavior: 'smooth' });

    const onCertClick = (e: Event) => {
      const target = e.target as HTMLElement;
      const card = target.closest('.cert-card');
      if (!card || !lightbox || !lightboxImg) return;
      const img = card.querySelector('.cert-img') as HTMLImageElement | null;
      if (!img) return;
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt;
      lightbox.classList.add('active');
    };

    const onEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') lightbox?.classList.remove('active');
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('section').forEach((section) => {
      section.classList.remove('visible');
      observer.observe(section);
    });

    window.addEventListener('scroll', onScroll);
    burger?.addEventListener('click', onBurgerClick);
    menu?.addEventListener('click', onMenuClick);
    scrollTop?.addEventListener('click', onTopClick);
    certificates?.addEventListener('click', onCertClick);
    lightbox?.addEventListener('click', () => lightbox.classList.remove('active'));
    document.addEventListener('keydown', onEscape);
    onScroll();

    return () => {
      window.removeEventListener('scroll', onScroll);
      burger?.removeEventListener('click', onBurgerClick);
      menu?.removeEventListener('click', onMenuClick);
      scrollTop?.removeEventListener('click', onTopClick);
      certificates?.removeEventListener('click', onCertClick);
      document.removeEventListener('keydown', onEscape);
      observer.disconnect();
    };
  }, []);

  return null;
}
