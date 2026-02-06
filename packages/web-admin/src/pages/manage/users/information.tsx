import { Button, Space, Table, Form, Row, Col, Input, Select } from 'antd'
import { useEffect, useState } from 'react'

import { services } from '@af-charizard/sdk-services'

import { css } from '@emotion/css'
import { CommonPagination } from '~/components/common-pagination'
import { StyledPagination } from '../../classification-detail'
import { usePagination } from '~/hooks'

import styled from '@emotion/styled'
import { Loading } from '~/components/loading'
import { IUserData } from '@af-charizard/sdk-services/src/services/user$list'
import { formatDateHMS } from '~/utils/date'
import { isMobilePhone } from '~/utils/isMobile'

const StyledDiv = styled.div`
  width: 100%;
  padding: 15px;
`

export const PageUsersInformation = () => {
  const [form] = Form.useForm<any>()
  const [formModal] = Form.useForm<any>()
  const { tableParams, handleTableChange } = usePagination(30)

  const [dataSource, setDataSource] = useState<IUserData[]>([])

  const [isLoading, setIsLoading] = useState(true) // 增加一个加载状态

  //总数
  const [total, setTotal] = useState(0)

  const onReset = () => {
    console.log('onReset')
    form.resetFields()
    getClassificationAllVideo()
  }

  /**
   * 获取用户列表
   * @param values
   */
  const getClassificationAllVideo = async () => {
    const { nickname, email, ip, isVip, facility, id } = form.getFieldsValue()
    const resp = await services.user$list({
      ...tableParams,
      nickname,
      email,
      ip,
      isVip,
      facility,
      id,
    })
    console.log(
      '%c这是锋酱的打印',
      'color: red; font-size: 30px;',
      resp.data.resource,
    )

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
          <Col span={7}>
            <Form.Item label="id" name="id">
              <Input placeholder="请输入" allowClear />
            </Form.Item>
          </Col>
          <Col span={7}>
            <Form.Item label="邮箱" name="email">
              <Input placeholder="请输入" allowClear />
            </Form.Item>
          </Col>
          <Col span={7}>
            <Form.Item label="IP" name="ip">
              <Input placeholder="请输入" allowClear />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={24}>
          {/* <Col span={7}>
            <Form.Item label="是否会员" name="isVip">
              <Select
                allowClear
                placeholder="请选择"
                options={[
                  { label: '是', value: 'TRUE' },
                  { label: '否', value: 'FALSE' },
                ]}
              />
            </Form.Item>
          </Col>
          <Col span={7}>
            <Form.Item label="设备" name="facility">
              <Select
                allowClear
                placeholder="请选择"
                options={[
                  { label: '移动设备', value: 'MOBILE' },
                  { label: 'PC', value: 'PC' },
                ]}
              />
            </Form.Item>
          </Col> */}
          <Col span={6}>
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
            columns={[
              {
                title: '用户ID',
                dataIndex: 'id',
                align: 'center',
              },
              {
                title: '昵称',
                dataIndex: 'nickname',
                align: 'center',
                render: (data) => <div>{data ?? '默认昵称'}</div>,
              },
              {
                title: '邮箱',
                dataIndex: 'email',
                align: 'center',
                width: 200,
              },
              {
                title: '最近登录IP',
                dataIndex: 'ipAddress',
                align: 'center',
                render: (data) => <div>{data ?? '-'}</div>,
                width: 200,
              },
              {
                title: '余额',
                dataIndex: 'money',
                align: 'center',
                render: (data) => data / 10,
              },
              {
                title: '邀请人id',
                dataIndex: 'invitationUserId',
                align: 'center',
                render: (data) => <div>{data ?? '-'}</div>,
              },
              {
                title: '会员过期时间',
                dataIndex: 'vipDeadLine',
                align: 'center',
                render: formatDateHMS,
                width: 170,
              },
              {
                title: '是否是会员',
                dataIndex: 'isVip',
                align: 'center',
                render: (data) => (data ? '是' : '否'),
                width: 100,
              },

              {
                title: '会员类型',
                dataIndex: 'vipType',
                align: 'center',
                width: 100,
              },

              {
                title: '邀请码',
                dataIndex: 'defaultInvitationCode',
                align: 'center',
                render: (data) => <div>{data ?? '-'}</div>,
              },
              {
                title: '注册时间',
                dataIndex: 'createdAt',
                align: 'center',
                render: formatDateHMS,
                width: 170,
              },
              {
                title: '封号时间',
                dataIndex: 'banAccountDate',
                align: 'center',
                render: formatDateHMS,
                width: 170,
              },
              {
                title: '设备',
                dataIndex: 'userAgent',
                align: 'center',
                render: (data) => (
                  <div>{isMobilePhone(data) ? '移动设备' : 'PC'}</div>
                ),
              },
            ]}
            rowKey="id"
            dataSource={dataSource}
            size="middle"
            pagination={false}
            scroll={{
              x: 1500,
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

export default PageUsersInformation
