import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import styled from 'styled-components'
import { motion, AnimatePresence } from 'framer-motion'

// 导入页面组件
import HomePage from './pages/HomePage'
import FeedPage from './pages/FeedPage'
import PublishPage from './pages/PublishPage'
import ChatPage from './pages/ChatPage'
import ProfilePage from './pages/ProfilePage'
import LoadingScreen from './components/LoadingScreen'
import Navigation from './components/Navigation'

// 全局状态管理
import { useAppStore } from './store/appStore'

const AppContainer = styled.div`
  width: 100vw;
  height: 100vh;
  position: relative;
  overflow: hidden;
  background: ${props => props.moodGradient};
  transition: background 0.5s ease;
`

const PageContainer = styled(motion.div)`
  width: 100%;
  height: 100%;
  position: relative;
  padding-bottom: 80px; /* 为底部导航留空间 */
`

function App() {
  const [isLoading, setIsLoading] = useState(true)
  const { currentMood, setCurrentMood } = useAppStore()

  // 情绪化背景渐变
  const moodGradients = {
    excited: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #fecfef 100%)',
    calm: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
    energetic: 'linear-gradient(135deg, #ff6b6b 0%, #feca57 100%)',
    default: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
  }

  // 页面切换动画配置
  const pageVariants = {
    initial: { 
      opacity: 0, 
      scale: 0.95,
      rotateY: -10 
    },
    in: { 
      opacity: 1, 
      scale: 1,
      rotateY: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    },
    out: { 
      opacity: 0, 
      scale: 1.05,
      rotateY: 10,
      transition: {
        duration: 0.3,
        ease: "easeIn"
      }
    }
  }

  useEffect(() => {
    // 模拟加载过程
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return <LoadingScreen />
  }

  return (
    <Router>
      <AppContainer moodGradient={moodGradients[currentMood] || moodGradients.default}>
        <AnimatePresence mode="wait">
          <Routes>
            <Route 
              path="/" 
              element={
                <PageContainer
                  key="home"
                  initial="initial"
                  animate="in"
                  exit="out"
                  variants={pageVariants}
                >
                  <HomePage />
                </PageContainer>
              } 
            />
            <Route 
              path="/feed" 
              element={
                <PageContainer
                  key="feed"
                  initial="initial"
                  animate="in"
                  exit="out"
                  variants={pageVariants}
                >
                  <FeedPage />
                </PageContainer>
              } 
            />
            <Route 
              path="/publish" 
              element={
                <PageContainer
                  key="publish"
                  initial="initial"
                  animate="in"
                  exit="out"
                  variants={pageVariants}
                >
                  <PublishPage />
                </PageContainer>
              } 
            />
            <Route 
              path="/chat" 
              element={
                <PageContainer
                  key="chat"
                  initial="initial"
                  animate="in"
                  exit="out"
                  variants={pageVariants}
                >
                  <ChatPage />
                </PageContainer>
              } 
            />
            <Route 
              path="/profile" 
              element={
                <PageContainer
                  key="profile"
                  initial="initial"
                  animate="in"
                  exit="out"
                  variants={pageVariants}
                >
                  <ProfilePage />
                </PageContainer>
              } 
            />
          </Routes>
        </AnimatePresence>
        
        <Navigation />
      </AppContainer>
    </Router>
  )
}

export default App