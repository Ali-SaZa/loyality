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
import { getStatusConfig } from "@/types/enums";
import { formatDateToPersianJalali, formatPhoneNumber } from "@/helpers";
import CustomerViewModal from "@/components/modals/CustomerViewModal";
import AddCustomerModal from "@/components/modals/AddCustomerModal";
import SendMessageModal from "@/components/modals/SendMessageModal";

const StoreUsers = () => {
  const { setLoading } = useLoading();

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
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <UserIcon className="size-8 text-primary" />
          <div>
            <h1 className="text-2xl font-bold text-text-dark">
              مشتریان فروشگاه
            </h1>
            <p className="text-text-light">
              مدیریت مشتریان و تراکنش‌های فروشگاه
            </p>
          </div>
        </div>
        <Button
          color="success"
          iconStart={<PlusIcon className="size-5" />}
          onClick={handleAddCustomer}
        >
          افزودن مشتری
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-1">
          <CardBody className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-light mb-1">کل مشتریان</p>
                <p className="text-2xl font-bold text-text-dark">
                  {customers.length}
                </p>
              </div>
              <UserIcon className="size-8 text-primary" />
            </div>
          </CardBody>
        </Card>

        <Card className="border-1">
          <CardBody className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-light mb-1">کل تراکنش‌ها</p>
                <p className="text-2xl font-bold text-text-dark">
                  {customers.reduce(
                    (sum, customer) => sum + customer.totalTransactions,
                    0
                  )}
                </p>
              </div>
              <UserIcon className="size-8 text-success" />
            </div>
          </CardBody>
        </Card>

        <Card className="border-1">
          <CardBody className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-light mb-1">کل فروش</p>
                <p className="text-2xl font-bold text-text-dark">
                  {formatCurrency(
                    customers.reduce(
                      (sum, customer) => sum + customer.totalSpent,
                      0
                    )
                  )}{" "}
                  تومان
                </p>
              </div>
              <UserIcon className="size-8 text-warning" />
            </div>
          </CardBody>
        </Card>

        <Card className="border-1">
          <CardBody className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-light mb-1">کل امتیازات</p>
                <p className="text-2xl font-bold text-text-dark">
                  {customers.reduce(
                    (sum, customer) => sum + customer.totalPointsEarned,
                    0
                  )}
                </p>
              </div>
              <UserIcon className="size-8 text-danger" />
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Customers Table */}
      <Card className="border-1">
        <CardHeader className="pb-3">
          <h3 className="text-lg font-semibold text-text-dark">لیست مشتریان</h3>
        </CardHeader>
        <CardBody className="p-0">
          <Table aria-label="لیست مشتریان">
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
                        <span className="font-medium">
                          {customer.firstName && customer.lastName
                            ? `${customer.firstName} ${customer.lastName}`
                            : "نام ثبت نشده"}
                        </span>
                        <p className="text-xs text-text-light">
                          ID: {customer.id}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium">
                      {formatPhoneNumber(customer.phoneNumber)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Chip
                      color={getStatusColor(customer.status)}
                      size="sm"
                      variant="flat"
                    >
                      {getStatusText(customer.status)}
                    </Chip>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium">
                      {customer.totalTransactions}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium">
                      {formatCurrency(customer.totalSpent)} تومان
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium">
                      {customer.totalPointsEarned}
                    </span>
                  </TableCell>
                  <TableCell>
                    {formatDate(customer.lastTransactionDate.toString())}
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
                        onClick={() => handleSendMessage(customer.id, `${customer.firstName} ${customer.lastName}`)}
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
        customerId={sendMessageModal.customerId || ''}
        customerName={sendMessageModal.customerName || ''}
        onSuccess={handleAddCustomerSuccess}
      />
    </div>
  );
};

export default StoreUsers;
