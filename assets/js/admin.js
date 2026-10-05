/**
 * 7th Heaven Wakad - Owner Dashboard Control Engine
 * Location: Austin Plaza, Mhatoba Chowk, Kaspate Wasti, Wakad
 * Full CRUD, Phone Image Upload, Client Compression, Price Matrix, Supabase Sync
 */

const BAKERY_SAMPLE_PHOTOS = [
  { name: 'Belgian Truffle', url: 'assets/images/belgian_truffle.jpg' },
  { name: 'Red Velvet', url: 'assets/images/red_velvet.jpg' },
  { name: 'Lotus Biscoff', url: 'assets/images/lotus_biscoff.jpg' },
  { name: 'Royal Rasmalai', url: 'assets/images/rasmalai_cake.jpg' },
  { name: 'Designer Peony', url: 'assets/images/designer_cake.jpg' },
  { name: 'Ruby Heart Piñata', url: 'assets/images/pinata_cake.jpg' },
  { name: 'Pastries & Sweets', url: 'assets/images/pastries_desserts.jpg' },
  { name: 'Celebration Grand', url: 'assets/images/hero_cake.jpg' },
  { name: 'Live Kitchen Craft', url: 'assets/images/live_kitchen.jpg' }
];

function compressImageHelper(file, maxWidth = 1000, quality = 0.82) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.onerror = () => reject('Failed to load image file');
      img.src = e.target.result;
    };
    reader.onerror = () => reject('Failed to read file');
    reader.readAsDataURL(file);
  });
}

