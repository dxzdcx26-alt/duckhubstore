export type ProductCategory =
  | 'all'
  | 'streaming'
  | 'gaming'
  | 'otp'
  | 'ai'
  | 'music'
  | 'creator'
  | 'giftcard'
  | 'social';

export interface ProductPlan {
  id: string;
  name: string;
  duration: string;
  price: number;
  originalPrice?: number;
  stockCount: number;
  badge?: string;
  credentials?: string[];
}

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  subCategory?: string;
  tagline: string;
  description: string;
  features: string[];
  bannerUrl?: string;
  logoText: string;
  logoColor: string;
  logoBg: string;
  logoIconName?: string;
  minPrice: number;
  plans: ProductPlan[];
  instantDelivery: boolean;
  warrantyDays: number;
  totalSold: number;
  popular?: boolean;
}

export interface CartItem {
  productId: string;
  planId: string;
  productName: string;
  planName: string;
  duration: string;
  price: number;
  quantity: number;
  logoText: string;
  logoColor: string;
  logoBg: string;
  instantDelivery: boolean;
}

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  planName: string;
  price: number;
  quantity: number;
  deliveredCredentials: string[];
}

export interface Order {
  id: string;
  createdAt: string;
  totalAmount: number;
  items: OrderItem[];
  status: 'completed' | 'processing' | 'cancelled';
  paymentMethod: 'wallet' | 'promptpay' | 'angpao';
}

export interface TopupTransaction {
  id: string;
  createdAt: string;
  method: 'promptpay' | 'angpao' | 'truemoney' | 'admin';
  amount: number;
  bonusAmount: number;
  totalCredited: number;
  status: 'success' | 'pending' | 'failed';
  refCode: string;
  note?: string;
}

export type WheelPrizeType = 'cash' | 'item' | 'spins' | 'voucher' | 'empty';

export interface WheelItem {
  id: string;
  name: string;
  type: WheelPrizeType;
  value: number;
  itemRewardName?: string;
  itemRewardKey?: string;
  color: string;
  textColor: string;
  weight: number;
  icon: string;
}

export interface WheelHistory {
  id: string;
  timestamp: string;
  username: string;
  prizeName: string;
  prizeType: WheelPrizeType;
  value: number;
}

export interface VoucherCode {
  id: string;
  code: string;
  rewardType: 'balance' | 'discount' | 'spin' | 'item';
  value: number;
  minOrderAmount?: number;
  usedCount: number;
  maxUses: number;
  expiresAt?: string;
  isActive: boolean;
}

export interface OTPServiceItem {
  id: string;
  name: string;
  icon: string;
  price: number;
  availableCount: number;
  popularCountries: { code: string; name: string; flag: string; cost: number }[];
}

export interface ActiveOTPOrder {
  id: string;
  serviceId: string;
  serviceName: string;
  countryCode: string;
  countryName: string;
  phoneNumber: string;
  price: number;
  status: 'waiting' | 'received' | 'timeout' | 'cancelled';
  smsCode?: string;
  fullMessage?: string;
  expiresAt: number;
  createdAt: number;
}

export interface DailyRewardRecord {
  day: number;
  claimed: boolean;
  rewardType?: string;
  value?: number;
}

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
}
