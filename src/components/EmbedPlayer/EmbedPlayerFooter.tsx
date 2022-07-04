import { faCopyright as faCopyrightRegular } from '@fortawesome/free-regular-svg-icons'
import classNames from 'classnames'
import { useTranslation } from 'next-i18next'
import { Icon, NavBarBrand, PVLink } from '~/components'
import { PV } from '~/resources'

type Props = {
  hasInitialized?: boolean
}

export const EmbedPlayerFooter = ({ hasInitialized }: Props) => {
  const { t } = useTranslation()
  const footerClassName = classNames('embed-player-footer', hasInitialized ? '' : 'has-not-initialized')

  return (
    <div className={footerClassName}>
      <NavBarBrand height={17} href={`${PV.Config.WEB_BASE_URL}`} target='_blank' width={90} />
      <div className='embed-player-footer-links'>
        <PVLink className='embed-player-footer-link' href={`${PV.Config.WEB_BASE_URL}/about`}>
          {t('About')}
        </PVLink>
        <PVLink className='embed-player-footer-link' href='https://www.gnu.org/licenses/agpl-3.0.en.html'>
          {t('open source')} <Icon faIcon={faCopyrightRegular} rotation={180} />
        </PVLink>
      </div>
    </div>
  )
}
