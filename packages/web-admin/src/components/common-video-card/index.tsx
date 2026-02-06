import React from 'react'
import styled from '@emotion/styled'
import { VIDEO_TYPE_ENUM } from '@af-charizard/sdk-types/src/video-type'
import { formatDuration } from '~/utils/date'
import { services } from '@af-charizard/sdk-services'

const StyledCard = styled.div`
  margin: 8px; /* 每个元素右间距设置为8px */

  border: 1px solid #d6e2fb;
  border-radius: 6px;
  cursor: pointer;

  &:hover {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }

  @media (max-width: 768px) {
    &:hover {
      box-shadow: none;
    }
  }
`
const StyledBGImg = styled.div`
  padding-top: calc((10 / 16) * 100%); /* 16:9 aspect ratio */
  /* border-radius: 6px 6px 0 0; */
  border-radius: ${({ title }: { bgImg: string; title: string }) =>
    title ? '6px 6px 0 0' : '6px 6px 0 0'};
  position: relative;
  width: 100%;
  overflow: hidden;

  background-image: url(${({ bgImg }: { bgImg: string }) => bgImg});
  background-size: cover; /* 根据需要调整背景图像尺寸 */
  background-position: center; /* 根据需要调整背景图像位置 */

  @media (max-width: 768px) {
    border-radius: 3px;
  }
  /* 新增代码开始 */
  .video-duration {
    position: absolute;
    bottom: 0px;
    right: 0px;
    z-index: 99;
    background-color: rgba(0, 0, 0, 0.5);
    color: #fff;
    font-size: 10px;
    padding: 2px 3px;
    border-radius: 3px;
  }
`
const StyledBGTitle = styled.div`
  padding: 0 10px;
  text-align: center;
  line-height: 26px;
  background-color: ${({ title }: { title: string }) =>
    title ? '#fff' : '#FB7299'};

  /* border: 1px solid #d6e2fb; */

  border-radius: 0 0 6px 6px;
  div {
    // 文字不允许换行（单行文本）
    white-space: nowrap;
    // 溢出部分隐藏
    overflow: hidden;
    // 文本溢出后，使用 ... 代替
    text-overflow: ellipsis;
    width: 100%;
  }
`
interface IProps {
  title?: string
  type?: VIDEO_TYPE_ENUM
  bgImg?: string
  duration?: number
  size?: number
  date?: string
  witdhPartNumber?: number
  clickHandler: () => void
}
export const CommonVideoCard: React.FC<IProps> = ({
  title,
  type,
  bgImg,
  duration,
  size,
  witdhPartNumber,
  clickHandler,
}) => {
  const currentDomain = window.location.hostname

  const calculateWidth = () => {
    const marginRight = 16 // 每个元素右间距
    const cardWidth = `calc((100% - ${marginRight * witdhPartNumber!}px) / ${witdhPartNumber})`

    return cardWidth
  }

  const updateVisitCountHandler = () => {
    clickHandler()
    services.passport$update$visit_count()
  }
  // const posterUrl =
  //   process.env.NODE_ENV === 'production'
  //     ? `https://${currentDomain}/videos/${isMobile ? 'compressedThumbnailPath' : 'compressedThumbnailPath'}/${id}`
  //     : `http://localhost:3009/videos/thumbnailPath/${id}`
  return (
    <StyledCard
      onClick={updateVisitCountHandler}
      style={{
        width: calculateWidth(),
      }}
    >
      {/* <a
        target="_blank"
        href={`http://localhost:4009/#/video-detail/${637}?classification=${encodeURIComponent('A_ENUM')}`}
      > */}
      <StyledBGImg bgImg={bgImg ?? ''} title={title ?? ''}>
        {/* 新增代码开始 */}
        {duration && (
          <div className="video-duration">{formatDuration(duration!)}</div>
        )}
        {/* 新增代码结束 */}
      </StyledBGImg>
      {/* </a> */}
      <StyledBGTitle title={title ?? ''}>
        <div>{title ?? type}</div>
      </StyledBGTitle>
      {/* <StyledBGTitle>{date && <div>{formatDate(date)}</div>}</StyledBGTitle> */}
    </StyledCard>
  )
}
