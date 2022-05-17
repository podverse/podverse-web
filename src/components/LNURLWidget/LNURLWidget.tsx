import { useEffect } from 'react'
import { useCookies } from 'react-cookie'
import { PV } from '~/resources'
const { V4V_APP_NAME,
V4V_APP_RECIPIENT_CUSTOM_KEY,
V4V_APP_RECIPIENT_CUSTOM_VALUE,
V4V_APP_RECIPIENT_LN_ADDRESS,
V4V_APP_RECIPIENT_VALUE_DEFAULT,
V4V_RECIPIENT_VALUE_DEFAULT } = PV.Config

type Props = {
  serverCookies: any
}

export const LNURLWidget = ({ serverCookies }: Props) => {
  const [cookies, setCookie] = useCookies([])
    
  /*
    For the server-side render, we have to parse the object out of the string.
    For the client-side render, the cookie will already be parsed as an object.  
  */
  let parsedLNURLWidgetSettings = cookies.lnurlWidgetSettings
  if (!parsedLNURLWidgetSettings && serverCookies?.lnurlWidgetSettings) {
    try {
      parsedLNURLWidgetSettings = JSON.parse(serverCookies.lnurlWidgetSettings)
    } catch (error) {
      console.log('parsedLNURLWidgetSettings parse error:', error)
    }
  } else {
    parsedLNURLWidgetSettings = {}
  }
  const { acceptedTerms, defaultAppAmount, defaultContentCreatorAmount, defaultSenderName, rejectedTerms } = parsedLNURLWidgetSettings

  useEffect(() => {
    window.addEventListener("LNURL-Widget-Terms-Accepted", handleAcceptedTermsEvent);
    window.addEventListener("LNURL-Widget-Terms-Rejected", handleRejectTermsEvent);
    window.addEventListener("LNURL-Widget-New-Default-Values", handleDefaultValueChangedEvent);

    return () => {
      window.removeEventListener("LNURL-Widget-Terms-Accepted", handleAcceptedTermsEvent),
      window.removeEventListener("LNURL-Widget-Terms-Rejected", handleRejectTermsEvent),
      window.removeEventListener("LNURL-Widget-New-Default-Values", handleDefaultValueChangedEvent)
    };
  }, [])

  const handleAcceptedTermsEvent = () => {
    setCookie('lnurlWidgetSettings', {
      ...parsedLNURLWidgetSettings,
      acceptedTerms: 'true',
      rejectedTerms: 'false'
    })
  }

  const handleRejectTermsEvent = () => {
    setCookie('lnurlWidgetSettings', {
      ...parsedLNURLWidgetSettings,
      acceptedTerms: 'false',
      rejectedTerms: 'true'
    })
  }

  const handleDefaultValueChangedEvent = (event) => {
    const { defaultAppAmount, defaultContentCreatorAmount, defaultSenderName } = event.detail
    setCookie('lnurlWidgetSettings', {
      ...parsedLNURLWidgetSettings,
      defaultAppAmount,
      defaultContentCreatorAmount,
      defaultSenderName
    })
  }

  return (
    <lnurl-widget
      app_name={V4V_APP_NAME}
      app_recipient_custom_key={V4V_APP_RECIPIENT_CUSTOM_KEY}
      app_recipient_custom_value={V4V_APP_RECIPIENT_CUSTOM_VALUE}
      app_recipient_ln_address={V4V_APP_RECIPIENT_LN_ADDRESS}
      app_recipient_value_default={defaultAppAmount || V4V_APP_RECIPIENT_VALUE_DEFAULT}
      content_type='podcast'
      has_accepted_terms={acceptedTerms}
      has_rejected_terms={rejectedTerms}
      podcast_episode_title='add episode title'
      podcast_podcast_index_id={12345}
      podcast_title='add podcast title'
      recipient_value_default={defaultContentCreatorAmount || V4V_RECIPIENT_VALUE_DEFAULT}
      sender_name={defaultSenderName || ''} />
  )
}
