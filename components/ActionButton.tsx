'use client';

import { ActionButtonProps } from '@/lib/types';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export function ActionButton({
  variant,
  size = 'md',
  disabled = false,
  loading = false,
  onClick,
  children,
  className = '',
}: ActionButtonProps) {
  const baseClasses = 'font-medium transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variantClasses = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    alert: 'btn-alert',
  };

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm rounded-md',
    md: 'px-6 py-3 text-base rounded-lg',
    lg: 'px-8 py-4 text-lg rounded-xl',
  };

  const buttonClasses = cn(
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    className
  );

  return (
    <button
      className={buttonClasses}
      disabled={disabled || loading}
      onClick={onClick}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      <span>{children}</span>
    </button>
  );
}
