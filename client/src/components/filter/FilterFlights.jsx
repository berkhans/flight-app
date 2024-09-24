import React from "react";
import FilterSelect from "./filterOptions/FilterSelect";
import FilterRadioGroup from "./filterOptions/FilterRadioGroup";
import FilterRange from "./filterOptions/FilterRange";

const FilterFlights = ({ airlines, onAirlineSelect }) => {
  // Sıralama seçenekleri
  const selectOptions = [
    { value: "lowest-price", label: "Lowest Price" },
    { value: "highest-price", label: "Highest Price" },
    { value: "recommended", label: "Recommended" },
  ];

  // Varsayılan havayolu seçenekleri, kullanıcı henüz seçim yapmadıysa bu seçenekler kullanılır
  const defaultAirlines = [
    { value: "turkish-airlines", label: "Turkish Airlines", price: "$230" },
    { value: "emirates", label: "Emirates", price: "$230" },
  ];

  // Havayolu seçeneklerini, gelen `airlines` verilerine göre oluşturuyoruz
  // Eğer bir veri yoksa varsayılan havayolu seçenekleri gösterilir
  const airlineOptions =
    airlines.length > 0
      ? airlines.map((airline) => ({
          value: airline.iataCode,
          label: `${airline.name} - $230`, // İsim ve fiyat bilgisini label olarak gösteriyoruz
        }))
      : defaultAirlines;

  // Havayolu seçim değişikliğini işleyen fonksiyon
  const handleAirlineChange = (event) => {
    onAirlineSelect(event.target.value); // Seçilen havayolu bilgisini üst bileşene iletiyoruz
  };

  return (
    <div className="p-4 max-h-[500px] overflow-y-auto">
      {/* Filtreleme başlığı */}
      <h2 className="text-lg font-bold mb-4">Filtreleme Seçenekleri</h2>

      {/* Sıralama seçeneği - Kullanıcı uçuşları düşük fiyattan yükseğe veya tam tersi sıralayabilir */}
      <FilterSelect options={selectOptions} />

      {/* Varış zamanı filtresi - Uçuşların varış saatine göre filtreleme */}
      <div className="mb-4">
        <FilterRadioGroup
          title="Arrival Time"
          name="arrival-time"
          options={[
            { value: "5:00 AM - 11:59 PM", label: "5:00 AM - 11:59 PM" },
            { value: "12:00 PM - 5:59 PM", label: "12:00 PM - 5:59 PM" },
          ]}
        />
      </div>

      {/* Durak sayısı filtresi - Kullanıcı uçuşları durak sayılarına göre filtreleyebilir */}
      <div className="mb-4">
        <FilterRadioGroup
          title="Stops"
          name="stops"
          options={[
            { value: "nonstop", label: "Nonstop", price: "$230" },
            { value: "1-stop", label: "1 Stop", price: "$230" },
            { value: "2+-stop", label: "2+ Stops", price: "$230" },
          ]}
        />
      </div>

      {/* Havayolu filtresi - Kullanıcı belirli bir havayolu seçebilir */}
      <div className="mb-4">
        <FilterRadioGroup
          title="Airlines Included"
          name="airlines"
          options={airlineOptions} // Havayolu seçeneklerini geçiriyoruz
          onChange={handleAirlineChange} // Seçim değişikliği olduğunda handleAirlineChange fonksiyonu çalışır
        />
      </div>

      {/* Fiyat aralığı filtresi - Kullanıcı uçuşları belirli bir fiyat aralığına göre filtreleyebilir */}
      <div className="mb-20">
        <FilterRange />
      </div>
    </div>
  );
};

export default FilterFlights;
