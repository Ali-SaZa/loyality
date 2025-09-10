"use client";
import { useState, useEffect } from "react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import Button from "@/components/formElements/Button";
import { Chip } from "@heroui/chip";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@heroui/table";

import UserIcon from "@/components/icons/UserIcon";
import EyeIcon from "@/components/icons/EyeIcon";
import PlusIcon from "@/components/icons/PlusIcon";
import ChatArrowGrowIcon from "@/components/icons/ChatArrowGrowIcon";
import {
  transactionsService,
  CustomerTransaction,
} from "@/services/transactions";
import useLoading from "@/hooks/useLoading";
import { useSmsBalanceContext } from "@/context/SmsBalanceContext";
import { getStatusConfig } from "@/types/enums";
import { formatDateToPersianJalali, formatPhoneNumber } from "@/helpers";
import CustomerViewModal from "@/components/modals/CustomerViewModal";
import AddCustomerModal from "@/components/modals/AddCustomerModal";
import SendMessageModal from "@/components/modals/SendMessageModal";

const StoreUsers = () => {
  const { setLoading } = useLoading();
  const { refetch: refetchSmsBalance } = useSmsBalanceContext();

  const [customers, setCustomers] = useState<CustomerTransaction[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Customer view modal state
  const [customerViewModal, setCustomerViewModal] = useState({
    isOpen: false,
    customerId: undefined as string | undefined,
  });

  // Add customer modal state
  const [addCustomerModal, setAddCustomerModal] = useState({
    isOpen: false,
  });

  // Send message modal state
  const [sendMessageModal, setSendMessageModal] = useState({
    isOpen: false,
    customerId: undefined as string | undefined,
    customerName: undefined as string | undefined,
  });

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await transactionsService.getMyStoreCustomers();
      setCustomers(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : "خطا در بارگذاری مشتریان");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    return getStatusConfig(status).color;
  };

  const getStatusText = (status: string) => {
    return getStatusConfig(status).text;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return formatDateToPersianJalali(date);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("fa-IR").format(amount);
  };

  const handleViewCustomer = (customerId: string) => {
    setCustomerViewModal({
      isOpen: true,
      customerId,
    });
  };

  const handleAddCustomer = () => {
    setAddCustomerModal({
      isOpen: true,
    });
  };

  const handleAddCustomerSuccess = () => {
    fetchCustomers(); // Refresh the customers list
  };

  const handleSendMessageSuccess = () => {
    refetchSmsBalance(); // Refresh SMS balance
  };

  const handleSendMessage = (customerId: string, customerName: string) => {
    console.log(customerId, customerName);
    setSendMessageModal({
      isOpen: true,
      customerId,
      customerName,
    });
  };

  if (error) {
    return (
      <div className="p-6">
        <Card className="border-1">
          <CardBody className="p-6">
            <div className="text-center">
              <p className="text-danger mb-4">{error}</p>
              <Button color="primary" onClick={fetchCustomers}>
                تلاش مجدد
              </Button>
            </div>
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
          <UserIcon className="w-8 h-8 text-primary" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              مشتریان فروشگاه
            </h1>
          </div>
        </div>
        <Button
          iconStart={<PlusIcon className="size-5" />}
          onClick={handleAddCustomer}
        >
          افزودن مشتری
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardBody className="text-center">
            <div className="text-2xl font-bold text-gray-900">
              {customers.length}
            </div>
            <div className="text-sm text-gray-600">کل مشتریان</div>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {customers.reduce(
                (sum, customer) => sum + customer.totalTransactions,
                0
              )}
            </div>
            <div className="text-sm text-gray-600">کل تراکنش‌ها</div>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {formatCurrency(
                customers.reduce(
                  (sum, customer) => sum + customer.totalSpent,
                  0
                )
              )}
            </div>
            <div className="text-sm text-gray-600">کل فروش</div>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="text-center">
            <div className="text-2xl font-bold text-orange-600">
              {customers.reduce(
                (sum, customer) => sum + customer.totalPointsEarned,
                0
              )}
            </div>
            <div className="text-sm text-gray-600">کل امتیازات</div>
          </CardBody>
        </Card>
      </div>

      {/* Customers Table */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">لیست مشتریان</h3>
        </CardHeader>
        <CardBody>
          <Table aria-label="Customers table">
            <TableHeader>
              <TableColumn>نام مشتری</TableColumn>
              <TableColumn>شماره تلفن</TableColumn>
              <TableColumn>وضعیت</TableColumn>
              <TableColumn>تعداد تراکنش</TableColumn>
              <TableColumn>کل خرید</TableColumn>
              <TableColumn>امتیازات</TableColumn>
              <TableColumn>آخرین خرید</TableColumn>
              <TableColumn>عملیات</TableColumn>
            </TableHeader>
            <TableBody>
              {customers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-semibold">
                          {customer.firstName
                            ? customer.firstName.charAt(0)
                            : customer.phoneNumber.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">
                          {customer.firstName && customer.lastName
                            ? `${customer.firstName} ${customer.lastName}`
                            : "نام ثبت نشده"}
                        </div>
                        <div className="text-xs text-gray-500">
                          ID: {customer.id}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-gray-600">
                      {formatPhoneNumber(customer.phoneNumber)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Chip
                      color={getStatusColor(customer.status)}
                      variant="flat"
                      size="sm"
                    >
                      {getStatusText(customer.status)}
                    </Chip>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-gray-600">
                      {customer.totalTransactions}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-gray-600">
                      {formatCurrency(customer.totalSpent)} تومان
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-gray-600">
                      {customer.totalPointsEarned}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-gray-600">
                      {formatDate(customer.lastTransactionDate.toString())}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        iconOnly
                        size="sm"
                        variant="light"
                        color="primary"
                        onClick={() => handleViewCustomer(customer.id)}
                      >
                        <EyeIcon className="size-4" />
                      </Button>
                      <Button
                        iconOnly
                        size="sm"
                        variant="light"
                        color="success"
                        onClick={() =>
                          handleSendMessage(
                            customer.id,
                            `${customer.firstName} ${customer.lastName}`
                          )
                        }
                      >
                        <ChatArrowGrowIcon className="size-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardBody>
      </Card>

      {/* Customer View Modal */}
      <CustomerViewModal
        isOpen={customerViewModal.isOpen}
        onOpenChange={(isOpen) =>
          setCustomerViewModal((prev) => ({ ...prev, isOpen }))
        }
        customerId={customerViewModal.customerId}
      />

      {/* Add Customer Modal */}
      <AddCustomerModal
        isOpen={addCustomerModal.isOpen}
        onOpenChange={(isOpen) =>
          setAddCustomerModal((prev) => ({ ...prev, isOpen }))
        }
        onSuccess={handleAddCustomerSuccess}
      />

      {/* Send Message Modal */}
      <SendMessageModal
        isOpen={sendMessageModal.isOpen}
        onOpenChange={(isOpen) =>
          setSendMessageModal((prev) => ({ ...prev, isOpen }))
        }
        customerId={sendMessageModal.customerId || ""}
        customerName={sendMessageModal.customerName || ""}
        onSuccess={handleSendMessageSuccess}
      />
    </div>
  );
};

export default StoreUsers;
