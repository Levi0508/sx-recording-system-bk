import React, { useMemo, useState } from 'react'

import { CommonAnchorCard } from '~/components/common-anchor-card'
import { StyledVideos } from '../home-preview'
import { VIDEO_TYPE_ENUM } from '@af-charizard/sdk-types/src/video-type'

import { useScreenWidth } from '~/hooks'

import {
  StyledSearch,
  StyledSearchDiv,
} from '../vip-preview/components/history'
import { SearchOutlined } from '@ant-design/icons'
import { IMonthCard } from '../vip-preview/components/month-part'
import { AnchorGoodsList } from './goods'
import { useStore } from '@kazura/react-mobx'
import { UserStore } from '@af-charizard/sdk-stores'

// 主播合集商品数组
export const AnchorCardArray: IMonthCard[] = AnchorGoodsList

// 为了兼容 anchor-detail，也导出 classificationArr
export const classificationArr = Object.values(VIDEO_TYPE_ENUM).map((type) => ({
  type,
  bgIMG: `/type/${type}.png`,
}))

const PageClassificationPreview = () => {
  const [filterText, setFilterText] = useState('')
  const userStore = useStore(UserStore)

  const onSearch = (value: string) => setFilterText(value)

  // 过滤数组
  const filteredArr = AnchorCardArray.filter((item) =>
    item.title.includes(filterText),
  )
  const widthPartNumber = useScreenWidth({
    defaultWidthPartNumber: 4,
    threshold: 2,
  })

  // 直接从前端 goods.ts 中提取 allowUpdate 映射（无需接口调用）
  const allowUpdateMap = useMemo(() => {
    const map: Record<string, boolean> = {}
    AnchorGoodsList.forEach((item) => {
      // allowUpdate 默认为 true（如果未定义）
      map[item.goodsId] = item.allowUpdate !== false
    })
    return map
  }, [])


  return (
    <StyledVideos>
      <StyledSearchDiv style={{ marginTop: 10 }}>
        <StyledSearch
          placeholder={'输入主播名字搜索'}
          onSearch={onSearch}
          allowClear
          enterButton={
            <SearchOutlined style={{ color: '#1f1f1f', fontSize: 20 }} />
          }
          style={{ borderRadius: '18px' }}
        />
      </StyledSearchDiv>

      {filteredArr.map((item) => (
        <CommonAnchorCard
          item={item}
          key={item.goodsId}
          witdhPartNumber={widthPartNumber}
          allowUpdate={allowUpdateMap[item.goodsId] !== false}
        />
      ))}
    </StyledVideos>
  )
}
export default PageClassificationPreview
