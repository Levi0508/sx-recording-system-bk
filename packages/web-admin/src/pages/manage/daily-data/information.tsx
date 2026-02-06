import { Table } from 'antd'
import { useEffect, useState } from 'react'

import { services } from '@af-charizard/sdk-services'

import { css } from '@emotion/css'
import { CommonPagination } from '~/components/common-pagination'
import { StyledPagination } from '../../classification-detail'
import { usePagination } from '~/hooks'

import styled from '@emotion/styled'
import { Loading } from '~/components/loading'
import { IDailyData } from '@af-charizard/sdk-services/src/services/passport$get$daily_data'

const StyledDiv = styled.div`
  width: 100%;
  padding: 15px;
`

export const PageDailyData = () => {
  const { tableParams, handleTableChange } = usePagination(30)

  const [dataSource, setDataSource] = useState<IDailyData[]>([])

  const [isLoading, setIsLoading] = useState(true) // 增加一个加载状态

  //总数
  const [total, setTotal] = useState(0)

  /**
   * 获取用户列表
   * @param values
   */
  const getClassificationAllVideo = async () => {
    const resp = await services.passport$get$daily_data({
      ...tableParams,
    })

    if (resp.data.code === 200) {
      setDataSource(resp.data.resource.list)
      setTotal(resp.data.resource.totalCount)
      setIsLoading(false) // 数据加载完成，更新加
    } else {
      setDataSource([])
      setTotal(0)
      setIsLoading(false) // 数据加载完成，更新加
    }
  }

  useEffect(() => {
    getClassificationAllVideo()
  }, [tableParams])
  return (
    <StyledDiv>
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <Table
            className={css`
              .ant-table-cell {
                white-space: nowrap;
              }
            `}
            columns={[
              {
                title: '日期',
                dataIndex: 'recordDate',
                align: 'center',
              },

              {
                title: '日播放数量',
                dataIndex: 'count',
                align: 'center',
              },
              {
                title: '日注册数量',
                dataIndex: 'registerCount',
                align: 'center',
              },
              {
                title: '日收入',
                dataIndex: 'dailyRevenue',
                align: 'center',
              },
            ]}
            rowKey="id"
            dataSource={dataSource}
            size="middle"
            pagination={false}
            // scroll={{
            //   x: 1500,
            //   y: window.innerHeight - 140,
            // }}
          />

          <StyledPagination>
            <CommonPagination
              total={total}
              totalInfo={`共 ${total} 条`}
              currentPage={tableParams.currentPage}
              pageSize={tableParams.pageSize}
              onPageChange={handleTableChange}
            />
          </StyledPagination>
        </>
      )}
    </StyledDiv>
  )
}

export default PageDailyData
