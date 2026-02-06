import React, { useState, useMemo, useEffect, useCallback } from 'react'
import styled from '@emotion/styled'
import { useParams, useNavigate, useLocation } from 'react-router'
import { Button, message, Checkbox, Tag } from 'antd'
import {
  CopyrightOutlined,
  ArrowLeftOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons'
import { useStore } from '@kazura/react-mobx'
import { UserStore } from '@af-charizard/sdk-stores'
import { services } from '@af-charizard/sdk-services'
import { CommonModal } from '~/components/common-modal'
import { AnchorGoodsList } from '../classification-streamer/goods'
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
    display: flex;
    align-items: center;
    gap: 10px;
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

export const PageAnchorDetail = () => {
  const { goodsId } = useParams<{ goodsId: string }>()
  const navigate = useNavigate()
  const location = useLocation()
  const userStore = useStore(UserStore)
  const [isModalShow, setIsModalShow] = useState(false)
  const [isUpdateModalShow, setIsUpdateModalShow] = useState(false)
  const [includeUpdate, setIncludeUpdate] = useState(false)
  const [hasUpdatePackage, setHasUpdatePackage] = useState<boolean | null>(null)
  const [canAccess, setCanAccess] = useState<boolean | null>(null)
  const [anchorGoodsUrl, setAnchorGoodsUrl] = useState<string | null>(null)

  // 根据 goodsId 查找主播信息
  const anchorInfo = useMemo(() => {
    return AnchorGoodsList.find((item) => item.goodsId === goodsId)
  }, [goodsId])

  // 从本地 goods.ts 数据中获取 allowUpdate（脚本会从后端同步）
  const allowUpdate = anchorInfo?.allowUpdate !== false

  const isPurchased =
    userStore.user && (goodsId || '') in (userStore.purchasedAnchorGoods || {})
  const purchaseUrl = userStore.purchasedAnchorGoods?.[goodsId || '']

  // 获取购买详情（包括是否包更新）
  // 注意：接口失败时不要覆盖已经确定为 true 的状态（否则会把“已包更新”误打回去）
  const fetchPurchaseInfo = useCallback(async () => {
      if (userStore.user && goodsId && isPurchased) {
        try {
        const resp = await services.user$get$anchorGoodsPurchaseInfo({
              goodsId: goodsId || '',
        })

          if (resp.data.code === 200 && resp.data.resource) {
            const info = resp.data.resource
          const next = info.hasUpdatePackage === true
          setHasUpdatePackage(next)
          setCanAccess(info.canAccess === true)
          // 同步到全局 store，供列表页展示“已包更新”
          userStore.setPurchasedAnchorUpdatePackages({
            ...(userStore.purchasedAnchorUpdatePackages || {}),
            [goodsId || '']: next,
          })
          // 同步服务端返回的可访问 url（解决“链接已过期但已购买更新包后不恢复”的问题）
          const nextUrl = typeof info.url === 'string' ? info.url : ''
          userStore.setPurchasedAnchorGoods({
            ...(userStore.purchasedAnchorGoods || {}),
            [goodsId || '']: nextUrl,
          })
          return
        }

        // 接口非200/无resource：仅在未知(null)时降级为 false
        setHasUpdatePackage((prev) => (prev === null ? false : prev))
        setCanAccess((prev) => (prev === null ? false : prev))
        } catch (error) {
          console.error('获取购买信息失败', error)
        // 接口异常：仅在未知(null)时降级为 false
        setHasUpdatePackage((prev) => (prev === null ? false : prev))
        setCanAccess((prev) => (prev === null ? false : prev))
          }
        }
  }, [userStore, goodsId, isPurchased])

  useEffect(() => {
    fetchPurchaseInfo()
  }, [fetchPurchaseInfo, purchaseUrl])

  // 弹窗关闭时重置选择状态
  useEffect(() => {
    if (!isModalShow) {
      setIncludeUpdate(false)
    }
  }, [isModalShow])

  // 当 allowUpdate 为 false 时，确保不选中包更新
  useEffect(() => {
    if (!allowUpdate) {
      setIncludeUpdate(false)
    }
  }, [allowUpdate])

  if (!anchorInfo) {
    return (
      <StyledContainer>
        <div>主播不存在</div>
      </StyledContainer>
    )
  }

  const { title, price, originalPprice, detailImg, bgIMG } = anchorInfo
  const displayTitle = `${title} 主播合集`
  const originalPrice = originalPprice

  // 优先使用详情图片，如果没有则使用背景图片，最后使用默认图片
  const displayImg = detailImg || bgIMG || '/monthGoods/demo.png'

  /**
   * 购买主播合集
   */
  const buyAnchorHandler = async () => {
    const resp = await services.user$buy$anchor({
      goodsId: goodsId || '',
      includeUpdate: allowUpdate ? includeUpdate : false,
    })
    if (resp.data.code === 200) {
      message.success('购买成功！')
      setIsModalShow(false)
      setCanAccess(true)

      // 如果选择了包更新，立即更新状态
      if (allowUpdate && includeUpdate) {
        setHasUpdatePackage(true)
        userStore.setPurchasedAnchorUpdatePackages({
          ...(userStore.purchasedAnchorUpdatePackages || {}),
          [goodsId || '']: true,
        })
      } else {
        setHasUpdatePackage(false)
        userStore.setPurchasedAnchorUpdatePackages({
          ...(userStore.purchasedAnchorUpdatePackages || {}),
          [goodsId || '']: false,
        })
      }

      setIncludeUpdate(false)

      // 更新 UserStore 中的已购买商品列表
      // 无论URL是否存在，都要更新已购买状态
      const url = resp.data.resource?.url || ''
      userStore.setPurchasedAnchorGoods({
        ...(userStore.purchasedAnchorGoods || {}),
        [goodsId || '']: url,
      })

      // 重新获取购买信息以更新状态（延迟一点确保数据库写入完成）
      setTimeout(() => {
        fetchPurchaseInfo()
      }, 500)
    } else {
      message.error(resp.data.message)
      setIsModalShow(false)
    }
  }

  /**
   * 购买后续更新包
   */
  const buyUpdatePackageHandler = async () => {
    if (!allowUpdate) {
      message.warning('该主播合集不支持后续更新')
      setIsUpdateModalShow(false)
      return
    }
    try {
      const resp = await services.user$buy$anchorUpdatePackage({
        goodsId: goodsId || '',
      })
      if (resp.data.code === 200) {
        message.success('购买后续更新包成功！')
        setIsUpdateModalShow(false)
        setHasUpdatePackage(true)
        setCanAccess(true)
        userStore.setPurchasedAnchorUpdatePackages({
          ...(userStore.purchasedAnchorUpdatePackages || {}),
          [goodsId || '']: true,
        })
        // 重新获取购买信息以更新状态
        setTimeout(() => {
          fetchPurchaseInfo()
        }, 300)
      } else {
        message.error(resp.data.message)
        setIsUpdateModalShow(false)
      }
    } catch (error: any) {
      message.error(error?.response?.data?.message || '购买失败')
      setIsUpdateModalShow(false)
    }
  }

  /**
   * 使用月包同款 CommonModal：购买后续更新包确认
   */
  const confirmBuyUpdatePackage = () => {
    if (!allowUpdate) {
      message.warning('该主播合集不支持后续更新')
      return
    }
    setIsUpdateModalShow(true)
  }

  return (
    <StyledContainer>
      <StyledHeader>
        <div
          className="back-button"
          onClick={() => {
            // 从URL参数中获取tab状态，返回时恢复
            const searchParams = new URLSearchParams(location.search)
            const tab = searchParams.get('tab') || 'anchor'
            navigate(`/?tab=${tab}`)
          }}
        >
          <ArrowLeftOutlined style={{ marginRight: 5 }} />
          返回
        </div>
        <div className="title">
          <span>{displayTitle}</span>
          {allowUpdate === false ? (
            <Tag color="red">不更新</Tag>
          ) : hasUpdatePackage === true ? (
            <Tag color="orange">已包更新</Tag>
          ) : isPurchased && allowUpdate ? (
            <Tag color="blue">未包更新</Tag>
          ) : null}
        </div>
      </StyledHeader>

      <StyledContent>
        <StyledImageContainer>
          <img src={displayImg} alt={displayTitle} />
        </StyledImageContainer>

        <StyledInfo>
          {price > 0 && (
            <div className="price-section">
              <div className="current-price">
                <CopyrightOutlined style={{ marginRight: 5 }} />
                {price}
              </div>
              <div className="original-price">
                原价 {originalPrice}
                <CopyrightOutlined style={{ marginLeft: 5 }} />
              </div>
            </div>
          )}

          <div
            style={{
              marginTop: '10px',
              marginBottom: '0px',
              padding: '10px',
              backgroundColor: '#f5f5f5',
              borderRadius: '8px',
            }}
          >
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
                  单人主播合集 / 永久资源
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
                  在线
                </span>
                和
                <span style={{ color: '#fb7299', margin: '0 5px' }}>下载</span>
              </div>
              {/* <div style={{ margin: '8px 0', fontWeight: 600 }}>
                单人合集默认 <span style={{ color: '#fb7299' }}>不包更新</span>
                ， 需要更新请联系客服QQ：
                <span style={{ color: '#fb7299' }}>3768637494</span>
              </div> */}
              <div style={{ margin: '8px 0', fontWeight: 600 }}>
                <ExclamationCircleOutlined
                  style={{ color: '#faad14', marginRight: '6px' }}
                />
                请及时
                <span style={{ color: '#fb7299' }}> 转存 </span>
                至自己网盘，防止
                <span style={{ color: '#fb7299' }}> 链接失效 </span>
              </div>
              <div style={{ margin: '8px 0', fontWeight: 600 }}>
                <ExclamationCircleOutlined
                  style={{ color: '#faad14', marginRight: '6px' }}
                />
              包更新后，链接
             
                <span style={{ color: '#fb7299' }}> 不会失效 </span>
              </div>
            </div>
          </div>

          {isPurchased ? (
            <>
              {canAccess === false ? (
                <>
                <Button
                  type="primary"
                  className="action-button"
                  style={{
                    backgroundColor: '#52c41a',
                  }}
                  disabled
                >
                  链接已过期
                  </Button>
                  <div className="tip-text">
                    您的访问权限已过期，如需继续访问，请购买后续更新包
                  </div>
                  {allowUpdate && (
                    <Button
                      type="primary"
                      className="action-button"
                      style={{
                        backgroundColor: '#ff9800',
                        marginTop: '10px',
                      }}
                      onClick={confirmBuyUpdatePackage}
                    >
                      购买后续更新包（+40）
                </Button>
              )}
                </>
              ) : purchaseUrl && purchaseUrl.trim() !== '' ? (
                <>
                  <Button
                    type="primary"
                    className="action-button"
                    style={{
                      backgroundColor: '#52c41a',
                    }}
                    onClick={async () => {
                      // 打开新窗口
                      window.open(purchaseUrl, '_blank')
                      // 记录点击行为（仅在成功跳转的情况下记录）
                      if (userStore.user && goodsId) {
                        try {
                          await services.user$record$anchorGoodsClick({
                            goodsId: goodsId || '',
                            url: purchaseUrl || undefined,
                          })
                        } catch (error) {
                          // 静默失败，不影响用户体验
                          console.error('记录点击失败', error)
                        }
                      }
                    }}
                  >
                    前往领取
                  </Button>
                  <div className="tip-text">
                    如您已经购买，点击《前往领取》进行获取
                  </div>
                  {/* 只要支持更新且未包更新，就显示按钮 */}
                  {allowUpdate && hasUpdatePackage !== true && (
                    <Button
                      type="primary"
                      className="action-button"
                      style={{
                        backgroundColor: '#ff9800',
                        marginTop: '10px',
                      }}
                      onClick={confirmBuyUpdatePackage}
                    >
                      包后续永久更新
                    </Button>
                  )}
                </>
              ) : (
                <>
                  <Button
                    type="primary"
                    className="action-button"
                    style={{
                      backgroundColor: '#52c41a',
                    }}
                    onClick={() => {
                      message.info('该合集请联系客服QQ3768637494领取')
                    }}
                  >
                    前往领取
                  </Button>
                  <div className="tip-text">
                    该合集请联系客服 QQ3768637494 领取
                  </div>
                  {allowUpdate && hasUpdatePackage !== true && (
                    <Button
                      type="primary"
                      className="action-button"
                      style={{
                        backgroundColor: '#ff9800',
                        marginTop: '10px',
                      }}
                      onClick={confirmBuyUpdatePackage}
                    >
                      包后续永久更新
                    </Button>
                  )}
                </>
              )}
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
        oKHandler={buyAnchorHandler}
        title={'购买确认'}
        childrenPart={
          <div>
            <div style={{ marginBottom: '15px' }}>
              是否确认购买 {displayTitle}？
            </div>
            <div style={{ marginBottom: '10px' }}>
              {allowUpdate && (
              <Checkbox
                checked={includeUpdate}
                onChange={(e) => setIncludeUpdate(e.target.checked)}
              >
                包后续永久更新
                <span style={{ color: '#fb7299', fontSize: '15px' }}>
                    <span style={{ fontWeight: 600, marginLeft: 4 }}>+40</span>
                    <CopyrightOutlined
                      style={{ marginLeft: 4, color: '#fb7299' }}
                    />
                </span>
              </Checkbox>
              )}
            </div>
            <div
              style={{
                fontSize: '20px',
                color: '#666',
                marginTop: '10px',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              总价：
              <span style={{ color: '#fb7299', marginLeft: 5 }}>
                {price + (allowUpdate && includeUpdate ? 40 : 0)}
              </span>
              <CopyrightOutlined style={{ marginLeft: 5, color: '#fb7299' }} />
            </div>
          </div>
        }
      />

      {/* 月包同款确认弹窗：用于“购买后续更新包（+40）” */}
      <CommonModal
        isModalShow={isUpdateModalShow}
        setIsModalShow={setIsUpdateModalShow}
        oKHandler={buyUpdatePackageHandler}
        title={'购买确认'}
        childrenPart={
          <div>
            是否确认购买后续永久更新？将扣除{' '}
            <span style={{ color: '#fb7299', fontWeight: 600 }}>40</span>
            <CopyrightOutlined style={{ marginLeft: 6, color: '#fb7299' }} />
          </div>
        }
      />
    </StyledContainer>
  )
}

export default PageAnchorDetail
