import React from 'react';

export const AppShell: React.FC<{ left?: React.ReactNode; top?: React.ReactNode; children?: React.ReactNode; }> = ({ left, top, children }) => {
  return (
    <div className="app-shell">
      {top && <div className="top-bar">{top}</div>}
      <div className="content">
        {left && <aside className="sidebar">{left}</aside>}
        <main className="viewer">{children}</main>
      </div>
    </div>
  );
};
