// Gerekli modülleri ve kütüphaneleri dahil ediyoruz
const Flight = require("../models/flight.js");
const express = require("express");
const axios = require("axios");
const router = express.Router();

// Schiphol API URL'si ve kimlik bilgileri (App ID ve App Key)
const flightApiUrl = "https://api.schiphol.nl/public-flights/flights";
const appKey = "dd184493080e3115624fbdfae9a8b030"; // API gizli anahtarı
const appId = "26d83ec7"; // API anahtarı

// Uçuşları API'den çekmek için GET endpoint
router.get("/", async (req, res) => {
  try {
    // Sorgu parametrelerinden uçuş yönü (direction) ve uçuş tarihini (flightdate) alıyoruz
    const { direction, flightdate } = req.query;

    // Schiphol API'ye istek yapıyoruz
    const response = await axios.get(flightApiUrl, {
      headers: {
        app_id: appId, // API anahtarını başlıkta gönderiyoruz
        app_key: appKey, // Gizli API anahtarını başlıkta gönderiyoruz
        resourceversion: "v4",
        Accept: "application/json",
      },
      params: {
        scheduleDate: flightdate, // Uçuş tarihine göre filtreleme
        flightDirection: direction, // Uçuş yönüne göre filtreleme
      },
    });

    // Başarılı istek sonucu API'den alınan uçuş verilerini JSON formatında döndürüyoruz
    res.json(response.data);
  } catch (error) {
    // Hata durumunda log'a yazdırıyoruz ve 500 hata kodu ile mesaj döndürüyoruz
    console.error("Uçuş verileri alınırken hata oluştu:", error);
    res.status(500).send("Uçuş verileri alınırken hata oluştu.");
  }
});

// Yeni uçuş eklemek için POST endpoint
router.post("/add-flight", async (req, res) => {
  try {
    // İstek gövdesinden gelen uçuş verisini kullanarak yeni bir Flight nesnesi oluşturuyoruz
    const newFlight = new Flight(req.body);

    // Yeni uçuşu MongoDB veritabanına kaydediyoruz
    await newFlight.save();

    // Başarılı kaydetme işlemi sonrası 200 durumu ile başarı mesajı döndürüyoruz
    res.status(200).json("Uçuş başarıyla eklendi!");
  } catch (error) {
    // Hata durumunda log'a yazdırıyoruz ve 500 hata kodu ile mesaj döndürüyoruz
    console.error("Uçuş kaydedilirken hata oluştu:", error);
    res
      .status(500)
      .json({ message: "Uçuş ekleme hatası", error: error.message });
  }
});

// Veritabanından tüm uçuşları almak için GET endpoint
router.get("/get-flight", async (req, res) => {
  try {
    // MongoDB veritabanındaki tüm uçuşları sorgulayıp alıyoruz
    const flights = await Flight.find();

    // Uçuş verilerini başarılı şekilde 200 durumu ile JSON formatında döndürüyoruz
    res.status(200).json(flights);
  } catch (error) {
    // Hata durumunda log'a yazdırıyoruz ve 500 hata kodu ile mesaj döndürüyoruz
    console.error("MongoDB'den uçuş verileri alınırken hata oluştu:", error);
    res.status(500).json({
      message: "MongoDB'den uçuş verileri alınırken hata oluştu",
      error: error.message,
    });
  }
});

// Veritabanındaki bir uçuşu silmek için DELETE endpoint
router.delete("/delete-flight", async (req, res) => {
  try {
    // İstek gövdesinden silinmek istenen uçuşun ID'sini alıyoruz
    const { id } = req.body;

    // Veritabanında belirtilen ID'ye sahip uçuşu buluyoruz
    const flight = await Flight.findOne({ id: id });

    // Eğer uçuş bulunamazsa 404 hata durumu ile mesaj döndürüyoruz
    if (!flight) {
      return res.status(404).json({ message: "Uçuş bulunamadı." });
    }

    // Bulunan uçuşu ID'si ile veritabanından siliyoruz
    await Flight.findByIdAndDelete(flight._id);

    // Başarılı silme işlemi sonrası 200 durumu ile başarı mesajı döndürüyoruz
    res.status(200).json({ message: "Uçuş başarıyla silindi." });
  } catch (error) {
    // Hata durumunda log'a yazdırıyoruz ve 500 hata kodu ile mesaj döndürüyoruz
    console.error("Uçuş silinirken hata oluştu:", error.message);
    res
      .status(500)
      .json({ message: "Uçuş silme hatası", error: error.message });
  }
});

// Router'ı dışa aktarıyoruz, böylece diğer dosyalarda kullanılabilir
module.exports = router;
