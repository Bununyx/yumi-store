import { supabase } from "./supabase.js";
import { getCart, getCartTotal, clearCart } from "./cart.js";

function renderCheckoutItems() {
  const items = getCart();
  const container = document.getElementById("checkout-items");
  const totalEl = document.getElementById("checkout-total");
  if (!container) return;

  container.innerHTML = items
    .map(
      (item) => `
    <div class="checkout-item">
      <span>${item.title} × ${item.quantity}</span>
      <span>${item.price * item.quantity} ₽</span>
    </div>
  `,
    )
    .join("");

  if (totalEl) totalEl.textContent = `${getCartTotal()} ₽`;
}

document.addEventListener("DOMContentLoaded", () => {
  const items = getCart();
  if (items.length === 0) {
    window.location.href = "cart.html";
    return;
  }
  renderCheckoutItems();

  const form = document.getElementById("checkout-form");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const submitBtn = form.querySelector(".btn-submit");
    if (!submitBtn) return;

    submitBtn.disabled = true;
    submitBtn.textContent = "Отправка...";

    const name = document.getElementById("client-name")?.value.trim();
    const phone = document.getElementById("client-phone")?.value.trim();

    if (!name || !phone) {
      alert("Пожалуйста, заполните имя и телефон.");
      submitBtn.disabled = false;
      submitBtn.textContent = "Подтвердить заказ";
      return;
    }

    try {
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert([
          {
            client_name: name,
            client_phone: phone,
            total_amount: getCartTotal(),
            status: "new",
          },
        ])
        .select()
        .single();

      if (orderError || !order)
        throw new Error(orderError?.message || "Ошибка создания заказа");

      const orderItems = items.map((item) => ({
        order_id: order.id,
        product_id: item.id,
        quantity: item.quantity,
        price_at_purchase: item.price,
      }));

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItems);
      if (itemsError) throw itemsError;

      clearCart();
      document.getElementById("checkout-form").style.display = "none";
      const successMsg = document.getElementById("checkout-success");
      if (successMsg) successMsg.style.display = "block";
    } catch (error) {
      console.error("Ошибка оформления:", error);
      alert("Произошла ошибка при оформлении. Попробуйте позже.");
      submitBtn.disabled = false;
      submitBtn.textContent = "Подтвердить заказ";
    }
  });
});
