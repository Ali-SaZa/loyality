import React from "react";

import LogoContainer from "../ui/ObsLogo";
import PhoneIcon from "../icons/PhoneIcon";
import InstagramIcon from "../icons/InstagramIcon";
import LinkedInIcon from "../icons/LinkedInIcon";
import TelegramIcon from "../icons/TelegramIcon";

import Button from "@/components/formElements/Button";

const Footer = () => {
  return (
    <footer className="bg-primary py-5">
      <div className="container text-white">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-16 gap-y-8">
          <div className="flex flex-col gap-3 lg:gap-6 lg:col-span-2">
            <div className="border border-white bg-white/50 w-fit rounded-xl p-1">
              <LogoContainer />
            </div>
            <p className="text-justify">
              OBS پلتفرم توسعه منابع انسانی است که از طریق استانداردسازی، سیستم
              سازی و فرآیندسازی تخصصی مشاغل جاری در هر کسب و کار، ظرفیت جذابی
              جهت بهبود عملکرد نیروی انسانی فعلی سازمان ها و آموزش هدفمند
              نیروهای مشتاق به کار در کسب و کارهای بزرگ فراهم می سازد
            </p>
          </div>
          {/* <div className="grid grid-cols-2 gap-10">
            <div className="flex flex-col gap-6">
              <p className="font-bold text-lg">مسیر شغلی</p>
              <div className="flex flex-col gap-[7px]">
                <div className="flex items-center gap-2">
                  <div className="size-2 bg-white rounded-full"></div>
                  <p>رغبت سنجی</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="size-2 bg-white rounded-full"></div>
                  <p>شبیه ساز ها</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="size-2 bg-white rounded-full"></div>
                  <p>معرفی مشاغل</p>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-6">
              <p className="font-bold text-lg">مسیر مهارت آموزی</p>
              <div className="flex flex-col gap-[7px]">
                <div className="flex items-center gap-2">
                  <div className="size-2 bg-white rounded-full"></div>
                  <p>مهارت های شغلی</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="size-2 bg-white rounded-full"></div>
                  <p>مهارت های توسعه فردی</p>
                </div>
              </div>
            </div>
          </div> */}
          <div className="flex flex-col gap-3 lg:gap-6">
            <p className="font-bold text-lg">ارتباط با ما</p>
            <div className="flex flex-col gap-4">
              <p>
                شاهرود، بلوار دانشگاه، پارک علم و فناوری استان سمنان.مدیا پارک
                نیتک
              </p>
              <p>
                مشهد،خیابان امام خمینی،خیابان شهید تولایی،پارک فاوا، طبقه چهارم،
                مدیا پارک نیتک
              </p>
              <div className="flex items-center justify-between">
                <a href="tel:09422010070,907">
                  <Button
                    fullWidth
                    className="border-white text-white px-0"
                    iconStart={<PhoneIcon />}
                    variant="light"
                  >
                    09422010070 - داخلی ۹۰۷
                  </Button>
                </a>
                <div className="w-[1px] bg-white h-6" />
                <a className="text-end" href="mailto:info@obs.ir">
                  info@obs.ir
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center gap-6 pt-8">
          <div className="flex items-center gap-8">
            <Button
              iconOnly
              target="_blank"
              to="https://www.instagram.com/obsservice/"
              variant="light"
            >
              <InstagramIcon className="size-6 text-error" />
            </Button>
            <Button
              iconOnly
              target="_blank"
              to="https://www.linkedin.com/in/onlinebusinesssimulation"
              variant="light"
            >
              <LinkedInIcon />
            </Button>
            <Button
              iconOnly
              target="_blank"
              to="https://t.me/obs_hr"
              variant="light"
            >
              <TelegramIcon />
            </Button>
          </div>
          <p className="text-text-dark">
            &copy; {new Date().getFullYear()} تمامی حقوق متعلق به نیتک می باشد.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
