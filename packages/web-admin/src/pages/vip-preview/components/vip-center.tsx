import React, { useState } from 'react'
import styled from '@emotion/styled'

import { useIsMobile } from '~/hooks/useIsMobile'

import { CommentWarning } from '~/components/common-warning'
import { StyledTabs } from './shop'
import { Orders } from './orders'
import { Home } from './home'
import { AvararFrame } from './avatar-frame'

export const StyledInfo = styled.div`
  font-size: 13px;
  margin-bottom: 3px;
`
export const StyledInfo2 = styled.div`
  font-size: 15px;
  margin: 6px 0 3px 15px;
  @media (max-width: 768px) {
    margin: 6px 0 3px 0px;
    font-size: 13px;
  }
`
export const StyledInput = styled.div`
  display: flex;
  /* width: 100%; */

  button {
    margin: 5px 0 0 15px;
    background-color: #fb7299 !important;
    border: #fb7299;

    color: #fff !important;
  }
  input {
    width: 400px;
  }
  @media (max-width: 768px) {
    display: block;
    padding-bottom: 0px;
    .icon {
      margin: 20px 0;
    }
    input {
      max-width: 210px;
      height: 32px;
      margin-top: 5px;
    }
    button {
      /* margin: 15px 10px 0 0; */
      background-color: #fb7299;
      border: #fb7299;

      color: #fff !important;
      /* font-size: 10px; */
    }
  }
`

export const StyledSign = styled.div`
  color: #fb7299;
  display: flex;
  justify-content: left;
  align-items: center;
`
export const StyledImage2 = styled.img`
  /* background-size: cover;
  background-position: center; */
  cursor: pointer;
  /* margin-top: 10px; */

  border-radius: 50% !important; // 强制圆角
  /* object-fit: cover !important; // 确保图片覆盖整个容器
  overflow: hidden !important; // 确保内容不溢出 */
`

export const StyledExchange = styled.div`
  display: flex;
  min-height: 80px;
  align-items: center;
  width: 100%;
`
const StyledPage = styled.div`
  width: 100%;
  .ant-tabs-nav-wrap {
    margin-top: -7px;
    margin-bottom: 5px;
  }

  .ant-card-body {
    height: 100%;
    padding: 15px 15px 15px 15px;

    .ant-card-meta-avatar {
      padding-inline-end: 10px;
    }

    @media (max-width: 768px) {
      padding: 15px 15px 15px 15px;
    }
  }
  .avatar_ff {
    .ant-card-body {
      height: 100%;
      padding: 27px 15px 25px 28px;

      .ant-card-meta-avatar {
        padding-inline-end: 26px;
      }

      @media (max-width: 768px) {
        .ant-card-meta-avatar {
          padding-inline-end: 16px;
        }
        padding: 20px 10px 15px 20px;
      }
    }
  }
  .ant-avatar {
    width: 50px;
    height: 50px;
  }

  @media (max-width: 768px) {
    .ant-card {
      height: 100%;
    }
    .ant-table-cell {
      padding: 10px 10px !important;
    }
  }
  .ant-card-meta-title {
    margin-bottom: 4px !important;
  }
`

interface IProps {
  setIsClicked?: React.Dispatch<React.SetStateAction<string>>
}
export const VipCenter: React.FC<IProps> = () => {
  const isMobile = useIsMobile()

  //first tab key
  const [fisrtKey, setFisrtKey] = useState('')

  const tabItems = [
    {
      key: 'home',
      label: (
        <div className="icon" style={{ color: 'black' }}>
          个人主页
        </div>
      ),
      children: <Home></Home>,
    },
    {
      key: 'avatar_frames',
      label: (
        <div className="icon" style={{ color: 'black' }}>
          我的挂件
        </div>
      ),
      children: <AvararFrame type="avatar" />,
    },
    {
      key: 'orders',
      label: (
        <div className="icon" style={{ color: 'black' }}>
          交易记录
        </div>
      ),
      children: <Orders></Orders>,
    },
  ]

  return (
    <StyledPage>
      <CommentWarning
        style={{ marginLeft: 5, marginBottom: 15 }}
        children={
          <div>
            {isMobile ? (
              <>
                <div>
                  若进入不了充值界面，请更换成edge浏览器或者私聊客服QQ：3768637494
                </div>
              </>
            ) : (
              <>
                <div>
                  1、注意：您可以点击下方的 “充值”
                  按钮，购买兑换卡进行充值。若无法操作，可联系客服，手动开通VIP
                </div>

                <div>
                  2、若进入不了充值界面，请更换成edge浏览器或者私聊客服处理，QQ：3768637494
                </div>
              </>
            )}
          </div>
        }
      ></CommentWarning>
      <div>
        {isMobile ? (
          <StyledTabs
            defaultActiveKey="isValid"
            tabPosition={'top'}
            items={tabItems}
            type="card"
            destroyInactiveTabPane
            onTabClick={(key) => {
              setFisrtKey(key)
            }}
          ></StyledTabs>
        ) : (
          <Home></Home>
        )}
      </div>
    </StyledPage>
  )
}
