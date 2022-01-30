import React, { ReactElement, useRef } from 'react'
import useOnClickOutside from 'src/utils/useOnClickOutside'

interface Props {
  children?: ReactElement | ReactElement[]
  open: boolean
  onClose: VoidFunction
}
const Modal = ({ children, open, onClose }: Props): ReactElement => {
  const modalContentRef = useRef()

  useOnClickOutside(() => {
    onClose()
  }, [modalContentRef])

  if (!open) {
    return null
  }

  return (
    <div className='fixed z-10 inset-0 overflow-y-auto flex items-center justify-center'>
      <div
        id='modal-overlay'
        className='fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity'
      />
      <div
        ref={modalContentRef}
        id='modal-content'
        className='inline-block align-bottom bg-white rounded-md overflow-hidden shadow-xl transform transition-all w-[36rem] min-h-[20rem] p-4'
      >
        {children}
      </div>
    </div>
  )
}
export default Modal
