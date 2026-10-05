-- ==============================================================================
-- 7th Heaven Wakad - The Cake Shop
-- Production Supabase Database Schema with Row Level Security (RLS)
-- Location: Austin Plaza, Mhatoba Chowk, Kaspate Wasti, Wakad, Pune
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- -----------------------------------------------------------------------------
-- 1. CATEGORIES TABLE
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug VARCHAR(64) UNIQUE NOT NULL,
    name VARCHAR(128) NOT NULL,
    description TEXT,
    icon VARCHAR(64),
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- 2. PRODUCTS TABLE
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    slug VARCHAR(128) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    base_price NUMERIC(10,2) NOT NULL,
    image_url TEXT NOT NULL,
    is_eggless BOOLEAN DEFAULT TRUE,
    is_bestseller BOOLEAN DEFAULT FALSE,
    is_featured BOOLEAN DEFAULT FALSE,
    is_available BOOLEAN DEFAULT TRUE,
    display_order INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- 3. PRODUCT_VARIANTS TABLE (For weights, sizes & pricing)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS product_variants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    size_label VARCHAR(64) NOT NULL, -- e.g. '0.5 KG', '1 KG', '1.5 KG', '2 KG', 'Box of 6'
    weight_grams INT,
    price NUMERIC(10,2) NOT NULL,
    is_default BOOLEAN DEFAULT FALSE,
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- 4. CAKE_VARIANTS & FLAVORS TABLE
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS cake_variants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    flavor_name VARCHAR(128) NOT NULL,
    category_group VARCHAR(64) DEFAULT 'Signature', -- Chocolate, Exotic, Fresh Fruit, Indian Fusion, Premium
    description TEXT,
    price_multiplier NUMERIC(4,2) DEFAULT 1.0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- 5. OFFERS TABLE
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS offers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    badge VARCHAR(64) DEFAULT 'Limited Time',
    description TEXT NOT NULL,
    image_url TEXT,
    original_price NUMERIC(10,2),
    offer_price NUMERIC(10,2),
    discount_percentage INT,
    promo_code VARCHAR(32),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- 6. REVIEWS TABLE
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_name VARCHAR(128) NOT NULL,
    customer_image TEXT,
    locality VARCHAR(128) DEFAULT 'Wakad, Pune',
    rating INT CHECK (rating >= 1 AND rating <= 5) NOT NULL,
    review_text TEXT NOT NULL,
    cake_ordered VARCHAR(128),
    is_approved BOOLEAN DEFAULT TRUE,
    is_featured BOOLEAN DEFAULT FALSE,
    is_verified_google_buyer BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- 7. WORK_IMAGES TABLE (Owner "Our Work" Portfolio Showcase)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS work_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    category VARCHAR(64) NOT NULL, -- 'Birthday Cakes', 'Custom Cakes', 'Designer Cakes', 'Anniversary Cakes', 'Theme Cakes', 'Pastries', 'Celebrations', 'Bakery', 'Other'
    description TEXT,
    image_url TEXT NOT NULL,
    client_name VARCHAR(128),
    date_baked DATE DEFAULT CURRENT_DATE,
    is_featured BOOLEAN DEFAULT FALSE,
    display_order INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- 8. GALLERY TABLE (Store & bakery ambience photos)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS gallery (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    section VARCHAR(64) NOT NULL, -- 'Bakery', 'Interior', 'Cakes', 'Products', 'Celebrations', 'Team', 'Events'
    image_url TEXT NOT NULL,
    caption TEXT,
    is_featured BOOLEAN DEFAULT FALSE,
    display_order INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- 9. ORDERS TABLE (Order Tracking & Records)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_code VARCHAR(32) UNIQUE NOT NULL,
    customer_name VARCHAR(128) NOT NULL,
    customer_phone VARCHAR(32) NOT NULL,
    customer_address TEXT,
    product_details JSONB NOT NULL,
    total_amount NUMERIC(10,2) NOT NULL,
    required_date DATE NOT NULL,
    required_time VARCHAR(32) NOT NULL,
    cake_message TEXT,
    special_instructions TEXT,
    order_type VARCHAR(32) DEFAULT 'pickup', -- 'pickup' or 'delivery'
    status VARCHAR(32) DEFAULT 'New', -- 'New', 'Confirmed', 'Preparing', 'Ready', 'Completed', 'Cancelled'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- 10. BUSINESS_SETTINGS TABLE
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS business_settings (
    id VARCHAR(32) PRIMARY KEY DEFAULT 'wakad_main',
    store_name VARCHAR(255) DEFAULT '7th Heaven Wakad - The Cake Shop',
    address TEXT DEFAULT 'Shop No. 109, Austin Plaza, Mhatoba Chowk, Chhatrapati Chowk Road, Kaspate Wasti, Wakad, Pune, Maharashtra 411057',
    phone VARCHAR(32) DEFAULT '+91 90220 40850',
    whatsapp VARCHAR(32) DEFAULT '919022040850',
    latitude NUMERIC(10,7) DEFAULT 18.5950839,
    longitude NUMERIC(10,7) DEFAULT 73.7687737,
    google_maps_url TEXT,
    opening_hours VARCHAR(128) DEFAULT '9:30 AM – 11:00 PM',
    announcement_banner TEXT DEFAULT '🎉 Celebrate with Wakad''s favorite live kitchen bakery! Order fresh custom cakes in 7 minutes.',
    is_store_open BOOLEAN DEFAULT TRUE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- 11. ADMIN_USERS TABLE
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS admin_users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(32) DEFAULT 'owner',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- Public can read active/approved items.
-- Authenticated users (Store Owner) can perform all operations.
-- ==============================================================================

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE cake_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE work_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Categories
CREATE POLICY "Public categories read" ON categories FOR SELECT USING (is_active = TRUE);
CREATE POLICY "Owner manage categories" ON categories FOR ALL TO authenticated USING (TRUE) WITH CHECK (TRUE);

-- Products
CREATE POLICY "Public products read" ON products FOR SELECT USING (is_available = TRUE);
CREATE POLICY "Owner manage products" ON products FOR ALL TO authenticated USING (TRUE) WITH CHECK (TRUE);

-- Product Variants
CREATE POLICY "Public product_variants read" ON product_variants FOR SELECT USING (is_available = TRUE);
CREATE POLICY "Owner manage product_variants" ON product_variants FOR ALL TO authenticated USING (TRUE) WITH CHECK (TRUE);

-- Cake Variants
CREATE POLICY "Public cake_variants read" ON cake_variants FOR SELECT USING (is_active = TRUE);
CREATE POLICY "Owner manage cake_variants" ON cake_variants FOR ALL TO authenticated USING (TRUE) WITH CHECK (TRUE);

-- Offers
CREATE POLICY "Public offers read" ON offers FOR SELECT USING (is_active = TRUE AND end_date >= CURRENT_DATE);
CREATE POLICY "Owner manage offers" ON offers FOR ALL TO authenticated USING (TRUE) WITH CHECK (TRUE);

-- Reviews
CREATE POLICY "Public reviews read" ON reviews FOR SELECT USING (is_approved = TRUE);
CREATE POLICY "Public insert reviews" ON reviews FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "Owner manage reviews" ON reviews FOR ALL TO authenticated USING (TRUE) WITH CHECK (TRUE);

-- Work Images
CREATE POLICY "Public work_images read" ON work_images FOR SELECT USING (TRUE);
CREATE POLICY "Owner manage work_images" ON work_images FOR ALL TO authenticated USING (TRUE) WITH CHECK (TRUE);

-- Gallery
CREATE POLICY "Public gallery read" ON gallery FOR SELECT USING (TRUE);
CREATE POLICY "Owner manage gallery" ON gallery FOR ALL TO authenticated USING (TRUE) WITH CHECK (TRUE);

-- Orders
CREATE POLICY "Public insert orders" ON orders FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "Owner manage orders" ON orders FOR ALL TO authenticated USING (TRUE) WITH CHECK (TRUE);

-- Business Settings
CREATE POLICY "Public business_settings read" ON business_settings FOR SELECT USING (TRUE);
CREATE POLICY "Owner manage business_settings" ON business_settings FOR ALL TO authenticated USING (TRUE) WITH CHECK (TRUE);

-- Admin Users
CREATE POLICY "Owner read admin_users" ON admin_users FOR SELECT TO authenticated USING (TRUE);

-- ==============================================================================
-- STORAGE BUCKETS SETUP
-- ==============================================================================
INSERT INTO storage.buckets (id, name, public) VALUES ('cakes', 'cakes', true) ON CONFLICT DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('our_work', 'our_work', true) ON CONFLICT DO NOTHING;

-- Storage public policies
CREATE POLICY "Public read cakes bucket" ON storage.objects FOR SELECT USING (bucket_id = 'cakes');
CREATE POLICY "Public read our_work bucket" ON storage.objects FOR SELECT USING (bucket_id = 'our_work');
CREATE POLICY "Public upload to our_work" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'our_work');
CREATE POLICY "Public upload to cakes" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'cakes');

