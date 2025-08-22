import { useCallback } from 'react'
import jalaali from 'jalaali-js'
import dayjs from 'dayjs'
import toast from 'react-hot-toast'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import ReactDOMServer from 'react-dom/server'

import { FILE_SERVER_URL } from '@/config/env'

export const truncateText = (text: string, maxLength: number = 100) => {
  if (text.length > maxLength) {
    return text.substring(0, maxLength) + '...'
  }

  return text
}

export const convertPersianToEnglish = (str: string): string => {
  const persianNumbers = [/۰/g, /۱/g, /۲/g, /۳/g, /۴/g, /۵/g, /۶/g, /۷/g, /۸/g, /۹/g]
  const englishNumbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']

  return persianNumbers.reduce((acc, persianNum, index) => acc.replace(persianNum, englishNumbers[index]), str)
}

export const getFullName = (firstName: string, lastName: string) => {
  return firstName + ' ' + lastName
}

export const fileAddress = (fileId: string, fileName: string = 'image') => {
  if (fileId && fileId !== '000000000000000000000000') return FILE_SERVER_URL + '/' + fileId + `/${fileName}`
  else return '/images/placeholders/image.png'
}

export const isValidMongoId = (id: string) => {
  const mongoIdPattern = /^[0-9a-fA-F]{24}$/

  return mongoIdPattern.test(id)
}

let timer: NodeJS.Timeout

export const debounce = (func: Function, delay: number) => {
  return useCallback(
    (...args: any[]) => {
      clearTimeout(timer)
      timer = setTimeout(() => {
        func(...args)
      }, delay)
    },
    [func, delay]
  )
}

export const generateRandomColor = (): string => {
  const letters = '0123456789ABCDEF'
  let color = '#'

  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)]
  }

  return color
}

export const isEmptyObject = (obj: object) => Object.keys(obj).length === 0

export const handleDownload = async (fileId: string, fileName: string, isUrl: boolean = false) => {
  try {
    // دریافت آدرس فایل
    const fileUrl = isUrl ? fileId : fileAddress(fileId, fileName)

    // درخواست فایل با fetch
    const response = await fetch(fileUrl)

    // بررسی پاسخ سرور
    if (!response.ok) {
      throw new Error('فایل قابل دانلود نیست.')
    }

    // دریافت blob فایل
    const blob = await response.blob()

    // دریافت نام فایل از هدر (اگر موجود باشد)
    let fileNameFromHeader = response.headers.get('X-File-Name')

    if (fileNameFromHeader) {
      fileNameFromHeader = decodeURIComponent(fileNameFromHeader)
    }
    const finalFileName = fileNameFromHeader || fileName

    // ایجاد لینک دانلود
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)

    link.href = url
    link.setAttribute('download', finalFileName) // تنظیم نام فایل دانلود شده
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    // پاکسازی آدرس موقت
    URL.revokeObjectURL(url)
  } catch (error) {
    console.error('خطا در دانلود فایل:', error)
    toast.error('خطا در دانلود فایل')
  }
}

export const handleDownloadPdf = async (component: React.ReactNode, title: string, orientation: 'landscape' | 'portrait' = 'landscape') => {
  // تبدیل کامپوننت به HTML استاتیک
  const htmlString = ReactDOMServer.renderToStaticMarkup(component)

  // ایجاد یک کانتینر مخفی در DOM
  const container = document.createElement('div')

  container.style.position = 'absolute'
  container.style.top = '-9999px' // خارج از دید
  container.style.left = '-9999px'
  container.innerHTML = htmlString
  document.body.appendChild(container)

  try {
    // استفاده از html2canvas برای رندر
    const canvas = await html2canvas(container, { scale: 1, useCORS: true })
    const data = canvas.toDataURL('image/jpg')

    // ساخت PDF
    const pdf = new jsPDF({
      orientation,
      unit: 'px',
      format: 'a4',
    })

    const imgProperties = pdf.getImageProperties(data)
    const pdfWidth = pdf.internal.pageSize.getWidth()
    const pdfHeight = (imgProperties.height * pdfWidth) / imgProperties.width

    pdf.addImage(data, 'JPG', 0, 0, pdfWidth, pdfHeight)
    pdf.save(`${title}.pdf`)
  } finally {
    // حذف کانتینر از DOM
    document.body.removeChild(container)
  }
}

export const removeEmptyFields = (obj: Record<string, any>): Record<string, any> => {
  return Object.entries(obj).reduce(
    (acc, [key, value]) => {
      if (
        value !== '' && // فیلد خالی رشته‌ای
        value !== null && // مقدار null
        value !== undefined && // مقدار undefined
        (!(typeof value === 'object' && !Array.isArray(value)) || Object.keys(value).length) // بررسی آبجکت‌های خالی
      ) {
        acc[key] =
          typeof value === 'object' && !Array.isArray(value)
            ? removeEmptyFields(value) // بازگشت برای آبجکت‌های تو در تو
            : value
      }

      return acc
    },
    {} as Record<string, any>
  )
}

