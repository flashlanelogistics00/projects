'use client'

import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { MapPin, Navigation } from 'lucide-react'

// Fix for Leaflet marker icons in Next.js
const icon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
})

interface ShipmentMapProps {
    origin: string
    destination: string
    currentLocation?: string | null
}

const NOMINATIM_BASE_URL = 'https://nominatim.openstreetmap.org/search'

function ChangeView({ bounds }: { bounds: L.LatLngBoundsExpression }) {
    const map = useMap()
    useEffect(() => {
        if (bounds) {
            map.fitBounds(bounds, { padding: [50, 50] })
        }
    }, [bounds, map])
    return null
}

export function ShipmentMap({ origin, destination, currentLocation }: ShipmentMapProps) {
    const [coords, setCoords] = useState<{
        origin: [number, number] | null
        destination: [number, number] | null
        current: [number, number] | null
    }>({ origin: null, destination: null, current: null })

    useEffect(() => {
        const fetchCoordinates = async () => {
            const getCoords = async (query: string) => {
                if (!query) return null
                try {
                    const response = await fetch(`${NOMINATIM_BASE_URL}?format=json&q=${encodeURIComponent(query)}`)
                    const data = await response.json()
                    if (data && data[0]) {
                        return [parseFloat(data[0].lat), parseFloat(data[0].lon)] as [number, number]
                    }
                } catch (error) {
                    console.error('Error geocoding:', error)
                }
                return null
            }

            const originCoords = await getCoords(origin)
            const destCoords = await getCoords(destination)
            const currentCoords = currentLocation ? await getCoords(currentLocation) : null

            setCoords({
                origin: originCoords,
                destination: destCoords,
                current: currentCoords
            })
        }

        fetchCoordinates()
    }, [origin, destination, currentLocation])

    if (!coords.origin || !coords.destination) {
        return (
            <div className="w-full h-[400px] bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center">
                <div className="flex flex-col items-center gap-2 text-gray-500">
                    <MapPin className="w-8 h-8 animate-bounce" />
                    <p>Loading map data...</p>
                </div>
            </div>
        )
    }

    const bounds = L.latLngBounds([
        coords.origin,
        coords.destination,
        ...(coords.current ? [coords.current] : [])
    ])

    return (
        <div className="w-full h-[400px] rounded-2xl overflow-hidden shadow-lg border border-gray-100 dark:border-gray-700 relative z-0">
            <MapContainer
                center={coords.current || coords.origin}
                zoom={4}
                style={{ height: '100%', width: '100%' }}
                scrollWheelZoom={false}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {/* Origin Marker */}
                <Marker position={coords.origin} icon={icon}>
                    <Popup>
                        <div className="font-bold">Origin</div>
                        {origin}
                    </Popup>
                </Marker>

                {/* Destination Marker */}
                <Marker position={coords.destination} icon={icon}>
                    <Popup>
                        <div className="font-bold">Destination</div>
                        {destination}
                    </Popup>
                </Marker>

                {/* Current Location Marker */}
                {coords.current && (
                    <Marker position={coords.current} icon={icon}>
                        <Popup>
                            <div className="font-bold text-blue-600">Current Location</div>
                            {currentLocation}
                        </Popup>
                    </Marker>
                )}

                {/* Route Line */}
                <Polyline
                    positions={[
                        coords.origin,
                        ...(coords.current ? [coords.current] : []),
                        coords.destination
                    ]}
                    color="#2563eb"
                    dashArray="10, 10"
                    weight={3}
                    opacity={0.7}
                />

                <ChangeView bounds={bounds} />
            </MapContainer>
        </div>
    )
}
