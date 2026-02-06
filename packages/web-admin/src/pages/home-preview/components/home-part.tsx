import React from 'react'
import { useNavigate } from 'react-router'
import { CommonVideoCard } from '~/components/common-video-card'
import type { IResult } from '@af-charizard/sdk-services/src/services/video$more$classification'
import styled from '@emotion/styled'
import { useOpenNewWindow, useScreenWidth } from '~/hooks'

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
const StyledPage = styled.div`
  width: 48%;
  border: 1px solid #d6e2fb;
  margin: 10px 12px;
  border-radius: 6px;

  padding-bottom: 8px;
  @media (max-width: 768px) {
    width: 100%;
    margin: 10px 0px;
  }
`
interface IProps {
  resultItem: IResult
}
export const HomePart: React.FC<IProps> = ({ resultItem }) => {
  const navigate = useNavigate()
  const openNewWindow = useOpenNewWindow()

  const widthPartNumber = useScreenWidth({
    defaultWidthPartNumber: 3,
    threshold: 2,
  })
  return (
    <StyledPage>
      <StyledTitle>
        <div style={{ fontWeight: 500 }}>{resultItem.classification}</div>
        <a
          onClick={() =>
            navigate(`/classification-detail/${resultItem.classification}`)
          }
        >
          查看更多{`>>`}
        </a>
      </StyledTitle>
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {resultItem.videos &&
          resultItem.videos.map((item) => (
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
  )
}
