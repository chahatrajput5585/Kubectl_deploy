// ===== Professional Menu System =====
const menuItems = [
  {
    id: 1,
    name: "Paneer Butter Masala",
    type: "veg",
    price: 180,
    originalPrice: 220,
    image: "images/paneer.png",
    desc: "Creamy cottage cheese in spiced tomato gravy with aromatic herbs",
    rating: 4.5,
    popular: true,
  },
  {
    id: 2,
    name: "Veg Biryani",
    type: "veg",
    price: 150,
    image: "images/biryani.png",
    desc: "Fragrant basmati rice cooked with fresh vegetables and exotic spices",
    rating: 4.2,
    popular: false,
  },
  {
    id: 3,
    name: "Chicken Biryani",
    type: "nonveg",
    price: 240,
    originalPrice: 280,
    image: "images/chicken.png",
    desc: "Tender chicken layered with aromatic basmati rice and saffron",
    rating: 4.8,
    popular: true,
  },
  {
    id: 4,
    name: "Butter Chicken",
    type: "nonveg",
    price: 240,
    image: "images/butter.png",
    desc: "Succulent tandoori chicken in rich, creamy tomato butter sauce",
    rating: 4.7,
    popular: true,
  },
  {
    id: 5,
    name: "Aloo Gobi",
    type: "veg",
    price: 130,
    image: "images/aloo.png",
    desc: "Fresh potatoes and cauliflower cooked with traditional Indian spices",
    rating: 4.0,
    popular: false,
  },
  {
    id: 6,
    name: "Mix Vegetable Curry",
    type: "veg",
    price: 130,
    image: "images/mix.png",
    desc: "Seasonal vegetables cooked in aromatic curry with fresh herbs",
    rating: 4.1,
    popular: false,
  },
  {
    id: 7,
    name: "Punjabi Chole",
    type: "veg",
    price: 130,
    image: "images/chole.png",
    desc: "Spicy chickpeas curry cooked in traditional Punjabi style",
    rating: 4.3,
    popular: false,
  },
  {
    id: 8,
    name: "Fish Fry",
    type: "nonveg",
    price: 200,
    originalPrice: 250,
    image: "images/fish.png",
    desc: "Crispy golden fried fish with special masala coating",
    rating: 4.4,
    popular: false,
  },
  {
    id: 9,
    name: "Masala Egg Burji",
    type: "nonveg",
    price: 200,
    image: "images/egg.png",
    desc: "Scrambled eggs cooked with onions, tomatoes and aromatic spices",
    rating: 4.0,
    popular: false,
  },
  {
    id: 10,
    name: "Egg Biryani",
    type: "nonveg",
    price: 200,
    image: "images/e-biryani.png",
    desc: "Fragrant rice layered with spiced boiled eggs and fresh herbs",
    rating: 4.2,
    popular: false,
  },
  {
    id: 11,
    name: "Chicken Fry",
    type: "nonveg",
    price: 200,
    image: "images/chickenn.png",
    desc: "Crispy fried chicken pieces marinated with special spices",
    rating: 4.5,
    popular: false,
  },
  {
    id: 12,
    name: "Masala Tea",
    type: "beverages",
    price: 25,
    image: "images/menu-5.png",
    desc: "Traditional Indian tea brewed with aromatic spices and herbs",
    rating: 4.3,
    popular: true,
  },
  {
    id: 13,
    name: "Fresh Coffee",
    type: "beverages",
    price: 40,
    image: "images/menu-4.png",
    desc: "Rich, freshly brewed coffee made from premium coffee beans",
    rating: 4.6,
    popular: true,
  },
  {
    id: 14,
    name: "Mango Lassi",
    type: "beverages",
    price: 80,
    image: "images/menu-6.png",
    desc: "Refreshing yogurt drink blended with fresh mango pulp",
    rating: 4.4,
    popular: false,
  },
];

// Cart and UI state management
let cart = JSON.parse(localStorage.getItem("cart")) || [];
let isCartOpen = false;

