import React, { useState } from 'react';
import { Card, message } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlaneDeparture, faPlaneArrival, faPlane } from '@fortawesome/free-solid-svg-icons';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import TextField from '@mui/material/TextField';
import { InputAdornment } from '@mui/material';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import axios from 'axios';
import dayjs from 'dayjs';

// Uçuş arama formunu sunan bileşen
const Search = ({ onSearchClick }) => {
  const [tripType, setTripType] = useState('round'); // Seyahat türü: 'round' veya 'one'
  const [direction, setDirection] = useState(''); // Kalkış havaalanı kodu
  const [arrival, setArrival] = useState(''); // Varış havaalanı kodu
  const [flightDate, setFlightDate] = useState(null); // Uçuş tarihi
  const [returnDate, setReturnDate] = useState(null); // Dönüş tarihi (sadece round trip için)

  const today = dayjs(); // Bugünün tarihi

  // Arama işlemi için fonksiyon
  const handleSearch = async () => {
    // Form doğrulama
    if (!direction || !arrival || !flightDate) {
      message.warning('Lütfen gerekli alanları doldurun.'); // Eksik alanlar için uyarı
      return;
    }

    onSearchClick(); // Yüklenme durumu değişikliği için callback

    // Havaalanı kodlarını büyük harfe dönüştür
    const fromAirportCode = direction.toUpperCase();
    const toAirportCode = arrival.toUpperCase();

    console.log('Kalkış:', fromAirportCode);
    console.log('Varış:', toAirportCode);
    console.log('Uçuş Tarihi:', flightDate ? flightDate.format('YYYY-MM-DD') : 'Seçilmedi');
    console.log('Dönüş Tarihi:', returnDate ? returnDate.format('YYYY-MM-DD') : 'Seçilmedi');

    try {
      let directionFilter; // Uçuş yönü

      // Uçuş yönünü belirle
      if (fromAirportCode !== 'AMS' && toAirportCode === 'AMS') {
        directionFilter = 'A'; // Varış yönü
      } else if (fromAirportCode === 'AMS' && toAirportCode !== 'AMS') {
        directionFilter = 'D'; // Dönüş yönü
      }

      if (directionFilter) {
        // API isteği yap
        const response = await axios.get("http://localhost:5001/server/flights", {
          params: {
            flightdate: flightDate ? flightDate.format('YYYY-MM-DD') : null,
            direction: directionFilter
          },
        });

        console.log('API Yanıtı:', response.data); // API yanıtını kontrol et

        const flights = response.data.flights; // Yanıtın 'flights' özelliğini al

        if (Array.isArray(flights)) {
          // Filtreleme işlemi
          const filteredFlights = flights.filter(flight => {
            const fromForDestinations = flight.route.destinations || [];
            const toForDestinations = flight.route.destinations || [];

            if (directionFilter === 'A') {
              // Varış yönü için filtreleme
              return fromForDestinations.includes(fromAirportCode);
            } else if (directionFilter === 'D') {
              // Dönüş yönü için filtreleme
              return toForDestinations.includes(toAirportCode);
            }

            return false; // Hiçbir filtreleme uygulanmadıysa false döner
          });

          if (filteredFlights.length === 0) {
            // Uçuş bulunamadıysa hata mesajı göster
            message.error('Verilen kriterler için uçuş bulunamadı.');
          } else {
            console.log('Filtrelenmiş Uçuşlar:', filteredFlights);
            // Filtrelenmiş uçuşları sessionStorage'a kaydet
            sessionStorage.setItem('filteredFlights', JSON.stringify(filteredFlights));
            message.success("Uçuş başarıyla bulundu"); // Başarı mesajı
          }
        } else {
          console.error('Uçuş verileri dizi değil:', flights); // Hata durumu
        }
      } else {
        console.log('Geçerli koşullara göre filtre uygulanmadı.'); // Filtre uygulanmadı
      }
    } catch (error) {
      console.error('Uçuş verilerini getirirken hata:', error.message); // API isteği hatası
    }
  };

  return (
    <Card className="relative w-auto p-4 bg-white overflow-hidden" style={{ minHeight: '300px' }}>
      {/* Başlık ve ikon */}
      <div className="absolute top-4 left-10 mt-2 flex items-center z-10">
        <FontAwesomeIcon icon={faPlane} className="mr-2 text-lg" />
        <h2 className="text-lg font-bold">UÇUŞUNUZU REZERVE EDİN</h2>
      </div>

      {/* Seyahat seçenekleri */}
      <div className="absolute top-14 right-10 flex items-center z-10">
        <div className="flex trip-options">
          {/* Round trip seçeneği */}
          <div
            className={`cursor-pointer px-4 py-2 text-md font-semibold rounded-l-full ${tripType === 'round' ? 'bg-purple-800 text-white' : 'bg-gray-200 text-purple-800'} hover:text-white border border-r-0 border-gray-300`}
            onClick={() => setTripType('round')}
          >
            Gidiş-Dönüş
          </div>
          {/* One way seçeneği */}
          <div
            className={`cursor-pointer px-4 py-2 text-md font-semibold rounded-r-full ${tripType === 'one' ? 'bg-purple-800 text-white' : 'bg-gray-200 text-purple-800'} hover:text-white border border-gray-300`}
            onClick={() => setTripType('one')}
          >
            Tek Yön
          </div>
        </div>
      </div>

      {/* Kart içeriği */}
      <div className="pt-16 pb-24 lg:pb-16">
        {/* Flex Container */}
        <div className="flex flex-col lg:flex-row lg:gap-4">
          {/* Üst Satır: Input'lar */}
          <div className="flex flex-col lg:flex-row lg:gap-4 mb-8">
            {/* Kalkış havaalanı kodu için input */}
            <div className="relative flex-1 min-w-[250px] mb-4 lg:mb-0">
              <FontAwesomeIcon
                icon={faPlaneDeparture}
                bounce
                style={{ color: "#5831a0" }}
                className="absolute left-3 top-1/2 transform -translate-y-1/2"
              />
              <input
                type="text"
                className="border border-gray-300 rounded-l-xl pb-1 pl-10 pr-4 py-7 w-full box-border focus:outline-none hover:border-purple-700"
                placeholder="Havaalanı Kodu : TFS.."
                value={direction}
                onChange={(e) => setDirection(e.target.value)}
              />
              <div className="absolute top-0 left-2 text-black-100 text-sm font-semibold mt-2 bg-white px-1">
                Kalkış
              </div>
            </div>

            {/* Varış havaalanı kodu için input */}
            <div className="relative flex-1 min-w-[250px] mb-4 lg:mb-0">
              <FontAwesomeIcon
                icon={faPlaneArrival}
                bounce
                style={{ color: "#5831a0" }}
                className="absolute left-3 top-1/2 transform -translate-y-1/2"
              />
              <input
                type="text"
                className="border border-gray-300 rounded-r-xl pb-1 pl-10 pr-4 py-7 w-full box-border focus:outline-none hover:border-purple-700"
                placeholder="Havaalanı Kodu : AMS.."
                value={arrival}
                onChange={(e) => setArrival(e.target.value)}
              />
              <div className="absolute top-0 left-2 text-black-100 text-sm font-semibold mt-2 bg-white px-1">
                Varış
              </div>
            </div>
          </div>

          {/* Alt Satır: DatePicker'lar */}
          <div className="flex flex-col lg:flex-row lg:gap-4">
            {/* Uçuş Tarihi */}
            <div className="flex-1 min-w-[250px] mb-4 lg:mb-0">
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Uçuş Tarihi"
                  minDate={today} // Geçmiş tarihler için engelleme
                  sx={{
                    width: '100%',
                    '& .MuiInputBase-root': {
                      borderRadius: '20px',
                      backgroundColor: '#f5f5f5',
                    },
                  }}
                  value={flightDate}
                  onChange={(newValue) => setFlightDate(newValue)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      InputProps={{
                        ...params.InputProps,
                        startAdornment: (
                          <InputAdornment position="start">
                            <CalendarTodayIcon />
                          </InputAdornment>
                        ),
                      }}
                    />
                  )}
                />
              </LocalizationProvider>
            </div>

            {/* Dönüş Tarihi (sadece round trip için) */}
            {tripType === 'round' && (
              <div className="flex-1 min-w-[250px] mb-4 lg:mb-0">
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="Dönüş Tarihi"
                    minDate={flightDate || today} // Dönüş tarihi, uçuş tarihinden önce olamaz
                    sx={{
                      width: '100%',
                      '& .MuiInputBase-root': {
                        borderRadius: '20px',
                        backgroundColor: '#f5f5f5',
                      },
                    }}
                    value={returnDate}
                    onChange={(newValue) => setReturnDate(newValue)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        InputProps={{
                          ...params.InputProps,
                          startAdornment: (
                            <InputAdornment position="start">
                              <CalendarTodayIcon />
                            </InputAdornment>
                          ),
                        }}
                      />
                    )}
                  />
                </LocalizationProvider>
              </div>
            )}
          </div>
        </div>

        {/* Arama Butonu */}
        <div className="flex justify-center">
          <button
            className="bg-purple-800 text-white rounded-full py-3 px-8 font-semibold hover:bg-purple-700 transition duration-300 ease-in-out"
            onClick={handleSearch} // Arama fonksiyonunu tetikle
          >
            Uçuş Ara
          </button>
        </div>
      </div>
    </Card>
  );
};

export default Search;
