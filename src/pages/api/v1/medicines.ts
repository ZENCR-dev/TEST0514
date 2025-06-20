import { NextApiRequest, NextApiResponse } from 'next';
import { mockMedicines } from '@/mocks/medicineData';

interface ApiResponse {
  success: boolean;
  data: any;
  meta?: {
    pagination?: {
      page: number;
      limit: number;
      totalItems: number;
      totalPages: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    };
    timestamp: string;
  };
}

export default function handler(req: NextApiRequest, res: NextApiResponse<ApiResponse>) {
  const startTime = Date.now();

  if (req.method === 'GET') {
    try {
      const { 
        page = '1', 
        limit = '20', 
        search,
        category,
        sortBy = 'chineseName',
        sortOrder = 'asc'
      } = req.query;

      const pageNum = parseInt(page as string);
      const limitNum = parseInt(limit as string);
      const offset = (pageNum - 1) * limitNum;

      // 筛选逻辑
      let filteredMedicines = mockMedicines;

      // 搜索筛选
      if (search && typeof search === 'string') {
        const searchTerm = search.toLowerCase();
        filteredMedicines = filteredMedicines.filter(medicine => 
          medicine.chineseName.toLowerCase().includes(searchTerm) ||
          medicine.englishName.toLowerCase().includes(searchTerm) ||
          medicine.pinyinName.toLowerCase().includes(searchTerm) ||
          medicine.description?.toLowerCase().includes(searchTerm)
        );
      }

      // 分类筛选
      if (category && typeof category === 'string') {
        filteredMedicines = filteredMedicines.filter(medicine => 
          medicine.category === category
        );
      }

      // 排序逻辑
      filteredMedicines.sort((a, b) => {
        let aValue: any;
        let bValue: any;

        switch (sortBy) {
          case 'price':
            aValue = a.basePrice || 0;
            bValue = b.basePrice || 0;
            break;
          case 'category':
            aValue = a.category || '';
            bValue = b.category || '';
            break;
          case 'chineseName':
          default:
            aValue = a.chineseName || '';
            bValue = b.chineseName || '';
            break;
        }

        if (typeof aValue === 'string') {
          aValue = aValue.toLowerCase();
          bValue = bValue.toLowerCase();
        }

        if (sortOrder === 'desc') {
          return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
        } else {
          return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
        }
      });

      const totalItems = filteredMedicines.length;
      const totalPages = Math.ceil(totalItems / limitNum);
      const paginatedMedicines = filteredMedicines.slice(offset, offset + limitNum);

      const endTime = Date.now();
      const processingTime = endTime - startTime;

      // 模拟真实API的性能特征
      console.log(`[API] GET /api/v1/medicines - ${processingTime}ms - ${paginatedMedicines.length} items`);

      const response: ApiResponse = {
        success: true,
        data: paginatedMedicines,
        meta: {
          pagination: {
            page: pageNum,
            limit: limitNum,
            totalItems,
            totalPages,
            hasNextPage: pageNum < totalPages,
            hasPrevPage: pageNum > 1
          },
          timestamp: new Date().toISOString()
        }
      };

      res.status(200).json(response);
    } catch (error) {
      console.error('[API Error]', error);
      res.status(500).json({
        success: false,
        data: null,
        meta: {
          timestamp: new Date().toISOString()
        }
      });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).json({
      success: false,
      data: null
    });
  }
} 