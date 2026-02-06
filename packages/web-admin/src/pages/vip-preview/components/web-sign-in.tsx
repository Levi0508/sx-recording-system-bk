import React, { useEffect, useState } from 'react'

import { Tabs, TabsProps } from 'antd'
import styled from '@emotion/styled'
import { useIsMobile } from '~/hooks/useIsMobile'

import { useLocation } from 'react-router'
import { VIPPart } from './vip-part'
import { StyledVideos } from './shop'
import { AvararFrame } from './avatar-frame'
import { StyledButton } from '~/pages/mail'
import { PageWallet } from './wallet'
import { StyledTitle, StyledTop } from './favorite'
import {
  DollarOutlined,
  FireOutlined,
  SketchOutlined,
  SkinOutlined,
} from '@ant-design/icons'
import { SignInPart } from './sign-in'
import { SignInGift } from './sign-in-gift'
import { CommentWarning } from '~/components/common-warning'

const StyledTabs = styled(Tabs)`
  /* padding: 0 50px; */

  .ant-tabs-tab {
    margin-bottom: 10px !important;
    border: none !important;
  }
  .ant-btn {
    /* color: black; */
    /* width: 150px; */
  }
  .ant-tabs-tab-active {
    background-color: #fb7299 !important;
    .ant-btn {
      color: #fff !important;
    }
  }
  .ant-tabs-card {
    border: none !important;
  }
  .ant-tabs-content-holder {
    border: none !important;
  }
  @media (max-width: 768px) {
    .ant-tabs-tab {
      color: black !important;
      border-radius: 8px !important;
      /* padding: 5px 16px !important; */
    }
    .ant-tabs-nav {
      margin: 0 !important;
    }
    .ant-tabs-tab-active {
      background-color: #fff !important;
      .icon {
        color: #fb7299 !important;
      }
    }
  }
`

const PageWebSignIn = () => {
  const isMobile = useIsMobile()

  const [isClicked, setIsClicked] = useState('vip-center')
  const location = useLocation()
  const [isModalShow, setIsModalShow] = useState(false)

  //first tab key
  const [fisrtKey, setFisrtKey] = useState('')

  const { type }: { type: string } = location.state || {}

  const tabItems: TabsProps['items'] = [
    {
      key: 'sign-in',
      label: isMobile ? (
        <span className="icon">
          <FireOutlined style={{ marginRight: 3 }} />
          签到中心
        </span>
      ) : (
        <StyledButton type="link" className="menu">
          签到中心
        </StyledButton>
      ),
      children: <SignInPart></SignInPart>,
    },
    {
      key: 'gift',
      label: isMobile ? (
        <span className="icon">
          <DollarOutlined style={{ marginRight: 3 }} />
          奖励兑换
        </span>
      ) : (
        <StyledButton type="link" className="menu">
          奖励兑换
        </StyledButton>
      ),
      children: (
        <>
          <StyledTop>
            <StyledTitle>奖励兑换</StyledTitle>
          </StyledTop>
          <div style={{ marginTop: 10 }}>
            <SignInGift
              isModalShow={isModalShow}
              setIsModalShow={setIsModalShow}
            ></SignInGift>
          </div>
        </>
      ),
    },
  ]

  useEffect(() => {
    setIsClicked(type)
  }, [type])

  return (
    <>
      {isMobile && (
        <CommentWarning
          style={{ marginLeft: 5, marginBottom: 15 }}
          children={
            <>
              <div>
                1、点击签到按钮，将打开淘宝店铺窗口，关注店铺后才视为签到成功！
              </div>
              <div>2、签到天数累计后可兑换会员天数（每日8点更新签到）</div>
            </>
          }
        ></CommentWarning>
      )}

      <StyledTabs
        defaultActiveKey="sign-in"
        tabPosition={isMobile ? 'top' : 'left'}
        items={tabItems}
        type="card"
        destroyInactiveTabPane
        onTabClick={(key) => {
          setFisrtKey(key)
        }}
      ></StyledTabs>
    </>
  )
}

export default PageWebSignIn
