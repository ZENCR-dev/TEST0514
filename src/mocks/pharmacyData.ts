import { PharmacyLocation } from '@/types/pharmacy';

export const mockPharmacies: PharmacyLocation[] = [
  {
    id: 'pharmacy_001',
    name: 'HealthSmart Pharmacy Auckland Central',
    address: '123 Queen Street, Auckland Central, Auckland 1010',
    phone: '+64 9 123 4567',
    coordinates: { lat: -36.8485, lng: 174.7633 },
    hours: {
      weekdays: '8:00 AM - 8:00 PM',
      saturday: '9:00 AM - 6:00 PM',
      sunday: '10:00 AM - 5:00 PM'
    },
    services: ['处方配药', '中药配制', '健康咨询', '血压测量'],
    isOpen24Hours: false,
    website: 'https://healthsmart.co.nz',
    email: 'central@healthsmart.co.nz',
    description: '位于奥克兰市中心的专业药房，提供中西医结合服务'
  },
  {
    id: 'pharmacy_002',
    name: 'Life Pharmacy Newmarket',
    address: '456 Broadway, Newmarket, Auckland 1023',
    phone: '+64 9 234 5678',
    coordinates: { lat: -36.8683, lng: 174.7797 },
    hours: {
      weekdays: '7:00 AM - 10:00 PM',
      saturday: '8:00 AM - 10:00 PM',
      sunday: '8:00 AM - 9:00 PM'
    },
    services: ['处方配药', '中药配制', '疫苗接种', '健康检查'],
    isOpen24Hours: false,
    website: 'https://lifepharmacy.co.nz',
    email: 'newmarket@lifepharmacy.co.nz',
    description: 'Newmarket地区领先的社区药房，中医处方服务经验丰富'
  },
  {
    id: 'pharmacy_003',
    name: 'Chemist Warehouse Sylvia Park',
    address: '286 Mount Wellington Highway, Sylvia Park, Auckland 1060',
    phone: '+64 9 345 6789',
    coordinates: { lat: -36.9069, lng: 174.8492 },
    hours: {
      weekdays: '8:00 AM - 9:00 PM',
      saturday: '8:00 AM - 9:00 PM',
      sunday: '9:00 AM - 8:00 PM'
    },
    services: ['处方配药', '中药配制', '美容护理', '营养补充'],
    isOpen24Hours: false,
    website: 'https://chemistwarehouse.co.nz',
    email: 'sylviapark@chemistwarehouse.co.nz',
    description: '大型连锁药房，价格优惠，中药配制服务完善'
  },
  {
    id: 'pharmacy_004',
    name: 'Auckland City Pharmacy 24H',
    address: '789 Karangahape Road, Auckland Central, Auckland 1010',
    phone: '+64 9 456 7890',
    coordinates: { lat: -36.8580, lng: 174.7614 },
    hours: {
      weekdays: '24小时营业',
      saturday: '24小时营业',
      sunday: '24小时营业'
    },
    services: ['处方配药', '中药配制', '急诊配药', '24小时服务'],
    isOpen24Hours: true,
    website: 'https://aucklandcitypharmacy.co.nz',
    email: 'info@aucklandcitypharmacy.co.nz',
    description: '奥克兰唯一24小时营业的中医药房，紧急处方配制'
  },
  {
    id: 'pharmacy_005',
    name: 'UniChem Ponsonby Pharmacy',
    address: '321 Ponsonby Road, Ponsonby, Auckland 1011',
    phone: '+64 9 567 8901',
    coordinates: { lat: -36.8557, lng: 174.7327 },
    hours: {
      weekdays: '8:30 AM - 7:00 PM',
      saturday: '9:00 AM - 5:00 PM',
      sunday: '关闭'
    },
    services: ['处方配药', '中药配制', '健康咨询', '老年护理'],
    isOpen24Hours: false,
    website: 'https://unichem.co.nz',
    email: 'ponsonby@unichem.co.nz',
    description: 'Ponsonby社区药房，专注于个性化中医处方服务'
  },
  {
    id: 'pharmacy_006',
    name: 'Discount Drug Stores Albany',
    address: '123 Don McKinnon Drive, Albany, Auckland 0632',
    phone: '+64 9 678 9012',
    coordinates: { lat: -36.7283, lng: 174.7024 },
    hours: {
      weekdays: '8:00 AM - 8:00 PM',
      saturday: '8:00 AM - 6:00 PM',
      sunday: '9:00 AM - 6:00 PM'
    },
    services: ['处方配药', '中药配制', '家庭护理', '婴幼儿用品'],
    isOpen24Hours: false,
    website: 'https://dds.co.nz',
    email: 'albany@dds.co.nz',
    description: '北岸Albany地区知名药房，提供优质中医处方服务'
  },
  {
    id: 'pharmacy_007',
    name: 'Life Pharmacy Wellington Central',
    address: '456 Lambton Quay, Wellington Central, Wellington 6011',
    phone: '+64 4 123 4567',
    coordinates: { lat: -41.2865, lng: 174.7762 },
    hours: {
      weekdays: '7:30 AM - 8:00 PM',
      saturday: '8:00 AM - 7:00 PM',
      sunday: '9:00 AM - 6:00 PM'
    },
    services: ['处方配药', '中药配制', '旅行健康', '疫苗接种'],
    isOpen24Hours: false,
    website: 'https://lifepharmacy.co.nz',
    email: 'wellington@lifepharmacy.co.nz',
    description: '惠灵顿市中心首选药房，中医处方配制专业快速'
  },
  {
    id: 'pharmacy_008',
    name: 'Christchurch Traditional Medicine Pharmacy',
    address: '789 Colombo Street, Christchurch Central, Christchurch 8013',
    phone: '+64 3 234 5678',
    coordinates: { lat: -43.5321, lng: 172.6362 },
    hours: {
      weekdays: '8:00 AM - 7:00 PM',
      saturday: '9:00 AM - 5:00 PM',
      sunday: '10:00 AM - 4:00 PM'
    },
    services: ['处方配药', '中药配制', '针灸用品', '传统中医咨询'],
    isOpen24Hours: false,
    website: 'https://ctmp.co.nz',
    email: 'info@ctmp.co.nz',
    description: '基督城专业中医药房，传统配制工艺，品质保证'
  },
  {
    id: 'pharmacy_009',
    name: 'Dunedin Health Pharmacy',
    address: '321 George Street, Dunedin Central, Dunedin 9016',
    phone: '+64 3 345 6789',
    coordinates: { lat: -45.8788, lng: 170.5028 },
    hours: {
      weekdays: '8:30 AM - 6:00 PM',
      saturday: '9:00 AM - 4:00 PM',
      sunday: '关闭'
    },
    services: ['处方配药', '中药配制', '学生健康', '慢性病管理'],
    isOpen24Hours: false,
    website: 'https://dunedinhealth.co.nz',
    email: 'central@dunedinhealth.co.nz',
    description: '但尼丁大学城药房，为学生和居民提供中医处方服务'
  },
  {
    id: 'pharmacy_010',
    name: 'Hamilton East Pharmacy',
    address: '654 Grey Street, Hamilton East, Hamilton 3216',
    phone: '+64 7 456 7890',
    coordinates: { lat: -37.7870, lng: 175.2793 },
    hours: {
      weekdays: '8:00 AM - 7:00 PM',
      saturday: '8:00 AM - 5:00 PM',
      sunday: '9:00 AM - 4:00 PM'
    },
    services: ['处方配药', '中药配制', '妇幼保健', '老年护理'],
    isOpen24Hours: false,
    website: 'https://hamiltoneast.pharmacy.co.nz',
    email: 'info@hamiltoneast.pharmacy.co.nz',
    description: '汉密尔顿东区社区药房，中医妇科和儿科处方特色服务'
  },
  {
    id: 'pharmacy_011',
    name: 'Tauranga Bay Pharmacy',
    address: '987 Cameron Road, Tauranga, Bay of Plenty 3110',
    phone: '+64 7 567 8901',
    coordinates: { lat: -37.6878, lng: 176.1651 },
    hours: {
      weekdays: '8:00 AM - 8:00 PM',
      saturday: '8:00 AM - 6:00 PM',
      sunday: '9:00 AM - 5:00 PM'
    },
    services: ['处方配药', '中药配制', '度假健康', '皮肤护理'],
    isOpen24Hours: false,
    website: 'https://taurangabay.pharmacy.co.nz',
    email: 'cameron@taurangabay.pharmacy.co.nz',
    description: '陶朗加度假胜地药房，为游客和居民提供便利的中医服务'
  },
  {
    id: 'pharmacy_012',
    name: 'Napier Central Pharmacy',
    address: '135 Emerson Street, Napier Central, Napier 4110',
    phone: '+64 6 678 9012',
    coordinates: { lat: -39.4928, lng: 176.9120 },
    hours: {
      weekdays: '8:30 AM - 6:30 PM',
      saturday: '9:00 AM - 4:00 PM',
      sunday: '关闭'
    },
    services: ['处方配药', '中药配制', '血压监测', '糖尿病护理'],
    isOpen24Hours: false,
    website: 'https://napiercentral.pharmacy.co.nz',
    email: 'central@napiercentral.pharmacy.co.nz',
    description: '纳皮尔市中心药房，慢性病中医调理处方经验丰富'
  },
  {
    id: 'pharmacy_013',
    name: 'Palmerston North University Pharmacy',
    address: '246 Broadway Avenue, Palmerston North 4410',
    phone: '+64 6 789 0123',
    coordinates: { lat: -40.3523, lng: 175.6082 },
    hours: {
      weekdays: '8:00 AM - 8:00 PM',
      saturday: '9:00 AM - 5:00 PM',
      sunday: '10:00 AM - 4:00 PM'
    },
    services: ['处方配药', '中药配制', '学生健康', '心理健康支持'],
    isOpen24Hours: false,
    website: 'https://pnuni.pharmacy.co.nz',
    email: 'broadway@pnuni.pharmacy.co.nz',
    description: '北帕默斯顿大学区药房，专注学生健康和中医调理'
  },
  {
    id: 'pharmacy_014',
    name: 'Rotorua Wellness Pharmacy',
    address: '369 Fenton Street, Rotorua 3010',
    phone: '+64 7 890 1234',
    coordinates: { lat: -38.1368, lng: 176.2497 },
    hours: {
      weekdays: '8:00 AM - 7:00 PM',
      saturday: '8:00 AM - 6:00 PM',
      sunday: '9:00 AM - 5:00 PM'
    },
    services: ['处方配药', '中药配制', '温泉疗养', '关节护理'],
    isOpen24Hours: false,
    website: 'https://rotoruawellness.co.nz',
    email: 'fenton@rotoruawellness.co.nz',
    description: '罗托鲁阿温泉城药房，结合温泉疗法的中医处方服务'
  },
  {
    id: 'pharmacy_015',
    name: 'Nelson Coastal Pharmacy',
    address: '159 Trafalgar Street, Nelson 7010',
    phone: '+64 3 901 2345',
    coordinates: { lat: -41.2706, lng: 173.2840 },
    hours: {
      weekdays: '8:30 AM - 6:00 PM',
      saturday: '9:00 AM - 4:00 PM',
      sunday: '关闭'
    },
    services: ['处方配药', '中药配制', '海洋疗法', '户外健康'],
    isOpen24Hours: false,
    website: 'https://nelsoncoastal.pharmacy.co.nz',
    email: 'trafalgar@nelsoncoastal.pharmacy.co.nz',
    description: '尼尔森海滨城市药房，提供户外活动者的中医健康支持'
  }
];

// 计算两点之间的距离（公里）
export const calculateDistance = (
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number => {
  const R = 6371; // 地球半径（公里）
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}; 