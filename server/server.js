// Gerekli modülleri dahil ediyoruz
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const port = 5001; // Sunucunun çalışacağı port
const bodyParser = require("body-parser");
const cors = require("cors");

// Uçuş verileri için route dosyasını dahil ediyoruz
const flightRoute = require("./routes/flights.js");

// Middleware'leri kullanıyoruz
app.use(cors()); // CORS'u etkinleştiriyoruz, böylece farklı kaynaklardan istek alabiliriz
app.use(bodyParser.json()); // Gelen JSON verilerini işlemek için body-parser kullanıyoruz

// MongoDB'ye bağlanma fonksiyonu
const connect = async () => {
  try {
    // MongoDB'ye bağlanıyoruz
    await mongoose.connect(
      "mongodb+srv://berkhansubasii:berk.123@cluster0.9r8bi.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
    );
    console.log("MongoDB'ye başarılı bir şekilde bağlanıldı!");
  } catch (error) {
    // Bağlantı hatası durumunda hata mesajını log'a yazdırıyoruz
    console.error("MongoDB'ye bağlanılırken hata oluştu:", error);
    throw error; // Hatanın fırlatılması ile işlem sonlanır
  }
};

// Uçuş verileri için route tanımlaması yapıyoruz
app.use("/server/flights", flightRoute); // Uçuş verilerini işleyecek route

// Sunucuyu başlatıyoruz
app.listen(port, () => {
  // Sunucu başlatıldığında MongoDB'ye bağlanmaya çalışıyoruz
  connect();
  console.log(`Sunucu port ${port} üzerinde dinleniyor`); // Başarıyla çalıştığında log mesajı
});
