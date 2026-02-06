import React, { useEffect, useState } from 'react'
import {
  HistoryOutlined,
  LoginOutlined,
  LogoutOutlined,
  MailOutlined,
  SketchOutlined,
  StarFilled,
  UserOutlined,
  CopyrightOutlined,
} from '@ant-design/icons'
import { Badge, Card, Modal, Skeleton, message, Image } from 'antd'
import { useIsMobile } from '~/hooks/useIsMobile'
import styled from '@emotion/styled'
import { services } from '@af-charizard/sdk-services'
import { IUserInfo } from '@af-charizard/sdk-services/src/services/user$find$userId'
import Avatar from '/avatar.svg'

import {
  StyledInfo,
  StyledSign,
} from '~/pages/vip-preview/components/vip-center'
import { MailStore, UserStore } from '@af-charizard/sdk-stores'
import { useStore } from '@kazura/react-mobx'
import { checkMembershipStatus } from '~/utils/isVip'
import dayjs from 'dayjs'
import { commonButton } from '../common-header/components/web-buttons'
import { formatDateHMS } from '~/utils/date'
import { useNavigate } from 'react-router'
import { useLogout } from '~/hooks'
import { requireLogin } from '~/utils/requireLogin'
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
      padding: 30px 5px 0px 20px;
      margin-bottom: 10px;

      /* padding-inline-end: 120px; */
      /* .ant-card-meta-avatar {
        padding-inline-end: 20px;
      } */
      /* height: 140px; */
    }
  }
  /* 添加偏移量 */
  top: 200px; /* 调整垂直方向偏移量 */
`
export const StyledIcon = styled.span`
  display: flex;
  justify-content: center;
  align-items: center;
  span {
    margin-right: 3px;
  }
