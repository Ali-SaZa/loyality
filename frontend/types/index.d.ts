type PropsWithParams = {
  params: Promise<{ id: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

type PaymentDetailType = {
  title: string
  value: string
}

interface UserSidebarRoute {
  title: string
  icon: (className?: string) => JSX.Element
  link: string
  isShortAccess: boolean
  disable?: boolean
  target?: string
  children?: UserSidebarRoute[]
}

interface ApiWithParams {
  filters?: {
    [key: string]: any
  }
  sort?: string
  page?: number
  pageSize?: number
}

type EvaluationDetailType = {
  jobSimulationTitle: string
  cost: number
}

type NextUiColorType = 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | undefined
