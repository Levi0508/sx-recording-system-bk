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
import { CommonMonthCard } from '~/components/common-month-card'
import { useStore } from '@kazura/react-mobx'
import { UserStore } from '@af-charizard/sdk-stores'

export interface IMonthCard {
  goodsId: string
  bgIMG: string
  title: string
  price: number
  originalPprice: number
  year?: string
  detailImg?: string // 详情页图片，如果不提供则使用 bgIMG
  allowUpdate?: boolean // 主播合集：是否支持后续更新（月包等可忽略）
}

export const VipCardArray: IMonthCard[] = [
  // 2026年
  {
    goodsId: 'month_2602',
    bgIMG: ABGIMG,
    title: '韩国26年2月合集',
    price: 68,
    originalPprice: 108,
    year: '2026',
  },
  {
    goodsId: 'month_2601',
    bgIMG: ABGIMG,
    title: '韩国26年01月合集',
    price: 68,
    originalPprice: 108,
    year: '2026',
    detailImg: '/monthGoods/month_2601.png',
  },

  // 2025年
  {
    goodsId: 'month_2512',
    bgIMG: ABGIMG,
    title: '韩国25年12月合集',
    price: 68,
    originalPprice: 108,
    year: '2025',
    detailImg: '/monthGoods/month_2512.png',
  },
  {
    goodsId: 'month_2511',
    bgIMG: ABGIMG,
    title: '韩国25年11月合集',
    price: 68,
    originalPprice: 108,
    year: '2025',
    detailImg: '/monthGoods/month_2511.png',
  },
  {
    goodsId: 'month_2510',
    bgIMG: ABGIMG,
    title: '韩国25年10月合集',
    price: 68,
    originalPprice: 108,
    year: '2025',
    detailImg: '/monthGoods/month_2510.png',
  },
  {
    goodsId: 'month_2509',
    bgIMG: ABGIMG,
    title: '韩国25年09月合集',
    price: 68,
    originalPprice: 108,
    year: '2025',
    detailImg: '/monthGoods/month_2509.png',
  },
  {
    goodsId: 'month_2508',
    bgIMG: ABGIMG,
    title: '韩国25年08月合集',
    price: 68,
    originalPprice: 108,
    year: '2025',
    detailImg: '/monthGoods/month_2508.png',
  },
  {
    goodsId: 'month_2507',
    bgIMG: ABGIMG,
    title: '韩国25年07月合集',
    price: 68,
    originalPprice: 108,
    year: '2025',
    detailImg: '/monthGoods/month_2507.png',
  },
  {
    goodsId: 'month_2506',
    bgIMG: ABGIMG,
    title: '韩国25年06月合集',
    price: 68,
    originalPprice: 108,
    year: '2025',
    detailImg: '/monthGoods/month_2506.png',
  },
  {
    goodsId: 'month_2505',
    bgIMG: ABGIMG,
    title: '韩国25年05月合集',
    price: 68,
    originalPprice: 108,
    year: '2025',
    detailImg: '/monthGoods/month_2505.png',
  },
  {
    goodsId: 'month_2504',
    bgIMG: ABGIMG,
    title: '韩国25年04月合集',
    price: 68,
    originalPprice: 108,
    year: '2025',
    detailImg: '/monthGoods/month_2504.png',
  },
  {
    goodsId: 'month_2503',
    bgIMG: ABGIMG,
    title: '韩国25年03月合集',
    price: 68,
    originalPprice: 108,
    year: '2025',
    detailImg: '/monthGoods/month_2503.png',
  },
  {
    goodsId: 'month_2502',
    bgIMG: ABGIMG,
    title: '韩国25年02月合集',
    price: 68,
    originalPprice: 108,
    year: '2025',
    detailImg: '/monthGoods/month_2502.png',
  },
  {
    goodsId: 'month_2501',
    bgIMG: ABGIMG,
    title: '韩国25年01月合集',
    price: 68,
    originalPprice: 108,
    year: '2025',
    detailImg: '/monthGoods/month_2501.png',
  },

  // 2024年
  {
    goodsId: 'month_2412',
    bgIMG: ABGIMG,
    title: '韩国24年12月合集',
    price: 68,
    originalPprice: 108,
    year: '2024',
    detailImg: '/monthGoods/month_2412.png',
  },
  {
    goodsId: 'month_2411',
    bgIMG: ABGIMG,
    title: '韩国24年11月合集',
    price: 68,
    originalPprice: 108,
    year: '2024',
    detailImg: '/monthGoods/month_2411.png',
  },
  {
    goodsId: 'month_2410',
    bgIMG: ABGIMG,
    title: '韩国24年10月合集',
    price: 68,
    originalPprice: 108,
    year: '2024',
    detailImg: '/monthGoods/month_2410.png',
  },
  {
    goodsId: 'month_2409',
    bgIMG: ABGIMG,
    title: '韩国24年09月合集',
    price: 68,
    originalPprice: 108,
    year: '2024',
    detailImg: '/monthGoods/month_2409.png',
  },
  {
    goodsId: 'month_2408',
    bgIMG: ABGIMG,
    title: '韩国24年08月合集',
    price: 68,
    originalPprice: 108,
    year: '2024',
    detailImg: '/monthGoods/month_2408.png',
  },
  {
    goodsId: 'month_2407',
    bgIMG: ABGIMG,
    title: '韩国24年07月合集',
    price: 68,
    originalPprice: 108,
    year: '2024',
    detailImg: '/monthGoods/month_2407.png',
  },
  {
    goodsId: 'month_2406',
    bgIMG: ABGIMG,
    title: '韩国24年06月合集',
    price: 68,
    originalPprice: 108,
    year: '2024',
    detailImg: '/monthGoods/month_2406.png',
  },
  {
    goodsId: 'month_2405',
    bgIMG: ABGIMG,
    title: '韩国24年05月合集',
    price: 68,
    originalPprice: 108,
    year: '2024',
    detailImg: '/monthGoods/month_2405.png',
  },
  {
    goodsId: 'month_2404',
    bgIMG: ABGIMG,
    title: '韩国24年04月合集',
    price: 68,
    originalPprice: 108,
    year: '2024',
    detailImg: '/monthGoods/month_2404.png',
  },
  {
    goodsId: 'month_2403',
    bgIMG: ABGIMG,
    title: '韩国24年03月合集',
    price: 68,
    originalPprice: 108,
    year: '2024',
    detailImg: '/monthGoods/month_2403.png',
  },
  {
    goodsId: 'month_2402',
    bgIMG: ABGIMG,
    title: '韩国24年02月合集',
    price: 68,
    originalPprice: 108,
    year: '2024',
    detailImg: '/monthGoods/month_2402.png',
  },
  {
    goodsId: 'month_2401',
    bgIMG: ABGIMG,
    title: '韩国24年01月合集',
    price: 68,
    originalPprice: 108,
    year: '2024',
    detailImg: '/monthGoods/month_2401.png',
  },
]

