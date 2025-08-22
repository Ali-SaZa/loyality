import { Pagination as NextUiPagination } from '@nextui-org/pagination'
import '@/styles/pagination.scss'
import React from 'react'

interface CustomPaginationProps {
  total: number
  currentPage: number
  onPageChange: React.Dispatch<React.SetStateAction<number>>
}

const Pagination = ({ total, currentPage, onPageChange }: CustomPaginationProps) => {
  return (
    <NextUiPagination
      showControls
      color="primary"
      dir="ltr"
      page={currentPage}
      total={total}
      onChange={onPageChange} // اتصال setPage به تغییر صفحه
    />
  )
}

export default Pagination
