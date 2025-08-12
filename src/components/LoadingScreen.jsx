import React, { useEffect, useState } from 'react'
import styled, { keyframes } from 'styled-components'
import { motion } from 'framer-motion'

// 3D旋转动画
const rotate3D = keyframes`
  0% { transform: rotateX(0deg) rotateY(0deg) rotateZ(0deg); }
  25% { transform: rotateX(90deg) rotateY(0deg) rotateZ(0deg); }
  50% { transform: rotateX(90deg) rotateY(90deg) rotateZ(0deg); }
  75% { transform: rotateX(90deg) rotateY(90deg) rotateZ(90deg); }
  100% { transform: rotateX(0deg) rotateY(0deg) rotateZ(0deg); }
`

const pulse = keyframes`
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.1); opacity: 0.8; }
`

const LoadingContainer = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  position: relative;
  overflow: hidden;
`

const Logo3D = styled.div`
  width: 120px;
  height: 120px;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  border-radius: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 48px;
  font-weight: bold;
  color: white;
  animation: ${rotate3D} 3s infinite ease-in-out;
  box-shadow: 
    0 20px 40px rgba(0, 0, 0, 0.2),
    0 0 50px rgba(240, 147, 251, 0.3);
  margin-bottom: 30px;
  transform-style: preserve-3d;
`

const AppName = styled(motion.h1)`
  font-size: 36px;
  font-weight: 700;
  color: white;
  margin-bottom: 10px;
  text-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
`

const Tagline = styled(motion.p)`
  font-size: 16px;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 40px;
  text-align: center;
`

const LoadingDots = styled.div`
  display: flex;
  gap: 8px;
`

const Dot = styled.div`
  width: 12px;
  height: 12px;
  background: white;
  border-radius: 50%;
  animation: ${pulse} 1.5s infinite ease-in-out;
  animation-delay: ${props => props.delay}s;
`

const ProgressBar = styled.div`
  width: 200px;
  height: 4px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 2px;
  margin-top: 20px;
  overflow: hidden;
`

const ProgressFill = styled(motion.div)`
  height: 100%;
  background: linear-gradient(90deg, #4facfe 0%, #00f2fe 100%);
  border-radius: 2px;
`

const ParticleContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
`

const Particle = styled(motion.div)`
  position: absolute;
  width: 4px;
  height: 4px;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 50%;
`

function LoadingScreen() {
  const [progress, setProgress] = useState(0)
  const [loadingText, setLoadingText] = useState('初始化3D引擎...')

  const loadingSteps = [
    '初始化3D引擎...',
    '加载星球导航系统...',
    '连接社交网络...',
    '准备AR体验...',
    '启动VibeLink...'
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + 2
        const stepIndex = Math.floor(newProgress / 20)
        if (stepIndex < loadingSteps.length) {
          setLoadingText(loadingSteps[stepIndex])
        }
        return newProgress > 100 ? 100 : newProgress
      })
    }, 50)

    return () => clearInterval(interval)
  }, [])

  // 生成随机粒子
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: Math.random() * 2
  }))

  return (
    <LoadingContainer>
      <ParticleContainer>
        {particles.map(particle => (
          <Particle
            key={particle.id}
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`
            }}
            animate={{
              y: [-20, 20, -20],
              opacity: [0.3, 1, 0.3]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: particle.delay
            }}
          />
        ))}
      </ParticleContainer>

      <Logo3D>
        VL
      </Logo3D>

      <AppName
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
      >
        VibeLink
      </AppName>

      <Tagline
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.7 }}
      >
        连接你的3D社交世界
      </Tagline>

      <LoadingDots>
        <Dot delay={0} />
        <Dot delay={0.2} />
        <Dot delay={0.4} />
      </LoadingDots>

      <ProgressBar>
        <ProgressFill
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.1 }}
        />
      </ProgressBar>

      <motion.p
        style={{
          color: 'rgba(255, 255, 255, 0.7)',
          fontSize: '14px',
          marginTop: '15px',
          textAlign: 'center'
        }}
        key={loadingText}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        {loadingText}
      </motion.p>
    </LoadingContainer>
  )
}

export default LoadingScreen