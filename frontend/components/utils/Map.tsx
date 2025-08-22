// components/Map.tsx
'use client'

import { memo } from 'react'
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

// تعریف آیکن سفارشی
const customIcon = new L.Icon({
  iconUrl: '/images/marker.png', // مسیر آیکن جدید
  iconSize: [40, 53], // اندازه آیکن
  iconAnchor: [12, 41], // نقطه لنگر آیکن
  popupAnchor: [7, -41], // موقعیت پاپ‌آپ نسبت به آیکن
})

interface MapProps {
  center: [number, number]
  zoom?: number
  className?: string
  popup?: string
}

const Map = ({ className, center = [35.6892, 51.389], zoom = 13, popup }: MapProps) => {
  return (
    <div className={`w-full h-full overflow-hidden z-0 ${className}`}>
      <MapContainer
        key={center.toString()}
        center={center} // تهران
        className="w-full h-full"
        scrollWheelZoom={true}
        zoom={zoom}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker
          icon={customIcon}
          position={center}
        >
          <Popup>{popup}</Popup>
        </Marker>
      </MapContainer>
    </div>
  )
}

export default memo(Map)
