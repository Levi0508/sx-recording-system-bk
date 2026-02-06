import React, { useEffect, useState } from 'react'
import {
  MailOutlined,
  RollbackOutlined,
  SketchOutlined,
  UserAddOutlined,
} from '@ant-design/icons'
import { Card, Modal, Skeleton, message } from 'antd'
import { useIsMobile } from '~/hooks/useIsMobile'
import styled from '@emotion/styled'
import { services } from '@af-charizard/sdk-services'
import { IUserInfo } from '@af-charizard/sdk-services/src/services/user$find$userId'

import {
  StyledInfo,
  StyledSign,
} from '~/pages/vip-preview/components/vip-center'

import { UserStore } from '@af-charizard/sdk-stores'
import { useStore } from '@kazura/react-mobx'
import { checkMembershipStatus } from '~/utils/isVip'
import dayjs from 'dayjs'
import { commonButton } from '../common-header/components/web-buttons'
import { formatDate } from '~/utils/date'
import CommonSendMail from '../common-send-mail'
import { StyledIcon } from '../common-id-card-home'

import CommonAvatarFrame from '../common-avatar-frame'
import { signMap } from '~/pages/vip-preview/components/home'

const StyledModal = styled(Modal)`
  z-index: 99;
  .ant-modal-close {
    display: none;
  }
  .ant-modal-content {
    padding: 0;
  }
  .ant-card-body {
    /* height: 160px; */
    padding-top: 35px;
  }
  .ant-card-actions {
    .icon {
      font-size: 20px !important;
    }
  }
  .ant-card-meta-avatar {
    padding-inline-end: 20px;
  }
  @media (max-width: 768px) {
    .ant-card-body {
      padding: 30px 15px 0px 15px;
      margin-bottom: 10px;
      /* height: 140px; */
    }
  }
  /* 添加偏移量 */
  top: 200px; /* 调整垂直方向偏移量 */
`

const { Meta } = Card
interface IProps {
  isModalShow: boolean
  setIsModalShow: React.Dispatch<React.SetStateAction<boolean>>
  userId: number
}
const CommonIdCard: React.FC<IProps> = ({
  isModalShow,
  setIsModalShow,
  userId,
}) => {
  const userStore = useStore(UserStore)

  const [loading, setLoading] = useState(true)
  const [userInfo, setUserInfo] = useState<IUserInfo>()
  const [textAreaValue, setTextAreaValue] = useState('')
  const isMobile = useIsMobile()

  const [emailModal, setEmailModal] = useState(false)
  const membershipStatus = checkMembershipStatus(userInfo?.vipDeadLine)

  const buyCpn = (type: string, info = '续费') => {
    return (
      <span>
        {commonButton(type)}
        <a style={{ marginLeft: 5 }}></a>
      </span>
    )
  }
  const getUserInfo = async () => {
    const resp = await services.user$find$userId({
      userId,
    })

    if (resp.data.code === 200) {
      setLoading(false)
      setUserInfo(resp.data.resource)
    } else {
      setLoading(false)
      message.error(resp.data.message)
    }
  }

  useEffect(() => {
    if (isModalShow) {
      setLoading(true) // 每次显示模态框时重置 loading 状态
      getUserInfo()
    }
  }, [isModalShow])
  return (
    <StyledModal
      width={isMobile ? '330px' : '380px'}
      open={isModalShow}
      onCancel={() => setIsModalShow(false)}
      footer={false}
      destroyOnClose
    >
      <Card
        actions={[
          <RollbackOutlined
            key="back"
            onClick={() => setIsModalShow(false)}
            className="icon"
          />,

          <StyledIcon
            onClick={() => {
              if (userId === userStore.user.id) {
                message.warning('不能给自己发私信')
                return
              }
              setEmailModal(true)
            }}
          >
            <MailOutlined key="mail" className="icon" />
            <div style={{ fontSize: 15 }}>发信</div>
          </StyledIcon>,
          // </StyledIcon>,
          <UserAddOutlined
            className="icon"
            key="friends"
            onClick={() => {
              message.warning('功能暂未开放')

              // if (userId === userStore.user.id) {
              //   message.warning('不能加自己好友')
              //   return
              // }
            }}
          />,
        ]}
      >
        <Skeleton loading={loading} avatar active>
          <Meta
            avatar={
              <CommonAvatarFrame
                avatar={userInfo?.avatar}
                selectedFrame={userInfo?.avatarFrame}
              ></CommonAvatarFrame>
            }
            title={
              membershipStatus.status === 'valid' ? (
                <StyledSign>
                  <div style={{ marginBottom: 6 }}>
                    {signMap.get(userInfo?.vipType!)}
                  </div>
                  <SketchOutlined
                    style={{
                      fontSize: 16,
                      marginRight: 3,
                    }}
                  />
                  {userInfo?.nickname || '默认昵称'}
                </StyledSign>
              ) : membershipStatus.status === 'expired' ? (
                <span>{userInfo?.nickname || '默认昵称'}</span>
              ) : userStore.user ? (
                <span>{userInfo?.nickname || '默认昵称'}</span>
              ) : (
                '未登录'
              )
            }
            description={
              <div>
                <StyledInfo>
                  <span>创建日期：</span>
                  <span>{formatDate(userInfo?.createdAt)}</span>
                </StyledInfo>
                <StyledInfo>
                  <span>会员状态：</span>
                  <span>
                    {userInfo?.vipDeadLine
                      ? dayjs(userInfo.vipDeadLine) > dayjs()
                        ? buyCpn('isVip')
                        : buyCpn('passVip')
                      : buyCpn('noVip', '开通')}
                  </span>
                </StyledInfo>
                <StyledInfo>
                  <span>个性签名：</span>
                  <span>快来看af-share.com吧</span>
                </StyledInfo>
              </div>
            }
          />
        </Skeleton>
      </Card>

      <CommonSendMail
        isModalShow={emailModal}
        setIsModalShow={setEmailModal}
        userId={userId}
      ></CommonSendMail>
    </StyledModal>
  )
}

export default CommonIdCard
