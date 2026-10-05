/**
 * 7th Heaven Wakad - Interactive Cake Customizer & Configurator
 * Calculates live prices, weights, flavors, dates, and triggers instant WhatsApp Orders
 */

const CakeBuilder = {
  selectedCake: null,
  selectedSize: null,
  selectedFlavor: null,
  quantity: 1,

  init() {
    const products = window.Store ? window.Store.getProducts('cakes') : [];
    if (!products.length) return;

    this.selectedCake = products[0];
    this.selectedSize = this.selectedCake.sizes ? this.selectedCake.sizes[0] : { label: '0.5 KG', price: this.selectedCake.basePrice };
    this.selectedFlavor = (this.selectedCake.flavors && this.selectedCake.flavors[0]) || 'Chef Special';

    this.renderCakesList(products);
    this.renderBuilderView();
    this.attachEventListeners();
  },

  renderCakesList(products) {
    const listContainer = document.getElementById('cakes-product-grid');
    if (!listContainer) return;

    listContainer.innerHTML = products.map(product => `
      <div class="product-card reveal ${product.id === this.selectedCake.id ? 'active-selection' : ''}" id="card-${product.id}">
        <div class="product-img-wrap">
          <div class="product-badge-wrap">
            ${product.isBestseller ? '<span class="badge-tag badge-bestseller">★ Bestseller</span>' : ''}
            <span class="badge-tag badge-veg"><span class="veg-icon"></span> 100% Veg</span>
          </div>
          <img src="${product.imageUrl}" alt="${product.name}" class="product-img" loading="lazy" onerror="this.src='assets/images/hero_cake.jpg'">
        </div>
        <div class="product-body">
          <div class="product-category">Pure Veg Live Kitchen</div>
          <h3 class="product-title">${product.name}</h3>
          <p class="product-desc">${product.description}</p>
          <div class="product-footer">
            <div class="product-price-box">
              <span class="price-label">Starting From</span>
              <span class="product-price">₹${product.basePrice}</span>
            </div>
            <div class="product-actions">
              <button class="btn btn-secondary btn-card-order" onclick="CakeBuilder.selectCake('${product.id}')">Customize</button>
              <button class="btn btn-whatsapp btn-card-order" onclick="WhatsAppService.openOrderModal(Store.getProductById('${product.id}'))">Order</button>
            </div>
          </div>
        </div>
      </div>
    `).join('');
  },

  selectCake(productId) {
    const cake = window.Store.getProductById(productId);
    if (!cake) return;
    this.selectedCake = cake;
    this.selectedSize = cake.sizes ? cake.sizes[0] : { label: '0.5 KG', price: cake.basePrice };
    this.selectedFlavor = (cake.flavors && cake.flavors[0]) || 'Chef Special';
    this.renderBuilderView();

    const builderSection = document.getElementById('cake-builder-section');
    if (builderSection) {
      builderSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  },

  renderBuilderView() {
    const previewWrap = document.getElementById('builder-preview-container');
    if (!previewWrap || !this.selectedCake) return;

    const cake = this.selectedCake;
    const sizes = cake.sizes || [
      { label: '0.5 KG', price: cake.basePrice },
      { label: '1.0 KG', price: cake.basePrice * 1.9 },
      { label: '1.5 KG', price: cake.basePrice * 2.8 },
      { label: '2.0 KG', price: cake.basePrice * 3.6 }
    ];
    const flavors = cake.flavors || ['Belgian Dark Ganache', 'Swiss Milk Chocolate', 'Hazelnut Crunch'];
    const today = new Date().toISOString().split('T')[0];

    previewWrap.innerHTML = `
      <div class="cake-builder-grid">
        <!-- Left: Dynamic Visual Preview -->
        <div class="builder-preview-card">
          <div class="builder-img-wrap">
            <img src="${cake.imageUrl}" alt="${cake.name}" class="builder-img" id="builder-main-img" onerror="this.src='assets/images/hero_cake.jpg'">
          </div>
          <span class="badge-tag badge-veg" style="display:inline-flex; margin-bottom: 0.8rem;">
            <span class="veg-icon"></span> Pure Veg Live Kitchen
          </span>
          <h3 id="builder-name" style="margin-bottom: 0.4rem;">${cake.name}</h3>
          <p id="builder-desc" style="font-size: 0.88rem; margin-bottom: 1rem;">${cake.description}</p>
          <div class="price-label">Configured Total Price</div>
          <div class="builder-total-price" id="builder-live-total">₹${this.selectedSize.price * this.quantity}</div>
          <div style="font-size: 0.8rem; color: var(--gold-300); margin-top: 0.4rem;">⚡ Prepared Fresh in 7 Mins at Austin Plaza, Wakad</div>
        </div>

        <!-- Right: Interactive Options -->
        <div class="builder-controls">
          <div class="section-badge">Step 1: Choose Cake Base</div>
          <div class="form-group" style="margin-bottom: 1.8rem;">
            <label>Select Cake</label>
            <select id="builder-cake-select" onchange="CakeBuilder.selectCake(this.value)">
              ${(window.Store ? window.Store.getProducts('cakes') : []).map(p => `
                <option value="${p.id}" ${p.id === cake.id ? 'selected' : ''}>${p.name} (from ₹${p.basePrice})</option>
              `).join('')}
            </select>
          </div>

          <div class="section-badge">Step 2: Choose Weight / Size</div>
          <div class="form-group" style="margin-bottom: 1.8rem;">
            <label>Weight (KG)</label>
            <div class="builder-pills-group" id="size-pills">
              ${sizes.map(s => `
                <button type="button" class="builder-pill ${s.label === this.selectedSize.label ? 'active' : ''}" 
                  onclick="CakeBuilder.setSize('${s.label}', ${s.price})">
                  ${s.label} — ₹${s.price}
                </button>
              `).join('')}
            </div>
          </div>

          <div class="section-badge">Step 3: Choose Flavor Profile</div>
          <div class="form-group" style="margin-bottom: 1.8rem;">
            <label>Flavor / Filling</label>
            <div class="builder-pills-group" id="flavor-pills">
              ${flavors.map(f => `
                <button type="button" class="builder-pill ${f === this.selectedFlavor ? 'active' : ''}" 
                  onclick="CakeBuilder.setFlavor('${f}')">
                  ${f}
                </button>
              `).join('')}
            </div>
          </div>

          <div class="section-badge">Step 4: Personalize & Schedule</div>
          <div class="form-grid" style="margin-bottom: 1.5rem;">
            <div class="form-group">
              <label>Quantity</label>
              <input type="number" id="builder-qty" min="1" max="10" value="${this.quantity}" onchange="CakeBuilder.setQty(this.value)">
            </div>
            <div class="form-group">
              <label>Your Name *</label>
              <input type="text" id="builder-cust-name" placeholder="Enter your full name" required>
            </div>
            <div class="form-group">
              <label>Required Date *</label>
              <input type="date" id="builder-date" min="${today}" value="${today}" required>
            </div>
            <div class="form-group">
              <label>Required Time *</label>
              <select id="builder-time">
                <option value="11:30 AM">11:30 AM</option>
                <option value="2:00 PM">2:00 PM</option>
                <option value="4:30 PM">4:30 PM</option>
                <option value="6:30 PM" selected>6:30 PM</option>
                <option value="8:00 PM">8:00 PM</option>
                <option value="9:30 PM">9:30 PM</option>
              </select>
            </div>
          </div>

          <div class="form-group full-width" style="margin-bottom: 1.5rem;">
            <label>Message on Cake (e.g. 'Happy Birthday Kavya')</label>
            <input type="text" id="builder-msg" placeholder="Write text to pipe on cake icing...">
          </div>

          <div class="form-group full-width" style="margin-bottom: 2rem;">
            <label>Special Instructions</label>
            <textarea id="builder-instructions" rows="2" placeholder="e.g. Less sweetness, extra candles, allergen note"></textarea>
          </div>

          <button class="btn btn-whatsapp" style="width: 100%; font-size: 1.1rem; padding: 1.1rem;" onclick="CakeBuilder.submitToWhatsApp()">
            <span>Generate & Send WhatsApp Order</span>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z"/>
            </svg>
          </button>
        </div>
      </div>
    `;
  },

  setSize(label, price) {
    this.selectedSize = { label, price };
    this.updateTotal();
    document.querySelectorAll('#size-pills .builder-pill').forEach(btn => {
      btn.classList.toggle('active', btn.innerText.includes(label));
    });
  },

  setFlavor(flavor) {
    this.selectedFlavor = flavor;
    document.querySelectorAll('#flavor-pills .builder-pill').forEach(btn => {
      btn.classList.toggle('active', btn.innerText.trim() === flavor);
    });
  },

  setQty(qty) {
    this.quantity = Math.max(1, parseInt(qty) || 1);
    this.updateTotal();
  },

  updateTotal() {
    const totalEl = document.getElementById('builder-live-total');
    if (totalEl && this.selectedSize) {
      totalEl.innerText = `₹${this.selectedSize.price * this.quantity}`;
    }
  },

  submitToWhatsApp() {
    const nameInput = document.getElementById('builder-cust-name');
    const customerName = nameInput ? nameInput.value.trim() : '';

    if (!customerName) {
      alert('Please enter your name for the order.');
      if (nameInput) nameInput.focus();
      return;
    }

    const details = {
      productName: this.selectedCake.name,
      size: this.selectedSize.label,
      flavor: this.selectedFlavor,
      quantity: this.quantity,
      price: this.selectedSize.price * this.quantity,
      requiredDate: document.getElementById('builder-date').value,
      requiredTime: document.getElementById('builder-time').value,
      cakeMessage: document.getElementById('builder-msg').value,
      customerName: customerName,
      specialInstructions: document.getElementById('builder-instructions').value,
      orderType: 'Store Pickup / Wakad Delivery'
    };

    // Save order in Store
    if (window.Store) {
      window.Store.saveOrder({
        customerName: details.customerName,
        customerPhone: 'Provided via WhatsApp',
        products: [{ name: details.productName, size: details.size, price: details.price, qty: details.quantity }],
        totalAmount: details.price,
        requiredDate: details.requiredDate,
        requiredTime: details.requiredTime,
        cakeMessage: details.cakeMessage,
        specialInstructions: details.specialInstructions,
        status: 'New'
      });
    }

    const message = window.WhatsAppService.buildOrderMessage(details);
    const url = window.WhatsAppService.generateUrl(message);
    window.open(url, '_blank');
  },

  attachEventListeners() {
    // Listen for Store updates
    if (window.Store) {
      window.Store.on('products-changed', (products) => {
        const cakes = products.filter(p => p.category === 'cakes');
        this.renderCakesList(cakes);
      });
    }
  }
};

window.CakeBuilder = CakeBuilder;
