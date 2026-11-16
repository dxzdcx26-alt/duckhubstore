import React from 'react';
export const Footer: React.FC<{ onNavTab?: (t: string) => void }> = () => (
  <footer className="border-t border-neutral-800 py-8 text-center text-neutral-500 text-sm">
    © {new Date().getFullYear()} DuckyHub 🦆 — Digital Store
  </footer>
);
