import ShowMoreText from '@podverse/react-show-more-text'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import striptags from 'striptags'
import { sanitizeTextHtml } from '~/lib/utility/sanitize'

type Props = {
  dangerouslySetInnerHtml?: boolean
  lines: number
  text: string
}

export const TruncatedText = ({ dangerouslySetInnerHtml = false, lines, text }: Props) => {
  const { t } = useTranslation()
  const [isExpanded, setIsExpanded] = useState<boolean>(false)

  useEffect(() => {
    ariaToggleReadLineBreak(isExpanded)
  }, [isExpanded])

  /*
    The react-show-more-text library renders <br> tags between each truncated line,
    and this causes screen readers to focus on and read each truncated line twice.
    To avoid this issue, we're adding aria-hidden to each <br> when the truncated text
    is not expanded.
  */
  const ariaToggleReadLineBreak = (isExpanded: boolean) => {
    setTimeout(() => {
      if (!isExpanded) {
        document.querySelectorAll('.truncated-text br').forEach((br) => br.setAttribute('aria-hidden', 'true'))
      } else {
        document.querySelectorAll('.truncated-text br').forEach((br) => br.setAttribute('aria-hidden', 'false'))
      }
    }, 1000)
  }

  return (
    <ShowMoreText
      anchorClass='truncated-text-anchor'
      className='truncated-text'
      less={t('Show Less')}
      lines={lines}
      more={t('Show More')}
      onClick={() => setIsExpanded(!isExpanded)}
      showMoreLessRole='button'
    >
      {dangerouslySetInnerHtml && (
        <div
          dangerouslySetInnerHTML={{
            __html: isExpanded ? sanitizeTextHtml(text) : sanitizeTextHtml(striptags(text))
          }}
        />
      )}
      {!dangerouslySetInnerHtml && <div>{striptags(text)}</div>}
    </ShowMoreText>
  )
}
