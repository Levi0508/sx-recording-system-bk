import React, { useEffect, useState } from 'react'
import { Avatar, Card, Col, Row, Modal, Badge } from 'antd'
import styled from '@emotion/styled'
import { useIsMobile } from '~/hooks/useIsMobile'
import Meta from 'antd/es/card/Meta'
import { VIP_TYPE_ENUM } from '@af-charizard/sdk-types'
import { services } from '@af-charizard/sdk-services'
import Avatar2 from '/avatar.svg'
import backgroundIMG from '~/assets/bgIMG2.jpg'

import { Loading } from '../loading'
import { CaretDownOutlined, CaretUpOutlined } from '@ant-design/icons'
import CommonAvatarFrame from '../common-avatar-frame'
import { AVATAR_TYPE_ENUM } from '@af-charizard/sdk-types/src/avatar-type'

interface IVipTopData {
  avatar: string
  id: number
  nickname: string
  vipDeadLine: string
  createdAt: string
  vipType: VIP_TYPE_ENUM
  payTotal: number
  avatarFrame: AVATAR_TYPE_ENUM
}
const getRankColor = (rank: number) => {
  switch (rank) {
    case 1:
      return '#DAA520' // 更柔和的金色
    case 2:
      return '#B0C4DE' // 更优雅的银色
    case 3:
      return '#8B4513' // 更复古的铜色
  }
}
const getRankNo = (rank: number) => {
  switch (rank) {
    case 1:
      return 'No.1'
    case 2:
      return 'No.2'
    case 3:
      return 'No.3'
  }
}

const StyledModal = styled(Modal)`
  z-index: 99;

  .ant-modal-close {
    display: none;
  }
  .ant-modal-content {
    padding: 0;
    background: #ffffff; // 内容区的实际背景颜色
    border-radius: 20px;
    overflow: hidden;
    border: 1px solid #ddd; // 边框样式
  }
  .ant-modal-header {
    display: none; // 隐藏 Modal 的头部
  }
  .modal-title {
    padding: 16px 24px;

    background: linear-gradient(
      145deg,
      rgba(255, 255, 255, 0.5),
      rgba(240, 240, 240, 0.7)
    ); // 明亮渐变色
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
    color: #f5c518; // 标题文字颜色
    font-size: 20px;
    font-weight: bold;
    border-top-left-radius: 20px; // 统一圆角
    border-top-right-radius: 20px; // 统一圆角
    @media (max-width: 768px) {
      padding: 8px 12px;
    }
  }
  .ant-modal-footer {
    display: none;
  }
  .ant-card-body {
    padding: 15px;
    @media (max-width: 768px) {
      padding: 12px;
      padding-bottom: 3px;
    }
  }
  /* .ant-ribbon {
    z-index: 9999;
    top: -2px;
    left: 49px;
    margin-right: 15px;
    @media (max-width: 768px) {
      top: -3px;
      left: 37px;
      font-size: 13px;
      margin-right: -13px;
    }
  } */

  .ranking-card {
    display: flex;
    align-items: center;
    border-radius: 20px;
    background: rgba(255, 255, 255, 0.95); // 更透明的背景
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
    transition:
      transform 0.3s,
      box-shadow 0.3s;
    color: #333;
    width: 100%;
    box-sizing: border-box;

    text-shadow:
      0 2px 4px rgba(0, 0, 0, 0.3),
      0 4px 8px rgba(0, 0, 0, 0.2); /* 柔和的阴影效果 */
    font-family: 'Arial Rounded MT Bold', sans-serif; /* 圆润的字体 */
    background: rgba(0, 0, 0, 0.3); /* 半透明背景 */
    border-radius: 20px; /* 圆润的边框 */
    padding: 5px 10px; /* 内边距 */

    @media (max-width: 768px) {
      margin-bottom: 0px;
      flex-direction: column;
      align-items: flex-start;
    }
  }

  .ranking-card:hover {
    transform: translateY(-3px); /* 适度的上移 */
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15); /* 调整阴影 */
    background: linear-gradient(
      145deg,
      rgba(255, 255, 255, 0.8),
      rgba(240, 240, 240, 0.9)
    ); /* 渐变背景色 */
    border: 1px solid rgba(0, 0, 0, 0.1); /* 增加边框 */
  }

  .ranking-avatar {
    border: 2px solid #ffffff;
    box-shadow: 0 0 12px rgba(0, 0, 0, 0.2);
    border-radius: 50%;

    margin-right: 30px;
    @media (max-width: 768px) {
      margin-right: 0;
      margin-bottom: 10px;
    }
  }
  .ant-card-meta-avatar {
    @media (max-width: 768px) {
      margin-right: 10px;
    }
  }
  .ranking-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  .ranking-title {
    font-size: 18px;
    font-weight: 700;
    color: #ea7a99;
    margin: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .ranking-rank {
    font-size: 16px;
    color: #888;
    margin: 5px 0;
  }
  .ranking-score {
    font-size: 18px; /* 增大字体 */
    color: #f5b041; /* 适中的金色 */
    font-weight: 700; /* 加粗字体 */
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1); /* 细微的文字阴影 */
    padding: 2px 4px; /* 内边距增加 */
    border-radius: 4px; /* 边角圆润 */
    @media (max-width: 768px) {
      font-size: 14px; /* 增大字体 */
    }
  }

  .ranking-container {
    min-height: 300px;
    max-height: 500px;
    /* overflow: auto; */
    padding: 20px;
    padding-bottom: 10px;
    /* padding-top: 30px; */

    @media (max-width: 768px) {
      padding: 15px;
      padding-bottom: 5px;
    }
    background: linear-gradient(
      145deg,
      rgba(255, 255, 255, 0.5),
      rgba(240, 240, 240, 0.7)
    ); // 明亮渐变色
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2); /* 更明亮的阴影效果 */
  }
  .ant-modal-content {
    padding: 0;
    background: #ffffff; // 内容区的实际背景颜色
    border-radius: 20px;
    overflow: hidden;
    position: relative;
    border: 2px solid #f5c518; // 边框颜色
    box-shadow: 0 0 0 4px rgba(0, 0, 0, 0.2); // 内层阴影
    animation: borderAnimation 3s infinite; // 动画效果
  }
  @keyframes borderAnimation {
    0% {
      border-color: #ff6f61;
    }
    50% {
      border-color: #f5c518;
    }
    100% {
      border-color: #ea7a99;
    }
  }
  .ant-modal-header {
    display: none; // 隐藏 Modal 的头部
  }
  .modal-title {
    padding: 16px 24px;
    background: linear-gradient(
      145deg,
      rgba(255, 255, 255, 0.5),
      rgba(240, 240, 240, 0.7)
    ); // 明亮渐变色
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
    color: #f5c518; // 标题文字颜色
    font-size: 20px;
    font-weight: bold;
    border-top-left-radius: 20px; // 统一圆角
    border-top-right-radius: 20px; // 统一圆角
    @media (max-width: 768px) {
      padding: 8px 12px;
    }
  }
  .ant-modal-footer {
    display: none;
  }
`

