import React, { useState } from 'react'
import styled from '@emotion/styled'
import { useStore } from '@kazura/react-mobx'
import { UserStore } from '@af-charizard/sdk-stores'

import { message, Button, Input, Steps } from 'antd'

import { StyledTitle, StyledTop } from '../../vip-preview/components/favorite'

import { services } from '@af-charizard/sdk-services'

import { useIsMobile } from '~/hooks/useIsMobile'
import { requireLogin } from '~/utils/requireLogin'
import {
  DiscordOutlined,
  FacebookFilled,
  InstagramFilled,
  QqOutlined,
  TikTokFilled,
  TwitchOutlined,
  TwitterOutlined,
  WechatFilled,
  WeiboOutlined,
  YoutubeFilled,
  YoutubeOutlined,
  ZhihuOutlined,
} from '@ant-design/icons'
import { copy } from '@kazura/web-util'
import { useMount } from 'ahooks'

const StyledMoney = styled.div`
  display: flex;
  /* padding: 15px 0; */
  font-size: 20px;
  line-height: 40px;
`
const StyledTitleStep = styled.div`
  min-height: 50px;
  span {
    color: #ea7a99;
  }
`
const StyledDescription = styled.div`
  .icon {
    margin: 20px 0;
  }
  @media (max-width: 768px) {
    margin-top: 10px;
    .icon {
      margin: 20px 0;
    }
  }
`
const StyledPage2 = styled.div`
  display: flex;

  @media (max-width: 768px) {
    display: block;
    padding-left: 2px;
  }
`
const StyledInput = styled.div`
  display: flex;
  padding: 10px 20px 20px 5px;

  margin-bottom: 20px;

  button {
    margin: 5px 0 0 15px;
    background-color: #fb7299 !important;
    color: #fff !important;
  }
  input {
    width: 400px;
  }
  @media (max-width: 768px) {
    display: block;
    padding-bottom: 0px;
    margin: 10px 0 20px 0;
    .icon {
      margin: 20px 0;
    }
    input {
      width: 100%;
    }
    button {
      margin: 15px 10px 0 0;
      background-color: #fb7299;
      color: #fff !important;
    }
  }
`
const StyledPage = styled.div`
  width: 100%;
  .ant-steps {
    padding-left: 20px;
  }
  .ant-steps-item-icon {
    background-color: #ea7a99 !important;
  }
  .ant-steps-icon {
    color: #fff !important;
  }

  .ant-card-meta-title {
    margin-bottom: 4px !important;
  }

  .anticon {
    font-size: 40px;
    margin: 0 5px;
  }
  @media (max-width: 768px) {
    .ant-steps {
      padding-left: 7px;
    }
    .anticon {
      font-size: 30px;
      margin: 2px 6px;
    }
  }
`

export const Invitation = () => {
  //用户信息
  const userStore = useStore(UserStore)


  const isMobile = useIsMobile()

  const [invitationPath, setInvitationPath] = useState('')
  const currentDomain = window.location.hostname

  /**
   *获取分享链接
   */
  const getInvitationPath = async () => {
    const resp = await services.pay$find$invitationCode()
    if (resp.data.code === 200) {
      const invitationPath =
        process.env.NODE_ENV === 'production'
          ? `http://${currentDomain}/#/?invitation=${resp.data.resource.invitationCode}`
          : `http://localhost:4009/#/?invitation=${resp.data.resource.invitationCode}`

      setInvitationPath(invitationPath)
    } else {
      message.error(resp.data.message)
    }
  }

  /**
   *重置分享链接
   */
  const resetInvitationPath = async () => {
    if (!userStore.user) {
      requireLogin()
      return
    }
    const resp = await services.pay$update$invitationCode()
    if (resp.data.code === 200) {
      const invitationPath =
        process.env.NODE_ENV === 'production'
          ? `http://${currentDomain}/#/?invitation=${resp.data.resource.invitationCode}`
          : `http://localhost:4009/#/?invitation=${resp.data.resource.invitationCode}`

      setInvitationPath(invitationPath)
      message.success('重置邀请码成功')
    } else {
      message.error(resp.data.message)
    }
  }

  useMount(() => {
    userStore.user && getInvitationPath()
  })

  return (
    <StyledPage>
      <div>
        <StyledTop style={{ display: isMobile ? 'none' : 'block' }}>
          <StyledTitle>推广中心</StyledTitle>
        </StyledTop>
        <StyledInput>
          <Input readOnly value={invitationPath} placeholder="请先登录"></Input>
          <div>
            <Button
              danger
              onClick={() => {
                if (!userStore.user) {
                  requireLogin()
                  return
                }
                copy(invitationPath)
                message.success('已复制到剪贴板')
              }}
            >
              复制
            </Button>
            <Button danger onClick={resetInvitationPath}>
              重置邀请码
            </Button>
          </div>
        </StyledInput>
        <StyledPage2>
          <Steps
            direction="vertical"
            current={-1}
            items={[
              {
                title: (
                  <StyledTitleStep>
                    <span>第一步：</span>
                    点击复制上方推广链接
                  </StyledTitleStep>
                ),
                description: <div></div>,
              },
              {
                title: (
                  <StyledTitleStep>
                    <span>第二步：</span>
                    将推广链接，发送到你日常使用的社交软件或交流群等
                  </StyledTitleStep>
                ),
                description: (
                  <StyledDescription>
                    <div className="icon">
                      <div>
                        <QqOutlined style={{ color: '#12B7F5' }} />
                        <WechatFilled style={{ color: '#07C160' }} />
                        <WeiboOutlined style={{ color: '#E6162D' }} />
                        <TikTokFilled style={{ color: '#010101' }} />
                        <ZhihuOutlined style={{ color: '#0084FF' }} />
                        <DiscordOutlined style={{ color: '#7289DA' }} />
                      </div>
                      <div style={{ marginTop: 10 }}>
                        <TwitterOutlined style={{ color: '#1DA1F2' }} />
                        <YoutubeOutlined style={{ color: '#FF0000' }} />
                        <FacebookFilled style={{ color: '#1877F2' }} />
                        <YoutubeFilled style={{ color: '#FF0000' }} />
                        <InstagramFilled style={{ color: '#E4405F' }} />
                        <TwitchOutlined style={{ color: '#6441A4' }} />
                      </div>
                    </div>
                  </StyledDescription>
                ),
              },
              {
                title: (
                  <StyledTitleStep>
                    <span>第三步：</span>
                    <br></br>
                    {/* 被邀请的用户通过你的分享链接注册账号，你将立即获得
                    <span style={{ padding: '0 5px' }}>2</span>枚 */}
                    被邀请的用户通过你的分享链接注册账号，你将与该用户绑定推荐关系。
                    <br></br>
                    当他每次充值完成，阁下就会获得他充值金额的
                    <span> 10 % </span>
                    作为佣金。<br></br>佣金将充值到阁下的账户，
                    <span>实时到账</span>
                  </StyledTitleStep>
                ),
              },
            ]}
          />
        </StyledPage2>
      </div>
    </StyledPage>
  )
}
