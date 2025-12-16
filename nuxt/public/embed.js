/**
 * BouncePro Universal Embed Script
 *
 * Usage:
 *   <div data-bh-widget="products" data-tenant="acme"></div>
 *   <script async src="https://your-domain.com/embed.js"></script>
 *
 * Widget Types:
 *   - products: Product grid with cart, search, and filters
 *   - product: Single product detail page
 *   - categories: Category browser/grid
 *   - featured: Featured items showcase
 *   - checkout: Checkout form
 *   - cart: Floating cart button
 *
 * Behavior Modes:
 *   - modal (default): Everything stays on current page, opens in modals/drawers
 *   - navigate: Clicks navigate to real URLs (data-product-url, data-checkout-url)
 *   - hosted: Checkout redirects to hosted BouncePro checkout
 *
 * Common Attributes:
 *   data-tenant       - (required) Tenant slug
 *   data-behavior     - modal | navigate | hosted (default: modal)
 *   data-theme        - light | dark | auto (default: auto)
 *   data-product-url  - URL pattern for product pages, use {slug} or {id}
 *   data-checkout-url - URL for checkout page
 *   data-category     - Filter by category ID
 *   data-featured     - Show only featured items (true/false)
 *   data-limit        - Items per page
 *   data-hide-filters - Hide search/filter controls
 *   data-hide-cart    - Hide cart sidebar
 *   data-primary-color - Custom primary color (hex)
 */