const AdminController = {
  currentTab: 'dashboard',
  uploadedImageBase64: null,
  uploadedProdImageBase64: null,
  uploadedOfferImageBase64: null,

  init() {
    this.checkAuth();
    this.setupNavigation();
    this.setupImageUpload();
    this.populateCategoryDropdown();
    this.setupProductForm();
    this.setupOfferForm();
    this.renderAllData();
  },

  checkAuth() {
    const isAuth = window.Store && window.Store.isAuthenticated();
    const modal = document.getElementById('login-modal');
    if (!isAuth) {
      if (modal) modal.style.display = 'flex';
    } else {
      if (modal) modal.style.display = 'none';
      this.renderMetrics();
    }
  },

  handleLogin(e) {
    if (e) e.preventDefault();
    const passInput = document.getElementById('admin-pass-input');
    const errEl = document.getElementById('login-error-msg');
    const pass = passInput ? passInput.value : '';

    const res = window.Store.login(pass);
    if (res.success) {
      document.getElementById('login-modal').style.display = 'none';
      if (window.showToast) window.showToast('Welcome back, 7th Heaven Store Manager!', 'success');
      this.renderAllData();
    } else {
      if (errEl) {
        errEl.innerText = res.message;
        errEl.style.display = 'block';
      }
    }
  },

  logout() {
    if (confirm('Log out from Owner Dashboard?')) {
      window.Store.logout();
      window.location.reload();
    }
  },

  setupNavigation() {
    const navItems = document.querySelectorAll('.admin-nav-item');
    const sidebar = document.querySelector('.admin-sidebar');
    navItems.forEach(item => {
      item.addEventListener('click', () => {
        const tab = item.getAttribute('data-tab');
        if (tab === 'logout') {
          this.logout();
          return;
        }
        this.switchTab(tab);
        if (sidebar && window.innerWidth <= 900) {
          sidebar.classList.remove('open');
        }
      });
    });

    const mobileToggle = document.getElementById('admin-menu-toggle');
    if (mobileToggle && sidebar) {
      mobileToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        sidebar.classList.toggle('open');
      });

      document.addEventListener('click', (e) => {
        if (window.innerWidth <= 900 && sidebar.classList.contains('open')) {
          if (!sidebar.contains(e.target) && e.target !== mobileToggle) {
            sidebar.classList.remove('open');
          }
        }
      });
    }
  },

  switchTab(tabId) {
    this.currentTab = tabId;
    document.querySelectorAll('.admin-nav-item').forEach(el => {
      el.classList.toggle('active', el.getAttribute('data-tab') === tabId);
    });

    document.querySelectorAll('.admin-panel').forEach(panel => {
      panel.classList.toggle('active', panel.id === `panel-${tabId}`);
    });

    // Close mobile sidebar if open
    const sidebar = document.querySelector('.admin-sidebar');
    if (sidebar) sidebar.classList.remove('open');

    // Refresh data for the active tab
    if (tabId === 'dashboard') this.renderMetrics();
    if (tabId === 'products' || tabId === 'menu') this.renderProductsTable();
    if (tabId === 'prices') this.renderPriceMatrix();
    if (tabId === 'our-work') this.renderOurWorkList();
    if (tabId === 'offers') this.renderOffersTable();
    if (tabId === 'reviews') this.renderReviewsAdmin();
    if (tabId === 'orders') this.renderOrdersTable();
    if (tabId === 'settings') this.renderSettings();
  },

  renderAllData() {
    this.renderMetrics();
    this.renderProductsTable();
    this.renderPriceMatrix();
    this.renderOurWorkList();
    this.renderOffersTable();
    this.renderReviewsAdmin();
    this.renderOrdersTable();
    this.renderSettings();
  },

  // 1. Dashboard Metrics
  renderMetrics() {
    const products = window.Store.getProducts();
    const orders = window.Store.getOrders();
    const workItems = window.Store.getOurWork();
    const reviews = window.Store.getReviews(false);

    const mProducts = document.getElementById('metric-products');
    const mOrders = document.getElementById('metric-orders');
    const mWork = document.getElementById('metric-work');
    const mReviews = document.getElementById('metric-reviews');

    if (mProducts) mProducts.innerText = products.length;
    if (mOrders) mOrders.innerText = orders.length;
    if (mWork) mWork.innerText = workItems.length;
    if (mReviews) mReviews.innerText = reviews.length;

    // Render recent orders preview on dashboard
    const dashOrdersTable = document.getElementById('dash-recent-orders');
    if (dashOrdersTable) {
      dashOrdersTable.innerHTML = orders.slice(0, 5).map(o => `
        <tr>
          <td><strong>${o.orderCode}</strong></td>
          <td>${o.customerName}</td>
          <td>₹${o.totalAmount}</td>
          <td><span class="status-pill status-${(o.status || 'New').toLowerCase()}">${o.status}</span></td>
          <td>${o.requiredDate} (${o.requiredTime})</td>
        </tr>
      `).join('');
    }
  },

  // 2. Product Management & Cake Types
  populateCategoryDropdown(selectedVal) {
    const selectEl = document.getElementById('prod-edit-category');
    if (!selectEl || !window.Store) return;

    const categories = window.Store.getCategories();
    let html = '';
    categories.forEach(c => {
      html += `<option value="${c.slug || c.id}">${c.name}</option>`;
    });
    html += `<option value="__new__">✨ + Add New Cake Type / Category...</option>`;
    selectEl.innerHTML = html;
    if (selectedVal) {
      selectEl.value = selectedVal;
    }
  },

  handleCategoryChange(val) {
    const box = document.getElementById('new-category-box');
    if (box) {
      box.style.display = (val === '__new__') ? 'block' : 'none';
      if (val === '__new__') {
        const input = document.getElementById('prod-new-category-name');
        if (input) input.focus();
      }
    }
  },

  addNewCategory() {
    const input = document.getElementById('prod-new-category-name');
    const name = input ? input.value.trim() : '';
    if (!name) {
      alert('Please enter a name for the new cake type.');
      return;
    }
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    if (window.Store) {
      window.Store.saveCategory({ id: 'cat-' + slug, name: name, slug: slug });
    }
    this.populateCategoryDropdown(slug);
    if (input) input.value = '';
    this.handleCategoryChange(slug);
    if (window.showToast) window.showToast(`New cake type "${name}" created successfully!`, 'success');
  },

  autoCalcWeights(val) {
    const base = parseFloat(val);
    if (isNaN(base) || base <= 0) return;
    const p10 = document.getElementById('prod-edit-price-10');
    const p15 = document.getElementById('prod-edit-price-15');
    const p20 = document.getElementById('prod-edit-price-20');
    if (p10 && (!p10.value || p10.dataset.autofilled === 'true')) {
      p10.value = Math.round(base * 1.9);
      p10.dataset.autofilled = 'true';
    }
    if (p15 && (!p15.value || p15.dataset.autofilled === 'true')) {
      p15.value = Math.round(base * 2.8);
      p15.dataset.autofilled = 'true';
    }
    if (p20 && (!p20.value || p20.dataset.autofilled === 'true')) {
      p20.value = Math.round(base * 3.6);
      p20.dataset.autofilled = 'true';
    }
  },

  handleProductImageUpload(inputEl) {
    if (inputEl && inputEl.files && inputEl.files[0]) {
      compressImageHelper(inputEl.files[0], 1000, 0.82).then(base64 => {
        this.uploadedProdImageBase64 = base64;
        const preview = document.getElementById('prod-img-preview');
        if (preview) preview.src = base64;
        const urlInput = document.getElementById('prod-edit-img');
        if (urlInput) urlInput.value = base64;
        if (window.showToast) window.showToast('Cake photo uploaded & compressed!', 'success');
      }).catch(err => {
        alert('Error processing image: ' + err);
      });
    }
  },

  updateProductImgPreview(url) {
    const preview = document.getElementById('prod-img-preview');
    if (preview) preview.src = url || 'assets/images/hero_cake.jpg';
    this.uploadedProdImageBase64 = url;
  },

  showProductPresetPicker() {
    const container = document.getElementById('prod-presets-container');
    const grid = document.getElementById('prod-presets-grid');
    if (!container || !grid) return;
    if (container.style.display === 'block') {
      container.style.display = 'none';
      return;
    }
    container.style.display = 'block';
    grid.innerHTML = BAKERY_SAMPLE_PHOTOS.map(p => `
      <div class="preset-thumb-card" onclick="AdminController.selectProductPreset('${p.url}')">
        <img src="${p.url}" alt="${p.name}" class="preset-thumb-img">
        <span class="preset-thumb-label" title="${p.name}">${p.name}</span>
      </div>
    `).join('');
  },

  selectProductPreset(url) {
    this.updateProductImgPreview(url);
    const input = document.getElementById('prod-edit-img');
    if (input) input.value = url;
    const container = document.getElementById('prod-presets-container');
    if (container) container.style.display = 'none';
  },

  renderProductsTable() {
    const tbody = document.getElementById('admin-products-tbody');
    if (!tbody) return;

    const products = window.Store.getProducts();
    tbody.innerHTML = products.map(p => {
      const sizesSummary = p.sizes ? p.sizes.map(s => `<strong>${s.label}:</strong> ₹${s.price}`).join(' | ') : `₹${p.basePrice}`;
      return `
        <tr>
          <td><img src="${p.imageUrl}" alt="${p.name}" class="table-img-thumb" onerror="this.src='assets/images/hero_cake.jpg'"></td>
          <td>
            <strong style="color:var(--cream-100);">${p.name}</strong><br>
            <span class="section-badge" style="font-size:0.72rem; padding:0.15rem 0.5rem; margin-top:0.2rem;">${p.category}</span>
          </td>
          <td><strong style="color:var(--gold-200);">₹${p.basePrice}</strong></td>
          <td style="font-size:0.82rem; color:var(--cream-muted);">${sizesSummary}</td>
          <td>${p.isBestseller ? '<span style="color:#fbbf24; font-weight:600;">★ Bestseller</span>' : '<span style="opacity:0.5;">Standard</span>'}</td>
          <td>
            <div style="display:flex; gap:0.4rem;">
              <button class="btn btn-secondary" style="padding: 0.35rem 0.75rem; font-size: 0.8rem;" onclick="AdminController.editProduct('${p.id}')">Edit</button>
              <button class="btn btn-secondary" style="padding: 0.35rem 0.75rem; font-size: 0.8rem; color: var(--ruby-500);" onclick="AdminController.deleteProduct('${p.id}')">Delete</button>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  },

  setupProductForm() {
    const form = document.getElementById('admin-product-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const id = document.getElementById('prod-edit-id').value;
      const name = document.getElementById('prod-edit-name').value.trim();
      const category = document.getElementById('prod-edit-category').value;
      const price05 = parseFloat(document.getElementById('prod-edit-price').value);
      const price10 = parseFloat(document.getElementById('prod-edit-price-10').value) || Math.round(price05 * 1.9);
      const price15 = parseFloat(document.getElementById('prod-edit-price-15').value) || Math.round(price05 * 2.8);
      const price20 = parseFloat(document.getElementById('prod-edit-price-20').value) || Math.round(price05 * 3.6);
      const desc = document.getElementById('prod-edit-desc').value.trim();
      const img = this.uploadedProdImageBase64 || document.getElementById('prod-edit-img').value.trim() || 'assets/images/hero_cake.jpg';
      const isBestseller = document.getElementById('prod-edit-bestseller').checked;
      const isAvailable = document.getElementById('prod-edit-available').checked;

      if (category === '__new__') {
        alert('Please click "Create Cake Type" first to save your new category, or select an existing one.');
        return;
      }

      const product = {
        id: id || undefined,
        slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        name: name,
        category: category,
        basePrice: price05,
        description: desc,
        imageUrl: img,
        isBestseller: isBestseller,
        isAvailable: isAvailable,
        sizes: [
          { label: '0.5 KG', price: price05 },
          { label: '1.0 KG', price: price10 },
          { label: '1.5 KG', price: price15 },
          { label: '2.0 KG', price: price20 }
        ],
        flavors: ['Classic Truffle', 'Fresh Cream', 'Signature Chef Choice']
      };

      window.Store.saveProduct(product);
      if (window.showToast) window.showToast(`Cake "${name}" saved & live on website!`, 'success');
      this.resetProductForm();
      this.renderProductsTable();
      this.renderPriceMatrix();
      this.renderMetrics();
    });
  },

  editProduct(id) {
    const p = window.Store.getProductById(id);
    if (!p) return;

    document.getElementById('prod-edit-id').value = p.id;
    document.getElementById('prod-edit-name').value = p.name;
    this.populateCategoryDropdown(p.category);
    document.getElementById('prod-edit-category').value = p.category;
    document.getElementById('prod-edit-price').value = p.basePrice;

    // Populate weight tiers
    const s10 = (p.sizes && p.sizes.find(s => s.label.includes('1.0') || s.label.includes('1 KG')));
    const s15 = (p.sizes && p.sizes.find(s => s.label.includes('1.5')));
    const s20 = (p.sizes && p.sizes.find(s => s.label.includes('2.0') || s.label.includes('2 KG')));

    const el10 = document.getElementById('prod-edit-price-10');
    const el15 = document.getElementById('prod-edit-price-15');
    const el20 = document.getElementById('prod-edit-price-20');

    if (el10) { el10.value = s10 ? s10.price : Math.round(p.basePrice * 1.9); el10.dataset.autofilled = 'false'; }
    if (el15) { el15.value = s15 ? s15.price : Math.round(p.basePrice * 2.8); el15.dataset.autofilled = 'false'; }
    if (el20) { el20.value = s20 ? s20.price : Math.round(p.basePrice * 3.6); el20.dataset.autofilled = 'false'; }

    document.getElementById('prod-edit-desc').value = p.description || '';
    document.getElementById('prod-edit-img').value = p.imageUrl || '';
    this.updateProductImgPreview(p.imageUrl);
    document.getElementById('prod-edit-bestseller').checked = !!p.isBestseller;
    document.getElementById('prod-edit-available').checked = p.isAvailable !== false;

    const titleEl = document.getElementById('prod-form-title');
    if (titleEl) titleEl.innerText = `✏️ Edit Cake: ${p.name}`;
    const submitBtn = document.getElementById('prod-submit-btn');
    if (submitBtn) submitBtn.innerText = 'Update Cake Details';

    document.getElementById('admin-product-form').scrollIntoView({ behavior: 'smooth' });
  },

  resetProductForm() {
    const form = document.getElementById('admin-product-form');
    if (form) form.reset();
    document.getElementById('prod-edit-id').value = '';
    this.uploadedProdImageBase64 = null;
    this.updateProductImgPreview('assets/images/hero_cake.jpg');
    this.handleCategoryChange('');
    const titleEl = document.getElementById('prod-form-title');
    if (titleEl) titleEl.innerText = '🍰 Add / Edit Cake or Menu Item';
    const submitBtn = document.getElementById('prod-submit-btn');
    if (submitBtn) submitBtn.innerText = 'Save Cake / Product';
  },

  deleteProduct(id) {
    if (confirm('Are you sure you want to delete this product?')) {
      window.Store.deleteProduct(id);
      this.renderProductsTable();
      this.renderPriceMatrix();
      this.renderMetrics();
      if (window.showToast) window.showToast('Product deleted', 'info');
    }
  },

  // 3. Price Matrix Management
  renderPriceMatrix() {
    const tbody = document.getElementById('admin-prices-tbody');
    if (!tbody) return;

    const products = window.Store.getProducts();
    tbody.innerHTML = products.map(p => {
      const s05 = (p.sizes && p.sizes.find(s => s.label.includes('0.5'))) || { price: p.basePrice };
      const s10 = (p.sizes && p.sizes.find(s => s.label.includes('1.0') || s.label.includes('1 KG'))) || { price: Math.round(p.basePrice * 1.9) };
      const s15 = (p.sizes && p.sizes.find(s => s.label.includes('1.5'))) || { price: Math.round(p.basePrice * 2.8) };
      const s20 = (p.sizes && p.sizes.find(s => s.label.includes('2.0') || s.label.includes('2 KG'))) || { price: Math.round(p.basePrice * 3.6) };

      return `
        <tr>
          <td><strong>${p.name}</strong></td>
          <td><input type="number" class="price-input-sm" value="${s05.price}" onchange="AdminController.saveInlinePrice('${p.id}', '0.5 KG', this.value)"></td>
          <td><input type="number" class="price-input-sm" value="${s10.price}" onchange="AdminController.saveInlinePrice('${p.id}', '1.0 KG', this.value)"></td>
          <td><input type="number" class="price-input-sm" value="${s15.price}" onchange="AdminController.saveInlinePrice('${p.id}', '1.5 KG', this.value)"></td>
          <td><input type="number" class="price-input-sm" value="${s20.price}" onchange="AdminController.saveInlinePrice('${p.id}', '2.0 KG', this.value)"></td>
          <td><button class="btn btn-secondary" style="padding: 0.35rem 0.75rem; font-size: 0.78rem;" onclick="showToast('Price updated for ${p.name}', 'success')">Saved</button></td>
        </tr>
      `;
    }).join('');
  },

  saveInlinePrice(productId, sizeLabel, price) {
    window.Store.updateProductPrice(productId, sizeLabel, price);
    if (window.showToast) window.showToast(`Updated ${sizeLabel} price to ₹${price}`, 'success');
  },

  // 4. "Our Work" Image Upload System (Phone / Desktop with Client Compression)
  setupImageUpload() {
    const fileInput = document.getElementById('work-file-input');
    const dropzone = document.getElementById('work-dropzone');
    const previewWrap = document.getElementById('work-preview-wrap');
    const previewImg = document.getElementById('work-preview-img');
    const uploadForm = document.getElementById('work-upload-form');

    if (!fileInput || !dropzone) return;

    dropzone.addEventListener('click', () => fileInput.click());

    dropzone.addEventListener('dragover', (e) => {
      e.preventDefault();
      dropzone.classList.add('dragover');
    });

    dropzone.addEventListener('dragleave', () => dropzone.classList.remove('dragover'));

    dropzone.addEventListener('drop', (e) => {
      e.preventDefault();
      dropzone.classList.remove('dragover');
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        this.processUploadedFile(e.dataTransfer.files[0]);
      }
    });

    fileInput.addEventListener('change', (e) => {
      if (e.target.files && e.target.files[0]) {
        this.processUploadedFile(e.target.files[0]);
      }
    });

    if (uploadForm) {
      uploadForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.saveWorkItem();
      });
    }
  },

  processUploadedFile(file) {
    const previewWrap = document.getElementById('work-preview-wrap');
    const previewImg = document.getElementById('work-preview-img');
    const progressEl = document.getElementById('work-upload-progress');

    if (progressEl) progressEl.style.display = 'block';

    // Compress client side using HTML5 canvas
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 1200;
        const scaleSize = MAX_WIDTH / img.width;
        canvas.width = img.width > MAX_WIDTH ? MAX_WIDTH : img.width;
        canvas.height = img.width > MAX_WIDTH ? img.height * scaleSize : img.height;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        // Compressed JPEG representation
        this.uploadedImageBase64 = canvas.toDataURL('image/jpeg', 0.82);

        if (previewImg) previewImg.src = this.uploadedImageBase64;
        if (previewWrap) previewWrap.style.display = 'block';
        if (progressEl) progressEl.style.display = 'none';

        if (window.showToast) window.showToast('Image ready for upload!', 'info');
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  },

  removeWorkImage() {
    this.uploadedImageBase64 = null;
    const previewWrap = document.getElementById('work-preview-wrap');
    if (previewWrap) previewWrap.style.display = 'none';
  },

  saveWorkItem() {
    const title = document.getElementById('work-title').value.trim();
    const category = document.getElementById('work-category').value;
    const desc = document.getElementById('work-desc').value.trim();
    const isFeatured = document.getElementById('work-featured').checked;
    const imageUrl = this.uploadedImageBase64 || document.getElementById('work-url-fallback').value || 'assets/images/hero_cake.jpg';

    if (!title) {
      alert('Please enter a title for this cake creation.');
      return;
    }

    const item = {
      title: title,
      category: category,
      description: desc,
      imageUrl: imageUrl,
      dateBaked: new Date().toISOString().split('T')[0],
      isFeatured: isFeatured
    };

    window.Store.saveWorkItem(item);
    if (window.showToast) window.showToast('Creation uploaded and live on "Our Work" page!', 'success');

    // Reset form
    document.getElementById('work-upload-form').reset();
    this.removeWorkImage();
    this.renderOurWorkList();
    this.renderMetrics();
  },

  renderOurWorkList() {
    const container = document.getElementById('admin-work-list');
    if (!container) return;

    const list = window.Store.getOurWork('All');
    container.innerHTML = list.map(item => `
      <div style="display: flex; align-items: center; gap: 1.2rem; padding: 1rem 0; border-bottom: 1px solid var(--border-subtle);">
        <img src="${item.imageUrl}" style="width: 60px; height: 60px; border-radius: 8px; object-fit: cover;" onerror="this.src='assets/images/hero_cake.jpg'">
        <div style="flex-grow: 1;">
          <strong style="color: var(--cream-100);">${item.title}</strong>
          <div style="font-size: 0.82rem; color: var(--gold-300);">${item.category} • ${item.dateBaked || 'Recent'}</div>
        </div>
        <div>
          <button class="btn btn-secondary" style="padding: 0.35rem 0.75rem; font-size: 0.8rem; color: var(--ruby-500);" onclick="AdminController.deleteWorkItem('${item.id}')">Delete</button>
        </div>
      </div>
    `).join('');
  },

  deleteWorkItem(id) {
    if (confirm('Delete this item from Our Work portfolio?')) {
      window.Store.deleteWorkItem(id);
      this.renderOurWorkList();
      this.renderMetrics();
    }
  },

  // 5. Offers Management with Image Upload & Presets
  handleOfferImageUpload(inputEl) {
    if (inputEl && inputEl.files && inputEl.files[0]) {
      compressImageHelper(inputEl.files[0], 1000, 0.82).then(base64 => {
        this.uploadedOfferImageBase64 = base64;
        const preview = document.getElementById('offer-img-preview');
        if (preview) preview.src = base64;
        const urlInput = document.getElementById('offer-img-url');
        if (urlInput) urlInput.value = base64;
        if (window.showToast) window.showToast('Offer banner image uploaded & compressed!', 'success');
      }).catch(err => {
        alert('Error processing image: ' + err);
      });
    }
  },

  updateOfferImgPreview(url) {
    const preview = document.getElementById('offer-img-preview');
    if (preview) preview.src = url || 'assets/images/designer_cake.jpg';
    this.uploadedOfferImageBase64 = url;
  },

  showOfferPresetPicker() {
    const container = document.getElementById('offer-presets-container');
    const grid = document.getElementById('offer-presets-grid');
    if (!container || !grid) return;
    if (container.style.display === 'block') {
      container.style.display = 'none';
      return;
    }
    container.style.display = 'block';
    grid.innerHTML = BAKERY_SAMPLE_PHOTOS.map(p => `
      <div class="preset-thumb-card" onclick="AdminController.selectOfferPreset('${p.url}')">
        <img src="${p.url}" alt="${p.name}" class="preset-thumb-img">
        <span class="preset-thumb-label" title="${p.name}">${p.name}</span>
      </div>
    `).join('');
  },

  selectOfferPreset(url) {
    this.updateOfferImgPreview(url);
    const input = document.getElementById('offer-img-url');
    if (input) input.value = url;
    const container = document.getElementById('offer-presets-container');
    if (container) container.style.display = 'none';
  },

  setupOfferForm() {
    const form = document.getElementById('admin-offer-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const id = document.getElementById('offer-edit-id').value;
      const title = document.getElementById('offer-title').value.trim();
      const desc = document.getElementById('offer-desc').value.trim();
      const origPrice = parseFloat(document.getElementById('offer-orig-price').value) || null;
      const offerPrice = parseFloat(document.getElementById('offer-price').value) || 0;
      const promo = document.getElementById('offer-promo').value.trim();
      const badge = document.getElementById('offer-badge').value.trim() || 'Limited Time';
      const endDate = document.getElementById('offer-end-date').value;
      const img = this.uploadedOfferImageBase64 || document.getElementById('offer-img-url').value.trim() || 'assets/images/designer_cake.jpg';

      const offer = {
        id: id || undefined,
        title: title,
        badge: badge,
        description: desc,
        originalPrice: origPrice,
        offerPrice: offerPrice,
        promoCode: promo,
        startDate: new Date().toISOString().split('T')[0],
        endDate: endDate,
        imageUrl: img,
        isActive: true
      };

      window.Store.saveOffer(offer);
      if (window.showToast) window.showToast(`Special offer "${title}" published live!`, 'success');
      this.resetOfferForm();
      this.renderOffersTable();
    });
  },

  editOffer(id) {
    const offers = window.Store.getOffers(false);
    const o = offers.find(item => item.id === id);
    if (!o) return;

    document.getElementById('offer-edit-id').value = o.id;
    document.getElementById('offer-title').value = o.title;
    document.getElementById('offer-promo').value = o.promoCode || '';
    document.getElementById('offer-orig-price').value = o.originalPrice || '';
    document.getElementById('offer-price').value = o.offerPrice;
    document.getElementById('offer-badge').value = o.badge || '';
    document.getElementById('offer-end-date').value = o.endDate || '';
    document.getElementById('offer-desc').value = o.description || '';
    document.getElementById('offer-img-url').value = o.imageUrl || '';
    this.updateOfferImgPreview(o.imageUrl);

    const titleEl = document.getElementById('offer-form-title');
    if (titleEl) titleEl.innerText = `✏️ Edit Offer: ${o.title}`;
    const submitBtn = document.getElementById('offer-submit-btn');
    if (submitBtn) submitBtn.innerText = 'Update Offer';

    document.getElementById('admin-offer-form').scrollIntoView({ behavior: 'smooth' });
  },

  resetOfferForm() {
    const form = document.getElementById('admin-offer-form');
    if (form) form.reset();
    document.getElementById('offer-edit-id').value = '';
    this.uploadedOfferImageBase64 = null;
    this.updateOfferImgPreview('assets/images/designer_cake.jpg');
    const titleEl = document.getElementById('offer-form-title');
    if (titleEl) titleEl.innerText = '🏷️ Create / Edit Special Offer';
    const submitBtn = document.getElementById('offer-submit-btn');
    if (submitBtn) submitBtn.innerText = 'Publish Offer';
  },

  renderOffersTable() {
    const tbody = document.getElementById('admin-offers-tbody');
    if (!tbody) return;

    const offers = window.Store.getOffers(false);
    tbody.innerHTML = offers.map(o => `
      <tr>
        <td><img src="${o.imageUrl || 'assets/images/designer_cake.jpg'}" alt="${o.title}" class="table-img-thumb" onerror="this.src='assets/images/designer_cake.jpg'"></td>
        <td>
          <strong style="color:var(--cream-100);">${o.title}</strong><br>
          <span style="font-size:0.75rem; color:var(--gold-300);">${o.badge || 'Special Deal'}</span>
        </td>
        <td><code>${o.promoCode || 'NONE'}</code></td>
        <td>
          <span style="color:var(--gold-200); font-weight:700;">₹${o.offerPrice}</span>
          ${o.originalPrice ? `<br><del style="color:var(--cream-muted); font-size:0.8rem;">₹${o.originalPrice}</del>` : ''}
        </td>
        <td>${o.endDate || 'Active'}</td>
        <td>${o.isActive ? '<span style="color:#25D366; font-weight:600;">Active</span>' : '<span style="color:#f87171;">Inactive</span>'}</td>
        <td>
          <div style="display:flex; gap:0.4rem;">
            <button class="btn btn-secondary" style="padding: 0.35rem 0.75rem; font-size: 0.8rem;" onclick="AdminController.editOffer('${o.id}')">Edit</button>
            <button class="btn btn-secondary" style="padding: 0.35rem 0.75rem; font-size: 0.8rem; color: var(--ruby-500);" onclick="AdminController.deleteOffer('${o.id}')">Delete</button>
          </div>
        </td>
      </tr>
    `).join('');
  },

  deleteOffer(id) {
    if (confirm('Delete this offer?')) {
      window.Store.deleteOffer(id);
      this.renderOffersTable();
      if (window.showToast) window.showToast('Offer deleted', 'info');
    }
  },

  // 6. Reviews Management
  renderReviewsAdmin() {
    const tbody = document.getElementById('admin-reviews-tbody');
    if (!tbody) return;

    const reviews = window.Store.getReviews(false);
    tbody.innerHTML = reviews.map(r => `
      <tr>
        <td><strong>${r.customerName}</strong><br><small>${r.locality || 'Wakad'}</small></td>
        <td>${'★'.repeat(r.rating)}</td>
        <td style="max-width: 250px;">${r.reviewText}</td>
        <td>${r.isApproved ? '<span style="color:#25D366;">Approved</span>' : '<span style="color:#fbbf24;">Pending</span>'}</td>
        <td>
          <button class="btn btn-secondary" style="padding: 0.35rem 0.75rem; font-size: 0.78rem;" onclick="AdminController.toggleReviewApproval('${r.id}')">${r.isApproved ? 'Hide' : 'Approve'}</button>
          <button class="btn btn-secondary" style="padding: 0.35rem 0.75rem; font-size: 0.78rem; color: var(--ruby-500);" onclick="AdminController.deleteReview('${r.id}')">Delete</button>
        </td>
      </tr>
    `).join('');
  },

  toggleReviewApproval(id) {
    const reviews = window.Store.getReviews(false);
    const rev = reviews.find(r => r.id === id);
    if (rev) {
      rev.isApproved = !rev.isApproved;
      window.Store.saveReview(rev);
      this.renderReviewsAdmin();
      if (window.showToast) window.showToast(`Review ${rev.isApproved ? 'Approved' : 'Hidden'}`, 'info');
    }
  },

  deleteReview(id) {
    if (confirm('Delete this customer review?')) {
      window.Store.deleteReview(id);
      this.renderReviewsAdmin();
    }
  },

  // 7. Orders Management
  renderOrdersTable() {
    const tbody = document.getElementById('admin-orders-tbody');
    if (!tbody) return;

    const orders = window.Store.getOrders();
    tbody.innerHTML = orders.map(o => `
      <tr>
        <td><strong>${o.orderCode}</strong></td>
        <td>${o.customerName}<br><small>${o.customerPhone || ''}</small></td>
        <td>${(o.products || []).map(p => `${p.name} (${p.size || ''})`).join(', ')}</td>
        <td>₹${o.totalAmount}</td>
        <td>${o.requiredDate}<br><small>${o.requiredTime}</small></td>
        <td>
          <select onchange="AdminController.changeOrderStatus('${o.id}', this.value)" style="padding: 0.3rem 0.6rem; font-size: 0.82rem;">
            ${['New', 'Confirmed', 'Preparing', 'Ready', 'Completed', 'Cancelled'].map(st => `
              <option value="${st}" ${o.status === st ? 'selected' : ''}>${st}</option>
            `).join('')}
          </select>
        </td>
      </tr>
    `).join('');
  },

  changeOrderStatus(orderId, newStatus) {
    window.Store.updateOrderStatus(orderId, newStatus);
    if (window.showToast) window.showToast(`Order status updated to ${newStatus}`, 'success');
  },

  // 8. Settings & Cloud Sync
  renderSettings() {
    const cfg = window.Store.getSupabaseConfig();
    const urlInput = document.getElementById('supabase-url-input');
    const keyInput = document.getElementById('supabase-key-input');
    if (urlInput) urlInput.value = cfg.url || '';
    if (keyInput) keyInput.value = cfg.anonKey || '';
  },

  saveSupabaseSettings() {
    const url = document.getElementById('supabase-url-input').value.trim();
    const anonKey = document.getElementById('supabase-key-input').value.trim();

    window.Store.saveSupabaseConfig({
      url: url,
      anonKey: anonKey,
      connected: !!(url && anonKey)
    });

    if (window.showToast) window.showToast('Supabase cloud config updated!', 'success');
  },

  exportBackup() {
    const data = {
      products: window.Store.getProducts(),
      categories: window.Store.getCategories(),
      ourWork: window.Store.getOurWork('All'),
      offers: window.Store.getOffers(false),
      reviews: window.Store.getReviews(false),
      orders: window.Store.getOrders(),
      exportedAt: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `7th_heaven_wakad_backup_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  },

  resetStoreData() {
    if (confirm('Reset store data back to default initial seed? This will restore original Wakad menu and samples.')) {
      window.Store.resetToDefaults();
      this.renderAllData();
      if (window.showToast) window.showToast('Restored default 7th Heaven Wakad data.', 'info');
    }
  }
};

window.AdminController = AdminController;

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('admin-container')) {
    AdminController.init();
  }
});
