import React from 'react'

import Button from '@/components/formElements/Button'
import ImageWithDetailCard from '@/components/card/ImageWithDetailCard'
import IntroHeader from '@/components/ui/IntroHeader'

const Interest = () => {
  return (
    <section>
      <IntroHeader url="/images/interest-header.jpeg">
        <div className="text-text-dark text-4xl font-bold leading-[4rem] md:leading-10">رغبت سنجی</div>
        <div className="text-text-dark text-xl align-text-center mt-6 mb-9">
          یکی از اشکالات اساسی در انتخاب شغل و رشته، مشخص نبودن دقیق علایق و توانمندی ما برای شغل های مختلف است که باعث سردرگمی در انتخاب
          مسیر شغلی می گردد.
        </div>
        <Button
          className="mt-6 md:mb-0 w-full md:w-fit"
          color="primary"
          size="lg"
        >
          شروع رغبت سنجی
        </Button>
      </IntroHeader>
      <div className="container py-12">
        <div className="text-center">
          <p className="text-text-dark leading-[56px] text-3xl font-bold mb-6">شناخت بهتر خود با آزمون هالند</p>
          <p className="text-lg leading-7 text-justify md:text-center">
            یکی از اشکالات اساسی در انتخاب شغل و رشته، مشخص نبودن دقیق علایق و توانمندی ما برای شغل های مختلف است که باعث سردرگمی در انتخاب
            مسیر شغلی می گردد. وجود تست های شغلی که بر مبنای روحیات ما، شغل مناسب را پیشنهاد دهد، بسیار ضروری است. لذا پلتفرم آی فایو، با
            هدف ارائه چراغ راهی مناسب به شما برای تشخیص مشاغلی که بیشتر با آنچه می پسندید و آنچه می خواهید همخوانی داشته باشد، آزمون هالند
            را به صورت رایگان در اختیارتان قرار داده و طی آن قادر خواهید بود خلاصه ای از آنچه تمایلات شخصیتان برای آینده شغلیتان تعریف می
            کند، در سه کلید واژه ی کلی دریافت نموده و در ادامه بر اساس این کلیدواژه ها، لیستی کامل از مشاغل در دسترس منطبق با این کلیدواژه
            ها، شبیه سازی های شغلی و همچنین دوره های آموزشی مرتبط با مشاغل منتخب خود را مشاهده نموده و نسبت به افزایش توانمندی های خود جهت
            ورود موفقیت آمیز به بازار، اهتمام ورزید.
          </p>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-12 container">
        <ImageWithDetailCard
          description="افرادی تحلیل گر، نقاد، کنجکاو، اهل استدلال و سازماندهی، ضعیف در متقاعد کردن دیگران"
          title="جستجوگر و محقق"
          url="/images/person6.png"
        />
        <ImageWithDetailCard
          description="افرادی واقع بین، پیگیر، وظیفه شناس، صرفه جو و علاقمند به جزئیات امور"
          title="متعارف و سنتی"
          url="/images/person5.png"
        />
        <ImageWithDetailCard
          description="افرادی مصر، جدی در کار، متواضع و به دنبال دستاوردهای عینی"
          title="واقع گرا"
          url="/images/person1.png"
        />
        <ImageWithDetailCard
          description="افرادی ماجراجو، بلندپرواز، مطمئن به خود، هیجان طلب، معاشرتی، ریسک پذیر خواهد بود."
          title="کارآفرینانه"
          url="/images/person4.png"
        />
        <ImageWithDetailCard
          description="افرادی مسول، صمیمی، سخاوتمند، همدل، خوش مشرب"
          title="اجتماعی"
          url="/images/person2.png"
        />
        <ImageWithDetailCard
          description="افرادی احساسی، نامرتب، آرمان گرا، خیال پرداز، ماهر در شناسایی و بیان خصوصیات، علاقمند به انجام کارهای پیچیده، نوآور و علاقمند به تجربه کردن"
          title="هنری"
          url="/images/person3.png"
        />
      </div>
      <div className="w-full mb-20 md:mb-36 mt-16 md:mt-32 flex justify-center">
        <Button size="lg">شروع رغبت سنجی</Button>
      </div>
    </section>
  )
}

export default Interest
