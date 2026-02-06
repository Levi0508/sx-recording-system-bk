import React from 'react'
import { useNavigate } from 'react-router'
import { CommonVideoCard } from '~/components/common-video-card'
import styled from '@emotion/styled'
import { useScreenWidth, useOpenNewWindow } from '~/hooks/index'
import { FILTER_ENUM } from '@af-charizard/sdk-types'
import { IlistItem } from '@af-charizard/sdk-services/src/services/video$findAll'
import { FireFilled, VideoCameraFilled } from '@ant-design/icons'

const StyledTitle = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #d6e2fb;
  padding: 10px 10px;
  a {
    font-size: 12px;
  }
`
const StyledDiv = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`
const StyledPage = styled.div`
  /* width: 98%; */
  width: 100%;
  border: 1px solid #d6e2fb;
  margin: 10px 0;
  border-radius: 6px;

  padding-bottom: 8px;
  @media (max-width: 768px) {
    width: 100%;
  }
`
interface IProps {
  list: IlistItem[] | undefined
  type: FILTER_ENUM
}
export const HotPart: React.FC<IProps> = ({ list, type }) => {
  const navigate = useNavigate()
  const openNewWindow = useOpenNewWindow()

  const widthPartNumber = useScreenWidth({
    defaultWidthPartNumber: 6,
    threshold: 2,
  })
  return (
    <StyledDiv>
      <StyledPage>
        <StyledTitle>
          <div style={{ fontWeight: 500 }}>
            {type === FILTER_ENUM.NEW ? (
              <span>
                <VideoCameraFilled
                  style={{ color: '#ea3425', marginRight: 5 }}
                />
                最新视频
              </span>
            ) : (
              <span>
                <FireFilled style={{ color: 'red', marginRight: 5 }} />
                热门视频
              </span>
            )}
          </div>
          <a onClick={() => navigate(`/classification-detail`)}>
            查看更多{`>>`}
          </a>
        </StyledTitle>
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          {list &&
            list.map((item) => (
              <CommonVideoCard
                title={item.title}
                type={item.classification}
                bgImg={item.path}
                key={item.id}
                date={item.createdAt}
                duration={item.duration}
                size={item.size}
                witdhPartNumber={widthPartNumber}
                clickHandler={() => openNewWindow(item)}
              ></CommonVideoCard>
            ))}
        </div>
      </StyledPage>
    </StyledDiv>
  )
}
