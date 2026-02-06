import React, { useState } from 'react'
import styled from '@emotion/styled'
import { useStore } from '@kazura/react-mobx'
import { UserStore } from '@af-charizard/sdk-stores'
import Meta from 'antd/es/card/Meta'
import { Card, message, Image, Button, Input, Tabs } from 'antd'

import { StyledTitle, StyledTop } from './favorite'

import Avatar from '/avatar.svg'

import { services } from '@af-charizard/sdk-services'

import { useIsMobile } from '~/hooks/useIsMobile'
import { CopyrightOutlined } from '@ant-design/icons'
import { StyledInfo, StyledInfo2, StyledInput } from './vip-center'
import { moneyHandler } from '~/utils/money'
import { CommentWarning } from '~/components/common-warning'
import { requireLogin } from '~/utils/requireLogin'

export interface IVipCard {
  goodsId: string
  bgIMG: string
  title: string
  price: number
  originalPprice: number
  indate: number
}

const StyledExchange = styled.div`
  display: flex;
  min-height: 80px;
  /* align-items: center; */
  flex-direction: column;
  width: 100%;
`
export const StyledVideos = styled.div`
  /* height: 150%; */
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
`
export const StyledTabs = styled(Tabs)`
  margin-top: 20px;
  .ant-tabs-nav::before {
    border: none;
  }
  .ant-tabs-tab {
    margin-left: 5px !important;
    border: none !important;
    border-radius: 8px !important;
  }

  .ant-tabs-tab-active {
    background-color: #fb7299 !important;
    .icon {
      color: #fff !important;
    }
  }
  .icon {
    min-width: 50px !important;
    text-align: center;
  }
  .ant-tabs-card {
    border: none !important;
  }
  .ant-tabs-content-holder {
    border: none !important;
  }

  @media (max-width: 768px) {
    margin-top: 10px;
    margin-bottom: 30px;
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
export const StyledImage = styled(Image)`
  background-size: cover;
  background-position: center;
  width: 60px !important;
  height: 60px !important;
  border-radius: 50% !important; // 强制圆角
  object-fit: cover !important; // 确保图片覆盖整个容器
  overflow: hidden !important; // 确保内容不溢出
`
export const StyledImage2 = styled.img`
  background-size: cover;
  background-position: center;

  border-radius: 50% !important; // 强制圆角
  object-fit: cover !important; // 确保图片覆盖整个容器
  overflow: hidden !important; // 确保内容不溢出
`
const StyledMoney = styled.div`
  display: flex;
  padding: 15px 0;
  font-size: 20px;
  line-height: 40px;

  button {
    margin: 5px 0 0 15px;
    background-color: #fb7299 !important;
    color: #fff !important;
  }
`

const StyledPage = styled.div`
  width: 100%;
  .ant-card-body {
    height: 100%;
    padding: 15px 15px 15px 15px;
  }
  .ant-avatar {
    width: 50px;
    height: 50px;
  }

  @media (max-width: 768px) {
    .ant-card {
      /* height: 100%; */
    }
    .ant-card-body {
      height: 100%;
      padding: 15px 15px 15px 15px;
    }
  }
  .ant-card-meta-title {
    margin-bottom: 4px !important;
  }
