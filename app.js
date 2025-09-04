const els = {
    root:  document.querySelector(".container"),
    box:   document.querySelector(".search input"),
    btn:   document.querySelector(".search button"),
    icon:  document.querySelector(".weather-icon"),
    temp:  document.querySelector(".tmp"),
    city:  document.querySelector(".city"),
    humidity: document.querySelector(".humidity"),
    wind:  document.querySelector(".wind"),
    loading: document.querySelector(".loading"),
};

const iconMap = {
    0:"sun.png",
    1:"rain-and-sun.png", 2:"rain-and-sun.png",
    3:"cloud.png",
    45:"cloud.png", 48:"cloud.png",
    51:"rain.png", 53:"rain.png", 55:"rain.png",
    61:"rain.png", 63:"rain.png", 65:"rain.png",
    71:"snowy.png", 73:"snowy.png", 75:"snowy.png", 77:"snowy.png",
    80:"rain-and-sun.png", 81:"rain.png", 82:"rain.png",
    95:"thunderstorm.png", 96:"thunderstorm.png", 99:"thunderstorm.png",
};

function setLoading(isLoading) {
    els.root.classList.toggle("is-loading", isLoading);
    els.loading.classList.toggle("hidden", !isLoading);
    els.btn.disabled = isLoading;

    if (isLoading) {
        els.icon.src = "img/gay.png";
        els.temp.textContent = "--";
        els.city.textContent = "--";
        els.humidity.textContent = "--%";
        els.wind.textContent = "--km/h";
    }
}

async function getWeather(city) {
    if (!city || !city.trim()) {
    alert("Nhập tên thành phố vào nhé!");
    return;
    }
    setLoading(true);
    try {
        // geo địa chỉ được lat và lon
    const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=vi&format=json`;
    const geoRes = await fetch(geoUrl);
    if (!geoRes.ok) throw new Error("Không gọi được dịch vụ geocoding");
    const geoData = await geoRes.json();
    if (!geoData.results || geoData.results.length === 0) throw new Error("Không tìm thấy thành phố");
    const { latitude, longitude, name } = geoData.results[0];

    // gọi api thời tiết
    const wxUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&timezone=auto`;
    const wxRes = await fetch(wxUrl);
    if (!wxRes.ok) throw new Error("Không gọi được dịch vụ thời tiết");
    const wxData = await wxRes.json();
    
    //cập nhật giá trị
    const cur = wxData.current;
    els.city.textContent = name;
    els.temp.textContent = Math.round(cur.temperature_2m)+"°C";
    els.humidity.textContent = Math.round(cur.relative_humidity_2m) + "%";
    els.wind.textContent = Math.round(cur.wind_speed_10m) + "km/h";

    const iconFile = iconMap[cur.weather_code] || "not-available.png";
    els.icon.src = "img/" + iconFile;
    els.icon.alt = `Mã thời tiết ${cur.weather_code}`;
    } catch (err) {
        alert("Lỗi: " + err.message);
        els.icon.src = "img/not-available.png";
    }
    finally {
        setTimeout(setLoading(false), 4000);
    }
}

els.btn.addEventListener("click", () => getWeather(els.box.value));
els.box.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
    e.preventDefault();
    getWeather(els.box.value);
    }
});