(function() {
  'use strict';

  // Prevent double initialization
  if (window.BH && window.BH.initialized) {
    console.log('[BouncePro] Already initialized, skipping');
    return;
  }

  // Configuration
  const BH_BASE_URL = window.BH_BASE_URL || (function() {
    // Auto-detect base URL from script src
    const scripts = document.querySelectorAll('script[src*="embed.js"]');
    if (scripts.length > 0) {
      const src = scripts[scripts.length - 1].src;
      const url = new URL(src);
      return url.origin;
    }
    // Fallback to current origin or localhost for dev
    return window.location.origin.includes('localhost')
      ? 'http://localhost:3005'
      : window.location.origin;
  })();

  // Styles for modals and overlays
  const STYLES = `
    .bh-widget-container {
      position: relative;
      width: 100%;
      min-height: 200px;
    }
    .bh-widget-iframe {
      width: 100%;
      border: none;
      min-height: 600px;
      transition: height 0.2s ease;
    }
    .bh-widget-loading {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 400px;
      background: #f9fafb;
      border-radius: 8px;
    }
    .bh-widget-loading-spinner {
      width: 40px;
      height: 40px;
      border: 3px solid #e5e7eb;
      border-top-color: #f97316;
      border-radius: 50%;
      animation: bh-spin 0.8s linear infinite;
    }
    @keyframes bh-spin {
      to { transform: rotate(360deg); }
    }
    .bh-modal-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.5);
      z-index: 9998;
      opacity: 0;
      transition: opacity 0.2s ease;
      display: none;
    }
    .bh-modal-overlay.active {
      display: block;
      opacity: 1;
    }
    .bh-modal {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%) scale(0.95);
      background: white;
      border-radius: 12px;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
      z-index: 9999;
      max-width: 95vw;
      max-height: 95vh;
      overflow: hidden;
      opacity: 0;
      transition: all 0.2s ease;
      display: none;
    }
    .bh-modal.active {
      display: block;
      opacity: 1;
      transform: translate(-50%, -50%) scale(1);
    }
    .bh-modal-close {
      position: absolute;
      top: 12px;
      right: 12px;
      width: 32px;
      height: 32px;
      border: none;
      background: rgba(0, 0, 0, 0.1);
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10;
      transition: background 0.15s;
    }
    .bh-modal-close:hover {
      background: rgba(0, 0, 0, 0.2);
    }
    .bh-modal-close svg {
      width: 16px;
      height: 16px;
    }
    .bh-drawer {
      position: fixed;
      top: 0;
      right: -100%;
      width: 100%;
      max-width: 480px;
      height: 100%;
      background: white;
      box-shadow: -4px 0 20px rgba(0, 0, 0, 0.15);
      z-index: 9999;
      transition: right 0.3s ease;
      overflow: hidden;
    }
    .bh-drawer.active {
      right: 0;
    }
    .bh-cart-button {
      position: fixed;
      bottom: 20px;
      right: 20px;
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: #f97316;
      color: white;
      border: none;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(249, 115, 22, 0.4);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9990;
      transition: all 0.2s;
    }
    .bh-cart-button:hover {
      transform: scale(1.05);
      box-shadow: 0 6px 16px rgba(249, 115, 22, 0.5);
    }
    .bh-cart-button svg {
      width: 24px;
      height: 24px;
    }
    .bh-cart-badge {
      position: absolute;
      top: -4px;
      right: -4px;
      min-width: 22px;
      height: 22px;
      background: #dc2626;
      color: white;
      border-radius: 11px;
      font-size: 12px;
      font-weight: 600;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0 6px;
    }
    .bh-modal-loading {
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      background: white;
      border-radius: 12px;
    }
    @media (prefers-color-scheme: dark) {
      .bh-widget-loading { background: #1f2937; }
      .bh-modal { background: #1f2937; }
      .bh-drawer { background: #1f2937; }
      .bh-modal-loading { background: #1f2937; }
    }
  `;

  // Main BH namespace
  const BH = {
    initialized: false,
    widgets: new Map(),
    cart: [],
    cartTotal: 0,
    modals: {},

    /**
     * Initialize the embed system
     */
    init: function() {
      if (this.initialized) return;

      // Inject styles
      this.injectStyles();

      // Mount existing widgets
      this.mountAll();

      // Watch for new widgets (for SPAs and lazy-loaded content)
      this.observeDOM();

      // Listen for messages from iframes
      this.setupMessageListener();

      // Handle URL params (for deep linking)
      this.handleUrlParams();

      // Listen for popstate (back/forward)
      window.addEventListener('popstate', () => this.handleUrlParams());

      this.initialized = true;
      console.log('[BouncePro] Embed system initialized');
    },

    /**
     * Inject CSS styles
     */
    injectStyles: function() {
      if (document.getElementById('bh-embed-styles')) return;

      const style = document.createElement('style');
      style.id = 'bh-embed-styles';
      style.textContent = STYLES;
      document.head.appendChild(style);
    },

    /**
     * Mount all widget elements on the page
     */
    mountAll: function() {
      const elements = document.querySelectorAll('[data-bh-widget]:not([data-bh-mounted])');
      elements.forEach(el => this.mount(el));
    },

    /**
     * Mount a single widget element
     */
    mount: function(element) {
      const widgetType = element.getAttribute('data-bh-widget');
      const tenant = element.getAttribute('data-tenant');

      if (!tenant) {
        console.error('[BouncePro] Missing data-tenant attribute');
        return;
      }

      // Mark as mounted
      element.setAttribute('data-bh-mounted', 'true');

      // Generate unique ID
      const widgetId = `bh-widget-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      element.setAttribute('data-bh-id', widgetId);

      // Get configuration
      const config = this.getConfig(element);

      // Store widget reference
      this.widgets.set(widgetId, { element, config, widgetType });

      // Setup custom cart trigger if specified
      if (config.cartElementId) {
        this.setupCustomCartTrigger(config.cartElementId, config, widgetId);
      }

      // Create widget based on type
      switch (widgetType) {
        case 'products':
          this.createProductsWidget(element, config, widgetId);
          break;
        case 'product':
          this.createProductWidget(element, config, widgetId);
          break;
        case 'categories':
          this.createCategoriesWidget(element, config, widgetId);
          break;
        case 'featured':
          this.createFeaturedWidget(element, config, widgetId);
          break;
        case 'checkout':
          this.createCheckoutWidget(element, config, widgetId);
          break;
        case 'cart':
          this.createCartButton(element, config, widgetId);
          break;
        default:
          console.error(`[BouncePro] Unknown widget type: ${widgetType}`);
      }
    },

    /**
     * Extract configuration from element attributes
     */
    getConfig: function(element) {
      return {
        tenant: element.getAttribute('data-tenant'),
        behavior: element.getAttribute('data-behavior') || 'modal',
        theme: element.getAttribute('data-theme') || 'auto',
        productUrl: element.getAttribute('data-product-url'),
        checkoutUrl: element.getAttribute('data-checkout-url'),
        category: element.getAttribute('data-category'),
        featured: element.getAttribute('data-featured') === 'true',
        limit: element.getAttribute('data-limit'),
        hideFilters: element.getAttribute('data-hide-filters') === 'true',
        hideCart: element.getAttribute('data-hide-cart') === 'true',
        primaryColor: element.getAttribute('data-primary-color'),
        productId: element.getAttribute('data-product-id'),
        productSlug: element.getAttribute('data-product-slug'),
        // Custom cart trigger element - allows customers to use their own cart button
        cartElementId: element.getAttribute('data-cart-element-id'),
        // Sorting/filtering defaults
        defaultSort: element.getAttribute('data-default-sort') || 'name',
        // Pagination
        perPage: parseInt(element.getAttribute('data-per-page')) || 12,
        showPagination: element.getAttribute('data-show-pagination') !== 'false',
      };
    },

    /**
     * Build iframe URL with query params
     */
    buildIframeUrl: function(widgetType, config) {
      const params = new URLSearchParams();

      if (config.theme) params.set('theme', config.theme);
      if (config.category) params.set('category', config.category);
      if (config.featured) params.set('featured', 'true');
      if (config.limit) params.set('limit', config.limit);
      if (config.perPage) params.set('perPage', config.perPage);
      if (config.hideFilters) params.set('hideFilters', 'true');
      if (config.hideCart) params.set('hideCart', 'true');
      if (config.primaryColor) params.set('primaryColor', config.primaryColor);
      if (config.defaultSort) params.set('defaultSort', config.defaultSort);
      if (config.behavior) params.set('behavior', config.behavior);
      if (config.productUrl) params.set('productUrl', config.productUrl);
      if (config.checkoutUrl) params.set('checkoutUrl', config.checkoutUrl);

      let path = '';
      switch (widgetType) {
        case 'products':
          path = `/embed/${config.tenant}/products`;
          break;
        case 'product':
          const idOrSlug = config.productSlug || config.productId;
          path = `/embed/${config.tenant}/product/${idOrSlug}`;
          break;
        case 'categories':
          path = `/embed/${config.tenant}/categories`;
          break;
        case 'featured':
          path = `/embed/${config.tenant}/featured`;
          break;
        case 'checkout':
          path = `/embed/${config.tenant}/checkout`;
          break;
      }

      return `${BH_BASE_URL}${path}?${params.toString()}`;
    },

    /**
     * Create products grid widget
     */
    createProductsWidget: function(element, config, widgetId) {
      // Show loading state
      element.innerHTML = `
        <div class="bh-widget-container">
          <div class="bh-widget-loading">
            <div class="bh-widget-loading-spinner"></div>
          </div>
        </div>
      `;

      // Create iframe
      const iframe = document.createElement('iframe');
      iframe.className = 'bh-widget-iframe';
      iframe.src = this.buildIframeUrl('products', config);
      iframe.setAttribute('allow', 'payment');
      iframe.setAttribute('data-bh-id', widgetId);

      // Show iframe and hide loading when ready
      iframe.onload = () => {
        const loading = element.querySelector('.bh-widget-loading');
        if (loading) loading.remove();
        iframe.style.display = 'block';
      };

      // Append hidden initially
      iframe.style.display = 'none';
      element.querySelector('.bh-widget-container').appendChild(iframe);
    },

    /**
     * Create single product widget
     */
    createProductWidget: function(element, config, widgetId) {
      element.innerHTML = `
        <div class="bh-widget-container">
          <div class="bh-widget-loading">
            <div class="bh-widget-loading-spinner"></div>
          </div>
        </div>
      `;

      const iframe = document.createElement('iframe');
      iframe.className = 'bh-widget-iframe';
      iframe.src = this.buildIframeUrl('product', config);
      iframe.setAttribute('allow', 'payment');
      iframe.setAttribute('data-bh-id', widgetId);

      iframe.onload = () => {
        const loading = element.querySelector('.bh-widget-loading');
        if (loading) loading.remove();
        iframe.style.display = 'block';
      };

      iframe.style.display = 'none';
      element.querySelector('.bh-widget-container').appendChild(iframe);
    },

    /**
     * Create categories widget
     */
    createCategoriesWidget: function(element, config, widgetId) {
      element.innerHTML = `
        <div class="bh-widget-container">
          <div class="bh-widget-loading">
            <div class="bh-widget-loading-spinner"></div>
          </div>
        </div>
      `;

      const iframe = document.createElement('iframe');
      iframe.className = 'bh-widget-iframe';
      iframe.src = this.buildIframeUrl('categories', config);
      iframe.setAttribute('allow', 'payment');
      iframe.setAttribute('data-bh-id', widgetId);

      iframe.onload = () => {
        const loading = element.querySelector('.bh-widget-loading');
        if (loading) loading.remove();
        iframe.style.display = 'block';
      };

      iframe.style.display = 'none';
      element.querySelector('.bh-widget-container').appendChild(iframe);
    },

    /**
     * Create featured items widget
     */
    createFeaturedWidget: function(element, config, widgetId) {
      element.innerHTML = `
        <div class="bh-widget-container">
          <div class="bh-widget-loading">
            <div class="bh-widget-loading-spinner"></div>
          </div>
        </div>
      `;

      const iframe = document.createElement('iframe');
      iframe.className = 'bh-widget-iframe';
      iframe.src = this.buildIframeUrl('featured', config);
      iframe.setAttribute('allow', 'payment');
      iframe.setAttribute('data-bh-id', widgetId);

      iframe.onload = () => {
        const loading = element.querySelector('.bh-widget-loading');
        if (loading) loading.remove();
        iframe.style.display = 'block';
      };

      iframe.style.display = 'none';
      element.querySelector('.bh-widget-container').appendChild(iframe);
    },

    /**
     * Create checkout widget
     */
    createCheckoutWidget: function(element, config, widgetId) {
      element.innerHTML = `
        <div class="bh-widget-container">
          <div class="bh-widget-loading">
            <div class="bh-widget-loading-spinner"></div>
          </div>
        </div>
      `;

      const iframe = document.createElement('iframe');
      iframe.className = 'bh-widget-iframe';
      iframe.src = this.buildIframeUrl('checkout', config);
      iframe.setAttribute('allow', 'payment');
      iframe.setAttribute('data-bh-id', widgetId);

      iframe.onload = () => {
        const loading = element.querySelector('.bh-widget-loading');
        if (loading) loading.remove();
        iframe.style.display = 'block';
      };

      iframe.style.display = 'none';
      element.querySelector('.bh-widget-container').appendChild(iframe);
    },

    /**
     * Create floating cart button
     */
    createCartButton: function(element, config, widgetId) {
      const button = document.createElement('button');
      button.className = 'bh-cart-button';
      button.setAttribute('data-bh-id', widgetId);
      button.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        <span class="bh-cart-badge" style="display: none;">0</span>
      `;

      button.onclick = () => this.openCartDrawer(config);

      // Place in element or append to body
      if (element.tagName === 'DIV') {
        element.appendChild(button);
      } else {
        document.body.appendChild(button);
      }

      this.widgets.get(widgetId).button = button;
    },

    /**
     * Open product in modal
     */
    openProductModal: function(config, productSlug) {
      this.closeAllModals();

      const modalId = 'bh-product-modal';
      let modal = document.getElementById(modalId);
      let overlay = document.getElementById('bh-modal-overlay');

      if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'bh-modal-overlay';
        overlay.className = 'bh-modal-overlay';
        overlay.onclick = () => this.closeAllModals();
        document.body.appendChild(overlay);
      }

      if (!modal) {
        modal = document.createElement('div');
        modal.id = modalId;
        modal.className = 'bh-modal';
        modal.style.width = '900px';
        modal.style.height = '700px';
        modal.innerHTML = `
          <button class="bh-modal-close" onclick="BH.closeAllModals()">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div class="bh-modal-loading">
            <div class="bh-widget-loading-spinner"></div>
          </div>
          <iframe class="bh-widget-iframe" style="width: 100%; height: 100%; display: none;" allow="payment"></iframe>
        `;
        document.body.appendChild(modal);
      }

      // Get elements
      const iframe = modal.querySelector('iframe');
      const loadingEl = modal.querySelector('.bh-modal-loading');

      // Show loading, hide iframe
      if (loadingEl) loadingEl.style.display = 'flex';
      iframe.style.display = 'none';

      // When iframe loads, hide loading and show iframe
      iframe.onload = () => {
        if (loadingEl) loadingEl.style.display = 'none';
        iframe.style.display = 'block';
      };

      // Update iframe src
      const productConfig = { ...config, productSlug };
      iframe.src = this.buildIframeUrl('product', productConfig);

      // Show modal immediately (with loading spinner inside)
      requestAnimationFrame(() => {
        overlay.classList.add('active');
        modal.classList.add('active');
      });

      // Update URL for deep linking
      this.updateUrl({ product: productSlug });

      // Prevent body scroll
      document.body.style.overflow = 'hidden';
    },

    /**
     * Open checkout in drawer
     */
    openCheckoutDrawer: function(config) {
      this.closeAllModals();

      const drawerId = 'bh-checkout-drawer';
      let drawer = document.getElementById(drawerId);
      let overlay = document.getElementById('bh-modal-overlay');

      if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'bh-modal-overlay';
        overlay.className = 'bh-modal-overlay';
        overlay.onclick = () => this.closeAllModals();
        document.body.appendChild(overlay);
      }

      if (!drawer) {
        drawer = document.createElement('div');
        drawer.id = drawerId;
        drawer.className = 'bh-drawer';
        drawer.innerHTML = `
          <button class="bh-modal-close" style="top: 16px; right: 16px;" onclick="BH.closeAllModals()">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <iframe class="bh-widget-iframe" style="width: 100%; height: 100%;" allow="payment"></iframe>
        `;
        document.body.appendChild(drawer);
      }

      // Pass cart data via URL
      const checkoutConfig = { ...config };
      const iframe = drawer.querySelector('iframe');

      // Build checkout URL with cart data
      const cartParam = encodeURIComponent(JSON.stringify(this.cart));
      iframe.src = `${BH_BASE_URL}/book/${config.tenant}/checkout?cart=${cartParam}&embed=true&theme=${config.theme || 'auto'}`;

      // Show drawer
      requestAnimationFrame(() => {
        overlay.classList.add('active');
        drawer.classList.add('active');
      });

      // Update URL for deep linking
      this.updateUrl({ checkout: '1' });

      // Prevent body scroll
      document.body.style.overflow = 'hidden';
    },

    /**
     * Open cart drawer
     */
    openCartDrawer: function(config) {
      // Cart drawer is same as checkout drawer for now
      this.openCheckoutDrawer(config);
    },

    /**
     * Close all modals and drawers
     */
    closeAllModals: function() {
      const overlay = document.getElementById('bh-modal-overlay');
      const modal = document.getElementById('bh-product-modal');
      const drawer = document.getElementById('bh-checkout-drawer');

      if (overlay) overlay.classList.remove('active');
      if (modal) modal.classList.remove('active');
      if (drawer) drawer.classList.remove('active');

      // Restore body scroll
      document.body.style.overflow = '';

      // Clear URL params
      this.updateUrl({ product: null, checkout: null });
    },

    /**
     * Update cart badge
     */
    updateCartBadge: function() {
      const itemCount = this.cart.reduce((sum, item) => sum + item.quantity, 0);

      document.querySelectorAll('.bh-cart-badge').forEach(badge => {
        if (itemCount > 0) {
          badge.style.display = 'flex';
          badge.textContent = itemCount > 99 ? '99+' : itemCount;
        } else {
          badge.style.display = 'none';
        }
      });
    },

    /**
     * Update URL with params (for deep linking)
     */
    updateUrl: function(params) {
      const url = new URL(window.location.href);

      Object.entries(params).forEach(([key, value]) => {
        if (value === null || value === undefined) {
          url.searchParams.delete(`bh_${key}`);
        } else {
          url.searchParams.set(`bh_${key}`, value);
        }
      });

      window.history.pushState({}, '', url.toString());
    },

    /**
     * Handle URL params on page load (deep linking)
     */
    handleUrlParams: function() {
      const url = new URL(window.location.href);
      const product = url.searchParams.get('bh_product');
      const checkout = url.searchParams.get('bh_checkout');

      // Find first widget config
      const firstWidget = this.widgets.values().next().value;
      if (!firstWidget) return;

      const config = firstWidget.config;

      if (product) {
        this.openProductModal(config, product);
      } else if (checkout) {
        this.openCheckoutDrawer(config);
      }
    },

    /**
     * Setup message listener for iframe communication
     */
    setupMessageListener: function() {
      window.addEventListener('message', (event) => {
        // Validate source
        if (!event.data?.type?.startsWith('bh:')) return;

        const data = event.data;

        switch (data.type) {
          case 'bh:ready':
            console.log('[BouncePro] Widget ready:', data.widgetType, data.tenantSlug);
            // Hide loading, show iframe
            const iframes = document.querySelectorAll('.bh-widget-iframe');
            iframes.forEach(iframe => {
              iframe.style.display = 'block';
            });
            break;

          case 'bh:cart:updated':
            this.cart = data.cart || [];
            this.cartTotal = data.total || 0;
            this.updateCartBadge();
            // Dispatch custom event for parent page
            window.dispatchEvent(new CustomEvent('bh:cart:updated', {
              detail: { cart: this.cart, total: this.cartTotal, itemCount: data.itemCount }
            }));
            break;

          case 'bh:item:clicked':
            const widget = this.findWidgetByIframe(event.source);
            if (widget) {
              this.handleItemClick(widget.config, data.item);
            }
            break;

          case 'bh:checkout:requested':
            const checkoutWidget = this.findWidgetByIframe(event.source);
            if (checkoutWidget) {
              this.handleCheckoutRequest(checkoutWidget.config, data);
            }
            break;

          case 'bh:height:changed':
            // Auto-resize iframe
            if (event.source) {
              const iframeElements = document.querySelectorAll('.bh-widget-iframe');
              iframeElements.forEach(iframe => {
                if (iframe.contentWindow === event.source) {
                  iframe.style.height = data.height + 'px';
                }
              });
            }
            break;

          case 'bh:navigate':
            const navWidget = this.findWidgetByIframe(event.source);
            if (navWidget) {
              this.handleNavigation(navWidget.config, data.to, data.params);
            }
            break;

          case 'bh:item:added':
            // Item was added to cart from product modal - close modal and sync cart
            this.closeAllModals();
            // Save cart to localStorage for sync
            localStorage.setItem('bh_cart_' + (this.findWidgetByIframe(event.source)?.config?.tenant || 'default'), JSON.stringify(this.cart));
            // Sync cart to main products widget
            this.syncCartToWidgets();
            // Dispatch event for parent page
            window.dispatchEvent(new CustomEvent('bh:item:added', {
              detail: data.item
            }));
            break;
        }
      });
    },

    /**
     * Sync cart state to all product widgets
     */
    syncCartToWidgets: function() {
      // Deep clone cart to avoid postMessage cloning issues with reactive objects
      const cartCopy = JSON.parse(JSON.stringify(this.cart));
      this.widgets.forEach((widget, id) => {
        if (widget.widgetType === 'products') {
          this.sendCommand(id, 'bh:cart:sync', { cart: cartCopy });
        }
      });
    },

    /**
     * Setup custom cart trigger element
     * Allows customers to use their own cart button instead of/in addition to our built-in one
     */
    setupCustomCartTrigger: function(elementId, config, widgetId) {
      const element = document.getElementById(elementId);
      if (!element) {
        console.warn(`[BouncePro] Custom cart trigger element #${elementId} not found`);
        return;
      }

      // Add click handler
      element.addEventListener('click', (e) => {
        e.preventDefault();
        this.openCheckoutDrawer(config);
      });

      // Update badge on cart changes
      const updateBadge = () => {
        const itemCount = this.cart.reduce((sum, item) => sum + item.quantity, 0);
        // Try to find and update badge within the element
        let badge = element.querySelector('.bh-custom-cart-badge');
        if (!badge) {
          badge = element.querySelector('[data-cart-count]');
        }
        if (badge) {
          badge.textContent = itemCount > 99 ? '99+' : itemCount;
          badge.style.display = itemCount > 0 ? '' : 'none';
        }
        // Also set data attribute for CSS-based styling
        element.setAttribute('data-cart-count', itemCount);
      };

      // Listen for cart updates
      window.addEventListener('bh:cart:updated', updateBadge);
      updateBadge(); // Initial update
    },

    /**
     * Find widget by iframe contentWindow
     */
    findWidgetByIframe: function(contentWindow) {
      for (const [id, widget] of this.widgets) {
        const iframe = widget.element.querySelector('iframe');
        if (iframe && iframe.contentWindow === contentWindow) {
          return widget;
        }
      }
      return null;
    },

    /**
     * Handle item click based on behavior mode
     */
    handleItemClick: function(config, item) {
      const behavior = config.behavior || 'modal';

      switch (behavior) {
        case 'modal':
          this.openProductModal(config, item.slug || item.id);
          break;

        case 'navigate':
          if (config.productUrl) {
            const url = config.productUrl
              .replace('{slug}', item.slug || '')
              .replace('{id}', item.id || '');
            window.location.href = url;
          } else {
            // Fallback to modal
            this.openProductModal(config, item.slug || item.id);
          }
          break;

        case 'hosted':
          // Open on hosted domain
          window.open(`${BH_BASE_URL}/book/${config.tenant}/products/${item.slug || item.id}`, '_blank');
          break;
      }
    },

    /**
     * Handle checkout request based on behavior mode
     */
    handleCheckoutRequest: function(config, data) {
      const behavior = config.behavior || 'modal';

      switch (behavior) {
        case 'modal':
          this.openCheckoutDrawer(config);
          break;

        case 'navigate':
          if (config.checkoutUrl) {
            // Save cart to localStorage for the checkout page to retrieve
            localStorage.setItem('bh_cart', JSON.stringify(data.cart));
            localStorage.setItem('bh_cart_tenant', config.tenant);
            window.location.href = config.checkoutUrl;
          } else {
            this.openCheckoutDrawer(config);
          }
          break;

        case 'hosted':
          // Redirect to hosted checkout
          window.location.href = data.checkoutUrl;
          break;
      }
    },

    /**
     * Handle navigation requests
     */
    handleNavigation: function(config, to, params) {
      switch (to) {
        case 'checkout':
          this.handleCheckoutRequest(config, { cart: this.cart, total: this.cartTotal });
          break;
        case 'products':
          this.closeAllModals();
          break;
        case 'product':
          if (params?.slug || params?.id) {
            this.handleItemClick(config, params);
          }
          break;
      }
    },

    /**
     * Observe DOM for dynamically added widgets
     */
    observeDOM: function() {
      const observer = new MutationObserver((mutations) => {
        let shouldMount = false;

        mutations.forEach(mutation => {
          mutation.addedNodes.forEach(node => {
            if (node.nodeType === 1) {
              if (node.hasAttribute && node.hasAttribute('data-bh-widget')) {
                shouldMount = true;
              }
              if (node.querySelectorAll) {
                const widgets = node.querySelectorAll('[data-bh-widget]:not([data-bh-mounted])');
                if (widgets.length > 0) {
                  shouldMount = true;
                }
              }
            }
          });
        });

        if (shouldMount) {
          this.mountAll();
        }
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true
      });
    },

    /**
     * Send command to widget iframe
     */
    sendCommand: function(widgetId, type, payload = {}) {
      const widget = this.widgets.get(widgetId);
      if (!widget) return;

      const iframe = widget.element.querySelector('iframe');
      if (iframe && iframe.contentWindow) {
        iframe.contentWindow.postMessage({ type, ...payload }, '*');
      }
    },

    /**
     * Public API: Add item to cart
     */
    addToCart: function(itemId, quantity = 1) {
      // Send to all product widgets
      this.widgets.forEach((widget, id) => {
        if (widget.widgetType === 'products') {
          this.sendCommand(id, 'bh:cart:add', { itemId, quantity });
        }
      });
    },

    /**
     * Public API: Clear cart
     */
    clearCart: function() {
      this.widgets.forEach((widget, id) => {
        if (widget.widgetType === 'products') {
          this.sendCommand(id, 'bh:cart:clear');
        }
      });
    },

    /**
     * Public API: Set theme
     */
    setTheme: function(theme) {
      this.widgets.forEach((widget, id) => {
        this.sendCommand(id, 'bh:theme:set', { theme });
      });
    },

    /**
     * Public API: Open checkout
     */
    openCheckout: function() {
      const firstWidget = this.widgets.values().next().value;
      if (firstWidget) {
        this.openCheckoutDrawer(firstWidget.config);
      }
    },

    /**
     * Public API: Get products with optional filters
     * @param {Object} filters - { category, featured, search, sort, limit }
     * @returns {Promise<Array>} Array of products
     */
    getProducts: async function(filters = {}) {
      const firstWidget = this.widgets.values().next().value;
      if (!firstWidget) {
        console.error('[BouncePro] No widget mounted. Cannot fetch products.');
        return [];
      }

      const tenant = firstWidget.config.tenant;
      const params = new URLSearchParams();
      if (filters.category) params.set('category', filters.category);
      if (filters.featured) params.set('featured', 'true');
      if (filters.search) params.set('search', filters.search);
      if (filters.sort) params.set('sort', filters.sort);
      if (filters.limit) params.set('limit', filters.limit);

      try {
        const response = await fetch(`${BH_BASE_URL}/public/items/${tenant}?${params.toString()}`);
        const data = await response.json();
        return data.items || [];
      } catch (err) {
        console.error('[BouncePro] Failed to fetch products:', err);
        return [];
      }
    },

    /**
     * Public API: Get product details by slug or ID
     * @param {string} slugOrId - Product slug or ID
     * @returns {Promise<Object|null>} Product details or null
     */
    getProductDetails: async function(slugOrId) {
      const firstWidget = this.widgets.values().next().value;
      if (!firstWidget) {
        console.error('[BouncePro] No widget mounted. Cannot fetch product.');
        return null;
      }

      const tenant = firstWidget.config.tenant;

      try {
        // First get all items, then filter by slug/id
        const response = await fetch(`${BH_BASE_URL}/public/items/${tenant}`);
        const data = await response.json();
        const items = data.items || [];
        return items.find(item => item.slug === slugOrId || String(item.id) === String(slugOrId)) || null;
      } catch (err) {
        console.error('[BouncePro] Failed to fetch product details:', err);
        return null;
      }
    },

    /**
     * Public API: Get categories
     * @returns {Promise<Array>} Array of categories
     */
    getCategories: async function() {
      const firstWidget = this.widgets.values().next().value;
      if (!firstWidget) {
        console.error('[BouncePro] No widget mounted. Cannot fetch categories.');
        return [];
      }

      const tenant = firstWidget.config.tenant;

      try {
        // Get all items and extract unique categories
        const response = await fetch(`${BH_BASE_URL}/public/items/${tenant}`);
        const data = await response.json();
        const items = data.items || [];
        const categories = [...new Set(items.map(item => item.category).filter(Boolean))];
        return categories.map(cat => ({
          id: cat.toLowerCase().replace(/\s+/g, '-'),
          name: cat,
          count: items.filter(item => item.category === cat).length
        }));
      } catch (err) {
        console.error('[BouncePro] Failed to fetch categories:', err);
        return [];
      }
    },

    /**
     * Public API: Get tenant info
     * @returns {Promise<Object|null>} Tenant info or null
     */
    getTenant: async function() {
      const firstWidget = this.widgets.values().next().value;
      if (!firstWidget) {
        console.error('[BouncePro] No widget mounted. Cannot fetch tenant.');
        return null;
      }

      const tenant = firstWidget.config.tenant;

      try {
        const response = await fetch(`${BH_BASE_URL}/public/tenant/${tenant}`);
        return await response.json();
      } catch (err) {
        console.error('[BouncePro] Failed to fetch tenant:', err);
        return null;
      }
    },

    /**
     * Public API: Open product modal
     * @param {string} slugOrId - Product slug or ID
     */
    openProduct: function(slugOrId) {
      const firstWidget = this.widgets.values().next().value;
      if (firstWidget) {
        this.openProductModal(firstWidget.config, slugOrId);
      }
    },

    /**
     * Public API: Filter products by category
     * @param {string} category - Category to filter by (or null to clear)
     */
    filterByCategory: function(category) {
      this.widgets.forEach((widget, id) => {
        if (widget.widgetType === 'products') {
          this.sendCommand(id, 'bh:filter:category', { category });
        }
      });
    },

    /**
     * Public API: Search products
     * @param {string} query - Search query
     */
    search: function(query) {
      this.widgets.forEach((widget, id) => {
        if (widget.widgetType === 'products') {
          this.sendCommand(id, 'bh:search', { query });
        }
      });
    }
  };

  // Expose to window
  window.BH = BH;

  // Auto-initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => BH.init());
  } else {
    BH.init();
  }
})();
