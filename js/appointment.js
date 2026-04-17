import { supabase } from "./supabase.js";

// Получаем элементы из DOM
const form = document.getElementById("appointment-form");
const successMsg = document.getElementById("appointment-success");
const ctaTitle = document.getElementById("cta-title");
const dateInput = document.getElementById("preferred-date");

// 1. Установка минимальной даты (нельзя выбрать прошлое)
if (dateInput) {
  const today = new Date().toISOString().split("T")[0];
  dateInput.min = today;
}

// 2. Обработка отправки формы
if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;

    // Блокируем кнопку, чтобы не отправили дважды
    submitBtn.disabled = true;
    submitBtn.textContent = "Отправка...";

    // Собираем данные
    const data = {
      client_name: document.getElementById("client-name").value.trim(),
      client_phone: document.getElementById("client-phone").value.trim(),
      service_type: document.getElementById("service-type").value,
      preferred_date: dateInput.value,
      preferred_time: document.getElementById("preferred-time").value || null,
      comment: document.getElementById("comment").value.trim(),
    };

    // Простая валидация телефона
    if (data.client_phone.length < 7) {
      alert("Пожалуйста, введите корректный номер телефона.");
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
      return;
    }

    try {
      // Отправка в Supabase
      const { error } = await supabase.from("appointments").insert([data]);

      if (error) throw error;

      // === УСПЕХ ===
      // Скрываем форму и вводный текст
      form.style.display = "none";
      document.querySelector(".cta-intro").style.display = "none";

      // Меняем заголовок и показываем сообщение
      if (ctaTitle) ctaTitle.textContent = "Вы записаны!";
      if (successMsg) successMsg.style.display = "block";
    } catch (err) {
      console.error("Ошибка записи:", err);
      alert("Произошла ошибка. Попробуйте позже.");
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
    }
  });
}
