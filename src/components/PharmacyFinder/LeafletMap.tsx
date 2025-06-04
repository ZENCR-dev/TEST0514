import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { PharmacyLocation } from '@/types/pharmacy';
import { MapPin, Phone, Clock, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

// 修复默认标记图标问题（React-Leaflet常见问题）
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// 创建自定义药房图标
const pharmacyIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,' + btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#dc2626" width="32" height="32">
      <path d="M19 8h-2V6c0-1.1-.9-2-2-2H9c-1.1 0-2 .9-2 2v2H5c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-8c0-1.1-.9-2-2-2zM9 6h6v2H9V6zm6 10h-2v2h-2v-2H9v-2h2v-2h2v2h2v2z"/>
    </svg>
  `),
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

// 当前位置图标
const currentLocationIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,' + btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#2563eb" width="24" height="24">
      <circle cx="12" cy="12" r="10" fill="#3b82f6" opacity="0.3"/>
      <circle cx="12" cy="12" r="6" fill="#2563eb"/>
      <circle cx="12" cy="12" r="2" fill="white"/>
    </svg>
  `),
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});

// 地图中心更新组件
const MapCenterUpdater: React.FC<{ center: [number, number]; zoom?: number }> = ({ center, zoom = 13 }) => {
  const map = useMap();
  
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  
  return null;
};

interface LeafletMapProps {
  pharmacies: PharmacyLocation[];
  userLocation?: { lat: number; lng: number };
  onPharmacySelect?: (pharmacy: PharmacyLocation) => void;
  selectedPharmacyId?: string;
  className?: string;
}

const LeafletMap: React.FC<LeafletMapProps> = ({
  pharmacies,
  userLocation,
  onPharmacySelect,
  selectedPharmacyId,
  className = ''
}) => {
  const mapRef = useRef<L.Map>(null);
  const [mapCenter, setMapCenter] = useState<[number, number]>([-36.8485, 174.7633]); // Auckland默认

  // 当用户位置变化时更新地图中心
  useEffect(() => {
    if (userLocation) {
      setMapCenter([userLocation.lat, userLocation.lng]);
    }
  }, [userLocation]);

  // 处理药房点击
  const handlePharmacyClick = (pharmacy: PharmacyLocation) => {
    if (onPharmacySelect) {
      onPharmacySelect(pharmacy);
    }
  };

  return (
    <div className={`relative ${className}`}>
      <MapContainer
        center={mapCenter}
        zoom={13}
        scrollWheelZoom={true}
        className="h-full w-full rounded-lg"
        ref={mapRef}
      >
        <MapCenterUpdater center={mapCenter} />
        
        {/* OpenStreetMap瓦片层 */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* 用户当前位置标记 */}
        {userLocation && (
          <Marker 
            position={[userLocation.lat, userLocation.lng]} 
            icon={currentLocationIcon}
          >
            <Popup>
              <div className="text-center">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="h-4 w-4 text-blue-600" />
                  <span className="font-semibold">您的位置</span>
                </div>
              </div>
            </Popup>
          </Marker>
        )}
        
        {/* 药房标记 */}
        {pharmacies.map((pharmacy) => (
          <Marker
            key={pharmacy.id}
            position={[pharmacy.coordinates.lat, pharmacy.coordinates.lng]}
            icon={pharmacyIcon}
            eventHandlers={{
              click: () => handlePharmacyClick(pharmacy)
            }}
          >
            <Popup>
              <div className="min-w-[280px] max-w-[320px]">
                {/* 药房名称 */}
                <h3 className="font-bold text-lg text-gray-900 mb-2 leading-tight">
                  {pharmacy.name}
                </h3>
                
                {/* 地址 */}
                <div className="flex items-start gap-2 mb-3">
                  <MapPin className="h-4 w-4 text-gray-500 mt-0.5 shrink-0" />
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {pharmacy.address}
                  </p>
                </div>
                
                {/* 距离 */}
                {pharmacy.distance && (
                  <p className="text-sm text-blue-600 font-medium mb-2">
                    距离: {pharmacy.distance.toFixed(1)}公里
                  </p>
                )}
                
                {/* 营业时间 */}
                <div className="flex items-start gap-2 mb-3">
                  <Clock className="h-4 w-4 text-gray-500 mt-0.5 shrink-0" />
                  <div className="text-sm text-gray-600">
                    <p>平日: {pharmacy.hours.weekdays}</p>
                    <p>周六: {pharmacy.hours.saturday}</p>
                    <p>周日: {pharmacy.hours.sunday}</p>
                  </div>
                </div>
                
                {/* 联系电话 */}
                <div className="flex items-center gap-2 mb-3">
                  <Phone className="h-4 w-4 text-gray-500 shrink-0" />
                  <a 
                    href={`tel:${pharmacy.phone}`}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    {pharmacy.phone}
                  </a>
                </div>
                
                {/* 服务标签 */}
                <div className="mb-3">
                  <p className="text-xs text-gray-500 mb-1">提供服务:</p>
                  <div className="flex flex-wrap gap-1">
                    {pharmacy.services.slice(0, 3).map((service, index) => (
                      <span 
                        key={index}
                        className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded"
                      >
                        {service}
                      </span>
                    ))}
                    {pharmacy.services.length > 3 && (
                      <span className="text-xs text-gray-500">
                        +{pharmacy.services.length - 3}个
                      </span>
                    )}
                  </div>
                </div>
                
                {/* 24小时标识 */}
                {pharmacy.isOpen24Hours && (
                  <div className="mb-3">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      24小时营业
                    </span>
                  </div>
                )}
                
                {/* 操作按钮 */}
                <div className="flex gap-2 pt-2 border-t border-gray-200">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handlePharmacyClick(pharmacy)}
                    className="flex-1"
                  >
                    查看详情
                  </Button>
                  {pharmacy.website && (
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => window.open(pharmacy.website, '_blank')}
                      className="shrink-0"
                    >
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      
      {/* 地图加载提示 */}
      {pharmacies.length === 0 && (
        <div className="absolute inset-0 bg-gray-100 rounded-lg flex items-center justify-center">
          <div className="text-center text-gray-500">
            <MapPin className="h-8 w-8 mx-auto mb-2" />
            <p>正在加载药房位置...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeafletMap; 