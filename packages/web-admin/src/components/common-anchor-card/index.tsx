import React from 'react'
import styled from '@emotion/styled'

import { Button, Card, Tag } from 'antd'
import Meta from 'antd/es/card/Meta'

import { useStore } from '@kazura/react-mobx'
import { UserStore } from '@af-charizard/sdk-stores'
import { CopyrightOutlined } from '@ant-design/icons'
import { IMonthCard } from '~/pages/vip-preview/components/month-part'
import { useNavigate, useLocation } from 'react-router'

const StyledCard = styled.div`
  margin: 5px; /* 每个元素右间距设置为8px */

  border: 1px solid #d6e2fb;
  border-radius: 8px;
  cursor: pointer;

  &:hover {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }
  .ant-card-body {
    padding-top: 0;
  }

  /* 修复移动端标题截断问题 */
  .ant-card-meta-title {
    white-space: normal !important;
    text-overflow: clip !important;
    overflow: visible !important;
  }

  @media (max-width: 768px) {
    &:hover {
      box-shadow: none;
    }
    .ant-card-body {
      padding-bottom: 10px;
    }
  }
`
const StyledCardA = styled.div`
  text-align: center;
  padding: 5px;
  div:nth-of-type(1) {
    font-size: 20px;
    font-weight: 600;
    padding-top: 5px;
  }
  @media (max-width: 768px) {
    div:nth-of-type(1) {
      font-size: 16px;
      font-weight: 600;
      padding-top: 5px;
    }
  }
`

const StyledHeaderRow = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  flex-wrap: wrap;
`

const StyledPrice = styled.div`
  display: flex;
  justify-content: center;
  @media (max-width: 768px) {
    display: flex;
    flex-direction: row; /* 保持在一行 */
    align-items: baseline; /* 基线对齐 */
    justify-content: center;
  }
`

const StyledBGImg = styled.div<{ bgImg: string }>`
  padding-top: calc((9 / 16) * 100%);
  /* padding-top: calc((12 / 15) * 100%); */

  border-radius: 6px;
  position: relative;
  width: 100%;
  overflow: hidden;

  background-image: url(${({ bgImg }) => bgImg});
  background-size: cover; /* 铺满 */
  background-position: center; /* 根据需要调整背景图像位置 */
  background-repeat: no-repeat; /* 防止背景图像重复 */

  @media (max-width: 768px) {
    border-radius: 3px;
  }
`
const StyledTitle = styled.div`
  font-size: 20px;
  font-weight: 600;
  padding-left: 8px;
  color: #fb7299;
  margin-top: 5px;
  @media (max-width: 768px) {
    font-size: 14px;
    padding-left: 0;
    margin-top: 0px;
  }
`
const StyledTitle2 = styled.div`
  font-size: 20px;
  font-weight: 600;
  padding-left: 8px;
  color: gray;
  font-size: 12px;
  line-height: 35px;
  text-decoration: line-through;
  margin-top: 5px;

  @media (max-width: 768px) {
    font-size: 10px;
    padding-left: 4px;
    margin-top: 0px;
  }
`

const StyledUpdateTag = styled(Tag)`
  margin: 0 !important;
  font-size: 12px;
  line-height: 18px;
  padding: 0 6px;
  @media (max-width: 768px) {
    font-size: 10px;
    line-height: 16px;
  }
`

interface IProps {
  item: IMonthCard
  witdhPartNumber?: number
  allowUpdate?: boolean
}
export const CommonAnchorCard: React.FC<IProps> = ({
  item,
  witdhPartNumber,
  allowUpdate = true,
}) => {
  const userStore = useStore(UserStore)
  const navigate = useNavigate()
  const location = useLocation()

  const { title, bgIMG, price, originalPprice, goodsId } = item
  const isPurchased =
    userStore.user && goodsId in (userStore.purchasedAnchorGoods || {})
  // 列表页不调用接口，直接使用 store 中缓存的 hasUpdatePackage（由详情页/购买后写入）
  const hasUpdatePackage =
    userStore.purchasedAnchorUpdatePackages?.[goodsId] === true

  const calculateWidth = () => {
    const marginRight = 10 // 每个元素右间距
    const cardWidth = `calc((100% - ${marginRight * witdhPartNumber!}px) / ${witdhPartNumber})`
    return cardWidth
  }

  return (
    <StyledCard
      style={{
        width: calculateWidth(),
      }}
      onClick={() => {
        // 保存当前tab状态到URL参数
        const currentTab =
          new URLSearchParams(location.search).get('tab') || 'anchor'
        navigate(`/anchor/${goodsId}?tab=${currentTab}`)
      }}
    >
      <Card
        hoverable
        cover={
          <StyledCardA>
            <div>
              <StyledHeaderRow>
                <span>{title}</span>
                {allowUpdate === false ? (
                  <StyledUpdateTag color="red">不更新</StyledUpdateTag>
                ) : isPurchased && hasUpdatePackage ? (
                  <StyledUpdateTag color="orange">已包更新</StyledUpdateTag>
                ) : isPurchased && allowUpdate ? (
                  <StyledUpdateTag color="blue">未包更新</StyledUpdateTag>
                ) : null}
              </StyledHeaderRow>
            </div>
            <StyledBGImg bgImg={bgIMG}></StyledBGImg>
          </StyledCardA>
        }
      >
        <Meta
          title={
            price > 0 ? (
              <StyledPrice>
                <StyledTitle>
                  <CopyrightOutlined style={{ marginRight: 5 }} />
                  {price}
                </StyledTitle>
                <StyledTitle2>
                  原价 {originalPprice}{' '}
                  <CopyrightOutlined style={{ marginRight: 5 }} />
                </StyledTitle2>
              </StyledPrice>
            ) : null
          }
          description={
            <>
              <Button
                type="primary"
                style={{
                  width: '100%',
                  margin: '0px 0 5px 0',
                  backgroundColor: isPurchased ? '#52c41a' : '#108ee9',
                }}
                onClick={(e) => {
                  e.stopPropagation() // 阻止事件冒泡，避免触发卡片的点击事件
                  // 保存当前tab状态到URL参数
                  const currentTab =
                    new URLSearchParams(location.search).get('tab') || 'anchor'
                  navigate(`/anchor/${goodsId}?tab=${currentTab}`)
                }}
              >
                {isPurchased ? '前往领取' : '前往购买'}
              </Button>
            </>
          }
        />
      </Card>
    </StyledCard>
  )
}
