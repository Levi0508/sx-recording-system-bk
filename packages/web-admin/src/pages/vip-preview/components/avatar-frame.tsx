import React, { useEffect, useState } from 'react'
import styled from '@emotion/styled'
import { useStore } from '@kazura/react-mobx'
import { UserStore } from '@af-charizard/sdk-stores'
import { StyledTitle, StyledTop } from './favorite'
import CommonAvatarFrame from '~/components/common-avatar-frame'

import Avatar from '/avatar.svg'
import {
  AVATAR_TYPE_ENUM,
  FREE_AVATAR_TYPE_ENUM,
} from '@af-charizard/sdk-types/src/avatar-type'

import { useIsMobile } from '~/hooks/useIsMobile'
import { Button, message } from 'antd'
import { services } from '@af-charizard/sdk-services'
import { useAsyncEffect } from 'ahooks'
import { avatarFramesMap, avatarPrices } from '~/utils/price'
import { CopyrightOutlined } from '@ant-design/icons'
import { CommonEmpty } from '~/components/common-empty'
import { requireLogin } from '~/utils/requireLogin'
import { CommonModal } from '~/components/common-modal'
import { useScrollToTop } from '~/hooks'
import dayjs from 'dayjs'

export interface IAvatarData {
  userId: number
  avatarFrame: AVATAR_TYPE_ENUM
  price: number
  expiryDate: string
  isValid: boolean // 添加有效性检查
  bgIMG: string
  title: string
}

const StyledPage = styled.div`
  width: 100%;
  /* padding: 15px; */

  @media (max-width: 768px) {
    padding: 10px;
  }
`
const StyledPrice = styled.span`
  color: #fb7299;
  /* font-size: 20px; */
`
const StyledButtonGroup = styled.div`
  position: absolute;
  right: 0; /* 固定在右侧 */
`
const StyledPriceGroup = styled.div`
  position: absolute;
  left: 0; /* 固定在右侧 */
`
const StyledBuyButton = styled(Button)`
  background-color: #fb7299 !important;
  border: #fb7299;
  color: #fff !important;
  /* 移除 position: absolute; */
  margin-right: 20px; /* 可根据需要调整右边距 */
`

const AvatarFrameList = styled.div`
  display: flex; /* 使用 flex 布局 */
  flex-wrap: wrap; /* 允许换行 */
  margin-top: 40px;
  padding: 0 40px;
  gap: 45px;
  max-height: 400px;
  overflow-y: auto;

  @media (max-width: 768px) {
    padding: 5px 2px;
    gap: 20px;
  }

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #fb7299;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-track {
    background-color: #f0f0f0;
  }
`
const StyledFrame = styled.img`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  cursor: pointer;

  /* margin: 0 15px; */

  @media (max-width: 768px) {
    width: 80px;
    height: 80px;
  }

  &:hover {
    border: 3px solid #fb7299; /* 悬停时显示边框 */
  }
`

const FrameContainer = styled.div`
  text-align: center;
  max-width: 120px;
  position: relative;
  cursor: pointer;

  @media (max-width: 768px) {
    flex-basis: calc(33.33% - 20px); /* 移动端三个一行 */
  }
`
// 新增的 type 样式，用于显示头像框的类型
const StyledFrameType = styled.div`
  margin-top: 8px;
  font-size: 14px;
  color: #666;
  text-align: center;
`

const SelectedFramePreview = styled.div`
  margin: 10px 0;
  display: flex;
  justify-content: left; /* 中心对齐 */
  align-items: center;
  position: relative; /* 为了使购买按钮绝对定位 */
  padding: 0 20px; /* 调整内边距 */
`
// const StyledOwned = styled.div`
//   .owned {
//     color: green;
//   }
//   .no_owned {
//     color: #666;
//   }
// `