// DOM elements
const menuContainer = document.getElementById("menu-items");
const cartSidebar = document.getElementById("cart-sidebar");
const cartItemsContainer = document.getElementById("cart-items");
const cartCount = document.getElementById("cart-count");
const cartTotal = document.getElementById("cart-total");
const cartSubtotal = document.getElementById("cart-subtotal");
const toast = document.getElementById("toast");
const toastMessage = document.getElementById("toast-message");
const loading = document.getElementById("loading");

// Professional menu rendering with animations
function renderMenu(filter = "all") {
  if (!menuContainer) return;

  // Show loading animation
  showLoading();

  // Update active filter button
  updateActiveFilter(filter);

  setTimeout(() => {
    const filtered =
      filter === "all"
        ? menuItems
        : menuItems.filter((item) => item.type === filter);

    menuContainer.innerHTML = "";

    filtered.forEach((item, index) => {
      const menuItemHTML = createMenuItemHTML(item, index);
      menuContainer.insertAdjacentHTML("beforeend", menuItemHTML);

      // Add staggered animation
      setTimeout(() => {
        const itemElement = menuContainer.children[index];
        if (itemElement) {
          itemElement.style.opacity = "0";
          itemElement.style.transform = "translateY(30px)";
          itemElement.style.transition =
            "all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)";
          animateMenuItemIn(itemElement);
        }
      }, index * 100);
    });

    function animateMenuItemIn(itemElement) {
      setTimeout(() => {
        itemElement.style.opacity = "1";
        itemElement.style.transform = "translateY(0)";
      }, 50);
    }

    hideLoading();
  }, 600);
}

// Create professional menu item HTML
function createMenuItemHTML(item, index) {
  let categoryClass;
  if (item.type === "veg") {
    categoryClass = "veg";
  } else if (item.type === "nonveg") {
    categoryClass = "nonveg";
  } else {
    categoryClass = "beverage";
  }
  const popularBadge = item.popular
    ? '<div class="popular-badge"><i class="fas fa-fire"></i> Popular</div>'
    : "";
  const discountBadge = item.originalPrice
    ? `<div class="discount-badge">-${Math.round(
        (1 - item.price / item.originalPrice) * 100
      )}%</div>`
    : "";
  const originalPriceHTML = item.originalPrice
    ? `<span class="old-price">₹${item.originalPrice}</span>`
    : "";
  const ratingStars = generateStars(item.rating);

  return `
    <div class="menu-item" data-aos="fade-up">
      <div class="category-badge ${categoryClass}">${item.type}</div>
      ${popularBadge}
      ${discountBadge}
      <img src="${item.image}" alt="${item.name}" onerror="this.src='images/placeholder.jpg'">
      <div class="item-content">
        <h3>${item.name}</h3>
        <div class="rating">
          ${ratingStars}
          <span class="rating-text">(${item.rating})</span>
        </div>
        <p class="description">${item.desc}</p>
        <div class="price">
          ₹${item.price} ${originalPriceHTML}
        </div>
<button 
  class="add-to-cart" 
  onclick="addToCart(event, ${index})" 
  onmouseover="this.innerHTML='<i class=\'fas fa-plus\'></i> Add to Cart'" 
  onmouseout="this.innerHTML='<i class=\'fas fa-shopping-cart\'></i> Add to Cart'">
  <i class="fas fa-shopping-cart"></i> Add to Cart
</button>
      </div>
    </div>
  `;
}

// Generate star rating
function generateStars(rating) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;
  let starsHTML = "";

  for (let i = 0; i < fullStars; i++) {
    starsHTML += '<i class="fas fa-star"></i>';
  }

  if (hasHalfStar) {
    starsHTML += '<i class="fas fa-star-half-alt"></i>';
  }

  const emptyStars = 5 - Math.ceil(rating);
  for (let i = 0; i < emptyStars; i++) {
    starsHTML += '<i class="far fa-star"></i>';
  }

  return starsHTML;
}

// Add item to cart
// (Removed duplicate definition; see enhanced version below)

