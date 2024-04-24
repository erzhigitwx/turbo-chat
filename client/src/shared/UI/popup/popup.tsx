import cl from './popup.module.scss'
import { PopupProps } from '@/shared/UI/popup/popup.props'
import clsx from 'clsx'

const Popup = ({ children, withShadow, isCentered, extraClass, ...rest }: PopupProps) => {
  return (
    <div
      className={clsx(
        cl.popup,
        withShadow && cl.popupShadow,
        isCentered && cl.popupCentered,
        extraClass,
      )}
      {...rest}
    >
      {children}
    </div>
  )
}

export { Popup }
