import { useTranslation } from 'react-i18next'
import { MainContentSection } from '..'

type Props = {
  chatIRCURL: string
}

// const keyPrefix = 'chat_room'

const converseJSDuckTypePath = '/plugins/livechat/router/webchat/room'

const overrideIframeStyles = (url: string) => {
  if (url.indexOf(converseJSDuckTypePath) > 0) {
    url = `${url}?_ac_mainForeground=%23ffffff&_ac_mainBackground=%23030626&_ac_greyForeground=%23cccccc&_ac_greyBackground=%23333333&_ac_menuForeground=%23fff&_ac_menuBackground=%23000&_ac_inputForeground=%23ffffff&_ac_inputBackground=%23333333&_ac_buttonForeground=rgb%28255%2C+255%2C+255%29&_ac_buttonBackground=hsl%28210%2C%2099%25%2C%2062%25%29&_ac_link=%2374a8dc&_ac_linkHover=%2349a4ff`
  }

  return url
}

export const ChatRoom = ({ chatIRCURL }: Props) => {
  const { t } = useTranslation()

  /* Render Helpers */

  const iframeSrc = overrideIframeStyles(chatIRCURL)

  return (
    <div className='chat-room'>
      <MainContentSection headerText={t('Chat Room')}>
        <iframe
          title={t('Chat Room')}
          src={iframeSrc}
          frameBorder='0'
          sandbox='allow-same-origin allow-scripts allow-popups allow-forms'
          style={{ height: '600px', width: '100%' }}
        />
      </MainContentSection>
    </div>
  )
}
