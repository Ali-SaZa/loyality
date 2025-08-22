'use client'
import React from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '@nextui-org/popover'

import { fileAddress, getFullName, truncateText } from '@/helpers'
import useWindowSize from '@/hooks/useWindowSize'

const CommentCard = ({ isActive = false, comment }: { isActive?: boolean; comment: any }) => {
  const { width } = useWindowSize()

  return (
    <Popover placement="top">
      <PopoverTrigger>
        <div
          className={`max-w-[400px] rounded-3xl transition-all duration-500 ease-in-out outline outline-1 border cursor-pointer ${isActive ? ' outline-secondary border-secondary bg-secondary-5 ' : ' outline-[#ddd] border-[#ddd] bg-white  '} p-6 flex flex-col gap-4 h-[150px] md:h-[230px]`}
          style={{ minWidth: `${width < 768 ? width - 74 : '400'}px` }}
        >
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <img
                alt="simulator"
                className="rounded-full size-[50px]"
                height={50}
                src={fileAddress(comment?.userImageId)}
                width={50}
              />
              <p className="text-lg text-text-dark font-bold">
                {getFullName(comment?.firstName || comment?.learnerFirstName, comment?.lastName || comment?.learnerLastName)}
              </p>
            </div>
            {/* <div className="flex items-center gap-2">
          4.5
          <StarRatingIcon className="size-4" />
        </div> */}
          </div>
          <p className="text-sm md:text-lg">
            &quot;
            {truncateText(comment?.comment, width < 768 ? 50 : 100)}
            &quot;
          </p>
        </div>
      </PopoverTrigger>
      <PopoverContent className="p-4 max-w-[400px] mr-1.5 md:mr-0">
        <div className="max-h-[200px] overflow-x-hidden overflow-y-auto ">
          <p className="text-sm md:text-lg ">
            &quot;
            {comment?.comment}
            &quot;
          </p>
        </div>
      </PopoverContent>
    </Popover>
  )
}

export default CommentCard
