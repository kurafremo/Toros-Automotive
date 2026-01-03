const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { initDb, openDb } = require("./db"); // Veritabanı dosyamız

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// Sunucu başlarken veritabanını hazırla
initDb();

// -------------------
// 1. İLETİŞİM FORMU (SQL)
// -------------------
app.post("/api/contact", async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;
    
    if (!name || !phone) {
      return res.status(400).json({ msg: "İsim ve telefon zorunludur." });
    }

    const db = await openDb();
    await db.run(
      'INSERT INTO contacts (name, email, phone, message) VALUES (?, ?, ?, ?)',
      [name, email, phone, message]
    );

    res.json({ success: true, msg: "Mesajınız başarıyla kaydedildi." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Sunucu hatası." });
  }
});

// -------------------
// 2. RANDEVU SİSTEMİ (SQL)
// -------------------
app.post("/api/appointment", async (req, res) => {
  try {
    const { name, phone, car_model, service_type, date, description } = req.body;

    // Basit doğrulama
    if (!name || !phone || !date) {
      return res.status(400).json({ msg: "Lütfen zorunlu alanları doldurun." });
    }

    const db = await openDb();
    await db.run(
      'INSERT INTO appointments (name, phone, car_model, service_type, date, description) VALUES (?, ?, ?, ?, ?, ?)',
      [name, phone, car_model, service_type, date, description]
    );

    res.json({ success: true, msg: "Randevunuz oluşturuldu! Sizi arayacağız." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Randevu oluşturulamadı." });
  }
});

// -------------------
// ADMİN PANELİ İÇİN VERİ ÇEKME
// -------------------
app.get("/api/all-data", async (req, res) => {
  try {
    const db = await openDb();
    const messages = await db.all('SELECT * FROM contacts ORDER BY id DESC');
    const appointments = await db.all('SELECT * FROM appointments ORDER BY id DESC');
    
    res.json({ messages, appointments });
  } catch (err) {
    res.status(500).json({ msg: "Veri çekilemedi." });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 SQL Sunucusu Çalışıyor: http://localhost:${PORT}`));
