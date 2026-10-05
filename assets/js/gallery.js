/**
 * 7th Heaven Wakad - Our Work Gallery & Fullscreen Lightbox
 * Dynamic rendering from Store, category filtering, lightbox navigation
 */

const GalleryService = {
  currentCategory: 'All',
  currentIndex: 0,
  activeItems: [],

  init() {
    this.renderCategoryTabs();
    this.loadWorkGallery('All');
    this.setupLightbox();
    this.attachEventListeners();
  },

  renderCategoryTabs() {
    const tabsContainer = document.getElementById('gallery-category-tabs');
    if (!tabsContainer) return;

    const categories = [
      'All',
      'Birthday Cakes',
      'Custom Cakes',
      'Designer Cakes',
      'Anniversary Cakes',
      'Theme Cakes',
      'Pastries',
      'Celebrations',
      'Bakery'
    ];

    tabsContainer.innerHTML = categories.map(cat => `
      <button class="filter-btn ${cat === this.currentCategory ? 'active' : ''}" 
        onclick="GalleryService.filterCategory('${cat}', this)">
        ${cat}
      </button>
    `).join('');
  },

  filterCategory(category, btnEl) {
    this.currentCategory = category;
    document.querySelectorAll('#gallery-category-tabs .filter-btn').forEach(btn => btn.classList.remove('active'));
    if (btnEl) btnEl.classList.add('active');
    this.loadWorkGallery(category);
  },

  loadWorkGallery(category = 'All') {
    const container = document.getElementById('gallery-masonry-grid');
    if (!container) return;

    const items = window.Store ? window.Store.getOurWork(category) : [];
    this.activeItems = items;

    if (!items.length) {
      container.innerHTML = `
        <div style="text-align: center; padding: 4rem; color: var(--cream-muted); grid-column: 1/-1;">
          <p>No creations found in "${category}". Explore other categories!</p>
        </div>
      `;
      return;
    }

    container.innerHTML = items.map((item, index) => `
      <div class="gallery-item reveal" onclick="GalleryService.openLightbox(${index})">
        <img src="${item.imageUrl}" alt="${item.title}" class="gallery-img" loading="lazy" onerror="this.src='assets/images/hero_cake.jpg'">
        <div class="gallery-overlay">
          <span class="gallery-category">${item.category}</span>
          <h4 class="gallery-title">${item.title}</h4>
          <span class="gallery-date">Baked: ${item.dateBaked || 'Fresh in Wakad'}</span>
        </div>
      </div>
    `).join('');

    // Trigger scroll animations for new elements
    if (window.initScrollAnimations) {
      window.initScrollAnimations();
    }
  },

  setupLightbox() {
    let modal = document.getElementById('gallery-lightbox-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'gallery-lightbox-modal';
      modal.className = 'lightbox-modal';
      modal.innerHTML = `
        <button class="lightbox-close" onclick="GalleryService.closeLightbox()">&times;</button>
        <div class="lightbox-content">
          <div class="lightbox-img-wrap">
            <img src="" alt="" class="lightbox-img" id="lightbox-current-img">
          </div>
          <div class="lightbox-details">
            <div>
              <span class="gallery-category" id="lightbox-cat">Category</span>
              <h3 id="lightbox-title" style="margin-bottom: 0.3rem;">Creation Title</h3>
              <p id="lightbox-desc" style="font-size: 0.88rem; margin: 0; color: var(--cream-muted);">Description</p>
            </div>
            <div style="display: flex; gap: 0.8rem;">
              <button class="btn btn-whatsapp" id="lightbox-enquire-btn">
                <span>Order Similar on WhatsApp</span>
              </button>
            </div>
          </div>
        </div>
      `;
      document.body.appendChild(modal);

      modal.addEventListener('click', (e) => {
        if (e.target === modal) this.closeLightbox();
      });

      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') this.closeLightbox();
      });
    }
  },

  openLightbox(index) {
    if (!this.activeItems[index]) return;
    this.currentIndex = index;
    const item = this.activeItems[index];

    const modal = document.getElementById('gallery-lightbox-modal');
    const img = document.getElementById('lightbox-current-img');
    const cat = document.getElementById('lightbox-cat');
    const title = document.getElementById('lightbox-title');
    const desc = document.getElementById('lightbox-desc');
    const enquireBtn = document.getElementById('lightbox-enquire-btn');

    img.src = item.imageUrl;
    img.alt = item.title;
    cat.innerText = item.category;
    title.innerText = item.title;
    desc.innerText = item.description || 'Handcrafted fresh at 7th Heaven Wakad.';

    enquireBtn.onclick = () => {
      const msg = `Hello 7th Heaven Wakad, I am interested in ordering a cake similar to your gallery work: "${item.title}" (${item.category}). Please share pricing and details.`;
      window.open(window.WhatsAppService.generateUrl(msg), '_blank');
    };

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  },

  closeLightbox() {
    const modal = document.getElementById('gallery-lightbox-modal');
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  },

  attachEventListeners() {
    if (window.Store) {
      window.Store.on('our-work-changed', () => {
        this.loadWorkGallery(this.currentCategory);
      });
    }
  }
};

window.GalleryService = GalleryService;