// Update cart UI
function updateCart() {
  document.getElementById("cart-count").textContent = cart.length;
  const cartItemsDiv = document.getElementById("cart-items");
  cartItemsDiv.innerHTML = "";

  let total = 0;
  cart.forEach((item, i) => {
    total += item.price;
    const div = document.createElement("div");
    div.className = "flex justify-between items-center border-b pb-2";
    div.innerHTML = `
      <span>${item.name}</span>
      <span>₹${item.price}</span>
      <button onclick="removeFromCart(${i})" class="text-red-500 text-sm ml-2">Remove</button>
    `;
    cartItemsDiv.appendChild(div);
  });

  document.getElementById("cart-total").textContent = `₹${total}`;
}

// Remove item
// (Removed duplicate definition of removeFromCart)

// Toggle cart sidebar
// (Removed duplicate toggleCart definition to avoid redeclaration error)

// (Removed duplicate legacy checkout function)

// Popup message
function showPopup(message, isError = false) {
  const popup = document.getElementById("popup");
  popup.textContent = message;
  popup.className =
    "fixed top-5 right-5 px-4 py-2 rounded shadow-lg z-50 " +
    (isError ? "bg-red-600 text-white" : "bg-green-600 text-white");

  popup.style.display = "block";
  setTimeout(() => {
    popup.style.display = "none";
  }, 2000);
}

// Update active filter button
function updateActiveFilter(filter) {
  const filterButtons = document.querySelectorAll(".filter-btn");
  filterButtons.forEach((btn) => {
    btn.classList.remove("active");
    let btnCategory = btn.getAttribute("data-category");
    if (!btnCategory) {
      const text = btn.textContent.toLowerCase();
      if (text.includes("all")) {
        btnCategory = "all";
      } else if (text.includes("veg")) {
        btnCategory = "veg";
      } else if (text.includes("non")) {
        btnCategory = "nonveg";
      } else if (text.includes("beverage")) {
        btnCategory = "beverages";
      } else {
        btnCategory = "";
      }
    }

    if (
      btnCategory === filter ||
      (filter === "beverages" && btnCategory === "beverages")
    ) {
      btn.classList.add("active");
    }
  });
}

// Enhanced cart functionality
function addToCart(event, index) {
  const button = event.target;
  const item = menuItems[index];

  // Add loading state to button
  const originalHTML = button.innerHTML;
  button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Adding...';
  button.disabled = true;

  setTimeout(() => {
    const existingItem = cart.find((cartItem) => cartItem.id === item.id);

    if (existingItem) {
      existingItem.quantity = (existingItem.quantity || 1) + 1;
    } else {
      cart.push({ ...item, quantity: 1 });
    }

    updateCartCount();
    updateCartUI();
    saveCart();
    showToast(`${item.name} added to cart!`);

    // Reset button
    button.innerHTML = originalHTML;
    button.disabled = false;

    // Add bounce animation to cart icon
    animateCartIcon();
  }, 800);
}

// Animate cart icon
function animateCartIcon() {
  if (cartCount) {
    cartCount.style.transform = "scale(0)";
    setTimeout(() => {
      cartCount.style.transform = "scale(1.3)";
      setTimeout(() => {
        cartCount.style.transform = "scale(1)";
      }, 150);
    }, 100);
  }
}

// Enhanced cart UI update
function updateCartUI() {
  if (!cartItemsContainer) return;

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = `
      <div class="empty-cart">
        <i class="fas fa-shopping-cart"></i>
        <p>Your cart is empty</p>
        <span>Add some delicious items to get started!</span>
      </div>
    `;
  } else {
    cartItemsContainer.innerHTML = cart
      .map(
        (item) => `
      <div class="cart-item" data-id="${item.id}">
        <img src="${item.image}" alt="${item.name}">
        <div class="item-details">
          <h4>${item.name}</h4>
          <div class="item-price">₹${item.price}</div>
        </div>
        <div class="quantity-controls">
          <button class="qty-btn" onclick="updateQuantity(${
            item.id
          }, -1)">-</button>
          <span class="quantity">${item.quantity || 1}</span>
          <button class="qty-btn" onclick="updateQuantity(${
            item.id
          }, 1)">+</button>
        </div>
      </div>
    `
      )
      .join("");
  }

  updateCartTotal();
}

