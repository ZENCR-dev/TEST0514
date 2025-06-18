/**
 * SKU 生成和转换工具
 * 基于后端团队确认的拼音首字母格式
 * 
 * @version 1.0
 * @date 2025-01-21
 */

/**
 * 中文转拼音首字母映射表
 * 基于常用中药名称的拼音
 */
const PINYIN_INITIALS_MAP: Record<string, string> = {
  // 常用中药拼音首字母映射
  '当归': 'DG',
  '川芎': 'CX', 
  '熟地黄': 'SDH',
  '生地黄': 'SDH',
  '白芍': 'BS',
  '人参': 'RS',
  '党参': 'DS',
  '西洋参': 'XYS',
  '红参': 'HS',
  '甘草': 'GC',
  '白术': 'BZ',
  '茯苓': 'FL',
  '山药': 'SY',
  '陈皮': 'CP',
  '半夏': 'BX',
  '黄连': 'HL',
  '金银花': 'JYH',
  '连翘': 'LQ',
  '板蓝根': 'BLG',
  '栀子': 'ZZ',
  '龙胆草': 'LDC',
  '薄荷': 'BH',
  '防风': 'FF',
  '羌活': 'QH',
  '独活': 'DH',
  '蔓荆子': 'MJZ',
  '藁本': 'GB',
  '苍术': 'CZ',
  '厚朴': 'HP',
  '草豆蔻': 'CDK',
  '藿香': 'HX',
  '佩兰': 'PL',
  '天南星': 'TNX',
  '瓜蒌': 'GL',
  '桔梗': 'JG',
  '枳实': 'ZS',
  '青皮': 'QP',
  '木香': 'MX',
  '香附': 'XF',
  '何首乌': 'HSW',
  '阿胶': 'EJ',
  '北沙参': 'BSS',
  '麦冬': 'MD',
  '天门冬': 'TMD',
  '石斛': 'SH',
  '玉竹': 'YZ',
  '枸杞子': 'GQZ',
  '鹿茸': 'LR',
  '淫羊藿': 'YYH',
  '巴戟天': 'BJT',
  '杜仲': 'DZ',
  '补骨脂': 'BGZ',
  '肉苁蓉': 'RCR'
};

/**
 * 拼音转首字母
 * @param pinyin 拼音字符串
 * @returns 首字母大写字符串
 */
function extractInitialsFromPinyin(pinyin: string): string {
  // 移除声调和分隔符，分割成单个拼音
  const cleanPinyin = pinyin.toLowerCase().replace(/[0-9\s\-_]/g, '');
  
  // 简单的拼音首字母提取
  const syllables = cleanPinyin.match(/[a-z]+/g) || [];
  const initials = syllables.map(syllable => syllable.charAt(0).toUpperCase()).join('');
  
  return initials;
}

/**
 * 生成 SKU 代码
 * @param chineseName 中文名称
 * @param pinyinName 拼音名称
 * @returns SKU 代码
 */
export function generateSku(chineseName: string, pinyinName: string): string {
  // 首先检查是否有预定义的映射
  if (PINYIN_INITIALS_MAP[chineseName]) {
    return PINYIN_INITIALS_MAP[chineseName];
  }
  
  // 如果没有预定义映射，从拼音提取首字母
  const initials = extractInitialsFromPinyin(pinyinName);
  
  // 确保 SKU 长度在 1-4 个字符之间
  if (initials.length > 4) {
    return initials.substring(0, 4);
  }
  
  if (initials.length === 0) {
    // 如果无法提取首字母，使用中文名的第一个字符的拼音首字母
    const firstChar = chineseName.charAt(0);
    return firstChar.charCodeAt(0).toString(36).toUpperCase().substring(0, 2);
  }
  
  return initials;
}

/**
 * 验证 SKU 格式
 * @param sku SKU 代码
 * @returns 是否符合格式要求
 */
export function validateSkuFormat(sku: string): boolean {
  const skuPattern = /^[A-Z]{1,4}$/;
  return skuPattern.test(sku);
}

/**
 * 检查 SKU 是否重复
 * @param sku 要检查的 SKU
 * @param existingSkus 已存在的 SKU 列表
 * @returns 是否重复
 */
export function isSkuDuplicate(sku: string, existingSkus: string[]): boolean {
  return existingSkus.includes(sku);
}

/**
 * 解决 SKU 冲突
 * @param baseSku 基础 SKU
 * @param existingSkus 已存在的 SKU 列表
 * @returns 不冲突的 SKU
 */
export function resolveSkuConflict(baseSku: string, existingSkus: string[]): string {
  let resolvedSku = baseSku;
  let suffix = 1;
  
  while (isSkuDuplicate(resolvedSku, existingSkus)) {
    // 如果 SKU 长度允许，添加数字后缀
    if (baseSku.length < 4) {
      resolvedSku = baseSku + suffix;
    } else {
      // 如果 SKU 已经是 4 位，替换最后一位为数字
      resolvedSku = baseSku.substring(0, 3) + suffix;
    }
    suffix++;
    
    // 防止无限循环
    if (suffix > 99) {
      throw new Error(`无法为 SKU ${baseSku} 解决冲突`);
    }
  }
  
  return resolvedSku;
}

/**
 * 批量生成 SKU
 * @param medicines 药品列表（包含中文名和拼音名）
 * @returns 包含 SKU 的药品列表
 */
export function batchGenerateSkus(medicines: Array<{chineseName: string, pinyinName: string}>): Array<{chineseName: string, pinyinName: string, sku: string}> {
  const existingSkus: string[] = [];
  
  return medicines.map(medicine => {
    const baseSku = generateSku(medicine.chineseName, medicine.pinyinName);
    const finalSku = resolveSkuConflict(baseSku, existingSkus);
    existingSkus.push(finalSku);
    
    return {
      ...medicine,
      sku: finalSku
    };
  });
}

/**
 * 从旧格式 SKU 转换为新格式
 * @param oldSku 旧格式 SKU (如 "TCM-DG-001")
 * @param chineseName 中文名称
 * @param pinyinName 拼音名称
 * @returns 新格式 SKU (如 "DG")
 */
export function convertLegacySku(oldSku: string, chineseName: string, pinyinName: string): string {
  // 如果已经是新格式，直接返回
  if (validateSkuFormat(oldSku)) {
    return oldSku;
  }
  
  // 尝试从旧格式中提取有用信息
  const match = oldSku.match(/TCM-([A-Z]+)-/);
  if (match && match[1]) {
    const extractedSku = match[1];
    if (validateSkuFormat(extractedSku)) {
      return extractedSku;
    }
  }
  
  // 如果无法从旧格式提取，重新生成
  return generateSku(chineseName, pinyinName);
} 