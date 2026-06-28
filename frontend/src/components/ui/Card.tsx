import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, className = '' }) => {
  return (
    <div className={`rounded-xl p-4 border border-[var(--color-border)] bg-[var(--color-bg-card)]/80 backdrop-blur-sm hover:border-[var(--color-accent)]/40 hover:shadow-lg hover:shadow-[var(--color-accent)]/5 transition-all duration-300 ${className}`}>
      {children}
    </div>
  );
};

export default Card;