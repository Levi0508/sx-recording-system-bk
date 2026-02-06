import { avatarPrices } from './price';

export const goodsMap = new Map<
  string,
  { price: number; days: number; name: string }
>([
  ['vip_31', { price: 299, days: 31, name: 'VIP月卡会员' }],
  ['vip_93', { price: 799, days: 93, name: 'VIP季卡会员' }],
  ['vip_366', { price: 2499, days: 366, name: 'VIP年卡会员' }],
  ['vip_1098', { price: 4999, days: 999999, name: 'VIP永久卡会员' }],
  // ['vip_1098', { price: 4999, days: 1098, name: 'VIP三年卡会员' }],
]);

export const monthGoodsMap = new Map<
  string,
  { price: number; name: string; url: string }
>([
  // 2026年
  [
    'month_2602',
    {
      price: 68,
      name: '韩国26年2月合集',
      url: 'https://pan.baidu.com/j/1KgWHJlFmS',
    },
  ],
  [
    'month_2601',
    {
      price: 68,
      name: '韩国26年1月合集',
      url: 'https://pan.baidu.com/j/1UnmJsKYAev',
    },
  ],
  // 2025年
  [
    'month_2501',
    {
      price: 68,
      name: '韩国25年1月合集',
      url: 'https://pan.baidu.com/j/1SZOdePharX',
    },
  ],
  [
    'month_2502',
    {
      price: 68,
      name: '韩国25年2月合集',
      url: 'https://pan.baidu.com/j/1yrrYvshKlc',
    },
  ],
  [
    'month_2503',
    {
      price: 68,
      name: '韩国25年3月合集',
      url: 'https://pan.baidu.com/j/1TjrshysstS',
    },
  ],
  [
    'month_2504',
    {
      price: 68,
      name: '韩国25年4月合集',
      url: 'https://pan.baidu.com/j/1DqVrAMUkWl',
    },
  ],
  [
    'month_2505',
    {
      price: 68,
      name: '韩国25年5月合集',
      url: 'https://pan.baidu.com/j/1FPPmNKeIpv',
    },
  ],
  [
    'month_2506',
    {
      price: 68,
      name: '韩国25年6月合集',
      url: 'https://pan.baidu.com/j/1esBdWdvTXk',
    },
  ],
  [
    'month_2507',
    {
      price: 68,
      name: '韩国25年7月合集',
      url: 'https://pan.baidu.com/j/1IfeNxYWkTa',
    },
  ],
  [
    'month_2508',
    {
      price: 68,
      name: '韩国25年8月合集',
      url: 'https://pan.baidu.com/j/1LqmIVgsNAb',
    },
  ],
  [
    'month_2509',
    {
      price: 68,
      name: '韩国25年9月合集',
      url: 'https://pan.baidu.com/j/1sOTukmUDlR',
    },
  ],
  [
    'month_2510',
    {
      price: 68,
      name: '韩国25年10月合集',
      url: 'https://pan.baidu.com/j/1njxQjOvuwQ',
    },
  ],
  [
    'month_2511',
    {
      price: 68,
      name: '韩国25年11月合集',
      url: 'https://pan.baidu.com/j/1HdjmqpMfOt',
    },
  ],
  [
    'month_2512',
    {
      price: 68,
      name: '韩国25年12月合集',
      url: 'https://pan.baidu.com/j/1ZuPjyVEgOb',
    },
  ],
  // 2024年
  [
    'month_2401',
    {
      price: 68,
      name: '韩国24年1月合集',
      url: 'https://pan.baidu.com/j/1tPXPSKgtN',
    },
  ],
  [
    'month_2402',
    {
      price: 68,
      name: '韩国24年2月合集',
      url: 'https://pan.baidu.com/j/1LOQCTpWdm',
    },
  ],
  [
    'month_2403',
    {
      price: 68,
      name: '韩国24年3月合集',
      url: 'https://pan.baidu.com/j/1XhcfzhurPE',
    },
  ],
  [
    'month_2404',
    {
      price: 68,
      name: '韩国24年4月合集',
      url: 'https://pan.baidu.com/j/1YpLybsJert',
    },
  ],
  [
    'month_2405',
    {
      price: 68,
      name: '韩国24年5月合集',
      url: 'https://pan.baidu.com/j/1XhrfSJPrB',
    },
  ],
  [
    'month_2406',
    {
      price: 68,
      name: '韩国24年6月合集',
      url: 'https://pan.baidu.com/j/1GZjkNCVKxX',
    },
  ],
  [
    'month_2407',
    {
      price: 68,
      name: '韩国24年7月合集',
      url: 'https://pan.baidu.com/j/1NOnBxBhpxA',
    },
  ],
  [
    'month_2408',
    {
      price: 68,
      name: '韩国24年8月合集',
      url: 'https://pan.baidu.com/j/1AqfHETYlIb',
    },
  ],
  [
    'month_2409',
    {
      price: 68,
      name: '韩国24年9月合集',
      url: 'https://pan.baidu.com/j/1jSQWmnmIKu',
    },
  ],
  [
    'month_2410',
    {
      price: 68,
      name: '韩国24年10月合集',
      url: 'https://pan.baidu.com/j/1yYMxKtjhPl',
    },
  ],
  [
    'month_2411',
    {
      price: 68,
      name: '韩国24年11月合集',
      url: 'https://pan.baidu.com/j/1OZwLEhmZnc',
    },
  ],
  [
    'month_2412',
    {
      price: 68,
      name: '韩国24年12月合集',
      url: 'https://pan.baidu.com/j/1PWJHPjLLjQ',
    },
  ],
]);

export const giftMap = new Map<string, { hours: number; signInDays: number }>([
  ['vip_3h', { hours: 1, signInDays: 3 }],
  ['vip_12h', { hours: 12, signInDays: 7 }],
  ['vip_24h', { hours: 24, signInDays: 15 }],
  ['vip_48h', { hours: 48, signInDays: 28 }],
]);

export const anchorGoodsMap = new Map<
  string,
  { price: number; name: string; url: string; allowUpdate: boolean }
