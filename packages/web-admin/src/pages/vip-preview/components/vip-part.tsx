import React, { useState } from 'react'

import { useScreenWidth } from '~/hooks'

import { IVipCard, StyledVideos } from './shop'
import { CommonVipCard } from '~/components/common-vip-card'
import ABGIMG from '/Charmander.jpeg'
import BBGIMG from '/Charizard.png'
import CBGIMG from '/CharizardMegaX.png'
import DBGIMG from '/CharizardGigantamax.png'
import { CommonModal } from '~/components/common-modal'

import { services } from '@af-charizard/sdk-services'
import { message } from 'antd'

const VipCardArray: IVipCard[] = [
  {
    goodsId: 'vip_31',
    bgIMG: ABGIMG,
    title: 'VIP月卡会员',
    price: 29.9,
    originalPprice: 89,
    indate: 31,
  },
  {
    goodsId: 'vip_93',
    bgIMG: BBGIMG,
    title: 'VIP季卡会员',
    price: 79.9,
    originalPprice: 219,
    indate: 93,
  },
  {
    goodsId: 'vip_366',
    bgIMG: CBGIMG,
    title: 'VIP年卡会员',
    price: 249.9,
    originalPprice: 699,
    indate: 366,
  },
  {
    goodsId: 'vip_1098',
    bgIMG: DBGIMG,
    title: 'VIP永久卡会员',
    price: 499.9,
    originalPprice: 1888,
    indate: 999999,
  },
  // {
  //   goodsId: 'vip_1098',
  //   bgIMG: DBGIMG,
  //   title: 'VIP三年卡会员',
  //   price: 499.9,
  //   originalPprice: 1888,
  //   indate: 1098,
  // },
]

interface IProps {
  isModalShow: boolean
  setIsModalShow: React.Dispatch<React.SetStateAction<boolean>>
}
export const VIPPart: React.FC<IProps> = ({ isModalShow, setIsModalShow }) => {
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
    const resp = await services.user$buy$vip({
      goodsId,
    })
    if (resp.data.code === 200) {
      message.success('购买成功，即将刷新页面～')

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
        <CommonVipCard
          item={item}
          setIsModalShow={setIsModalShow}
          setGoodsId={setGoodsId}
          key={item.goodsId}
          witdhPartNumber={widthPartNumber}
        ></CommonVipCard>
      ))}
      <CommonModal
        isModalShow={isModalShow}
        setIsModalShow={setIsModalShow}
        oKHandler={buyVipHandler}
        title={'购买确认'}
        childrenPart={<div>是否确认购买</div>}
      ></CommonModal>
    </StyledVideos>
  )
}
