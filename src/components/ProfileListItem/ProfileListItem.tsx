import { User } from 'podverse-shared'
import { useTranslation } from 'react-i18next'
import { PVLink } from '~/components'
import { PV } from '~/resources'

type Props = {
  user: User
}

export const ProfileListItem = ({ user }: Props) => {
  const { t } = useTranslation()
  const name = user?.name ? user.name : t('Anonymous')
  const profilePageUrl = `${PV.RoutePaths.web.profile}/${user.id}`

  return (
    <>
      <li className='profile-list-item'>
        <PVLink href={profilePageUrl}>
          <div className='name'>{name}</div>
        </PVLink>
      </li>
      <hr />
    </>
  )
}
