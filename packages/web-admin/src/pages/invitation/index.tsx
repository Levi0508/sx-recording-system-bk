import React, { useState } from 'react'

import { Button, Tabs, TabsProps } from 'antd'
import styled from '@emotion/styled'
import { useIsMobile } from '~/hooks/useIsMobile'
import { useLocation } from 'react-router'
import { useStore } from '@kazura/react-mobx'
import { MailStore } from '@af-charizard/sdk-stores'

import { MoneyCollectOutlined, TransactionOutlined } from '@ant-design/icons'
import { Invitation } from './components/invitation'
import { Record } from './components/record'

const StyledTabs = styled(Tabs)`
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
    color: #fff !important;

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

const StyledButton = styled(Button)`
  color: black;
`

const PageInvitationPreview = () => {
  const isMobile = useIsMobile()
  const mailStore = useStore(MailStore)

  const [isClicked, setIsClicked] = useState('vip-center')
  const location = useLocation()

  const items: TabsProps['items'] = [
    {
      key: 'invitation',
      label: (
        <span className="icon">
          <MoneyCollectOutlined style={{ marginRight: 3 }} />
          推广中心
        </span>
      ),
      children: <Invitation />,
    },
    {
      key: 'record',
      label: (
        <span className="icon">
          <TransactionOutlined style={{ marginRight: 3 }} />
          返利记录
        </span>
      ),
      children: <Record />,
    },
  ]

  return (
    <StyledTabs
      defaultActiveKey="unread"
      tabPosition={'top'}
      items={items}
      type="card"
      // destroyInactiveTabPane
      onTabClick={(key) => {
        setIsClicked(key)
      }}
    />
  )
}

export default PageInvitationPreview
