import { useOmniAural } from 'omniaural'
import { useTranslation } from 'react-i18next'
import { isBeforeDate } from '~/lib/utility/date'

type Props = {}

export const MembershipStatus = (props: Props) => {
  const { t } = useTranslation()
  const [userInfo] = useOmniAural('session.userInfo')

  return (
    <>
      {userInfo?.id && (
        <>
          <div className='membership-status-wrapper'>
            <h2>{t('Status')}</h2>
            {userInfo?.membershipExpiration && isBeforeDate(userInfo?.membershipExpiration) && (
              <>
                <div className='membership-status is-active'>{t('Premium')}</div>
                <p>
                  {t('Ends')}
                  {new Date(userInfo?.membershipExpiration).toLocaleString()}
                </p>
              </>
            )}
            {!userInfo?.membershipExpiration &&
              userInfo?.freeTrialExpiration &&
              isBeforeDate(userInfo?.freeTrialExpiration) && (
                <>
                  <div className='membership-status is-active'>{t('PremiumFreeTrial')}</div>
                  <p>
                    {t('Ends')}
                    {new Date(userInfo?.freeTrialExpiration).toLocaleString()}
                  </p>
                </>
              )}
            {!userInfo?.membershipExpiration &&
              userInfo?.freeTrialExpiration &&
              !isBeforeDate(userInfo?.freeTrialExpiration) && (
                <>
                  <div className='membership-status is-expired'>{t('Expired')}</div>
                  <p>
                    {t('Ended')}
                    {new Date(userInfo?.freeTrialExpiration).toLocaleString()}
                  </p>
                  <p>{t('TrialEnded')}</p>
                </>
              )}
            {userInfo?.freeTrialExpiration &&
              userInfo?.membershipExpiration &&
              !isBeforeDate(userInfo?.freeTrialExpiration) &&
              !isBeforeDate(userInfo?.membershipExpiration) && (
                <>
                  <div className='membership-status is-expired'>{t('Expired')}</div>
                  <p>
                    {t('Ended')}
                    {new Date(userInfo?.membershipExpiration).toLocaleString()}
                  </p>
                  <p>{t('MembershipEnded')}</p>
                </>
              )}
            {userInfo?.id && !userInfo?.freeTrialExpiration && !userInfo?.membershipExpiration && (
              <>
                <div className='membership-status is-expired'>{t('Inactive')}</div>
                <p>{t('MembershipInactive')}</p>
              </>
            )}
          </div>
          <hr />
        </>
      )}
    </>
  )
}
