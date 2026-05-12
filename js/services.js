/**
 * Рендеринг услуг в стиле "Прайс-лист / Меню"
 */
import { servicesData, formatDuration } from "./services-data.js";

function renderServices() {
  const grid = document.getElementById("services-grid");
  if (!grid) return;

  // Генерируем список категорий
  grid.innerHTML = servicesData
    .map(
      (category) => `
    <div class="service-category">
      <h3 class="category-title">${category.category}</h3>
      
      <ul class="service-list">
        ${category.items
          .map(
            (item) => `
          <li class="service-item">
            <div class="service-header-row">
              <div class="service-name-group">
                <span class="service-name">${item.name}</span>
                <span class="service-duration">⏱ ${formatDuration(item.duration)}</span>
              </div>
              <span class="service-price">${item.price.toLocaleString("ru-RU")} ₽</span>
            </div>
            ${item.description ? `<p class="service-desc">${item.description}</p>` : ""}
          </li>
        `,
          )
          .join("")}
      </ul>
    </div>
  `,
    )
    .join("");
}

document.addEventListener("DOMContentLoaded", renderServices);
