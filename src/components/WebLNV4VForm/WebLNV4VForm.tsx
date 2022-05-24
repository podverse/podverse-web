import { faSpinner } from '@fortawesome/free-solid-svg-icons'
import dynamic from 'next/dynamic'
import type { Episode, Podcast, ValueTag } from 'podverse-shared'
import { useEffect, useState } from 'react'
import { useCookies } from 'react-cookie'
import { Icon } from '~/components'
import { PV } from '~/resources'
const {
  V4V_APP_NAME,
  V4V_APP_RECIPIENT_CUSTOM_KEY,
  V4V_APP_RECIPIENT_CUSTOM_VALUE,
  V4V_APP_RECIPIENT_LN_ADDRESS,
  V4V_APP_RECIPIENT_VALUE_DEFAULT,
  V4V_RECIPIENT_VALUE_DEFAULT
} = PV.Config

type Props = {
  episode?: Episode
  podcast: Podcast
  serverCookies: any
  valueTag: ValueTag
}

const WebLNV4VFormNoSSR = ({ episode, podcast, serverCookies, valueTag }: Props) => {
  const [cookies, setCookie] = useCookies([])
  const [isLoading, setIsLoading] = useState<boolean>(true)

  /*
    For the server-side render, we have to parse the object out of the string.
    For the client-side render, the cookie will already be parsed as an object.  
  */
  let parsedWebLNV4VFormSettings = cookies.weblnV4VSettings
  if (!parsedWebLNV4VFormSettings && serverCookies?.weblnV4VSettings) {
    try {
      parsedWebLNV4VFormSettings = JSON.parse(serverCookies.weblnV4VSettings)
    } catch (error) {
      parsedWebLNV4VFormSettings = {}
      console.log('parsedWebLNV4VFormSettings parse error:', error)
    }
  }
  const { acceptedTerms, defaultAppAmount, defaultContentCreatorAmount, defaultSenderName, rejectedTerms } =
    parsedWebLNV4VFormSettings || {}

  useEffect(() => {
    window.addEventListener('WebLN-V4V-Has-Loaded', handleHasLoaded)
    window.addEventListener('WebLN-V4V-Terms-Accepted', handleAcceptedTermsEvent)
    window.addEventListener('WebLN-V4V-Terms-Rejected', handleRejectTermsEvent)
    window.addEventListener('WebLN-V4V-New-Default-Values', handleDefaultValueChangedEvent)

    return () => {
      window.removeEventListener('WebLN-V4V-Has-Loaded', handleHasLoaded),
        window.removeEventListener('WebLN-V4V-Terms-Accepted', handleAcceptedTermsEvent),
        window.removeEventListener('WebLN-V4V-Terms-Rejected', handleRejectTermsEvent),
        window.removeEventListener('WebLN-V4V-New-Default-Values', handleDefaultValueChangedEvent)
    }
  }, [])

  const handleHasLoaded = () => {
    setIsLoading(false)
  }

  const handleAcceptedTermsEvent = () => {
    const { weblnV4VSettings } = cookies
    setCookie(
      'weblnV4VSettings',
      {
        ...weblnV4VSettings,
        acceptedTerms: 'true',
        rejectedTerms: 'false'
      },
      { path: PV.Cookies.path }
    )
  }

  const handleRejectTermsEvent = () => {
    const { weblnV4VSettings } = cookies
    setCookie(
      'weblnV4VSettings',
      {
        ...weblnV4VSettings,
        acceptedTerms: 'false',
        rejectedTerms: 'true'
      },
      { path: PV.Cookies.path }
    )
  }

  const handleDefaultValueChangedEvent = (event) => {
    const { weblnV4VSettings } = cookies
    const { defaultAppAmount, defaultContentCreatorAmount, defaultSenderName } = event.detail
    setCookie(
      'weblnV4VSettings',
      {
        ...weblnV4VSettings,
        defaultAppAmount,
        defaultContentCreatorAmount,
        defaultSenderName
      },
      { path: PV.Cookies.path }
    )
  }

  return (
    <div className='webln-v4v-wrapper'>
      {isLoading && (
        <div className='loading-wrapper'>
          <Icon faIcon={faSpinner} spin />
        </div>
      )}
      <div className={`${isLoading ? 'display-none' : ''}`}>
        <webln-v4v
          app_name={V4V_APP_NAME}
          app_recipient_custom_key={V4V_APP_RECIPIENT_CUSTOM_KEY}
          app_recipient_custom_value={V4V_APP_RECIPIENT_CUSTOM_VALUE}
          app_recipient_ln_address={V4V_APP_RECIPIENT_LN_ADDRESS}
          app_recipient_value_default={defaultAppAmount || V4V_APP_RECIPIENT_VALUE_DEFAULT}
          content_type='podcast'
          episode_guid={episode?.guid}
          episode_title={episode?.title}
          has_accepted_terms={acceptedTerms}
          has_rejected_terms={rejectedTerms}
          podcast_podcast_index_id={podcast.podcastIndexId}
          podcast_title={podcast.title}
          recipient_value_default={defaultContentCreatorAmount || V4V_RECIPIENT_VALUE_DEFAULT}
          sender_name={defaultSenderName || ''}
          v4v_tag={JSON.stringify(valueTag)}
        />
      </div>
    </div>
  )
}

export const WebLNV4VForm: any = dynamic(() => Promise.resolve(WebLNV4VFormNoSSR), {
  ssr: false
})
