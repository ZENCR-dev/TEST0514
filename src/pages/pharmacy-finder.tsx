import React, { useState, useEffect, useCallback } from 'react';
import Head from 'next/head';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Search, List, Map, Phone, Clock, Filter } from 'lucide-react';
import MapWrapper from '@/components/PharmacyFinder/MapWrapper';
import PharmacyList from '@/components/PharmacyFinder/PharmacyList';
import { PharmacyLocation } from '@/types/pharmacy';
import { PharmacyLocationService } from '@/services/pharmacyLocationService';

const PharmacyFinderPage = () => {
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
  const [searchQuery, setSearchQuery] = useState('');
  const [userLocation, setUserLocation] = useState<{lat: number; lng: number} | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [pharmacies, setPharmacies] = useState<PharmacyLocation[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedPharmacy, setSelectedPharmacy] = useState<PharmacyLocation | null>(null);
  const [error, setError] = useState<string | null>(null);

  // 获取用户当前位置
  const getUserLocation = useCallback(() => {
    setIsLocating(true);
    setError(null);
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setUserLocation(location);
          setIsLocating(false);
          
          // 自动搜索附近药房
          searchNearbyPharmacies(location);
        },
        (error) => {
          console.error('获取位置失败:', error);
          setIsLocating(false);
          
          // 根据错误类型显示不同消息
          switch (error.code) {
            case error.PERMISSION_DENIED:
              setError('位置权限被拒绝，已使用默认位置（奥克兰市中心）');
              break;
            case error.POSITION_UNAVAILABLE:
              setError('位置信息不可用，已使用默认位置（奥克兰市中心）');
              break;
            case error.TIMEOUT:
              setError('获取位置超时，已使用默认位置（奥克兰市中心）');
              break;
            default:
              setError('无法获取位置，已使用默认位置（奥克兰市中心）');
              break;
          }
          
          // 默认设置为奥克兰市中心
          const defaultLocation = { lat: -36.8485, lng: 174.7633 };
          setUserLocation(defaultLocation);
          searchNearbyPharmacies(defaultLocation);
        },
        {
          timeout: 10000,
          enableHighAccuracy: false
        }
      );
    } else {
      setIsLocating(false);
      setError('浏览器不支持地理定位，已使用默认位置（奥克兰市中心）');
      
      // 默认设置为奥克兰市中心
      const defaultLocation = { lat: -36.8485, lng: 174.7633 };
      setUserLocation(defaultLocation);
      searchNearbyPharmacies(defaultLocation);
    }
  }, []);

  // 搜索附近药房
  const searchNearbyPharmacies = useCallback(async (location: {lat: number; lng: number}) => {
    setLoading(true);
    setError(null);
    
    try {
      const results = await PharmacyLocationService.getNearbyPharmacies(location, 50);
      setPharmacies(results);
    } catch (err) {
      console.error('搜索药房失败:', err);
      setError('搜索药房失败，请稍后重试');
      setPharmacies([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // 执行搜索
  const handleSearch = useCallback(async () => {
    if (!searchQuery.trim() && !userLocation) {
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const results = await PharmacyLocationService.searchPharmacies({
        query: searchQuery.trim() || undefined,
        userLocation: userLocation || undefined,
        radius: 50
      });
      setPharmacies(results);
    } catch (err) {
      console.error('搜索失败:', err);
      setError('搜索失败，请稍后重试');
      setPharmacies([]);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, userLocation]);

  // 处理搜索输入变化
  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // 处理搜索提交
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch();
  };

  // 处理药房选择
  const handlePharmacySelect = (pharmacy: PharmacyLocation) => {
    setSelectedPharmacy(pharmacy);
    // 在地图模式下，可以考虑切换到地图视图并居中到选中的药房
    if (viewMode === 'list') {
      setViewMode('map');
    }
  };

  // 处理导航请求
  const handleGetDirections = (pharmacy: PharmacyLocation) => {
    // 这个功能在PharmacyList组件中已经实现
    console.log('获取导航到:', pharmacy.name);
  };

  // 初始化
  useEffect(() => {
    getUserLocation();
  }, [getUserLocation]);

  // 键盘快捷键：Enter搜索
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && document.activeElement?.tagName === 'INPUT') {
        handleSearch();
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleSearch]);

  return (
    <>
      <Head>
        <title>药房查找 - 新西兰中医处方平台</title>
        <meta name="description" content="查找附近的合作药房，获取中医处方药品" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* 测试版本标识 */}
        <div className="bg-orange-100 border-b border-orange-200 px-4 py-2 text-center text-sm text-orange-800">
          ⚠️ 测试版本 - 仅供演示使用，数据均为模拟数据
        </div>

        {/* 移动端标题栏 */}
        <div className="bg-white shadow-sm border-b px-4 py-3 md:hidden">
          <h1 className="text-lg font-semibold text-gray-900">查找药房</h1>
        </div>

        {/* 桌面端标题 */}
        <div className="hidden md:block bg-white shadow-sm border-b px-6 py-4">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-900">药房查找</h1>
            <p className="text-gray-600 mt-1">查找附近的合作药房，获取处方药品</p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          {/* 搜索栏 */}
          <Card className="mb-4">
            <CardContent className="p-4">
              <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="输入地址、邮编或药房名称..."
                    value={searchQuery}
                    onChange={handleSearchInputChange}
                    className="pl-10"
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    type="submit"
                    disabled={loading}
                    className="shrink-0"
                  >
                    <Search className="h-4 w-4 mr-2" />
                    {loading ? '搜索中...' : '搜索'}
                  </Button>
                  <Button
                    type="button"
                    onClick={getUserLocation}
                    disabled={isLocating}
                    variant="outline"
                    className="shrink-0"
                  >
                    <MapPin className="h-4 w-4 mr-2" />
                    {isLocating ? '定位中...' : '当前位置'}
                  </Button>
                </div>
              </form>
              
              {/* 错误信息 */}
              {error && (
                <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                  <p className="text-sm text-yellow-800">{error}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* 视图切换按钮 */}
          <div className="flex justify-center mb-4">
            <div className="bg-white rounded-lg shadow-sm border p-1 flex">
              <Button
                variant={viewMode === 'map' ? 'default' : 'ghost'}
                onClick={() => setViewMode('map')}
                className="flex items-center gap-2 px-4 py-2"
                size="sm"
              >
                <Map className="h-4 w-4" />
                地图
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                onClick={() => setViewMode('list')}
                className="flex items-center gap-2 px-4 py-2"
                size="sm"
              >
                <List className="h-4 w-4" />
                列表
              </Button>
            </div>
          </div>

          {/* 主要内容区域 */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* 地图或列表视图 */}
            <div className={`${viewMode === 'map' ? 'lg:col-span-2' : 'lg:col-span-3'}`}>
              {viewMode === 'map' ? (
                <Card className="h-96 lg:h-[600px]">
                  <CardContent className="p-0 h-full">
                    <MapWrapper
                      pharmacies={pharmacies}
                      userLocation={userLocation || undefined}
                      onPharmacySelect={handlePharmacySelect}
                      selectedPharmacyId={selectedPharmacy?.id}
                      className="h-full"
                    />
                  </CardContent>
                </Card>
              ) : (
                <PharmacyList
                  pharmacies={pharmacies}
                  onPharmacySelect={handlePharmacySelect}
                  onGetDirections={handleGetDirections}
                  loading={loading}
                  emptyMessage={searchQuery ? "未找到匹配的药房" : "请搜索或获取当前位置以查看附近药房"}
                />
              )}
            </div>

            {/* 侧边栏（桌面端，地图模式时显示） */}
            {viewMode === 'map' && (
              <div className="hidden lg:block">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <MapPin className="h-5 w-5" />
                      附近药房
                      {pharmacies.length > 0 && (
                        <span className="text-sm font-normal text-gray-500">
                          ({pharmacies.length}家)
                        </span>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="max-h-[500px] overflow-y-auto">
                      <PharmacyList
                        pharmacies={pharmacies.slice(0, 5)} // 侧边栏只显示前5个
                        onPharmacySelect={handlePharmacySelect}
                        onGetDirections={handleGetDirections}
                        loading={loading}
                        emptyMessage="暂无药房数据"
                      />
                    </div>
                    {pharmacies.length > 5 && (
                      <div className="p-4 border-t">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setViewMode('list')}
                          className="w-full"
                        >
                          查看全部 {pharmacies.length} 家药房
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default PharmacyFinderPage; 