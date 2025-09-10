'use client'
import React, { useState, useEffect } from 'react'
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from '@heroui/table'
import { Pagination } from '@heroui/pagination'
import { Spinner } from '@heroui/spinner'
import { getSmsHistory, SmsHistoryItem, SmsHistoryResponse } from '@/services/stores'
import useAlertModal from '@/hooks/useAlertModal'
import { formatDateToPersianJalali } from '@/helpers'

const SentMessagesPage = () => {
  const [smsHistory, setSmsHistory] = useState<SmsHistoryResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [error, setError] = useState<string | null>(null)
  const { showAlert } = useAlertModal()

  const fetchSmsHistory = async (page: number = 1) => {
    try {
      setLoading(true)
      setError(null)
      const response = await getSmsHistory({ page, limit: 10 })
      setSmsHistory(response)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'خطا در دریافت تاریخچه پیامک‌ها'
      setError(errorMessage)
      showAlert(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSmsHistory(currentPage)
  }, [currentPage])

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500 text-lg">{error}</p>
        <button 
          onClick={() => fetchSmsHistory(currentPage)}
          className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
        >
          تلاش مجدد
        </button>
      </div>
    )
  }

  if (!smsHistory || smsHistory.data.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 text-lg">هنوز هیچ پیامکی ارسال نکرده‌اید</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">پیامک‌های ارسالی</h1>
        <div className="text-sm text-gray-500">
          مجموع: {smsHistory.total} پیامک
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border">
        <Table aria-label="SMS History Table">
          <TableHeader>
            <TableColumn>تاریخ ارسال</TableColumn>
            <TableColumn>نام مشتری</TableColumn>
            <TableColumn>شماره تلفن</TableColumn>
            <TableColumn>متن پیام</TableColumn>
          </TableHeader>
          <TableBody>
            {smsHistory.data.map((sms: SmsHistoryItem) => (
              <TableRow key={sms.id}>
                <TableCell>
                  <div className="text-sm">
                    {formatDateToPersianJalali(new Date(sms.sentDate))}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="font-medium">
                    {sms.customerName || 'نامشخص'}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm text-gray-600">
                    {sms.customerPhone}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm max-w-xs">
                    <span title={sms.messageText}>
                      {sms.messagePreview}
                    </span>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {smsHistory.totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination
            total={smsHistory.totalPages}
            page={currentPage}
            onChange={handlePageChange}
            showControls
            showShadow
            color="primary"
          />
        </div>
      )}
    </div>
  )
}

export default SentMessagesPage
