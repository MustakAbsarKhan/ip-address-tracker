window.addEventListener('load',()=>{
    let ipAddress = document.querySelector(".ip-address");
    let cityData = document.querySelector(".city-data");
    let countryData = document.querySelector(".country-data");    
    let timezoneData = document.querySelector(".timezone-data");
    let timeData = document.querySelector(".time-data");
    let dateData = document.querySelector(".date-data");
    let ispData = document.querySelector(".isp-data");
    let currencyData = document.querySelector(".currency-data");
    let flagIcon = document.querySelector(".flag-icon");

    let ipgeolocationAPI = `https://api.ipgeolocation.io/ipgeo?apiKey=038933b9d1e74176ba6c610f65af08a6&ip=`;//change api key with own key
    ipgeolocationapiCALL(ipgeolocationAPI);

    function ipgeolocationapiCALL(api){//returns "ip": "103.145.74.149","continent_code": "AS","continent_name": "Asia","country_code2": "BD","country_code3": "BGD","country_name": "Bangladesh","country_capital": "Dhaka","state_prov": "Dhaka Division","district": "Savar Upazila","city": "Savar Union","zipcode": "","latitude": "23.86170","longitude": "90.25649","is_eu": false,"calling_code": "+880","country_tld": ".bd","languages": "bn-BD,en","country_flag": "https://ipgeolocation.io/static/flags/bd_64.png","geoname_id": "1200292","isp": "Master Net","connection_type": "","organization": "Master Net","currency": {"code": "BDT","name": "Bangladeshi Taka","symbol": "৳"},"time_zone": {"name": "Asia/Dhaka","offset": 6,"current_time": "2022-08-28 15:24:16.540+0600","current_time_unix": 1661678656.54,"is_dst": false,"dst_savings": 0

        fetch(api)
        .then((response)=>response.json())//collects data as json
        .then((data)=>{
            console.log(data);
            //declaring contents of api as objects
            const ip = data.ip;//103.145.74.149
            const {city,country_name,isp,country_flag,latitude,longitude} = data;//Dhaka, Bangladesh,Master Net
            const {current_time,name} = data.time_zone;//"2022-08-27 23:25:49.527+0600";
            const {code,symbol} = data.currency;//BDT,TAKA SYMBOL
            //const currencyNAME = data.currency.name;//Bangladeshi Taka

            let timezone = current_time.slice(current_time.length-5); //+0600
            let date = current_time.slice(0,current_time.search(" "));// 2022-08-27
            let time = current_time.slice(date.length+1,date.length+9);//23:01:28
            let exactTimezone = "UTC " + timezone.slice(0,3)+":"+timezone.slice(timezone.length-2,timezone.length);//UTC +06:00

            //assigning api values to html elements
            ipAddress.textContent = ip;
            cityData.textContent = city+",";
            countryData.textContent = country_name;
            timezoneData.textContent = exactTimezone+",";
            timeData.textContent = time+",";
            dateData.textContent = date;
            ispData.textContent = isp;
            currencyData.textContent = code+`(${symbol})`;
            flagIcon.src = country_flag;
            
            //map initiation
            var map = L.map('map').setView([latitude, longitude], 13);

            //maptile setup
            L.tileLayer('https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=Kiarb32YtKIgXk1i9lL1',{
                tileSize: 512,
                zoomOffset: -1,
                minZoom: 1,
                attribution: "\u003ca href=\"https://www.maptiler.com/copyright/\" target=\"_blank\"\u003e\u0026copy; MapTiler\u003c/a\u003e \u003ca href=\"https://www.openstreetmap.org/copyright\" target=\"_blank\"\u003e\u0026copy; OpenStreetMap contributors\u003c/a\u003e",
                crossOrigin: true
            }).addTo(map); 

            //map icon
            var blackIcon = L.icon({
                iconUrl: 'images/icon-location.svg',
                iconSize: [30, 40]
            });

            //marker & popup on marker
            L.marker([latitude, longitude],{icon: blackIcon}).addTo(map)
            .bindPopup('Your IP Shows You Here')
            .openPopup();

            //popup on map click
            var popup = L.popup();

            function onMapClick(e) {
                popup
                    .setLatLng(e.latlng)
                    .setContent("You clicked the map at " + e.latlng.toString())
                    .openOn(map);
            }
            map.on('click', onMapClick);

            //geolocation plugin
            var lc = L.control.locate({
                position: 'topleft',
                tap: false,
                strings: {
                    title: "Click here, to get your device's current location"
                },
                locateOptions: {
                    enableHighAccuracy: true
                }
            }).addTo(map);

        });
    };

    
});