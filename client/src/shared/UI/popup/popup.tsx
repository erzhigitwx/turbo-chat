import clsx from 'clsx'
import cl from './popup.module.scss'
import { PopupProps } from '@/shared/UI/popup/popup.props'
import { forwardRef } from 'react'

const Popup = forwardRef(
  ({ children, withShadow, isCentered, extraClass, ...rest }: PopupProps, ref: any) => {
    return isCentered ? (
      <div
        ref={ref}
        className={clsx(
          cl.popupContainer,
          withShadow && cl.popupShadow,
          isCentered && cl.popupCentered,
        )}
        {...rest}
      >
        <div onClick={(e) => e.stopPropagation()} className={extraClass}>
          {children}
        </div>
      </div>
    ) : (
      <div ref={ref} className={clsx(cl.popup, withShadow && cl.popupShadow, extraClass)} {...rest}>
        {children}
      </div>
    )
  },
)

export { Popup }
