import { useTranslation } from 'react-i18next'
import { MainContentSection } from '..'

type Props = {
  chatIRCURL: string
}

// const keyPrefix = 'chat_room'

export const ChatRoom = ({ chatIRCURL }: Props) => {
  const { t } = useTranslation()

  /* Render Helpers */

  return (
    <div className='chat-room'>
      <MainContentSection headerText={t('Chat Room')}>
        <iframe
          title={t('Chat Room')}
          src={chatIRCURL}
          frameBorder='0'
          allowFullScreen
          sandbox='allow-same-origin allow-scripts allow-popups'
          style={{ height: '420px', width: '100%' }}
        />
      </MainContentSection>
    </div>
  )
}
