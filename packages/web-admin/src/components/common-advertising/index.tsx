import React, { useState, useEffect } from 'react'

import { useIsMobile } from '~/hooks'

import PC from '/PC.jpeg'
import Mobile from '/Mobile.jpeg'
import { services } from '@af-charizard/sdk-services'
import { useStore } from '@kazura/react-mobx'
import { UserStore } from '@af-charizard/sdk-stores'
import { useLocation } from 'react-router'

interface IProps {
  height?: number
}

const CommonAdvertising: React.FC<IProps> = ({ height }) => {
  const isMobile = useIsMobile()
  const userStore = useStore(UserStore)
  const location = useLocation()
  const [imgHeight, setImgHeight] = useState(height) // 默认值

  const clickHandler = async () => {
    window.open('https://shunkangbjyp.tmall.com')

    await services.signIn$handle({
      userId: userStore.user?.id || null,
      referrer: location.pathname,
    })
  }

  useEffect(() => {
    const updateHeight = () => {
      const screenRatio = window.innerWidth / window.innerHeight
      let newHeight

      if (isMobile) {
        newHeight = height // 移动端固定80px
      } else {
        newHeight = window.innerHeight * 0.23 // 例如，占屏幕高度的20%
      }

      setImgHeight(newHeight)
    }

    updateHeight() // 初始化计算
    window.addEventListener('resize', updateHeight)

    return () => {
      window.removeEventListener('resize', updateHeight)
    }
  }, [isMobile])

  return (
    <img
      src={isMobile ? Mobile : PC}
      alt="GIF"
      style={{
        height: imgHeight,
        cursor: 'pointer',
        width: '100%',
        display: 'block', // 避免 img 额外空隙
        borderRadius: 5,
      }}
      onClick={clickHandler}
    />
  )
}

export default CommonAdvertising
