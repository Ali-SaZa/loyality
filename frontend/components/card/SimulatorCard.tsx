import React, { useState } from 'react'
import Link from 'next/link'

import Hashtag from '../ui/Hashtag'

import CheckBoxIcon from '@/components/icons/CheckBoxIcon'
import StarRatingIcon from '@/components/icons/StarRatingIcon'
import Button from '@/components/formElements/Button'
import { fileAddress, isEmptyObject, truncateText } from '@/helpers'
import useGlobal from '@/hooks/useGlobal'
import BookmarkFillIcon from '@/components/icons/BookmarkFillIcon'
import BookmarkIcon from '@/components/icons/BookmarkIcon'

const SimulatorCard = ({ simulator }: { simulator: any }) => {
  const isBookmarked = (itemId: string) => {
    const existingBookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]')

    return existingBookmarks.includes(itemId)
  }

  const { data } = useGlobal()
  const [hasBookmark, setHasBookmark] = useState<boolean>(isBookmarked(simulator?.id))

  const handleBookmark = () => {
    setHasBookmark((prev) => !prev)
    toggleBookmark(simulator?.id)
  }

  const toggleBookmark = (itemId: string) => {
    // دریافت بوکمارک‌های موجود
    const existingBookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]')

    // بررسی اینکه آیا آیتم در بوکمارک‌ها هست یا نه
    if (existingBookmarks.includes(itemId)) {
      // اگر هست، حذفش کن
      const updatedBookmarks = existingBookmarks.filter((id: string) => id !== itemId)

      localStorage.setItem('bookmarks', JSON.stringify(updatedBookmarks))
    } else {
      // اگر نیست، اضافه کن
      existingBookmarks.push(itemId)
      localStorage.setItem('bookmarks', JSON.stringify(existingBookmarks))
    }
  }

  return (
    <Link
      className="bg-background-10 rounded-xl p-3 flex flex-col gap-4 w-[300px] min-w-[300px] max-w-[300px] mx-auto cursor-pointer transition-all ease-linear duration-200 hover:shadow-xl"
      href={'/simulators/' + simulator?.id}
    >
      <div className="relative overflow-hidden w-full rounded-lg">
        <Button
          iconOnly
          className="absolute bottom-3 right-3"
          color="default"
          size="sm"
          onClick={handleBookmark}
        >
          {hasBookmark ? <BookmarkFillIcon className="size-4 text-primary" /> : <BookmarkIcon className="size-4 text-[#74757E]" />}
        </Button>
        {!isEmptyObject(simulator?.rate ?? {}) && (
          <Button
            className="absolute top-3 right-3 font-normal"
            color="default"
            iconEnd={<StarRatingIcon className="size-3" />}
            size="sm"
          >
            {(simulator.rate.totalRate / simulator.rate.count).toFixed(1)}
          </Button>
        )}
        <img
          alt="simulator"
          className="w-full h-[240px] rounded-lg"
          src={fileAddress(simulator?.imageId)}
        />
      </div>
      <div className="pb-0 flex flex-col ">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <div className="bg-white shadow-md flex items-center justify-center rounded-full size-14 min-h-14 min-w-14">
              <img
                alt="simulator"
                className="max-w-[34px]"
                src={fileAddress(simulator?.organizationLogoId)}
                width={34}
              />
            </div>
            <div className="flex flex-col gap-1">
              <p className="font-bold text-md text-text-dark">{truncateText(simulator?.title, 20)}</p>
              <p>{simulator?.organizationName}</p>
            </div>
          </div>
          {!!simulator?.hashtags?.length && (
            <div className="flex flex-wrap gap-2 max-w-[300px] min-h-16 max-h-16 overflow-hidden">
              {simulator.hashtags.map((hashtag: { hashtagId: string; title: string }) => (
                <Hashtag
                  key={hashtag.hashtagId}
                  text={hashtag.title}
                />
              ))}
            </div>
          )}
        </div>
        <div className="w-full h-[1px] bg-background-50 mt-4" />
        <div className="flex items-center justify-between w-full pt-3 min-h-[40px] max-h-[40px]">
          <div className="flex items-center gap-2">
            <div className="bg-primary size-[6px] rounded-full" />
            <p className="text-xs text-text-light-25">{data.difficultyLevels.find((dl) => dl.code === simulator?.difficultyLevel)?.name}</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="bg-primary size-[6px] rounded-full" />
            <p className="text-xs text-text-light-25">{simulator?.totalTasksEstimatedHours} ساعت</p>
          </div>
          {simulator?.hasEmployment && (
            <div className="rounded-md py-1 px-2 flex items-center gap-2 bg-[#E9F5F1]">
              <CheckBoxIcon className="size-[18px] text-success" />
              <p className="text-success text-xs">جذب نیرو دارد</p>
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}

export default SimulatorCard
