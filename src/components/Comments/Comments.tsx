import { useTranslation } from 'react-i18next'
import { MainContentSection } from '..'

type Props = {
  comments: any[]
  platform: string
}

export const Comments = ({ comments, platform }: Props) => {
  const { t } = useTranslation()

  console.log('asdf', comments, platform)

  return (
    <div className='comments'>
      <MainContentSection headerText={t('Comments')}>
        hello world
      </MainContentSection>
      <hr />
    </div>
  )
}
