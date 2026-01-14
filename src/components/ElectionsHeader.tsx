import { Link } from '@tanstack/react-router'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { Button } from './ui/button'
import { useI18n } from '../lib/i18n'
import { LanguageSwitcher } from './LanguageSwitcher'

export function ElectionsHeader() {
  const [isOpen, setIsOpen] = useState(false)
  const t = useI18n()

  const navItems = [
    { label: t.nav.home, to: '/' },
    { label: t.nav.candidates, to: '/candidates' },
    { label: t.nav.compare, to: '/compare' },
    { label: t.nav.methodology, to: '/methodology' },
  ]

  return (
    <>
      <header className="glass sticky top-0 z-50 border-b border-[var(--border)]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            <div className="flex items-center gap-8 md:gap-12">
              <Link to="/" className="font-display font-bold text-2xl md:text-3xl" style={{ color: '#00205B' }}>
                cr-elige
              </Link>
              <nav className="hidden md:flex gap-8">
                {navItems.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    className="text-sm font-medium text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-0.5 after:bg-[#EF3340] after:transition-all hover:after:w-full"
                    activeProps={{
                      className: 'text-[var(--foreground)] font-semibold after:content-[""] after:absolute after:-bottom-1 after:left-0 after:w-full after:h-0.5 after:bg-[#EF3340]',
                    }}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden sm:block">
                <LanguageSwitcher />
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setIsOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div
        className={`fixed inset-0 z-50 md:hidden transition-opacity duration-200 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="fixed inset-0 bg-black/40" onClick={() => setIsOpen(false)} />
        <div className={`fixed right-0 top-0 h-full w-80 bg-white p-6 shadow-2xl transform transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}>
          <div className="flex items-center justify-between mb-8">
            <span className="font-display text-lg font-bold">Menu</span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          <nav className="flex flex-col gap-2">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setIsOpen(false)}
                className="text-base font-medium text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--accent)] px-4 py-3 rounded-lg transition-colors"
                activeProps={{
                  className: 'text-[var(--foreground)] font-semibold bg-[var(--accent)]',
                }}
              >
                {item.label}
              </Link>
            ))}
            <div className="pt-4 border-t border-[var(--border)]">
              <LanguageSwitcher />
            </div>
          </nav>
        </div>
      </div>
    </>
  )
}
