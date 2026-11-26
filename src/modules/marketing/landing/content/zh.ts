/** Chinese (Simplified) — have a native speaker review before launch. */
import type { LandingContent } from './types'

export const zh: LandingContent = {
     meta: {
          title: 'tok·scan — 柬埔寨餐厅的扫码点餐与结账系统',
          description:
               '顾客用手机点餐，厨房即时看到，账单通过 KHQR 支付。一家餐厅或二十家门店皆适用。',
     },
     header: {
          nav: {
               features: '功能',
               how: '使用方式',
               pricing: '价格',
               chains: '连锁门店',
               faq: '常见问题',
          },
          login: '登录',
          startTrial: '免费试用',
          freeTrial: '免费试用',
          openMenu: '打开菜单',
          closeMenu: '关闭菜单',
          menu: '菜单',
          mainNav: '主导航',
          premiumTeaser: '5 家门店 · 自定义域名 · 高级分析',
          perMonth: '/ 月',
          questions: '有疑问？Telegram',
     },
     hero: {
          eyebrow: '为柬埔寨餐厅打造的扫码点餐与结账',
          titleLine1: '扫码。点餐。支付。',
          titleLine2: '每一张桌。',
          body: '顾客用手机点餐，厨房即时看到，账单在顾客要求结账前就已通过 KHQR 付清——无论是一家餐厅还是二十家门店。',
          bodyShort: '顾客用手机点餐并通过 KHQR 支付——无需下载应用，无需等待结账。',
          primaryCta: '免费试用 14 天',
          secondaryCta: '预约演示',
          checks: ['无需信用卡', '15 分钟完成设置', '支持高棉语和英语'],
          paymentsLabel: '支持的付款方式',
          payments: ['KHQR', 'ABA PayWay', 'Visa · Mastercard', '现金'],
          visualLabel:
               '顾客手机上的 tok-scan：阿莫克鱼菜单卡、已支付的 KHQR 账单，以及 7 号桌的厨房小票',
          visual: {
               signature: '招牌',
               dish: '阿莫克鱼',
               dishDescription: '椰浆咖喱蒸鱼，香蕉叶盛装。',
               add: '添加',
               paid: '已支付',
               ticketItem: '2× 阿莫克鱼',
               ticketNote: '不要辣 · 加米饭',
               markReady: '标记完成',
          },
     },
     socialProof: {
          label: '已在使用 tok·scan 的餐厅',
          region: '客户',
     },
     how: {
          eyebrow: '使用方式',
          title: '从入座到付款，只需三步',
          body: '顾客无需安装应用，您也无需购买新设备。只要有手机和平板，今晚就能开始使用。',
          steps: {
               scan: {
                    title: '顾客扫码',
                    body: '每张桌子都有专属二维码。菜单在浏览器中打开——无需安装，系统已知道桌号。',
               },
               cook: {
                    title: '厨房制作',
                    body: '订单几秒内显示在厨房屏幕上，备注和过敏信息以琥珀色标出。再也不会丢失纸质单据。',
               },
               pay: {
                    title: 'KHQR 支付',
                    body: '所有订单合并为一张账单。顾客可用 KHQR、ABA、银行卡或现金支付——银行确认后才标记为已付款。',
               },
          },
     },
     features: {
          eyebrow: '功能',
          title: '繁忙餐厅所需的一切',
          compare: '比较方案',
          items: {
               menu: {
                    title: '扫码菜单与点餐',
                    body: '照片、规格、加料、售罄状态，以及拇指易触的购物车。',
               },
               kitchen: {
                    title: '厨房显示屏',
                    body: '按工位实时显示订单、超时提醒，每个新订单都有提示音。',
               },
               split: {
                    title: '收银与分单',
                    body: '可平均分摊、按菜品或自定义金额分单。找零以美元和瑞尔显示。',
               },
               khqr: {
                    title: 'KHQR 与 ABA PayWay',
                    body: '每张账单生成动态二维码，自动核验。重复付款会被拦截。',
               },
               outlets: {
                    title: '多门店',
                    body: '整个集团共用一份菜单，各门店可设置自己的价格和库存。',
               },
               reports: {
                    title: '销售报表',
                    body: '营业额、畅销菜品、高峰时段和付款方式——可导出 CSV 或 PDF。',
               },
          },
     },
     chains: {
          eyebrow: '连锁门店',
          title: '一份菜单。所有门店。一个账号。',
          body: '在一个组织中管理所有门店：共享菜单并按门店设置价格和库存，每位员工在各门店拥有各自的角色，并可查看整个集团的报表。',
          points: [
               '在侧边栏中切换门店',
               '在一家门店当经理，在另一家当收银员——同一个账号',
               '每家门店可使用自己的 KHQR 商户号',
               'Premium 和 Chain 方案支持自定义域名',
          ],
          diagramLabel: '包含三家门店的组织示例',
          platform: 'tok·scan 平台',
          platformSub: '方案 · 审核 · 支付合作伙伴',
          organization: '组织——“Mahob Group”',
          organizationSub: '所有者和成员 · 共享菜单 · 标志和颜色',
          tables: { other: '{count} 张桌' },
          staff: { other: '{count} 名员工' },
          areas: {
               bkk1: '金边 240 街',
               riverside: '西索瓦码头',
               aeon: '森速 · 美食广场',
          },
          note: '单店餐厅就是只有一家门店的组织——开第二家分店时无需迁移数据。',
     },
     pricing: {
          eyebrow: '价格',
          title: '按组织计费的简单方案',
          body: '所有方案均可免费试用 14 天。随业务增长添加门店。',
          billingPeriod: '计费周期',
          monthly: '按月',
          yearly: '按年',
          yearlyNote: '免 2 个月',
          perMonth: '/ 月',
          billedYearly: '每年 {amount}',
          billedMonthly: '按月计费',
          volume: '按规模定价',
          custom: '定制',
          note: '价格以美元计。顾客付款（KHQR、ABA、银行卡、现金）直接进入您自己的商户账户——tok·scan 只收取订阅费。',
          plans: {
               starter: {
                    limits: '{outlets} 家门店 · {tables} 张桌 · {staff} 名员工',
                    features: ['扫码菜单与点餐', '厨房与收银', 'KHQR 与现金'],
                    cta: '免费试用',
                    badge: '',
               },
               growth: {
                    limits: '{outlets} 家门店 · {tables} 张桌 · {staff} 名员工',
                    features: ['包含 Starter 全部功能', '分单与部分付款', '报表与导出'],
                    cta: '免费试用',
                    badge: '最受欢迎',
               },
               premium: {
                    limits: '{outlets} 家门店 · {tables} 张桌 · {staff} 名员工',
                    features: [
                         '包含 Growth 全部功能',
                         '自定义域名 · 无 tok·scan 页脚',
                         '高级分析与会员积分',
                         '优先支持',
                    ],
                    cta: '免费试用',
                    badge: '✦ Premium',
               },
               chain: {
                    limits: '门店数量不限 · API',
                    features: ['包含 Premium 全部功能', 'API 与会计系统集成', '专属客户经理与 SLA'],
                    cta: '联系销售',
                    badge: '',
               },
          },
     },
     faq: {
          eyebrow: '常见问题',
          title: '餐厅老板常问的问题',
          curious: '还有疑问？欢迎通过以下方式联系我们：',
          items: [
               {
                    q: '顾客需要下载应用吗？',
                    a: '不需要。顾客扫描桌上的二维码，菜单就会在手机浏览器中打开。适用于任何智能手机，支持高棉语或英语。',
               },
               {
                    q: '顾客付款的钱什么时候到账？',
                    a: '通过 KHQR、ABA 或银行卡的付款会直接进入您自己的商户账户——tok·scan 从不经手您的资金。我们只收取每月订阅费。',
               },
               {
                    q: '我可以用一份菜单管理多家分店吗？',
                    a: '可以。一个组织可以有多家门店。菜单共享，每家门店都可以自行调整价格或将菜品标记为售罄。',
               },
               {
                    q: '我需要特殊的打印机或硬件吗？',
                    a: '不需要。厨房显示屏可在任何平板上运行，收银界面可在任何笔记本电脑上运行。发票和 80 毫米小票可直接从浏览器打印到您现有的打印机。',
               },
               {
                    q: '14 天试用结束后会怎样？',
                    a: '选择一个方案即可继续使用——不会删除任何数据。您可以立即创建菜单并接受现金订单；我们的团队快速审核后，即可开通在线支付。',
               },
          ],
     },
     finalCta: {
          title: '本周就把菜单放上每一张桌子。',
          body: '免费试用 14 天 · 15 分钟完成设置 · 随时取消',
          primary: '免费试用',
          secondary: '联系销售',
     },
     footer: {
          blurb: '面向柬埔寨餐厅的扫码点餐、厨房显示屏和 KHQR 结账系统。“Tok” 在高棉语中意为“桌子”。',
          payments: 'KHQR · ABA PayWay · Visa · Mastercard · 现金',
          columns: { product: '产品', company: '公司', legal: '法律' },
          links: {
               features: '功能',
               pricing: '价格',
               chains: '连锁门店',
               contact: '联系我们',
               telegram: 'Telegram',
               terms: '服务条款',
               privacy: '隐私政策',
          },
          rights: '© {year} tok-scan。保留所有权利。',
          tagline: '扫码 · 点餐 · 支付',
     },
}
