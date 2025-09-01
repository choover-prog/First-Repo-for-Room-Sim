import React from 'react';

export const TopBar: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <div className="top-bar-inner">{children}</div>
);
