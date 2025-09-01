import React, { useState } from 'react';

export const Switchblade: React.FC<{ tabs: { id: string; title: string; content: React.ReactNode }[] }> = ({ tabs }) => {
  const [open, setOpen] = useState<string | null>(null);
  return (
    <div className="switchblade">
      {tabs.map(t => (
        <div key={t.id} className={open === t.id ? 'tab open' : 'tab'}>
          <button onClick={() => setOpen(open === t.id ? null : t.id)}>{t.title}</button>
          {open === t.id && <div className="tab-content">{t.content}</div>}
        </div>
      ))}
    </div>
  );
};
