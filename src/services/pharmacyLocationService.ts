import { PharmacyLocation, PharmacySearchParams } from '@/types/pharmacy';
import { mockPharmacies, calculateDistance } from '@/mocks/pharmacyData';

// 模拟API延迟
const mockDelay = (ms: number = 500) => new Promise(resolve => setTimeout(resolve, ms));

export class PharmacyLocationService {
  // 搜索药房
  static async searchPharmacies(params: PharmacySearchParams): Promise<PharmacyLocation[]> {
    await mockDelay();
    
    let results = [...mockPharmacies];
    
    // 基于查询关键词过滤
    if (params.query && params.query.trim()) {
      const query = params.query.toLowerCase().trim();
      results = results.filter(pharmacy => 
        pharmacy.name.toLowerCase().includes(query) ||
        pharmacy.address.toLowerCase().includes(query) ||
        pharmacy.services.some(service => service.toLowerCase().includes(query))
      );
    }
    
    // 基于服务过滤
    if (params.services && params.services.length > 0) {
      results = results.filter(pharmacy =>
        params.services!.some(service => pharmacy.services.includes(service))
      );
    }
    
    // 基于24小时营业过滤
    if (params.isOpen24Hours) {
      results = results.filter(pharmacy => pharmacy.isOpen24Hours);
    }
    
    // 计算距离并过滤半径范围
    if (params.userLocation) {
      results = results.map(pharmacy => ({
        ...pharmacy,
        distance: calculateDistance(
          params.userLocation!.lat,
          params.userLocation!.lng,
          pharmacy.coordinates.lat,
          pharmacy.coordinates.lng
        )
      }));
      
      // 按半径过滤
      if (params.radius) {
        results = results.filter(pharmacy => 
          pharmacy.distance !== undefined && pharmacy.distance <= params.radius!
        );
      }
      
      // 按距离排序
      results.sort((a, b) => (a.distance || 0) - (b.distance || 0));
    }
    
    return results;
  }
  
  // 获取附近药房（快捷方法）
  static async getNearbyPharmacies(
    userLocation: { lat: number; lng: number },
    radius: number = 50
  ): Promise<PharmacyLocation[]> {
    return this.searchPharmacies({
      userLocation,
      radius
    });
  }
  
  // 根据ID获取药房详情
  static async getPharmacyById(id: string): Promise<PharmacyLocation | null> {
    await mockDelay(200);
    return mockPharmacies.find(pharmacy => pharmacy.id === id) || null;
  }
  
  // 获取所有可用服务类型
  static getAvailableServices(): string[] {
    const allServices = new Set<string>();
    mockPharmacies.forEach(pharmacy => {
      pharmacy.services.forEach(service => allServices.add(service));
    });
    return Array.from(allServices).sort();
  }
  
  // 模拟地址搜索（地理编码）
  static async searchAddresses(query: string): Promise<Array<{
    address: string;
    coordinates: { lat: number; lng: number };
  }>> {
    await mockDelay(300);
    
    // 模拟地址搜索结果
    const mockAddresses = [
      { address: 'Auckland Central, Auckland', coordinates: { lat: -36.8485, lng: 174.7633 } },
      { address: 'Wellington Central, Wellington', coordinates: { lat: -41.2865, lng: 174.7762 } },
      { address: 'Christchurch Central, Christchurch', coordinates: { lat: -43.5321, lng: 172.6362 } },
      { address: 'Hamilton Central, Hamilton', coordinates: { lat: -37.7870, lng: 175.2793 } },
      { address: 'Dunedin Central, Dunedin', coordinates: { lat: -45.8788, lng: 170.5028 } },
    ];
    
    if (!query.trim()) return [];
    
    return mockAddresses.filter(item =>
      item.address.toLowerCase().includes(query.toLowerCase())
    );
  }
} 