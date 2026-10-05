/**
 * 7th Heaven Wakad - Customer Reviews Service
 * Displays approved reviews, calculates average ratings, handles new review submissions
 */

const ReviewsService = {
  init() {
    this.renderReviewsList();
    this.renderReviewsSummary();
    this.setupReviewSubmission();

    if (window.Store) {
      window.Store.on('reviews-changed', () => {
        this.renderReviewsList();
        this.renderReviewsSummary();
      });
    }
  },

  renderReviewsList() {
    const container = document.getElementById('reviews-grid-container');
    if (!container) return;

    const reviews = window.Store ? window.Store.getReviews(true) : [];
    if (!reviews.length) {
      container.innerHTML = '<p style="text-align: center; grid-column: 1/-1;">No reviews found.</p>';
      return;
    }

    container.innerHTML = reviews.map(rev => {
      const stars = '★'.repeat(rev.rating) + '☆'.repeat(5 - rev.rating);
      return `
        <div class="review-card reveal">
          <div class="review-stars">${stars}</div>
          <p class="review-text">"${rev.reviewText}"</p>
          <div class="review-footer">
            <div class="review-avatar">${rev.customerName.charAt(0)}</div>
            <div>
              <div class="review-author-name">${rev.customerName}</div>
              <div class="review-author-locality">${rev.locality || 'Wakad Customer'} • ${rev.date || 'Recent'}</div>
              ${rev.cakeOrdered ? `<div class="review-cake-badge">🎂 ${rev.cakeOrdered}</div>` : ''}
            </div>
          </div>
        </div>
      `;
    }).join('');
  },

  renderReviewsSummary() {
    const avgEl = document.getElementById('reviews-avg-rating');
    const totalEl = document.getElementById('reviews-total-count');
    const reviews = window.Store ? window.Store.getReviews(true) : [];

    if (!reviews.length) return;

    const total = reviews.length;
    const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
    const avg = (sum / total).toFixed(1);

    if (avgEl) avgEl.innerText = avg;
    if (totalEl) totalEl.innerText = `${total}+ Verified Reviews`;
  },

  setupReviewSubmission() {
    const form = document.getElementById('customer-review-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('rev-input-name').value.trim();
      const locality = document.getElementById('rev-input-locality').value.trim() || 'Wakad, Pune';
      const cake = document.getElementById('rev-input-cake').value.trim();
      const rating = parseInt(document.getElementById('rev-input-rating').value) || 5;
      const text = document.getElementById('rev-input-text').value.trim();

      if (!name || !text) {
        alert('Please fill in your name and feedback.');
        return;
      }

      if (window.Store) {
        window.Store.saveReview({
          customerName: name,
          locality: locality,
          cakeOrdered: cake,
          rating: rating,
          reviewText: text,
          isApproved: true, // Auto-approve for demonstration or set to pending
          isFeatured: false,
          isVerifiedGoogleBuyer: false,
          date: new Date().toISOString().split('T')[0]
        });
      }

      form.reset();
      if (window.showToast) {
        window.showToast('Thank you! Your review has been submitted successfully.', 'success');
      } else {
        alert('Thank you! Your review has been submitted.');
      }
      this.renderReviewsList();
      this.renderReviewsSummary();
    });
  }
};

window.ReviewsService = ReviewsService;
