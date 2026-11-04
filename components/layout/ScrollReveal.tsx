'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

export function ScrollReveal() {
  const pathname = usePathname()

  useEffect(() => {
    // Respect reduced motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return
    }

    const targets = document.querySelectorAll(
      '.path-section, .features-section, .testimonials-section, .blog-section, .cta-section, .bento-card, .testimonial-card'
    )

    targets.forEach(el => {
      if (!el.classList.contains('reveal')) {
        el.classList.add('reveal')
      }
    })

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed')
            observer.unobserve(entry.target)
          }
        })
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px',
      }
    )

    targets.forEach(el => observer.observe(el))

    return () => {
      observer.disconnect()
    }
  }, [pathname])

  return null
}
