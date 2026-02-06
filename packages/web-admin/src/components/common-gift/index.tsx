import React from 'react'
import styled from '@emotion/styled'

import { Button, Card, Tag, message } from 'antd'
import Meta from 'antd/es/card/Meta'

// import { IVipCard } from '~/pages/vip-preview/components/vip-center'
import { useStore } from '@kazura/react-mobx'
import { UserStore } from '@af-charizard/sdk-stores'
import { CopyrightOutlined } from '@ant-design/icons'
import { IGiftCard } from '~/pages/vip-preview/components/sign-in-gift'
import { requireLogin } from '~/utils/requireLogin'

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
  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
  }
`

const StyledBGImg = styled.div`
  padding-top: calc((12 / 13) * 100%);
  /* padding-top: calc((12 / 15) * 100%); */

  border-radius: 6px;
  position: relative;
  width: 100%;
  overflow: hidden;

  background-image: url(${({ bgImg }: { bgImg: string }) => bgImg});
  background-size: contain; /* 调整背景图像尺寸，确保完整显示 */
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
    font-size: 15px;
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
    font-size: 12px;
  }
`
const StyledTag = styled.div`
  margin-bottom: 10px;
  .ant-tag {
    margin-top: 12px;
  }
  @media (max-width: 768px) {
    margin-bottom: 0px;
  }
`

interface IProps {
  item: IGiftCard
  witdhPartNumber?: number
  setIsModalShow: React.Dispatch<React.SetStateAction<boolean>>
  setGoodsId: React.Dispatch<React.SetStateAction<string>>
}
export const CommonGift: React.FC<IProps> = ({
  item,
  witdhPartNumber,
  setIsModalShow,
  setGoodsId,
}) => {
  const userStore = useStore(UserStore)

  const { title, indate, goodsId } = item
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
    >
      <Card
        hoverable
        cover={
          <StyledCardA>
            <div>{title}</div>
          </StyledCardA>
        }
      >
        <Meta
          description={
            <>
              <StyledTag>
                <Tag color="green">无限次播放</Tag>
                <Tag color="green">会员{indate}</Tag>
              </StyledTag>
              <Button
                type="primary"
                style={{
                  width: '100%',
                  margin: '10px 0 5px 0',
                  backgroundColor: '#108ee9',
                }}
                onClick={() => {
                  if (!userStore.user) {
                    requireLogin()
                  } else {
                    setIsModalShow(true)
                    setGoodsId(goodsId)
                  }
                }}
              >
                点击领取
              </Button>
            </>
          }
        />
      </Card>
    </StyledCard>
  )
}
