import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons'
import ReactPaginate from 'react-paginate'
import { ButtonCircle, ButtonSquare } from '~/components'

type Props = {
  currentPageIndex: number
  onPageChange: any
  pageCount: number
}

const prevButton = (
  <ButtonCircle
    className='backwards'
    faIcon={faChevronLeft}
    size='small' />
)

const nextButton = (
  <ButtonCircle
    className='forwards'
    faIcon={faChevronRight}
    size='small' />
)

const pageButton = (pageNumber: number, isActive: boolean) => (
  <ButtonSquare
    isActive={isActive}
    text={pageNumber} />
)

const generatePageButtons = (currentPageNumber: number, onPageChange: any, pageCount: number) => {
  const components = []
  if (pageCount >= 5) {
    components.push(prevButton)
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

  while (
    maxPageButtons > 0
    && iterPageNumber <= pageCount
  ) {
    components.push(pageButton(iterPageNumber, iterPageNumber === currentPageNumber))
    iterPageNumber++
    maxPageButtons--
  }

  if (pageCount >= 5) {
    components.push(nextButton)
  }

  return components
}

export const Pagination = ({ currentPageIndex, onPageChange, pageCount }: Props) => {
  const pageButtons = generatePageButtons(currentPageIndex, onPageChange, pageCount)

  return (
    <>
      {
        pageCount && pageCount > 1 && (
          <div className='pagination'>
            {pageButtons}
          </div>
        )
      }
    </>
  )
}
