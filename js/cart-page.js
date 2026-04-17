import {
  getCart,
  getCartTotal,
  removeFromCart,
  updateQuantity,
  updateCartCount,
} from "./cart.js";

function renderCart() {
  const items = getCart();
  const container = document.getElementById("cart-items");
  const emptyMsg = document.getElementById("cart-empty");
  const summary = document.getElementById("cart-summary");
  const totalEl = document.getElementById("cart-total-amount");

  if (!container) return;

  if (items.length === 0) {
    container.style.display = "none";
    if (summary) summary.style.display = "none";
    if (emptyMsg) emptyMsg.style.display = "block";
    return;
  }

  if (emptyMsg) emptyMsg.style.display = "none";
  if (summary) summary.style.display = "block";
  container.style.display = "block";

  container.innerHTML = items
    .map(
      (item) => `
    <div class="cart-item" data-id="${item.id}">
      <div class="cart-item-info">
        <h4>${item.title}</h4>
        <p class="cart-item-price">${item.price} ₽</p>
      </div>
      <div class="cart-item-controls">
        <button class="btn-qty" data-action="dec">−</button>
        <span class="cart-item-qty">${item.quantity}</span>
        <button class="btn-qty" data-action="inc">+</button>
        <button class="btn-remove" aria-label="Удалить">✕</button>
      </div>
    </div>
  `,
    )
    .join("");

  if (totalEl) totalEl.textContent = `${getCartTotal()} ₽`;
  updateCartCount();
}

document.addEventListener("click", (e) => {
  const btn = e.target.closest("button");
  if (!btn) return;

  const itemEl = btn.closest(".cart-item");
  if (!itemEl) return;

  const id = itemEl.dataset.id;
  const action = btn.dataset.action;

  if (btn.classList.contains("btn-remove")) {
    removeFromCart(id);
  } else if (action === "inc") {
    const currentQty = parseInt(
      itemEl.querySelector(".cart-item-qty").textContent,
      10,
    );
    updateQuantity(id, currentQty + 1);
  } else if (action === "dec") {
    const currentQty = parseInt(
      itemEl.querySelector(".cart-item-qty").textContent,
      10,
    );
    updateQuantity(id, currentQty - 1);
  }

  renderCart();
});

document.addEventListener("DOMContentLoaded", renderCart);
