import React, { useMemo, useState } from 'react';
import { useStore } from '../context/StoreContext';
import { CategoryFilter } from './CategoryFilter';
import { ProductCard } from './ProductCard';
import { ProductDetailModal } from './ProductDetailModal';
import { ProductCategory } from '../types';

interface ShopViewProps {
  initialCategory?: ProductCategory;
}

export const ShopView: React.FC<ShopViewProps> = ({ initialCategory = 'all' }) => {
  const { products, selectedProductForDetail, setSelectedProductForDetail } = useStore();
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>(initialCategory);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('popular');

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: products.length };
    products.forEach((p) => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });
    return counts;
  }, [products]);

  const filtered = useMemo(() => {
    let list = products.filter((p) => p.category !== 'otp');
    if (selectedCategory !== 'all') {
      list = list.filter((p) => p.category === selectedCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.tagline?.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q),
      );
    }
    if (sortBy === 'price-asc') list = [...list].sort((a, b) => a.minPrice - b.minPrice);
    else if (sortBy === 'price-desc') list = [...list].sort((a, b) => b.minPrice - a.minPrice);
    else if (sortBy === 'name') list = [...list].sort((a, b) => a.name.localeCompare(b.name, 'th'));
    else list = [...list].sort((a, b) => (b.popular ? 1 : 0) - (a.popular ? 1 : 0) || b.totalSold - a.totalSold);
    return list;
  }, [products, selectedCategory, searchQuery, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-white mb-1">ร้านค้าสินค้าดิจิทัล</h2>
        <p className="text-sm text-neutral-400">เลือกซื้อบัญชีพรีเมียม เติมเกม และบัตรของขวัญ ส่งอัตโนมัติ</p>
      </div>
      <CategoryFilter
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        sortBy={sortBy}
        onSortChange={setSortBy}
        categoryCounts={categoryCounts}
      />
      {filtered.length === 0 ? (
        <div className="py-16 text-center text-neutral-500 border border-dashed border-neutral-800 rounded-2xl">
          ไม่พบสินค้าในหมวดนี้
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} onOpenDetail={setSelectedProductForDetail} />
          ))}
        </div>
      )}
      {selectedProductForDetail && <ProductDetailModal />}
    </div>
  );
};
