"use client";
import { useState } from "react";

import Modal from "./Modal";
import TrashIcon from "@/components/icons/TrashIcon";

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onConfirm: () => void;
  title: string;
  message: string;
  itemName?: string;
  isLoading?: boolean;
}

const DeleteConfirmModal = ({
  isOpen,
  onOpenChange,
  onConfirm,
  title,
  message,
  itemName,
  isLoading = false,
}: DeleteConfirmModalProps) => {
  const handleConfirm = () => {
    onConfirm();
  };

  const handleClose = () => {
    if (!isLoading) {
      onOpenChange(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      onClose={handleClose}
      onAccept={handleConfirm}
      onReject={handleClose}
      title={title}
      acceptBtnText="حذف"
      rejectBtnText="انصراف"
      acceptBtnColor="danger"
      size="md"
      isLoading={isLoading}
      acceptBtnDisabled={isLoading}
      rejectBtnDisabled={isLoading}
    >
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-danger-50 rounded-full flex items-center justify-center">
            <TrashIcon className="size-6 text-danger" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-text-dark">{title}</h3>
            <p className="text-text-light">{message}</p>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteConfirmModal;
