// Product Data
const products = [
    {
        id: 1,
        name: 'Wireless Bluetooth Headphones',
        category: 'Electronics',
        price: 89.99,
        oldPrice: 109.99,
        rating: 4.5,
        ratingCount: 128,
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format',
        badge: 'Sale'
    },
    {
        id: 2,
        name: 'Smart Watch Fitness Tracker',
        category: 'Electronics',
        price: 129.99,
        oldPrice: 149.99,
        rating: 4,
        ratingCount: 86,
        image: 'https://images.unsplash.com/photo-1523275335684-378310bec514?w=600&auto=format',
        badge: 'Popular'
    },
    {
        id: 3,
        name: 'Cotton T-Shirt',
        category: 'Clothing',
        price: 24.99,
        rating: 4.7,
        ratingCount: 214,
        image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&auto=format'
    },
    {
        id: 4,
        name: 'Leather Wallet',
        category: 'Accessories',
        price: 49.99,
        oldPrice: 59.99,
        rating: 4.2,
        ratingCount: 45,
        image: 'https://images.unsplash.com/photo-1610392630131-c7065185af2e?w=600&auto=format',
        badge: 'Deal'
    },
    {
        id: 5,
        name: 'Glass Water Bottle',
        category: 'Home',
        price: 19.99,
        rating: 4.8,
        ratingCount: 156,
        image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&auto=format'
    },
    {
        id: 6,
        name: 'Wireless Charging Pad',
        category: 'Electronics',
        price: 35.99,
        oldPrice: 45.99,
        rating: 3.9,
        ratingCount: 72,
        image: 'https://images.unsplash.com/photo-1585474035108-c7584ff3909e?w=600&auto=format',
        badge: 'New'
    }
];

// DOM Elements
const productsGrid = document.getElementById('products-grid');
const cartItemsContainer = document.getElementById('cart-items');
const cartBtn = document.getElementById('cart-btn');
const closeCartBtn = document.getElementById('close-cart');
const cartSidebar = document.getElementById('cart-sidebar');
const overlay = document.getElementById('overlay');
const cartCount = document.querySelector('.cart-count');
const cartTotalCount = document.getElementById('cart-total-count');
const cartSubtotal = document.getElementById('cart-subtotal');
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const closeMenuBtn = document.getElementById('close-menu');
const mobileMenu = document.getElementById('mobile-menu');
const filterBtns = document.querySelectorAll('.filter-btn');
const sortSelect = document.querySelector('.sort-select');

// Cart state
let cart = [];

// Initialize the app
function init() {
    renderProducts(products);
    setupEventListeners();
    
    // Add notification styles
    addNotificationStyles();
}

// Render products to the DOM
function renderProducts(productsToRender) {
    productsGrid.innerHTML = '';
    
    if (productsToRender.length === 0) {
        productsGrid.innerHTML = '<p class="no-products">No products found</p>';
        return;
    }
    
    productsToRender.forEach(product => {
        const productEl = document.createElement('div');
        productEl.classList.add('product-card');
        productEl.innerHTML = `
            <div class="product-img">
                ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ''}
                <img src="${product.image}" alt="${product.name}">
                <button class="product-wishlist">
                    <i class="far fa-heart"></i>
                </button>
            </div>
            <div class="product-details">
                <span class="product-category">${product.category}</span>
                <h3 class="product-title">${product.name}</h3>
                <div class="product-price">
                    <span class="current-price">$${product.price.toFixed(2)}</span>
                    ${product.oldPrice ? `<span class="old-price">$${product.oldPrice.toFixed(2)}</span>` : ''}
                </div>
                <div class="product-rating">
                    ${generateStarRating(product.rating)}
                    <span class="product-rating-count">(${product.ratingCount})</span>
                </div>
                <button class="product-btn" data-id="${product.id}">
                    ADD TO CART
                </button>
            </div>
        `;
        productsGrid.appendChild(productEl);
    });
    
    // Add event listeners to all "Add to Cart" buttons
    document.querySelectorAll('.product-btn').forEach(btn => {
        btn.addEventListener('click', () => addToCart(parseInt(btn.dataset.id)));
    });
    
    // Add event listeners to wishlist buttons
    document.querySelectorAll('.product-wishlist').forEach(btn => {
        btn.addEventListener('click', toggleWishlist);
    });
}

// Generate star rating HTML
function generateStarRating(rating) {
    let stars = '';
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < 5; i++) {
        if (i < fullStars) {
            stars += '<i class="fas fa-star"></i>';
        } else if (i === fullStars && hasHalfStar) {
            stars += '<i class="fas fa-star-half-alt"></i>';
        } else {
            stars += '<i class="far fa-star"></i>';
        }
    }
    
    return stars;
}

// Add to cart function
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    updateCart();
    showAddToCartNotification(product.name);
}

// Remove from cart function
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCart();
}

// Update quantity function
function updateQuantity(productId, newQuantity) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity = newQuantity;
        if (newQuantity < 1) {
            removeFromCart(productId);
        } else {
            updateCart();
        }
    }
}

