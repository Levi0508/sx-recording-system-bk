import React, { useState } from 'react'

import { CommonVideoCard } from '~/components/common-video-card'
import { StyledVideos } from '../home-preview'
import { VIDEO_TYPE_ENUM } from '@af-charizard/sdk-types/src/video-type'

import { useNavigate } from 'react-router'
import { useScreenWidth } from '~/hooks'

import {
  StyledSearch,
  StyledSearchDiv,
} from '../vip-preview/components/history'
import { useIsMobile } from '~/hooks'
import { SearchOutlined } from '@ant-design/icons'
import CommonAdvertising from '~/components/common-advertising'

export const classificationArr = Object.values(VIDEO_TYPE_ENUM).map((type) => ({
  type,
  bgIMG: `/type/${type}.png`,
}))

const PageClassificationStreamer = () => {
  const navigate = useNavigate()

  const [filterText, setFilterText] = useState('')

  const onSearch = (value: string) => setFilterText(value)

  // 过滤数组
  const filteredArr = classificationArr.filter((item) =>
    item.type.includes(filterText),
  )
  const widthPartNumber = useScreenWidth({
    defaultWidthPartNumber: 6,
    threshold: 2,
  })

  return (
    <StyledVideos>
      {/* <CommonAdvertising height={90}></CommonAdvertising> */}
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
        <CommonVideoCard
          type={item.type as any}
          bgImg={item.bgIMG}
          key={item.type}
          witdhPartNumber={widthPartNumber}
          clickHandler={() => navigate(`/classification-detail/${item.type}`)}
        ></CommonVideoCard>
      ))}
    </StyledVideos>
  )
}
export default PageClassificationStreamer