// const StyledTitle = styled.div`
//   position: sticky; /* 固定位置 */
//   top: 0; /* 让标题固定在容器顶部 */
//   margin-bottom: 17px;
//   font-size: 20px;
//   font-weight: 1000;
//   text-align: center;
//   color: #fff;
//   font-family: 'Roboto', sans-serif; /* 更优雅的字体 */
//   @media (max-width: 768px) {
//     margin-bottom: 10px;
//     font-size: 17px;
//   }
// `
const StyledTitle = styled.div`
  position: sticky; /* 固定位置 */
  top: 0; /* 让标题固定在容器顶部 */
  margin-bottom: 17px;
  font-size: 24px;
  font-weight: 700;
  text-align: center;
  color: #fff;
  text-shadow:
    0 2px 4px rgba(0, 0, 0, 0.3),
    0 4px 8px rgba(0, 0, 0, 0.2); /* 柔和的阴影效果 */
  font-family: 'Arial Rounded MT Bold', sans-serif; /* 圆润的字体 */
  background: rgba(0, 0, 0, 0.3); /* 半透明背景 */
  border-radius: 20px; /* 圆润的边框 */
  padding: 5px 10px; /* 内边距 */
  @media (max-width: 768px) {
    margin-bottom: 10px;
    font-size: 20px;
    padding: 8px 16px; /* 小屏幕内边距调整 */
  }
`

const StyledRow = styled(Row)`
  /* 隐藏滚动条样式 */
  &::-webkit-scrollbar {
    width: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #fb7299;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-track {
    background-color: #f0f0f0;
  }
  @media (max-width: 768px) {
    /* 重置滚动条样式 */
    &::-webkit-scrollbar {
      display: none; /* 隐藏滚动条 */
    }
  }
`
interface IProps {
  isShowModal: boolean
  setIsShowModal: React.Dispatch<React.SetStateAction<boolean>>
}

