// js/cart-page.js
import {
  getCartItems,
  getCartTotal,
  removeFromCart,
  updateQuantity,
  updateCartCount,
} from "./cart.js";

function renderCart() {
  const cartItems = getCartItems();
  const cartItemsEl = document.getElementById("cart-items");
  const cartEmptyEl = document.getElementById("cart-empty");
  const cartSummaryEl = document.getElementById("cart-summary");
  const totalAmountEl = document.getElementById("cart-total-amount");

  if (!cartItemsEl) return;

  if (cartItems.length === 0) {
    cartItemsEl.style.display = "none";
    cartSummaryEl.style.display = "none";
    cartEmptyEl.style.display = "block";
    return;
  }

  cartEmptyEl.style.display = "none";
  cartSummaryEl.style.display = "block";
  cartItemsEl.style.display = "block";

  cartItemsEl.innerHTML = cartItems
    .map(
      (item) => `
        <div class="cart-item">
            <div class="cart-item-info">
                <h4>${item.title}</h4>
                <p class="cart-item-price">${item.price} ₽</p>
            </div>
            <div class="cart-item-controls">
                <button class="btn-qty" data-id="${item.id}" data-action="dec">−</button>
                <span class="cart-item-qty">${item.quantity}</span>
                <button class="btn-qty" data-id="${item.id}" data-action="inc">+</button>
                <button class="btn-remove" data-id="${item.id}">✕</button>
            </div>
        </div>
    `,
    )
    .join("");

  totalAmountEl.textContent = getCartTotal() + " ₽";
  updateCartCount();
}

// Делегирование событий для кнопок корзины
document.getElementById("cart-items")?.addEventListener("click", (e) => {
  const btn = e.target.closest("button");
  if (!btn) return;

  const id = parseInt(btn.dataset.id);
  const action = btn.dataset.action;
  const cart = getCartItems();
  const item = cart.find((i) => i.id === id);

  if (btn.classList.contains("btn-remove")) {
    removeFromCart(id);
  } else if (action === "inc" && item) {
    updateQuantity(id, item.quantity + 1);
  } else if (action === "dec" && item) {
    updateQuantity(id, item.quantity - 1);
  }

  renderCart();
});

document.addEventListener("DOMContentLoaded", renderCart);
