import React, { useEffect, useState } from 'react'

import styled from '@emotion/styled'

import { Layout, theme } from 'antd'

import { useLocation, useNavigate } from 'react-router-dom'

import { useMount } from 'ahooks'
import { useStore } from '@kazura/react-mobx'
import { UserStore } from '@af-charizard/sdk-stores'

import { useIsMobile } from '~/hooks'
import { MobileButtonsRight } from './components/mobile-buttons-right'
import { WebButtons } from './components/web-buttons'
import { MobileButtonsLeft } from './components/mobile-buttons-left'

const { Header } = Layout

const StyledTitle = styled.div`
  font-size: 20px;
  font-weight: 600;
  display: none;

  @media (max-width: 768px) {
    display: block;
    line-height: 62px;
    font-size: 15px;

    color: #ea7a99;
  }
`

const StyledHeaders = styled(Header)`
  padding: 0 20px;
  position: sticky;
  background: ${({ colorBgContainer }: { colorBgContainer: any }) =>
    colorBgContainer};
  top: 0;
  width: '100%';
  z-index: 999;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  text-align: 'right';
  display: flex;
  justify-content: space-between;
  align-items: center;

  @media (max-width: 768px) {
    padding: 0px 10px;
    height: 55px !important;
  }
`
const GradientText = styled.div`
  font-size: 30px;
  margin-left: 10px;
  font-weight: bold;
  background: linear-gradient(to right, #ff7e7e, #ff0000);
  -webkit-background-clip: text;
  color: transparent;
  line-height: 50px;
  cursor: pointer;

  @media (max-width: 768px) {
    display: none;
    /* font-size: 24px;
    margin-left: 5px; */
  }
`
const StyledRight = styled.div`
  display: flex;
  button {
    font-size: 14px;
    height: 50px;
    @media (max-width: 768px) {
      font-size: 12px;
      height: 40px;
    }
    @media (max-width: 767px) {
      flex-direction: column;
      align-items: flex-start;
    }
  }
  @media (max-width: 768px) {
    button {
      margin-left: 5px;
    }
  }
`
const StyledLeft = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  .info {
    padding-bottom: 10px;
    line-height: 1px;
    margin-left: 10px;
    font-size: 13px;
    font-family: 'Nunito', sans-serif; /* 使用圆润的字体 */
    font-weight: 400; /* 设置字体粗细 */
    color: #333; /* 设置字体颜色 */
    text-align: center; /* 居中对齐文本 */

    @media (max-width: 768px) {
      display: none;
    }
  }
  /* .web-left {
    display: flex;
    @media (max-width: 768px) {
      display: none;
    }
  } */
  img {
    width: 70px;
    height: 45px;
    cursor: pointer;
    @media (max-width: 768px) {
      width: 50px;
      height: 30px;
      display: none;
    }
  }
`
export const StyledItems = styled.div`
  height: 30px;
  line-height: 30px;

  button {
    font-size: 17px;
  }
`
export const StyledItemsTitle = styled.span`
  font-weight: 800;
`

const routeToMenuMap = new Map<string, string>([
  ['/', '首页'],
  ['/classification', '所有分类'],
  ['/vip/shop', '会员商城'],
  ['/web/shop', '会员商城'],
  ['/profit/invitation', '推广联盟'],
  ['/vip/center', '会员中心'],
  ['/vip/history', '历史记录'],
  ['/vip/favorite', '收藏列表'],
  ['/mail/message', '消息通知'],
  ['/reset-password', '修改密码'],
  ['/login', '登录账号'],
  ['/search/title', '搜索'],
  ['/vip/service', '客服'],
])
export const CommonHeader: React.FC = () => {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const location = useLocation()

  const userStore = useStore(UserStore)

  const isMobile = useIsMobile()

  const [expanded, setExpanded] = useState(false)

  const {
    token: { colorBgContainer },
  } = theme.useToken()

  useMount(() => {
    if (!userStore.user) {
      navigate('/')
    }
  })
  const [open, setOpen] = useState(false)

  // const showDrawer = () => {
  //   setOpen(true)
  // }

  // const onClose = () => {
  //   setOpen(false)
  // }

  // const navigetaHandler = (nfn: any) => {
  //   setOpen(false)
  //   nfn()
  // }

  return (
    <StyledHeaders colorBgContainer={colorBgContainer}>
      <StyledLeft>
        {isMobile ? (
          <div
            style={{
              display: 'flex',
              width: '100%',
              minWidth: expanded ? '50px' : '150px',
            }}
          >
            <div>
              <MobileButtonsLeft setOpen={setOpen} />
            </div>
            <StyledTitle>{routeToMenuMap.get(pathname)}</StyledTitle>
          </div>
        ) : (
          <>
            <img
              src="/logo.png"
              alt="Charizard"
              onClick={() => navigate('/')}
            />
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                // lineHeight: '64px !important',
              }}
            >
              <GradientText
                onClick={() => {
                  userStore.hasAccess('user:manage:all')
                    ? navigate('/dashboard')
                    : navigate('/')
                }}
              >
                AF-Share
              </GradientText>
              {/* <div className="info">在舞蹈的律动中，共同探索审美的极致境界</div> */}
            </div>
          </>
        )}
      </StyledLeft>

      <StyledRight>
        {isMobile ? (
          <MobileButtonsRight expanded={expanded} setExpanded={setExpanded} />
        ) : (
          <WebButtons expanded={expanded} setExpanded={setExpanded} />
        )}
      </StyledRight>

      {/* <Drawer
        placement={'left'}
        width={'70%'}
        onClose={onClose}
        open={open}
        style={{ textAlign: 'left' }}
      >
        <StyledItems>
          <Button
            icon={<HomeOutlined />}
            type="text"
            style={{ color: '#718dac' }}
            onClick={() => navigetaHandler(navigate('/'))}
          >
            前往首页
          </Button>
        </StyledItems>
        <StyledItems>
          <Button
            icon={<ProductOutlined />}
            type="text"
            style={{ color: '#718dac' }}
            onClick={() => navigetaHandler(navigate('/classification'))}
          >
            所有分类
          </Button>
        </StyledItems>
      </Drawer> */}
    </StyledHeaders>
  )
}

export default CommonHeader
