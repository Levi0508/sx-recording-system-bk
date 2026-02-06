import {
  Button,
  Space,
  theme,
  Table,
  Modal,
  message,
  Form,
  Row,
  Col,
  Input,
  Select,
  DatePicker,
} from 'antd'
import locale from 'antd/lib/date-picker/locale/zh_CN'

import { useEffect, useState } from 'react'
import { services } from '@af-charizard/sdk-services'
import { css } from '@emotion/css'
import { CommonPagination } from '~/components/common-pagination'
import { StyledPagination } from '../../classification-detail'
import { usePagination } from '~/hooks'

import styled from '@emotion/styled'
import { Loading } from '~/components/loading'
import { IExchangeData } from '@af-charizard/sdk-services/src/services/pay$list'
import { formatDateHMS, formatDateM } from '~/utils/date'

const StyledDiv = styled.div`
  width: 100%;
  padding: 15px;
`

export const PageMoneyInformation = () => {
  const [form] = Form.useForm<any>()
  const { tableParams, handleTableChange } = usePagination(30)

  const [dataSource, setDataSource] = useState<IExchangeData[]>([])
  const [isLoading, setIsLoading] = useState(true) // 增加一个加载状态

  //总数
  const [total, setTotal] = useState(0)

  const onReset = () => {
    console.log('onReset')
    form.resetFields()
    getClassificationAllVideo()
  }

  /**
   * 获取视频列表
   * @param values
   */
  const getClassificationAllVideo = async () => {
    const { month, cardType, cardNumber, cardPassword } = form.getFieldsValue()
    const resp = await services.pay$list({
      ...tableParams,
      month: formatDateM(month ?? ''), // 按月份搜索，格式: YYYYMM
      cardType, // 卡类型过滤条件
      cardNumber, // 卡号过滤条件
      cardPassword, // 卡密过滤条件
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
      <Form
        style={{ padding: '15px' }}
        form={form}
        name="edit_drawer1_form"
        autoComplete="off"
      >
        <Row gutter={24}>
          <Col span={6}>
            <Form.Item label="兑换月份" name="month">
              <DatePicker
                style={{ width: '100%' }}
                required
                picker="month"
                locale={locale}
              />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="卡号" name="cardNumber">
              <Input placeholder="请输入" allowClear />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="卡密" name="cardPassword">
              <Input placeholder="请输入" allowClear />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="兑换卡类型" name="cardType">
              <Select
                allowClear
                placeholder="请选择"
                options={[
                  { label: '10', value: 10 },
                  { label: '30', value: 30 },
                  { label: '50', value: 50 },
                  { label: '80', value: 80 },
                  { label: '100', value: 100 },
                  { label: '200', value: 200 },
                  { label: '500', value: 500 },
                ]}
              />
            </Form.Item>
          </Col>
          <Col>
            <Form.Item>
              <Space>
                <Button type="primary" onClick={getClassificationAllVideo}>
                  查询
                </Button>
                <Button htmlType="button" onClick={onReset}>
                  重置
                </Button>
              </Space>
            </Form.Item>
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
            // rowSelection={{
            //   selectedRowKeys,
            //   ...rowSelection,
            // }}
            columns={[
              {
                title: '卡号',
                dataIndex: 'cardNumber',
                align: 'center',
              },
              {
                title: '卡密',
                dataIndex: 'cardPassword',
                align: 'center',
              },
              {
                title: '兑换卡类型',
                dataIndex: 'cardType',
                align: 'center',
              },

              {
                title: '使用人ID',
                dataIndex: 'userId',
                align: 'center',
              },
              {
                title: '兑换时间',
                dataIndex: 'exchangeAt',
                align: 'center',
                render: formatDateHMS,
              },
            ]}
            rowKey="cardNumber"
            dataSource={dataSource}
            size="middle"
            pagination={false}
            scroll={{
              x: 1000,
              y: window.innerHeight - 140,
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

export default PageMoneyInformation
