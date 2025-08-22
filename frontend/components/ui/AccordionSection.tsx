import { Accordion, AccordionItem } from '@heroui/accordion'
import React from 'react'

const AccordionSection = ({
  title,
  children,
  defaultExpanded = false,
}: {
  title: string
  children: React.ReactNode
  defaultExpanded?: boolean
}) => {
  return (
    <Accordion
      defaultExpandedKeys={defaultExpanded ? ['1'] : []}
      itemClasses={{ base: 'py-[3px] px-4 shadow-sm', content: 'py-4 px-0 md:px-4' }}
      variant="splitted"
    >
      <AccordionItem
        key="1"
        aria-label={title}
        classNames={{ title: 'data-[open=true]:font-semibold' }}
        title={title}
      >
        {children}
      </AccordionItem>
    </Accordion>
  )
}

export default AccordionSection
