/**
 * 7th Heaven Wakad - WhatsApp Ordering & Enquiry Dispatcher
 * Exact WhatsApp Business: +91 90220 40850 (9022040850)
 * Location: Austin Plaza, Mhatoba Chowk, Kaspate Wasti, Wakad
 */

const WhatsAppService = {
  getPhoneNumber() {
    return (window.BUSINESS_CONFIG && window.BUSINESS_CONFIG.whatsapp) || '919022040850';
  },

  /**
   * Builds the formatted order message string
   */
  buildOrderMessage(details) {
    const lines = [
      '🎂 *NEW ORDER ENQUIRY - 7th Heaven Wakad* 🎂',
      '────────────────────────────',
      `*Product:* ${details.productName || 'Signature Cake'}`,
      `*Variant / Weight:* ${details.size || '1.0 KG'}`,
      details.flavor ? `*Flavor:* ${details.flavor}` : null,
      `*Quantity:* ${details.quantity || 1}`,
      `*Estimated Price:* ₹${details.price || '0'}`,
      '────────────────────────────',
      details.requiredDate ? `📅 *Required Date:* ${details.requiredDate}` : null,
      details.requiredTime ? `⏰ *Required Time:* ${details.requiredTime}` : null,
      details.cakeMessage ? `✍️ *Message on Cake:* "${details.cakeMessage}"` : null,
      '────────────────────────────',
      `👤 *Customer Name:* ${details.customerName || 'Customer'}`,
      details.customerPhone ? `📞 *Contact:* ${details.customerPhone}` : null,
      details.orderType ? `📍 *Order Type:* ${details.orderType}` : '*Order Type:* Store Pickup (Austin Plaza, Wakad)',
      details.specialInstructions ? `📝 *Special Instructions:* ${details.specialInstructions}` : null,
      '────────────────────────────',
      '_Sent via 7th Heaven Wakad Official Web Portal_'
    ];

    return lines.filter(Boolean).join('\n');
  },

  /**
   * Builds custom cake enquiry message
   */
  buildCustomCakeEnquiryMessage(details) {
    const lines = [
      '✨ *CUSTOM CAKE ENQUIRY - 7th Heaven Wakad* ✨',
      '────────────────────────────',
      `👤 *Customer Name:* ${details.customerName}`,
      `📞 *Phone Number:* ${details.customerPhone}`,
      `🎂 *Cake Type:* ${details.cakeType}`,
      `🍓 *Flavor Choice:* ${details.flavor || 'Chef Recommended'}`,
      `⚖️ *Estimated Weight:* ${details.weight || '1.5 KG'}`,
      details.theme ? `🎨 *Theme / Style:* ${details.theme}` : null,
      details.cakeMessage ? `✍️ *Message on Cake:* "${details.cakeMessage}"` : null,
      '────────────────────────────',
      `📅 *Required Date:* ${details.requiredDate}`,
      `⏰ *Required Time:* ${details.requiredTime}`,
      details.instructions ? `📝 *Special Instructions:* ${details.instructions}` : null,
      details.hasReferenceImage ? `📷 *Reference Image:* (Attaching custom cake photo in this chat)` : null,
      '────────────────────────────',
      'Please confirm availability, design feasibility, and price quotation. Thank you!'
    ];

    return lines.filter(Boolean).join('\n');
  },

  /**
   * Generates WhatsApp Web / App redirect URL
   */
  generateUrl(text) {
    const phone = this.getPhoneNumber();
    const encodedText = encodeURIComponent(text);
    return `https://api.whatsapp.com/send?phone=${phone}&text=${encodedText}`;
  },

  /**
   * Opens the interactive Order Modal allowing customer to edit message before sending
   */
  openOrderModal(product, defaultSize = null, defaultFlavor = null) {
    let modal = document.getElementById('whatsapp-order-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'whatsapp-order-modal';
      modal.className = 'modal-backdrop';
      document.body.appendChild(modal);
    }

    const sizes = product.sizes || [{ label: 'Standard', price: product.basePrice }];
    const selectedSizeObj = defaultSize ? (sizes.find(s => s.label === defaultSize) || sizes[0]) : sizes[0];
    const flavors = product.flavors || ['Chef Special Signature'];

    const today = new Date().toISOString().split('T')[0];

    modal.innerHTML = `
      <div class="modal-dialog">
        <div class="modal-header">
          <div class="modal-title-group">
            <span class="modal-badge">⚡ Instant WhatsApp Order</span>
            <h3 class="modal-title">${product.name}</h3>
          </div>
          <button class="modal-close" onclick="WhatsAppService.closeModal()">&times;</button>
        </div>

        <div class="modal-body">
          <div class="order-preview-box">
            <img src="${product.imageUrl}" alt="${product.name}" class="order-thumb" onerror="this.src='assets/images/hero_cake.jpg'">
            <div>
              <div class="order-summary-price">₹<span id="modal-price">${selectedSizeObj.price}</span></div>
              <p class="order-summary-note">100% Pure Veg • Prepared fresh at Austin Plaza, Wakad</p>
            </div>
          </div>

          <form id="quick-order-form" onsubmit="WhatsAppService.handleFormSubmit(event)">
            <input type="hidden" id="modal-product-id" value="${product.id}">
            <input type="hidden" id="modal-product-name" value="${product.name}">

            <div class="form-grid">
              <div class="form-group">
                <label>Select Weight / Size</label>
                <select id="modal-size" onchange="WhatsAppService.updatePrice(this)">
                  ${sizes.map(s => `<option value="${s.label}" data-price="${s.price}" ${s.label === selectedSizeObj.label ? 'selected' : ''}>${s.label} — ₹${s.price}</option>`).join('')}
                </select>
              </div>

              <div class="form-group">
                <label>Select Flavor</label>
                <select id="modal-flavor">
                  ${flavors.map(f => `<option value="${f}" ${f === defaultFlavor ? 'selected' : ''}>${f}</option>`).join('')}
                </select>
              </div>

              <div class="form-group">
                <label>Quantity</label>
                <input type="number" id="modal-quantity" min="1" max="20" value="1" onchange="WhatsAppService.recalcTotal()">
              </div>

              <div class="form-group">
                <label>Your Name *</label>
                <input type="text" id="modal-customer-name" placeholder="Enter your full name" required>
              </div>

              <div class="form-group">
                <label>Your Phone *</label>
                <input type="tel" id="modal-customer-phone" placeholder="Mobile number" required>
              </div>

              <div class="form-group">
                <label>Required Date *</label>
                <input type="date" id="modal-date" min="${today}" value="${today}" required>
              </div>

              <div class="form-group">
                <label>Required Time *</label>
                <select id="modal-time">
                  <option value="11:00 AM">11:00 AM</option>
                  <option value="1:00 PM">1:00 PM</option>
                  <option value="3:00 PM">3:00 PM</option>
                  <option value="5:00 PM">5:00 PM</option>
                  <option value="7:00 PM" selected>7:00 PM</option>
                  <option value="8:30 PM">8:30 PM</option>
                  <option value="10:00 PM">10:00 PM</option>
                </select>
              </div>

              <div class="form-group">
                <label>Order Type</label>
                <select id="modal-order-type">
                  <option value="Store Pickup (Austin Plaza, Wakad)">Store Pickup (Austin Plaza, Wakad)</option>
                  <option value="Home Delivery in Wakad / Hinjewadi">Home Delivery in Wakad / Hinjewadi</option>
                </select>
              </div>
            </div>

            <div class="form-group full-width">
              <label>Message on Cake (Optional)</label>
              <input type="text" id="modal-message" placeholder="e.g. Happy Birthday Aayush!">
            </div>

            <div class="form-group full-width">
              <label>Special Instructions (Optional)</label>
              <textarea id="modal-instructions" rows="2" placeholder="e.g. Less sugar, include birthday candle and sparkler"></textarea>
            </div>

            <div class="message-preview-container">
              <label class="preview-label">Live WhatsApp Message Preview (Editable before sending):</label>
              <textarea id="modal-editable-message" class="preview-textarea" rows="6"></textarea>
            </div>

            <div class="modal-actions">
              <button type="button" class="btn btn-secondary" onclick="WhatsAppService.closeModal()">Cancel</button>
              <button type="submit" class="btn btn-whatsapp-order">
                <span>Send Order on WhatsApp</span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z"/>
                </svg>
              </button>
            </div>
          </form>
        </div>
      </div>
    `;

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Update initial message preview
    this.refreshPreview();

    // Attach listeners to sync inputs with preview
    ['modal-size', 'modal-flavor', 'modal-quantity', 'modal-customer-name', 'modal-customer-phone', 'modal-date', 'modal-time', 'modal-message', 'modal-instructions', 'modal-order-type'].forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener('input', () => this.refreshPreview());
        el.addEventListener('change', () => this.refreshPreview());
      }
    });
  },

  updatePrice(selectEl) {
    const selectedOption = selectEl.options[selectEl.selectedIndex];
    const price = selectedOption.getAttribute('data-price') || 0;
    const qty = parseInt(document.getElementById('modal-quantity').value) || 1;
    document.getElementById('modal-price').innerText = price * qty;
    this.refreshPreview();
  },

  recalcTotal() {
    const sizeSelect = document.getElementById('modal-size');
    this.updatePrice(sizeSelect);
  },

  refreshPreview() {
    const previewBox = document.getElementById('modal-editable-message');
    if (!previewBox) return;

    const sizeSelect = document.getElementById('modal-size');
    const selectedOption = sizeSelect.options[sizeSelect.selectedIndex];
    const unitPrice = parseFloat(selectedOption.getAttribute('data-price') || 0);
    const qty = parseInt(document.getElementById('modal-quantity').value) || 1;
    const totalPrice = unitPrice * qty;

    const details = {
      productName: document.getElementById('modal-product-name').value,
      size: sizeSelect.value,
      flavor: document.getElementById('modal-flavor').value,
      quantity: qty,
      price: totalPrice,
      requiredDate: document.getElementById('modal-date').value,
      requiredTime: document.getElementById('modal-time').value,
      cakeMessage: document.getElementById('modal-message').value,
      customerName: document.getElementById('modal-customer-name').value || '[Your Name]',
      customerPhone: document.getElementById('modal-customer-phone').value || '[Your Phone]',
      orderType: document.getElementById('modal-order-type').value,
      specialInstructions: document.getElementById('modal-instructions').value
    };

    previewBox.value = this.buildOrderMessage(details);
  },

  handleFormSubmit(e) {
    e.preventDefault();
    const finalMessage = document.getElementById('modal-editable-message').value;
    const customerName = document.getElementById('modal-customer-name').value;
    const customerPhone = document.getElementById('modal-customer-phone').value;
    const productName = document.getElementById('modal-product-name').value;
    const size = document.getElementById('modal-size').value;
    const date = document.getElementById('modal-date').value;
    const time = document.getElementById('modal-time').value;
    const priceText = document.getElementById('modal-price').innerText;

    // Record order in local store
    if (window.Store) {
      window.Store.saveOrder({
        customerName: customerName,
        customerPhone: customerPhone,
        products: [{ name: productName, size: size, price: parseFloat(priceText) }],
        totalAmount: parseFloat(priceText),
        requiredDate: date,
        requiredTime: time,
        cakeMessage: document.getElementById('modal-message').value,
        specialInstructions: document.getElementById('modal-instructions').value,
        orderType: document.getElementById('modal-order-type').value,
        status: 'New'
      });
    }

    const whatsappUrl = this.generateUrl(finalMessage);
    window.open(whatsappUrl, '_blank');
    this.closeModal();
  },

  closeModal() {
    const modal = document.getElementById('whatsapp-order-modal');
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  }
};

window.WhatsAppService = WhatsAppService;
