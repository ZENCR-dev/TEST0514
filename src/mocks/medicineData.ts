/**
 * 中药模拟数据 - 部分示例数据
 * 完整数据集将包含200种常见中药
 */
import { Medicine } from '@/types/medicine';

/**
 * 初始中药数据集（示例10种）
 * 实际应用中将扩展到200种常见中药
 */
export const initialMedicines: Medicine[] = [
  {
    id: "med_001",
    chineseName: "人参",
    englishName: "Ginseng",
    pinyinName: "renshen",
    pricePerGram: 15.0,
    property: "温",
    category: "补气"
  },
  {
    id: "med_002",
    chineseName: "当归",
    englishName: "Angelica Sinensis",
    pinyinName: "danggui",
    pricePerGram: 3.5,
    property: "温",
    category: "补血"
  },
  {
    id: "med_003",
    chineseName: "黄芪",
    englishName: "Astragalus",
    pinyinName: "huangqi",
    pricePerGram: 2.8,
    property: "温",
    category: "补气"
  },
  {
    id: "med_004",
    chineseName: "白术",
    englishName: "Atractylodes",
    pinyinName: "baizhu",
    pricePerGram: 2.5,
    property: "温",
    category: "补气"
  },
  {
    id: "med_005",
    chineseName: "甘草",
    englishName: "Licorice",
    pinyinName: "gancao",
    pricePerGram: 1.2,
    property: "平",
    category: "补气"
  },
  {
    id: "med_006",
    chineseName: "川芎",
    englishName: "Szechuan Lovage",
    pinyinName: "chuanxiong",
    pricePerGram: 2.2,
    property: "温",
    category: "活血"
  },
  {
    id: "med_007",
    chineseName: "黄连",
    englishName: "Coptis Chinensis",
    pinyinName: "huanglian",
    pricePerGram: 8.0,
    property: "寒",
    category: "清热"
  },
  {
    id: "med_008",
    chineseName: "陈皮",
    englishName: "Dried Tangerine Peel",
    pinyinName: "chenpi",
    pricePerGram: 1.5,
    property: "温",
    category: "理气"
  },
  {
    id: "med_009",
    chineseName: "生地黄",
    englishName: "Rehmannia",
    pinyinName: "shengdihuang",
    pricePerGram: 2.0,
    property: "寒",
    category: "补血"
  },
  {
    id: "med_010",
    chineseName: "茯苓",
    englishName: "Poria",
    pinyinName: "fuling",
    pricePerGram: 1.8,
    property: "平",
    category: "利水渗湿"
  },
  {
    id: "med_011",
    chineseName: "红参",
    englishName: "Red Ginseng",
    pinyinName: "hongshen",
    pricePerGram: 18.0,
    property: "温",
    category: "补气"
  },
  {
    id: "med_012",
    chineseName: "西洋参",
    englishName: "American Ginseng",
    pinyinName: "xiyangshen",
    pricePerGram: 12.0,
    property: "凉",
    category: "补气"
  },
  {
    id: "med_013",
    chineseName: "山药",
    englishName: "Chinese Yam",
    pinyinName: "shanyao",
    pricePerGram: 1.5,
    property: "平",
    category: "补气"
  },
  {
    id: "med_014",
    chineseName: "党参",
    englishName: "Codonopsis",
    pinyinName: "dangshen",
    pricePerGram: 3.2,
    property: "平",
    category: "补气"
  },
  {
    id: "med_015",
    chineseName: "白芍",
    englishName: "White Peony Root",
    pinyinName: "baishao",
    pricePerGram: 2.0,
    property: "微寒",
    category: "补血"
  },
  {
    id: "med_016",
    chineseName: "熟地黄",
    englishName: "Prepared Rehmannia",
    pinyinName: "shudihuang",
    pricePerGram: 2.5,
    property: "温",
    category: "补血"
  },
  {
    id: "med_017",
    chineseName: "何首乌",
    englishName: "Fo-Ti Root",
    pinyinName: "heshouwu",
    pricePerGram: 3.0,
    property: "微温",
    category: "补血"
  },
  {
    id: "med_018",
    chineseName: "阿胶",
    englishName: "Donkey-Hide Gelatin",
    pinyinName: "ejiao",
    pricePerGram: 10.0,
    property: "平",
    category: "补血"
  },
  {
    id: "med_019",
    chineseName: "北沙参",
    englishName: "Glehnia Root",
    pinyinName: "beishashen",
    pricePerGram: 4.5,
    property: "微寒",
    category: "补阴"
  },
  {
    id: "med_020",
    chineseName: "麦冬",
    englishName: "Ophiopogon",
    pinyinName: "maidong",
    pricePerGram: 3.8,
    property: "微寒",
    category: "补阴"
  },
  {
    id: "med_021",
    chineseName: "天门冬",
    englishName: "Asparagus Root",
    pinyinName: "tiandong",
    pricePerGram: 4.2,
    property: "寒",
    category: "补阴"
  },
  {
    id: "med_022",
    chineseName: "石斛",
    englishName: "Dendrobium",
    pinyinName: "shihu",
    pricePerGram: 12.5,
    property: "微寒",
    category: "补阴"
  },
  {
    id: "med_023",
    chineseName: "玉竹",
    englishName: "Polygonatum Odoratum",
    pinyinName: "yuzhu",
    pricePerGram: 3.5,
    property: "微寒",
    category: "补阴"
  },
  {
    id: "med_024",
    chineseName: "枸杞子",
    englishName: "Goji Berry",
    pinyinName: "gouqizi",
    pricePerGram: 2.8,
    property: "平",
    category: "补阴"
  },
  {
    id: "med_025",
    chineseName: "鹿茸",
    englishName: "Deer Antler",
    pinyinName: "lurong",
    pricePerGram: 85.0,
    property: "温",
    category: "补阳"
  },
  {
    id: "med_026",
    chineseName: "淫羊藿",
    englishName: "Epimedium",
    pinyinName: "yinyanghuo",
    pricePerGram: 3.5,
    property: "温",
    category: "补阳"
  },
  {
    id: "med_027",
    chineseName: "巴戟天",
    englishName: "Morinda Root",
    pinyinName: "bajitian",
    pricePerGram: 4.0,
    property: "温",
    category: "补阳"
  },
  {
    id: "med_028",
    chineseName: "杜仲",
    englishName: "Eucommia Bark",
    pinyinName: "duzhong",
    pricePerGram: 2.5,
    property: "温",
    category: "补阳"
  },
  {
    id: "med_029",
    chineseName: "补骨脂",
    englishName: "Psoralea Fruit",
    pinyinName: "buguzhi",
    pricePerGram: 1.8,
    property: "温",
    category: "补阳"
  },
  {
    id: "med_030",
    chineseName: "肉苁蓉",
    englishName: "Cistanche",
    pinyinName: "roucongrong",
    pricePerGram: 12.0,
    property: "温",
    category: "补阳"
  },
  {
    id: "med_031",
    chineseName: "防风",
    englishName: "Siler Root",
    pinyinName: "fangfeng",
    pricePerGram: 2.2,
    property: "温",
    category: "祛风"
  },
  {
    id: "med_032",
    chineseName: "羌活",
    englishName: "Notopterygium Root",
    pinyinName: "qianghuo",
    pricePerGram: 3.5,
    property: "温",
    category: "祛风"
  },
  {
    id: "med_033",
    chineseName: "独活",
    englishName: "Pubescent Angelica Root",
    pinyinName: "duhuo",
    pricePerGram: 3.0,
    property: "温",
    category: "祛风"
  },
  {
    id: "med_034",
    chineseName: "蔓荆子",
    englishName: "Vitex Fruit",
    pinyinName: "manjingzi",
    pricePerGram: 2.0,
    property: "微寒",
    category: "祛风"
  },
  {
    id: "med_035",
    chineseName: "藁本",
    englishName: "Ligusticum Root",
    pinyinName: "gaoben",
    pricePerGram: 3.8,
    property: "温",
    category: "祛风"
  },
  {
    id: "med_036",
    chineseName: "金银花",
    englishName: "Honeysuckle Flower",
    pinyinName: "jinyinhua",
    pricePerGram: 3.5,
    property: "寒",
    category: "清热"
  },
  {
    id: "med_037",
    chineseName: "连翘",
    englishName: "Forsythia Fruit",
    pinyinName: "lianqiao",
    pricePerGram: 3.0,
    property: "微寒",
    category: "清热"
  },
  {
    id: "med_038",
    chineseName: "板蓝根",
    englishName: "Isatis Root",
    pinyinName: "banlanken",
    pricePerGram: 2.5,
    property: "寒",
    category: "清热"
  },
  {
    id: "med_039",
    chineseName: "栀子",
    englishName: "Gardenia Fruit",
    pinyinName: "zhizi",
    pricePerGram: 2.0,
    property: "寒",
    category: "清热"
  },
  {
    id: "med_040",
    chineseName: "龙胆草",
    englishName: "Gentian Root",
    pinyinName: "longdancao",
    pricePerGram: 4.0,
    property: "寒",
    category: "清热"
  },
  {
    id: "med_041",
    chineseName: "薄荷",
    englishName: "Mint",
    pinyinName: "bohe",
    pricePerGram: 2.0,
    property: "凉",
    category: "清热"
  },
  {
    id: "med_042",
    chineseName: "苍术",
    englishName: "Atractylodes Rhizome",
    pinyinName: "cangzhu",
    pricePerGram: 2.2,
    property: "温",
    category: "祛湿"
  },
  {
    id: "med_043",
    chineseName: "厚朴",
    englishName: "Magnolia Bark",
    pinyinName: "houpo",
    pricePerGram: 1.8,
    property: "温",
    category: "祛湿"
  },
  {
    id: "med_044",
    chineseName: "草豆蔻",
    englishName: "Alpinia Seed",
    pinyinName: "caodoukou",
    pricePerGram: 3.5,
    property: "温",
    category: "祛湿"
  },
  {
    id: "med_045",
    chineseName: "藿香",
    englishName: "Agastache",
    pinyinName: "huoxiang",
    pricePerGram: 2.5,
    property: "微温",
    category: "祛湿"
  },
  {
    id: "med_046",
    chineseName: "佩兰",
    englishName: "Eupatorium",
    pinyinName: "peilan",
    pricePerGram: 1.8,
    property: "凉",
    category: "祛湿"
  },
  {
    id: "med_047",
    chineseName: "半夏",
    englishName: "Pinellia Rhizome",
    pinyinName: "banxia",
    pricePerGram: 3.8,
    property: "温",
    category: "化痰"
  },
  {
    id: "med_048",
    chineseName: "天南星",
    englishName: "Jack-in-the-pulpit",
    pinyinName: "tiannanxing",
    pricePerGram: 2.5,
    property: "温",
    category: "化痰"
  },
  {
    id: "med_049",
    chineseName: "瓜蒌",
    englishName: "Trichosanthes Fruit",
    pinyinName: "gualou",
    pricePerGram: 1.6,
    property: "寒",
    category: "化痰"
  },
  {
    id: "med_050",
    chineseName: "桔梗",
    englishName: "Platycodon Root",
    pinyinName: "jiegeng",
    pricePerGram: 2.8,
    property: "平",
    category: "化痰"
  },
  {
    id: "med_051",
    chineseName: "枳实",
    englishName: "Immature Bitter Orange",
    pinyinName: "zhishi",
    pricePerGram: 1.8,
    property: "微寒",
    category: "理气"
  },
  {
    id: "med_052",
    chineseName: "青皮",
    englishName: "Immature Tangerine Peel",
    pinyinName: "qingpi",
    pricePerGram: 1.5,
    property: "温",
    category: "理气"
  },
  {
    id: "med_053",
    chineseName: "木香",
    englishName: "Costus Root",
    pinyinName: "muxiang",
    pricePerGram: 4.5,
    property: "温",
    category: "理气"
  },
  {
    id: "med_054",
    chineseName: "香附",
    englishName: "Cyperus Rhizome",
    pinyinName: "xiangfu",
    pricePerGram: 1.2,
    property: "平",
    category: "理气"
  },
];

/**
 * 注：在实际开发中，我们将扩展这个数据集到200个常见中药
 * 数据来源可以是中医药学典籍或专业药典
 * 每个中药都应包含基本信息、价格、归类和描述等
 */ 