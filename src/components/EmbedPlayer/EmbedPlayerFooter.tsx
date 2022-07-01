import { faCopyright as faCopyrightRegular } from '@fortawesome/free-regular-svg-icons'
import { useTranslation } from 'next-i18next'
import { Icon, NavBarBrand, PVLink } from '~/components'
import { PV } from '~/resources'

// type Props = {}

export const EmbedPlayerFooter = () => {
  const { t } = useTranslation()

  return (
    <div className='embed-player-footer'>
      <NavBarBrand height={17} href={`${PV.Config.WEB_BASE_URL}`} src={PV.Images.dark.brandLogo} width={90} />
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
