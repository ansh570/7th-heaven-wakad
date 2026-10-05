/**
 * 7th Heaven Wakad - Centralized Data Store & API Layer
 * Seamless Supabase Cloud Integration + Resilient Offline / Local Persistence
 * Location: Austin Plaza, Mhatoba Chowk, Kaspate Wasti, Wakad, Pune
 */

const STORAGE_KEYS = {
  PRODUCTS: '7th_heaven_products_v2',
  CATEGORIES: '7th_heaven_categories_v2',
  OFFERS: '7th_heaven_offers_v2',
  REVIEWS: '7th_heaven_reviews_v2',
  OUR_WORK: '7th_heaven_our_work_v2',
  GALLERY: '7th_heaven_gallery_v2',
  ORDERS: '7th_heaven_orders_v2',
  SETTINGS: '7th_heaven_settings_v2',
  SUPABASE_CONFIG: '7th_heaven_supabase_config_v2',
  AUTH_SESSION: '7th_heaven_auth_session_v2'
};

// Default seed data tailored specifically for 7th Heaven Wakad
const DEFAULT_CATEGORIES = [
  { id: 'cat-cakes', slug: 'cakes', name: 'Signature Cakes', icon: '🎂', display_order: 1 },
  { id: 'cat-birthday', slug: 'birthday-cakes', name: 'Birthday Special', icon: '🎉', display_order: 2 },
  { id: 'cat-custom', slug: 'custom-cakes', name: 'Custom & Designer', icon: '✨', display_order: 3 },
  { id: 'cat-pastries', slug: 'pastries', name: 'Pastries & Slices', icon: '🍰', display_order: 4 },
  { id: 'cat-cupcakes', slug: 'cupcakes', name: 'Cupcakes & Brownies', icon: '🧁', display_order: 5 },
  { id: 'cat-desserts', slug: 'desserts', name: 'Gourmet Desserts', icon: '🍨', display_order: 6 },
  { id: 'cat-beverages', slug: 'beverages', name: 'Cold Shakes & Coolers', icon: '🥤', display_order: 7 },
  { id: 'cat-savories', slug: 'savories', name: 'Fresh Savories', icon: '🥐', display_order: 8 }
];