// Update item quantity
function updateQuantity(itemId, change) {
  const item = cart.find((cartItem) => cartItem.id === itemId);
  if (!item) return;

  item.quantity = (item.quantity || 1) + change;

  if (item.quantity <= 0) {
    cart = cart.filter((cartItem) => cartItem.id !== itemId);
  }

  updateCartCount();
  updateCartUI();
  saveCart();
}

// Update cart count
function updateCartCount() {
  const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
  if (cartCount) {
    cartCount.textContent = totalItems;
    cartCount.style.display = totalItems > 0 ? "flex" : "none";
  }
}

// Update cart total
function updateCartTotal() {
  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * (item.quantity || 1),
    0
  );
  const delivery = cart.length > 0 ? 40 : 0;
  const total = subtotal + delivery;

  if (cartSubtotal) cartSubtotal.textContent = `₹${subtotal}`;
  if (cartTotal) cartTotal.textContent = `₹${total}`;
}

// Enhanced cart toggle
function toggleCart() {
  if (cartSidebar) {
    isCartOpen = !isCartOpen;
    cartSidebar.classList.toggle("active", isCartOpen);
    document.body.style.overflow = isCartOpen ? "hidden" : "auto";

    if (isCartOpen) {
      updateCartUI();
    }
  }
}

// Clear cart
function clearCart() {
  if (cart.length === 0) return;

  if (confirm("Are you sure you want to clear your cart?")) {
    cart = [];
    updateCartCount();
    updateCartUI();
    saveCart();
    showToast("Cart cleared!", "info");
  }
}

// Enhanced checkout
function checkout() {
  if (cart.length === 0) {
    showToast("Your cart is empty!", "error");
    return;
  }

  showToast("Processing your order...", "info");

  // Simulate order processing
  setTimeout(() => {
    showToast("🎉 Order placed successfully!", "success");
    cart = [];
    updateCartCount();
    updateCartUI();
    saveCart();
    toggleCart();
  }, 2000);
}

// Save cart to localStorage
function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// Enhanced toast notification
function showToast(message, type = "success") {
  if (toast && toastMessage) {
    toastMessage.textContent = message;
    toast.className = `toast-notification show ${type}`;

    setTimeout(() => {
      toast.classList.remove("show");
    }, 3000);
  }
}

// Loading animations
function showLoading() {
  if (loading) {
    loading.classList.add("show");
  }
  if (menuContainer) {
    menuContainer.style.opacity = "0.5";
  }
}

function hideLoading() {
  if (loading) {
    loading.classList.remove("show");
  }
  if (menuContainer) {
    menuContainer.style.opacity = "1";
  }
}

// Initialize on DOM load
document.addEventListener("DOMContentLoaded", function () {
  renderMenu("all");
  updateCartCount();
  updateCartUI();

  // Close cart when clicking outside
  document.addEventListener("click", function (e) {
    if (
      cartSidebar &&
      !cartSidebar.contains(e.target) &&
      !e.target.closest(".cart-btn")
    ) {
      if (isCartOpen) {
        toggleCart();
      }
    }
  });

  // Keyboard accessibility
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && isCartOpen) {
      toggleCart();
    }
  });

  // Smooth fade-in animation
  setTimeout(() => {
    document.body.style.opacity = "1";
  }, 100);
});

// Performance optimization: Intersection Observer for animations
if (typeof IntersectionObserver !== "undefined") {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
      }
    });
  }, observerOptions);

  // Observe menu items as they're added
  const observeMenuItems = () => {
    document.querySelectorAll(".menu-item").forEach((item) => {
      observer.observe(item);
    });
  };

  // Call after menu renders
  setTimeout(observeMenuItems, 1000);
}

console.log("🍽️ Professional Menu System Loaded Successfully!");

// Legacy support for existing functionality
function removeFromCart(index) {
  cart.splice(index, 1);
  updateCartCount();
  updateCartUI();
  saveCart();
}

// Export functions for global access
window.renderMenu = renderMenu;
window.addToCart = addToCart;
window.toggleCart = toggleCart;
window.checkout = checkout;
window.clearCart = clearCart;
window.updateQuantity = updateQuantity;
window.removeFromCart = removeFromCart;
