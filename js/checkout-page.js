// js/checkout-page.js
import { supabase } from "./supabase.js";
import { getCartItems, getCartTotal, clearCart } from "./cart.js";

function renderCheckoutItems() {
  const cartItems = getCartItems();
  const container = document.getElementById("checkout-items");
  const totalEl = document.getElementById("checkout-total");

  if (!container) return;

  container.innerHTML = cartItems
    .map(
      (item) => `
        <div class="checkout-item">
            <span>${item.title} × ${item.quantity}</span>
            <span>${item.price * item.quantity} ₽</span>
        </div>
    `,
    )
    .join("");

  totalEl.textContent = getCartTotal() + " ₽";
}

document
  .getElementById("checkout-form")
  ?.addEventListener("submit", async (e) => {
    e.preventDefault();

    const submitBtn = document.querySelector(".btn-submit");
    submitBtn.disabled = true;
    submitBtn.textContent = "Отправка...";

    const clientName = document.getElementById("client-name").value;
    const clientPhone = document.getElementById("client-phone").value;
    const cartItems = getCartItems();
    const totalAmount = getCartTotal();

    try {
      // 1. Создаём заказ — ВАЖНО: data: order
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert([
          {
            client_name: clientName,
            client_phone: clientPhone,
            total_amount: totalAmount,
            status: "new",
          },
        ])
        .select()
        .single();

      if (orderError || !order) {
        throw new Error(orderError?.message || "Не удалось создать заказ");
      }

      // 2. Создаём позиции заказа
      const orderItems = cartItems.map((item) => ({
        order_id: order.id, // Теперь order.id точно существует
        product_id: item.id,
        quantity: item.quantity,
        price_at_purchase: item.price,
      }));

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // 3. Успех!
      clearCart();
      document.getElementById("checkout-form").style.display = "none";
      document.getElementById("checkout-success").style.display = "block";
    } catch (error) {
      console.error("❌ Ошибка оформления:", error);
      alert("Ошибка: " + error.message);
      submitBtn.disabled = false;
      submitBtn.textContent = "Подтвердить заказ";
    }
  });

document.addEventListener("DOMContentLoaded", () => {
  if (getCartItems().length === 0) {
    window.location.href = "cart.html";
    return;
  }
  renderCheckoutItems();
});
