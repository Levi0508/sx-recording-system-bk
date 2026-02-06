import React from 'react'
import { Pagination } from 'antd'
import { useScrollToTop } from '~/hooks'
import { useUpdateEffect } from 'ahooks'

import styled from '@emotion/styled'

const StyledPage = styled.div`
  text-align: center;
  margin: 15px 0 5px 0;
`
interface IProps {
  total: number
  currentPage: number
  pageSize: number
  onPageChange: (currentPage: number, pageSize: number) => void
  pageSizeOptions?: number[]
  totalInfo: string
}

export const CommonPagination: React.FC<IProps> = ({
  total,
  currentPage,
  pageSize,
  onPageChange,
  pageSizeOptions = [30, 60, 120],
  totalInfo,
}) => {
  const scrollToTop = useScrollToTop()

  useUpdateEffect(() => {
    scrollToTop()
  }, [currentPage, pageSize])
  return total > 0 ? (
    <StyledPage>
      <Pagination
        total={total}
        showTotal={() => totalInfo}
        current={currentPage}
        pageSize={pageSize}
        pageSizeOptions={pageSizeOptions}
        onChange={onPageChange}
        showSizeChanger
        showQuickJumper
      />
    </StyledPage>
  ) : (
    <></>
  )
}
