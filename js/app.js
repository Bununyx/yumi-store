import { supabase } from "./supabase.js";
import { addToCart } from "./cart.js";

const PRODUCTS_GRID_ID = "products-grid";
const LOADING_HTML = '<p class="center-text">Загрузка товаров...</p>';
const EMPTY_HTML = '<p class="center-text">Товаров пока нет 😔</p>';
const ERROR_HTML =
  '<p class="center-text" style="color: #e67e22;">⚠️ Не удалось загрузить товары</p>';

async function loadProducts() {
  const grid = document.getElementById(PRODUCTS_GRID_ID);
  if (!grid) return;

  grid.innerHTML = LOADING_HTML;

  try {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("in_stock", true)
      .order("created_at", { ascending: false });

    if (error) throw error;
    if (!data || data.length === 0) {
      grid.innerHTML = EMPTY_HTML;
      return;
    }

    grid.innerHTML = data
      .map(
        (product) => `
      <div class="product-card" data-id="${product.id}" data-title="${product.title}" data-price="${product.price}">
        <img src="${product.image_url || "img/products/placeholder.jpg"}" alt="${product.title}" class="product-image" loading="lazy">
        <div class="product-content">
          <h3 class="product-title">${product.title}</h3>
          <p class="product-category">${product.category}</p>
          <p class="product-price">${product.price} ₽</p>
          <p class="product-desc">${product.description || ""}</p>
          <button class="btn-add-to-cart">В корзину</button>
        </div>
      </div>
    `,
      )
      .join("");
  } catch (err) {
    console.error("Ошибка загрузки товаров:", err);
    grid.innerHTML = ERROR_HTML;
  }
}

// Делегирование кликов по кнопкам "В корзину"
document.addEventListener("click", (e) => {
  const btn = e.target.closest(".btn-add-to-cart");
  if (!btn) return;

  const card = btn.closest(".product-card");
  if (!card) return;

  const id = card.dataset.id;
  const title = card.dataset.title;
  const price = parseFloat(card.dataset.price);

  if (id && title && !isNaN(price)) {
    addToCart(id, title, price);
  }
});

document.addEventListener("DOMContentLoaded", loadProducts);
