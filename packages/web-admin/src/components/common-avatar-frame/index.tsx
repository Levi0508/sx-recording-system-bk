import React from 'react'
import { Image } from 'antd'
import styled from '@emotion/styled'
import Avatar from '/avatar.svg'

import { AVATAR_TYPE_ENUM } from '@af-charizard/sdk-types/src/avatar-type'

// 头像容器样式
export const AvatarContainer = styled.div<{ size: number }>`
  .ant-image-mask {
    border-radius: ${(props) => props.size / 2}px;
  }
  position: relative;
  width: ${(props) => props.size}px;
  height: ${(props) => props.size}px;
  margin-top: 5px;

  @media (max-width: 768px) {
    width: ${(props) => (props.size * 45) / 60}px;
    height: ${(props) => (props.size * 45) / 60}px;
    /* margin-top: 10px; */
    margin-right: 5px;
  }
`

// 头像图片样式（用于 img 标签）
export const StyledImg = styled.img<{ size: number }>`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  overflow: hidden;
`

// 头像框样式
export const StyledFrame = styled.img<{ size: number }>`
  position: absolute;
  top: ${(props) => -(props.size * 0.35)}px;
  left: ${(props) => -(props.size * 0.34)}px;
  width: ${(props) => props.size * 1.7}px;
  height: ${(props) => props.size * 1.7}px;
  pointer-events: none;
  border-radius: 50%;

  @media (max-width: 768px) {
    top: ${(props) => -((props.size * 45) / 60) * 0.35}px; // 45/60 缩放后的偏移
    left: ${(props) => -((props.size * 45) / 60) * 0.343}px;
    width: ${(props) => ((props.size * 45) / 60) * 1.7}px;
    height: ${(props) => ((props.size * 45) / 60) * 1.7}px;
  }
`

interface IProps {
  avatar?: string
  selectedFrame?: AVATAR_TYPE_ENUM
  size?: number
  useAntdImage?: boolean // 是否使用 Ant Design 的 Image 组件
}

const CommonAvatarFrame: React.FC<IProps> = ({
  avatar,
  selectedFrame,
  size = 60,
  useAntdImage = true,
}) => {
  const frameSrc = selectedFrame ? `/avatars/${selectedFrame}.png` : null

  return (
    <AvatarContainer size={size}>
      {/* 根据 useAntdImage 来选择是否使用 Ant Design 的 Image 组件 */}
      {useAntdImage ? (
        <Image
          src={avatar || Avatar}
          width="100%"
          height="100%"
          style={{
            borderRadius: '50%',
            objectFit: 'cover',
            overflow: 'hidden',
          }}
          preview={true} // 关闭图片预览功能
        />
      ) : (
        <StyledImg src={avatar || Avatar} size={size} />
      )}
      {frameSrc && <StyledFrame src={frameSrc} size={size} />}
    </AvatarContainer>
  )
}

export default CommonAvatarFrame
