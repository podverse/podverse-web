import { PageHeaderTab } from '~/components'

type Props = {
  keyPrefix: string
  onClick: any
  selectedKey: string
  tabOptions: any[]
  title: string
}

export const PageHeaderWithTabs = ({ keyPrefix, onClick, selectedKey, tabOptions, title }: Props) => {
  const tabs = generateTabElements(tabOptions, onClick, selectedKey, keyPrefix)
  return (
    <>
      <div className='page-header-tabs'>
        <div className='main-max-width'>
          <h1 tabIndex={0}>{title}</h1>
          <div className='tab-wrapper'>{tabs}</div>
        </div>
      </div>
      <hr aria-hidden='true' />
    </>
  )
}

const generateTabElements = (tabs: any[], onClick: any, selectedKey: string, keyPrefix: string) => {
  return tabs.map((tab, index) => (
    <PageHeaderTab
      isActive={tab.key === selectedKey}
      key={`${keyPrefix}-${index}`}
      label={tab.label}
      onClick={() => onClick(tab.key)}
    />
  ))
}
