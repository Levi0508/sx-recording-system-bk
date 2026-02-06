import { UserStore } from '@af-charizard/sdk-stores'
import { NOTIFICATION_TYPE_ENUM } from '@af-charizard/sdk-types'
import {
  SettingOutlined,
  UserSwitchOutlined,
  YoutubeOutlined,
} from '@ant-design/icons'
import styled from '@emotion/styled'
import { useStore } from '@kazura/react-mobx'
import { message } from 'antd'
import React, { ReactElement } from 'react'
import { useNavigate } from 'react-router'
import { VIDEO_TYPE_ENUM } from '@af-charizard/sdk-types/src/video-type'

export const StyledIcon = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 20px;
  .info {
    font-size: 13px;
    margin-left: 3px;
  }

  @media (max-width: 768px) {
    font-size: 15px;
    .info {
      font-size: 10px;
      margin-left: 3px;
    }
  }
`

export const elementMap = new Map<NOTIFICATION_TYPE_ENUM, ReactElement>()
  .set(
    NOTIFICATION_TYPE_ENUM.USER,
    <StyledIcon>
      <UserSwitchOutlined />
      <a className="info">回复</a>
    </StyledIcon>,
  )
  .set(
    NOTIFICATION_TYPE_ENUM.VIDEO,

    <StyledIcon>
      <YoutubeOutlined />
      <a className="info">跳转</a>
    </StyledIcon>,
  )
  .set(
    NOTIFICATION_TYPE_ENUM.SYSTEM,
    <StyledIcon>
      <SettingOutlined />
      <span className="info">系统消息</span>
    </StyledIcon>,
  )

interface IProps {
  type: NOTIFICATION_TYPE_ENUM
  userId: number
  setUserId?: React.Dispatch<React.SetStateAction<number | undefined>>
  setEmailModal?: React.Dispatch<React.SetStateAction<boolean>>
  videoId?: number
  classification?: VIDEO_TYPE_ENUM
}

export const Extar: React.FC<IProps> = ({
  type,
  userId,
  setUserId,
  setEmailModal,
  videoId,
  classification,
}) => {
  const navigate = useNavigate()
  const userStore = useStore(UserStore)

  return (
    <span
      onClick={(event) => {
        event.stopPropagation()

        if (type === NOTIFICATION_TYPE_ENUM.VIDEO) {
          navigate(`/video-detail/${videoId}`, {
            state: { video: { classification: classification } },
          })
        } else if (type === NOTIFICATION_TYPE_ENUM.USER) {
          setUserId && setUserId(userId)
          if (userId === userStore.user.id) {
            message.warning('不能回复自己的私信')
            return
          }
          setEmailModal && setEmailModal(true)
        }
      }}
    >
      {elementMap.get(type)}
    </span>
  )
}
