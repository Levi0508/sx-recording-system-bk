import React, { useState } from 'react'

import { Button, Tabs, TabsProps } from 'antd'
import styled from '@emotion/styled'
import { useIsMobile } from '~/hooks/useIsMobile'
import { UnRead } from './components/unread'
import { useLocation } from 'react-router'
import { useStore } from '@kazura/react-mobx'
import { MailStore } from '@af-charizard/sdk-stores'
import { TypePage } from './components/type'
import {
  CommentOutlined,
  MailOutlined,
  MessageOutlined,
  SettingOutlined,
} from '@ant-design/icons'
import { NOTIFICATION_TYPE_ENUM } from '@af-charizard/sdk-types'

export const StyledTabs = styled(Tabs)`
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

export const StyledButton = styled(Button)`
  color: black;
`

const PageMailPreview = () => {
  const isMobile = useIsMobile()
  const mailStore = useStore(MailStore)

  const [isClicked, setIsClicked] = useState('vip-center')
  const location = useLocation()

  const items: TabsProps['items'] = isMobile
    ? [
        {
          key: 'unread',
          label: (
            <span className="icon">
              <MailOutlined style={{ marginRight: 3 }} />
              未读
            </span>
          ),
          children: <UnRead setIsClicked={setIsClicked} />,
        },

        // {
        //   key: 'read',
        //   label: (
        //     <span className="icon">
        //       <MailFilled style={{ marginRight: 3 }} />
        //       已读
        //     </span>
        //   ),
        //   children: <Read />,
        // },
        {
          key: 'video',
          label: (
            <span className="icon">
              <CommentOutlined style={{ marginRight: 3 }} />
              评论
            </span>
          ),
          children: <TypePage type={NOTIFICATION_TYPE_ENUM.VIDEO} />,
        },
        {
          key: 'user',
          label: (
            <span className="icon">
              <MessageOutlined style={{ marginRight: 3 }} />
              私信
            </span>
          ),
          children: <TypePage type={NOTIFICATION_TYPE_ENUM.USER} />,
        },

        {
          key: 'system',
          label: (
            <span className="icon">
              <SettingOutlined style={{ marginRight: 3 }} />
              系统
            </span>
          ),
          children: <TypePage type={NOTIFICATION_TYPE_ENUM.SYSTEM} />,
        },
      ]
    : [
        {
          key: 'unread',
          label: (
            <StyledButton type="link" className="menu">
              未读消息
            </StyledButton>
          ),
          children: <UnRead setIsClicked={setIsClicked} />,
        },

        // {
        //   key: 'read',
        //   label: (
        //     <StyledButton type="link" className="menu">
        //       已读消息
        //     </StyledButton>
        //   ),
        //   children: <Read />,
        // },
        {
          key: 'user',
          label: (
            <StyledButton type="link" className="menu">
              个人私信
            </StyledButton>
          ),
          children: <TypePage type={NOTIFICATION_TYPE_ENUM.USER} />,
        },
        {
          key: 'video',
          label: (
            <StyledButton type="link" className="menu">
              评论回复
            </StyledButton>
          ),
          children: <TypePage type={NOTIFICATION_TYPE_ENUM.VIDEO} />,
        },

        {
          key: 'system',
          label: (
            <StyledButton type="link" className="menu">
              系统通知
            </StyledButton>
          ),
          children: <TypePage type={NOTIFICATION_TYPE_ENUM.SYSTEM} />,
        },
      ]

  return (
    <StyledTabs
      defaultActiveKey="unread"
      tabPosition={isMobile ? 'top' : 'left'}
      items={items}
      type="card"
      destroyInactiveTabPane
      onTabClick={(key) => {
        setIsClicked(key)
      }}
    />
  )
}

export default PageMailPreview
