import React from 'react';
import { PharmacyLocation } from '@/types/pharmacy';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Phone, Clock, ExternalLink, Navigation } from 'lucide-react';

interface PharmacyCardProps {
  pharmacy: PharmacyLocation;
  onSelect?: (pharmacy: PharmacyLocation) => void;
  onGetDirections?: (pharmacy: PharmacyLocation) => void;
}

const PharmacyCard: React.FC<PharmacyCardProps> = ({ 
  pharmacy, 
  onSelect, 
  onGetDirections 
}) => {
  const handleGetDirections = () => {
    // 打开Google Maps导航
    const query = encodeURIComponent(pharmacy.address);
    const url = `https://www.google.com/maps/search/?api=1&query=${query}`;
    window.open(url, '_blank');
    
    if (onGetDirections) {
      onGetDirections(pharmacy);
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-4">
        <div className="space-y-3">
          {/* 药房名称和距离 */}
          <div className="flex items-start justify-between gap-3">
            <h3 className="font-semibold text-lg text-gray-900 leading-tight">
              {pharmacy.name}
            </h3>
            {pharmacy.distance && (
              <span className="text-sm font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded shrink-0">
                {pharmacy.distance.toFixed(1)}km
              </span>
            )}
          </div>
          
          {/* 地址 */}
          <div className="flex items-start gap-2">
            <MapPin className="h-4 w-4 text-gray-500 mt-0.5 shrink-0" />
            <p className="text-sm text-gray-600 leading-relaxed">
              {pharmacy.address}
            </p>
          </div>
          
          {/* 营业时间 */}
          <div className="flex items-start gap-2">
            <Clock className="h-4 w-4 text-gray-500 mt-0.5 shrink-0" />
            <div className="text-sm text-gray-600">
              <p>今日: {pharmacy.hours.weekdays}</p>
              {pharmacy.isOpen24Hours && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 mt-1">
                  24小时营业
                </span>
              )}
            </div>
          </div>
          
          {/* 联系方式 */}
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-gray-500 shrink-0" />
            <a 
              href={`tel:${pharmacy.phone}`}
              className="text-sm text-blue-600 hover:underline"
            >
              {pharmacy.phone}
            </a>
          </div>
          
          {/* 服务标签 */}
          <div>
            <div className="flex flex-wrap gap-1">
              {pharmacy.services.slice(0, 4).map((service, index) => (
                <span 
                  key={index}
                  className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded"
                >
                  {service}
                </span>
              ))}
              {pharmacy.services.length > 4 && (
                <span className="text-xs text-gray-500 px-2 py-1">
                  +{pharmacy.services.length - 4}个服务
                </span>
              )}
            </div>
          </div>
          
          {/* 描述 */}
          {pharmacy.description && (
            <p className="text-sm text-gray-600 line-clamp-2">
              {pharmacy.description}
            </p>
          )}
          
          {/* 操作按钮 */}
          <div className="flex gap-2 pt-2 border-t border-gray-100">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onSelect?.(pharmacy)}
              className="flex-1"
            >
              查看详情
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleGetDirections}
              className="shrink-0"
            >
              <Navigation className="h-3 w-3 mr-1" />
              导航
            </Button>
            {pharmacy.website && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => window.open(pharmacy.website, '_blank')}
                className="shrink-0"
              >
                <ExternalLink className="h-3 w-3" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

interface PharmacyListProps {
  pharmacies: PharmacyLocation[];
  onPharmacySelect?: (pharmacy: PharmacyLocation) => void;
  onGetDirections?: (pharmacy: PharmacyLocation) => void;
  loading?: boolean;
  emptyMessage?: string;
}

const PharmacyList: React.FC<PharmacyListProps> = ({
  pharmacies,
  onPharmacySelect,
  onGetDirections,
  loading = false,
  emptyMessage = "未找到药房"
}) => {
  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                <div className="flex gap-2">
                  <div className="h-8 bg-gray-200 rounded flex-1"></div>
                  <div className="h-8 bg-gray-200 rounded w-16"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (pharmacies.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <MapPin className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <p className="text-gray-500 text-lg mb-2">{emptyMessage}</p>
          <p className="text-gray-400 text-sm">尝试调整搜索条件或扩大搜索范围</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* 结果统计 */}
      <div className="text-sm text-gray-600 px-1">
        找到 {pharmacies.length} 家药房
        {pharmacies.some(p => p.distance) && (
          <span className="ml-2 text-xs text-gray-500">
            (按距离排序)
          </span>
        )}
      </div>
      
      {/* 药房列表 */}
      {pharmacies.map((pharmacy) => (
        <PharmacyCard
          key={pharmacy.id}
          pharmacy={pharmacy}
          onSelect={onPharmacySelect}
          onGetDirections={onGetDirections}
        />
      ))}
    </div>
  );
};

export default PharmacyList; 