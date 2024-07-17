/** @format */

import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';

interface MapProps {
  latLng: { lat: number; lng: number } | null;
  address: string | null;
}

const Map: React.FC<MapProps> = ({ latLng, address }) => {
  return (
    <div className='h-64 w-full mt-4'>
      {latLng && (
        <MapContainer
          center={latLng}
          zoom={13}
          className='h-full w-full'>
          <TileLayer
            url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <Marker position={latLng}>
            <Popup>{address}</Popup>
          </Marker>
        </MapContainer>
      )}
    </div>
  );
};

export default Map;
