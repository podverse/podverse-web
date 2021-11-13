import { useTranslation } from 'react-i18next'
import ShowMoreText from 'react-show-more-text'
import sanitizeHtml from 'sanitize-html'
import striptags from 'striptags'

type Props = {
  dangerouslySetInnerHtml?: boolean
  lines: number
  text: string
}

export const TruncatedText = ({ dangerouslySetInnerHtml = false, lines, text }: Props) => {
  const { t } = useTranslation()

  return (
    <ShowMoreText
      className='truncated-text'
      less={t('Show Less')}
      lines={lines}
      more={t('Show More')}>
        {
          dangerouslySetInnerHtml && (
            <div
              
              dangerouslySetInnerHTML={
                {
                  __html: sanitizeTruncatedTextHtml(text)
                }
              } />
          )
        }
        {
          !dangerouslySetInnerHtml && (
            <div>
              {striptags(text)}
            </div>
          )
        }
    </ShowMoreText>
  )
}

const sanitizeTruncatedTextHtml = (html: string) => {
  return sanitizeHtml(html, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img']),
    allowedAttributes: {
      'a': ['data-start-time', 'href', 'rel', 'target']
    },
    transformTags: {
      'a': sanitizeHtml.simpleTransform('a', {
        target: '_blank',
        rel: 'noopener noreferrer'
      })
    }
  })
}
