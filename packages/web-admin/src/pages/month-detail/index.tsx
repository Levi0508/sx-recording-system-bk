import React, { useState, useMemo } from 'react'
import styled from '@emotion/styled'
import { useParams, useNavigate } from 'react-router'
import { Button, message } from 'antd'
import { CopyrightOutlined, ArrowLeftOutlined } from '@ant-design/icons'
import { useStore } from '@kazura/react-mobx'
import { UserStore } from '@af-charizard/sdk-stores'
import { services } from '@af-charizard/sdk-services'
import { CommonModal } from '~/components/common-modal'
import { VipCardArray, IMonthCard } from '../vip-preview/components/month-part'
import { requireLogin } from '~/utils/requireLogin'

const StyledContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`

const StyledHeader = styled.div`
  margin-bottom: 20px;

  .back-button {
    margin-bottom: 20px;
    color: #1890ff;
    cursor: pointer;

    &:hover {
      color: #40a9ff;
    }
  }

  .title {
    font-size: 28px;
    font-weight: 600;
    color: #333;
    margin-bottom: 10px;
  }
`

const StyledContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 30px;

  @media (min-width: 768px) {
    flex-direction: row;
    align-items: flex-start;
  }
`

const StyledImageContainer = styled.div`
  flex: 1;
  max-width: 600px;
  width: 100%;

  img {
    width: 100%;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`

const StyledInfo = styled.div`
  flex: 1;
  max-width: 500px;
  width: 100%;

  .price-section {
    display: flex;
    align-items: baseline;
    gap: 15px;
    margin-bottom: 20px;

    .current-price {
      font-size: 32px;
      font-weight: 600;
      color: #fb7299;
      display: flex;
      align-items: center;
    }

    .original-price {
      font-size: 18px;
      color: #999;
      text-decoration: line-through;
      display: flex;
      align-items: center;
    }
  }

  .action-button {
    width: 100%;
    height: 50px;
    font-size: 18px;
    font-weight: 600;
    margin-top: 30px;
  }

  .tip-text {
    margin-top: 10px;
    font-size: 12px;
    color: #999;
    text-align: center;
    line-height: 1.5;
  }
`

export const PageMonthDetail = () => {
  const { goodsId } = useParams<{ goodsId: string }>()
  const navigate = useNavigate()
  const userStore = useStore(UserStore)
  const [isModalShow, setIsModalShow] = useState(false)

  // 根据 goodsId 查找月包商品信息
  const item = useMemo(() => {
    return VipCardArray.find((item) => item.goodsId === goodsId)
  }, [goodsId])

  const isPurchased =
    userStore.user && userStore.purchasedMonthGoods?.[goodsId || '']
  const purchaseUrl = userStore.purchasedMonthGoods?.[goodsId || '']

  if (!item) {
    return (
      <StyledContainer>
        <div>商品不存在</div>
      </StyledContainer>
    )
  }

  const {
    title,
    bgIMG,
    price,
    originalPprice,
    goodsId: itemGoodsId,
    detailImg,
  } = item
  // 优先使用详情图片，如果没有则使用默认图片
  const displayImg = detailImg || '/monthGoods/demo.png'

  /**
   * 购买月包
   */
  const buyVipHandler = async () => {
    const resp = await services.user$buy$month({
      goodsId: itemGoodsId,
    })
    if (resp.data.code === 200) {
      message.success('购买成功！')
      setIsModalShow(false)

      // 更新 UserStore 中的已购买商品列表
      if (resp.data.resource?.url) {
        userStore.setPurchasedMonthGoods({
          ...(userStore.purchasedMonthGoods || {}),
          [itemGoodsId]: resp.data.resource.url,
        })
      }

      setTimeout(() => {
        window.location.reload()
      }, 1000)
    } else {
      message.error(resp.data.message)
      setIsModalShow(false)
    }
  }

  return (
    <StyledContainer>
      <StyledHeader>
        <div className="back-button" onClick={() => navigate(-1)}>
          <ArrowLeftOutlined style={{ marginRight: 5 }} />
          返回
        </div>
        <div className="title">{title}</div>
      </StyledHeader>

      <StyledContent>
        <StyledImageContainer>
          <img src={displayImg} alt={title} />
        </StyledImageContainer>

        <StyledInfo>
          <div className="price-section">
            <div className="current-price">
              <CopyrightOutlined style={{ marginRight: 5 }} />
              {price}
            </div>
            <div className="original-price">
              原价 {originalPprice}
              <CopyrightOutlined style={{ marginLeft: 5 }} />
            </div>
          </div>

          <div
            style={{
              marginTop: '10px',
              marginBottom: '0px',
              padding: '10px',
              backgroundColor: '#f5f5f5',
              borderRadius: '8px',
            }}
          >
            <div style={{ marginBottom: '8px' }}>
              <span
                style={{
                  color: '#fb7299',
                  marginBottom: '8px',
                  fontWeight: 600,
                }}
              >
                永久资源
              </span>
            </div>

            <div style={{ marginBottom: '8px' }}>
              大小 = 占用的网盘空间
              <span style={{ color: '#fb7299', margin: '0 5px' }}>
                (不占手机内存)
              </span>
            </div>
            <div style={{ marginBottom: '8px' }}>文件 = 合集视频个数</div>
            <div style={{ marginBottom: '8px' }}>文件夹 = 合集主播个数</div>
            <div style={{ fontWeight: 600 }}>
              资源在
              <span style={{ color: '#fb7299', margin: '0 5px' }}>
                百度网盘
              </span>
              ， 支持
              <span style={{ color: '#fb7299', margin: '0 5px' }}>
                在线观看
              </span>{' '}
              和<span style={{ color: '#fb7299', margin: '0 5px' }}>下载</span>
            </div>
          </div>

          {isPurchased ? (
            <>
              <Button
                type="primary"
                className="action-button"
                style={{
                  backgroundColor: '#52c41a',
                }}
                onClick={() => {
                  if (purchaseUrl) {
                    window.open(purchaseUrl, '_blank')
                  }
                }}
              >
                前往领取
              </Button>
              <div className="tip-text">
                如您已经购买，点击《前往领取》进行获取
              </div>
            </>
          ) : (
            <Button
              type="primary"
              className="action-button"
              style={{
                backgroundColor: '#108ee9',
              }}
              onClick={() => {
                if (!userStore.user) {
                  requireLogin()
                } else {
                  setIsModalShow(true)
                }
              }}
            >
              立即购买
            </Button>
          )}
        </StyledInfo>
      </StyledContent>

      <CommonModal
        isModalShow={isModalShow}
        setIsModalShow={setIsModalShow}
        oKHandler={buyVipHandler}
        title={'购买确认'}
        childrenPart={<div>是否确认购买</div>}
      />
    </StyledContainer>
  )
}

export default PageMonthDetail
