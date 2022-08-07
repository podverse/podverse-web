import { GetServerSideProps } from 'next'
import { useTranslation } from 'next-i18next'
import { useOmniAural } from 'omniaural'
import { Page } from '~/lib/utility/page'
import { PV } from '~/resources'
import { ButtonRectangle, ColumnsWrapper, Footer, Meta, PageHeader, PageScrollableContent } from '~/components'
import { getDefaultServerSideProps } from '~/services/serverSideHelpers'
import { getAccountClaimToken, redeemAccountClaimToken } from '~/services/accountClaimToken'
import { useState } from 'react'
import { OmniAuralState } from '~/state/omniauralState'
import { useRouter } from 'next/router'

interface ServerProps extends Page {
  serverAccountClaimToken: {
    id: string
    claimed: boolean
    yearsToAdd: number
  }
}

export default function AccountClaimToken(props: ServerProps) {
  /* Initialize */

  const { serverAccountClaimToken } = props
  const router = useRouter()
  const [userInfo] = useOmniAural('session.userInfo') as [OmniAuralState['session']['userInfo']]
  const [isLoadingRedeeming, setIsLoadingRedeeming] = useState<boolean>(false)
  const { t } = useTranslation()

  /* Meta Tags */

  const meta = {
    currentUrl: `${PV.Config.WEB_BASE_URL}${PV.RoutePaths.web.accountClaimToken}`,
    description: t('pages-about_Description'),
    title: t('pages-account-claim-token_Title')
  }

  const _redeemAccountClaimToken = async () => {
    if (serverAccountClaimToken && userInfo?.email) {
      setIsLoadingRedeeming(true)
      await redeemAccountClaimToken(serverAccountClaimToken.id, userInfo.email)
      setIsLoadingRedeeming(false)
      router.push(PV.RoutePaths.web.membership)
    }
  }

  return (
    <>
      <Meta
        description={meta.description}
        ogDescription={meta.description}
        ogTitle={meta.title}
        ogType='website'
        ogUrl={meta.currentUrl}
        robotsNoIndex={true}
        title={meta.title}
        twitterDescription={meta.description}
        twitterTitle={meta.title}
      />
      <PageHeader text={t('Account Claim Token')} />
      <PageScrollableContent>
        <ColumnsWrapper
          mainColumnChildren={
            <div className='text-page'>
              <p>{t('Claim free premium membership')}</p>
              {!!serverAccountClaimToken && <p>{`${t('Years to add')}: ${serverAccountClaimToken.yearsToAdd}`}</p>}
              {!serverAccountClaimToken && <p>{t('This token has been claimed')}</p>}
              <br />
              {!serverAccountClaimToken?.claimed && (
                <ButtonRectangle
                  disabled={!serverAccountClaimToken || !userInfo}
                  isLoading={isLoadingRedeeming}
                  label={t('Claim Token')}
                  onClick={_redeemAccountClaimToken}
                  type='primary'
                />
              )}
            </div>
          }
        />
        <Footer />
      </PageScrollableContent>
    </>
  )
}

/* Server-Side Logic */

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { locale, params } = ctx
  const { accountClaimTokenId } = params

  const defaultServerProps = await getDefaultServerSideProps(ctx, locale)
  let accountClaimToken = null

  try {
    accountClaimToken = (await getAccountClaimToken(accountClaimTokenId as string)) as any
  } catch (error) {
    //
  }

  const serverProps: ServerProps = {
    ...defaultServerProps,
    serverAccountClaimToken: accountClaimToken
  }

  return { props: serverProps }
}
