module.exports = {
  title: 'JavaScript设计模式',
  description: 'javascript设计模式实践整理',
  themeConfig: {
    nav: [
      { text: '首页', link: '/' },
      { text: '基础提要', link: '/base/' },
      { text: '设计模式', link: '/designMode/' },
      { text: '设计原则', link: '/designSkill/' },
      { text: '关于', link: '/about' },
    ],
    sidebar: {
      '/base/': [
        '',
        'oop',
//      'fooTwo'
      ],
      '/designMode/': [
        '',
        'barOne',
        'barTwo'
      ],
      '/designSkill/': [
        ''
      ]
    },
    displayAllHeaders: true, // 默认值：false
    search: true,
    searchMaxSuggestions: 10
  }
}
