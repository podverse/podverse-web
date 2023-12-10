import { ColumnsWrapper, Footer, PageScrollableContent } from '~/components'

export default function Custom404() {
  return (
    <>
      <PageScrollableContent>
        <ColumnsWrapper
          centerContent
          mainColumnChildren={
            <div className='error-page'>
              <h1>404 - Page not found</h1>
            </div>
          }
        />
        <Footer />
      </PageScrollableContent>
    </>
  )
}