`

export const AvatarCpn = (data: string, wh = 60) => {
  return <StyledImage2 src={data || Avatar} style={{ width: wh, height: wh }} />
}

export const PageWallet = () => {
  //用户信息
  const userStore = useStore(UserStore)

  const isMobile = useIsMobile()

  const [cardPassword, setCardPassword] = useState('')

  /**
   *兑换卡密
   */
  const exchangeHandler = async () => {
    if (!userStore.user) {
      requireLogin()
      return
    }

    if (!cardPassword) {
      message.warning('您还没有输入兑换卡密')
      return
    }
    if (cardPassword.length !== 10) {
      message.warning('卡密格式有误')
      return
    }

    const resp = await services.pay$exchange$card({
      cardPassword,
    })
    if (resp.data.code === 200) {
      message.success(`兑换成功，页面即将刷新`)
      setTimeout(() => {
        window.location.reload()
      }, 1000)
    } else {
      message.error(resp.data.message)
    }
  }

  return (
    <StyledPage>
      <div>
        <StyledTop>
          <StyledTitle>我的钱包</StyledTitle>
        </StyledTop>
        <CommentWarning
          style={{ marginLeft: 5, marginBottom: 15 }}
          children={
            <div>
              <div>🎉 网站改制活动来袭：活动期间充值，可获得 8折额外返利！详情见系统邮件～</div>
                  <div>金额充值后，请复制获得的卡密，粘贴到输入框兑换</div>

              {/* <div>
                1、注意：为平衡高昂的服务器存储和带宽成本，您需要购买VIP后才能观看视频，谢谢理解！
              </div>
              {isMobile ? (
                <>
                  <div>2、注意：VIP会员套餐多次购买，时间将会累加。</div>
                  <div>如需购买网盘资源请联系客服QQ：3768637494</div>
                </>
              ) : (
                <>
                  <div>2、注意：VIP会员套餐多次购买，时间将会累加。</div>
                  <div>
                    3、注意：您可以点击下方的 “充值”
                    按钮，购买兑换卡进行充值。若无法操作，可联系客服，手动开通VIP
                  </div>

                  <div>
                    如需购买百度网盘资源，请联系客服QQ：3768637494（永久资源，不免费谢谢）
                  </div>
                </>
              )} */}
            </div>
          }
        ></CommentWarning>

        <Card
          style={{
            marginLeft: 5,
            paddingBottom: 7,
          }}
        >
          <Meta
            title={<div>自助兑换卡密</div>}
            description={
              <StyledExchange>
                {!isMobile && (
                  <StyledMoney style={{ marginRight: 100 }}>
                    <div>账户余额：</div>
                    <div style={{ color: '#FB7299', fontSize: 30 }}>
                      {moneyHandler(userStore.user?.money)}
                    </div>
                    <div>
                      <CopyrightOutlined style={{ marginLeft: 10 }} />
                    </div>

                    <Button
                      danger
                      onClick={() => {
                        // message.warning(
                        //   '充值请联系客服Q：1946742459、3768637494',
                        // )
                        // return
                        window.open('https://shop.autofaka.com//links/4C7BA277')
                      }}
                    >
                      充值
                    </Button>
                    <StyledInfo2>
                      若进入不了充值界面，请更换成edge浏览器或者私聊客服处理
                    </StyledInfo2>
                  </StyledMoney>
                )}
                <StyledInput>
                  {isMobile && (
                    <StyledInfo
                      style={{
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'space-between',
                      }}
                    >
                      <div style={{ minWidth: 200 }}>
                        <span> 余额：</span>
                        <span style={{ color: '#FB7299', fontSize: 20 }}>
                          {moneyHandler(userStore.user?.money)}
                        </span>
                        <span>
                          <CopyrightOutlined style={{ marginLeft: 5 }} />
                        </span>
                      </div>
                      <div>
                        <Button
                          danger
                          onClick={() => {
                            // message.warning(
                            //   '充值请联系客服Q：1946742459、3768637494',
                            // )
                            // return
                            window.open(
                              'https://shop.autofaka.com//links/4C7BA277',
                            )
                          }}
                        >
                          充值
                        </Button>
                      </div>
                    </StyledInfo>
                  )}
                  <div
                    style={{ display: 'flex', justifyContent: 'space-between' }}
                  >
                    <Input
                      value={cardPassword}
                      onChange={(e) => setCardPassword(e.target.value.trim())}
                      placeholder="请输入获取的卡密"
                    ></Input>
                    <Button danger onClick={exchangeHandler}>
                      兑换
                    </Button>
                  </div>
                  <StyledInfo2>
                    充值成功后，请复制获得的卡密，粘贴到输入框兑换
                  </StyledInfo2>
                </StyledInput>
              </StyledExchange>
            }
          />
        </Card>
      </div>
    </StyledPage>
  )
}
