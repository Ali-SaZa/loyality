import Link from "next/link";

import LogoContainer from "../ui/ObsLogo";
import PhoneIcon from "../icons/PhoneIcon";
import InstagramIcon from "../icons/InstagramIcon";
import LinkedInIcon from "../icons/LinkedInIcon";
import TelegramIcon from "../icons/TelegramIcon";
import { BLOG_POSTS } from "@/lib/blog";
import companyInfo from "@/data/company-info.json";

import Button from "@/components/formElements/Button";

const Footer = () => {
  return (
    <footer className="bg-primary py-5">
      <div className="container text-white mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="col-span-1">
            <div className="border border-white bg-white/50 w-fit rounded-xl p-1">
              <LogoContainer />
            </div>
            <p className="text-justify mt-4">
              مانا - سیستم مدیریت وفاداری مشتریان برای فروشگاه‌ها و کسب و کارهای
              ایرانی. ایجاد کوپن تخفیف، مدیریت مشتریان و افزایش فروش با تکنولوژی
              پیشرفته.
            </p>
          </div>
          <div className="col-span-1 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="col-span-1 flex flex-col gap-6">
              <h6 className="font-bold text-lg">ارتباط با ما</h6>
              <div className="flex flex-col gap-4">
                <p>مشهد، خیابان امام خمینی، پارک علم و فناوری نیتک طبقه۴</p>
                <div className="flex items-center justify-between">
                  <a
                    href={`tel:${companyInfo.contactUs.phone.primary.replace(/-/g, "")}`}
                  >
                    <Button
                      fullWidth
                      className="border-white text-white px-0"
                      iconStart={<PhoneIcon />}
                      variant="light"
                    >
                      {companyInfo.contactUs.phone.primary}
                    </Button>
                  </a>
                </div>
              </div>
            </div>
            <div className="col-span-1 flex flex-col gap-6">
              <h6 className="font-bold text-lg">مقالات برتر</h6>
              <div className="flex flex-col gap-2">
                {BLOG_POSTS.slice(0, 3).map((post) => (
                  <div key={post.id} className="flex items-center gap-2">
                    <div className="size-2 bg-white rounded-full"></div>
                    <Link
                      href={`/blog/${post.slug}`}
                      className="hover:text-blue-200 transition-colors text-sm truncate"
                    >
                      {post.title}
                    </Link>
                  </div>
                ))}
              </div>
            </div>
            <div className="col-span-1 flex flex-col gap-6">
              <h6 className="font-bold text-lg">لینک‌های سریع</h6>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <div className="size-2 bg-white rounded-full"></div>
                  <Link
                    href="/"
                    className="hover:text-blue-200 transition-colors"
                  >
                    خانه
                  </Link>
                </div>
                <div className="flex items-center gap-2">
                  <div className="size-2 bg-white rounded-full"></div>
                  <Link
                    href="/blog"
                    className="hover:text-blue-200 transition-colors"
                  >
                    بلاگ
                  </Link>
                </div>
                <div className="flex items-center gap-2">
                  <div className="size-2 bg-white rounded-full"></div>
                  <Link
                    href="/auth"
                    className="hover:text-blue-200 transition-colors"
                  >
                    ورود
                  </Link>
                </div>
                <div className="flex items-center gap-2">
                  <div className="size-2 bg-white rounded-full"></div>
                  <Link
                    href="/about-us"
                    className="hover:text-blue-200 transition-colors"
                  >
                    درباره ما
                  </Link>
                </div>
                <div className="flex items-center gap-2">
                  <div className="size-2 bg-white rounded-full"></div>
                  <Link
                    href="/contact-us"
                    className="hover:text-blue-200 transition-colors"
                  >
                    تماس با ما
                  </Link>
                </div>
                <div className="flex items-center gap-2">
                  <div className="size-2 bg-white rounded-full"></div>
                  <Link
                    href="/questions"
                    className="hover:text-blue-200 transition-colors"
                  >
                    سوالات متداول
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center gap-6 pt-8">
          <div className="flex items-center gap-8">
            <Button
              iconOnly
              target="_blank"
              to={companyInfo.contactUs.socialMedia.instagram}
              variant="light"
            >
              <InstagramIcon className="size-6 text-error" />
            </Button>
            <Button
              iconOnly
              target="_blank"
              to={companyInfo.contactUs.socialMedia.linkedin}
              variant="light"
            >
              <LinkedInIcon />
            </Button>
            <Button
              iconOnly
              target="_blank"
              to={companyInfo.contactUs.socialMedia.telegram}
              variant="light"
            >
              <TelegramIcon />
            </Button>
          </div>
          <p className="text-text-dark">
            &copy; {new Date().getFullYear()} تمامی حقوق متعلق به مانا می باشد.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
