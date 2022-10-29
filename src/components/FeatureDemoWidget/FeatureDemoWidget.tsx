import { PVLink } from '~/components'

type Props = {
  centered?: boolean
  marginTopExtra?: boolean
  tutorialsLink?: string
  tutorialsLinkText: string
}

export const FeatureDemoWidget = ({ centered, marginTopExtra, tutorialsLink, tutorialsLinkText }: Props) => {
  let className = marginTopExtra ? `feature-demo-widget margin-top-extra` : 'feature-demo-widget'
  className = centered ? `${className} align-center` : className
  return (
    <div className={className}>
      <PVLink className='tutorials-link link' href={tutorialsLink}>
        {tutorialsLinkText}
      </PVLink>
    </div>
  )
}
