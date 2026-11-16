import React, { useState } from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Header } from './components/Header';
import { TickerMarquee } from './components/TickerMarquee';
import { UserDashboard } from './components/UserDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { AuthModal } from './components/AuthModal';
import { TopupModal } from './components/TopupModal';
import { RedeemModal } from './components/RedeemModal';
import { CartDrawer } from './components/CartDrawer';
import { ToastContainer } from './components/ToastContainer';
import { DailyRewardModal } from './components/DailyRewardModal';
import { Footer } from './components/Footer';
import { LuckyWheel } from './components/LuckyWheel';
import { ShopView } from './components/ShopView';
import { ShoppingBag, Zap, ShieldCheck } from 'lucide-react';

const MainAppContent: React.FC = () => {
  const { setIsTopupModalOpen, isAuthenticated } = useStore();
  const [activeTab, setActiveTab] = useState('home');

  return (
    <div className="min-h-screen flex flex-col bg-[#050505] text-white">
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />
      <TickerMarquee />
      <main className="flex-1">
        {activeTab === 'home' && <>
          <section className="store-hero max-w-7xl mx-auto px-4 sm:px-6 pt-5 sm:pt-8">
            <div className="hero-shell">
              <div className="hero-copy">
                <div className="eyebrow"><Zap /> DUCKY HUB 🦆</div>
                <h1>ร้านค้าเป็ดเหลือง<br /><span>เติมเกม • พรีเมียม • ส่งไว</span></h1>
                <p>สินค้าดิจิทัล สตรีมมิ่ง AI และบัตรเติมเกม พร้อมส่งอัตโนมัติ 24 ชั่วโมง</p>
                <div className="hero-actions">
                  <button onClick={() => setActiveTab('streaming')} className="primary-btn"><ShoppingBag />เลือกซื้อสินค้า</button>
                  <button onClick={() => setActiveTab('gaming')} className="secondary-btn"><Zap />เติมเกม & บัตร</button>
                </div>
                <div className="trust-row"><span><Zap /> ส่งออโต้</span><span><ShieldCheck /> ปลอดภัย</span><span>บริการ 24/7</span></div>
              </div>
              <div className="hero-stats"><div className="stat-main"><span>ระบบ</span><strong>AUTO</strong><small>DELIVERY</small></div></div>
            </div>
          </section>
          <ShopView initialCategory="all" />
        </>}
        {(activeTab === 'streaming' || activeTab === 'ai' || activeTab === 'music' || activeTab === 'creator' || activeTab === 'giftcard' || activeTab === 'social') && (
          <ShopView initialCategory={activeTab === 'streaming' ? 'streaming' : activeTab as any} />
        )}
        {activeTab === 'gaming' && <ShopView initialCategory="gaming" />}
        {activeTab === 'wheel' && <LuckyWheel />}
        {(activeTab === 'history' || activeTab === 'user') && <UserDashboard />}
        {activeTab === 'admin' && <AdminDashboard />}
      </main>
      <Footer onNavTab={setActiveTab} />
      {isAuthenticated && <button onClick={() => setIsTopupModalOpen(true)} className="floating-topup">+ เติมเงิน</button>}
      <AuthModal /><DailyRewardModal /><TopupModal /><RedeemModal /><CartDrawer /><ToastContainer />
    </div>
  );
};

export default function App() {
  return <StoreProvider><MainAppContent /></StoreProvider>;
}
