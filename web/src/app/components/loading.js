import React from 'react';
import classNames from 'classnames';

export default function Loading({ size = 'md', overlay = false }) {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-6 h-6 border-2',
    lg: 'w-12 h-12 border-4',
  };

  const spinner = (
    <div
      className={classNames(
        'animate-spin rounded-full border-t-transparent border-white',
        sizeClasses[size]
      )}
    />
  );

  if (overlay) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
        {spinner}
      </div>
    );
  }

  return spinner;
}
