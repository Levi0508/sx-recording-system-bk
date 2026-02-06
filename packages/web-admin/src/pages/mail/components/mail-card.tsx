import { IIINotificationList } from '@af-charizard/sdk-stores'
import styled from '@emotion/styled'
import React, { useState } from 'react'
import { useNavigate } from 'react-router'
import { useIsMobile } from '~/hooks'
import { formatDateHM } from '~/utils/date'
import CommonIdCard from '~/components/common-id-card'
import { AvatarCpn } from '~/pages/vip-preview/components/home'

const StyledInfo = styled.div`
  font-size: 15px;
  margin-bottom: 3px;
  height: 100%;
  padding-bottom: 30px;
`
const StyledChildrenContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 120px;
  position: relative;
`

const StyledFooter = styled.div`
  position: absolute;
  bottom: 0;
  width: 100%;
  display: flex;
  margin-left: auto;
  justify-content: flex-end;
`

const StyledTime = styled.div`
  text-align: right;
  line-height: 30px;
  display: flex;
  line-height: 30px;
  margin-right: 20px;
  @media (max-width: 768px) {
    line-height: 15px;
    font-size: 10px;
    margin-right: 0px;
  }
`
const StyledAvatar = styled.div`
  display: flex;
  line-height: 30px;
  margin-right: 20px;
  cursor: pointer;
  @media (max-width: 768px) {
    line-height: 15px;
    font-size: 10px;
    margin-right: 10px;
  }
`
interface IProps {
  notification: IIINotificationList
}

export const MailCard: React.FC<IProps> = ({ notification }) => {
  const navigate = useNavigate()
  const isMobile = useIsMobile()

  const [isUserModalShow, setIsUserModalShow] = useState(false)

  return (
    <StyledChildrenContainer>
      <StyledInfo>{notification.message}</StyledInfo>
      <StyledFooter>
        <StyledAvatar onClick={() => setIsUserModalShow(true)}>
          <div style={{ color: '#8c8c8c' }}>By：</div>
          <div>
            {/* <CommonAvatarFrame
              avatar={notification.sendByUser.avatar}
              selectedFrame={notification.sendByUser.avatarFrame}
              useAntdImage={false}
              size={isMobile ? 20 : 30}
            ></CommonAvatarFrame> */}
            {AvatarCpn(notification.sendByUser.avatar, isMobile ? 20 : 30)}
          </div>
          <div style={{ marginLeft: 5 }}>
            {notification.sendByUser.nickname || '默认昵称'}
          </div>
        </StyledAvatar>
        <StyledTime>
          <div style={{ color: '#8c8c8c' }}>
            {formatDateHM(notification.createdAt)}
          </div>
        </StyledTime>
      </StyledFooter>
      <CommonIdCard
        isModalShow={isUserModalShow}
        setIsModalShow={setIsUserModalShow}
        userId={notification.sendByUser.id}
      ></CommonIdCard>
    </StyledChildrenContainer>
  )
}
