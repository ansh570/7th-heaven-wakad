/**
 * 7th Heaven Wakad - The Cake Shop
 * Business Configuration & Exact Google Maps Metadata
 * Location: Austin Plaza, Mhatoba Chowk, Kaspate Wasti, Wakad, Pune
 */

const BUSINESS_CONFIG = {
  name: "7th Heaven Wakad - The Cake Shop",
  brandShort: "7th Heaven Wakad",
  tagline: "Made With Love. Crafted For Every Celebration.",
  subTagline: "Wakad's Premier 100% Pure Veg Live Kitchen Bakery • Fresh Cakes in Just 7 Minutes",
  
  // Exact Google Maps Location & Contact
  phone: "+91 90220 40850",
  phoneRaw: "+919022040850",
  phoneDisplay: "090220 40850",
  whatsapp: "919022040850",
  whatsappUrl: "https://wa.me/919022040850",
  
  address: {
    line1: "Shop No. 109, Austin Plaza, Mhatoba Chowk",
    line2: "Chhatrapati Chowk Road, Kaspate Wasti",
    locality: "Wakad",
    city: "Pune",
    state: "Maharashtra",
    pincode: "411057",
    full: "Shop No. 109, Austin Plaza, Mhatoba Chowk, Chhatrapati Chowk Road, Kaspate Wasti, Wakad, Pune, Maharashtra 411057"
  },
  
  coordinates: {
    latitude: 18.5950839,
    longitude: 73.7687737
  },
  
  googleMapsUrl: "https://www.google.com/maps/place/7th+Heaven+Wakad+-+The+Cake+Shop/@18.595089,73.7661988,17z/data=!3m1!5s0x3bc2b96b0e6fcc7f:0x1b0c14969dad22a6!4m6!3m5!1s0x3bc2b96ac78e29e1:0x4dde9d5052f65018!8m2!3d18.5950839!4d73.7687737!16s%2Fg%2F11pq31p74_?entry=ttu",
  googleMapsDirectionsUrl: "https://www.google.com/maps/dir/?api=1&destination=18.5950839,73.7687737",
  
  openingHours: {
    display: "9:30 AM – 11:00 PM",
    days: "Monday – Sunday (All 7 Days)",
    note: "Live Kitchen Open Everyday"
  },
  
  social: {
    instagram: "https://www.instagram.com/7thheaven_wakad/",
    facebook: "https://www.facebook.com/7thheavenwakad/",
    googleReview: "https://www.google.com/maps/place/7th+Heaven+Wakad+-+The+Cake+Shop/@18.595089,73.7661988,17z/data=!3m1!5s0x3bc2b96b0e6fcc7f:0x1b0c14969dad22a6!4m6!3m5!1s0x3bc2b96ac78e29e1:0x4dde9d5052f65018!8m2!3d18.5950839!4d73.7687737!16s%2Fg%2F11pq31p74_?entry=ttu"
  },
  
  features: [
    { title: "Live Kitchen in 7 Mins", desc: "Freshly whipped and customized right before your eyes in 7 minutes flat." },
    { title: "100% Pure Vegetarian", desc: "Strictly eggless bakery craftsmanship with uncompromising gourmet taste." },
    { title: "1,000+ Custom Cake Designs", desc: "Fondant, 3D, pull-me-up, photo cakes, tier cakes & customized celebration themes." },
    { title: "Belgian Chocolate & Premium Creams", desc: "Imported cocoa, farm-fresh fruit compotes, and silky dairy creams." },
    { title: "Same-Day Delivery in Wakad", desc: "Doorstep delivery across Wakad, Hinjewadi, Pimple Saudagar & Ravet." }
  ],
  
  // Supabase Cloud Configuration
  supabase: {
    url: "https://kxwsckwebkyyprqywtzj.supabase.co",
    anonKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt4d3Nja3dlYmt5eXBycXl3dHpqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTEyMDM2MzQsImV4cCI6MjEwNjc3OTYzNH0.nSHWeFCK5wHZAzEKDyhSErQlM6dLT8oyfQvTFiLvB1w"
  },

  stats: [
    { label: "Happy Wakad Families", value: 45000, suffix: "+" },
    { label: "Google Rating", value: 4.8, suffix: " ★" },
    { label: "Live Cake Prep Time", value: 7, suffix: " Mins" },
    { label: "Celebration Flavors", value: 60, suffix: "+" }
  ]
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = BUSINESS_CONFIG;
}
