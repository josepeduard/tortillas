'use strict';

const main = () => {
  const location = document.getElementById('tortilla-location').innerHTML;
  const locationArr = location.split(',');

  mapboxgl.accessToken = 'pk.eyJ1IjoibmNvZGVyOTIiLCJhIjoiY2pkbmRmdno4MGQ2ODJ4bWtxcG02dnk1ciJ9.DehQETKEOyrOha4hqclYvg';
  const mapOptions = {
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    center: [locationArr[0], locationArr[1]],
    zoom: 15
  };

  const map = new mapboxgl.Map(mapOptions);

  if (!navigator.geolocation) {
    console.log('Gelocation is not supported by your browse');
  }else {
    navigator.geolocation.getCurrentPosition(hasLocation, error);
  }

  const marker = new mapboxgl.Marker()
    .setLngLat([locationArr[0], locationArr[1]])
    .addTo(map);

  // Cambiar el centro y el zoom del mapa para tu ubicacion
  // anadir las coordenadas en el template
  // anadir un marker con la coordenadas de la tortilla
};

window.addEventListener('load', main);