export const convertToDateString = (dateString: string): string => {
  const date = dayjs(dateString) // تبدیل رشته تاریخ به dayjs

  if (date.year() === 1) return 'نا مشخص'
  const jalaaliDate = jalaali.toJalaali(date.year(), date.month() + 1, date.date()) // تبدیل تاریخ به جلالی

  // فرمت yyyy/mm/dd
  return `${jalaaliDate.jy}/${String(jalaaliDate.jm).padStart(2, '0')}/${String(jalaaliDate.jd).padStart(2, '0')}`
}

// تابع برای تبدیل dateObject جلالی به فرمت میلادی مورد نظر
export const convertToISOFormat = (dateObject: any) => {
  try {
    // استخراج سال، ماه و روز از dateObject
    const { year, month, day, hour, minute, second } = dateObject

    // تبدیل تاریخ جلالی به میلادی
    const { gy, gm, gd } = jalaali.toGregorian(year, month, day)

    // ساختن یک شیء Date با زمان میلادی
    const date = dayjs(new Date(gy, gm - 1, gd, hour || 0, minute || 0, second || 0))

    // تبدیل به فرمت ISO مورد نظر
    return date.format('YYYY-MM-DDTHH:mm:ss.SSSZ')
  } catch (e) {
    console.log(e)
  }
}

export const getTimeFromDateString = (dateString: string) => {
  return {
    hour: dateString.split('T')[1].split(':')[0],
    minute: dateString.split('T')[1].split(':')[1],
    second: dateString.split('T')[1].split(':')[2].split('.')[0],
  }
}

export const formatDateToCustomTimezone = (date: Date, timezoneOffset = 210): string => {
  const localDate = new Date(date.getTime() + timezoneOffset * 60 * 1000)

  // سال، ماه و روز
  const year = localDate.getUTCFullYear()
  const month = String(localDate.getUTCMonth() + 1).padStart(2, '0') // ماه به صورت 2 رقمی
  const day = String(localDate.getUTCDate()).padStart(2, '0') // روز به صورت 2 رقمی

  // ساعت، دقیقه و ثانیه
  const hours = String(localDate.getUTCHours()).padStart(2, '0')
  const minutes = String(localDate.getUTCMinutes()).padStart(2, '0')
  const seconds = String(localDate.getUTCSeconds()).padStart(2, '0')

  // فرمت ناحیه زمانی
  const offsetHours = Math.floor(Math.abs(timezoneOffset) / 60)
  const offsetMinutes = Math.abs(timezoneOffset) % 60
  const sign = timezoneOffset >= 0 ? '+' : '-'
  const timezone = `${sign}${String(offsetHours).padStart(2, '0')}:${String(offsetMinutes).padStart(2, '0')}`

  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.000${timezone}`
}

// const gregorianDate = (jalaliDate: string) => moment(jalaliDate, 'jYYYY-jMM-jDDTHH:mm:ss.SSSZ').format('YYYY-MM-DDTHH:mm:ss.SSSZ')
// const gregorianDate = (jalaliDate: string) => {
//   const [datePart, timePart] = jalaliDate.split('T')
//   const [year, month, day] = datePart.split('-').map(Number)
//   const { gy, gm, gd } = toGregorian(year, month, day)
//
//   // تبدیل و فرمت تاریخ به همراه زمان
//   return dayjs(`${gy}-${gm}-${gd}T${timePart}`).format('YYYY-MM-DDTHH:mm:ss.SSSZ')
// }

export const getMediaType = (filePath: string | undefined | null): string | null => {
  if (!filePath) return null
  const fileExtension = filePath.split('.').pop()?.toLowerCase()

  if (!fileExtension) return null
  const imageExtensions = ['png', 'jpeg', 'jpg', 'gif', 'bmp', 'tiff', 'svg', 'webp']
  const videoExtensions = ['mp4', 'mov', 'avi', 'mkv', 'webm', 'flv', 'wmv', 'm3u8']
  const audioExtensions = ['mp3', 'wav', 'aac', 'flac', 'ogg', 'm4a', 'wma', 'alac']

  if (imageExtensions.includes(fileExtension)) {
    return 'Image'
  }
  if (videoExtensions.includes(fileExtension)) {
    return 'Video'
  }
  if (audioExtensions.includes(fileExtension)) {
    return 'Audio'
  }

  return 'Other'
}
