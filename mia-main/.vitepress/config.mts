import { defineConfig } from 'vitepress'

export default defineConfig({
  title: "Mia 2.0",
  description: "实盘交易IP - 完整知识体系文档",
  lang: 'zh-CN',
  ignoreDeadLinks: true,
  
  head: [
    ['meta', { name: 'theme-color', content: '#646cff' }],
    ['meta', { name: 'og:type', content: 'website' }],
    ['meta', { name: 'og:title', content: 'Mia 2.0 - 实盘交易知识体系' }],
    ['meta', { name: 'og:description', content: '专业知识普及 + 机制详解 + 90天执行计划' }]
  ],

  themeConfig: {
    nav: [
      { text: '首页', link: '/' },
      { text: '专业知识', link: '/knowledge/module-1' },
      { text: '执行框架', link: '/execution/day-1-7' },
      { text: '📊 我的进度', link: '/progress' },
      { text: '快速查询', link: '/reference/quick-reference' }
    ],

    sidebar: {
      '/knowledge/': [
        {
          text: '第一部分：专业知识体系',
          items: [
            {
              text: '模块1: CEX基础操作',
              link: '/knowledge/module-1',
              collapsed: false,
              items: [
                { text: '1.1 账户注册与安全', link: '/knowledge/module-1#账户注册与安全设置' },
                { text: '1.2 法币入金', link: '/knowledge/module-1#法币入金' },
                { text: '1.3 现货交易', link: '/knowledge/module-1#现货交易' },
                { text: '1.4 看懂K线', link: '/knowledge/module-1#看懂k线' }
              ]
            },
            {
              text: '模块2: 链上操作与Meme币',
              link: '/knowledge/module-2',
              collapsed: false,
              items: [
                { text: '2.1 Web3钱包', link: '/knowledge/module-2#web3钱包' },
                { text: '2.2 DEX交易', link: '/knowledge/module-2#去中心化交易所' }
              ]
            },
            {
              text: '模块3: 合约交易深度解析',
              link: '/knowledge/module-3',
              collapsed: false,
              items: [
                { text: '3.1 永续合约本质', link: '/knowledge/module-3#永续合约的本质' },
                { text: '3.2 杠杆机制', link: '/knowledge/module-3#杠杆机制' },
                { text: '3.3 保证金模式', link: '/knowledge/module-3#保证金模式' },
                { text: '3.4 资金费率', link: '/knowledge/module-3#资金费率' },
                { text: '3.5 合约实操', link: '/knowledge/module-3#合约交易实操' }
              ]
            },
            {
              text: '模块4: 一级市场与打新',
              link: '/knowledge/module-4',
              collapsed: false,
              items: [
                { text: '4.1 一级市场本质', link: '/knowledge/module-4#一级市场的本质' },
                { text: '4.2 IEO打新详解', link: '/knowledge/module-4#ieo打新详解' },
                { text: '4.3 白名单获取', link: '/knowledge/module-4#如何获得一级市场资格' }
              ]
            },
            {
              text: '模块5: 技术分析基础',
              link: '/knowledge/module-5',
              collapsed: false,
              items: [
                { text: '5.1 K线形态进阶', link: '/knowledge/module-5#k线形态进阶' },
                { text: '5.2 技术指标入门', link: '/knowledge/module-5#技术指标入门' }
              ]
            }
          ]
        }
      ],
      '/execution/': [
        {
          text: '第二部分：执行框架',
          items: [
            { text: 'Day 1-7: 基础搭建周', link: '/execution/day-1-7' },
            { text: 'Day 8-30: 技能习得月', link: '/execution/day-8-30' },
            { text: 'Day 31-90: IP建立季', link: '/execution/day-31-90' }
          ]
        }
      ],
      '/reference/': [
        {
          text: '附录与快速查询',
          items: [
            { text: '快速查询表', link: '/reference/quick-reference' },
            { text: '新手常见错误', link: '/reference/common-mistakes' },
            { text: '安全铁律', link: '/reference/security-rules' },
            { text: '工具推荐', link: '/reference/tools' }
          ]
        }
      ]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/yourusername/mia-trading-docs' }
    ],

    footer: {
      message: '⚠️ 风险提示：加密货币交易有风险，投资需谨慎。本文档仅供学习参考。',
      copyright: 'Copyright © 2025 Mia Trading Docs'
    },

    search: {
      provider: 'local',
      options: {
        locales: {
          root: {
            translations: {
              button: {
                buttonText: '搜索文档',
                buttonAriaLabel: '搜索文档'
              },
              modal: {
                noResultsText: '无法找到相关结果',
                resetButtonTitle: '清除查询条件',
                footer: {
                  selectText: '选择',
                  navigateText: '切换'
                }
              }
            }
          }
        }
      }
    },

    outline: {
      level: [2, 3],
      label: '页面导航'
    },

    docFooter: {
      prev: '上一页',
      next: '下一页'
    },

    lastUpdated: {
      text: '最后更新于',
      formatOptions: {
        dateStyle: 'short',
        timeStyle: 'short'
      }
    }
  },

  lastUpdated: true,
  cleanUrls: true,

  markdown: {
    lineNumbers: true,
    theme: {
      light: 'github-light',
      dark: 'github-dark'
    }
  }
})

