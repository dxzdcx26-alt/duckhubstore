import React from 'react';
export const ProductCard: React.FC<any> = ({ product }) => (
  <div className="p-4 rounded-2xl border border-neutral-800 bg-neutral-950">
    <div className="font-bold">{product?.name}</div>
    <div className="text-yellow-400 text-sm">จาก ฿{product?.minPrice}</div>
  </div>
);
