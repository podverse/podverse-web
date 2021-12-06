import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons'
import { ButtonCircle, ButtonSquare } from '~/components'

type Props = {
  currentPageIndex: number
  handlePageNavigate: any
  handlePageNext: any
  handlePagePrevious: any
  pageCount: number
}

const keyPrefix = 'pagination'

export const Pagination = ({
  currentPageIndex,
  handlePageNavigate,
  handlePageNext,
  handlePagePrevious,
  pageCount
}: Props) => {
  const pageButtons = generatePageButtons(
    currentPageIndex,
    handlePagePrevious,
    handlePageNavigate,
    handlePageNext,
    pageCount
  )

  return <>{pageCount > 1 ? <div className='pagination'>{pageButtons}</div> : null}</>
}

/* Helpers */

const prevButton = (handlePagePrev: any) => (
  <ButtonCircle
    className='backwards'
    faIcon={faChevronLeft}
    key={`${keyPrefix}-backwards`}
    onClick={handlePagePrev}
    size='small'
  />
)

const nextButton = (handlePageNext: any) => (
  <ButtonCircle
    className='forwards'
    faIcon={faChevronRight}
    key={`${keyPrefix}-forwards`}
    onClick={handlePageNext}
    size='small'
  />
)

const pageButton = (pageNumber: number, isActive: boolean, handlePageNavigate: any) => (
  <ButtonSquare
    isActive={isActive}
    key={`${keyPrefix}-${pageNumber}`}
    onClick={() => handlePageNavigate(pageNumber)}
    text={pageNumber}
  />
)

const generatePageButtons = (
  currentPageNumber: number,
  handlePagePrev: any,
  handlePageNavigate: any,
  handlePageNext: any,
  pageCount: number
) => {
  const components = []
  if (pageCount >= 5) {
    components.push(prevButton(handlePagePrev))
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
    components.push(nextButton(handlePageNext))
  }

  return components
}
