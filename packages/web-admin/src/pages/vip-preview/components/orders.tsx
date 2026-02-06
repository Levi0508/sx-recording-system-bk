import React, { useState, useEffect } from 'react'
import styled from '@emotion/styled'

import { TableProps, Table } from 'antd'
import { formatDateHMS } from '~/utils/date'
import { StyledTitle, StyledTop } from './favorite'
import type { IOrderList } from '@af-charizard/sdk-services/src/services/user$buy$order'

import { services } from '@af-charizard/sdk-services'
import { useIsMobile } from '~/hooks/useIsMobile'
import { CopyrightOutlined } from '@ant-design/icons'
import { moneyHandler } from '~/utils/money'
import { StyledPagination } from '~/pages/classification-detail'
import { CommonPagination } from '~/components/common-pagination'
import { usePagination } from '~/hooks'

const StyledPage = styled.div`
  width: 100%;

  .ant-card-body {
    height: 100%;
    padding: 15px 15px 15px 15px;

    .ant-card-meta-avatar {
      padding-inline-end: 10px;
    }

    @media (max-width: 768px) {
      padding: 15px 15px 15px 15px;
    }
  }
  .avatar_ff {
    .ant-card-body {
      height: 100%;
      padding: 27px 15px 25px 28px;

      .ant-card-meta-avatar {
        padding-inline-end: 26px;
      }

      @media (max-width: 768px) {
        .ant-card-meta-avatar {
          padding-inline-end: 16px;
        }
        padding: 20px 10px 15px 20px;
      }
    }
  }
  .ant-avatar {
    width: 50px;
    height: 50px;
  }

  @media (max-width: 768px) {
    .ant-card {
      height: 100%;
    }
    .ant-table-cell {
      padding: 10px 10px !important;
    }
  }
  .ant-card-meta-title {
    margin-bottom: 4px !important;
  }
`
const goodsTypeMap = new Map<string, string>([
  ['avatar_frame', '头像框'],
  ['vip', '会员卡'],
  ['anchor', '主播合集'],
  ['month', '月包'],
])
interface IProps {
  setIsClicked?: React.Dispatch<React.SetStateAction<string>>
}
export const Orders: React.FC<IProps> = ({ setIsClicked }) => {
  //用户信息

  const isMobile = useIsMobile()

  const [orderList, setOrderList] = useState<IOrderList[]>([])
  const { tableParams, handleTableChange } = usePagination(10)
  const [total, setTotal] = useState(0)

  const columns: TableProps<IOrderList>['columns'] = [
    {
      title: '订单号',
      dataIndex: 'id',
      key: 'id',
      align: 'center',
      width: isMobile ? 80 : 200,
    },
    {
      title: '商品名称',
      dataIndex: 'name',
      key: 'name',
      align: 'center',
      width: isMobile ? 150 : 200,
    },
    {
      title: '商品类型',
      dataIndex: 'goodsType',
      key: 'goodsType',
      align: 'center',
      width: isMobile ? 150 : 200,
      render: (key) => goodsTypeMap.get(key),
    },
    {
      title: <div>价格</div>,
      dataIndex: 'price',
      key: 'price',
      align: 'center',
      width: isMobile ? 100 : 200,

      render: (key) => {
        return (
          <div>
            {/* <span> {moneyHandler(key)}</span> */}
            <span> {key}</span>

            <CopyrightOutlined style={{ margin: '0 5px' }} />
          </div>
        )
      },
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
   * 查询订单
   * @returns
   */
  const getBuyOrder = async () => {
    const { data } = await services.user$buy$order({
      ...tableParams,
    })

    if (data.code === 200) {
      setOrderList(data.resource.list)
      setTotal(data.resource.totalCount)
    } else {
      setOrderList([])
      setTotal(0)
    }
  }

  useEffect(() => {
    getBuyOrder()
  }, [tableParams])

  return (
    <StyledPage>
      <div>
        <StyledTop>
          <StyledTitle>交易记录</StyledTitle>
        </StyledTop>

        <Table
          columns={columns}
          dataSource={orderList}
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