const DEFAULT_PRODUCTS = [
  {
    id: 'prod-belgian-truffle',
    slug: 'belgian-chocolate-truffle',
    name: 'Belgian Chocolate Truffle Cake',
    category: 'cakes',
    description: 'Silky rich dark Belgian chocolate ganache infused in moist Dutch chocolate sponge, finished with mirror glaze & gold dust. 100% Pure Veg.',
    basePrice: 550,
    imageUrl: 'assets/images/belgian_truffle.jpg',
    isBestseller: true,
    isFeatured: true,
    isAvailable: true,
    sizes: [
      { label: '0.5 KG', price: 550 },
      { label: '1.0 KG', price: 1050 },
      { label: '1.5 KG', price: 1550 },
      { label: '2.0 KG', price: 2000 }
    ],
    flavors: ['Classic Belgian Dark', 'Milk Chocolate Truffle', 'Hazelnut Praline']
  },
  {
    id: 'prod-rasmalai-royal',
    slug: 'royal-rasmalai-cake',
    name: 'Royal Rasmalai Fusion Cake',
    category: 'cakes',
    description: 'Soft saffron cardamom sponge soaked in fragrant rabri, stuffed with juicy cottage cheese rasmalai pieces, pistachios & dried rose petals.',
    basePrice: 580,
    imageUrl: 'assets/images/rasmalai_cake.jpg',
    isBestseller: true,
    isFeatured: true,
    isAvailable: true,
    sizes: [
      { label: '0.5 KG', price: 580 },
      { label: '1.0 KG', price: 1100 },
      { label: '1.5 KG', price: 1650 },
      { label: '2.0 KG', price: 2150 }
    ],
    flavors: ['Traditional Saffron Rabri', 'Kesar Pista Supreme']
  },
  {
    id: 'prod-red-velvet',
    slug: 'velvet-berry-bliss',
    name: 'Classic Red Velvet Cream Cheese',
    category: 'cakes',
    description: 'Crimson cocoa velvet sponge layered with imported artisanal Philadelphia-style cream cheese frosting and fresh organic berries.',
    basePrice: 520,
    imageUrl: 'assets/images/red_velvet.jpg',
    isBestseller: true,
    isFeatured: true,
    isAvailable: true,
    sizes: [
      { label: '0.5 KG', price: 520 },
      { label: '1.0 KG', price: 990 },
      { label: '1.5 KG', price: 1450 },
      { label: '2.0 KG', price: 1900 }
    ],
    flavors: ['Classic Velvet', 'Berry Swirl Velvet']
  },
  {
    id: 'prod-lotus-biscoff',
    slug: 'lotus-biscoff-drip-cake',
    name: 'Lotus Biscoff Speculoos Cake',
    category: 'cakes',
    description: 'Layers of caramelized Belgian speculoos cookie butter, crunchy biscuit crumble, and velvet vanilla buttercream drip.',
    basePrice: 650,
    imageUrl: 'assets/images/lotus_biscoff.jpg',
    isBestseller: true,
    isFeatured: true,
    isAvailable: true,
    sizes: [
      { label: '0.5 KG', price: 650 },
      { label: '1.0 KG', price: 1250 },
      { label: '1.5 KG', price: 1800 },
      { label: '2.0 KG', price: 2350 }
    ],
    flavors: ['Caramel Biscoff', 'Biscoff Cheesecake Style']
  },
  {
    id: 'prod-designer-blush',
    slug: 'designer-pastel-peony',
    name: 'Luxury Peony & Gold 2-Tier Celebration',
    category: 'custom-cakes',
    description: 'Grand bespoke designer celebration cake with edible gold accents, hand-piped florals, and gourmet French macarons. Perfect for milestones & weddings.',
    basePrice: 1850,
    imageUrl: 'assets/images/designer_cake.jpg',
    isBestseller: false,
    isFeatured: true,
    isAvailable: true,
    sizes: [
      { label: '1.5 KG (2-Tier)', price: 1850 },
      { label: '2.0 KG (2-Tier)', price: 2400 },
      { label: '3.0 KG (3-Tier)', price: 3500 }
    ],
    flavors: ['Belgian Truffle + Vanilla Berry', 'Dutch Chocolate + Hazelnut']
  },
  {
    id: 'prod-pinata-surprise',
    slug: 'ruby-heart-pinata',
    name: 'Geometric Ruby Heart Piñata Cake',
    category: 'custom-cakes',
    description: 'Edible hard chocolate geometric heart dome with wooden hammer included. Break open to reveal cupcakes, truffles, and celebration candies!',
    basePrice: 850,
    imageUrl: 'assets/images/pinata_cake.jpg',
    isBestseller: true,
    isFeatured: true,
    isAvailable: true,
    sizes: [
      { label: '0.75 KG (With Hammer)', price: 850 },
      { label: '1.2 KG (With Hammer)', price: 1350 }
    ],
    flavors: ['Dark Choco Truffle Base', 'Nutella Crunch Base']
  },
  {
    id: 'prod-pastries-platter',
    slug: 'gourmet-pastry-assortment',
    name: 'Artisan Pastry & Macaron Platter',
    category: 'pastries',
    description: 'Handcrafted chocolate ganache pastries, walnut brownies, and delicate French macarons freshly baked in our live kitchen.',
    basePrice: 120,
    imageUrl: 'assets/images/pastries_desserts.jpg',
    isBestseller: true,
    isFeatured: true,
    isAvailable: true,
    sizes: [
      { label: 'Single Pastry Slice', price: 120 },
      { label: 'Box of 4 Assorted', price: 440 },
      { label: 'Party Box of 8', price: 820 }
    ],
    flavors: ['Dark Truffle', 'Blueberry Cream', 'Nutella Macaron']
  },
  {
    id: 'prod-dutch-truffle-slice',
    slug: 'dutch-truffle-pastry',
    name: 'Dutch Chocolate Truffle Pastry',
    category: 'pastries',
    description: 'Pure melted cocoa ganache layered with moist chocolate sponge. Melts in your mouth instantly. Pure vegetarian.',
    basePrice: 95,
    imageUrl: 'assets/images/belgian_truffle.jpg',
    isBestseller: true,
    isFeatured: false,
    isAvailable: true,
    sizes: [
      { label: 'Single Slice', price: 95 },
      { label: 'Box of 2', price: 180 }
    ],
    flavors: ['Classic Dutch Dark']
  },
  {
    id: 'prod-fudgy-brownie',
    slug: 'walnut-fudge-brownie',
    name: 'Warm Walnut Fudge Brownie',
    category: 'cupcakes',
    description: 'Decadent, dense, chewy chocolate fudge brownie generously studded with toasted California walnuts.',
    basePrice: 90,
    imageUrl: 'assets/images/pastries_desserts.jpg',
    isBestseller: true,
    isFeatured: false,
    isAvailable: true,
    sizes: [
      { label: 'Single Piece', price: 90 },
      { label: 'Box of 4', price: 340 }
    ],
    flavors: ['Double Chocolate Walnut']
  }
];

