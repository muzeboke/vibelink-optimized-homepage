import React, { useState, useEffect, useRef } from 'react'
import styled from 'styled-components'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore } from '../store/appStore'

const FeedContainer = styled.div`
  width: 100%;
  min-height: 100vh;
  padding: 20px;
  padding-bottom: 100px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  position: relative;
  overflow-x: hidden;
  
  &::before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      radial-gradient(2px 2px at 25px 35px, rgba(255,255,255,0.3), transparent),
      radial-gradient(1px 1px at 85px 25px, rgba(255,255,255,0.2), transparent),
      radial-gradient(2px 2px at 150px 60px, rgba(255,255,255,0.25), transparent),
      radial-gradient(1px 1px at 200px 90px, rgba(255,255,255,0.15), transparent);
    background-repeat: repeat;
    background-size: 350px 250px;
    opacity: 0.6;
    animation: starfield 20s ease-in-out infinite;
    pointer-events: none;
    z-index: 0;
  }
  
  @keyframes starfield {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
  }
`

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  color: white;
  position: relative;
  z-index: 1;
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.1);
  padding: 20px;
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
`

const Title = styled.h1`
  font-size: 28px;
  font-weight: 700;
`

const FilterButtons = styled.div`
  display: flex;
  gap: 8px;
`

const FilterButton = styled(motion.button)`
  padding: 8px 16px;
  border: none;
  border-radius: 20px;
  background: ${props => props.active ? 
    'rgba(255, 255, 255, 0.3)' : 
    'rgba(255, 255, 255, 0.1)'
  };
  color: white;
  font-size: 14px;
  cursor: pointer;
  backdrop-filter: blur(10px);
`

const FeedList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 25px;
  position: relative;
  z-index: 1;
`

const FeedCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(25px);
  border-radius: 24px;
  padding: 24px;
  box-shadow: 
    0 8px 30px rgba(0, 0, 0, 0.12),
    0 2px 8px rgba(0, 0, 0, 0.08);
  transform-style: preserve-3d;
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
    background: linear-gradient(90deg, #667eea, #764ba2, #f093fb);
    opacity: 0.8;
  }
  
  &:hover {
    transform: translateY(-8px) rotateX(2deg);
    box-shadow: 
      0 20px 50px rgba(0, 0, 0, 0.15),
      0 5px 15px rgba(0, 0, 0, 0.1);
  }
`

const UserHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 15px;
`

const Avatar = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  font-weight: bold;
  font-size: 18px;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
  border: 2px solid rgba(255, 255, 255, 0.8);
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    top: -2px;
    right: -2px;
    width: 12px;
    height: 12px;
    background: #4ade80;
    border-radius: 50%;
    border: 2px solid white;
    box-shadow: 0 2px 8px rgba(74, 222, 128, 0.4);
  }
`

const UserInfo = styled.div`
  flex: 1;
  
  h3 {
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 2px;
  }
  
  p {
    font-size: 12px;
    color: #666;
  }
`

const Content = styled.div`
  margin-bottom: 15px;
  
  p {
    font-size: 16px;
    line-height: 1.5;
    color: #333;
  }
`

const MediaContainer = styled.div`
  width: 100%;
  height: 200px;
  border-radius: 15px;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  margin: 15px 0;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  font-size: 48px;
`

const Actions = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const ActionButton = styled(motion.button)`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border: none;
  border-radius: 20px;
  background: rgba(102, 126, 234, 0.1);
  color: #667eea;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(102, 126, 234, 0.2);
    transform: scale(1.05);
  }
  
  &.active {
    background: #667eea;
    color: white;
  }
`

const FloatingButton = styled(motion.button)`
  position: fixed;
  bottom: 100px;
  right: 20px;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  border: none;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-size: 24px;
  cursor: pointer;
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
  z-index: 100;
  
  &:hover {
    transform: scale(1.1);
  }