interface IProps {
  isModalShow: boolean
  setIsModalShow: React.Dispatch<React.SetStateAction<boolean>>
  year?: string
}
export const MonthPart: React.FC<IProps> = ({
  isModalShow,
  setIsModalShow,
  year,
}) => {
  const [goodsId, setGoodsId] = useState('')
  const userStore = useStore(UserStore)

  const widthPartNumber = useScreenWidth({
    defaultWidthPartNumber: 4,
    threshold: 2,
  })

  // 根据年份过滤数据
  const filteredData = year
    ? VipCardArray.filter((item) => item.year === year)
    : VipCardArray

  /**
   * 购买
   * @param goodsId
   */
  const buyVipHandler = async () => {
    const resp = await services.user$buy$month({
      goodsId,
    })
    if (resp.data.code === 200) {
      message.success('购买成功！')
      setIsModalShow(false)

      // 更新 UserStore 中的已购买商品列表
      if (resp.data.resource?.url) {
        userStore.setPurchasedMonthGoods({
          ...userStore.purchasedMonthGoods,
          [goodsId]: resp.data.resource.url,
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
    <StyledVideos>
      {filteredData.map((item) => (
        <CommonMonthCard
          item={item}
          setIsModalShow={setIsModalShow}
          setGoodsId={setGoodsId}
          key={item.goodsId}
          witdhPartNumber={widthPartNumber}
        ></CommonMonthCard>
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
