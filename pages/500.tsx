import { ColumnsWrapper, Footer, PageScrollableContent } from '~/components'

export default function Custom500() {
  return (
    <>
      <PageScrollableContent>
        <ColumnsWrapper
          centerContent
          mainColumnChildren={
            <div className='error-page'>
              <h1>500 - Server-side error</h1>
            </div>
          }
        />
        <Footer />
      </PageScrollableContent>
    </>
  )
}