const StyledOwned = styled.div`
  position: absolute;
  bottom: 0; /* 贴在底部 */
  left: 0;
  right: 0;
  text-align: center;
  padding: 5px;
  font-size: 14px;
  border-radius: 0 0 4px 4px;

  .owned,
  .no_owned {
    padding: 3px 8px;
    border-radius: 4px;
  }

  .owned {
    color: green;
    background-color: #f0fff0;
  }

  .no_owned {
    color: #888;
    background-color: #f9f9f9;
  }
`
interface IPorps {
  type: string
  setFisrtKey?: React.Dispatch<React.SetStateAction<string>>
}
export const AvararFrame: React.FC<IPorps> = ({ type, setFisrtKey }) => {
  // 用户信息
  const userStore = useStore(UserStore)
  const isMobile = useIsMobile()
  const [isModalShow, setIsModalShow] = useState(false)
  const [isWear, setIsWear] = useState(false)

  const scrollToTop = useScrollToTop(500)

  // 获取头像框类型和路径
  const [avatarsFrames, setAvatarsFrames] = useState<IAvatarData[]>([])

  const [selectedFrameItem, setSelectedFrameItem] = useState<IAvatarData>()

  // 状态，用于存储选中的头像框type
  const [selectedFrame, setSelectedFrame] = useState<
    AVATAR_TYPE_ENUM | undefined
  >(userStore?.user?.avatarFrame || undefined)

  // 处理选择头像框
  const handleFrameSelect = (frame: AVATAR_TYPE_ENUM) => {
    setSelectedFrame(frame)
  }

  const freeAvatars = Object.values(FREE_AVATAR_TYPE_ENUM).map(
    (avatarFrame) => ({
      avatarFrame: avatarFrame,
      title: avatarFrame + '-免费',
      userId: userStore.user?.id,
      price: 0,
      bgIMG: `/avatars/${avatarFrame}.png`,
      // 默认价格为0
    }),
  )
  /**
   * 穿戴
   */
  const wearHandler = async () => {
    if (!selectedFrame) {
      message.warning('您还没有选择头像框')
      return
    }
    const resp = await services.user$wear_avatar_frame({
      avatar_frame_type: selectedFrame,
    })

    if (resp.data.code === 200) {
      message.success('穿戴成功')
      userStore.setUser({
        ...userStore.user,
        avatarFrame: selectedFrame,
      })
    } else {
      message.error('请重试')
    }
  }
  /**
   * 卸下
   */
  const demountHandler = async () => {
    if (!userStore.user.avatarFrame) {
      message.warning('当前没有设置头像框')
      return
    }
    const resp = await services.user$wear_avatar_frame({
      avatar_frame_type: undefined,
    })

    if (resp.data.code === 200) {
      message.success('已卸下')
      setSelectedFrame(undefined)
      userStore.setUser({
        ...userStore.user,
        avatarFrame: '',
      })
    } else {
      message.error('请重试')
    }
  }
  /**
   * 购买
   */
  const buyHandler = async () => {
    const resp = await services.user$buy$avatar_frame({
      goodsId: selectedFrame as AVATAR_TYPE_ENUM,
      isWear,
    })

    if (resp.data.code === 200) {
      setIsModalShow(false)
      if (isWear) {
        userStore.setUser({
          ...userStore.user,
          money:
            userStore.user.money -
            avatarFramesMap.get(selectedFrame!)!.price * 10,
          avatarFrame: selectedFrame,
        })
      } else {
        userStore.setUser({
          ...userStore.user,
          money:
            userStore.user.money -
            avatarFramesMap.get(selectedFrame!)!.price * 10,
        })
      }
      if (isWear) {
        message.success('购买并穿戴成功～')
      } else {
        message.success('购买成功～')
      }
      // setTimeout(() => {
      //   window.location.reload()
      // }, 1000)
      // setFisrtKey && setFisrtKey('avatar_frames')
    } else {
      message.error(resp.data.message)
    }
  }

  /**
   * 获取用户拥有的头像框
   */
  const getUserAvatarFramesList = async () => {
    const resp = await services.user$avatar_frames()

    if (resp.data.code === 200) {
      const data = resp.data.resource.map((item) => ({
        ...item,
        bgIMG: `/avatars/${item.avatarFrame}.png`,
        title: item.avatarFrame,
      }))

      const vipAvatarsData =
        userStore.user?.vipDeadLine &&
        dayjs(userStore.user.vipDeadLine) > dayjs()
          ? freeAvatars
          : []
      const newData = [...vipAvatarsData, ...data]

      setAvatarsFrames(newData as any)
      return data
    } else {
      setAvatarsFrames([])
      return []
    }
  }

  const beforeBuy = (isWear: boolean) => {
    if (!userStore.user) {
      requireLogin()
      return
    }
    if (!selectedFrameItem) {
      message.warning('请先选择需要购买的头像框')
      return
    }
    setIsWear(isWear)

    setIsModalShow(true)
  }
  // useEffect(() => {
  //   if (type === 'shop' && isMobile) {
  //     scrollToTop()
  //   }
  // }, [type, isMobile])
  useAsyncEffect(async () => {
    if (type === 'avatar') {
      getUserAvatarFramesList()
    } else if (type === 'shop') {
      let mergedData: any
      if (userStore.user) {
        const data = await getUserAvatarFramesList()
        const avatarFramesArray = Object.values(AVATAR_TYPE_ENUM).map(
          (avatarFrame) => ({
            avatarFrame,
            price: avatarPrices[avatarFrame] || 0,
            bgIMG: `/avatars/${avatarFrame}.png`,
            title: avatarFrame,
            // 默认价格为0
          }),
        )
        mergedData = avatarFramesArray.map((avatarFrameData) => {
          const matchingItem = data.find(
            (item) => item.avatarFrame === avatarFrameData.avatarFrame,
          )

          return {
            ...avatarFrameData,
            userId: matchingItem ? matchingItem.userId : null,
            expiryDate: matchingItem ? matchingItem.expiryDate : null,
            isValid: matchingItem ? matchingItem.isValid : null,
          }
        })
      } else {
        mergedData = Object.values(AVATAR_TYPE_ENUM).map((avatarFrame) => ({
          avatarFrame,
          userId: null,
          price: avatarPrices[avatarFrame] || 0,
          bgIMG: `/avatars/${avatarFrame}.png`,
          title: avatarFrame,
          // 默认价格为0
        }))
      }
      console.log(
        '%c这是锋酱的打印',
        'color: red; font-size: 30px;',
        mergedData,
      )

      setAvatarsFrames(mergedData as any)
    }
  }, [type])
  return (
    <StyledPage>
      {type === 'avatar' && (
        <StyledTop>
          <StyledTitle>我的挂件</StyledTitle>
        </StyledTop>
      )}
      {type === 'shop' && !isMobile && (
        <StyledTop>
          <StyledTitle>挂件系列</StyledTitle>
        </StyledTop>
      )}

      {/* 展示选中的头像框和用户头像 */}
      <SelectedFramePreview
        style={{
          justifyContent: isMobile ? 'space-between' : 'center',
          paddingLeft: isMobile ? '65px' : '20px',
        }}
      >
        <CommonAvatarFrame
          avatar={userStore.user?.avatar || Avatar} // 用户头像
          selectedFrame={selectedFrame}
          size={90} // 调整头像预览大小
          useAntdImage={false}
        ></CommonAvatarFrame>

        {type === 'shop' && (
          <StyledButtonGroup>
            <div
              style={{
                display: 'flex',
                flexDirection: isMobile ? 'column' : 'row',
              }}
            >
              <StyledPrice
                style={{
                  marginRight: 25,
                  lineHeight: '32px',
                  fontSize: isMobile ? '15px' : '18px',
                }}
              >
                价格：{selectedFrameItem?.price ?? 0}
                <CopyrightOutlined style={{ marginLeft: 5 }} />
              </StyledPrice>

              <StyledBuyButton
                danger
                onClick={() => {
                  if (selectedFrameItem?.userId) {
                    message.warning('该头像框已拥有')
                    return
                  }
                  beforeBuy(false)
                }}
              >
                购买
              </StyledBuyButton>
              {!isMobile && (
                <StyledBuyButton
                  danger
                  onClick={() => {
                    if (selectedFrameItem?.userId) {
                      message.warning('该头像框已拥有')
                      return
                    }
                    beforeBuy(true)
                  }}
                >
                  购买并穿戴
                </StyledBuyButton>
              )}
            </div>
          </StyledButtonGroup>
        )}

        {type === 'avatar' && (
          <StyledButtonGroup>
            <div
              style={{
                display: 'flex',
                flexDirection: isMobile ? 'column' : 'row',
              }}
            >
              <StyledBuyButton danger onClick={wearHandler}>
                穿戴
              </StyledBuyButton>
              <StyledBuyButton
                danger
                onClick={demountHandler}
                style={{ marginTop: isMobile ? '5px' : '0px' }}
              >
                卸下
              </StyledBuyButton>
            </div>
          </StyledButtonGroup>
        )}
      </SelectedFramePreview>

      {/* 头像框列表 */}
      {avatarsFrames.length > 0 ? (
        <AvatarFrameList
          style={{
            justifyContent: isMobile ? 'space-between' : 'flex-start',
          }}
        >
          {type === 'avatar' && (
            <>
              {avatarsFrames.map((item) => (
                <FrameContainer
                  key={item.avatarFrame}
                  onClick={() => {
                    setSelectedFrameItem(item)
                    handleFrameSelect(item.avatarFrame)
                  }}
                >
                  <StyledFrame src={item.bgIMG} alt={item.avatarFrame} />
                  <StyledFrameType>{item.title}</StyledFrameType>
                </FrameContainer>
              ))}
            </>
          )}
          {type === 'shop' && (
            <>
              {avatarsFrames.map((item) => (
                <FrameContainer
                  style={{ paddingBottom: 35 }}
                  key={item.avatarFrame}
                  onClick={() => {
                    setSelectedFrameItem(item)
                    handleFrameSelect(item.avatarFrame)
                  }}
                >
                  <StyledFrame src={item.bgIMG} alt={item.avatarFrame} />
                  <StyledFrameType>
                    <StyledPrice>
                      <CopyrightOutlined style={{ marginRight: 5 }} />
                      {item.price}-
                    </StyledPrice>
                    {`(${item.title})`}
                  </StyledFrameType>

                  <StyledOwned>
                    {item.userId ? (
                      <div className="owned">已拥有</div>
                    ) : (
                      <div className="no_owned">未拥有</div>
                    )}
                  </StyledOwned>
                </FrameContainer>
              ))}
            </>
          )}
        </AvatarFrameList>
      ) : (
        <CommonEmpty title="会员用户可免费使用所有头像框哦～"></CommonEmpty>
      )}
      <CommonModal
        isModalShow={isModalShow}
        setIsModalShow={setIsModalShow}
        oKHandler={buyHandler}
        title={'购买确认'}
        childrenPart={
          <div>{isWear ? '是否确认购买并穿戴' : '是否确认购买'}</div>
        }
      ></CommonModal>
    </StyledPage>
  )
}