-- ==============================================================================
-- INITIAL SEED DATA FOR 7th HEAVEN WAKAD
-- ==============================================================================

-- Categories
INSERT INTO categories (slug, name, icon, display_order) VALUES
('cakes', 'Signature Cakes', '🎂', 1),
('birthday-cakes', 'Birthday Special', '🎉', 2),
('custom-cakes', 'Custom & Designer', '✨', 3),
('pastries', 'Pastries & Slices', '🍰', 4),
('cupcakes', 'Cupcakes & Brownies', '🧁', 5),
('desserts', 'Gourmet Desserts', '🍨', 6),
('beverages', 'Cold Shakes & Coolers', '🥤', 7),
('savories', 'Fresh Savories', '🥐', 8)
ON CONFLICT (slug) DO NOTHING;

-- Initial Products
INSERT INTO products (slug, name, description, base_price, image_url, is_bestseller, is_featured) VALUES
('belgian-chocolate-truffle', 'Belgian Chocolate Truffle Cake', 'Silky rich dark Belgian chocolate ganache infused in moist Dutch chocolate sponge, finished with mirror glaze & gold dust. 100% Pure Veg.', 550, 'assets/images/belgian_truffle.jpg', true, true),
('royal-rasmalai-cake', 'Royal Rasmalai Fusion Cake', 'Soft saffron cardamom sponge soaked in fragrant rabri, stuffed with juicy cottage cheese rasmalai pieces, pistachios & dried rose petals.', 580, 'assets/images/rasmalai_cake.jpg', true, true),
('velvet-berry-bliss', 'Classic Red Velvet Cream Cheese', 'Crimson cocoa velvet sponge layered with imported artisanal Philadelphia-style cream cheese frosting and fresh organic berries.', 520, 'assets/images/red_velvet.jpg', true, true),
('lotus-biscoff-drip-cake', 'Lotus Biscoff Speculoos Cake', 'Layers of caramelized Belgian speculoos cookie butter, crunchy biscuit crumble, and velvet vanilla buttercream drip.', 650, 'assets/images/lotus_biscoff.jpg', true, true),
('ruby-heart-pinata', 'Geometric Ruby Heart Piñata Cake', 'Edible hard chocolate geometric heart dome with wooden hammer included. Break open to reveal truffles and candies!', 850, 'assets/images/pinata_cake.jpg', true, true),
('designer-pastel-peony', 'Luxury Peony & Gold 2-Tier Celebration', 'Grand bespoke designer celebration cake with edible gold accents, hand-piped florals, and gourmet French macarons.', 1850, 'assets/images/designer_cake.jpg', false, true),
('gourmet-pastry-assortment', 'Artisan Pastry & Macaron Platter', 'Handcrafted chocolate ganache pastries, walnut brownies, and delicate French macarons freshly baked in our live kitchen.', 120, 'assets/images/pastries_desserts.jpg', true, true)
ON CONFLICT (slug) DO NOTHING;

