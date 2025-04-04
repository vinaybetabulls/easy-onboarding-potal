import { LabelHTMLAttributes, FC } from 'react';
import { cn } from '../../lib/utils';

export const Label: FC<LabelHTMLAttributes<HTMLLabelElement>> = ({ className, ...props }) => {
  return (
    <label className={cn('block text-sm font-medium text-gray-700 mb-1', className)} {...props} />
  );
};
