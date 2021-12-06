import { faSpinner } from '@fortawesome/free-solid-svg-icons'
import { useOmniAural } from 'omniaural'
import { Icon } from '~/components'

type Props = {}

export const PageLoadingOverlay = (props: Props) => {
  const [isLoading] = useOmniAural('page.isLoading')
  return (
    <>
      {isLoading && (
        <div className='page-loading-overlay'>
          <Icon faIcon={faSpinner} spin />
        </div>
      )}
    </>
  )
}