`

function FeedPage() {
  const { feeds, user, addFeed } = useAppStore()
  const [filter, setFilter] = useState('all')
  const [showComposer, setShowComposer] = useState(false)
  const [newPost, setNewPost] = useState('')

  // 模拟动态数据
  const mockFeeds = [
    {
      id: 1,
      user: { name: '小星', avatar: '⭐' },
      content: '今天在咖啡厅遇到了一个很有趣的人，聊了很久关于宇宙和星空的话题 ✨',
      timestamp: '2分钟前',
      likes: 12,
      comments: 3,
      location: '星巴克·天河店',
      mood: 'excited'
    },
    {
      id: 2,
      user: { name: '月亮', avatar: '🌙' },
      content: '深夜的城市总是让人感到孤独，但也很美。有人想一起看夜景吗？',
      timestamp: '15分钟前',
      likes: 8,
      comments: 5,
      location: '珠江新城',
      mood: 'calm',
      hasMedia: true
    },
    {
      id: 3,
      user: { name: '火花', avatar: '🔥' },
      content: '刚刚完成了一个超酷的项目！感觉整个人都在发光 💫',
      timestamp: '1小时前',
      likes: 25,
      comments: 8,
      location: '创意园区',
      mood: 'energetic'
    }
  ]

  const filters = [
    { id: 'all', label: '全部' },
    { id: 'nearby', label: '附近' },
    { id: 'friends', label: '朋友' },
    { id: 'trending', label: '热门' }
  ]

  const handleLike = (feedId) => {
    console.log('点赞:', feedId)
  }

  const handleComment = (feedId) => {
    console.log('评论:', feedId)
  }

  const handleShare = (feedId) => {
    console.log('分享:', feedId)
  }

  const handlePublish = () => {
    if (newPost.trim()) {
      const newFeed = {
        id: Date.now(),
        user: { name: user.username || '我', avatar: '👤' },
        content: newPost,
        timestamp: '刚刚',
        likes: 0,
        comments: 0,
        location: '当前位置',
        mood: 'default'
      }
      addFeed(newFeed)
      setNewPost('')
      setShowComposer(false)
    }
  }

  return (
    <FeedContainer>
      <Header>
        <Title>动态星球</Title>
        <FilterButtons>
          {filters.map(filterItem => (
            <FilterButton
              key={filterItem.id}
              active={filter === filterItem.id}
              onClick={() => setFilter(filterItem.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {filterItem.label}
            </FilterButton>
          ))}
        </FilterButtons>
      </Header>

      <FeedList>
        <AnimatePresence>
          {mockFeeds.map((feed, index) => (
            <FeedCard
              key={feed.id}
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -50, scale: 0.9 }}
              transition={{ 
                duration: 0.5, 
                delay: index * 0.1,
                ease: "easeOut"
              }}
              whileHover={{ 
                y: -8,
                transition: { duration: 0.2 }
              }}
            >
              <UserHeader>
                <Avatar>{feed.user.avatar}</Avatar>
                <UserInfo>
                  <h3>{feed.user.name}</h3>
                  <p>{feed.timestamp} · {feed.location}</p>
                </UserInfo>
              </UserHeader>
              
              <Content>
                <p>{feed.content}</p>
              </Content>
              
              {feed.hasMedia && (
                <MediaContainer>
                  🖼️
                </MediaContainer>
              )}
              
              <Actions>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <ActionButton
                    onClick={() => handleLike(feed.id)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    ❤️ {feed.likes}
                  </ActionButton>
                  <ActionButton
                    onClick={() => handleComment(feed.id)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    💬 {feed.comments}
                  </ActionButton>
                  <ActionButton
                    onClick={() => handleShare(feed.id)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    🔗 分享
                  </ActionButton>
                </div>
              </Actions>
            </FeedCard>
          ))}
        </AnimatePresence>
      </FeedList>

      <FloatingButton
        onClick={() => setShowComposer(!showComposer)}
        whileHover={{ scale: 1.1, rotate: 180 }}
        whileTap={{ scale: 0.9 }}
        animate={{ rotate: showComposer ? 45 : 0 }}
      >
        ✏️
      </FloatingButton>

      <AnimatePresence>
        {showComposer && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50 }}
            style={{
              position: 'fixed',
              bottom: '180px',
              right: '20px',
              width: '300px',
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(25px)',
              borderRadius: '20px',
              padding: '20px',
              boxShadow: '0 8px 30px rgba(0, 0, 0, 0.15)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              zIndex: 101
            }}
          >
            <textarea
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              placeholder="分享你的想法..."
              style={{
                width: '100%',
                height: '100px',
                border: 'none',
                outline: 'none',
                resize: 'none',
                background: 'transparent',
                fontSize: '14px',
                marginBottom: '15px'
              }}
            />
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <ActionButton onClick={() => setShowComposer(false)}>
                取消
              </ActionButton>
              <ActionButton 
                onClick={handlePublish}
                style={{ background: '#667eea', color: 'white' }}
              >
                发布
              </ActionButton>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </FeedContainer>
  )
}

export default FeedPage