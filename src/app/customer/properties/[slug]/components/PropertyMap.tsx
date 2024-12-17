'use client'

import { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import { MapPin } from 'lucide-react'
import { renderToString } from 'react-dom/server'
import 'leaflet/dist/leaflet.css'

interface PropertyMapProps {
    latitude: number
    longitude: number
}

export default function PropertyMap({ latitude, longitude }: PropertyMapProps) {
    useEffect(() => {
        // This is needed to re-render the map when the component mounts on the client
        window.dispatchEvent(new Event('resize'))
    }, [])

    console.log(latitude, longitude)

    return (
        <div className="h-96 w-full rounded-lg overflow-hidden">
            <MapContainer center={[latitude, longitude]} zoom={13} style={{ height: '100%', width: '100%' }}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <Marker
                    position={[latitude, longitude]}
                    icon={L.divIcon({
                        html: renderToString(<MapPin size={30} color="#FF0000" />),
                        className: 'custom-icon',
                        iconSize: [30, 30],
                        iconAnchor: [15, 30]
                    })}
                >
                    <Popup>
                        Ubicación de la propiedad
                    </Popup>
                </Marker>
            </MapContainer>
        </div>
    )
}
