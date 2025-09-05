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

  const navClass = variant === 'transparent' 
    ? 'bg-transparent' 
    : 'nav-header';

  return (
    <nav className={navClass}>
      <div className="flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <Shield className="h-8 w-8 text-white" />
          <span className="text-xl font-bold text-white text-shadow">
            KnowYourRightsCard
          </span>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          <a href="#guides" className="text-white hover:text-purple-200 transition-colors duration-200">
            Guides
          </a>
          <a href="#rights" className="text-white hover:text-purple-200 transition-colors duration-200">
            Your Rights
          </a>
          <a href="#record" className="text-white hover:text-purple-200 transition-colors duration-200">
            Record
          </a>
          <a href="#alerts" className="text-white hover:text-purple-200 transition-colors duration-200">
            Alerts
          </a>
          
          {/* Wallet Connection */}
          <Wallet>
            <ConnectWallet>
              <div className="flex items-center space-x-2 bg-white bg-opacity-20 px-4 py-2 rounded-lg backdrop-blur-sm border border-white border-opacity-30">
                <User className="h-4 w-4" />
                <Name />
              </div>
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

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden mt-4 pt-4 border-t border-white border-opacity-20">
          <div className="flex flex-col space-y-3">
            <a 
              href="#guides" 
              className="text-white hover:text-purple-200 transition-colors duration-200 py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Guides
            </a>
            <a 
              href="#rights" 
              className="text-white hover:text-purple-200 transition-colors duration-200 py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Your Rights
            </a>
            <a 
              href="#record" 
              className="text-white hover:text-purple-200 transition-colors duration-200 py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Record
            </a>
            <a 
              href="#alerts" 
              className="text-white hover:text-purple-200 transition-colors duration-200 py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Alerts
            </a>
            
            {/* Mobile Wallet Connection */}
            <div className="pt-2">
              <Wallet>
                <ConnectWallet>
                  <div className="flex items-center space-x-2 bg-white bg-opacity-20 px-4 py-2 rounded-lg backdrop-blur-sm border border-white border-opacity-30">
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
