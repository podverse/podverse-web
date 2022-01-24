import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/router'
import { useOmniAural } from 'omniaural'
import { useEffect } from 'react'
import { useToasts } from 'react-toast-notifications'
import { getMembershipStatus } from '~/lib/utility/membership'
import { PV } from '~/resources'
import { ButtonLink } from '..'

export const ToastsHandler = () => {
  const { addToast } = useToasts()
  const { t } = useTranslation()
  const router = useRouter()
  const [userInfo] = useOmniAural('session.userInfo')

  useEffect(() => {
    if (userInfo) {
      const currentMembershipStatus = getMembershipStatus(userInfo)

      if (
        currentMembershipStatus === PV.MembershipStatus.FREE_TRIAL_EXPIRED ||
        currentMembershipStatus === PV.MembershipStatus.PREMIUM_EXPIRED
      ) {
        const premiumMembershipExpiredNode = (
          <div className='pv-toast-content clickable' onClick={() => router.push(PV.RoutePaths.web.membership)}>
            <div>{t('YourMembershipHasExpired')}</div>
            <ButtonLink label={t('Renew')} />
          </div>
        )

        addToast(premiumMembershipExpiredNode, {
          appearance: 'warning',
          autoDismiss: false
        })
      }
    }
  }, [])

  return null
}