`

const { Meta } = Card
interface IProps {
  isModalShow: boolean
  setIsModalShow: React.Dispatch<React.SetStateAction<boolean>>
  userId: number
  type: 'web' | 'mobile'
}
const CommonIdCardHome: React.FC<IProps> = ({
  isModalShow,
  setIsModalShow,
  userId,
  type,
}) => {
  const userStore = useStore(UserStore)
  const mailStore = useStore(MailStore)

  const navigate = useNavigate()
  const logoutHandler = useLogout()
  const [loading, setLoading] = useState(true)

  const [userInfo, setUserInfo] = useState<IUserInfo>()
  const isMobile = useIsMobile()

  const membershipStatus = checkMembershipStatus(userInfo?.vipDeadLine)

  const buyCpn = (type: string, info = '续费') => {
    return (
      <span>
        {commonButton(type)}
        <a
          style={{ marginLeft: 5 }}
          onClick={() => {
            setIsModalShow(false)
            navigate('/web/shop')
          }}
        >
          {info}
        </a>
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
      message.error(resp.data.message)
    }
  }

  // useEffect(() => {
  //   isModalShow && userId && getUserInfo()
  // }, [isModalShow])

  useEffect(() => {
    if (isModalShow && userId) {
      setLoading(true) // 每次显示模态框时重置 loading 状态
      getUserInfo()
    }
  }, [isModalShow])

  return (
    <StyledModal
      width={isMobile ? '350px' : '380px'}
      destroyOnClose
      open={isModalShow}
      onCancel={() => setIsModalShow(false)}
      footer={false}
    >
      <Card
        actions={
          type === 'mobile'
            ? [
                <StyledIcon
                  style={{ color: '#8c8c8c' }}
                  onClick={() => {
                    if (userId) {
                      setIsModalShow(false)
                      navigate('/vip/center')
                    } else {
                      requireLogin()
                    }
                  }}
                >
                  <UserOutlined key="back" className="icon" />
                  主页
                </StyledIcon>,
                <Badge
                  count={mailStore.totalCount}
                  offset={[-55, 2]}
                  overflowCount={99}
                  size="small"
                >
                  <StyledIcon
                    style={{ color: '#8c8c8c', paddingTop: 2 }}
                    onClick={() => {
                      if (userId) {
                        setIsModalShow(false)
                        navigate('/mail/message')
                      } else {
                        message.warning('请先登录')
                      }
                    }}
                  >
                    <MailOutlined className="icon" key="mail" />
                    消息
                  </StyledIcon>
                </Badge>,
                userId ? (
                  <StyledIcon
                    style={{ color: 'red' }}
                    onClick={() => {
                      setIsModalShow(false)
                      setUserInfo(undefined)
                      logoutHandler()
                    }}
                  >
                    <LogoutOutlined className="icon" key="friends" />
                    退出
                  </StyledIcon>
                ) : (
                  <StyledIcon
                    style={{ color: 'green' }}
                    onClick={() => {
                      setIsModalShow(false)
                      navigate('/login')
                    }}
                  >
                    <LoginOutlined className="icon" key="friends" />
                    登录
                  </StyledIcon>
                ),
              ]
            : [
                <StyledIcon
                  onClick={() => {
                    setIsModalShow(false)
                    // navigate('/vip/buy', { state: { type: 'history' } })
                  }}
                >
                  <HistoryOutlined
                    key="back"
                    className="icon"
                    style={{ color: '#808080' }}
                  />
                  <span style={{ color: '#808080' }}> 历史</span>
                </StyledIcon>,

                <StyledIcon
                  onClick={() => {
                    setIsModalShow(false)
                    // navigate('/vip/buy', { state: { type: 'favorite' } })
                  }}
                >
                  <StarFilled
                    key="back"
                    className="icon"
                    style={{ color: '#f2a93b' }}
                  />
                  <span style={{ color: '#808080' }}> 收藏</span>
                </StyledIcon>,

                userId ? (
                  <StyledIcon
                    style={{ color: 'red' }}
                    onClick={() => {
                      setIsModalShow(false)
                      setUserInfo(undefined)
                      logoutHandler()
                    }}
                  >
                    <LogoutOutlined className="icon" key="friends" />
                    退出
                  </StyledIcon>
                ) : (
                  <StyledIcon
                    style={{ color: 'red' }}
                    onClick={() => {
                      setIsModalShow(false)
                      navigate('/login')
                    }}
                  >
                    <LoginOutlined
                      className="icon"
                      style={{ color: 'green' }}
                      key="friends"
                    />
                  </StyledIcon>
                ),
              ]
        }
      >
        <Skeleton loading={userStore.user?.id ? loading : false} avatar active>
          <Meta
            avatar={
              <CommonAvatarFrame
                avatar={userStore.user?.avatar}
                selectedFrame={userStore.user?.avatarFrame}
              ></CommonAvatarFrame>
            }
            title={
              membershipStatus.status === 'valid' ? (
                <StyledSign>
                  <div style={{ marginBottom: 6 }}>
                    {signMap.get(userStore.user.vipType)}
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
                <div>
                  未登录
                  <a
                    style={{ fontSize: 15, marginLeft: 6 }}
                    onClick={() => {
                      setIsModalShow(false)
                      navigate('/login')
                    }}
                  >
                    点击登录 / 注册
                  </a>
                </div>
              )
            }
            description={
              <div>
                <StyledInfo>
                  <span>注册邮箱：</span>
                  <span>{userStore.user?.email || '暂无数据'}</span>
                </StyledInfo>
                {/* <StyledInfo>
                  <span>会员状态：</span>
                  <span>
                    {userStore.user?.vipDeadLine
                      ? dayjs(userStore.user.vipDeadLine) > dayjs()
                        ? buyCpn('isVip')
                        : buyCpn('passVip')
                      : buyCpn('noVip', userStore.user ? '开通' : '')}
                  </span>
                </StyledInfo> */}
                <StyledInfo>
                  <span>当前余额：</span>
                  <span style={{ color: '#FB7299' }}>
                    {userStore.user?.money !== undefined
                      ? `${(userStore.user.money / 10).toFixed(1)}`
                      : '0'}
                    <CopyrightOutlined style={{ marginLeft: 5 }} />
                  </span>
                </StyledInfo>

                {/* <StyledInfo>
                  <span> 到期时间：</span>
                  <span>
                    {userStore.user?.vipDeadLine ? (
                      <>{formatDateHMS(userStore.user.vipDeadLine)}</>
                    ) : (
                      '暂无'
                    )}
                  </span>
                </StyledInfo> */}
              </div>
            }
          />
        </Skeleton>
      </Card>
    </StyledModal>
  )
}

export default CommonIdCardHome
