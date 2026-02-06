import React from 'react'
import styled from '@emotion/styled'

import { Button, Card, Tag, message } from 'antd'
import Meta from 'antd/es/card/Meta'

// import { IVipCard } from '~/pages/vip-preview/components/vip-center'
import { useStore } from '@kazura/react-mobx'
import { UserStore } from '@af-charizard/sdk-stores'
import { CopyrightOutlined } from '@ant-design/icons'
import { IVipCard } from '~/pages/vip-preview/components/shop'
import { IMonthCard } from '~/pages/vip-preview/components/month-part'
import { useNavigate } from 'react-router'

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

const StyledBGImg = styled.div<{ bgImg: string; bgSize?: string }>`
  padding-top: calc((6 / 13) * 100%);
  /* padding-top: calc((12 / 15) * 100%); */

  border-radius: 6px;
  position: relative;
  width: 100%;
  overflow: hidden;

  background-image: url(${({ bgImg }) => bgImg});
  background-size: ${({ bgSize }) => bgSize || 'contain'};
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
  @media (max-width: 768px) {
    font-size: 14px;
    padding-left: 0;
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
  @media (max-width: 768px) {
    font-size: 10px;
    padding-left: 8px;
  }
`
const StyledTag = styled.div`
  margin-bottom: 10px;
  .ant-tag {
    margin-top: 2px;
  }
  @media (max-width: 768px) {
    margin-bottom: 0px;
  }
`

const StyledOriginalPriceIcon = styled(CopyrightOutlined)`
  margin-right: 5px;
  @media (max-width: 768px) {
    display: none;
  }
`

interface IProps {
  item: IMonthCard
  witdhPartNumber?: number
  setIsModalShow?: React.Dispatch<React.SetStateAction<boolean>>
  setGoodsId?: React.Dispatch<React.SetStateAction<string>>
  pathPrefix?: string // 默认是 /month/
  bgSize?: string // 背景图尺寸，默认 contain
}
export const CommonMonthCard: React.FC<IProps> = ({
  item,
  witdhPartNumber,
  setIsModalShow,
  setGoodsId,
  pathPrefix = '/month/',
  bgSize = 'contain',
}) => {
  const userStore = useStore(UserStore)
  const navigate = useNavigate()

  const { title, bgIMG, price, originalPprice, goodsId } = item
  const isPurchased = userStore.user && userStore.purchasedMonthGoods?.[goodsId]

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
        navigate(`${pathPrefix}${goodsId}`)
      }}
    >
      <Card
        hoverable
        cover={
          <StyledCardA>
            <div>{title}</div>
            <StyledBGImg bgImg={bgIMG} bgSize={bgSize}></StyledBGImg>
          </StyledCardA>
        }
      >
        <Meta
          title={
            <StyledPrice>
              <StyledTitle>
                <CopyrightOutlined style={{ marginRight: 5 }} />
                {price}
              </StyledTitle>
              <StyledTitle2>
                原价 {originalPprice} <StyledOriginalPriceIcon />
              </StyledTitle2>
            </StyledPrice>
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
                  navigate(`${pathPrefix}${goodsId}`)
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
