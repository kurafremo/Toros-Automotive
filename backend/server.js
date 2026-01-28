const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

// Modeller
const Contact = require("./models/Contact");
const Appointment = require("./models/Appointment");

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Statik Dosyaları Sun (Frontend ile bağlantı)
app.use(express.static(path.join(__dirname, './')));

// 📌 MongoDB Bağlantısı (Render Environment'tan alır)
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Bağlantısı Başarılı! Veriler Güvende."))
  .catch((err) => console.error("❌ Veritabanı Hatası:", err));

// -------------------
// API ROTALARI
// -------------------

// 1. İletişim Formu Kaydet
app.post("/api/contact", async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;
    const newContact = new Contact({ name, email, phone, message });
    await newContact.save();
    res.status(201).json({ success: true, msg: "Mesajınız kaydedildi." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, msg: "Bir hata oluştu." });
  }
});

// 2. Randevu Kaydet
app.post("/api/appointment", async (req, res) => {
  try {
    const { name, phone, car_model, service_type, date, description } = req.body;
    const newAppointment = new Appointment({ 
        name, phone, car_model, service_type, date, description 
    });
    await newAppointment.save();
    res.status(201).json({ success: true, msg: "Randevunuz oluşturuldu!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, msg: "Randevu oluşturulamadı." });
  }
});

// 3. Admin Paneli İçin Tüm Verileri Çek
app.get("/api/all-data", async (req, res) => {
  try {
    // En yeniden eskiye doğru sırala
    const messages = await Contact.find().sort({ createdAt: -1 });
    const appointments = await Appointment.find().sort({ createdAt: -1 });
    res.json({ messages, appointments });
  } catch (err) {
    res.status(500).json({ msg: "Veriler çekilemedi." });
  }
});

// Ana Sayfa Yönlendirmesi
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Sunucu Çalışıyor: http://localhost:${PORT}`));