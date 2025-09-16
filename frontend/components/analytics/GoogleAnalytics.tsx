import Script from 'next/script';
import { GA_TRACKING_ID, GA_ENABLED, APP_NAME, STREAM_URL } from '@/config/env';

export default function GoogleAnalytics() {
  if (!GA_ENABLED || !GA_TRACKING_ID) {
    return null;
  }

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_TRACKING_ID}', {
              page_path: window.location.pathname,
              app_name: '${APP_NAME}',
              stream_url: '${STREAM_URL}',
              custom_map: {
                'custom_parameter_1': 'user_role',
                'custom_parameter_2': 'store_id',
                'custom_parameter_3': 'customer_id',
                'custom_parameter_4': 'app_name'
              }
            });
          `,
        }}
      />
    </>
  );
}
