import { supabase } from "./supabase.js";
import { addToCart } from "./cart.js";

// === ЗАГРУЗКА ТОВАРОВ НА ГЛАВНУЮ СТРАНИЦУ ===

async function loadProducts() {
  const productsGrid = document.getElementById("products-grid");

  if (!productsGrid) return; // Мы не на главной странице

  // Показываем "Загрузка..."
  productsGrid.innerHTML = '<p class="loading">Загрузка товаров...</p>';

  try {
    // Запрос к Supabase: берём только товары в наличии
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("in_stock", true)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Ошибка Supabase:", error);
      productsGrid.innerHTML =
        '<p class="error">❌ Ошибка загрузки товаров</p>';
      return;
    }

    if (!data || data.length === 0) {
      productsGrid.innerHTML = "<p>Товаров пока нет 😔</p>";
      return;
    }

    // Рендерим карточки товаров (используем твою структуру из Omnifood)
    productsGrid.innerHTML = data
      .map(
        (product) => `
            <div class="product-card">
                <img src="${product.image_url || "img/products/placeholder.jpg"}" 
                     alt="${product.title}" 
                     class="product-image">
                <div class="product-content">
                    <h3 class="product-title">${product.title}</h3>
                    <p class="product-category">${product.category}</p>
                    <p class="product-price">${product.price} ₽</p>
                    <p class="product-desc">${product.description || ""}</p>
                    <button class="btn-add-to-cart" 
                            onclick="handleAddToCart(${product.id}, '${product.title.replace(/'/g, "\\'")}', ${product.price})">
                        В корзину
                    </button>
                </div>
            </div>
        `,
      )
      .join("");

    console.log("✅ Товары загружены:", data.length);
  } catch (err) {
    console.error("Критическая ошибка:", err);
    productsGrid.innerHTML = '<p class="error">⚠️ Произошла ошибка</p>';
  }
}

// Обёртка для addToCart (чтобы работала из HTML onclick)
window.handleAddToCart = function (productId, title, price) {
  addToCart(productId, title, price);
};

// Запускаем загрузку при готовности страницы
document.addEventListener("DOMContentLoaded", () => {
  loadProducts();
});
