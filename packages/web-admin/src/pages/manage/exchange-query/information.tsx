import { Button, Space, Table, Form, Row, Col, Input } from 'antd'
import { useEffect, useState, useCallback } from 'react'

import { services } from '@af-charizard/sdk-services'

import { css } from '@emotion/css'
import { CommonPagination } from '~/components/common-pagination'
import { StyledPagination } from '../../classification-detail'
import { usePagination } from '~/hooks'

import styled from '@emotion/styled'
import { Loading } from '~/components/loading'
import { IExchangeRecord } from '@af-charizard/sdk-services/src/services/user$exchange$query'
import { formatDateHMS } from '~/utils/date'

const StyledDiv = styled.div`
  width: 100%;
  padding: 15px;
`

export const PageExchangeQuery = () => {
  const [form] = Form.useForm<any>()
  const { tableParams, handleTableChange } = usePagination(30)

  const [dataSource, setDataSource] = useState<IExchangeRecord[]>([])

  const [isLoading, setIsLoading] = useState(false)

  //总数
  const [total, setTotal] = useState(0)

  /**
   * 获取兑换记录
   */
  const getExchangeRecords = useCallback(async () => {
    const { id, email } = form.getFieldsValue()

    setIsLoading(true)
    const resp = await services.user$exchange$query({
      ...tableParams,
      id: id ? Number(id) : undefined,
      email: email || undefined,
    })

    if (resp.data.code === 200) {
      setDataSource(resp.data.resource.list)
      setTotal(resp.data.resource.totalCount)
      setIsLoading(false)
    } else {
      setDataSource([])
      setTotal(0)
      setIsLoading(false)
    }
  }, [tableParams, form])

  const onReset = () => {
    form.resetFields()
    getExchangeRecords()
  }

  useEffect(() => {
    // 默认加载全部记录
    getExchangeRecords()
  }, [getExchangeRecords])

  return (
    <StyledDiv>
      <Form
        style={{ padding: '15px' }}
        form={form}
        name="exchange_query_form"
        autoComplete="off"
      >
        <Row gutter={24}>
          <Col span={7}>
            <Form.Item label="用户ID" name="id">
              <Input placeholder="请输入用户ID" allowClear type="number" />
            </Form.Item>
          </Col>
          <Col span={7}>
            <Form.Item label="邮箱" name="email">
              <Input placeholder="请输入邮箱" allowClear />
            </Form.Item>
          </Col>
          <Col span={10}>
            <Space>
              <Button type="primary" onClick={getExchangeRecords}>
                查询
              </Button>
              <Button onClick={onReset}>重置</Button>
            </Space>
          </Col>
        </Row>
      </Form>
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
                title: '记录ID',
                dataIndex: 'id',
                align: 'center',
                width: 100,
              },
              {
                title: '用户ID',
                dataIndex: 'userId',
                align: 'center',
                width: 100,
              },
              {
                title: '用户邮箱',
                dataIndex: 'userEmail',
                align: 'center',
                width: 200,
                render: (data) => <div>{data || '-'}</div>,
              },
              {
                title: '用户昵称',
                dataIndex: 'userNickname',
                align: 'center',
                width: 150,
                render: (data) => <div>{data || '默认昵称'}</div>,
              },
              {
                title: '商品ID',
                dataIndex: 'goodsId',
                align: 'center',
                width: 150,
              },
              {
                title: '商品名称',
                dataIndex: 'name',
                align: 'center',
                width: 150,
              },
              {
                title: '商品类型',
                dataIndex: 'goodsType',
                align: 'center',
                width: 120,
                render: (data) => {
                  const typeMap: Record<string, string> = {
                    vip: 'VIP会员',
                    avatar_frame: '头像框',
                    month: '月合集',
                    anchor: '主播合集',
                  }
                  return typeMap[data] || data
                },
              },
              {
                title: '价格',
                dataIndex: 'price',
                align: 'center',
                width: 100,
                render: (data) => <div>{data}</div>,
              },
              {
                title: '兑换时间',
                dataIndex: 'createdAt',
                align: 'center',
                render: formatDateHMS,
                width: 170,
              },
            ]}
            rowKey="id"
            dataSource={dataSource}
            size="middle"
            pagination={false}
            scroll={{
              x: 1500,
              y: window.innerHeight - 200,
            }}
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

export default PageExchangeQuery
