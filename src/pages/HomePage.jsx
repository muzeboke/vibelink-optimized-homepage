import React, { useState, useRef, useEffect } from 'react'
import styled from 'styled-components'
import { motion, AnimatePresence } from 'framer-motion'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Text, Sphere, MeshDistortMaterial } from '@react-three/drei'
import { useAppStore } from '../store/appStore'

const HomeContainer = styled.div`
  width: 100%;
  height: 100vh;
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%),
      radial-gradient(circle at 40% 40%, rgba(120, 219, 255, 0.2) 0%, transparent 50%);
    animation: backgroundShift 20s ease-in-out infinite;
    pointer-events: none;
  }
  
  @keyframes backgroundShift {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.8; }
  }
`

const Header = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  padding: 20px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  
  @media (max-width: 768px) {
    padding: 15px;
  }
`

const UserInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: white;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 15px;
    align-items: flex-start;
  }
`

const Greeting = styled(motion.div)`
  flex: 1;
  
  h2 {
    font-size: 28px;
    font-weight: 700;
    margin-bottom: 6px;
    background: linear-gradient(135deg, #ffffff 0%, #f0f0f0 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  
  p {
    font-size: 16px;
    opacity: 0.9;
    font-weight: 400;
  }
  
  @media (max-width: 768px) {
    h2 {
      font-size: 24px;
    }
    
    p {
      font-size: 14px;
    }
  }
`

const MoodSelector = styled.div`
  display: flex;
  gap: 10px;
  background: rgba(255, 255, 255, 0.1);
  padding: 8px;
  border-radius: 25px;
  backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  
  @media (max-width: 768px) {
    gap: 8px;
    padding: 6px;
  }
`

const MoodButton = styled(motion.button)`
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: none;
  font-size: 20px;
  cursor: pointer;
  background: ${props => props.active ? 
    'rgba(255, 255, 255, 0.3)' : 
    'rgba(255, 255, 255, 0.1)'
  };
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  position: relative;
  border: 2px solid ${props => props.active ? 
    'rgba(255, 255, 255, 0.5)' : 
    'transparent'
  };
  
  &:hover {
    transform: scale(1.1);
    background: rgba(255, 255, 255, 0.25);
    box-shadow: 0 8px 25px rgba(255, 255, 255, 0.2);
  }
  
  &::after {
    content: '';
    position: absolute;
    top: -2px;
    right: -2px;
    width: 12px;
    height: 12px;
    background: ${props => props.active ? '#4ade80' : 'transparent'};
    border-radius: 50%;
    border: 2px solid white;
    opacity: ${props => props.active ? 1 : 0};
    transition: opacity 0.3s ease;
  }
  
  @media (max-width: 768px) {
    width: 40px;
    height: 40px;
    font-size: 18px;
  }
`

const GalaxyContainer = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
`

const QuickActions = styled(motion.div)`
  position: absolute;
  top: 100px;
  right: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  z-index: 90;
  
  @media (max-width: 768px) {
    top: 120px;
    right: 15px;
    gap: 10px;
  }
`

const QuickActionButton = styled(motion.button)`
  width: 56px;
  height: 56px;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(20px);
  color: white;
  font-size: 24px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.25);
    transform: scale(1.1);
    box-shadow: 0 8px 25px rgba(255, 255, 255, 0.2);
  }
  
  @media (max-width: 768px) {
    width: 48px;
    height: 48px;
    font-size: 20px;
  }
`

const FunctionGrid = styled(motion.div)`
  position: absolute;
  bottom: 120px;
  left: 20px;
  right: 20px;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  z-index: 50;
  
  @media (max-width: 768px) {
    bottom: 100px;
    left: 15px;
    right: 15px;
    gap: 12px;
  }
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 10px;
  }
`

const FunctionCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(25px);
  border-radius: 24px;
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 16px;
  cursor: pointer;
  box-shadow: 
    0 8px 30px rgba(0, 0, 0, 0.1),
    0 2px 8px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.3);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: ${props => props.gradient || 'linear-gradient(90deg, #667eea, #764ba2)'};
    opacity: 0.8;
  }
  
  &:hover {
    transform: translateY(-8px) scale(1.02);
    box-shadow: 
      0 20px 50px rgba(0, 0, 0, 0.15),
      0 5px 15px rgba(0, 0, 0, 0.1);
  }
  
  @media (max-width: 768px) {
    padding: 20px;
    gap: 14px;
    border-radius: 20px;
  }
  
  @media (max-width: 480px) {
    padding: 18px;
    gap: 12px;
  }
`