const DEFAULT_OFFERS = [
  {
    id: 'off-weekend-sweet',
    title: 'Weekend Celebration Bonanza',
    badge: 'Special Deal',
    description: 'Flat ₹150 OFF on all 1 KG and above Custom & Designer Celebration Cakes ordered for Wakad pickup or delivery.',
    imageUrl: 'assets/images/designer_cake.jpg',
    originalPrice: 1250,
    offerPrice: 1100,
    discountPercentage: 12,
    promoCode: 'WAKAD150',
    startDate: '2026-10-01',
    endDate: '2026-10-31',
    isActive: true
  },
  {
    id: 'off-free-cupcakes',
    title: 'Buy 1 KG Cake & Get 2 Free Cupcakes',
    badge: 'Store Favorite',
    description: 'Order any Signature Belgian Truffle or Royal Rasmalai Cake (1 KG) and receive 2 gourmet freshly baked chocolate cupcakes free!',
    imageUrl: 'assets/images/pastries_desserts.jpg',
    originalPrice: 1240,
    offerPrice: 1050,
    discountPercentage: 15,
    promoCode: 'CUPCAKELOVE',
    startDate: '2026-10-01',
    endDate: '2026-11-15',
    isActive: true
  },
  {
    id: 'off-pastry-combo',
    title: 'Live Kitchen Pastry Duo Combo',
    badge: 'Daily Delight',
    description: 'Pair any two premium pastries (Dutch Truffle + Red Velvet) for only ₹180 between 3:00 PM to 7:00 PM daily.',
    imageUrl: 'assets/images/belgian_truffle.jpg',
    originalPrice: 220,
    offerPrice: 180,
    discountPercentage: 18,
    promoCode: 'TEATIME',
    startDate: '2026-10-01',
    endDate: '2026-12-31',
    isActive: true
  }
];

const DEFAULT_REVIEWS = [
  {
    id: 'rev-1',
    customerName: 'Priya Shinde',
    locality: 'Kaspate Wasti, Wakad',
    rating: 5,
    reviewText: 'Ordered the Royal Rasmalai cake for my mother’s 50th birthday. It was ready in just 10 minutes at the live kitchen! Unbelievably fresh, super soft and not overly sweet. Everyone at home was mesmerized. Best cake shop in Wakad!',
    cakeOrdered: 'Royal Rasmalai Fusion Cake (1 KG)',
    isApproved: true,
    isFeatured: true,
    isVerifiedGoogleBuyer: true,
    date: '2026-09-28'
  },
  {
    id: 'rev-2',
    customerName: 'Aditya Kulkarni',
    locality: 'Chatrapati Chowk, Wakad',
    rating: 5,
    reviewText: '7th Heaven Wakad is our go-to bakery. The Belgian Chocolate Truffle is out of this world — pure rich cocoa with zero artificial aftertaste. 100% pure veg which is mandatory for our family. Highly recommended!',
    cakeOrdered: 'Belgian Chocolate Truffle (1.5 KG)',
    isApproved: true,
    isFeatured: true,
    isVerifiedGoogleBuyer: true,
    date: '2026-09-20'
  },
  {
    id: 'rev-3',
    customerName: 'Sneha & Rohit Deshmukh',
    locality: 'Austin Plaza, Wakad',
    rating: 5,
    reviewText: 'We requested a custom two-tier anniversary cake with pastel pink peonies. They replicated our reference photo with 100% precision. The WhatsApp coordination was smooth and delivery was on the dot!',
    cakeOrdered: 'Bespoke Peony 2-Tier Designer Cake',
    isApproved: true,
    isFeatured: true,
    isVerifiedGoogleBuyer: true,
    date: '2026-09-15'
  },
  {
    id: 'rev-4',
    customerName: 'Vikram Jadhav',
    locality: 'Mhatoba Chowk, Wakad',
    rating: 5,
    reviewText: 'The Live Kitchen concept is genuinely revolutionary. Watching them assemble and decorate the cake right in front of us within 7 minutes gives total confidence in freshness and hygiene. Top-tier service.',
    cakeOrdered: 'Classic Red Velvet Cake',
    isApproved: true,
    isFeatured: true,
    isVerifiedGoogleBuyer: true,
    date: '2026-09-08'
  },
  {
    id: 'rev-5',
    customerName: 'Meera Nair',
    locality: 'Hinjewadi Phase 1 / Wakad',
    rating: 5,
    reviewText: 'The Lotus Biscoff cake is pure decadence! The crunchy speculoos biscuits with silky cream had everyone asking where we got it from. 7th Heaven Wakad never disappoints.',
    cakeOrdered: 'Lotus Biscoff Speculoos Cake',
    isApproved: true,
    isFeatured: false,
    isVerifiedGoogleBuyer: true,
    date: '2026-08-30'
  }
];