-- Initial Offers
INSERT INTO offers (title, badge, description, image_url, original_price, offer_price, discount_percentage, promo_code, start_date, end_date) VALUES
('Weekend Celebration Bonanza', 'Special Deal', 'Flat ₹150 OFF on all 1 KG and above Custom & Designer Celebration Cakes ordered for Wakad pickup or delivery.', 'assets/images/designer_cake.jpg', 1250, 1100, 12, 'WAKAD150', CURRENT_DATE, CURRENT_DATE + INTERVAL '60 days'),
('Buy 1 KG Cake & Get 2 Free Cupcakes', 'Store Favorite', 'Order any Signature Belgian Truffle or Royal Rasmalai Cake (1 KG) and receive 2 gourmet chocolate cupcakes free!', 'assets/images/pastries_desserts.jpg', 1240, 1050, 15, 'CUPCAKELOVE', CURRENT_DATE, CURRENT_DATE + INTERVAL '60 days')
ON CONFLICT DO NOTHING;

-- Initial Reviews
INSERT INTO reviews (customer_name, locality, rating, review_text, cake_ordered, is_approved, is_featured) VALUES
('Priya Shinde', 'Kaspate Wasti, Wakad', 5, 'Ordered the Royal Rasmalai cake for my mother’s 50th birthday. It was ready in just 10 minutes at the live kitchen! Unbelievably fresh, super soft and not overly sweet. Best cake shop in Wakad!', 'Royal Rasmalai Fusion Cake (1 KG)', true, true),
('Aditya Kulkarni', 'Chatrapati Chowk, Wakad', 5, '7th Heaven Wakad is our go-to bakery. The Belgian Chocolate Truffle is out of this world — pure rich cocoa with zero artificial aftertaste. 100% pure veg which is mandatory for our family.', 'Belgian Chocolate Truffle (1.5 KG)', true, true),
('Sneha & Rohit Deshmukh', 'Austin Plaza, Wakad', 5, 'We requested a custom two-tier anniversary cake with pastel pink peonies. They replicated our reference photo with 100% precision. The WhatsApp coordination was smooth!', 'Bespoke Peony 2-Tier Designer Cake', true, true)
ON CONFLICT DO NOTHING;

-- Initial Work Images
INSERT INTO work_images (title, category, description, image_url, is_featured) VALUES
('Grand 3-Tier Golden Drip Floral Cake', 'Designer Cakes', 'Handcrafted wedding reception centerpiece with 24k edible gold leaf and macarons.', 'assets/images/hero_cake.jpg', true),
('Belgian Truffle Gloss Mirror Drip', 'Birthday Cakes', 'Glossy chocolate mirror glaze with hand-chiseled bark shards.', 'assets/images/belgian_truffle.jpg', true),
('Pastel Blush Peony 2-Tier Birthday Cake', 'Custom Cakes', 'Bespoke pastel watercolor finish with edible sugar peony blossoms.', 'assets/images/designer_cake.jpg', true),
('Traditional Kesar Rasmalai Pistachio', 'Celebrations', 'Authentic Indian festival centerpiece with real silver vark and rose petals.', 'assets/images/rasmalai_cake.jpg', true)
ON CONFLICT DO NOTHING;
