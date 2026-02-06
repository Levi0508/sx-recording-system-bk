import React, { useState } from 'react'
import { Button, message } from 'antd'
import styled from '@emotion/styled'
import { useStore } from '@kazura/react-mobx'
import { UserStore } from '@af-charizard/sdk-stores'
import { useIsMobile } from '~/hooks/useIsMobile'
import { useNavigate } from 'react-router'

const ModalWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`

const StyledHighlight = styled.span`
  color: #fb7299;
  font-weight: bold;
  padding: 0 2px;
`
const StyledDiv = styled.div`
  margin-top: 7px;
`

const ModalContent = styled.div`
  min-width: 300px;
  max-width: 400px;
  background: white;
  padding: 20px;
  border-radius: 10px;
  text-align: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  .title {
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 10px;
    color: #333;
  }
  @media (max-width: 768px) {
    max-width: 300px;
    padding: 15px 10px;
    .title {
      font-size: 18px;
      font-weight: bold;
      margin-bottom: 10px;
      color: #333;
    }
  }
  .content {
    font-size: 16px;
    line-height: 1.5;
    color: #666;
    margin-bottom: 10px;
  }

  .highlight {
    color: #fb7299;
    font-weight: bold;
  }

  button {
    cursor: pointer;

    margin-top: 10px;
    background-color: #fb7299 !important;
    color: #fff !important;
  }
`

interface IProps {
  onClose: () => void
}

const CommonMessage: React.FC<IProps> = ({ onClose }) => {
  const navigate = useNavigate()
  const isMobile = useIsMobile()
  const userStore = useStore(UserStore)

  return (
    <ModalWrapper>
      <ModalContent>
        <div className="title">公告</div>
        <div className="content">
          {/* 活动相关 */}
          <>
            {/* <StyledDiv>
              🎉 网站改制活动来袭：充值获得
              <StyledHighlight>8折</StyledHighlight>
              返利！
            </StyledDiv>
            <div>
              <span>点击 </span>
              <a
                onClick={() => {
                  navigate('/web/shop')
                }}
              >
                前往商城～
              </a>
            </div> */}
          </>
          {/* 推广联盟相关 */}
          <>
            {/* <StyledDiv>
            推广联盟：邀请好友<span className="highlight"> 注册成功 </span>
            即可
          </StyledDiv>
          <StyledDiv>
            获得超多返利！
            <a
              onClick={() => {
                if (!userStore.user) {
                  // message.warning('请先登录～')
                  // return
                  navigate('/login')
                  return
                }
                isMobile
                  ? navigate('/profit/invitation')
                  : navigate('/vip/buy', { state: { type: 'invitations' } })
              }}
            >
              前往推广联盟～
            </a>
          </StyledDiv> */}
          </>
          {/* 签到相关 */}
          {/* <>
            <StyledDiv>
              签到中心：<span className="highlight"> 累计签到 </span>
              即可免费
            </StyledDiv>
            <StyledDiv>
              领取会员！
              <a
                onClick={() => {
                  navigate('/web/sign-in')
                }}
              >
                点击前往签到～
              </a>
            </StyledDiv>
          </> */}

          {/* <StyledDiv> 🎯网站提供广告服务，商务合作可联系客服QQ</StyledDiv> */}
          {/* <StyledDiv>
            🎯为了更好体验，请使用<StyledHighlight>Edge</StyledHighlight>
            浏览器
          </StyledDiv> */}

          {/* 网盘相关 */}
          <>
            <StyledDiv>🎯想要收藏百度网盘资源的朋友</StyledDiv>
            <StyledDiv>
              请联系客服QQ：<StyledHighlight>3768637494</StyledHighlight>
            </StyledDiv>
          </>
        </div>
        <Button onClick={onClose} danger>
          我知道了
        </Button>
      </ModalContent>
    </ModalWrapper>
  )
}

export default CommonMessage