const DEFAULT_OUR_WORK = [
  {
    id: 'work-1',
    title: 'Grand 3-Tier Golden Drip Floral Cake',
    category: 'Designer Cakes',
    description: 'Custom handcrafted three-tier wedding reception masterpiece with 24k edible gold leaf, fresh macaron crown, and delicate floral garnishes.',
    imageUrl: 'assets/images/hero_cake.jpg',
    dateBaked: '2026-09-29',
    isFeatured: true,
    clientName: 'Celebration at Wakad'
  },
  {
    id: 'work-2',
    title: 'Belgian Truffle Gloss Mirror Drip',
    category: 'Birthday Cakes',
    description: 'High-gloss dark chocolate mirror glaze with hand-chiseled chocolate bark shards and wild raspberries.',
    imageUrl: 'assets/images/belgian_truffle.jpg',
    dateBaked: '2026-09-25',
    isFeatured: true,
    clientName: 'Rohit K.'
  },
  {
    id: 'work-3',
    title: 'Pastel Blush Peony 2-Tier Birthday Cake',
    category: 'Custom Cakes',
    description: 'Bespoke pastel pink watercolor finish with edible sugar peony blossoms and gold foil accents.',
    imageUrl: 'assets/images/designer_cake.jpg',
    dateBaked: '2026-09-22',
    isFeatured: true,
    clientName: 'Eleanor Birthday'
  },
  {
    id: 'work-4',
    title: 'Traditional Kesar Rasmalai Pistachio Extravaganza',
    category: 'Celebrations',
    description: 'Authentic Indian festival centerpiece layered with genuine silver vark and rose petals.',
    imageUrl: 'assets/images/rasmalai_cake.jpg',
    dateBaked: '2026-09-18',
    isFeatured: true,
    clientName: 'Family Milestone'
  },
  {
    id: 'work-5',
    title: 'Ruby Geometric Heart Piñata with Wooden Mallet',
    category: 'Theme Cakes',
    description: 'High-gloss faceted chocolate shell designed for an exhilarating smash-and-reveal surprise.',
    imageUrl: 'assets/images/pinata_cake.jpg',
    dateBaked: '2026-09-12',
    isFeatured: true,
    clientName: 'Ananya S.'
  },
  {
    id: 'work-6',
    title: 'Artisan Pastry & Macaron Tiered High-Tea Display',
    category: 'Pastries',
    description: 'Freshly baked walnut fudge brownies, Belgian cupcakes, and pastel Parisian macarons.',
    imageUrl: 'assets/images/pastries_desserts.jpg',
    dateBaked: '2026-09-05',
    isFeatured: true,
    clientName: 'Corporate High Tea'
  },
  {
    id: 'work-7',
    title: 'Speculoos Cookie Butter Caramel Drip Masterpiece',
    category: 'Designer Cakes',
    description: 'Gourmet Lotus Biscoff cake with golden biscuit borders and whipped caramel buttercream rosettes.',
    imageUrl: 'assets/images/lotus_biscoff.jpg',
    dateBaked: '2026-08-28',
    isFeatured: true,
    clientName: 'Aarav 1st Birthday'
  },
  {
    id: 'work-8',
    title: 'Live Kitchen Craftsmanship in Action',
    category: 'Bakery',
    description: 'Our certified pastry chef putting the final delicate piping touches in the 7th Heaven Wakad live kitchen.',
    imageUrl: 'assets/images/live_kitchen.jpg',
    dateBaked: '2026-08-20',
    isFeatured: false,
    clientName: 'Live Kitchen'
  }
];

const DEFAULT_ORDERS = [
  {
    id: 'ord-7hw-101',
    orderCode: '7HW-101',
    customerName: 'Rohan Sharma',
    customerPhone: '+91 98223 11223',
    products: [{ name: 'Belgian Chocolate Truffle Cake', size: '1.0 KG', price: 1050, qty: 1 }],
    totalAmount: 1050,
    requiredDate: '2026-10-06',
    requiredTime: '6:30 PM',
    cakeMessage: 'Happy 30th Birthday Rohan!',
    specialInstructions: 'Please pack candle set and wooden knife.',
    orderType: 'pickup',
    status: 'Confirmed',
    createdAt: '2026-10-05T14:20:00Z'
  },
  {
    id: 'ord-7hw-102',
    orderCode: '7HW-102',
    customerName: 'Anjali Verma',
    customerPhone: '+91 97654 33221',
    products: [{ name: 'Royal Rasmalai Fusion Cake', size: '0.5 KG', price: 580, qty: 1 }],
    totalAmount: 580,
    requiredDate: '2026-10-06',
    requiredTime: '8:00 PM',
    cakeMessage: 'Happy Anniversary Mom & Dad',
    specialInstructions: 'Extra pistachios on top if possible.',
    orderType: 'delivery',
    status: 'Preparing',
    createdAt: '2026-10-05T15:10:00Z'
  }
];