const CommonRanking: React.FC<IProps> = ({ isShowModal, setIsShowModal }) => {
  const isMobile = useIsMobile()

  const [dataSource, setDataSource] = useState<IVipTopData[]>([])
  const [loading, setLoading] = useState(true)
  const [isExpanded, setIsExpanded] = useState(false)

  const handleExpandToggle = () => {
    setIsExpanded(!isExpanded)
  }

  const displayedData = isExpanded ? dataSource : dataSource.slice(0, 3)
  /**
   * 前三名
   */
  const getVipTopUser = async () => {
    const resp = await services.user$vip$top()

    if (resp.data.code === 200) {
      setDataSource(resp.data.resource as any)
      setLoading(false)
    } else {
    }
  }
  useEffect(() => {
    isShowModal && getVipTopUser()
    !isShowModal && setIsExpanded(false)
  }, [isShowModal])

  return (
    <StyledModal
      destroyOnClose
      open={isShowModal}
      onCancel={() => setIsShowModal(false)}
      footer={false}
    >
      <div
        className="ranking-container"
        style={{
          backgroundImage: `url(${backgroundIMG})`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          backgroundSize: 'cover',
        }}
      >
        <StyledTitle>会员积分榜</StyledTitle>
        {loading ? (
          <Loading></Loading>
        ) : (
          <StyledRow
            gutter={[16, 16]}
            style={{ maxHeight: 450, overflow: 'auto' }}
          >
            {displayedData.map((item, index) => (
              // <Col
              //   span={24}
              //   key={item.id}
              //   style={{
              //     cursor: 'pointer',
              //   }}
              // >
              //   <Card className="ranking-card">
              //     <Meta
              //       avatar={
              //         <>
              //           {index > 2 ? (
              //             <Avatar
              //               src={item.avatar || Avatar2}
              //               size={isMobile ? 60 : 70}
              //               className="ranking-avatar"
              //             />
              //           ) : (
              //             <Badge.Ribbon
              //               text={getRankNo(index + 1)}
              //               color={getRankColor(index + 1)}
              //               placement="end"
              //             >
              //               {/* <Avatar
              //                 src={item.avatar || Avatar2}
              //                 size={isMobile ? 60 : 70}
              //                 className="ranking-avatar"
              //               /> */}
              //               <CommonAvatarFrame
              //                 avatar={item.avatar}
              //                 selectedFrame={item.avatarFrame}
              //                 size={isMobile ? 60 : 70}
              //               ></CommonAvatarFrame>
              //             </Badge.Ribbon>
              //           )}
              //         </>
              //       }
              //       description={
              //         <div className="ranking-info">
              //           <div className="ranking-title">
              //             {item.nickname || '默认昵称'}
              //           </div>
              //           <div className="ranking-rank"></div>
              //           <div className="ranking-score">
              //             积分: {item.payTotal}
              //           </div>
              //         </div>
              //       }

              //     />
              //   </Card>
              // </Col>
              <Col
                span={24}
                key={item.id}
                style={{
                  cursor: 'pointer',
                }}
              >
                <Card className="ranking-card" style={{ position: 'relative' }}>
                  <Meta
                    avatar={
                      <CommonAvatarFrame
                        avatar={item.avatar}
                        selectedFrame={item.avatarFrame}
                        // size={isMobile ? 60 : 70}
                        size={isMobile ? 50 : 50}
                      ></CommonAvatarFrame>
                    }
                    description={
                      <div
                        className="ranking-info"
                        style={{ marginLeft: isMobile ? 0 : 10 }}
                      >
                        <div className="ranking-title">
                          {item.nickname || '默认昵称'}
                        </div>
                        <div className="ranking-score">
                          积分: {item.payTotal}
                        </div>
                      </div>
                    }
                  />
                </Card>
                {index <= 2 && (
                  <Badge.Ribbon
                    text={getRankNo(index + 1)}
                    color={getRankColor(index + 1)}
                    placement="end"
                    style={{
                      position: 'absolute',
                      right: 0,
                      transform: isMobile
                        ? 'translateY(-350%)'
                        : 'translateY(-420%)',
                    }}
                  />
                )}
              </Col>
            ))}
            {/* {dataSource.length > 3 && ( */}
            <div
              onClick={handleExpandToggle}
              style={{
                color: '#fff',
                marginBottom: isExpanded ? (isMobile ? 30 : 50) : 0,
                fontSize: 25,
                textAlign: 'center',
                width: '100%',
                marginTop: -8,
              }}
            >
              {isExpanded ? (
                <CaretUpOutlined style={{ cursor: 'pointer' }} />
              ) : (
                <CaretDownOutlined style={{ cursor: 'pointer' }} />
              )}
            </div>
            {/* )} */}
          </StyledRow>
        )}
      </div>
    </StyledModal>
  )
}

export default CommonRanking
