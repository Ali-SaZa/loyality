const Contact = () => {
  return (
    <div className="container py-16">
      <div className="mx-auto bg-primary-5/50 rounded-xl relative p-8 flex flex-col lg:flex-row items-center justify-evenly pt-32 lg:pt-8 lg:pr-36 text-center lg:text-right">
        <img
          alt="contact"
          className="absolute lg:right-0 lg:bottom-2 -top-24"
          height={193}
          src="/images/contact.webp"
          width={196}
        />
        <div className="flex flex-col pb-8 lg:pb-0">
          <p className="text-lg">سوال دارید؟</p>
          <p className="text-lg">در هر زمان با ما تماس بگیرید.</p>
        </div>
        <div className="flex flex-col gap-2 pb-8 lg:pb-0">
          <p className="text-lg text-text-light-25">تماس بگیرید</p>
          <a href="tel:09422010070,907">09422010070 - داخلی ۹۰۷</a>
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-lg text-text-light-25">پیام بدهید</p>
          <p className="text-lg text-text-dark">
            <a href="mailto:info@obs.ir">info@obs.ir</a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Contact