const FunctionIcon = styled.div`
  width: 56px;
  height: 56px;
  border-radius: 18px;
  background: ${props => props.gradient};
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 26px;
  color: white;
  box-shadow: 
    0 8px 20px rgba(0, 0, 0, 0.15),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    inset: 2px;
    border-radius: 16px;
    background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 50%);
    pointer-events: none;
  }
  
  @media (max-width: 768px) {
    width: 48px;
    height: 48px;
    border-radius: 15px;
    font-size: 22px;
    
    &::after {
      border-radius: 13px;
    }
  }
`

const FunctionInfo = styled.div`
  flex: 1;
  
  h3 {
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 6px;
    color: #333;
    line-height: 1.2;
  }
  
  p {
    font-size: 14px;
    color: #666;
    line-height: 1.3;
    opacity: 0.8;
  }
  
  @media (max-width: 768px) {
    h3 {
      font-size: 16px;
      margin-bottom: 4px;
    }
    
    p {
      font-size: 12px;
    }
  }
`

const StatusContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  min-width: 40px;
`

const StatusIndicator = styled.div`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: ${props => props.active ? '#4CAF50' : '#FFC107'};
  box-shadow: 
    0 0 12px ${props => props.active ? '#4CAF50' : '#FFC107'},
    0 2px 4px rgba(0, 0, 0, 0.1);
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    inset: -3px;
    border-radius: 50%;
    background: ${props => props.active ? 'rgba(76, 175, 80, 0.2)' : 'rgba(255, 193, 7, 0.2)'};
    animation: ${props => props.active ? 'pulse 2s infinite' : 'none'};
  }
  
  @keyframes pulse {
    0%, 100% { transform: scale(1); opacity: 0.7; }
    50% { transform: scale(1.2); opacity: 0.3; }
  }
`

const CountBadge = styled.span`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-size: 12px;
  font-weight: 600;
  padding: 4px 8px;
  border-radius: 12px;
  min-width: 24px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
  
  @media (max-width: 768px) {
    font-size: 11px;
    padding: 3px 6px;
  }
