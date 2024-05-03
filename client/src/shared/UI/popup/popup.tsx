import cl from './popup.module.scss'
import { PopupProps } from '@/shared/UI/popup/popup.props'
import clsx from 'clsx'

const Popup = ({ children, withShadow, isCentered, extraClass, ...rest }: PopupProps) => {
  return isCentered ? (
    <div
      className={clsx(
        cl.popupContainer,
        withShadow && cl.popupShadow,
        isCentered && cl.popupCentered,
      )}
      {...rest}
    >
      <div className={extraClass} onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  ) : (
    <div className={clsx(cl.popup, withShadow && cl.popupShadow, extraClass)} {...rest}>
      {children}
    </div>
  )
}

export { Popup }
