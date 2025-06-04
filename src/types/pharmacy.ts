export interface PharmacyLocation {
  id: string;
  name: string;
  address: string;
  phone: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  hours: {
    weekdays: string;
    saturday: string;
    sunday: string;
  };
  services: string[];
  distance?: number; // 距离用户的距离（公里）
  isOpen24Hours: boolean;
  website?: string;
  email?: string;
  description?: string;
}

export interface PharmacySearchParams {
  query?: string;
  userLocation?: {
    lat: number;
    lng: number;
  };
  radius?: number; // 搜索半径（公里）
  services?: string[];
  isOpen24Hours?: boolean;
} 