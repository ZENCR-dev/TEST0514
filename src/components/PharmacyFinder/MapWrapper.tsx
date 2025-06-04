import React from 'react';
import dynamic from 'next/dynamic';
import { PharmacyLocation } from '@/types/pharmacy';
import { MapPin } from 'lucide-react';

// 动态导入LeafletMap组件，禁用SSR
const LeafletMapDynamic = dynamic(
  () => import('./LeafletMap'),
  { 
    ssr: false,
    loading: () => (
      <div className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center">
        <div className="text-center text-gray-500">
          <MapPin className="h-8 w-8 mx-auto mb-2 animate-pulse" />
          <p>正在加载地图...</p>
        </div>
      </div>
    )
  }
);

interface MapWrapperProps {
  pharmacies: PharmacyLocation[];
  userLocation?: { lat: number; lng: number };
  onPharmacySelect?: (pharmacy: PharmacyLocation) => void;
  selectedPharmacyId?: string;
  className?: string;
}

const MapWrapper: React.FC<MapWrapperProps> = (props) => {
  return <LeafletMapDynamic {...props} />;
};

export default MapWrapper; 