import React, { useState, useEffect } from 'react'
import styled from '@emotion/styled'
import { useStore } from '@kazura/react-mobx'
import { UserStore } from '@af-charizard/sdk-stores'
import { Card, Table, TableProps } from 'antd'

import { StyledTitle, StyledTop } from '../../vip-preview/components/favorite'

import { useIsMobile } from '~/hooks/useIsMobile'

import { useNavigate } from 'react-router'
import { IInvitationItem } from '@af-charizard/sdk-services/src/services/pay$find$invitation$record'
import { formatDateHMS } from '~/utils/date'
import { services } from '@af-charizard/sdk-services'
import { usePagination } from '~/hooks'

import { CopyrightOutlined } from '@ant-design/icons'
import { StyledPagination } from '~/pages/classification-detail'
import { CommonPagination } from '~/components/common-pagination'
import { moneyHandler } from '~/utils/money'

const StyledPage = styled.div`
  width: 100%;

  @media (max-width: 768px) {
    .ant-table-cell {
      padding: 10px 10px !important;
    }
  }
`

const StyledCard = styled.div`
  display: flex;
  height: 100%;
  align-items: center;
  .info-div {
    margin: 10px 30px;
    display: flex;
    line-height: 30px;
  }
  .title {
    font-size: 18px;
    font-weight: 500;
  }
  .info {
    color: #fb7299;
    font-size: 30px;
    font-weight: 600;
  }

  .unit {
    margin-left: 10px;
  }
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    .info-div {
      margin: 3px 10px;
      display: flex;
      line-height: 30px;
    }
    .title {
      font-size: 15px;
      font-weight: 500;
    }
    .info {
      color: #fb7299;
      font-size: 25px;
      font-weight: 600;
    }
  }
`

interface IProps {}
export const Record: React.FC<IProps> = () => {
  //用户信息
  const userStore = useStore(UserStore)
  const navigate = useNavigate()

  const isMobile = useIsMobile()

  const [infoList, setInfoList] = useState<IInvitationItem[]>([])
  const { tableParams, handleTableChange } = usePagination()
  const [total, setTotal] = useState(0)
  const [effectiveUserCount, setEffectiveUserCount] = useState(0)
  const [totalReward, setTotalReward] = useState(0)
  const columns: TableProps<IInvitationItem>['columns'] = [
    {
      title: '邀请用户',
      dataIndex: 'userNickname',
      key: 'userNickname',
      align: 'center',
      width: isMobile ? 80 : 200,
      render: (key) => {
        return <div>{key || '默认昵称'}</div>
      },
    },
    {
      title: '返利金额',
      dataIndex: 'reward',
      key: 'reward',
      align: 'center',
      render: (key) => {
        return (
          <div>
            {moneyHandler(key)}

            <CopyrightOutlined style={{ marginLeft: 5 }} />
          </div>
        )
      },
      width: isMobile ? 80 : 200,
    },

    {
      title: '支付时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      align: 'center',
      width: isMobile ? 150 : 200,

      render: (key) => {
        return <div>{formatDateHMS(key)}</div>
      },
    },
  ]

  /**
   * 查询邀请人返利
   * @returns
   */
  const getRecordList = async () => {
    const { data } = await services.pay$find$invitation$record({
      ...tableParams,
    })

    if (data.code === 200) {
      setInfoList(data.resource.list)
      setTotal(data.resource.totalCount)
      setEffectiveUserCount(data.resource.effectiveUserCount)
      setTotalReward(data.resource.totalReward)
    } else {
      setInfoList([])
      setTotal(0)
      setTotalReward(0)
    }
  }

  useEffect(() => {
    getRecordList()
  }, [tableParams])
  return (
    <StyledPage>
      <div>
        <StyledTop style={{ display: isMobile ? 'none' : 'block' }}>
          <StyledTitle>返利记录</StyledTitle>
        </StyledTop>

        <Card
          style={{
            margin: '20px 0',
          }}
        >
          <StyledCard>
            <div className="info-div">
              <div className="title">累计佣金：</div>
              <div className="info">{moneyHandler(totalReward)}</div>
              <div className="title unit">
                <CopyrightOutlined />
              </div>
            </div>
            <div className="info-div">
              <div className="title">有效邀请人数：</div>
              <div className="info">{effectiveUserCount}</div>
              <div className="title unit">人</div>
            </div>
          </StyledCard>
        </Card>

        <Table
          columns={columns}
          dataSource={infoList}
          pagination={false}
          key={'createdAt'}
          scroll={{ x: 'max-content' }}
        />
        <StyledPagination>
          <CommonPagination
            total={total}
            totalInfo={`共 ${total} 条记录`}
            currentPage={tableParams.currentPage}
            pageSize={tableParams.pageSize}
            onPageChange={handleTableChange}
          />
        </StyledPagination>
      </div>
    </StyledPage>
  )
}
