import { useState } from 'react'

export interface TableParams {
  currentPage: number
  pageSize: number
}

export const usePagination = (initialPageSize = 10) => {
  const [tableParams, setTableParams] = useState<TableParams>({
    currentPage: 1,
    pageSize: initialPageSize,
  })

  const handleTableChange = (currentPage: number, pageSize: number) => {
    setTableParams({ pageSize: pageSize || 10, currentPage: currentPage || 1 })
  }

  return {
    tableParams,
    handleTableChange,
  }
}
