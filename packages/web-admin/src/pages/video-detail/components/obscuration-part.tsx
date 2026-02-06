import React, { ReactElement } from 'react'

import styled from '@emotion/styled'
import { useMount } from 'ahooks'

const NoVIPVideo = styled.div<{ posterUrl: string }>`
  width: 100%;
  height: auto;
  background: url(${({ posterUrl }) => posterUrl}) no-repeat center center;
  background-size: cover;
  border-radius: 3px;
  position: relative;
`
const NoVIPVideoContainer = styled.div`
  position: relative;
  width: 100%;
  height: auto;

  #FFvideo-no-vip {
    @media (max-width: 768px) {
      width: 100% !important;
    }
  }
`
const NoVIPVideoOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
  font-size: 15px;
`

interface IProps {
  posterUrl: string
  part?: ReactElement
}
export const ObscurationPart: React.FC<IProps> = ({ posterUrl, part }) => {
  const computedNoVIP = () => {
    const isMobile = window.innerWidth < 768
    const width = isMobile ? window.innerWidth * 0.9 : window.innerWidth * 0.6
    const height = isMobile ? (width * 175) / 300 : (width * 500) / 880

    const videoDiv = document.getElementById('FFvideo-no-vip')

    if (videoDiv) {
      videoDiv.style.width = `${width}px`
      videoDiv.style.height = `${height}px`
    }
  }

  useMount(() => {
    computedNoVIP()
  })
  return (
    <NoVIPVideoContainer>
      <NoVIPVideo id="FFvideo-no-vip" posterUrl={posterUrl} />
      <NoVIPVideoOverlay>{part}</NoVIPVideoOverlay>
    </NoVIPVideoContainer>
  )
}
