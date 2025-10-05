// Global Variables
let cartTotal = 0;
const cartItems = [];

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    setupEventListeners();
    updateCartDisplay();
    calculateDiscounts();
    initializeProductTotals();
}

// Event Listeners Setup
function setupEventListeners() {
    // Add to cart buttons
    document.querySelectorAll('.add-cart-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const productCard = this.closest('.product-card');
            const quantity = parseInt(productCard.querySelector('.qty-input').value);
            const basePrice = parseInt(this.getAttribute('data-price'));
            const totalPrice = basePrice * quantity;
            const productName = productCard.querySelector('h3').textContent;
            addToCart(productName, basePrice, quantity, totalPrice, this);
        });
    });

    // Category filters
    document.querySelectorAll('.category-list li').forEach(item => {
        item.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            filterProducts(filter);
            setActiveCategory(this);
        });
    });

    // View details buttons
    document.querySelectorAll('.details-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const productCard = this.closest('.product-card');
            const productName = productCard.querySelector('h3').textContent;
            showProductDetails(productName);
        });
    });

    // Search functionality
    document.getElementById('searchInput').addEventListener('input', searchProducts);
}

// Price Formatting Functions
function formatPrice(price) {
    return price.toLocaleString('en-NP');
}

function formatCurrency(amount) {
    return `NPR ${formatPrice(amount)}`;
}

// Discount Calculation Functions
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
            const discountPercent = discountInfo.querySelector('.discount-percent');
            const savingsAmount = discountInfo.querySelector('.savings-amount');

            discountPercent.textContent = `${discount.percent}% OFF`;
            savingsAmount.textContent = `Save ${discount.savings}`;
            discountInfo.style.display = 'block';
        }
    });
}

