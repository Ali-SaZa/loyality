'use client'
import { BreadcrumbItem, Breadcrumbs } from '@nextui-org/breadcrumbs'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

import AngleLeftIcon from '@/components/icons/AngleLeftIcon'
import { siteConfig } from '@/config/site'
import { isValidMongoId } from '@/helpers'
import useGlobal from '@/hooks/useGlobal'

interface Breadcrumb {
  title: string
  link: string
}

const BreadcrumbSection = () => {
  const [breadcrumbs, setBreadcrumbs] = useState<Breadcrumb[]>([])
  const { activeRoute } = useGlobal()
  const pathname = usePathname()

  useEffect(() => {
    const activeParentRoute = siteConfig.userSidebar.find((item) => item.link.includes(pathname.split('/')[2]))

    setBreadcrumbs(getTitles(activeParentRoute ? activeParentRoute : activeRoute))
  }, [pathname])

  const getTitles = (data: UserSidebarRoute): Breadcrumb[] => {
    const titles: Breadcrumb[] = []

    const recursive = (node: UserSidebarRoute) => {
      const splitedNodeLink = node.link.split('/')
      const lastLink = splitedNodeLink[splitedNodeLink.length - 1]
      const splitedPathLink = pathname.split('/')
      const lastPath = splitedPathLink[splitedPathLink.length - 1]

      titles.push({
        title: node.title,
        link: lastLink === ':id' ? splitedPathLink.slice(0, splitedNodeLink.indexOf(lastLink) + 1).join('/') : node.link,
      })

      if (lastLink === lastPath || (lastLink === ':id' && isValidMongoId(lastPath))) return

      if (node.children) {
        node.children.forEach((child) => {
          recursive(child)
        })
      }
    }

    recursive(data)

    return titles
  }

  return (
    <Breadcrumbs
      classNames={{
        base: 'hidden md:block',
        list: 'px-9 py-[10px] bg-background-primary rounded-none  ',
      }}
      itemClasses={{
        item: 'data-[current=true]:text-primary data-[current=true]:font-bold',
      }}
      separator={<AngleLeftIcon />}
      underline="active"
    >
      {breadcrumbs.map((breadcrumb, index) => (
        <BreadcrumbItem
          key={index}
          href={breadcrumb.link}
          isCurrent={index === breadcrumbs.length - 1}
        >
          {breadcrumb.title}
        </BreadcrumbItem>
      ))}
    </Breadcrumbs>
  )
}

export default BreadcrumbSection