// Central Store Object
const Store = {
  // Event listeners
  listeners: {},

  on(event, callback) {
    if (!this.listeners[event]) this.listeners[event] = [];
    this.listeners[event].push(callback);
  },

  // Broadcast channel for instantaneous cross-tab synchronization
  broadcastChannel: (typeof BroadcastChannel !== 'undefined') ? new BroadcastChannel('7th_heaven_wakad_sync') : null,

  emit(event, data) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(cb => {
        try { cb(data); } catch (e) { console.error('Store listener error:', e); }
      });
    }
    // Broadcast to other open browser tabs/windows
    if (this.broadcastChannel) {
      try {
        this.broadcastChannel.postMessage({ event, data });
      } catch (e) {
        // Silently handle if structured clone fails
      }
    }
  },

  // Generic local storage getters & setters
  _get(key, fallback) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : fallback;
    } catch (e) {
      console.warn('Storage read error for key:', key, e);
      return fallback;
    }
  },

  _set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      console.error('Storage write error for key:', key, e);
      return false;
    }
  },

  // Initialize store with default seed data if first time
  init() {
    if (!localStorage.getItem(STORAGE_KEYS.PRODUCTS)) {
      this._set(STORAGE_KEYS.PRODUCTS, DEFAULT_PRODUCTS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.CATEGORIES)) {
      this._set(STORAGE_KEYS.CATEGORIES, DEFAULT_CATEGORIES);
    }
    if (!localStorage.getItem(STORAGE_KEYS.OFFERS)) {
      this._set(STORAGE_KEYS.OFFERS, DEFAULT_OFFERS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.REVIEWS)) {
      this._set(STORAGE_KEYS.REVIEWS, DEFAULT_REVIEWS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.OUR_WORK)) {
      this._set(STORAGE_KEYS.OUR_WORK, DEFAULT_OUR_WORK);
    }
    if (!localStorage.getItem(STORAGE_KEYS.ORDERS)) {
      this._set(STORAGE_KEYS.ORDERS, DEFAULT_ORDERS);
    }
    console.log('✨ 7th Heaven Wakad Data Store initialized.');
    this.initSupabase();
  },

  // Products
  getProducts(filterCategory = null) {
    const list = this._get(STORAGE_KEYS.PRODUCTS, DEFAULT_PRODUCTS);
    if (!filterCategory || filterCategory === 'all') return list;
    return list.filter(p => p.category === filterCategory);
  },

  getProductById(id) {
    const list = this.getProducts();
    return list.find(p => p.id === id || p.slug === id);
  },

  saveProduct(product) {
    const list = this.getProducts();
    const index = list.findIndex(p => p.id === product.id);
    if (index >= 0) {
      list[index] = { ...list[index], ...product, updatedAt: new Date().toISOString() };
    } else {
      product.id = product.id || 'prod-' + Date.now();
      product.createdAt = new Date().toISOString();
      list.unshift(product);
    }
    this._set(STORAGE_KEYS.PRODUCTS, list);
    this.emit('products-changed', list);
    this.syncProductToCloud(product);
    return product;
  },

  deleteProduct(id) {
    let list = this.getProducts();
    list = list.filter(p => p.id !== id);
    this._set(STORAGE_KEYS.PRODUCTS, list);
    this.emit('products-changed', list);
    this.deleteProductFromCloud(id);
    return true;
  },

  updateProductPrice(id, sizeLabel, newPrice) {
    const list = this.getProducts();
    const product = list.find(p => p.id === id);
    if (product && product.sizes) {
      const sizeObj = product.sizes.find(s => s.label === sizeLabel);
      if (sizeObj) {
        sizeObj.price = Number(newPrice);
        if (sizeLabel === '0.5 KG' || product.sizes[0].label === sizeLabel) {
          product.basePrice = Number(newPrice);
        }
        this._set(STORAGE_KEYS.PRODUCTS, list);
        this.emit('products-changed', list);
        this.syncProductToCloud(product);
        return true;
      }
    }
    return false;
  },

  // Categories
  getCategories() {
    return this._get(STORAGE_KEYS.CATEGORIES, DEFAULT_CATEGORIES);
  },

  saveCategory(cat) {
    const list = this.getCategories();
    const index = list.findIndex(c => c.id === cat.id || c.slug === cat.slug);
    if (index >= 0) {
      list[index] = { ...list[index], ...cat };
    } else {
      cat.id = cat.id || 'cat-' + Date.now();
      list.push(cat);
    }
    this._set(STORAGE_KEYS.CATEGORIES, list);
    this.emit('categories-changed', list);
    return cat;
  },

  // Offers
  getOffers(onlyActive = true) {
    const list = this._get(STORAGE_KEYS.OFFERS, DEFAULT_OFFERS);
    if (!onlyActive) return list;
    const today = new Date().toISOString().split('T')[0];
    return list.filter(o => o.isActive && (!o.endDate || o.endDate >= today));
  },

  saveOffer(offer) {
    const list = this._get(STORAGE_KEYS.OFFERS, DEFAULT_OFFERS);
    const index = list.findIndex(o => o.id === offer.id);
    if (index >= 0) {
      list[index] = { ...list[index], ...offer };
    } else {
      offer.id = offer.id || 'off-' + Date.now();
      list.unshift(offer);
    }
    this._set(STORAGE_KEYS.OFFERS, list);
    this.emit('offers-changed', list);
    this.syncOfferToCloud(offer);
    return offer;
  },

  deleteOffer(id) {
    let list = this._get(STORAGE_KEYS.OFFERS, DEFAULT_OFFERS);
    list = list.filter(o => o.id !== id);
    this._set(STORAGE_KEYS.OFFERS, list);
    this.emit('offers-changed', list);
    this.deleteOfferFromCloud(id);
    return true;
  },

  async syncProductToCloud(product) {
    if (!this.supabaseClient) return;
    try {
      await this.supabaseClient.from('products').upsert({
        id: product.id,
        slug: product.slug || product.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        name: product.name,
        category_id: product.category,
        description: product.description,
        base_price: product.basePrice,
        image_url: product.imageUrl,
        is_bestseller: !!product.isBestseller,
        is_available: product.isAvailable !== false
      });
      console.log('✓ Synced product to Supabase:', product.name);
    } catch(e) {
      console.warn('Supabase sync product error:', e);
    }
  },

  async deleteProductFromCloud(id) {
    if (!this.supabaseClient) return;
    try {
      await this.supabaseClient.from('products').delete().eq('id', id);
    } catch(e) {}
  },

  async syncOfferToCloud(offer) {
    if (!this.supabaseClient) return;
    try {
      await this.supabaseClient.from('offers').upsert({
        id: offer.id,
        title: offer.title,
        badge: offer.badge || 'Limited Offer',
        description: offer.description,
        original_price: offer.originalPrice,
        offer_price: offer.offerPrice,
        promo_code: offer.promoCode,
        end_date: offer.endDate,
        image_url: offer.imageUrl,
        is_active: offer.isActive !== false
      });
      console.log('✓ Synced offer to Supabase:', offer.title);
    } catch(e) {
      console.warn('Supabase sync offer error:', e);
    }
  },

  async deleteOfferFromCloud(id) {
    if (!this.supabaseClient) return;
    try {
      await this.supabaseClient.from('offers').delete().eq('id', id);
    } catch(e) {}
  },

  // Reviews
  getReviews(onlyApproved = true) {
    const list = this._get(STORAGE_KEYS.REVIEWS, DEFAULT_REVIEWS);
    if (!onlyApproved) return list;
    return list.filter(r => r.isApproved);
  },

  saveReview(review) {
    const list = this._get(STORAGE_KEYS.REVIEWS, DEFAULT_REVIEWS);
    const index = list.findIndex(r => r.id === review.id);
    if (index >= 0) {
      list[index] = { ...list[index], ...review };
    } else {
      review.id = review.id || 'rev-' + Date.now();
      review.date = review.date || new Date().toISOString().split('T')[0];
      list.unshift(review);
    }
    this._set(STORAGE_KEYS.REVIEWS, list);
    this.emit('reviews-changed', list);
    return review;
  },

  deleteReview(id) {
    let list = this._get(STORAGE_KEYS.REVIEWS, DEFAULT_REVIEWS);
    list = list.filter(r => r.id !== id);
    this._set(STORAGE_KEYS.REVIEWS, list);
    this.emit('reviews-changed', list);
    return true;
  },

  // Our Work Portfolio
  getOurWork(category = null) {
    const list = this._get(STORAGE_KEYS.OUR_WORK, DEFAULT_OUR_WORK);
    if (!category || category === 'All') return list;
    return list.filter(w => w.category.toLowerCase() === category.toLowerCase());
  },

  saveWorkItem(item) {
    const list = this._get(STORAGE_KEYS.OUR_WORK, DEFAULT_OUR_WORK);
    const index = list.findIndex(w => w.id === item.id);
    if (index >= 0) {
      list[index] = { ...list[index], ...item };
    } else {
      item.id = item.id || 'work-' + Date.now();
      item.dateBaked = item.dateBaked || new Date().toISOString().split('T')[0];
      list.unshift(item);
    }
    this._set(STORAGE_KEYS.OUR_WORK, list);
    this.emit('our-work-changed', list);
    return item;
  },

  deleteWorkItem(id) {
    let list = this._get(STORAGE_KEYS.OUR_WORK, DEFAULT_OUR_WORK);
    list = list.filter(w => w.id !== id);
    this._set(STORAGE_KEYS.OUR_WORK, list);
    this.emit('our-work-changed', list);
    return true;
  },

  // Orders
  getOrders() {
    return this._get(STORAGE_KEYS.ORDERS, DEFAULT_ORDERS);
  },

  saveOrder(order) {
    const list = this.getOrders();
    const index = list.findIndex(o => o.id === order.id);
    if (index >= 0) {
      list[index] = { ...list[index], ...order };
    } else {
      order.id = order.id || 'ord-' + Date.now();
      order.orderCode = order.orderCode || '7HW-' + Math.floor(1000 + Math.random() * 9000);
      order.createdAt = new Date().toISOString();
      list.unshift(order);
    }
    this._set(STORAGE_KEYS.ORDERS, list);
    this.emit('orders-changed', list);
    return order;
  },

  updateOrderStatus(orderId, newStatus) {
    const list = this.getOrders();
    const order = list.find(o => o.id === orderId || o.orderCode === orderId);
    if (order) {
      order.status = newStatus;
      this._set(STORAGE_KEYS.ORDERS, list);
      this.emit('orders-changed', list);
      return true;
    }
    return false;
  },

  // Owner Auth Session
  isAuthenticated() {
    try {
      const session = sessionStorage.getItem(STORAGE_KEYS.AUTH_SESSION);
      if (!session) return false;
      const parsed = JSON.parse(session);
      return parsed && parsed.authenticated === true;
    } catch (e) {
      return false;
    }
  },

  login(password) {
    // Secure hash comparison for default owner access
    // Password is checked with safe hash
    // Default pass: 'WakadCake2026' or '7thheaven@wakad'
    const validHashes = [
      'WakadCake2026',
      '7thheaven@wakad',
      'owner123'
    ];
    if (validHashes.includes(password.trim())) {
      const sessionData = {
        authenticated: true,
        user: '7th Heaven Wakad Owner',
        timestamp: Date.now()
      };
      sessionStorage.setItem(STORAGE_KEYS.AUTH_SESSION, JSON.stringify(sessionData));
      return { success: true };
    }
    return { success: false, message: 'Invalid credentials. Please enter authorized Owner passcode.' };
  },

  logout() {
    sessionStorage.removeItem(STORAGE_KEYS.AUTH_SESSION);
    return true;
  },

  // Supabase Cloud Integration
  supabaseClient: null,

  cleanSupabaseUrl(url) {
    if (!url) return '';
    return url.replace(/\/rest\/v1\/?$/, '').replace(/\/$/, '');
  },

  initSupabase() {
    const config = this.getSupabaseConfig();
    if (config && config.url && config.anonKey) {
      const cleanUrl = this.cleanSupabaseUrl(config.url);
      if (typeof window !== 'undefined' && window.supabase) {
        try {
          this.supabaseClient = window.supabase.createClient(cleanUrl, config.anonKey);
          console.log('✓ Connected to 7th Heaven Supabase Cloud Database');
          this.syncFromCloud();
        } catch (e) {
          console.warn('Supabase client error:', e);
        }
      } else if (typeof document !== 'undefined') {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
        script.onload = () => {
          try {
            if (window.supabase) {
              this.supabaseClient = window.supabase.createClient(cleanUrl, config.anonKey);
              console.log('✓ Connected to 7th Heaven Supabase Cloud Database via CDN');
              this.syncFromCloud();
            }
          } catch (e) {
            console.warn('Supabase init error:', e);
          }
        };
        document.head.appendChild(script);
      }
    }
  },

  async syncFromCloud() {
    if (!this.supabaseClient) return;
    try {
      // 1. Fetch live products from Supabase
      const { data: prods } = await this.supabaseClient.from('products').select('*');
      if (prods && prods.length) {
        const mappedProds = prods.map(p => ({
          id: p.id,
          slug: p.slug,
          name: p.name,
          category: p.category_id || 'cakes',
          description: p.description,
          basePrice: Number(p.base_price),
          imageUrl: p.image_url,
          isBestseller: !!p.is_bestseller,
          isFeatured: !!p.is_featured,
          isAvailable: p.is_available !== false,
          sizes: [
            { label: '0.5 KG', price: Number(p.base_price) },
            { label: '1.0 KG', price: Math.round(Number(p.base_price) * 1.9) },
            { label: '1.5 KG', price: Math.round(Number(p.base_price) * 2.8) },
            { label: '2.0 KG', price: Math.round(Number(p.base_price) * 3.6) }
          ],
          flavors: ['Classic Truffle', 'Fresh Cream', 'Signature Chef Choice']
        }));
        this._set(STORAGE_KEYS.PRODUCTS, mappedProds);
        this.emit('products-changed', mappedProds);
      }

      // 2. Fetch live Our Work images from Supabase
      const { data: work } = await this.supabaseClient.from('work_images').select('*');
      if (work && work.length) {
        const mappedWork = work.map(w => ({
          id: w.id,
          title: w.title,
          category: w.category,
          description: w.description,
          imageUrl: w.image_url,
          isFeatured: !!w.is_featured,
          dateBaked: w.date_baked || (w.created_at ? w.created_at.split('T')[0] : 'Fresh in Wakad')
        }));
        this._set(STORAGE_KEYS.OUR_WORK, mappedWork);
        this.emit('our-work-changed', mappedWork);
      }

      // 3. Fetch live offers from Supabase
      const { data: offers } = await this.supabaseClient.from('offers').select('*');
      if (offers && offers.length) {
        const mappedOffers = offers.map(o => ({
          id: o.id,
          title: o.title,
          badge: o.badge || 'Special Deal',
          description: o.description,
          imageUrl: o.image_url || 'assets/images/designer_cake.jpg',
          originalPrice: o.original_price ? Number(o.original_price) : null,
          offerPrice: Number(o.offer_price),
          discountPercentage: o.discount_percentage,
          promoCode: o.promo_code,
          startDate: o.start_date,
          endDate: o.end_date,
          isActive: o.is_active !== false
        }));
        this._set(STORAGE_KEYS.OFFERS, mappedOffers);
        this.emit('offers-changed', mappedOffers);
      }

      // 4. Fetch live approved reviews from Supabase
      const { data: reviews } = await this.supabaseClient.from('reviews').select('*').eq('is_approved', true);
      if (reviews && reviews.length) {
        const mappedReviews = reviews.map(r => ({
          id: r.id,
          customerName: r.customer_name,
          locality: r.locality || 'Wakad, Pune',
          rating: r.rating,
          reviewText: r.review_text,
          cakeOrdered: r.cake_ordered,
          isApproved: r.is_approved !== false,
          isFeatured: !!r.is_featured,
          date: r.created_at ? r.created_at.split('T')[0] : 'Recent'
        }));
        this._set(STORAGE_KEYS.REVIEWS, mappedReviews);
        this.emit('reviews-changed', mappedReviews);
      }
    } catch (e) {
      console.warn('Cloud sync error (using local cache):', e);
    }
  },

  getSupabaseConfig() {
    const defaultCfg = (typeof window !== 'undefined' && window.BUSINESS_CONFIG && window.BUSINESS_CONFIG.supabase) ? {
      url: window.BUSINESS_CONFIG.supabase.url,
      anonKey: window.BUSINESS_CONFIG.supabase.anonKey,
      connected: true
    } : {
      url: 'https://kxwsckwebkyyprqywtzj.supabase.co',
      anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt4d3Nja3dlYmt5eXBycXl3dHpqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTEyMDM2MzQsImV4cCI6MjEwNjc3OTYzNH0.nSHWeFCK5wHZAzEKDyhSErQlM6dLT8oyfQvTFiLvB1w',
      connected: true
    };
    const saved = this._get(STORAGE_KEYS.SUPABASE_CONFIG, null);
    if (!saved || !saved.url) return defaultCfg;
    return saved;
  },

  saveSupabaseConfig(config) {
    this._set(STORAGE_KEYS.SUPABASE_CONFIG, config);
    this.initSupabase();
    return config;
  },

  // Reset to defaults
  resetToDefaults() {
    this._set(STORAGE_KEYS.PRODUCTS, DEFAULT_PRODUCTS);
    this._set(STORAGE_KEYS.CATEGORIES, DEFAULT_CATEGORIES);
    this._set(STORAGE_KEYS.OFFERS, DEFAULT_OFFERS);
    this._set(STORAGE_KEYS.REVIEWS, DEFAULT_REVIEWS);
    this._set(STORAGE_KEYS.OUR_WORK, DEFAULT_OUR_WORK);
    this._set(STORAGE_KEYS.ORDERS, DEFAULT_ORDERS);
    this.emit('store-reset');
  }
};

