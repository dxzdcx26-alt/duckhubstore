import React, { createContext, useContext, useState, ReactNode } from 'react';

type Store = {
  products: any[];
  cart: any[];
  isAuthenticated: boolean;
  user: any;
  selectedProductForDetail: any;
  setSelectedProductForDetail: (p: any) => void;
  setIsTopupModalOpen: (v: boolean) => void;
  isTopupModalOpen: boolean;
  wheelHistory: any[];
  toasts: any[];
  addToast: (t: any) => void;
};

const C = createContext<Store | null>(null);

export const StoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedProductForDetail, setSelectedProductForDetail] = useState<any>(null);
  const [isTopupModalOpen, setIsTopupModalOpen] = useState(false);
  const [toasts, setToasts] = useState<any[]>([]);
  const value: Store = {
    products: [],
    cart: [],
    isAuthenticated: false,
    user: null,
    selectedProductForDetail,
    setSelectedProductForDetail,
    setIsTopupModalOpen,
    isTopupModalOpen,
    wheelHistory: [],
    toasts,
    addToast: (t) => setToasts((prev) => [...prev, { id: String(Date.now()), ...t }]),
  };
  return <C.Provider value={value}>{children}</C.Provider>;
};

export const useStore = () => {
  const c = useContext(C);
  if (!c) throw new Error('useStore must be used within StoreProvider');
  return c;
};
