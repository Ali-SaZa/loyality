"use client";
import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-hot-toast";

import Modal from "./Modal";
import Input from "@/components/formElements/Input";
import { sendSmsToCustomer, SendSmsRequest } from "@/services/stores";
import {
  SendMessageValidation,
  SendMessageData,
} from "@/validation/sendMessage";
import { getSmsInfo } from "@/helpers/smsUtils";

interface SendMessageModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  customerId: string;
  customerName: string;
  onSuccess?: () => void;
}

const SendMessageModal = ({
  isOpen,
  onOpenChange,
  customerId,
  customerName,
  onSuccess,
}: SendMessageModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const methods = useForm<SendMessageData>({
    resolver: zodResolver(SendMessageValidation),
    defaultValues: {
      text: "",
    },
  });

  const onSubmit = async (data: SendMessageData) => {
    try {
      setIsSubmitting(true);

      const smsData: SendSmsRequest = {
        userId: customerId,
        text: data.text,
      };

      await sendSmsToCustomer(smsData);

      toast.success("پیام با موفقیت ارسال شد");
      onOpenChange(false);
      methods.reset();
      onSuccess?.();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "خطا در ارسال پیام";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onOpenChange(false);
      methods.reset();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={handleClose}
      title={`ارسال پیام به ${customerName}`}
      size="md"
      acceptBtnText="ارسال پیام"
      placement="top-center"
      rejectBtnText="انصراف"
      acceptBtnColor="primary"
      acceptBtnDisabled={isSubmitting}
      rejectBtnDisabled={isSubmitting}
      isLoading={isSubmitting}
      onAccept={methods.handleSubmit(onSubmit)}
      onReject={handleClose}
    >
      <div className="space-y-4">
        <div className="bg-primary/10 border border-primary/20 rounded-md p-3">
          <p className="text-sm text-primary/80">
            پیام شما به شماره تلفن مشتری ارسال خواهد شد. هر ۷۰ کاراکتر معادل یک
            پیامک محاسبه می‌شود. حداکثر ۲۸۰ کاراکتر مجاز است.
          </p>
        </div>

        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
            <Input
              generalType="textarea"
              name="text"
              label="متن پیام"
              placeholder="متن پیام خود را وارد کنید..."
              required
              description={(() => {
                const text = methods.watch("text") || "";
                const smsInfo = getSmsInfo(text);
                return `${smsInfo.characterCount} کاراکتر - ${smsInfo.smsCount} پیامک`;
              })()}
            />
          </form>
        </FormProvider>
      </div>
    </Modal>
  );
};

export default SendMessageModal;
