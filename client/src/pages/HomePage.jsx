import { useState, useEffect } from "react";
import Header from "../components/header/home/Header.jsx";
import SearchCard from "../components/cards/SearchCard.jsx";
import FlightsCard from "../components/cards/FlightsCard.jsx";
import FilterFlights from "../components/filter/FilterFlights.jsx";
import InfoCard from "../components/cards/InfoCard.jsx";
import Loading from "../components/loading/Loading.jsx";

const HomePage = () => {
  // Yüklenme durumunu kontrol eden state
  const [loading, setLoading] = useState(false);
  // Havayolu şirketlerini tutacak state
  const [airlines, setAirlines] = useState([]);
  // Seçilen havayolu şirketini tutan state
  const [selectedAirline, setSelectedAirline] = useState(null);

  // Arama butonuna tıklandığında yükleme durumunu başlatan fonksiyon
  const handleSearchClick = () => {
    setLoading(true); // Yükleme durumunu başlat
    setTimeout(() => {
      setLoading(false); // 4.5 saniye sonra yüklemeyi bitir
    }, 4500); // Simüle edilmiş minimum yükleme süresi
  };

  // Havayolu verilerini güncelleyen fonksiyon
  const handleAirlinesUpdate = (airlines) => {
    setAirlines(airlines); // Gelen havayolu verilerini state'e kaydet
  };

  // Seçilen havayolu şirketini güncelleyen fonksiyon
  const handleAirlineSelect = (selectedAirline) => {
    setSelectedAirline(selectedAirline); // Seçilen havayolu state'e kaydedilir
  };

  // Sayfa yüklendiğinde body'e 'overflow-hidden' sınıfı eklenir, sayfa terk edilirken kaldırılır
  useEffect(() => {
    document.body.classList.add("overflow-hidden"); // Sayfa yüklenirken taşmayı engelle

    return () => {
      document.body.classList.remove("overflow-hidden"); // Sayfa terk edildiğinde sınıfı kaldır
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Üst kısım: Header bileşeni */}
      <Header />

      {/* İçerik kısmı: arama ve uçuş kartları */}
      <div className="flex-grow flex flex-col md:flex-row md:space-x-4 p-4 mt-6">
        {/* Sol taraf: Arama ve uçuş kartları */}
        <div className="flex flex-col flex-grow">
          {/* Arama kartı */}
          <SearchCard onSearchClick={handleSearchClick} />

          {/* Filtreleme ve uçuş kartlarının olduğu bölüm */}
          <div className="flex flex-col md:flex-row md:space-x-4 mt-4">
            {/* Filtreleme - mobilde görünür */}
            <div className="md:hidden mb-4">
              <FilterFlights
                airlines={airlines}
                onAirlineSelect={handleAirlineSelect} // Seçim değişikliğini bildir
              />
            </div>

            {/* Uçuş kartları */}
            <div className="flex flex-col md:w-2/3">
              <div className="h-96 overflow-y-auto">
                <FlightsCard
                  onAirlinesUpdate={handleAirlinesUpdate} // Havayolu verilerini güncelle
                  selectedAirline={selectedAirline} // Seçilen havayolu bilgisini uçuş kartlarına aktar
                />
              </div>
            </div>

            {/* Filtreleme - masaüstünde görünür */}
            <div className="flex-col md:w-1/3 md:block hidden">
              <FilterFlights
                airlines={airlines}
                onAirlineSelect={handleAirlineSelect} // Seçim değişikliğini bildir
              />
            </div>
          </div>
        </div>

        {/* Sağ taraf: Bilgi kartları - masaüstünde görünür */}
        <div className="hidden md:flex flex-col md:space-y-4 space-y-2">
          <InfoCard />
        </div>
      </div>

      {/* Bilgi kartı - mobilde görünür */}
      <div className="flex md:hidden justify-center space-y-2 p-4">
        <InfoCard />
      </div>

      {/* Yükleme animasyonu, 'loading' true ise gösterilir */}
      {loading && <Loading />}
    </div>
  );
};

export default HomePage;
