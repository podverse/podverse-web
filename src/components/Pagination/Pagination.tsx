import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons'
import { useTranslation } from 'next-i18next'
import { ButtonCircle, ButtonSquare } from '~/components'

type Props = {
  currentPageIndex: number
  handlePageNavigate: any
  handlePageNext: any
  handlePagePrevious: any
  pageCount: number
  show: boolean
}

const keyPrefix = 'pagination'

export const Pagination = ({
  currentPageIndex,
  handlePageNavigate,
  handlePageNext,
  handlePagePrevious,
  pageCount,
  show
}: Props) => {
  const { t } = useTranslation()
  const pageButtons = generatePageButtons(
    currentPageIndex,
    handlePagePrevious,
    handlePageNavigate,
    handlePageNext,
    pageCount,
    t
  )

  function handleClick(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault()
    const page = window.prompt('type a page number between 1 and ###')
    handlePageNavigate(parseInt(page))
  }

  return (
    <>
      {show ? (
        <div aria-label={t('Page numbers')} role='group'>
          <div className='pagination'>{pageButtons}</div>
          <div className='skip'>
            <button className='button-skip' onClick={handleClick}>
              {t('Skip to page')}
            </button>
          </div>
        </div>
      ) : null}
    </>
  )
}

/* Helpers */

const prevButton = (handlePagePrev: any, t: any) => (
  <ButtonCircle
    ariaLabel={t('Page previous')}
    className='backwards'
    faIcon={faChevronLeft}
    key={`${keyPrefix}-backwards`}
    onClick={() => {
      handlePagePrev()
    }}
    size='small'
  />
)

const nextButton = (handlePageNext: any, t: any) => (
  <ButtonCircle
    ariaLabel={t('Page next')}
    className='forwards'
    faIcon={faChevronRight}
    key={`${keyPrefix}-forwards`}
    onClick={() => {
      handlePageNext()
    }}
    size='small'
  />
)

const pageButton = (pageNumber: number, isActive: boolean, handlePageNavigate: any) => (
  <ButtonSquare
    isActive={isActive}
    key={`${keyPrefix}-${pageNumber}`}
    onClick={() => {
      handlePageNavigate(pageNumber)
    }}
    text={pageNumber}
  />
)

const generatePageButtons = (
  currentPageNumber: number,
  handlePagePrev: any,
  handlePageNavigate: any,
  handlePageNext: any,
  pageCount: number,
  t: any
) => {
  const components = []
  if (pageCount >= 5) {
    components.push(prevButton(handlePagePrev, t))
  }

  let maxPageButtons = 5
  const pagesRemaining = pageCount - currentPageNumber
  let iterPageNumber = currentPageNumber

  if (currentPageNumber <= 3) {
    iterPageNumber = 1
  } else if (currentPageNumber >= 4) {
    if (pagesRemaining >= 2) {
      iterPageNumber = iterPageNumber - 2
    } else if (pagesRemaining === 1) {
      iterPageNumber = iterPageNumber - 3
    } else {
      iterPageNumber = iterPageNumber - 4
    }
  }

  while (maxPageButtons > 0 && iterPageNumber <= pageCount) {
    components.push(pageButton(iterPageNumber, iterPageNumber === currentPageNumber, handlePageNavigate))
    iterPageNumber++
    maxPageButtons--
  }

  if (pageCount >= 5) {
    components.push(nextButton(handlePageNext, t))
  }

  return components
}
