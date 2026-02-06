import React, { useEffect, useState } from 'react'

import { Button, Tabs, TabsProps } from 'antd'
import styled from '@emotion/styled'
import { HistoryPart } from './components/history'
import { useIsMobile } from '~/hooks/useIsMobile'
import { FavoritePart } from './components/favorite'
import { VipCenter } from './components/vip-center'
import { AvararFrame } from './components/avatar-frame'
import { useLocation } from 'react-router'
import { Invitation } from '../invitation/components/invitation'
import { Record } from '../invitation/components/record'
import { ServicePart } from './components/service'
import { Orders } from './components/orders'
import { SignInPart } from './components/sign-in'
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
`

const PageVipPreview = () => {
  const isMobile = useIsMobile()
  const [isClicked, setIsClicked] = useState('vip-center')
  const location = useLocation()

  const { type }: { type: string } = location.state || {}

  const items: TabsProps['items'] = [
    {
      key: 'vip-center',
      label: (
        <Button
          type="link"
          style={{ width: 10, color: 'black' }}
          className="menu"
        >
          会员中心
        </Button>
      ),
      children: <VipCenter setIsClicked={setIsClicked} />,
    },

    {
      key: 'avatar_frames',
      label: (
        <Button
          type="link"
          style={{ width: 10, color: 'black' }}
          className="menu"
        >
          我的挂件
        </Button>
      ),
      children: <AvararFrame type="avatar" />,
    },
    {
      key: 'orders',
      label: (
        <Button
          type="link"
          style={{ width: 10, color: 'black' }}
          className="menu"
        >
          交易记录
        </Button>
      ),
      children: <Orders />,
    },

    // {
    //   key: 'favorite',
    //   label: (
    //     <Button type="link" className="menu" style={{ color: 'black' }}>
    //       收藏列表
    //     </Button>
    //   ),
    //   children: <FavoritePart />,
    // },
    // {
    //   key: 'history',
    //   label: (
    //     <Button type="link" className="menu" style={{ color: 'black' }}>
    //       观看历史
    //     </Button>
    //   ),
    //   children: <HistoryPart />,
    // },
    {
      key: 'invitations',
      label: (
        <Button type="link" className="menu" style={{ color: 'black' }}>
          推广中心
        </Button>
      ),
      children: <Invitation />,
    },
    {
      key: 'record',
      label: (
        <Button type="link" className="menu" style={{ color: 'black' }}>
          返利记录
        </Button>
      ),
      children: <Record />,
    },
    {
      key: 'service',
      label: (
        <Button type="link" className="menu" style={{ color: 'black' }}>
          联系客服
        </Button>
      ),
      children: <ServicePart />,
    },
  ]

  useEffect(() => {
    setIsClicked(type)
  }, [type])

  return (
    <StyledTabs
      defaultActiveKey={type}
      activeKey={isClicked}
      tabPosition={'left'}
      items={items}
      type="card"
      destroyInactiveTabPane
      onTabClick={(key) => {
        setIsClicked(key)
      }}
    />
  )
}

export default PageVipPreview
