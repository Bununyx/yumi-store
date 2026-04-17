const CART_KEY = "yumi_cart";

// Глобальная функция для onclick из HTML
window.handleAddToCart = function (productId, title, price) {
  addToCart(productId, title, price);
};

export function addToCart(productId, title, price) {
  let cart = getCart();
  const existing = cart.find((item) => item.id === productId);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ id: productId, title, price: Number(price), quantity: 1 });
  }

  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartCount();
}

export function getCart() {
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function updateCartCount() {
  const cart = getCart();
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  const el = document.getElementById("cart-count");
  if (el) el.textContent = count;
}

export function getCartTotal() {
  return getCart().reduce((sum, item) => sum + item.price * item.quantity, 0);
}

export function clearCart() {
  localStorage.removeItem(CART_KEY);
  updateCartCount();
}

export function removeFromCart(productId) {
  const cart = getCart().filter((item) => item.id !== productId);
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartCount();
}

export function updateQuantity(productId, newQty) {
  const cart = getCart();
  const item = cart.find((i) => i.id === productId);
  if (!item) return;

  if (newQty <= 0) {
    removeFromCart(productId);
  } else {
    item.quantity = newQty;
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    updateCartCount();
  }
}

document.addEventListener("DOMContentLoaded", updateCartCount);
