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
  SketchOutlined,
  SkinOutlined,
  SoundFilled,
} from '@ant-design/icons'
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

const PageWebShop = () => {
  const isMobile = useIsMobile()

  const [isClicked, setIsClicked] = useState('vip-center')
  const location = useLocation()
  const [isModalShow, setIsModalShow] = useState(false)

  //first tab key
  const [fisrtKey, setFisrtKey] = useState('')

  const { type }: { type: string } = location.state || {}

  const tabItems: TabsProps['items'] = [
    {
      key: 'wallet',
      label: isMobile ? (
        <span className="icon">
          <DollarOutlined style={{ marginRight: 3 }} />
          我的钱包
        </span>
      ) : (
        <StyledButton type="link" className="menu">
          我的钱包
        </StyledButton>
      ),
      children: <PageWallet></PageWallet>,
    },
    // {
    //   key: 'VIP',
    //   label: isMobile ? (
    //     <span className="icon">
    //       <SketchOutlined style={{ marginRight: 3 }} />
    //       会员套餐
    //     </span>
    //   ) : (
    //     <StyledButton type="link" className="menu">
    //       会员套餐
    //     </StyledButton>
    //   ),
    //   children: (
    //     <>
    //       {/* 活动相关 */}
    //       {/* <CommentWarning
    //         style={{ marginLeft: 5, marginBottom: 15 }}
    //         children={
    //           <div>
    //             <SoundFilled style={{ marginRight: 5 }} />
    //             周末活动来袭：活动期间充值，可获得 9折
    //             额外返利！（即充值30，可得到33枚平台币，以此类推）。活动时间截止：2026/01/11
    //             23:59
    //           </div>
    //         }
    //       ></CommentWarning> */}
    //       <StyledTop>
    //         <StyledTitle>会员套餐</StyledTitle>
    //       </StyledTop>
    //       <div style={{ marginTop: 10 }}>
    //         <VIPPart
    //           isModalShow={isModalShow}
    //           setIsModalShow={setIsModalShow}
    //         ></VIPPart>
    //       </div>
    //     </>
    //   ),
    // },
    {
      key: 'avatar_frames',
      label: isMobile ? (
        <span className="icon">
          <SkinOutlined style={{ marginRight: 3 }} />
          挂件系列
        </span>
      ) : (
        <StyledButton type="link" className="menu">
          挂件系列
        </StyledButton>
      ),
      children: (
        <StyledVideos>
          <AvararFrame type="shop" setFisrtKey={setFisrtKey} />
        </StyledVideos>
      ),
    },
  ]

  useEffect(() => {
    setIsClicked(type)
  }, [type])

  return (
    <StyledTabs
      defaultActiveKey="VIP"
      tabPosition={isMobile ? 'top' : 'left'}
      items={tabItems}
      type="card"
      destroyInactiveTabPane
      onTabClick={(key) => {
        setFisrtKey(key)
      }}
    ></StyledTabs>
  )
}

export default PageWebShop
