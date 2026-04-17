// scripts/backup.js
const { createClient } = require("@supabase/supabase-js");
const fs = require("fs");
const path = require("path");

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.error("❌ Отсутствуют переменные окружения Supabase");
  process.exit(1);
}

const supabase = createClient(url, key);

async function backup() {
  const date = new Date().toISOString().split("T")[0];
  const dir = "backups";
  if (!fs.existsSync(dir)) fs.mkdirSync(dir);

  // Таблицы для резервного копирования
  const tables = ["products", "orders", "appointments"];
  const backupData = {};

  for (const table of tables) {
    console.log(`📥 Экспорт таблицы: ${table}`);
    const { data, error } = await supabase.from(table).select("*");
    if (error) throw new Error(`Ошибка экспорта ${table}: ${error.message}`);
    backupData[table] = data;
  }

  const filePath = path.join(dir, `backup_${date}.json`);
  fs.writeFileSync(filePath, JSON.stringify(backupData, null, 2));
  console.log(`✅ Бэкап сохранён: ${filePath}`);
}

backup().catch((err) => {
  console.error("❌ Сбой бэкапа:", err);
  process.exit(1);
});
