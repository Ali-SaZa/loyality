"use client";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import Modal from "./Modal";
import Input from "@/components/formElements/Input";
import { BasicPromotionValidation } from "@/validation/promotion";
import { Store } from "@/services/stores";

type BasicPromotionData = {
  storeId: string;
  title: string;
  description?: string;
};

interface PromotionBasicModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onNext: (data: BasicPromotionData) => void;
  stores: Store[];
}

const PromotionBasicModal = ({
  isOpen,
  onOpenChange,
  onNext,
  stores,
}: PromotionBasicModalProps) => {
  const methods = useForm<BasicPromotionData>({
    resolver: zodResolver(BasicPromotionValidation),
    defaultValues: {
      storeId: "",
      title: "",
      description: "",
    },
  });

  const onSubmit = (data: BasicPromotionData) => {
    console.log("Basic modal submitted:", data);
    onNext(data);
  };

  const handleSubmit = methods.handleSubmit(onSubmit);

  const handleAccept = () => {
    console.log("Accept button clicked");
    handleSubmit();
  };

  const handleClose = () => {
    onOpenChange(false);
    methods.reset();
  };

  const storeOptions = stores.map((store) => ({
    code: store.id,
    name: store.name,
  }));

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      onClose={handleClose}
      onAccept={handleAccept}
      onReject={handleClose}
      title="اطلاعات اولیه تبلیغ امتیازی"
      acceptBtnText="مرحله بعد"
      rejectBtnText="انصراف"
      acceptBtnColor="primary"
      size="lg"
    >
      <div className="space-y-6">
        <FormProvider {...methods}>
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              <Input
                generalType="select"
                name="storeId"
                label="فروشگاه"
                placeholder="فروشگاه را انتخاب کنید"
                selectOptions={storeOptions}
                selectKey="code"
                selectValue="name"
                required={true}
              />
            </div>

            <div className="grid grid-cols-1 gap-6">
              <Input
                generalType="input"
                name="title"
                label="عنوان تبلیغ"
                placeholder="عنوان تبلیغ را وارد کنید"
                inputType="text"
                required={true}
              />

              <Input
                generalType="input"
                name="description"
                label="توضیحات"
                placeholder="توضیحات تبلیغ (اختیاری)"
                inputType="text"
              />
            </div>

            {/* Info about points-based promotions */}
            <div className="p-4 bg-info-50 border border-info-200 rounded-lg">
              <p className="text-info text-sm">
                <strong>تبلیغ امتیازی:</strong> در این نوع تبلیغ، مشتریان با
                خرید مبلغ مشخصی، امتیاز دریافت می‌کنند که می‌توانند در خریدهای
                بعدی استفاده کنند.
              </p>
            </div>
          </div>
        </FormProvider>
      </div>
    </Modal>
  );
};

export default PromotionBasicModal;
