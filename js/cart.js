// === КОРЗИНА: ДОБАВЛЕНИЕ / УДАЛЕНИЕ / ПОДСЧЁТ ===

// Добавить товар в корзину
export function addToCart(productId, title, price) {
  let cart = JSON.parse(localStorage.getItem("yumi_cart") || "[]");

  const existingItem = cart.find((item) => item.id === productId);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      id: productId,
      title: title,
      price: price,
      quantity: 1,
    });
  }

  localStorage.setItem("yumi_cart", JSON.stringify(cart));
  updateCartCount();

  // Показываем уведомление (можно убрать)
  alert("✅ Товар добавлен в корзину!");
}

// Удалить товар из корзины
export function removeFromCart(productId) {
  let cart = JSON.parse(localStorage.getItem("yumi_cart") || "[]");
  cart = cart.filter((item) => item.id !== productId);
  localStorage.setItem("yumi_cart", JSON.stringify(cart));
  updateCartCount();
}

// Изменить количество товара
export function updateQuantity(productId, newQuantity) {
  let cart = JSON.parse(localStorage.getItem("yumi_cart") || "[]");
  const item = cart.find((item) => item.id === productId);

  if (item) {
    if (newQuantity <= 0) {
      removeFromCart(productId);
    } else {
      item.quantity = newQuantity;
      localStorage.setItem("yumi_cart", JSON.stringify(cart));
      updateCartCount();
    }
  }
}

// Обновить счётчик корзины в шапке сайта
export function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem("yumi_cart") || "[]");
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);

  const cartCountEl = document.getElementById("cart-count");
  if (cartCountEl) {
    cartCountEl.textContent = count;
  }
}

// Получить общую сумму корзины
export function getCartTotal() {
  const cart = JSON.parse(localStorage.getItem("yumi_cart") || "[]");
  return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

// Получить весь контент корзины
export function getCartItems() {
  return JSON.parse(localStorage.getItem("yumi_cart") || "[]");
}

// Очистить корзину (после успешного заказа)
export function clearCart() {
  localStorage.removeItem("yumi_cart");
  updateCartCount();
}

// Инициализация при загрузке любой страницы
document.addEventListener("DOMContentLoaded", () => {
  updateCartCount();
});
