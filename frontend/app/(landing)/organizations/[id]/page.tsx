'use client'
import React, { use, useEffect, useState } from 'react'
import { SwiperSlide } from 'swiper/react'
import dynamic from 'next/dynamic'

import Button from '@/components/formElements/Button'
import Swiper from '@/components/ui/Swiper'
import VideoPlayer from '@/components/media/VideoPlayer'
import HomeLocationIcon from '@/components/icons/HomeLocationIcon'
import InstagramIcon from '@/components/icons/InstagramIcon'
import LinkedInIcon from '@/components/icons/LinkedInIcon'
import PhoneIcon from '@/components/icons/PhoneIcon'
import TelegramIcon from '@/components/icons/TelegramIcon'
import SimulatorCard from '@/components/card/SimulatorCard'
import IntroHeader from '@/components/ui/IntroHeader'
import useLoading from '@/hooks/useLoading'
import useWindowSize from '@/hooks/useWindowSize'
import { GET_ALL_SIMULATIONS } from '@/services/simulations'
import { GET_ORGANIZATION_BY_ID } from '@/services/organizations'
import { fileAddress } from '@/helpers'
import HtmlRenderer from '@/components/utils/HtmlRenderer'
import FacebookIcon from '@/components/icons/FacebookIcon'
import { PropsWithParams } from '@/types'

const Map = dynamic(() => import('@/components/utils/Map'), { ssr: false })