>([
  // 主播合集商品 - 价格从 typeGoods 目录中的图片文件名自动提取
  // URL 和 allowUpdate 需要手动维护

  [
    '呆梦',
    {
      price: 168,
      name: '呆梦 主播合集',
      url: 'https://pan.baidu.com/j/1kTxwkDjOOm',
      allowUpdate: true,
    },
  ],
  [
    '兰',
    {
      price: 158,
      name: '兰 主播合集',
      url: 'https://pan.baidu.com/j/1XTBwrVPZEa',
      allowUpdate: false,
    },
  ],
  [
    '尤娜',
    {
      price: 158,
      name: '尤娜 主播合集',
      url: 'https://pan.baidu.com/j/1jjIReMPmYQ',
      allowUpdate: true,
    },
  ],
  [
    '帕卡',
    {
      price: 158,
      name: '帕卡 主播合集',
      url: 'https://pan.baidu.com/j/1GWGhVlAkWZ',
      allowUpdate: true,
    },
  ],
  [
    '雷颖',
    {
      price: 158,
      name: '雷颖 主播合集',
      url: 'https://pan.baidu.com/j/1GrVJHPIlAR',
      allowUpdate: true,
    },
  ],
  [
    '韩璐',
    {
      price: 158,
      name: '韩璐 主播合集',
      url: 'https://pan.baidu.com/j/1RWyuIzPHYm',
      allowUpdate: false,
    },
  ],
  [
    '阿丽莎',
    {
      price: 138,
      name: '阿丽莎 主播合集',
      url: 'https://pan.baidu.com/j/1blmPvkhuja',
      allowUpdate: true,
    },
  ],
  [
    '在熙',
    {
      price: 128,
      name: '在熙 主播合集',
      url: 'https://pan.baidu.com/j/1QHKOjjOkr',
      allowUpdate: true,
    },
  ],
  [
    '娜娜',
    {
      price: 108,
      name: '娜娜 主播合集',
      url: 'https://pan.baidu.com/j/1zazsTrLRSE',
      allowUpdate: false,
    },
  ],
  [
    '孝卡',
    {
      price: 108,
      name: '孝卡 主播合集',
      url: 'https://pan.baidu.com/j/1lLfQaOTVgc',
      allowUpdate: true,
    },
  ],
  [
    '黑珍',
    {
      price: 108,
      name: '黑珍 主播合集',
      url: 'https://pan.baidu.com/j/1KyOhtDLHGA',
      allowUpdate: true,
    },
  ],
  [
    'golaniyule0',
    {
      price: 98,
      name: 'golaniyule0 主播合集',
      url: 'https://pan.baidu.com/j/1ZRpqRlJSA',
      allowUpdate: true,
    },
  ],
  [
    '世妍',
    {
      price: 98,
      name: '世妍 主播合集',
      url: 'https://pan.baidu.com/j/1DHmHoeCKVW',
      allowUpdate: true,
    },
  ],
  [
    '叶琳',
    {
      price: 98,
      name: '叶琳 主播合集',
      url: 'https://pan.baidu.com/j/1bSKLBqwcvc',
      allowUpdate: true,
    },
  ],
  [
    '哈里米',
    {
      price: 98,
      name: '哈里米 主播合集',
      url: 'https://pan.baidu.com/j/1twXMWcwbJS',
      allowUpdate: true,
    },
  ],
  [
    '圆圆',
    {
      price: 98,
      name: '圆圆 主播合集',
      url: 'https://pan.baidu.com/j/1wFcJPODGnA',
      allowUpdate: false,
    },
  ],
  [
    '塔妮',
    {
      price: 98,
      name: '塔妮 主播合集',
      url: 'https://pan.baidu.com/j/1YfzzqmRAdk',
      allowUpdate: true,
    },
  ],
  [
    '奇瑞',
    {
      price: 98,
      name: '奇瑞 主播合集',
      url: 'https://pan.baidu.com/j/1dOxLnoHvgk',
      allowUpdate: true,
    },
  ],
  [
    '平腾',
    {
      price: 98,
      name: '平腾 主播合集',
      url: 'https://pan.baidu.com/j/1ogsJsTHIk',
      allowUpdate: true,
    },
  ],
  [
    '徐雅',
    {
      price: 98,
      name: '徐雅 主播合集',
      url: 'https://pan.baidu.com/j/1CFTEsVZrJt',
      allowUpdate: false,
    },
  ],
  [
    '慧明',
    {
      price: 98,
      name: '慧明 主播合集',
      url: 'https://pan.baidu.com/j/1zDLygZrPjd',
      allowUpdate: true,
    },
  ],
  [
    '智贤',
    {
      price: 98,
      name: '智贤 主播合集',
      url: 'https://pan.baidu.com/j/1JVEALJxbuE',
      allowUpdate: true,
    },
  ],
  [
    '橘子',
    {
      price: 98,
      name: '橘子 主播合集',
      url: 'https://pan.baidu.com/j/1nRMuBjnKc',
      allowUpdate: true,
    },
  ],
  [
    '牛奶',
    {
      price: 98,
      name: '牛奶 主播合集',
      url: 'https://pan.baidu.com/j/1afRLBgpca',
      allowUpdate: true,
    },
  ],
  [
    '诗妍',
    {
      price: 98,
      name: '诗妍 主播合集',
      url: 'https://pan.baidu.com/j/1XPPjQPNZPw',
      allowUpdate: true,
    },
  ],
  [
    '贝拉',
    {
      price: 98,
      name: '贝拉 主播合集',
      url: 'https://pan.baidu.com/j/1MYNMALmERu',
      allowUpdate: true,
    },
  ],
  [
    '辛娜琳',
    {
      price: 98,
      name: '辛娜琳 主播合集',
      url: 'https://pan.baidu.com/j/1nMjPYknPhA',
      allowUpdate: true,
    },
  ],
  [
    '冬天',
    {
      price: 95,
      name: '冬天 主播合集',
      url: 'https://pan.baidu.com/j/1sXcZMlNts',
      allowUpdate: true,
    },
  ],
  [
    '朵拉',
    {
      price: 90,
      name: '朵拉 主播合集',
      url: 'https://pan.baidu.com/j/1YZsLLPpPcm',
      allowUpdate: true,
    },
  ],
  [
    'haumpah',
    {
      price: 88,
      name: 'haumpah 主播合集',
      url: 'https://pan.baidu.com/j/1dROFbFMqda',
      allowUpdate: true,
    },
  ],
  [
    '世京',
    {
      price: 88,
      name: '世京 主播合集',
      url: 'https://pan.baidu.com/j/1QXjMZLOozk',
      allowUpdate: true,
    },
  ],
  [
    '塔米米',
    {
      price: 88,
      name: '塔米米 主播合集',
      url: 'https://pan.baidu.com/j/1aapzPLkGeZ',
      allowUpdate: true,
    },
  ],
  [
    '夏艺拉',
    {
      price: 88,
      name: '夏艺拉 主播合集',
      url: 'https://pan.baidu.com/j/1LHKesTZTZC',
      allowUpdate: true,
    },
  ],
  [
    '孙铭',
    {
      price: 88,
      name: '孙铭 主播合集',
      url: 'https://pan.baidu.com/j/1pmvQsJHhAm',
      allowUpdate: true,
    },
  ],
  [
    '尹知予',
    {
      price: 88,
      name: '尹知予 主播合集',
      url: 'https://pan.baidu.com/j/1jVYFJgCYm',
      allowUpdate: true,
    },
  ],
  [
    '徐婉',
    {
      price: 88,
      name: '徐婉 主播合集',
      url: 'https://pan.baidu.com/j/1ILoyfuMRXX',
      allowUpdate: false,
    },
  ],
  [
    '智媛',
    {
      price: 88,
      name: '智媛 主播合集',
      url: 'https://pan.baidu.com/j/1mrlUBtBJJ',
      allowUpdate: true,
    },
  ],
  [
    '海恩',
    {
      price: 88,
      name: '海恩 主播合集',
      url: 'https://pan.baidu.com/j/1mWpZZFwlRX',
      allowUpdate: true,
    },
  ],
  [
    '玫瑰',
    {
      price: 88,
      name: '玫瑰 主播合集',
      url: 'https://pan.baidu.com/j/1oGXaFjwdjF',
      allowUpdate: true,
    },
  ],
  [
    '艺珠',
    {
      price: 88,
      name: '艺珠 主播合集',
      url: 'https://pan.baidu.com/j/1vFQaKARNKQ',
      allowUpdate: true,
    },
  ],
  [
    '芭比基尼',
    {
      price: 88,
      name: '芭比基尼 主播合集',
      url: 'https://pan.baidu.com/j/1BCqywSOxBb',
      allowUpdate: true,
    },
  ],
  [
    '芭比昂',
    {
      price: 88,
      name: '芭比昂 主播合集',
      url: 'https://pan.baidu.com/j/1xYeBueEmb',
      allowUpdate: true,
    },
  ],
  [
    '花井',
    {
      price: 88,
      name: '花井 主播合集',
      url: 'https://pan.baidu.com/j/1LoRxKcoEIE',
      allowUpdate: false,
    },
  ],
  [
    '苏吉',
    {
      price: 88,
      name: '苏吉 主播合集',
      url: 'https://pan.baidu.com/j/1PFNjIxWopb',
      allowUpdate: true,
    },
  ],
  [
    '蔡京',
    {
      price: 88,
      name: '蔡京 主播合集',
      url: 'https://pan.baidu.com/j/1WcGXVQIKN',
      allowUpdate: true,
    },
  ],
  [
    '蔡时雅',
    {
      price: 88,
      name: '蔡时雅 主播合集',
      url: 'https://pan.baidu.com/j/1PMIeyfCmPw',
      allowUpdate: true,
    },
  ],
  [
    '雷彬',
    {
      price: 88,
      name: '雷彬 主播合集',
      url: 'https://pan.baidu.com/j/1zKvghKppM',
      allowUpdate: true,
    },
  ],
  [
    '蒂尔',
    {
      price: 80,
      name: '蒂尔 主播合集',
      url: 'https://pan.baidu.com/j/1rrufbPVBPE',
      allowUpdate: true,
    },
  ],
  [
    '闵骚',
    {
      price: 80,
      name: '闵骚 主播合集',
      url: 'https://pan.baidu.com/j/1pQBrtsjUXF',
      allowUpdate: true,
    },
  ],
  [
    'Muse',
    {
      price: 78,
      name: 'Muse 主播合集',
      url: 'https://pan.baidu.com/j/1PyfYwXtIAS',
      allowUpdate: true,
    },
  ],
  [
    '升雅',
    {
      price: 78,
      name: '升雅 主播合集',
      url: 'https://pan.baidu.com/j/1rjbPsPLvEC',
      allowUpdate: true,
    },
  ],
  [
    '尤彩琳',
    {
      price: 78,
      name: '尤彩琳 主播合集',
      url: 'https://pan.baidu.com/j/1xTgNINguYS',
      allowUpdate: true,
    },
  ],
  [
    '尹素婉',
    {
      price: 78,
      name: '尹素婉 主播合集',
      url: 'https://pan.baidu.com/j/1qWUPaQPohb',
      allowUpdate: false,
    },
  ],
  [
    '慧智',
    {
      price: 78,
      name: '慧智 主播合集',
      url: 'https://pan.baidu.com/j/1bIwhgIRArb',
      allowUpdate: true,
    },
  ],
  [
    '拉凡',
    {
      price: 78,
      name: '拉凡 主播合集',
      url: 'https://pan.baidu.com/j/1qVyCsfBOc',
      allowUpdate: true,
    },
  ],
  [
    '摩卡',
    {
      price: 78,
      name: '摩卡 主播合集',
      url: 'https://pan.baidu.com/j/1kuElMjKolZ',
      allowUpdate: true,
    },
  ],
  [
    '朴珍雅',
    {
      price: 78,
      name: '朴珍雅 主播合集',
      url: 'https://pan.baidu.com/j/1xfoNnIKWwC',
      allowUpdate: false,
    },
  ],
  [
    '河正宇',
    {
      price: 78,
      name: '河正宇 主播合集',
      url: 'https://pan.baidu.com/j/1PXjlMMKChW',
      allowUpdate: true,
    },
  ],
  [
    '泰熙',
    {
      price: 78,
      name: '泰熙 主播合集',
      url: 'https://pan.baidu.com/j/1PvZcPTvqX',
      allowUpdate: false,
    },
  ],
  [
    '猫猫',
    {
      price: 78,
      name: '猫猫 主播合集',
      url: 'https://pan.baidu.com/j/1HjeXXOcnMD',
      allowUpdate: true,
    },
  ],
  [
    '甘东兰',
    {
      price: 78,
      name: '甘东兰 主播合集',
      url: 'https://pan.baidu.com/j/1POwvuBZXd',
      allowUpdate: false,
    },
  ],
  [
    '白河',
    {
      price: 78,
      name: '白河 主播合集',
      url: 'https://pan.baidu.com/j/1tcpssjr',
      allowUpdate: true,
    },
  ],
  [
    '皮丘',
    {
      price: 78,
      name: '皮丘 主播合集',
      url: 'https://pan.baidu.com/j/1KwdXxfBrYt',
      allowUpdate: false,
    },
  ],
  [
    '简芭比',
    {
      price: 78,
      name: '简芭比 主播合集',
      url: 'https://pan.baidu.com/j/1vqDluYsxPW',
      allowUpdate: true,
    },
  ],
  [
    '米朵',
    {
      price: 78,
      name: '米朵 主播合集',
      url: 'https://pan.baidu.com/j/1MjshDCPLjQ',
      allowUpdate: true,
    },
  ],
  [
    '苏希',
    {
      price: 78,
      name: '苏希 主播合集',
      url: 'https://pan.baidu.com/j/1zKWmYWUuJ',
      allowUpdate: true,
    },
  ],
  [
    '董顾苒',
    {
      price: 78,
      name: '董顾苒 主播合集',
      url: 'https://pan.baidu.com/j/1aZhjlsNqAX',
      allowUpdate: true,
    },
  ],
  [
    '薄荷',
    {
      price: 78,
      name: '薄荷 主播合集',
      url: 'https://pan.baidu.com/j/1ajNHggjbV',
      allowUpdate: true,
    },
  ],
  [
    '软画',
    {
      price: 78,
      name: '软画 主播合集',
      url: 'https://pan.baidu.com/j/1zHqwddjPsC',
      allowUpdate: true,
    },
  ],
  [
    '邱珍',
    {
      price: 78,
      name: '邱珍 主播合集',
      url: 'https://pan.baidu.com/j/1LtINmgzKla',
      allowUpdate: true,
    },
  ],
  [
    '金花',
    {
      price: 78,
      name: '金花 主播合集',
      url: 'https://pan.baidu.com/j/1FKYnHSAum',
      allowUpdate: false,
    },
  ],
  [
    '金诗媛',
    {
      price: 78,
      name: '金诗媛 主播合集',
      url: 'https://pan.baidu.com/j/1QYLOPgIUtu',
      allowUpdate: false,
    },
  ],
  [
    '阿允',
    {
      price: 78,
      name: '阿允 主播合集',
      url: 'https://pan.baidu.com/j/1BbfNpZJVjw',
      allowUpdate: true,
    },
  ],
  [
    '韩雪',
    {
      price: 78,
      name: '韩雪 主播合集',
      url: 'https://pan.baidu.com/j/1vPUIxgACWu',
      allowUpdate: false,
    },
  ],
  [
    '高慧智',
    {
      price: 78,
      name: '高慧智 主播合集',
      url: 'https://pan.baidu.com/j/1DlCrLPeAgX',
      allowUpdate: true,
    },
  ],
  [
    '耶迪',
    {
      price: 75,
      name: '耶迪 主播合集',
      url: 'https://pan.baidu.com/j/1ZqBCjrfhqQ',
      allowUpdate: true,
    },
  ],
  [
    '丹独',
    {
      price: 70,
      name: '丹独 主播合集',
      url: 'https://pan.baidu.com/j/1GHuOorLMfc',
      allowUpdate: true,
    },
  ],
  [
    '多妍',
    {
      price: 70,
      name: '多妍 主播合集',
      url: 'https://pan.baidu.com/j/1zKQCejZWKX',
      allowUpdate: false,
    },
  ],
  [
    '多恩',
    {
      price: 70,
      name: '多恩 主播合集',
      url: 'https://pan.baidu.com/j/1BIAgarXNMA',
      allowUpdate: false,
    },
  ],
  [
    '宝青',
    {
      price: 70,
      name: '宝青 主播合集',
      url: 'https://pan.baidu.com/j/1YHuKUgvAaX',
      allowUpdate: true,
    },
  ],
  [
    '柳迪',
    {
      price: 70,
      name: '柳迪 主播合集',
      url: 'https://pan.baidu.com/j/1MeBsOVjW',
      allowUpdate: false,
    },
  ],
  [
    '江陶',
    {
      price: 70,
      name: '江陶 主播合集',
      url: 'https://pan.baidu.com/j/1cHjjoLhOkZ',
      allowUpdate: true,
    },
  ],
  [
    '罗夏',
    {
      price: 70,
      name: '罗夏 主播合集',
      url: 'https://pan.baidu.com/j/1OdzWpUJLmZ',
      allowUpdate: true,
    },
  ],
  [
    '苏打',
    {
      price: 70,
      name: '苏打 主播合集',
      url: 'https://pan.baidu.com/j/1kgZrNNflFX',
      allowUpdate: true,
    },
  ],
  [
    '苏麟',
    {
      price: 70,
      name: '苏麟 主播合集',
      url: 'https://pan.baidu.com/j/1IjBTCsOFQv',
      allowUpdate: false,
    },
  ],
  [
    '赛拉',
    {
      price: 70,
      name: '赛拉 主播合集',
      url: 'https://pan.baidu.com/j/1LbHvRnMPQW',
      allowUpdate: true,
    },
  ],
  [
    '金娜美',
    {
      price: 70,
      name: '金娜美 主播合集',
      url: 'https://pan.baidu.com/j/1EgHUtCNjuu',
      allowUpdate: true,
    },
  ],
  [
    '露水',
    {
      price: 70,
      name: '露水 主播合集',
      url: 'https://pan.baidu.com/j/1LPEBSZMccA',
      allowUpdate: true,
    },
  ],
  [
    '韩智娜',
    {
      price: 70,
      name: '韩智娜 主播合集',
      url: 'https://pan.baidu.com/j/1JCTarmYnFk',
      allowUpdate: false,
    },
  ],
  [
    'a124',
    {
      price: 68,
      name: 'a124 主播合集',
      url: 'https://pan.baidu.com/j/1TCObjsKhgl',
      allowUpdate: true,
    },
  ],
  [
    '哈尼尼',
    {
      price: 68,
      name: '哈尼尼 主播合集',
      url: 'https://pan.baidu.com/j/1JCJTYUccrl',
      allowUpdate: true,
    },
  ],
  [
    '徐静',
    {
      price: 68,
      name: '徐静 主播合集',
      url: 'https://pan.baidu.com/j/1LASszyVNUX',
      allowUpdate: false,
    },
  ],
  [
    '明楚',
    {
      price: 68,
      name: '明楚 主播合集',
      url: 'https://pan.baidu.com/j/1GdpbKtmLkk',
      allowUpdate: false,
    },
  ],
  [
    '楚民',
    {
      price: 68,
      name: '楚民 主播合集',
      url: 'https://pan.baidu.com/j/1OPTpKWufFX',
      allowUpdate: false,
    },
  ],
  [
    '熙亚',
    {
      price: 68,
      name: '熙亚 主播合集',
      url: 'https://pan.baidu.com/j/1OxsDXJohhX',
      allowUpdate: true,
    },
  ],
  [
    '环空',
    {
      price: 68,
      name: '环空 主播合集',
      url: 'https://pan.baidu.com/j/1bzkkPLPET',
      allowUpdate: true,
    },
  ],
  [
    '秋天',
    {
      price: 68,
      name: '秋天 主播合集',
      url: 'https://pan.baidu.com/j/1atnlPoOotd',
      allowUpdate: true,
    },
  ],
  [
    '韩京',
    {
      price: 68,
      name: '韩京 主播合集',
      url: 'https://pan.baidu.com/j/1NwYKIWZjh',
      allowUpdate: true,
    },
  ],
  [
    '韩斗妮',
    {
      price: 68,
      name: '韩斗妮 主播合集',
      url: 'https://pan.baidu.com/j/1FjFJOrMzIX',
      allowUpdate: false,
    },
  ],
  [
    '朱迪',
    {
      price: 65,
      name: '朱迪 主播合集',
      url: 'https://pan.baidu.com/j/1PWqBevMdQV',
      allowUpdate: true,
    },
  ],
  [
    '姚元',
    {
      price: 60,
      name: '姚元 主播合集',
      url: 'https://pan.baidu.com/j/1XbPsjwyQG',
      allowUpdate: false,
    },
  ],
  [
    '苏芮',
    {
      price: 60,
      name: '苏芮 主播合集',
      url: 'https://pan.baidu.com/j/1OIfScMrXVk',
      allowUpdate: false,
    },
  ],
  [
    '阿英',
    {
      price: 60,
      name: '阿英 主播合集',
      url: 'https://pan.baidu.com/j/1CjaKKNUnda',
      allowUpdate: false,
    },
  ],
  [
    '露露',
    {
      price: 60,
      name: '露露 主播合集',
      url: 'https://pan.baidu.com/j/1TaKdYZvOot',
      allowUpdate: true,
    },
  ],
  [
    '曦朵',
    {
      price: 58,
      name: '曦朵 主播合集',
      url: 'https://pan.baidu.com/j/1GLdXmLVxfD',
      allowUpdate: true,
    },
  ],
  [
    '爱迪林',
    {
      price: 58,
      name: '爱迪林 主播合集',
      url: 'https://pan.baidu.com/j/1cNvUsJwhaZ',
      allowUpdate: false,
    },
  ],
  [
    '白雅珍',
    {
      price: 58,
      name: '白雅珍 主播合集',
      url: 'https://pan.baidu.com/j/1wJtzcvUzL',
      allowUpdate: true,
    },
  ],
  [
    '尹瑟',
    {
      price: 55,
      name: '尹瑟 主播合集',
      url: 'https://pan.baidu.com/j/1IpIhIBbsuw',
      allowUpdate: true,
    },
  ],
  [
    '新世露',
    {
      price: 55,
      name: '新世露 主播合集',
      url: 'https://pan.baidu.com/j/1PYEBPshWAk',
      allowUpdate: false,
    },
  ],
  [
    '高恩星',
    {
      price: 55,
      name: '高恩星 主播合集',
      url: 'https://pan.baidu.com/j/1VHWbQGvxp',
      allowUpdate: false,
    },
  ],
  [
    '刑英',
    {
      price: 50,
      name: '刑英 主播合集',
      url: 'https://pan.baidu.com/j/1FsKQOzPenZ',
      allowUpdate: true,
    },
  ],
  [
    '尤希',
    {
      price: 50,
      name: '尤希 主播合集',
      url: 'https://pan.baidu.com/j/1jzjKxKXSs',
      allowUpdate: false,
    },
  ],
  [
    '布丽',
    {
      price: 50,
      name: '布丽 主播合集',
      url: 'https://pan.baidu.com/j/1FeSGNjHDHW',
      allowUpdate: false,
    },
  ],
  [
    '李秀彬',
    {
      price: 50,
      name: '李秀彬 主播合集',
      url: 'https://pan.baidu.com/j/1egSbwhRWd',
      allowUpdate: false,
    },
  ],
  [
    '河恩',
    {
      price: 50,
      name: '河恩 主播合集',
      url: 'https://pan.baidu.com/j/1lIFHPcAzQt',
      allowUpdate: false,
    },
  ],
  [
    '海',
    {
      price: 50,
      name: '海 主播合集',
      url: 'https://pan.baidu.com/j/1xKPODBLKGE',
      allowUpdate: false,
    },
  ],
  [
    '莎莎',
    {
      price: 50,
      name: '莎莎 主播合集',
      url: 'https://pan.baidu.com/j/1NzjPAPbmub',
      allowUpdate: false,
    },
  ],
  [
    '谷秀真',
    {
      price: 50,
      name: '谷秀真 主播合集',
      url: 'https://pan.baidu.com/j/1qjsBuJhOMW',
      allowUpdate: false,
    },
  ],
  [
    'Soi',
    {
      price: 45,
      name: 'Soi 主播合集',
      url: 'https://pan.baidu.com/j/1QXhyPvtSh',
      allowUpdate: false,
    },
  ],
  [
    'eerttyui',
    {
      price: 45,
      name: 'eerttyui 主播合集',
      url: 'https://pan.baidu.com/j/1bxYcPJPdJv',
      allowUpdate: true,
    },
  ],
  [
    'qkskek',
    {
      price: 45,
      name: 'qkskek 主播合集',
      url: 'https://pan.baidu.com/j/1jVJzoFULpD',
      allowUpdate: false,
    },
  ],
  [
    '加赛熙',
    {
      price: 45,
      name: '加赛熙 主播合集',
      url: 'https://pan.baidu.com/j/1MzBMGFQPSD',
      allowUpdate: false,
    },
  ],
  [
    '窦熙',
    {
      price: 45,
      name: '窦熙 主播合集',
      url: 'https://pan.baidu.com/j/1LNcYoOhbFt',
      allowUpdate: false,
    },
  ],
  [
    '艺童',
    {
      price: 45,
      name: '艺童 主播合集',
      url: 'https://pan.baidu.com/j/1ryWEboqFe',
      allowUpdate: false,
    },
  ],
  [
    '苏凌',
    {
      price: 45,
      name: '苏凌 主播合集',
      url: 'https://pan.baidu.com/j/1omBjONRhZW',
      allowUpdate: false,
    },
  ],
  [
    '霜慈',
    {
      price: 45,
      name: '霜慈 主播合集',
      url: 'https://pan.baidu.com/j/1RRxYyMPSuW',
      allowUpdate: false,
    },
  ],
  [
    'Rather',
    {
      price: 40,
      name: 'Rather 主播合集',
      url: 'https://pan.baidu.com/j/1ELhJLfAZ',
      allowUpdate: false,
    },
  ],
  [
    'a77',
    {
      price: 40,
      name: 'a77 主播合集',
      url: 'https://pan.baidu.com/j/1NhwOKLOZUC',
      allowUpdate: true,
    },
  ],
  [
    'askl',
    {
      price: 40,
      name: 'askl 主播合集',
      url: 'https://pan.baidu.com/j/1CKNXIheb',
      allowUpdate: true,
    },
  ],
  [
    'hayulll',
    {
      price: 40,
      name: 'hayulll 主播合集',
      url: 'https://pan.baidu.com/j/1sjbRyCKGn',
      allowUpdate: false,
    },
  ],
  [
    '天熙',
    {
      price: 40,
      name: '天熙 主播合集',
      url: 'https://pan.baidu.com/j/1hfZzjPPQPl',
      allowUpdate: true,
    },
  ],
  [
    '拉雅',
    {
      price: 40,
      name: '拉雅 主播合集',
      url: 'https://pan.baidu.com/j/1tmgwaCpRJX',
      allowUpdate: true,
    },
  ],
  [
    '晴天',
    {
      price: 40,
      name: '晴天 主播合集',
      url: 'https://pan.baidu.com/j/1BJzhLszfLA',
      allowUpdate: false,
    },
  ],
  [
    '智妍',
    {
      price: 40,
      name: '智妍 主播合集',
      url: 'https://pan.baidu.com/j/1CdyxzCrZv',
      allowUpdate: true,
    },
  ],
  [
    '朵姬',
    {
      price: 40,
      name: '朵姬 主播合集',
      url: 'https://pan.baidu.com/j/1AjoZrePmqm',
      allowUpdate: false,
    },
  ],
  [
    '朵熙',
    {
      price: 40,
      name: '朵熙 主播合集',
      url: 'https://pan.baidu.com/j/1DQNjzJshx',
      allowUpdate: false,
    },
  ],
  [
    '柳月怡',
    {
      price: 40,
      name: '柳月怡 主播合集',
      url: 'https://pan.baidu.com/j/1OykrNhbOjE',
      allowUpdate: true,
    },
  ],
  [
    '沈清怡',
    {
      price: 40,
      name: '沈清怡 主播合集',
      url: 'https://pan.baidu.com/j/1qDrKUFqZzc',
      allowUpdate: true,
    },
  ],
  [
    '贝比',
    {
      price: 40,
      name: '贝比 主播合集',
      url: 'https://pan.baidu.com/j/1PGAIosgSru',
      allowUpdate: true,
    },
  ],
  [
    '1004ysus',
    {
      price: 35,
      name: '1004ysus 主播合集',
      url: 'https://pan.baidu.com/j/1MJHPlBPn',
      allowUpdate: true,
    },
  ],
  [
    'yunhee',
    {
      price: 35,
      name: 'yunhee 主播合集',
      url: 'https://pan.baidu.com/j/1FZzIroJ',
      allowUpdate: true,
    },
  ],
  [
    '图雅',
    {
      price: 35,
      name: '图雅 主播合集',
      url: 'https://pan.baidu.com/j/1kLBelGXVzc',
      allowUpdate: true,
    },
  ],
  [
    '多燕',
    {
      price: 35,
      name: '多燕 主播合集',
      url: 'https://pan.baidu.com/j/1VeFLaPSjZb',
      allowUpdate: false,
    },
  ],
  [
    '幂幂',
    {
      price: 35,
      name: '幂幂 主播合集',
      url: 'https://pan.baidu.com/j/1OdCWObFWB',
      allowUpdate: false,
    },
  ],
  [
    '李河允',
    {
      price: 35,
      name: '李河允 主播合集',
      url: 'https://pan.baidu.com/j/1UfrduYSlFS',
      allowUpdate: false,
    },
  ],
  [
    '灿熙',
    {
      price: 35,
      name: '灿熙 主播合集',
      url: 'https://pan.baidu.com/j/1RwkxKMULPZ',
      allowUpdate: true,
    },
  ],
  [
    '秀丽',
    {
      price: 35,
      name: '秀丽 主播合集',
      url: 'https://pan.baidu.com/j/1saoFlqvjPk',
      allowUpdate: false,
    },
  ],
  [
    '草草',
    {
      price: 35,
      name: '草草 主播合集',
      url: 'https://pan.baidu.com/j/1aGGkSuBBBb',
      allowUpdate: false,
    },
  ],
  [
    'Guyl',
    {
      price: 30,
      name: 'Guyl 主播合集',
      url: 'https://pan.baidu.com/j/1jLQoQPafo',
      allowUpdate: true,
    },
  ],
  [
    'Zone',
    {
      price: 30,
      name: 'Zone 主播合集',
      url: 'https://pan.baidu.com/j/1STKRLzxcPR',
      allowUpdate: false,
    },
  ],
  [
    'ayo111',
    {
      price: 30,
      name: 'ayo111 主播合集',
      url: 'https://pan.baidu.com/j/1DMoVjUyFKZ',
      allowUpdate: true,
    },
  ],
  [
    'poqwe',
    {
      price: 30,
      name: 'poqwe 主播合集',
      url: 'https://pan.baidu.com/j/1YovejRGPa',
      allowUpdate: true,
    },
  ],
  [
    '冬季',
    {
      price: 30,
      name: '冬季 主播合集',
      url: 'https://pan.baidu.com/j/1DSSCEUdqx',
      allowUpdate: false,
    },
  ],
  [
    '尹英瑞',
    {
      price: 30,
      name: '尹英瑞 主播合集',
      url: 'https://pan.baidu.com/j/1YPcZjsXnjS',
      allowUpdate: true,
    },
  ],
  [
    '布西',
    {
      price: 30,
      name: '布西 主播合集',
      url: 'https://pan.baidu.com/j/1PtErHDuYbE',
      allowUpdate: false,
    },
  ],
  [
    '柳雪儿',
    {
      price: 30,
      name: '柳雪儿 主播合集',
      url: 'https://pan.baidu.com/j/1bzgVgQrPpD',
      allowUpdate: true,
    },
  ],
  [
    '阿米',
    {
      price: 30,
      name: '阿米 主播合集',
      url: 'https://pan.baidu.com/j/1TBPLLLsFtQ',
      allowUpdate: false,
    },
  ],
  [
    '露西',
    {
      price: 30,
      name: '露西 主播合集',
      url: 'https://pan.baidu.com/j/1QITsYTlTK',
      allowUpdate: false,
    },
  ],
  [
    '2do2do',
    {
      price: 25,
      name: '2do2do 主播合集',
      url: 'https://pan.baidu.com/j/1vjPFQTzIjc',
      allowUpdate: true,
    },
  ],
  [
    '李雅',
    {
      price: 25,
      name: '李雅 主播合集',
      url: 'https://pan.baidu.com/j/1jhWhJjrjqv',
      allowUpdate: false,
    },
  ],
  [
    '素婉',
    {
      price: 25,
      name: '素婉 主播合集',
      url: 'https://pan.baidu.com/j/1PeIXydXsjF',
      allowUpdate: false,
    },
  ],
  [
    '阿孝',
    {
      price: 25,
      name: '阿孝 主播合集',
      url: 'https://pan.baidu.com/j/1dcDhHoWPEW',
      allowUpdate: true,
    },
  ],
  [
    'gpgp',
    {
      price: 20,
      name: 'gpgp 主播合集',
      url: 'https://pan.baidu.com/j/1HbCTsTkWBk',
      allowUpdate: true,
    },
  ],
  [
    '何妍珠',
    {
      price: 20,
      name: '何妍珠 主播合集',
      url: 'https://pan.baidu.com/j/1OBBObTQZAb',
      allowUpdate: false,
    },
  ],
  [
    '尹玛乔',
    {
      price: 20,
      name: '尹玛乔 主播合集',
      url: 'https://pan.baidu.com/j/1pwjgZKLBFb',
      allowUpdate: false,
    },
  ],
  [
    '尼莫',
    {
      price: 20,
      name: '尼莫 主播合集',
      url: 'https://pan.baidu.com/j/1BdZLYOmVL',
      allowUpdate: false,
    },
  ],
  [
    '权素安',
    {
      price: 20,
      name: '权素安 主播合集',
      url: 'https://pan.baidu.com/j/1fOvADdgucA',
      allowUpdate: false,
    },
  ],
  [
    '素颖',
    {
      price: 20,
      name: '素颖 主播合集',
      url: 'https://pan.baidu.com/j/1dsjomjbeF',
      allowUpdate: false,
    },
  ],
  [
    '鹿小姐',
    {
      price: 20,
      name: '鹿小姐 主播合集',
      url: 'https://pan.baidu.com/j/1PePrGwmTH',
      allowUpdate: false,
    },
  ],
  [
    'Luan',
    {
      price: 15,
      name: 'Luan 主播合集',
      url: 'https://pan.baidu.com/j/1XgjbAPxOJu',
      allowUpdate: false,
    },
  ],
  [
    'Saebom',
    {
      price: 15,
      name: 'Saebom 主播合集',
      url: 'https://pan.baidu.com/j/1BERuvqAhOZ',
      allowUpdate: true,
    },
  ],
  [
    'gpflad',
    {
      price: 15,
      name: 'gpflad 主播合集',
      url: 'https://pan.baidu.com/j/1nITNjBxJOa',
      allowUpdate: true,
    },
  ],
  [
    '叶璃',
    {
      price: 15,
      name: '叶璃 主播合集',
      url: 'https://pan.baidu.com/j/1myGUJmRUlF',
      allowUpdate: false,
    },
  ],
  [
    '玛丽',
    {
      price: 15,
      name: '玛丽 主播合集',
      url: 'https://pan.baidu.com/j/1ZjJgujQsLk',
      allowUpdate: false,
    },
  ],
  [
    '米蒂',
    {
      price: 15,
      name: '米蒂 主播合集',
      url: 'https://pan.baidu.com/j/1IeBSlAvZMX',
      allowUpdate: false,
    },
  ],
  [
    '蔡丽',
    {
      price: 15,
      name: '蔡丽 主播合集',
      url: 'https://pan.baidu.com/j/1ddBrVjQOmu',
      allowUpdate: false,
    },
  ],
  [
    'RKGUS',
    {
      price: 10,
      name: 'RKGUS 主播合集',
      url: 'https://pan.baidu.com/j/1WRgPqYetJD',
      allowUpdate: false,
    },
  ],
  [
    'godlita',
    {
      price: 10,
      name: 'godlita 主播合集',
      url: 'https://pan.baidu.com/j/1QFdBIoTPsv',
      allowUpdate: false,
    },
  ],
  [
    'ooeeejj',
    {
      price: 10,
      name: 'ooeeejj 主播合集',
      url: 'https://pan.baidu.com/j/1SOPvjDfJ',
      allowUpdate: true,
    },
  ],
  [
    'vivaciou',
    {
      price: 10,
      name: 'vivaciou 主播合集',
      url: 'https://pan.baidu.com/j/1SSBesFsRf',
      allowUpdate: false,
    },
  ],
  [
    'ych',
    {
      price: 10,
      name: 'ych 主播合集',
      url: 'https://pan.baidu.com/j/1jcUjlqBdxE',
      allowUpdate: true,
    },
  ],
  [
    '世萝',
    {
      price: 10,
      name: '世萝 主播合集',
      url: 'https://pan.baidu.com/j/1EmkuPPju',
      allowUpdate: false,
    },
  ],
  [
    '丹比',
    {
      price: 10,
      name: '丹比 主播合集',
      url: 'https://pan.baidu.com/j/1tYuUHjjYcu',
      allowUpdate: false,
    },
  ],
  [
    '哈朗',
    {
      price: 10,
      name: '哈朗 主播合集',
      url: 'https://pan.baidu.com/j/1cFrmroOMn',
      allowUpdate: false,
    },
  ],
  [
    '娜比',
    {
      price: 10,
      name: '娜比 主播合集',
      url: 'https://pan.baidu.com/j/1nXjQhZDPuC',
      allowUpdate: false,
    },
  ],
  [
    '尼纳',
    {
      price: 10,
      name: '尼纳 主播合集',
      url: 'https://pan.baidu.com/j/1mJzuKSbAdl',
      allowUpdate: false,
    },
  ],
  [
    '敏彩',
    {
      price: 10,
      name: '敏彩 主播合集',
      url: 'https://pan.baidu.com/j/1PUIHaXZgTc',
      allowUpdate: false,
    },
  ],
  [
    '艾文',
    {
      price: 10,
      name: '艾文 主播合集',
      url: 'https://pan.baidu.com/j/1qXPPDdsojd',
      allowUpdate: false,
    },
  ],
  [
    '莉雅',
    {
      price: 10,
      name: '莉雅 主播合集',
      url: 'https://pan.baidu.com/j/1svjwGORab',
      allowUpdate: false,
    },
  ],
  [
    '金瑟姬',
    {
      price: 10,
      name: '金瑟姬 主播合集',
      url: 'https://pan.baidu.com/j/1NDCDOtsPR',
      allowUpdate: false,
    },
  ],
  [
    '露珠',
    {
      price: 10,
      name: '露珠 主播合集',
      url: 'https://pan.baidu.com/j/1lPhQPcsrXb',
      allowUpdate: false,
    },
  ],
  [
    '韩玉荷',
    {
      price: 10,
      name: '韩玉荷 主播合集',
      url: 'https://pan.baidu.com/j/1LBKtBbAzyE',
      allowUpdate: false,
    },
  ],
]);

