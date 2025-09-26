"use client";
import React, { useState, useEffect } from "react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Chip } from "@heroui/chip";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@heroui/table";
import { Pagination } from "@heroui/pagination";
import { Spinner } from "@heroui/spinner";
import MailIcon from "@/components/icons/MailIcon";
import {
  getSmsHistory,
  SmsHistoryItem,
  SmsHistoryResponse,
} from "@/services/stores";
import useAlertModal from "@/hooks/useAlertModal";
import {
  copyToClipboard,
  formatDateToPersianJalali,
  formatPhoneNumber,
} from "@/helpers";
import CopyIcon from "@/components/icons/CopyIcon";
import Button from "@/components/formElements/Button";

const SentMessagesPage = () => {
  const [smsHistory, setSmsHistory] = useState<SmsHistoryResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const { showAlert } = useAlertModal();

  const fetchSmsHistory = async (page: number = 1) => {
    try {
      setLoading(true);
      setError(null);
      const response = await getSmsHistory({ page, limit: 10 });
      setSmsHistory(response);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "خطا در دریافت تاریخچه پیامک‌ها";
      setError(errorMessage);
      showAlert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSmsHistory(currentPage);
  }, [currentPage]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  const handleCopyPhoneNumber = (phoneNumber: string) => {
    copyToClipboard(
      phoneNumber,
      "شماره تلفن کپی شد",
      "خطا در کپی کردن شماره تلفن"
    );
  };

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <MailIcon className="w-8 h-8 text-primary" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                پیامک‌های ارسالی
              </h1>
            </div>
          </div>
        </div>
        <Card>
          <CardBody className="text-center py-8">
            <div className="text-red-500 text-lg mb-4">{error}</div>
            <button
              onClick={() => fetchSmsHistory(currentPage)}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              تلاش مجدد
            </button>
          </CardBody>
        </Card>
      </div>
    );
  }

  if (!smsHistory || smsHistory.data.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <MailIcon className="w-8 h-8 text-primary" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                پیامک‌های ارسالی
              </h1>
            </div>
          </div>
        </div>
        <Card>
          <CardBody className="text-center py-12">
            <MailIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg mb-2">
              هنوز هیچ پیامکی ارسال نکرده‌اید
            </p>
            <p className="text-gray-400 text-sm">
              پیامک‌های ارسالی شما در اینجا نمایش داده خواهد شد
            </p>
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <MailIcon className="w-8 h-8 text-primary" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              پیامک‌های ارسالی
            </h1>
          </div>
        </div>
        <Chip color="primary" variant="flat" size="sm">
          مجموع: {smsHistory.total} پیامک
        </Chip>
      </div>

      {/* Messages Table */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">لیست پیامک‌های ارسالی</h3>
        </CardHeader>
        <CardBody>
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
                    <div className="text-sm text-gray-600">
                      {formatDateToPersianJalali(new Date(sms.sentDate))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-gray-600">
                      {sms.customerName || "نامشخص"}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-gray-600">
                      {formatPhoneNumber(sms.customerPhone)}
                      <Button
                        iconOnly
                        size="sm"
                        variant="light"
                        color="default"
                        onClick={() => handleCopyPhoneNumber(sms.customerPhone)}
                      >
                        <CopyIcon className="size-4" />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="max-w-xs">
                      <div className="text-sm text-gray-600 mb-1">
                        <span title={sms.messageText}>
                          {sms.messagePreview}
                        </span>
                      </div>
                      {sms.messageText !== sms.messagePreview && (
                        <div className="text-xs text-gray-500">
                          متن کامل در tooltip
                        </div>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardBody>
      </Card>

      {smsHistory.totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination
            total={smsHistory.totalPages}
            page={currentPage}
            onChange={setCurrentPage}
            showControls
            showShadow
            color="primary"
            className="rtl-pagination"
          />
        </div>
      )}
    </div>
  );
};

export default SentMessagesPage;
