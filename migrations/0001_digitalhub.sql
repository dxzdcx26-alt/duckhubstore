PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  username TEXT NOT NULL,
  email TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user','admin')),
  balance REAL NOT NULL DEFAULT 0,
  points INTEGER NOT NULL DEFAULT 0,
  total_spent REAL NOT NULL DEFAULT 0,
  spin_count INTEGER NOT NULL DEFAULT 3,
  created_at TEXT NOT NULL,
  photo_url TEXT,
  last_daily_claim INTEGER,
  daily_streak INTEGER NOT NULL DEFAULT 0
);
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_email ON users(email) WHERE email <> '';

CREATE TABLE IF NOT EXISTS sessions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  expires_at INTEGER NOT NULL,
  created_at INTEGER NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_expiry ON sessions(expires_at);

CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  sub_category TEXT,
  tagline TEXT,
  description TEXT,
  features_json TEXT NOT NULL DEFAULT '[]',
  banner_url TEXT,
  logo_text TEXT,
  logo_color TEXT,
  logo_bg TEXT,
  logo_icon_name TEXT,
  min_price REAL NOT NULL DEFAULT 0,
  instant_delivery INTEGER NOT NULL DEFAULT 1,
  warranty_days INTEGER NOT NULL DEFAULT 0,
  total_sold INTEGER NOT NULL DEFAULT 0,
  popular INTEGER NOT NULL DEFAULT 0,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS product_plans (
  id TEXT PRIMARY KEY,
  product_id TEXT NOT NULL,
  name TEXT NOT NULL,
  duration TEXT NOT NULL,
  price REAL NOT NULL,
  original_price REAL,
  stock_count INTEGER NOT NULL DEFAULT 0,
  badge TEXT,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_product_plans_product ON product_plans(product_id);

CREATE TABLE IF NOT EXISTS stock_credentials (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  plan_id TEXT NOT NULL,
  credential TEXT NOT NULL,
  sold_at TEXT,
  order_id TEXT,
  FOREIGN KEY (plan_id) REFERENCES product_plans(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_stock_plan_available ON stock_credentials(plan_id, sold_at);

CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  created_at TEXT NOT NULL,
  total_amount REAL NOT NULL,
  status TEXT NOT NULL DEFAULT 'processing',
  payment_method TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id);

CREATE TABLE IF NOT EXISTS order_items (
  id TEXT PRIMARY KEY,
  order_id TEXT NOT NULL,
  product_id TEXT NOT NULL,
  product_name TEXT NOT NULL,
  plan_name TEXT NOT NULL,
  price REAL NOT NULL,
  quantity INTEGER NOT NULL,
  delivered_credentials_json TEXT NOT NULL DEFAULT '[]',
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);

CREATE TABLE IF NOT EXISTS topups (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  created_at TEXT NOT NULL,
  method TEXT NOT NULL,
  amount REAL NOT NULL,
  bonus_amount REAL NOT NULL DEFAULT 0,
  total_credited REAL NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  ref_code TEXT,
  note TEXT,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
CREATE INDEX IF NOT EXISTS idx_topups_user ON topups(user_id);

CREATE TABLE IF NOT EXISTS vouchers (
  id TEXT PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  reward_type TEXT NOT NULL,
  value REAL NOT NULL,
  min_order_amount REAL,
  used_count INTEGER NOT NULL DEFAULT 0,
  max_uses INTEGER NOT NULL DEFAULT 1,
  expires_at TEXT,
  is_active INTEGER NOT NULL DEFAULT 1
);

CREATE TABLE IF NOT EXISTS voucher_redemptions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  voucher_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  redeemed_at TEXT NOT NULL,
  FOREIGN KEY (voucher_id) REFERENCES vouchers(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);
CREATE UNIQUE INDEX IF NOT EXISTS idx_voucher_user ON voucher_redemptions(voucher_id, user_id);

CREATE TABLE IF NOT EXISTS wheel_items (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  value REAL NOT NULL DEFAULT 0,
  item_reward_name TEXT,
  item_reward_key TEXT,
  color TEXT,
  text_color TEXT,
  weight REAL NOT NULL DEFAULT 1,
  icon TEXT
);

CREATE TABLE IF NOT EXISTS wheel_history (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  timestamp TEXT NOT NULL,
  username TEXT NOT NULL,
  prize_name TEXT NOT NULL,
  prize_type TEXT NOT NULL,
  value REAL NOT NULL DEFAULT 0,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
CREATE INDEX IF NOT EXISTS idx_wheel_history_user ON wheel_history(user_id);

CREATE TABLE IF NOT EXISTS otp_orders (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  service_id TEXT NOT NULL,
  service_name TEXT NOT NULL,
  country_code TEXT NOT NULL,
  country_name TEXT NOT NULL,
  phone_number TEXT,
  price REAL NOT NULL,
  status TEXT NOT NULL DEFAULT 'waiting',
  sms_code TEXT,
  full_message TEXT,
  expires_at INTEGER NOT NULL,
  created_at INTEGER NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
CREATE INDEX IF NOT EXISTS idx_otp_user ON otp_orders(user_id);

CREATE TABLE IF NOT EXISTS daily_rewards (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  day INTEGER NOT NULL,
  claimed_at INTEGER NOT NULL,
  reward_type TEXT NOT NULL,
  amount_text TEXT NOT NULL,
  balance_bonus REAL NOT NULL DEFAULT 0,
  points_bonus INTEGER NOT NULL DEFAULT 0,
  spin_bonus INTEGER NOT NULL DEFAULT 0,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
CREATE INDEX IF NOT EXISTS idx_daily_rewards_user ON daily_rewards(user_id);