/**
 * 最新主播（上新）列表：手动维护 goodsId（顺序即展示顺序）
 * 说明：上新是业务口径，不建议用文件时间/价格等信号自动推导。
 */
export const newAnchorGoodsIds: string[] = [
  // 示例：
  'golaniyule0',
  'askl',
  'a77',
  'gpgp',
];

export const avatarFramesMap = new Map<string, { price: number; name: string }>(
  [
    ['斩兽之刃', { price: avatarPrices['斩兽之刃'], name: '斩兽之刃' }],
    ['不良人', { price: avatarPrices['不良人'], name: '不良人' }],
    ['少年歌行', { price: avatarPrices['少年歌行'], name: '少年歌行' }],
    ['斯莱特林', { price: avatarPrices['斯莱特林'], name: '斯莱特林' }],
    ['碧蓝航线', { price: avatarPrices['碧蓝航线'], name: '碧蓝航线' }],
    ['巅峰荣耀', { price: avatarPrices['巅峰荣耀'], name: '巅峰荣耀' }],
    ['中野二乃', { price: avatarPrices['中野二乃'], name: '中野二乃' }],
    ['至尊戒', { price: avatarPrices['至尊戒'], name: '至尊戒' }],
    ['大王不高兴', { price: avatarPrices['大王不高兴'], name: '大王不高兴' }],
    ['精灵王', { price: avatarPrices['精灵王'], name: '精灵王' }],
    ['格兰芬多', { price: avatarPrices['格兰芬多'], name: '格兰芬多' }],
    ['拳皇', { price: avatarPrices['拳皇'], name: '拳皇' }],
    ['梦100', { price: avatarPrices['梦100'], name: '梦100' }],
    ['赫奇帕奇', { price: avatarPrices['赫奇帕奇'], name: '赫奇帕奇' }],
    ['拉文克劳', { price: avatarPrices['拉文克劳'], name: '拉文克劳' }],
    ['择天记', { price: avatarPrices['择天记'], name: '择天记' }],
    ['异常生物', { price: avatarPrices['异常生物'], name: '异常生物' }],
    ['灵笼', { price: avatarPrices['灵笼'], name: '灵笼' }],
    [
      '快把我哥带走',
      { price: avatarPrices['快把我哥带走'], name: '快把我哥带走' },
    ],
    ['记忆U盘', { price: avatarPrices['记忆U盘'], name: '记忆U盘' }],
    ['全职高手', { price: avatarPrices['全职高手'], name: '全职高手' }],
    ['黑白无双', { price: avatarPrices['黑白无双'], name: '黑白无双' }],
    ['梦塔雪谜城', { price: avatarPrices['梦塔雪谜城'], name: '梦塔雪谜城' }],
    ['碧蓝之海', { price: avatarPrices['碧蓝之海'], name: '碧蓝之海' }],
    ['中野四叶', { price: avatarPrices['中野四叶'], name: '中野四叶' }],
    ['纳米核心', { price: avatarPrices['纳米核心'], name: '纳米核心' }],
    ['万界仙踪', { price: avatarPrices['万界仙踪'], name: '万界仙踪' }],
    ['请吃红小豆', { price: avatarPrices['请吃红小豆'], name: '请吃红小豆' }],
    [
      '公主连结可可萝',
      { price: avatarPrices['公主连结可可萝'], name: '公主连结可可萝' },
    ],
    ['沈剑心', { price: avatarPrices['沈剑心'], name: '沈剑心' }],
    [
      '不吉波普不笑',
      { price: avatarPrices['不吉波普不笑'], name: '不吉波普不笑' },
    ],
    [
      '春原庄的管理人小姐',
      { price: avatarPrices['春原庄的管理人小姐'], name: '春原庄的管理人小姐' },
    ],
    ['汉化日记', { price: avatarPrices['汉化日记'], name: '汉化日记' }],
    [
      '喂看见耳朵啦',
      { price: avatarPrices['喂看见耳朵啦'], name: '喂看见耳朵啦' },
    ],
    [
      '公主连结佩可莉姆',
      { price: avatarPrices['公主连结佩可莉姆'], name: '公主连结佩可莉姆' },
    ],
    ['工作细胞', { price: avatarPrices['工作细胞'], name: '工作细胞' }],
    ['血色苍穹', { price: avatarPrices['血色苍穹'], name: '血色苍穹' }],
    ['凹凸世界', { price: avatarPrices['凹凸世界'], name: '凹凸世界' }],
    ['圣诞节快乐', { price: avatarPrices['圣诞节快乐'], name: '圣诞节快乐' }],
    ['王子碰碰球', { price: avatarPrices['王子碰碰球'], name: '王子碰碰球' }],
    ['中野一花', { price: avatarPrices['中野一花'], name: '中野一花' }],
    [
      '画江湖之侠岚',
      { price: avatarPrices['画江湖之侠岚'], name: '画江湖之侠岚' },
    ],
    ['萌妻食神', { price: avatarPrices['萌妻食神'], name: '萌妻食神' }],
    ['平安物语', { price: avatarPrices['平安物语'], name: '平安物语' }],
    ['斗破苍穹', { price: avatarPrices['斗破苍穹'], name: '斗破苍穹' }],
    ['地中海', { price: avatarPrices['地中海'], name: '地中海' }],
    ['刀说异数', { price: avatarPrices['刀说异数'], name: '刀说异数' }],
    ['少女前线', { price: avatarPrices['少女前线'], name: '少女前线' }],
    ['茶啊二中', { price: avatarPrices['茶啊二中'], name: '茶啊二中' }],
    [
      '我家大师兄脑子有坑',
      { price: avatarPrices['我家大师兄脑子有坑'], name: '我家大师兄脑子有坑' },
    ],
    ['暮光幻影', { price: avatarPrices['暮光幻影'], name: '暮光幻影' }],
    ['中野三玖', { price: avatarPrices['中野三玖'], name: '中野三玖' }],
    [
      'InfiniTForce',
      { price: avatarPrices['InfiniTForce'], name: 'InfiniTForce' },
    ],
    ['拾又之国', { price: avatarPrices['拾又之国'], name: '拾又之国' }],
    ['天谕', { price: avatarPrices['天谕'], name: '天谕' }],
    ['刺客伍六七', { price: avatarPrices['刺客伍六七'], name: '刺客伍六七' }],
    [
      '公主连结凯露',
      { price: avatarPrices['公主连结凯露'], name: '公主连结凯露' },
    ],
    ['citrus', { price: avatarPrices['citrus'], name: 'citrus' }],
    ['中野五月', { price: avatarPrices['中野五月'], name: '中野五月' }],
    ['领风者', { price: avatarPrices['领风者'], name: '领风者' }],
  ],
);
