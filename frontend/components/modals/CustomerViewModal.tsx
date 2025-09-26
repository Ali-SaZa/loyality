"use client";
import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
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

import Modal from "./Modal";
import UserIcon from "@/components/icons/UserIcon";
import {
  CustomerTransaction,
  Transaction,
  transactionsService,
} from "@/services/transactions";
import { getUserById, User } from "@/services/users";
import { getStatusConfig } from "@/types/enums";
import { formatDateToPersianJalali, formatPhoneNumber } from "@/helpers";
import LabelContent from "../formElements/LabelContent";

interface CustomerViewModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  customerId?: string;
}

const CustomerViewModal = ({
  isOpen,
  onOpenChange,
  customerId,
}: CustomerViewModalProps) => {
  const [customer, setCustomer] = useState<CustomerTransaction | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen && customerId) {
      fetchCustomerData();
    }
  }, [isOpen, customerId]);

  const fetchCustomerData = async () => {
    if (!customerId) return;

    try {
      setIsLoading(true);

      // Fetch user details and transactions in parallel
      const [userData, transactionsData] = await Promise.all([
        getUserById(customerId),
        transactionsService.getCustomerTransactions(customerId),
      ]);

      setUser(userData);
      setTransactions(transactionsData);

      // Create customer object from user data and transactions
      const customerObj: CustomerTransaction = {
        id: userData.id,
        phoneNumber: userData.phoneNumber,
        firstName: userData.firstName,
        lastName: userData.lastName,
        status: userData.status || "active",
        totalTransactions: transactionsData.length,
        totalSpent: transactionsData.reduce(
          (sum, t) => sum + (t.promotion?.price || 0),
          0
        ),
        totalPointsEarned: transactionsData.reduce(
          (sum, t) => sum + (t.promotion?.points || 0),
          0
        ),
        firstTransactionDate:
          transactionsData.length > 0
            ? new Date(
                Math.min(
                  ...transactionsData.map((t) =>
                    new Date(t.createdAt).getTime()
                  )
                )
              )
            : new Date(),
        lastTransactionDate:
          transactionsData.length > 0
            ? new Date(
                Math.max(
                  ...transactionsData.map((t) =>
                    new Date(t.createdAt).getTime()
                  )
                )
              )
            : new Date(),
        lastActivity: new Date(userData.lastActivity),
      };

      setCustomer(customerObj);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "خطا در بارگذاری اطلاعات مشتری";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    setCustomer(null);
    setUser(null);
    setTransactions([]);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return formatDateToPersianJalali(date);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("fa-IR").format(amount);
  };

  const getStatusColor = (status: string) => {
    return getStatusConfig(status).color;
  };

  const getStatusText = (status: string) => {
    return getStatusConfig(status).text;
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      onClose={handleClose}
      title="مشاهده اطلاعات مشتری"
      size="xl"
      hideFooter={true}
    >
      <div className="space-y-6">
        {isLoading ? (
          <div className="text-center py-8">
            <p className="text-text-light">در حال بارگذاری...</p>
          </div>
        ) : customer && user ? (
          <>
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                  <UserIcon className="size-6 text-white" />
                </div>
                <h2 className="text-xl font-bold text-text-dark">
                  {customer.firstName && customer.lastName
                    ? `${customer.firstName} ${customer.lastName}`
                    : customer.phoneNumber}
                </h2>
              </div>
            </div>

            {/* Customer Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 px-2">
              <Card>
                <CardBody className="p-4">
                  <div className="text-center">
                    <p className="text-sm text-text-light mb-1">کل تراکنش‌ها</p>
                    <p className="text-2xl font-bold text-primary">
                      {customer.totalTransactions}
                    </p>
                  </div>
                </CardBody>
              </Card>

              <Card>
                <CardBody className="p-4">
                  <div className="text-center">
                    <p className="text-sm text-text-light mb-1">کل خرید</p>
                    <p className="text-2xl font-bold text-success">
                      {formatCurrency(customer.totalSpent)} تومان
                    </p>
                  </div>
                </CardBody>
              </Card>

              <Card>
                <CardBody className="p-4">
                  <div className="text-center">
                    <p className="text-sm text-text-light mb-1">امتیازات</p>
                    <p className="text-2xl font-bold text-warning">
                      {customer.totalPointsEarned}
                    </p>
                  </div>
                </CardBody>
              </Card>
            </div>

            {/* Customer Info */}

            <Card className="mx-2">
              <CardBody className="space-y-4">
                <LabelContent
                  label="شماره تلفن"
                  value={formatPhoneNumber(customer.phoneNumber)}
                />
                <LabelContent
                  label="اولین خرید"
                  value={formatDate(customer.firstTransactionDate.toString())}
                />
                <LabelContent
                  label="آخرین خرید"
                  value={formatDate(customer.lastTransactionDate.toString())}
                />
                <LabelContent
                  label="آخرین فعالیت"
                  value={formatDate(customer.lastActivity.toString())}
                />
                <LabelContent
                  label="تاریخ عضویت"
                  value={formatDate(user.createdAt)}
                />
              </CardBody>
            </Card>

            {/* Transactions History */}
            {transactions.length > 0 && (
              <Card className="mx-2 mb-2">
                <CardHeader className="pb-3">
                  <h3 className="text-lg font-semibold text-text-dark">
                    تاریخچه تراکنش‌ها
                  </h3>
                </CardHeader>
                <CardBody className="p-0">
                  <Table aria-label="تاریخچه تراکنش‌ها">
                    <TableHeader>
                      <TableColumn>تاریخ</TableColumn>
                      <TableColumn>پروماکد</TableColumn>
                      <TableColumn>پیشنهاد</TableColumn>
                      <TableColumn>قیمت</TableColumn>
                      <TableColumn>امتیاز</TableColumn>
                    </TableHeader>
                    <TableBody>
                      {transactions.map((transaction) => (
                        <TableRow key={transaction.id}>
                          <TableCell>
                            {formatDate(transaction.createdAt.toString())}
                          </TableCell>
                          <TableCell>
                            <span className="font-medium">
                              {transaction.promoCode?.code || "نامشخص"}
                            </span>
                          </TableCell>
                          <TableCell>
                            <span className="font-medium">
                              {transaction.promotion?.title || "نامشخص"}
                            </span>
                          </TableCell>
                          <TableCell>
                            <span className="font-medium">
                              {formatCurrency(
                                transaction.promotion?.price || 0
                              )}{" "}
                              تومان
                            </span>
                          </TableCell>
                          <TableCell>
                            <span className="font-medium">
                              {transaction.promotion?.points || 0}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardBody>
              </Card>
            )}
          </>
        ) : (
          <div className="text-center py-8">
            <p className="text-text-light">مشتری یافت نشد</p>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default CustomerViewModal;
