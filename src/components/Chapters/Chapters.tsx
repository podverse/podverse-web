import type { Episode, MediaRef } from 'podverse-shared'
import { useTranslation } from 'react-i18next'
import { ClipListItem } from '~/components'
import { MainContentSection } from '..'

type Props = {
  chapters: MediaRef[]
  episode: Episode
  isLoading?: boolean
}

const keyPrefix = 'chapters'

export const Chapters = ({ chapters, episode, isLoading }: Props) => {
  const { t } = useTranslation()

  /* Render Helpers */

  const generateChaptersListElements = () => {
    return chapters.map((listItem, index) => {
      listItem.episode = episode
      return <ClipListItem isChapter={true} key={`${keyPrefix}-${index}-${listItem?.id}`} mediaRef={listItem} />
    })
  }

  const chapterNodes = generateChaptersListElements()

  return (
    <div className='chapters'>
      <MainContentSection headerText={t('Chapters')} isLoading={isLoading}>
        {chapterNodes}
      </MainContentSection>
      <hr />
    </div>
  )
}
