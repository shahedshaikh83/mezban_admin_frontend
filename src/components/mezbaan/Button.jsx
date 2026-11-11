import React from 'react';

export default function Button({
  children,
  type = 'button',
  variant = 'primary', // 'primary' | 'gold-outline' | 'gold-solid' | 'outline' | 'ghost' | 'danger'
  size = 'md', // 'sm' | 'md' | 'lg'
  icon: Icon,
  iconPosition = 'left',
  onClick,
  disabled = false,
  className = '',
  title,
  ariaLabel
}) {
  const baseStyles = 'inline-flex items-center justify-center font-semibold transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98]';

  const sizeStyles = {
    sm: 'text-xs px-3 py-1.5 rounded-lg gap-1.5 h-9',
    md: 'text-sm px-4 py-2.5 rounded-xl gap-2 h-11',
    lg: 'text-base px-6 py-3 rounded-xl gap-2.5 h-12'
  };

  const variantStyles = {
    primary: 'bg-[#0B4D3A] text-white hover:bg-[#083b2c] shadow-sm hover:shadow border border-transparent',
    'gold-outline': 'border border-[#F4C542] bg-[#FFF8E1] text-[#78590d] hover:bg-[#fdedb4] shadow-xs',
    'gold-solid': 'bg-[#F4C542] text-[#0B4D3A] hover:bg-[#eab830] shadow-sm font-bold',
    outline: 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 hover:text-gray-900 shadow-xs',
    ghost: 'text-gray-600 hover:bg-gray-100/80 hover:text-gray-900 border border-transparent',
    danger: 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200'
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      title={title}
      aria-label={ariaLabel || title}
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant] || variantStyles.primary} ${className}`}
    >
      {Icon && iconPosition === 'left' && <Icon className="w-4 h-4 shrink-0" />}
      {children}
      {Icon && iconPosition === 'right' && <Icon className="w-4 h-4 shrink-0" />}
    </button>
  );
}