const OrganizationDetail = ({ params: promisedParams }: PropsWithParams) => {
  const params = use(promisedParams)
  const [simulators, setSimulators] = useState<any>([])
  const [organization, setOrganization] = useState<any>(null)
  const { setLoading } = useLoading()
  const { width } = useWindowSize()

  const fetchSimulations = async () => {
    try {
      setLoading(true)
      const response = await GET_ALL_SIMULATIONS({
        filters: {
          organizationId: params.id,
        },
      })

      setSimulators(response.data.data)
    } catch (error) {
      console.log('error', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchOrganization = async () => {
    try {
      setLoading(true)
      const response = await GET_ORGANIZATION_BY_ID(params.id)

      setOrganization(response.data)
    } catch (error) {
      console.log('error', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrganization()
    fetchSimulations()
  }, [])

  return (
    <section className="mb-10">
      <IntroHeader
        className="!text-right"
        customGradient="bg-[linear-gradient(180deg,rgba(106,106,106,0.5)0%,rgba(0,0,0,0.8)100%)]"
        url={fileAddress(organization?.introductionImageId)}
      >
        <div className="flex flex-col gap-4 md:flex-row">
          <div className="flex gap-4">
            <img
              alt="business logo"
              src={fileAddress(organization?.logoId)}
              width={width < 768 ? 60 : 120}
            />
            <div className="flex flex-col justify-between text-white">
              <p className="font-bold text-2xl md:text-3xl leading-[32px] md:leading-[32px]">{organization?.organizationName}</p>
              {!!organization?.websiteUrl && (
                <a
                  className="cursor-pointer text-medium md:text-lg leading-6 md:leading-7 my-2"
                  href={organization?.websiteUrl}
                  rel="noopener noreferrer"
                  target="_blank"
                  onClick={(e) => e.stopPropagation()} // جلوگیری از کلیک روی کارت
                >
                  {organization?.websiteUrl}
                </a>
              )}
              <div className="hidden md:flex flex-row items-center gap-6">
                {!!organization?.jobCategories?.length && (
                  <div className="flex items-center flex-wrap gap-2">
                    {organization?.jobCategories?.map((item: any) => (
                      <Button
                        key={item?.id}
                        className="text-sm leading-5"
                        size="sm"
                      >
                        {item?.title}
                      </Button>
                    ))}
                  </div>
                )}
                <div className="flex items-center gap-5">
                  <p>تاسیس در {organization?.establishmentYear}</p>
                  <p>{organization?.employeeCount} نفر</p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex md:hidden flex-col gap-6 text-white">
            {!!organization?.jobCategories?.length && (
              <div className="flex items-center flex-wrap gap-2">
                {organization?.jobCategories?.map((item: any) => (
                  <Button
                    key={item?.id}
                    className="text-sm leading-5"
                    size="sm"
                  >
                    {item?.title}
                  </Button>
                ))}
              </div>
            )}
            <div className="flex items-center gap-5">
              <p>تاسیس در {organization?.establishmentYear}</p>
              <p>{organization?.employeeCount} نفر</p>
            </div>
          </div>
        </div>
      </IntroHeader>
      <div className="container py-12">
        <div className="bg-background-10 py-6 px-8 flex flex-col justify-center items-center gap-6 rounded-xl">
          <p className="text-text-dark font-bold md:font-medium text-xl leading-8 md:text-2xl">معرفی {organization?.organizationName}</p>
          <HtmlRenderer htmlContent={organization?.description} />
        </div>
      </div>
      {!!simulators.length && (
        <div className="bg-background-primary py-6">
          <div className="container">
            <div className="flex flex-col items-center gap-6">
              <p className="font-semibold text-text-dark text-xl leading-8 md:text-3xl md:leading-[40px]">شبیه ساز ها</p>
              <div className="w-full">
                <Swiper>
                  {simulators.map((simulator: any) => (
                    <SwiperSlide key={simulator!.id}>
                      <SimulatorCard simulator={simulator} />
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            </div>
          </div>
        </div>
      )}
      {((!!organization?.officeContact?.location?.lat && !!organization?.officeContact?.location?.lng) ||
        !!organization?.officeContact?.tel ||
        !!organization?.officeContact?.address ||
        !!organization?.socialNetworks?.length) && (
        <div className="container py-16">
          <div className="flex flex-col items-center gap-6">
            <p className="font-semibold text-text-dark text-xl leading-8 md:text-3xl md:leading-[40px]">ارتباط با شرکت</p>
            <div className="flex flex-col rounded-xl shadow-xl w-full h-full">
              {!!organization?.officeContact?.location?.lat && !!organization?.officeContact?.location?.lng && (
                <Map
                  center={[organization?.officeContact?.location?.lat, organization?.officeContact?.location?.lng]}
                  className="!h-[319px] rounded-tr-xl rounded-tl-xl"
                  popup={organization?.organizationName}
                  zoom={15}
                />
              )}
              {(!!organization?.officeContact?.tel || !!organization?.officeContact?.address || !!organization?.socialNetworks?.length) && (
                <div className="flex flex-col gap-6 p-6 bg-background-primary rounded-br-xl rounded-bl-xl">
                  {(!!organization?.officeContact?.tel || !!organization?.officeContact?.address) && (
                    <div className="flex flex-col md:flex-row justify-evenly gap-5">
                      {!!organization?.officeContact?.tel && (
                        <div className="flex gap-3 items-center">
                          <PhoneIcon color="#494949" />
                          <p>{organization?.officeContact?.tel}</p>
                        </div>
                      )}
                      {!!organization?.officeContact?.address && (
                        <div className="flex gap-3 items-center">
                          <HomeLocationIcon className="size-6 text-text" />
                          <p>{organization?.officeContact?.address}</p>
                        </div>
                      )}
                    </div>
                  )}
                  {!!organization?.socialNetworks?.length && (
                    <div className="flex items-center gap-8 mx-auto">
                      {organization?.socialNetworks?.map((item: any, index: number) => (
                        <Button
                          key={index}
                          iconOnly
                          target="_blank"
                          to={item.address}
                          variant="light"
                        >
                          {item.type === 'instagram' && <InstagramIcon className="size-6 text-error" />}
                          {item.type === 'linkedin' && <LinkedInIcon />}
                          {item.type === 'telegram' && <TelegramIcon />}
                          {item.type === 'facebook' && <FacebookIcon />}
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      {!!organization?.introductionVideoId && (
        <div className="container py-16">
          <div className="flex flex-col items-center gap-6">
            <p className="font-bold text-text-dark text-3xl leading-[40px]">ویدیو معرفی شرکت</p>
            <VideoPlayer videoId={organization?.introductionVideoId} />
          </div>
        </div>
      )}
    </section>
  )
}

export default OrganizationDetail
