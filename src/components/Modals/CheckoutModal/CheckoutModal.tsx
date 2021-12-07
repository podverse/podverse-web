import OmniAural, { useOmniAural } from 'omniaural'
import Modal from 'react-modal'
import { ButtonClose, PayPalButton } from '~/components'

type Props = unknown

export const CheckoutModal = (props: Props) => {
  const [checkout] = useOmniAural('modals.checkout')

  /* Function Helpers */

  const _onRequestClose = () => {
    OmniAural.modalsHideAll()
  }

  return (
    <Modal className='checkout-modal centered' isOpen={checkout.show} onRequestClose={_onRequestClose}>
      <h2>Checkout</h2>
      <ButtonClose onClick={_onRequestClose} />
      <PayPalButton />
    </Modal>
  )
}
