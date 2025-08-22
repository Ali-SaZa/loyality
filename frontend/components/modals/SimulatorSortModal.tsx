'use client'
import React from 'react'
import { useDisclosure } from '@nextui-org/modal'

import CheckIcon from '../icons/CheckIcon'

import Modal from '@/components/modals/Modal'
import { SortItem } from '@/app/(landing)/simulators/page'
import Button from '@/components/formElements/Button'

interface SimulatorSortModalProps {
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
  sort?: SortItem
  setSort: React.Dispatch<React.SetStateAction<SortItem | undefined>>
  noScore?: boolean
}

const SimulatorSortModal = ({ isOpen, setIsOpen, sort, setSort, noScore = false }: SimulatorSortModalProps) => {
  const { onOpenChange } = useDisclosure()

  const handleSort = (sortItem: SortItem | undefined) => {
    setSort(sortItem)
    setIsOpen(false)
  }

  return (
    <Modal
      hideFooter
      headerClassName="border-none font-semibold"
      isOpen={isOpen}
      title="ترتیب"
      onClose={() => setIsOpen(false)}
      onOpenChange={onOpenChange}
    >
      <div className="grid grid-cols-1 gap-3">
        {!noScore && (
          <div
            className={`bg-background-${sort?.name === 'بالاترین امتیاز' ? '70' : '10'} hover:bg-background-70 rounded-lg py-3 px-4 text-text-dark flex items-center justify-between cursor-pointer`}
            role="button"
            onClick={() => handleSort({ name: 'بالاترین امتیاز', sort: 'score' })}
          >
            <p>بالاترین امتیاز</p>
            {sort?.name === 'بالاترین امتیاز' && <CheckIcon className="size-4 text-text" />}
          </div>
        )}
        <div
          className={`bg-background-${sort?.name === 'جدید ترین' ? '70' : '10'} hover:bg-background-70 rounded-lg py-3 px-4 text-text-dark flex items-center justify-between cursor-pointer`}
          role="button"
          onClick={() => handleSort({ name: 'جدید ترین', sort: '-createdAt' })}
        >
          <p>جدید ترین</p>
          {sort?.name === 'جدید ترین' && <CheckIcon className="size-4 text-text" />}
        </div>
        <div
          className={`bg-background-${sort?.name === 'قدیمی ترین' ? '70' : '10'} hover:bg-background-70 rounded-lg py-3 px-4 text-text-dark flex items-center justify-between cursor-pointer`}
          role="button"
          onClick={() => handleSort({ name: 'قدیمی ترین', sort: 'createdAt' })}
        >
          <p>قدیمی ترین</p>
          {sort?.name === 'قدیمی ترین' && <CheckIcon className="size-4 text-text" />}
        </div>
        <Button
          fullWidth
          className="mt-4"
          color="danger"
          disabled={!sort}
          onClick={() => handleSort(undefined)}
        >
          حذف همه
        </Button>
      </div>
    </Modal>
  )
}

export default SimulatorSortModal
