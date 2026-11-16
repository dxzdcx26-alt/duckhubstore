import React from 'react';
import { useStore } from '../context/StoreContext';
export const ToastContainer: React.FC = () => {
  const { toasts } = useStore();
  if (!toasts?.length) return null;
  return (
    <div className="fixed bottom-20 right-4 z-50 space-y-2">
      {toasts.map((t: any) => (
        <div key={t.id} className="px-4 py-2 rounded-xl bg-neutral-900 border border-yellow-500/40 text-sm">{t.message}</div>
      ))}
    </div>
  );
};
