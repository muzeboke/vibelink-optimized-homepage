import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import styled from 'styled-components'
import { motion } from 'framer-motion'

const NavContainer = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 80px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 0 20px;
  z-index: 1000;
  box-shadow: 0 -10px 30px rgba(0, 0, 0, 0.1);
`

const NavItem = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  padding: 8px;
  border-radius: 12px;
  position: relative;
  min-width: 50px;
`

const NavIcon = styled.div`
  width: 28px;
  height: 28px;
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 16px;
  margin-bottom: 4px;
  background: ${props => props.active ? 
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 
    'transparent'
  };
  color: ${props => props.active ? 'white' : '#666'};
  transition: all 0.3s ease;
  transform-style: preserve-3d;
  
  &:hover {
    transform: translateY(-2px) scale(1.1);
  }
`

const NavLabel = styled.span`
  font-size: 10px;
  color: ${props => props.active ? '#667eea' : '#999'};
  font-weight: ${props => props.active ? '600' : '400'};
  transition: all 0.3s ease;
`

const ActiveIndicator = styled(motion.div)`
  position: absolute;
  top: -2px;
  left: 50%;
  transform: translateX(-50%);
  width: 4px;
  height: 4px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  box-shadow: 0 0 10px rgba(102, 126, 234, 0.5);
`

const FloatingButton = styled(motion.div)`
  position: absolute;
  top: -25px;
  left: 50%;
  transform: translateX(-50%);
  width: 56px;
  height: 56px;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 24px;
  color: white;
  cursor: pointer;
  box-shadow: 
    0 8px 25px rgba(240, 147, 251, 0.4),
    0 0 0 4px rgba(255, 255, 255, 0.8);
  
  &:hover {
    transform: translateX(-50%) translateY(-3px) scale(1.05);
  }
  
  &:active {
    transform: translateX(-50%) translateY(-1px) scale(0.95);
  }
`

function Navigation() {
  const navigate = useNavigate()
  const location = useLocation()
  const [isPublishHovered, setIsPublishHovered] = useState(false)

  const navItems = [
    { path: '/', icon: '🏠', label: '首页' },
    { path: '/feed', icon: '📱', label: '动态' },
    { path: '/publish', icon: '+', label: '发布', isFloating: true },
    { path: '/chat', icon: '💬', label: '聊天' },
    { path: '/profile', icon: '👤', label: '我的' }
  ]

  const handleNavClick = (path) => {
    navigate(path)
  }

  return (
    <NavContainer>
      {navItems.map((item, index) => {
        const isActive = location.pathname === item.path
        
        if (item.isFloating) {
          return (
            <NavItem key={item.path}>
              <FloatingButton
                onClick={() => handleNavClick(item.path)}
                onHoverStart={() => setIsPublishHovered(true)}
                onHoverEnd={() => setIsPublishHovered(false)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.span
                  animate={{ 
                    rotate: isPublishHovered ? 45 : 0 
                  }}
                  transition={{ duration: 0.3 }}
                >
                  {item.icon}
                </motion.span>
              </FloatingButton>
            </NavItem>
          )
        }

        return (
          <NavItem
            key={item.path}
            onClick={() => handleNavClick(item.path)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isActive && (
              <ActiveIndicator
                layoutId="activeIndicator"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
            
            <NavIcon active={isActive}>
              {item.icon}
            </NavIcon>
            
            <NavLabel active={isActive}>
              {item.label}
            </NavLabel>
          </NavItem>
        )
      })}
    </NavContainer>
  )
}

export default Navigation