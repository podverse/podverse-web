import { faGlobe, faLink } from '@fortawesome/free-solid-svg-icons'
import OmniAural, { useOmniAural } from 'omniaural'
import type { User } from 'podverse-shared'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ButtonRectangle, Dropdown, TextInput } from '~/components'
import { PV } from '~/resources'
import { toggleSubscribeToUser } from '~/state/loggedInUserActions'

type Props = {
  handleChangeIsPublic?: any
  handleEditCancel: any
  handleEditSave: any
  handleEditStart: any
  handleUserNameOnChange: any
  isEditing?: boolean
  user: User
}

export const ProfilePageHeader = ({
  handleChangeIsPublic,
  handleEditCancel,
  handleEditSave,
  handleEditStart,
  handleUserNameOnChange,
  isEditing,
  user
}: Props) => {
  const { t } = useTranslation()
  const [userInfo] = useOmniAural('session.userInfo')
  const name = user?.name || t('Anonymous')
  const isLoggedInUserProfile = userInfo?.id && userInfo.id === user?.id
  const isSubscribed = userInfo?.subscribedUserIds?.includes(user.id)
  const subscribedText = isSubscribed ? t('Unsubscribe') : t('Subscribe')
  const [isSubscribing, setIsSubscribing] = useState<boolean>(false)

  /* Render Helpers */

  const generatePrivacyDropdownItems = () => {
    const items = [
      { label: 'Public', key: PV.Users.privacyKeys.public },
      { label: 'Private', key: PV.Users.privacyKeys.private }
    ]

    return items
  }

  const privacyDropdownItems = generatePrivacyDropdownItems()

  const _toggleSubscribeToUser = async () => {
    setIsSubscribing(true)
    await toggleSubscribeToUser(user.id, t)
    setIsSubscribing(false)
  }

  return (
    <>
      <div className='profile-page-header'>
        <div className='main-max-width'>
          <div className='text-wrapper'>
            {isEditing ? (
              <TextInput
                defaultValue={user.name}
                label={t('Your Name')}
                noMarginOrPadding
                onChange={handleUserNameOnChange}
                onSubmit={handleEditSave}
                placeholder={t('Anonymous')}
                type='text'
              />
            ) : (
              <h1>{name}</h1>
            )}
          </div>
          <div className='buttons'>
            {!isEditing && (
              <div className='top-row'>
                {isLoggedInUserProfile && !isEditing && (
                  <ButtonRectangle label={t('Edit')} onClick={handleEditStart} type='tertiary' />
                )}
                {!isLoggedInUserProfile && (
                  <ButtonRectangle
                    label={subscribedText}
                    isLoading={isSubscribing}
                    onClick={() => {
                      if (userInfo) {
                        _toggleSubscribeToUser()
                      } else {
                        OmniAural.modalsLoginToAlertShow('subscribe to profile')
                      }
                    }}
                    type='tertiary'
                  />
                )}
              </div>
            )}
            {(isEditing || isLoggedInUserProfile) && (
              <div className='bottom-row'>
                {isEditing && (
                  <>
                    <ButtonRectangle label={t('Cancel')} onClick={handleEditCancel} type='tertiary' />
                    <ButtonRectangle label={t('Save')} onClick={handleEditSave} type='tertiary' />
                  </>
                )}
                {isLoggedInUserProfile && !isEditing && (
                  <Dropdown
                    dropdownWidthClass='width-small'
                    faIcon={user.isPublic ? faGlobe : faLink}
                    onChange={handleChangeIsPublic}
                    options={privacyDropdownItems}
                    selectedKey={user.isPublic ? PV.Users.privacyKeys.public : PV.Users.privacyKeys.private}
                  />
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      {/* <hr /> */}
    </>
  )
}
