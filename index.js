"use strict";
import ipgeolocationAPIKEY from "./key.js";
window.addEventListener("load", () => {
  let searchbox = document.querySelector("#searchbox");
  let button = document.querySelector(".button");
  let ipAddress = document.querySelector(".ip-address");
  let cityData = document.querySelector(".city-data");
  let countryData = document.querySelector(".country-data");
  let timezoneData = document.querySelector(".timezone-data");
  let timeData = document.querySelector(".time-data");
  let dateData = document.querySelector(".date-data");
  let ispData = document.querySelector(".isp-data");
  let currencyData = document.querySelector(".currency-data");
  let flagIcon = document.querySelector(".flag-icon");
  let currencyconvertData = document.querySelector(".currency-convert-data");
  let count = 0;
  //ipgeolocation api
  let params = new URLSearchParams({
    apiKey: ipgeolocationAPIKEY,
  });
  var map;
  let ipgeolocationAPI = `https://api.ipgeolocation.io/ipgeo?${params}&ip=`;

  ipgeolocationapiCALL(ipgeolocationAPI);

  //if user clicks on the button
  button.addEventListener("click", function () {
    if (searchbox.value !== "") {
      ipgeolocationAPI =
        `https://api.ipgeolocation.io/ipgeo?${params}&ip=` + searchbox.value;
      count++;
      ipgeolocationapiCALL(ipgeolocationAPI);
    };
  });

  //initialization of map on load cause the count value stays 0 at the beginning and when the search icon is pressed for the first time
  function initializeMap(latitude, longitude) {
    map = L.map("map").setView([latitude, longitude], 13);
    L.tileLayer(
      "https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=Kiarb32YtKIgXk1i9lL1",
      {
        tileSize: 512,
        zoomOffset: -1,
        minZoom: 1,
        attribution:
          '\u003ca href="https://www.maptiler.com/copyright/" target="_blank"\u003e\u0026copy; MapTiler\u003c/a\u003e \u003ca href="https://www.openstreetmap.org/copyright" target="_blank"\u003e\u0026copy; OpenStreetMap contributors\u003c/a\u003e',
        crossOrigin: true,
      }
    ).addTo(map);
    var blackIcon = L.icon({
      iconUrl: "images/icon-location.svg",
      iconSize: [30, 40],
    });
    L.marker([latitude, longitude], { icon: blackIcon })
      .addTo(map)
      .bindPopup("Your IP Shows You Here")
      .openPopup();
    L.control
      .locate({
        position: "topleft",
        tap: false,
        strings: {
          title: "Click here, to get your device's current location",
        },
        locateOptions: {
          enableHighAccuracy: true,
        },
      })
      .addTo(map);
  }

  function ipgeolocationapiCALL(api) {
    //returns "ip": "103.145.74.149","continent_code": "AS","continent_name": "Asia","country_code2": "BD","country_code3": "BGD","country_name": "Bangladesh","country_capital": "Dhaka","state_prov": "Dhaka Division","district": "Savar Upazila","city": "Savar Union","zipcode": "","latitude": "23.86170","longitude": "90.25649","is_eu": false,"calling_code": "+880","country_tld": ".bd","languages": "bn-BD,en","country_flag": "https://ipgeolocation.io/static/flags/bd_64.png","geoname_id": "1200292","isp": "Master Net","connection_type": "","organization": "Master Net","currency": {"code": "BDT","name": "Bangladeshi Taka","symbol": "৳"},"time_zone": {"name": "Asia/Dhaka","offset": 6,"current_time": "2022-08-28 15:24:16.540+0600","current_time_unix": 1661678656.54,"is_dst": false,"dst_savings": 0
    fetch(api)
      .then((response) => response.json()) //collects data as json
      .then((data) => {
        //declaring contents of api as objects
        const ip = data.ip; //103.145.74.149
        const { city, country_name, isp, country_flag, latitude, longitude } =
          data; //Dhaka, Bangladesh,Master Net
        const { current_time, name } = data.time_zone; //"2022-08-27 23:25:49.527+0600";
        const { code, symbol } = data.currency; //BDT,TAKA SYMBOL

        let timezone = current_time.slice(current_time.length - 5); //+0600
        let date = current_time.slice(0, current_time.search(" ")); // 2022-08-27
        let time = current_time.slice(date.length + 1, date.length + 9); //23:01:28
        let exactTimezone =
          "UTC " +
          timezone.slice(0, 3) +
          ":" +
          timezone.slice(timezone.length - 2, timezone.length); //UTC +06:00

        //assigning api values to html elements
        ipAddress.textContent = ip;
        cityData.textContent = city + ",";
        countryData.textContent = country_name;
        timezoneData.textContent = exactTimezone + ",";
        timeData.textContent = time + ",";
        dateData.textContent = date;
        ispData.textContent = isp;
        currencyData.textContent = code + ` (${symbol})`;
        flagIcon.src = country_flag;
        let currencyCODE = code; //assigining fetched value to this variable for being able to reassign value to following conditions
        if (currencyCODE === "USD") {
          currencyCODE = "EUR";
          let xchangeRateAPI = `https://api.exchangerate.host/convert?from=USD&to=${currencyCODE}`;
          xchangeRateAPICALL(xchangeRateAPI);
        } else {
          let xchangeRateAPI = `https://api.exchangerate.host/convert?from=USD&to=${currencyCODE}`;
          xchangeRateAPICALL(xchangeRateAPI);
        }

        //calling exchange rate api. This one Converts USD to User's Currency and For users who lives in United States it would convert 1 USD to Euro.
        function xchangeRateAPICALL(api) {
          fetch(api)
            .then((response) => response.json())
            .then((data) => {
              const { to } = data.query;
              const { result } = data;
              const convertedAmount = result.toFixed(2);
              currencyconvertData.textContent =
                "$ 1 = " + `${to} ${convertedAmount}`;
            });
        }

        //default value of count is 0 which gets incremented in the previous if function(which checks if the input field has any value)
        if (count === 0) {//initializing the map and the layout on load
          initializeMap(latitude, longitude);
        } else {//resetting the marker position as the map and layout is already initialized
          var blackIcon = L.icon({
            iconUrl: "images/icon-location.svg",
            iconSize: [30, 40],
          });
          L.marker([latitude, longitude], { icon: blackIcon })
            .addTo(map)
            .bindPopup("Your IP Shows You Here")
            .openPopup();
        }
      })
      .catch((error) => {
        console.log("Error is "+ error);
        alert("Wrong IP. Please Try Again.");
        searchbox.value = "";
      });
  };
});