// Update cart UI
function updateCart() {
    // Update cart items list
    cartItemsContainer.innerHTML = '';
    
    cart.forEach(item => {
        const cartItemEl = document.createElement('div');
        cartItemEl.classList.add('cart-item');
        cartItemEl.innerHTML = `
            <div class="cart-item-img">
                <img src="${item.image}" alt="${item.name}">
            </div>
            <div class="cart-item-details">
                <h4 class="cart-item-title">${item.name}</h4>
                <div class="cart-item-price">$${(item.price * item.quantity).toFixed(2)}</div>
                <div class="cart-item-quantity">
                    <button class="quantity-btn minus" data-id="${item.id}">-</button>
                    <input type="number" value="${item.quantity}" min="1" class="quantity-input" data-id="${item.id}">
                    <button class="quantity-btn plus" data-id="${item.id}">+</button>
                </div>
                <button class="cart-item-remove" data-id="${item.id}">
                    <i class="fas fa-trash"></i> Remove
                </button>
            </div>
        `;
        cartItemsContainer.appendChild(cartItemEl);
    });
    
    // Update cart count
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    cartTotalCount.textContent = totalItems;
    
    // Update subtotal
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartSubtotal.textContent = `$${subtotal.toFixed(2)}`;
    
    // Add event listeners to quantity buttons
    document.querySelectorAll('.quantity-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const productId = parseInt(btn.dataset.id);
            const input = document.querySelector(`.quantity-input[data-id="${productId}"]`);
            let quantity = parseInt(input.value);
            
            if (btn.classList.contains('minus')) {
                quantity = Math.max(1, quantity - 1);
            } else {
                quantity += 1;
            }
            
            input.value = quantity;
            updateQuantity(productId, quantity);
        });
    });
    
    // Add event listeners to quantity inputs
    document.querySelectorAll('.quantity-input').forEach(input => {
        input.addEventListener('change', () => {
            const productId = parseInt(input.dataset.id);
            const quantity = parseInt(input.value);
            
            if (isNaN(quantity) || quantity < 1) {
                input.value = 1;
                updateQuantity(productId, 1);
            } else {
                updateQuantity(productId, quantity);
            }
        });
    });
    
    // Add event listeners to remove buttons
    document.querySelectorAll('.cart-item-remove').forEach(btn => {
        btn.addEventListener('click', () => {
            removeFromCart(parseInt(btn.dataset.id));
        });
    });
}

// Show add to cart notification
function showAddToCartNotification(productName) {
    const notification = document.createElement('div');
    notification.classList.add('add-to-cart-notification');
    notification.innerHTML = `
        <i class="fas fa-check-circle"></i> ${productName} added to cart!
    `;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Toggle wishlist status
function toggleWishlist(e) {
    const heartIcon = e.currentTarget.querySelector('i');
    heartIcon.classList.toggle('far');
    heartIcon.classList.toggle('fas');
    e.currentTarget.classList.toggle('active');
}

// Filter products by category
function filterProducts(category) {
    if (category === 'All') {
        renderProducts(products);
    } else {
        const filteredProducts = products.filter(product => product.category === category);
        renderProducts(filteredProducts);
    }
}

// Sort products
function sortProducts(sortBy) {
    const sortedProducts = [...products];
    
    switch (sortBy) {
        case 'Price: Low to High':
            sortedProducts.sort((a, b) => a.price - b.price);
            break;
        case 'Price: High to Low':
            sortedProducts.sort((a, b) => b.price - a.price);
            break;
        case 'Rating':
            sortedProducts.sort((a, b) => b.rating - a.rating);
            break;
        default:
            // Default sorting (by id or whatever the original order was)
            break;
    }
    
    renderProducts(sortedProducts);
}

// Set up event listeners
function setupEventListeners() {
    // Cart toggle
    cartBtn.addEventListener('click', () => {
        cartSidebar.classList.add('active');
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
    
    closeCartBtn.addEventListener('click', closeCart);
    overlay.addEventListener('click', () => {
        closeCart();
        closeMobileMenu();
    });
    
    // Mobile menu toggle
    mobileMenuBtn.addEventListener('click', () => {
        mobileMenu.classList.add('active');
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
    
    closeMenuBtn.addEventListener('click', closeMobileMenu);
    
    // Filter buttons
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            filterProducts(btn.textContent);
        });
    });
    
    // Sort select
    sortSelect.addEventListener('change', (e) => {
        sortProducts(e.target.value);
    });
}

// Close cart function
function closeCart() {
    cartSidebar.classList.remove('active');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
}

// Close mobile menu function
function closeMobileMenu() {
    mobileMenu.classList.remove('active');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
}

// Add notification styles
function addNotificationStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .add-to-cart-notification {
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%) translateY(100px);
            background-color: var(--success);
            color: white;
            padding: 12px 24px;
            border-radius: var(--rounded);
            display: flex;
            align-items: center;
            gap: 8px;
            box-shadow: var(--shadow-lg);
            z-index: 400;
            opacity: 0;
            transition: all 0.3s ease;
        }
        
        .add-to-cart-notification.show {
            transform: translateX(-50%) translateY(0);
            opacity: 1;
        }
        
        .add-to-cart-notification i {
            font-size: 1.2rem;
        }
        
        .no-products {
            text-align: center;
            grid-column: 1 / -1;
            padding: 2rem;
            color: var(--gray);
        }
        
        @media (max-width: 768px) {
            .navbar {
                flex-wrap: wrap;
                padding: 1rem;
            }
            
            .logo {
                font-size: 1.2rem;
            }
            
            .search-bar {
                order: 3;
                width: 100%;
                margin: 1rem 0 0 0;
            }
            
            .nav-icons {
                gap: 1rem;
            }
            
            .mobile-menu-btn {
                display: block;
            }
            
            .hero h1 {
                font-size: 2rem;
            }
            
            .hero p {
                font-size: 1rem;
            }
            
            .cart-sidebar {
                width: 100%;
                max-width: 360px;
            }
            
            .filter-group {
                flex-wrap: wrap;
            }
        }
    `;
    document.head.appendChild(style);
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', init);