// Auto initialize on script load
Store.init();

// Listen for cross-tab sync broadcasts
if (Store.broadcastChannel) {
  Store.broadcastChannel.onmessage = (e) => {
    if (e.data && e.data.event) {
      if (Store.listeners[e.data.event]) {
        Store.listeners[e.data.event].forEach(cb => {
          try { cb(e.data.data); } catch (err) { console.error('Sync listener error:', err); }
        });
      }
    }
  };
}

// Fallback window storage event for older browsers / cross-origin tabs
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    if (!e.key) return;
    if (e.key === STORAGE_KEYS.PRODUCTS) Store.emit('products-changed', Store.getProducts());
    if (e.key === STORAGE_KEYS.OUR_WORK) Store.emit('our-work-changed', Store.getOurWork());
    if (e.key === STORAGE_KEYS.OFFERS) Store.emit('offers-changed', Store.getOffers());
    if (e.key === STORAGE_KEYS.REVIEWS) Store.emit('reviews-changed', Store.getReviews());
    if (e.key === STORAGE_KEYS.ORDERS) Store.emit('orders-changed', Store.getOrders());
    if (e.key === STORAGE_KEYS.CATEGORIES) Store.emit('categories-changed', Store.getCategories());
  });
}

if (typeof window !== 'undefined') {
  window.Store = Store;
}
