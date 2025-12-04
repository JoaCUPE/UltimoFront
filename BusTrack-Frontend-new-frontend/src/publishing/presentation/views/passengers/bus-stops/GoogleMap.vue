<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps({
  center: {
    type: Object,
    required: true
  },
  markers: {
    type: Array,
    default: () => []
  },
  zoom: {
    type: Number,
    default: 15
  }
})

const mapContainer = ref(null)
let map = null
let mapMarkers = []

const initMap = () => {
  if (!mapContainer.value) return

  map = new google.maps.Map(mapContainer.value, {
    center: props.center,
    zoom: props.zoom,
    mapTypeControl: false,
    fullscreenControl: true,
    streetViewControl: false,
    zoomControl: true
  })

  updateMarkers()
}

const updateMarkers = () => {
  // Limpiar marcadores existentes
  mapMarkers.forEach(marker => marker.setMap(null))
  mapMarkers = []

  if (!map || !props.markers.length) return

  // Crear marcadores para cada paradero
  props.markers.forEach(markerData => {
    const position = {
      lat: markerData.latitude,
      lng: markerData.longitude
    }

    let markerIcon
    let markerLabel = ''

    if (markerData.isCurrentLocation) {
      // Marcador para ubicación actual
      markerIcon = {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 12,
        fillColor: '#4285F4',
        fillOpacity: 1,
        strokeColor: '#ffffff',
        strokeWeight: 3
      }
    } else {
      // Marcador para paraderos
      markerIcon = {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 10,
        fillColor: '#8bc34a',
        fillOpacity: 1,
        strokeColor: '#ffffff',
        strokeWeight: 2
      }
    }

    const marker = new google.maps.Marker({
      position: position,
      map: map,
      icon: markerIcon,
      title: markerData.name,
      animation: google.maps.Animation.DROP
    })

    // Crear InfoWindow para mostrar información al hacer click
    const infoWindow = new google.maps.InfoWindow({
      content: createInfoWindowContent(markerData)
    })

    marker.addListener('click', () => {
      // Cerrar todos los InfoWindows abiertos
      mapMarkers.forEach(m => {
        if (m.infoWindow) m.infoWindow.close()
      })
      infoWindow.open(map, marker)
    })

    marker.infoWindow = infoWindow
    mapMarkers.push(marker)
  })

  // Ajustar el mapa para mostrar todos los marcadores
  if (mapMarkers.length > 1) {
    const bounds = new google.maps.LatLngBounds()
    props.markers.forEach(marker => {
      bounds.extend({
        lat: marker.latitude,
        lng: marker.longitude
      })
    })
    map.fitBounds(bounds)

    // Asegurar un zoom mínimo
    google.maps.event.addListenerOnce(map, 'bounds_changed', () => {
      if (map.getZoom() > 16) {
        map.setZoom(16)
      }
    })
  }
}

const createInfoWindowContent = (markerData) => {
  if (markerData.isCurrentLocation) {
    return `
      <div style="padding: 10px; max-width: 200px;">
        <h3 style="margin: 0 0 8px 0; color: #4285F4; font-size: 16px;">📍 ${markerData.name}</h3>
      </div>
    `
  }

  const routesHtml = markerData.routes
      ? markerData.routes.map(route =>
          `<span style="background: #e8f5e8; color: #2e7d32; padding: 4px 8px; border-radius: 12px; font-size: 12px; font-weight: bold; margin-right: 4px; display: inline-block; margin-bottom: 4px;">${route}</span>`
      ).join('')
      : ''

  return `
    <div style="padding: 12px; max-width: 250px; font-family: Arial, sans-serif;">
      <h3 style="margin: 0 0 8px 0; color: #333; font-size: 16px; font-weight: bold;">${markerData.name}</h3>
      ${markerData.address ? `<p style="margin: 0 0 8px 0; color: #666; font-size: 13px;">📍 ${markerData.address}</p>` : ''}
      ${markerData.distance ? `<p style="margin: 0 0 8px 0; color: #1976d2; font-size: 13px; font-weight: bold;">📏 ${markerData.distance}</p>` : ''}
      ${routesHtml ? `
        <div style="margin-top: 12px;">
          <p style="margin: 0 0 6px 0; color: #333; font-size: 13px; font-weight: bold;">Buses que pasan:</p>
          <div style="display: flex; flex-wrap: wrap; gap: 4px;">
            ${routesHtml}
          </div>
        </div>
      ` : ''}
    </div>
  `
}

watch(() => props.markers, () => {
  if (map) {
    updateMarkers()
  }
}, { deep: true })

watch(() => props.center, (newCenter) => {
  if (map && newCenter) {
    map.setCenter(newCenter)
  }
}, { deep: true })

onMounted(() => {
  // Cargar Google Maps API si no está cargada
  if (!window.google) {
    const script = document.createElement('script')
    script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}`
    script.async = true
    script.defer = true
    script.onload = () => {
      setTimeout(() => initMap(), 100)
    }
    document.head.appendChild(script)
  } else {
    setTimeout(() => initMap(), 100)
  }
})

onBeforeUnmount(() => {
  if (map) {
    mapMarkers.forEach(marker => marker.setMap(null))
    mapMarkers = []
    map = null
  }
})
</script>

<template>
  <div ref="mapContainer" class="google-map-container"></div>
</template>

<style scoped>
.google-map-container {
  width: 100%;
  height: 100%;
  min-height: 500px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  background: #f0f0f0;
}
</style>