// Quantity Management Functions
function changeQuantity(button, change) {
    const qtyInput = button.parentNode.querySelector('.qty-input');
    const currentValue = parseInt(qtyInput.value);
    const newValue = currentValue + change;

    if (newValue >= 1 && newValue <= 10) {
        qtyInput.value = newValue;
        updateProductTotal(qtyInput);

        // Add visual feedback
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

    // Update the add to cart button data-price for correct cart calculation
    const addCartBtn = productCard.querySelector('.add-cart-btn');
    addCartBtn.setAttribute('data-price', unitPrice);

    // Add animation effect
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

// Cart Functions (Enhanced)
function addToCart(productName, basePrice, quantity, totalPrice, button) {
    cartTotal += totalPrice;

    // Add item with quantity information
    cartItems.push({ 
        name: productName, 
        price: basePrice, 
        quantity: quantity,
        total: totalPrice
    });

    updateCartDisplay();
    showButtonFeedback(button);

    const quantityText = quantity > 1 ? ` (x${quantity})` : '';
    showNotification(`${productName}${quantityText} added to cart! ${formatCurrency(totalPrice)}`);
}

function updateCartDisplay() {
    document.getElementById('total-price').textContent = formatPrice(cartTotal);
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

// Filter Functions
function filterProducts(category) {
    const products = document.querySelectorAll('.product-card');

    products.forEach(product => {
        if (category === 'all' || product.getAttribute('data-category') === category) {
            product.style.display = 'block';
            product.style.animation = 'fadeIn 0.5s ease';
        } else {
            product.style.display = 'none';
        }
    });
}

function setActiveCategory(activeItem) {
    document.querySelectorAll('.category-list li').forEach(item => {
        item.classList.remove('active');
    });
    activeItem.classList.add('active');
}

// Search Function (Enhanced)
function searchProducts() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const products = document.querySelectorAll('.product-card');

    products.forEach(product => {
        const productName = product.querySelector('h3').textContent.toLowerCase();
        const productDesc = product.querySelector('.product-desc').textContent.toLowerCase();
        const priceText = product.querySelector('.price-tag').textContent.toLowerCase();

        if (productName.includes(searchTerm) || 
            productDesc.includes(searchTerm) || 
            priceText.includes(searchTerm)) {
            product.style.display = 'block';
            product.style.animation = 'fadeIn 0.5s ease';
        } else {
            product.style.display = 'none';
        }
    });
}

// Utility Functions for Price Calculations
function calculateBulkDiscount(quantity, basePrice) {
    let discount = 0;
    if (quantity >= 5) discount = 0.1; // 10% discount for 5+ items
    if (quantity >= 10) discount = 0.15; // 15% discount for 10+ items

    return basePrice * (1 - discount);
}

function calculateTax(amount, taxRate = 0.13) { // 13% VAT for Nepal
    return amount * taxRate;
}

function calculateShipping(amount) {
    if (amount >= 5000) return 0; // Free shipping over NPR 5000
    return 150; // Standard shipping NPR 150
}

// Sidebar Functions (Enhanced)
function viewCart() {
    if (cartItems.length === 0) {
        showNotification('Your cart is empty!', 'info');
        return;
    }

    let cartDetails = 'Cart Items:\n\n';
    cartItems.forEach((item, index) => {
        cartDetails += `${index + 1}. ${item.name} (x${item.quantity}) - ${formatCurrency(item.total)}\n`;
    });

    const tax = calculateTax(cartTotal);
    const shipping = calculateShipping(cartTotal);
    const finalTotal = cartTotal + tax + shipping;

    cartDetails += `\nSubtotal: ${formatCurrency(cartTotal)}`;
    cartDetails += `\nTax (13%): ${formatCurrency(tax)}`;
    cartDetails += `\nShipping: ${formatCurrency(shipping)}`;
    cartDetails += `\nFinal Total: ${formatCurrency(finalTotal)}`;

    alert(cartDetails);
}

function clearCart() {
    if (cartItems.length === 0) {
        showNotification('Cart is already empty!', 'info');
        return;
    }

    if (confirm('Are you sure you want to clear your cart?')) {
        cartTotal = 0;
        cartItems.length = 0;
        updateCartDisplay();
        showNotification('Cart cleared successfully!', 'success');
    }
}

function showWishlist() {
    showNotification('Wishlist feature coming soon!', 'info');
}

function showProductDetails(productName) {
    showNotification(`Showing details for: ${productName}`, 'info');
}

// Notification System
function showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    const notificationText = document.getElementById('notification-text');

    notificationText.textContent = message;
    notification.classList.remove('hidden');

    // Auto hide after 3 seconds
    setTimeout(() => {
        hideNotification();
    }, 3000);
}

function hideNotification() {
    const notification = document.getElementById('notification');
    notification.classList.add('hidden');
}

// Add CSS animation and styles
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
    }

    .quantity-section {
        margin: 10px 0;
        padding: 10px;
        background: #f8f9fa;
        border-radius: 6px;
    }

    .quantity-selector {
        display: flex;
        align-items: center;
        gap: 8px;
        margin: 8px 0;
    }

    .qty-btn {
        width: 30px;
        height: 30px;
        border: 1px solid #ddd;
        background: #fff;
        border-radius: 4px;
        cursor: pointer;
        font-weight: bold;
        transition: all 0.2s ease;
    }

    .qty-btn:hover {
        background: #667eea;
        color: white;
        border-color: #667eea;
    }

    .qty-input {
        width: 60px;
        height: 30px;
        text-align: center;
        border: 1px solid #ddd;
        border-radius: 4px;
        font-weight: 500;
    }

    .product-total {
        font-weight: 600;
        color: #333;
        margin-top: 8px;
        font-size: 14px;
    }

    .total-amount {
        color: #667eea;
        font-weight: 700;
    }

    .price-section {
        margin: 10px 0;
    }

    .discount-info {
        display: flex;
        gap: 10px;
        margin-top: 5px;
    }

    .discount-percent {
        background: #e53e3e;
        color: white;
        padding: 2px 6px;
        border-radius: 3px;
        font-size: 12px;
        font-weight: bold;
    }

    .savings-amount {
        color: #38a169;
        font-weight: 600;
        font-size: 12px;
    }

    .old-price {
        text-decoration: line-through;
        color: #999;
        font-size: 14px;
        margin-left: 5px;
    }
`;
document.head.appendChild(style);

console.log('Enhanced SHOPLITE with improved price calculations initialized successfully! 🛍️');