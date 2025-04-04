import { FC, ReactNode } from 'react';
import { cn } from '../../lib/utils';

export const Card: FC<{ className?: string; children: ReactNode }> = ({ className, children }) => {
  return <div className={cn('bg-white rounded-lg', className)}>{children}</div>;
};

export const CardContent: FC<{ className?: string; children: ReactNode }> = ({
  className,
  children,
}) => {
  return <div className={cn('p-4', className)}>{children}</div>;
};
