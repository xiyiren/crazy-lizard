// ===== Internationalization =====

const TRANSLATIONS = {
  zh: {
    nav: {
      home: '塔罗占卜',
      history: '历史记录',
    },
    welcome: {
      title: '塔罗占卜',
      subtitle: '探索你的命运之路',
      desc: '静下心来，聆听内心深处的回响',
      start: '开始占卜',
    },
    language: {
      title: '选择语言',
      desc: 'Choose your preferred language',
      chinese: '简体中文',
      english: 'English',
    },
    spread: {
      title: '选择牌阵',
      desc: 'Choose your spread',
      ppf: '过去 · 现在 · 未来',
      ppfDesc: '了解时间线上的能量流转',
      bms: '身 · 心 · 灵',
      bmsDesc: '探索你存在的不同层面',
    },
    wizard: {
      prev: '上一题',
      next: '下一步',
      start: '开始占卜',
      finish: '完成',
    },
    shuffle: {
      text: '命运之轮正在转动...',
      hint: '感受卡牌的能量',
    },
    draw: {
      text: '你的牌已经到来...',
    },
    result: {
      title: '你的占卜结果',
      save: '保存记录',
      download: '保存为图片',
      new: '重新占卜',
      saved: '✓ 已保存',
      upright: '正位',
      reversed: '逆位',
      summary: '综合解读',
      summaryText: '三张牌相互呼应，共同揭示了你当前的能量状态。信任你的直觉，让这些信息引导你前行。',
    },
    history: {
      title: '占卜历史',
      empty: '暂无占卜记录',
      startNew: '开始新的占卜',
      ppf: '过去-现在-未来',
      bms: '身-心-灵',
      viewDetail: '查看详情',
      delete: '删除',
      deleted: '已删除',
    },
    modal: {
      close: '关闭',
    },
    error: {
      storage: '存储空间不足，历史记录无法保存',
      image: '图片生成失败，请重试',
    },
  },

  en: {
    nav: {
      home: 'Tarot',
      history: 'History',
    },
    welcome: {
      title: 'Tarot',
      subtitle: 'Discover Your Path',
      desc: 'Quiet your mind and listen to the whispers within',
      start: 'Begin Reading',
    },
    language: {
      title: 'Choose Language',
      desc: '选择你的语言',
      chinese: '中文',
      english: 'English',
    },
    spread: {
      title: 'Choose Your Spread',
      desc: 'Select a spread type',
      ppf: 'Past · Present · Future',
      ppfDesc: 'Understand the flow of energy through time',
      bms: 'Body · Mind · Spirit',
      bmsDesc: 'Explore the layers of your being',
    },
    wizard: {
      prev: 'Previous',
      next: 'Next',
      start: 'Begin Reading',
      finish: 'Finish',
    },
    shuffle: {
      text: 'The wheel of fate is turning...',
      hint: 'Feel the energy of the cards',
    },
    draw: {
      text: 'Your cards have arrived...',
    },
    result: {
      title: 'Your Reading',
      save: 'Save Reading',
      download: 'Save as Image',
      new: 'New Reading',
      saved: '✓ Saved',
      upright: 'Upright',
      reversed: 'Reversed',
      summary: 'Overall Interpretation',
      summaryText: 'These three cards work together to reveal your current energy. Trust your intuition and let their wisdom guide you forward.',
    },
    history: {
      title: 'Reading History',
      empty: 'No readings yet',
      startNew: 'Start New Reading',
      ppf: 'Past-Present-Future',
      bms: 'Body-Mind-Spirit',
      viewDetail: 'View Details',
      delete: 'Delete',
      deleted: 'Deleted',
    },
    modal: {
      close: 'Close',
    },
    error: {
      storage: 'Storage is full. History cannot be saved.',
      image: 'Failed to generate image. Please try again.',
    },
  },
};

function t(key, lang) {
  const keys = key.split('.');
  let obj = TRANSLATIONS[lang || 'zh'];
  for (const k of keys) {
    if (obj && obj[k] !== undefined) {
      obj = obj[k];
    } else {
      return key;
    }
  }
  return obj;
}

