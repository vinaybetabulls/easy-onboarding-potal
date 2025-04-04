import { ButtonHTMLAttributes, FC } from 'react';
import { cn } from '../../lib/utils';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline';
}

export const Button: FC<ButtonProps> = ({ className, variant = 'default', ...props }) => {
  const baseStyles =
    'px-4 py-2 text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2';

  const variantStyles = {
    default: 'bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500',
    outline: 'border border-gray-300 text-gray-700 bg-white hover:bg-gray-100 focus:ring-gray-500',
  };

  return <button className={cn(baseStyles, variantStyles[variant], className)} {...props} />;
};
