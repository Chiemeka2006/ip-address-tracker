"use strict";
import "./scss/style.scss";

let searchBtn = document.querySelector(".search__btn");
let searchBar = document.querySelector(".search__bar");
let errorMsg = document.querySelector(".error");
let searchContent = document.querySelectorAll(".display__box__content");
let ipText = searchContent[0];
let locationText = searchContent[1];
let timezoneText = searchContent[2];
let ispText = searchContent[3];
//let apiKey = "at_qDn7PObRzAXY7gKk7qy9LuX9OgThO";
let apiKey = "at_3nSy6EZiCcBkZ5rBdDMw7YiMzRyFv";

let ipAddress = {
    fetchIP: function (ipValue) {
        fetch(
            `https://geo.ipify.org/api/v1?apiKey=${apiKey}&ipAddress=${ipValue}`
        )
            .then((response) => response.json())
            .then((data) => {
                displayInfo(data);
            })
            .catch((error) => {
                console.log("ip address Error:")
                searchBar.style.borderColor = 'red'
                errorMsg.style.opacity = "1";
                errorMsg.textContent = `Input a valid Ip address`
            });
    },

    fetchDomain: function (domainValue) {
        fetch(
            `https://geo.ipify.org/api/v2/country,city?apiKey=at_qDn7PObRzAXY7gKk7qy9LuX9OgThO&domain=${domainValue}`
        )
            .then((Response) => Response.json())
            .then((data) => displayInfo(data))
            .catch((error) => {
                console.log('domain error')
                searchBar.style.borderColor = "red";
                errorMsg.style.opacity = '1'
                errorMsg.textContent = `Input a valid domain name`;
            })
    },

    search: function () {
        let searchBar = document.querySelector(".search__bar__input");
        if (searchBar.value !== "") {
            if (/\d/.test(searchBar.value)) {
                console.log("ip address");
                this.fetchIP(searchBar.value);
                setTimeout(() => {
                    searchBar.value = "";
                }, 300);
            } else {
                console.log("domain");
                this.fetchDomain(searchBar.value);
                setTimeout(() => {
                    searchBar.value = "";
                }, 300);
            }
        }
    },
};

function displayInfo(data) {
    //! ------------------------- API DATA -------------------------------------
    let { ip } = data;
    let { timezone, city, country, postalCode, lat, lng } = data.location;
    let { isp } = data;

    //! ------------------------- TEXT REPLACEMENT WITH API DATA -----------------------------
    locationText.innerHTML = `${city}, ${country} ${postalCode}`;
    ipText.innerHTML = ip;
    timezoneText.innerHTML = `UTC ${timezone}`;
    ispText.innerHTML = isp;

    //! -------------------------- FORM VALIDATION -------------------------
    searchBar.style.borderColor = "white";
    errorMsg.style.opacity = "0";

    //! ------------------------ LEAFLET LIBRARY ------------------------------
    var container = L.DomUtil.get("map");
    if (container != null) {
        container._leaflet_id = null;
    }
    var map = L.map("map").setView([lat, lng], 13);
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution:
            '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);
    var marker = L.marker([lat, lng]).addTo(map);
    marker.bindPopup("<b>Your Location</b>");
    var circle = L.circle([lat, lng], {
        color: "#5d81eb",
        fillColor: "#4658a8",
        fillOpacity: 0.5,
        radius: 500,
    }).addTo(map);
    circle.bindPopup("<b>Your Location Area</b>");


}

//? ---------------------- EVENT LISTENERS --------------------------------

searchBtn.addEventListener("click", () => {
    ipAddress.search();
});

document.addEventListener("keydown", (e) => {
    if (e.key === "Enter") ipAddress.search();
});

document.addEventListener("DOMContentLoaded", function () {
    ipAddress.fetchIP("");
});
