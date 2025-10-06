let cartItems = [];
let cartTotal = 0;
let nextCartItemId = 1;

const products = [
    {
        id: 1,
        name: "Premium Headphones",
        description: "High-quality wireless headphones with noise cancellation",
        price: 8999,
        category: "electronics",
        image: "assets/1-Premium_Headphones.jpg",
        badge: "NEW"
    },
    {
        id: 2,
        name: "Sport Sneakers",
        description: "Comfortable running shoes perfect for daily workouts",
        price: 4599,
        originalPrice: 6999,
        category: "fashion",
        image: "assets/2-Sport_Sneakers.jpg",
        badge: "SALE"
    },
    {
        id: 3,
        name: "Smart Watch Pro",
        description: "Advanced fitness tracking with heart rate monitor",
        price: 12999,
        category: "electronics",
        image: "assets/3-Smart_Watch_Pro.jpg",
        badge: "HOT"
    },
    {
        id: 4,
        name: "Leather Handbag",
        description: "Premium genuine leather bag with elegant design",
        price: 7499,
        category: "accessories",
        image: "assets/4-Leather_Handbag.jpg",
    },
    {
        id: 5,
        name: "Gaming Laptop",
        description: "High-performance laptop for gaming and professional work",
        price: 89999,
        category: "electronics",
        image: "assets/5-Gaming_Laptop.jpg",
        badge: "NEW"
    },
    {
        id: 6,
        name: "Casual Cotton Shirt",
        description: "Comfortable cotton shirt perfect for daily wear",
        price: 1899,
        originalPrice: 2499,
        category: "fashion",
        image: "assets/6-Casual_Cotton_Shirt.jpg",
        badge: "SALE"
    },
    {
        id: 7,
        name: "Electric Coffee Maker",
        description: "Automatic coffee maker with programmable timer",
        price: 5999,
        category: "home",
        image: "assets/7-Electric_Coffee_Maker.jpg",
        badge: "HOT"
    },
    {
        id: 8,
        name: "Designer Sunglasses",
        description: "UV protection sunglasses with polarized lenses",
        price: 3999,
        category: "accessories",
        image: "assets/8-Designer_Sunglasses.jpg"
    },
    {
        id: 9,
        name: "Latest Smartphone",
        description: "5G enabled smartphone with triple camera system",
        price: 45999,
        category: "electronics",
        image: "assets/9-Latest_Smartphone.jpg",
        badge: "NEW"
    },
    {
        id: 10,
        name: "LED Table Lamp",
        description: "Adjustable LED desk lamp with USB charging port",
        price: 2299,
        originalPrice: 2999,
        category: "home",
        image: "assets/10-LED_Table_Lamp.jpg",
        badge: "SALE"
    },
    {
        id: 11,
        name: "Winter Jacket",
        description: "Waterproof winter jacket with thermal insulation",
        price: 8499,
        category: "fashion",
        image: "assets/11-Winter_Jacket.jpg",
        badge: "HOT"
    },
    {
        id: 12,
        name: "Wireless Charger",
        description: "Fast wireless charging pad compatible with all devices",
        price: 1999,
        category: "accessories",
        image: "assets/12-Wireless_Charger.jpg"
    }
];

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    createCartOverlay();
});

function initializeApp() {
    setupEventListeners();
    calculateDiscounts();
    initializeProductTotals();
    loadCartFromStorage();
    updateAllCartDisplays();
    console.log(`Initialized with ${products.length} products in catalog`);
}

