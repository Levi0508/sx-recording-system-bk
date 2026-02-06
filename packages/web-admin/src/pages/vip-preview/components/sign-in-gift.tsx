import React, { useState } from 'react'

import { useScreenWidth } from '~/hooks'

import { IVipCard, StyledVideos } from './shop'
import ABGIMG from '/Charmander.jpeg'
import BBGIMG from '/Charizard.png'
import CBGIMG from '/CharizardMegaX.png'
import DBGIMG from '/CharizardGigantamax.png'
import { CommonModal } from '~/components/common-modal'

import { services } from '@af-charizard/sdk-services'
import { message } from 'antd'
import { CommonGift } from '~/components/common-gift'

export interface IGiftCard {
  goodsId: string
  title: string
  indate: string
}
const VipCardArray: IGiftCard[] = [
  {
    goodsId: 'vip_3h',
    title: '签到3天',
    indate: '1小时',
  },
  {
    goodsId: 'vip_12h',
    title: '签到7天',
    indate: '12小时',
  },
  {
    goodsId: 'vip_24h',
    title: '签到15天',
    indate: '24小时',
  },
  {
    goodsId: 'vip_48h',
    title: '签到28天',
    indate: '48小时',
  },
]

interface IProps {
  isModalShow: boolean
  setIsModalShow: React.Dispatch<React.SetStateAction<boolean>>
}
export const SignInGift: React.FC<IProps> = ({
  isModalShow,
  setIsModalShow,
}) => {
  const [goodsId, setGoodsId] = useState('')

  const widthPartNumber = useScreenWidth({
    defaultWidthPartNumber: 4,
    threshold: 2,
  })

  /**
   * 购买
   * @param goodsId
   */
  const buyVipHandler = async () => {
    const resp = await services.signIn$getGift({
      goodsId,
    })
    if (resp.data.code === 200) {
      message.success('领取成功，即将刷新页面～')

      setTimeout(() => {
        window.location.reload()
      }, 1000)
      setIsModalShow(false)
    } else {
      message.error(resp.data.message)
      setIsModalShow(false)
    }
  }

  return (
    <StyledVideos>
      {VipCardArray.map((item) => (
        <CommonGift
          item={item}
          setIsModalShow={setIsModalShow}
          setGoodsId={setGoodsId}
          key={item.goodsId}
          witdhPartNumber={widthPartNumber}
        ></CommonGift>
      ))}
      <CommonModal
        isModalShow={isModalShow}
        setIsModalShow={setIsModalShow}
        oKHandler={buyVipHandler}
        title={'领取确认'}
        childrenPart={<div>是否确认领取</div>}
      ></CommonModal>
    </StyledVideos>
  )
}