`

// 3D星球组件
function Planet({ position, color, size, onClick, children }) {
  const meshRef = useRef()
  
  useEffect(() => {
    const interval = setInterval(() => {
      if (meshRef.current) {
        meshRef.current.rotation.y += 0.01
      }
    }, 16)
    
    return () => clearInterval(interval)
  }, [])

  return (
    <Sphere
      ref={meshRef}
      position={position}
      args={[size, 32, 32]}
      onClick={onClick}
    >
      <MeshDistortMaterial
        color={color}
        attach="material"
        distort={0.3}
        speed={2}
        roughness={0.4}
      />
      {children}
    </Sphere>
  )
}

// 3D场景组件
function GalaxyScene({ onPlanetClick }) {
  const planets = [
    { id: 'feed', position: [-2, 1, 0], color: '#667eea', size: 0.8, label: '动态星球' },
    { id: 'chat', position: [2, 0, 0], color: '#f093fb', size: 0.6, label: '聊天星球' },
    { id: 'nearby', position: [0, -1.5, 0], color: '#4facfe', size: 0.7, label: '附近星球' },
    { id: 'activity', position: [-1.5, -0.5, 1], color: '#feca57', size: 0.5, label: '组局星球' }
  ]

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <OrbitControls enableZoom={true} enablePan={false} />
      
      {planets.map(planet => (
        <Planet
          key={planet.id}
          position={planet.position}
          color={planet.color}
          size={planet.size}
          onClick={() => onPlanetClick(planet.id)}
        >
          <Text
            position={[0, planet.size + 0.5, 0]}
            fontSize={0.2}
            color="white"
            anchorX="center"
            anchorY="middle"
          >
            {planet.label}
          </Text>
        </Planet>
      ))}
    </>
  )
}

function HomePage() {
  const { currentMood, setCurrentMood, user } = useAppStore()
  const [selectedFunction, setSelectedFunction] = useState(null)
  const [showQuickActions, setShowQuickActions] = useState(true)

  const moods = [
    { id: 'excited', emoji: '🔥', label: '兴奋' },
    { id: 'calm', emoji: '🌙', label: '安静' },
    { id: 'energetic', emoji: '⚡', label: '活力' },
    { id: 'default', emoji: '😊', label: '默认' }
  ]

  const quickActions = [
    { id: 'search', icon: '🔍', label: '搜索' },
    { id: 'camera', icon: '📷', label: '拍照' },
    { id: 'location', icon: '📍', label: '定位' },
    { id: 'settings', icon: '⚙️', label: '设置' }
  ]

  const functions = [
    {
      id: 'nearby',
      title: '附近的人',
      description: '发现身边有趣的灵魂',
      icon: '📍',
      gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      active: true,
      count: 12
    },
    {
      id: 'activities',
      title: '组局活动',
      description: '一起做点有意思的事',
      icon: '🎯',
      gradient: 'linear-gradient(135deg, #feca57 0%, #ff9ff3 100%)',
      active: true,
      count: 5
    },
    {
      id: 'memories',
      title: 'AR记忆',
      description: '查看这里的故事',
      icon: '✨',
      gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
      active: false,
      count: 0
    },
    {
      id: 'anonymous',
      title: '匿名树洞',
      description: '说出心里话',
      icon: '🎭',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      active: true,
      count: 8
    }
  ]

  const handleMoodChange = (mood) => {
    setCurrentMood(mood)
  }

  const handlePlanetClick = (planetId) => {
    console.log('点击星球:', planetId)
    // 这里可以添加导航逻辑
  }

  const handleFunctionClick = (functionId) => {
    setSelectedFunction(functionId)
    console.log('点击功能:', functionId)
    // 这里可以添加功能逻辑
  }

  const handleQuickAction = (actionId) => {
    console.log('快速操作:', actionId)
    // 这里可以添加快速操作逻辑
  }

  return (
    <HomeContainer>
      <Header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <UserInfo>
          <Greeting
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h2>Hi, {user.username || '新朋友'} 👋</h2>
            <p>今天想要什么样的社交体验？</p>
          </Greeting>
          
          <MoodSelector>
            {moods.map((mood, index) => (
              <MoodButton
                key={mood.id}
                active={currentMood === mood.id}
                onClick={() => handleMoodChange(mood.id)}
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                title={mood.label}
              >
                {mood.emoji}
              </MoodButton>
            ))}
          </MoodSelector>
        </UserInfo>
      </Header>

      {/* 快速操作区域 */}
      <AnimatePresence>
        {showQuickActions && (
          <QuickActions
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            {quickActions.map((action, index) => (
              <QuickActionButton
                key={action.id}
                onClick={() => handleQuickAction(action.id)}
                whileHover={{ scale: 1.1, rotate: 10 }}
                whileTap={{ scale: 0.9 }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 1 + index * 0.1 }}
                title={action.label}
              >
                {action.icon}
              </QuickActionButton>
            ))}
          </QuickActions>
        )}
      </AnimatePresence>

      <GalaxyContainer>
        <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
          <GalaxyScene onPlanetClick={handlePlanetClick} />
        </Canvas>
      </GalaxyContainer>

      <FunctionGrid
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
      >
        {functions.map((func, index) => (
          <FunctionCard
            key={func.id}
            gradient={func.gradient}
            onClick={() => handleFunctionClick(func.id)}
            whileHover={{ 
              y: -8, 
              scale: 1.02,
              transition: { duration: 0.2 }
            }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ 
              duration: 0.5, 
              delay: 0.7 + index * 0.1,
              ease: "easeOut"
            }}
          >
            <FunctionIcon gradient={func.gradient}>
              {func.icon}
            </FunctionIcon>
            
            <FunctionInfo>
              <h3>{func.title}</h3>
              <p>{func.description}</p>
            </FunctionInfo>
            
            <StatusContainer>
              <StatusIndicator active={func.active} />
              {func.count > 0 && (
                <CountBadge>
                  {func.count}
                </CountBadge>
              )}
            </StatusContainer>
          </FunctionCard>
        ))}
      </FunctionGrid>
    </HomeContainer>
  )
}

export default HomePage