function createCartOverlay() {
    const overlayHTML = `
        <div class="cart-overlay" id="cart-overlay" style="display: none;">
            <div class="cart-overlay-backdrop" onclick="closeCartOverlay()"></div>
            <div class="cart-overlay-content">
                <div class="cart-overlay-header">
                    <h2>🛒 Shopping Cart</h2>
                    <button class="close-cart-btn" onclick="closeCartOverlay()">✕</button>
                </div>
                <div class="cart-overlay-body" id="cart-overlay-items">
                    <!-- Cart items will be rendered here -->
                </div>
                <div class="cart-overlay-footer">
                    <div class="cart-totals">
                        <div class="subtotal">Subtotal: NPR <span id="overlay-subtotal">0</span></div>
                        <div class="tax">Tax (13%): NPR <span id="overlay-tax">0</span></div>
                        <div class="shipping">Shipping: NPR <span id="overlay-shipping">0</span></div>
                        <div class="final-total">Total: NPR <span id="overlay-final-total">0</span></div>
                    </div>
                    <div class="cart-actions">
                        <button class="clear-cart-btn" onclick="clearCart()">Clear Cart</button>
                        <button class="checkout-btn" onclick="proceedToCheckout()">Proceed to Checkout</button>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', overlayHTML);

    const overlayStyles = `
        <style>
        .cart-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 1000;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .cart-overlay-backdrop {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            backdrop-filter: blur(5px);
        }

        .cart-overlay-content {
            position: relative;
            width: 90%;
            max-width: 800px;
            max-height: 90vh;
            background: white;
            border-radius: 15px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            display: flex;
            flex-direction: column;
            overflow: hidden;
        }

        .cart-overlay-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 20px 25px;
            border-bottom: 1px solid #eee;
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: white;
        }

        .cart-overlay-header h2 {
            margin: 0;
            font-size: 1.5rem;
        }

        .close-cart-btn {
            background: none;
            border: none;
            color: white;
            font-size: 24px;
            cursor: pointer;
            padding: 5px;
            border-radius: 50%;
            width: 35px;
            height: 35px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: background 0.3s ease;
        }

        .close-cart-btn:hover {
            background: rgba(255, 255, 255, 0.2);
        }

        .cart-overlay-body {
            flex: 1;
            overflow-y: auto;
            padding: 20px;
            min-height: 300px;
        }

        .cart-overlay-footer {
            border-top: 1px solid #eee;
            padding: 20px 25px;
            background: #f8f9fa;
        }

        .overlay-cart-item {
            display: flex;
            align-items: center;
            padding: 15px;
            border-bottom: 1px solid #eee;
            gap: 15px;
        }

        .overlay-cart-item:last-child {
            border-bottom: none;
        }

        .overlay-cart-item-image {
            width: 80px;
            height: 80px;
            border-radius: 8px;
            overflow: hidden;
            flex-shrink: 0;
        }

        .overlay-cart-item-image img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }

        .overlay-cart-item-details {
            flex: 1;
        }

        .overlay-cart-item-name {
            font-weight: 600;
            margin-bottom: 5px;
            color: #333;
        }

        .overlay-cart-item-price {
            color: #666;
            font-size: 0.9rem;
            margin-bottom: 8px;
        }

        .overlay-cart-item-quantity {
            display: flex;
            align-items: center;
            gap: 8px;
            margin-bottom: 5px;
        }

        .overlay-cart-item-total {
            font-weight: 600;
            color: #667eea;
        }

        .overlay-cart-qty-btn {
            width: 28px;
            height: 28px;
            border: 1px solid #ddd;
            background: white;
            border-radius: 4px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            transition: all 0.2s ease;
        }

        .overlay-cart-qty-btn:hover:not(:disabled) {
            background: #667eea;
            color: white;
            border-color: #667eea;
        }

        .overlay-cart-qty-btn:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }

        .overlay-qty-input {
            width: 50px;
            height: 28px;
            text-align: center;
            border: 1px solid #ddd;
            border-radius: 4px;
        }

        .overlay-remove-btn {
            background: #dc3545;
            color: white;
            border: none;
            padding: 8px 12px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 0.8rem;
            transition: background 0.3s ease;
        }

        .overlay-remove-btn:hover {
            background: #c82333;
        }

        .empty-cart-overlay {
            text-align: center;
            padding: 40px 20px;
            color: #666;
        }

        .empty-cart-overlay h3 {
            margin-bottom: 10px;
            color: #333;
        }

        .cart-totals {
            margin-bottom: 20px;
        }

        .cart-totals > div {
            display: flex;
            justify-content: space-between;
            margin-bottom: 8px;
            padding: 5px 0;
        }

        .final-total {
            font-weight: bold;
            font-size: 1.1rem;
            border-top: 2px solid #667eea;
            padding-top: 10px;
            margin-top: 10px;
            color: #333;
        }

        .cart-actions {
            display: flex;
            gap: 15px;
        }

        .cart-actions button {
            flex: 1;
            padding: 12px;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-weight: 600;
            transition: all 0.3s ease;
        }

        .clear-cart-btn {
            background: #6c757d;
            color: white;
        }

        .clear-cart-btn:hover {
            background: #5a6268;
        }

        .checkout-btn {
            background: linear-gradient(135deg, #28a745, #20c997);
            color: white;
        }

        .checkout-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(40, 167, 69, 0.4);
        }

        @media (max-width: 768px) {
            .cart-overlay-content {
                width: 95%;
                margin: 10px;
            }

            .overlay-cart-item {
                flex-direction: column;
                align-items: flex-start;
                text-align: center;
            }

            .cart-actions {
                flex-direction: column;
            }
        }
        </style>
    `;

    document.head.insertAdjacentHTML('beforeend', overlayStyles);
}

function setupEventListeners() {
    document.querySelectorAll('.category-list li').forEach(item => {
        item.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            filterProducts(filter);
            setActiveCategory(this);
        });
    });

    document.querySelectorAll('.details-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const productCard = this.closest('.product-card');
            const productName = productCard.querySelector('h3').textContent;
            showProductDetails(productName);
        });
    });

    document.getElementById('searchInput').addEventListener('input', searchProducts);
}


function openCartOverlay() {
    const overlay = document.getElementById('cart-overlay');
    overlay.style.display = 'flex';
    document.body.style.overflow = 'hidden'; 
    renderCartOverlayItems();
    updateCartOverlayTotals();
}

function closeCartOverlay() {
    const overlay = document.getElementById('cart-overlay');
    overlay.style.display = 'none';
    document.body.style.overflow = 'auto'; 
}

function renderCartOverlayItems() {
    const container = document.getElementById('cart-overlay-items');

    if (cartItems.length === 0) {
        container.innerHTML = `
            <div class="empty-cart-overlay">
                <h3>🛒 Your cart is empty</h3>
                <p>Start shopping to add items to your cart!</p>
                <p>Browse our ${products.length} available products.</p>
            </div>`;
        return;
    }

    const itemsHTML = cartItems.map(item => `
        <div class="overlay-cart-item">
            <div class="overlay-cart-item-image">
                <img src="${item.image}" alt="${item.name}" onerror="this.src='https://via.placeholder.com/80x80/f0f0f0/888888?text=No+Image'">
            </div>
            <div class="overlay-cart-item-details">
                <div class="overlay-cart-item-name">${item.name}</div>
                <div class="overlay-cart-item-price">NPR ${formatPrice(item.unitPrice)} each</div>
                <div class="overlay-cart-item-quantity">
                    <span>Qty:</span>
                    <button class="overlay-cart-qty-btn" onclick="updateCartItemQuantity(${item.id}, ${item.quantity - 1})" 
                            ${item.quantity <= 1 ? 'disabled' : ''}>-</button>
                    <input type="number" class="overlay-qty-input" value="${item.quantity}" min="1" max="10" 
                           onchange="updateCartItemQuantity(${item.id}, parseInt(this.value))">
                    <button class="overlay-cart-qty-btn" onclick="updateCartItemQuantity(${item.id}, ${item.quantity + 1})" 
                            ${item.quantity >= 10 ? 'disabled' : ''}>+</button>
                </div>
                <div class="overlay-cart-item-total">Total: NPR ${formatPrice(item.totalPrice)}</div>
            </div>
            <button class="overlay-remove-btn" onclick="removeFromCart(${item.id})">Remove</button>
        </div>
    `).join('');

    container.innerHTML = itemsHTML;
}

function updateCartOverlayTotals() {
    const subtotal = cartItems.reduce((total, item) => total + item.totalPrice, 0);
    const tax = subtotal * 0.13;
    // const shipping = subtotal >= 5000 ? 0 : 150;
    const shipping = 0;
    const finalTotal = subtotal + tax + shipping;

    document.getElementById('overlay-subtotal').textContent = formatPrice(subtotal);
    document.getElementById('overlay-tax').textContent = formatPrice(tax);
    document.getElementById('overlay-shipping').textContent = formatPrice(shipping);
    document.getElementById('overlay-final-total').textContent = formatPrice(finalTotal);
}

function addToCart(button) {
    const productCard = button.closest('.product-card');
    const productId = parseInt(productCard.getAttribute('data-product-id'));
    const quantity = parseInt(productCard.querySelector('.qty-input').value);

    const product = products.find(p => p.id === productId);
    if (!product) {
        showNotification('Product not found in catalog!', 'error');
        return;
    }

    const existingItemIndex = cartItems.findIndex(item => item.productId === productId);

    if (existingItemIndex !== -1) {
        cartItems[existingItemIndex].quantity += quantity;
        cartItems[existingItemIndex].totalPrice = cartItems[existingItemIndex].quantity * cartItems[existingItemIndex].unitPrice;
        showNotification(`Updated ${product.name} quantity in cart!`);
    } else {
        const cartItem = {
            id: nextCartItemId++,
            productId: productId,
            name: product.name,
            description: product.description,
            unitPrice: product.price,
            quantity: quantity,
            totalPrice: product.price * quantity,
            image: product.image,
            category: product.category,
            addedAt: new Date().toISOString()
        };

        // Add to cart array using push() method
        cartItems.push(cartItem);
        showNotification(`${product.name} (x${quantity}) added to cart!`);
    }

    updateAllCartDisplays();
    saveCartToStorage();
    showButtonFeedback(button);
}

function removeFromCart(cartItemId) {
    const itemIndex = cartItems.findIndex(item => item.id === cartItemId);
    if (itemIndex !== -1) {
        const removedItem = cartItems[itemIndex];

        cartItems.splice(itemIndex, 1);

        updateAllCartDisplays();
        saveCartToStorage();
        showNotification(`${removedItem.name} removed from cart!`);
    }
}

function updateCartItemQuantity(cartItemId, newQuantity) {
    if (newQuantity <= 0) {
        removeFromCart(cartItemId);
        return;
    }

    if (newQuantity > 10) {
        showNotification('Maximum quantity is 10 per item!', 'error');
        return;
    }

    const item = cartItems.find(item => item.id === cartItemId);
    if (item) {
        const oldQuantity = item.quantity;
        item.quantity = newQuantity;
        item.totalPrice = item.unitPrice * newQuantity;
        item.updatedAt = new Date().toISOString();

        updateAllCartDisplays();
        saveCartToStorage();

        if (newQuantity > oldQuantity) {
            showNotification(`Increased ${item.name} quantity to ${newQuantity}`);
        } else {
            showNotification(`Decreased ${item.name} quantity to ${newQuantity}`);
        }
    }
}

function clearCart() {
    if (cartItems.length === 0) {
        showNotification('Cart is already empty!', 'info');
        return;
    }

    const itemCount = cartItems.length;
    const totalValue = cartItems.reduce((total, item) => total + item.totalPrice, 0);

    if (confirm(`Are you sure you want to clear ${itemCount} items worth NPR ${formatPrice(totalValue)} from your cart?`)) {
        cartItems.length = 0;
        nextCartItemId = 1;

        updateAllCartDisplays();
        saveCartToStorage();
        showNotification(`Cart cleared! Removed ${itemCount} items.`, 'success');
    }
}

function getCartStatistics() {
    const stats = {
        totalItems: cartItems.length,
        totalQuantity: cartItems.reduce((total, item) => total + item.quantity, 0),
        totalValue: cartItems.reduce((total, item) => total + item.totalPrice, 0),
        categories: [...new Set(cartItems.map(item => item.category))],
        averageItemPrice: cartItems.length > 0 ? cartItems.reduce((total, item) => total + item.unitPrice, 0) / cartItems.length : 0
    };
    return stats;
}

function updateAllCartDisplays() {
    updateCartTotals();
    updateCartCounter();
    updateSidebarCartInfo();
    renderCartItems();

    const overlay = document.getElementById('cart-overlay');
    if (overlay && overlay.style.display === 'flex') {
        renderCartOverlayItems();
        updateCartOverlayTotals();
    }
}

function updateCartTotals() {
    const subtotal = cartItems.reduce((total, item) => total + item.totalPrice, 0);
    const tax = subtotal * 0.13;
    // const shipping = subtotal >= 5000 ? 0 : 150;
    const shipping = 0;
    const finalTotal = subtotal + tax + shipping;

    cartTotal = finalTotal;

    const totalPriceElement = document.getElementById('total-price');
    if (totalPriceElement) totalPriceElement.textContent = formatPrice(finalTotal);

    const cartSubtotalElement = document.getElementById('cart-subtotal');
    if (cartSubtotalElement) cartSubtotalElement.textContent = formatPrice(subtotal);

    const cartTaxElement = document.getElementById('cart-tax');
    if (cartTaxElement) cartTaxElement.textContent = formatPrice(tax);

    const cartShippingElement = document.getElementById('cart-shipping');
    if (cartShippingElement) cartShippingElement.textContent = formatPrice(shipping);

    const cartFinalTotalElement = document.getElementById('cart-final-total');
    if (cartFinalTotalElement) cartFinalTotalElement.textContent = formatPrice(finalTotal);
}

function updateCartCounter() {
    const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);

    const totalItemsElement = document.getElementById('total-items');
    if (totalItemsElement) totalItemsElement.textContent = totalItems;
}

function updateSidebarCartInfo() {
    const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);

    const sidebarCartCountElement = document.getElementById('sidebar-cart-count');
    if (sidebarCartCountElement) sidebarCartCountElement.textContent = totalItems;

    const sidebarCartTotalElement = document.getElementById('sidebar-cart-total');
    if (sidebarCartTotalElement) sidebarCartTotalElement.textContent = formatPrice(cartTotal);
}

function renderCartItems() {
    const cartContainer = document.getElementById('cart-items-container');
    if (!cartContainer) return;

    if (cartItems.length === 0) {
        cartContainer.innerHTML = `
            <div class="empty-cart">
                <h3>🛒 Your cart is empty</h3>
                <p>Start shopping to add items to your cart!</p>
                <p>Browse our ${products.length} available products.</p>
            </div>`;
        return;
    }

    const cartHTML = cartItems.map(item => `
        <div class="cart-item" data-cart-item-id="${item.id}">
            <div class="cart-item-image">
                <img src="${item.image}" alt="${item.name}" onerror="this.src='https://via.placeholder.com/400x300/f0f0f0/888888?text=No+Image'">
            </div>
            <div class="cart-item-details">
                <h4>${item.name}</h4>
                <p class="cart-item-description">${item.description}</p>
                <p class="cart-item-price">Unit Price: NPR ${formatPrice(item.unitPrice)}</p>
                <div class="cart-item-quantity">
                    <label>Quantity:</label>
                    <button class="cart-qty-btn" onclick="updateCartItemQuantity(${item.id}, ${item.quantity - 1})" 
                            ${item.quantity <= 1 ? 'disabled' : ''}>-</button>
                    <input type="number" value="${item.quantity}" min="1" max="10" 
                           onchange="updateCartItemQuantity(${item.id}, parseInt(this.value))">
                    <button class="cart-qty-btn" onclick="updateCartItemQuantity(${item.id}, ${item.quantity + 1})" 
                            ${item.quantity >= 10 ? 'disabled' : ''}>+</button>
                </div>
                <p class="cart-item-total">Total: NPR ${formatPrice(item.totalPrice)}</p>
                <p class="cart-item-category">Category: ${item.category}</p>
            </div>
            <div class="cart-item-actions">
                <button class="remove-item-btn" onclick="removeFromCart(${item.id})">🗑️ Remove</button>
            </div>
        </div>
    `).join('');

    cartContainer.innerHTML = cartHTML;
}

function toggleCartDisplay() {
    openCartOverlay();
}

function saveCartToStorage() {
    try {
        const cartData = {
            items: cartItems,
            nextId: nextCartItemId,
            lastUpdated: new Date().toISOString(),
            version: '1.0'
        };
        localStorage.setItem('shopliteCart', JSON.stringify(cartData));
        console.log(`Cart saved: ${cartItems.length} items`);
    } catch (error) {
        console.error('Failed to save cart to localStorage:', error);
        showNotification('Failed to save cart data!', 'error');
    }
}

function loadCartFromStorage() {
    try {
        const savedData = localStorage.getItem('shopliteCart');

        if (savedData) {
            const cartData = JSON.parse(savedData);

            if (Array.isArray(cartData)) {
                cartItems = cartData;
            } else if (cartData.items) {
                cartItems = cartData.items;
                nextCartItemId = cartData.nextId || 1;
            }

            console.log(`Cart loaded: ${cartItems.length} items`);
        }
    } catch (error) {
        console.error('Failed to load cart from localStorage:', error);
        cartItems = [];
        nextCartItemId = 1;
        showNotification('Failed to load saved cart data!', 'error');
    }
}


function formatPrice(price) {
    return price.toLocaleString('en-NP');
}

function formatCurrency(amount) {
    return `NPR ${formatPrice(amount)}`;
}

function calculateDiscount(originalPrice, salePrice) {
    const discount = originalPrice - salePrice;
    const discountPercent = Math.round((discount / originalPrice) * 100);
    return {
        percent: discountPercent,
        amount: discount,
        savings: formatCurrency(discount)
    };
}

function calculateDiscounts() {
    document.querySelectorAll('.product-card').forEach(card => {
        const priceTag = card.querySelector('.price-tag');
        const originalPrice = parseInt(priceTag.getAttribute('data-original-price'));
        const salePrice = parseInt(priceTag.getAttribute('data-sale-price'));

        if (salePrice && salePrice < originalPrice) {
            const discount = calculateDiscount(originalPrice, salePrice);

            const discountInfo = card.querySelector('.discount-info');
            if (discountInfo) {
                const discountPercent = discountInfo.querySelector('.discount-percent');
                const savingsAmount = discountInfo.querySelector('.discount-info .savings-amount');

                if (discountPercent) discountPercent.textContent = `${discount.percent}% OFF`;
                if (savingsAmount) savingsAmount.textContent = `Save ${discount.savings}`;
                discountInfo.style.display = 'block';
            }
        }
    });
}

function changeQuantity(button, change) {
    const qtyInput = button.parentNode.querySelector('.qty-input');
    const currentValue = parseInt(qtyInput.value);
    const newValue = currentValue + change;

    if (newValue >= 1 && newValue <= 10) {
        qtyInput.value = newValue;
        updateProductTotal(qtyInput);

        button.style.transform = 'scale(0.9)';
        setTimeout(() => {
            button.style.transform = 'scale(1)';
        }, 150);
    }
}

function updateProductTotal(input) {
    const quantity = parseInt(input.value);
    if (quantity < 1) {
        input.value = 1;
        return;
    }
    if (quantity > 10) {
        input.value = 10;
        return;
    }

    const productCard = input.closest('.product-card');
    const priceTag = productCard.querySelector('.price-tag');
    const salePrice = parseInt(priceTag.getAttribute('data-sale-price'));
    const originalPrice = parseInt(priceTag.getAttribute('data-original-price'));

    const unitPrice = salePrice || originalPrice;
    const totalAmount = unitPrice * quantity;

    const totalAmountElement = productCard.querySelector('.total-amount');
    totalAmountElement.textContent = formatPrice(totalAmount);

    totalAmountElement.style.color = '#667eea';
    setTimeout(() => {
        totalAmountElement.style.color = '';
    }, 300);
}

function initializeProductTotals() {
    document.querySelectorAll('.qty-input').forEach(input => {
        updateProductTotal(input);
    });
}

function showButtonFeedback(button) {
    const originalText = button.textContent;
    button.textContent = '✓ Added!';
    button.style.background = 'linear-gradient(135deg, #48bb78, #38a169)';

    setTimeout(() => {
        button.textContent = originalText;
        button.style.background = 'linear-gradient(135deg, #667eea, #764ba2)';
    }, 1500);
}

function filterProducts(category) {
    const productCards = document.querySelectorAll('.product-card');
    let visibleCount = 0;

    productCards.forEach(product => {
        if (category === 'all' || product.getAttribute('data-category') === category) {
            product.style.display = 'block';
            product.style.animation = 'fadeIn 0.5s ease';
            visibleCount++;
        } else {
            product.style.display = 'none';
        }
    });

    const categoryName = category === 'all' ? 'All Products' : category.charAt(0).toUpperCase() + category.slice(1);
    showNotification(`Showing ${visibleCount} products in ${categoryName} category`);
}

function setActiveCategory(activeItem) {
    document.querySelectorAll('.category-list li').forEach(item => {
        item.classList.remove('active');
    });
    activeItem.classList.add('active');
}

function searchProducts() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const productCards = document.querySelectorAll('.product-card');
    let matchCount = 0;

    productCards.forEach(product => {
        const productName = product.querySelector('h3').textContent.toLowerCase();
        const productDesc = product.querySelector('.product-desc').textContent.toLowerCase();
        const priceText = product.querySelector('.price-tag').textContent.toLowerCase();

        if (productName.includes(searchTerm) || 
            productDesc.includes(searchTerm) || 
            priceText.includes(searchTerm)) {
            product.style.display = 'block';
            product.style.animation = 'fadeIn 0.5s ease';
            matchCount++;
        } else {
            product.style.display = 'none';
        }
    });

    if (searchTerm) {
        showNotification(`Found ${matchCount} products matching "${searchTerm}"`);
    }
}

function showProductDetails(productName) {
    const product = products.find(p => p.name === productName);
    if (product) {
        const details = `${product.name}\n${product.description}\nPrice: NPR ${formatPrice(product.price)}\nCategory: ${product.category}`;
        alert(details);
    } else {
        showNotification(`Product details for: ${productName}`, 'info');
    }
}

function proceedToCheckout() {
    if (cartItems.length === 0) {
        showNotification('Your cart is empty! Add some items first.', 'info');
        return;
    }

    const stats = getCartStatistics();
    const checkoutMessage = `Proceeding to checkout:\n\n` +
                           `${stats.totalItems} unique items\n` +
                           `${stats.totalQuantity} total quantity\n` +
                           `Total Value: NPR ${formatPrice(stats.totalValue)}\n` +
                           `Categories: ${stats.categories.join(', ')}`;

    alert(checkoutMessage);
    showNotification(`Checkout initiated for ${stats.totalItems} items!`, 'success');
    closeCartOverlay();
}

function showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    const notificationText = document.getElementById('notification-text');

    if (notification && notificationText) {
        notificationText.textContent = message;
        notification.classList.remove('hidden');

        setTimeout(() => {
            hideNotification();
        }, 3000);
    }
}

function hideNotification() {
    const notification = document.getElementById('notification');
    if (notification) {
        notification.classList.add('hidden');
    }
}

console.log('SHOPLITE Lab 3 - Enhanced Cart Management with Overlay initialized successfully! 🛍️');
console.log(`Product Catalog: ${products.length} items across ${[...new Set(products.map(p => p.category))].length} categories`);