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
      <header className="border-b bg-white sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <Link to="/" className="text-xl font-bold text-gray-900">
                cr-elige
              </Link>
              <nav className="hidden md:flex gap-6">
                {navItems.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                    activeProps={{
                      className: 'text-gray-900 font-semibold',
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
        className={`fixed inset-0 z-50 md:hidden ${
          isOpen ? 'block' : 'hidden'
        }`}
      >
        <div className="fixed inset-0 bg-black/50" onClick={() => setIsOpen(false)} />
        <div className="fixed right-0 top-0 h-full w-64 bg-white p-6 shadow-lg">
          <div className="flex items-center justify-between mb-8">
            <span className="text-lg font-bold">Menu</span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          <nav className="flex flex-col gap-4">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setIsOpen(false)}
                className="text-base font-medium text-gray-700 hover:text-gray-900"
                activeProps={{
                  className: 'text-gray-900 font-semibold',
                }}
              >
                {item.label}
              </Link>
            ))}
            <div className="pt-4 border-t">
              <LanguageSwitcher />
            </div>
          </nav>
        </div>
      </div>
    </>
  )
}
