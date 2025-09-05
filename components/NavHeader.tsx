'use client';

import { useState } from 'react';
import { Menu, X, Shield, User } from 'lucide-react';
import { ConnectWallet, Wallet } from '@coinbase/onchainkit/wallet';
import { Name } from '@coinbase/onchainkit/identity';

interface NavHeaderProps {
  variant?: 'default' | 'transparent';
}

export function NavHeader({ variant = 'default' }: NavHeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const baseClasses = variant === 'transparent' 
    ? 'bg-transparent' 
    : 'glass-card';

  return (
    <nav className={`${baseClasses} sticky top-0 z-50 px-4 py-3`}>
      <div className="max-w-screen-lg mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <Shield className="h-8 w-8 text-white" />
          <span className="text-xl font-bold text-white">KnowYourRightsCard</span>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          <a href="#home" className="text-white hover:text-purple-200 transition-colors duration-200">
            Home
          </a>
          <a href="#rights" className="text-white hover:text-purple-200 transition-colors duration-200">
            Rights
          </a>
          <a href="#guides" className="text-white hover:text-purple-200 transition-colors duration-200">
            Guides
          </a>
          <a href="#pricing" className="text-white hover:text-purple-200 transition-colors duration-200">
            Pricing
          </a>
          
          {/* Wallet Connection */}
          <Wallet>
            <ConnectWallet className="btn-secondary">
              <Name />
            </ConnectWallet>
          </Wallet>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden text-white hover:text-purple-200 transition-colors duration-200"
        >
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden mt-4 pb-4 border-t border-white border-opacity-20">
          <div className="flex flex-col space-y-4 pt-4">
            <a 
              href="#home" 
              className="text-white hover:text-purple-200 transition-colors duration-200"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </a>
            <a 
              href="#rights" 
              className="text-white hover:text-purple-200 transition-colors duration-200"
              onClick={() => setIsMenuOpen(false)}
            >
              Rights
            </a>
            <a 
              href="#guides" 
              className="text-white hover:text-purple-200 transition-colors duration-200"
              onClick={() => setIsMenuOpen(false)}
            >
              Guides
            </a>
            <a 
              href="#pricing" 
              className="text-white hover:text-purple-200 transition-colors duration-200"
              onClick={() => setIsMenuOpen(false)}
            >
              Pricing
            </a>
            
            {/* Mobile Wallet Connection */}
            <div className="pt-2">
              <Wallet>
                <ConnectWallet className="btn-secondary w-full">
                  <div className="flex items-center justify-center space-x-2">
                    <User className="h-4 w-4" />
                    <Name />
                  </div>
                </ConnectWallet>
              </Wallet>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
