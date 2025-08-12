import { create } from 'zustand'

export const useAppStore = create((set, get) => ({
  // 用户状态
  user: {
    id: null,
    username: '',
    avatar: '',
    location: null,
    mood: 'default',
    vCoins: 100
  },

  // 当前情绪状态
  currentMood: 'default',
  setCurrentMood: (mood) => set({ currentMood: mood }),

  // 3D场景状态
  sceneSettings: {
    enableParticles: true,
    enable3DEffects: true,
    performanceMode: 'high'
  },

  // 定位相关
  location: {
    latitude: null,
    longitude: null,
    accuracy: null
  },
  setLocation: (location) => set({ location }),

  // 匿名聊天状态
  anonymousMode: false,
  setAnonymousMode: (mode) => set({ anonymousMode: mode }),

  // 附近的人
  nearbyUsers: [],
  setNearbyUsers: (users) => set({ nearbyUsers: users }),

  // 动态数据
  feeds: [],
  setFeeds: (feeds) => set({ feeds }),
  addFeed: (feed) => set((state) => ({ 
    feeds: [feed, ...state.feeds] 
  })),

  // 聊天数据
  conversations: [],
  setConversations: (conversations) => set({ conversations }),
  addMessage: (conversationId, message) => set((state) => ({
    conversations: state.conversations.map(conv => 
      conv.id === conversationId 
        ? { ...conv, messages: [...conv.messages, message] }
        : conv
    )
  })),

  // 组局活动
  activities: [],
  setActivities: (activities) => set({ activities }),
  addActivity: (activity) => set((state) => ({
    activities: [activity, ...state.activities]
  })),

  // AR标签
  arTags: [],
  setArTags: (tags) => set({ arTags: tags }),
  addArTag: (tag) => set((state) => ({
    arTags: [...state.arTags, tag]
  })),

  // 通知系统
  notifications: [],
  addNotification: (notification) => set((state) => ({
    notifications: [...state.notifications, {
      id: Date.now(),
      timestamp: new Date(),
      ...notification
    }]
  })),
  removeNotification: (id) => set((state) => ({
    notifications: state.notifications.filter(n => n.id !== id)
  })),

  // 设置
  settings: {
    enableLocationSharing: true,
    enableNotifications: true,
    privacyMode: 'normal', // normal, strict, anonymous
    theme: 'vibrant'
  },
  updateSettings: (newSettings) => set((state) => ({
    settings: { ...state.settings, ...newSettings }
  })),

  // 初始化应用
  initializeApp: async () => {
    try {
      // 获取用户位置
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            set({
              location: {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                accuracy: position.coords.accuracy
              }
            })
          },
          (error) => {
            console.warn('无法获取位置信息:', error)
          }
        )
      }

      // 加载用户数据
      const userData = localStorage.getItem('vibelink_user')
      if (userData) {
        set({ user: JSON.parse(userData) })
      }

      // 加载设置
      const settings = localStorage.getItem('vibelink_settings')
      if (settings) {
        set({ settings: JSON.parse(settings) })
      }

    } catch (error) {
      console.error('应用初始化失败:', error)
    }
  },

  // 保存用户数据
  saveUserData: () => {
    const { user, settings } = get()
    localStorage.setItem('vibelink_user', JSON.stringify(user))
    localStorage.setItem('vibelink_settings', JSON.stringify(settings))
  }
}))