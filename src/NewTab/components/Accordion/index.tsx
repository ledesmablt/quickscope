import _ from 'lodash'
import React, { ReactElement, useMemo } from 'react'

import './Accordion.css'

interface Props {
  title?: string | ReactElement
  defaultOpen?: boolean
  open?: boolean
  onChange?: (open: boolean) => void
  children?: ReactElement
}
const Accordion = ({
  title,
  defaultOpen,
  open,
  onChange,
  children
}: Props): ReactElement => {
  const id = useMemo(() => _.uniqueId('accordion-'), [])

  return (
    <div className='Accordion'>
      <input
        id={id}
        defaultChecked={defaultOpen}
        className='absolute opacity-0'
        type='checkbox'
        checked={open}
        onChange={(e) => onChange && onChange(e.target.checked)}
      />
      <label htmlFor={id} className='block leading-normal cursor-pointer'>
        {title}
      </label>
      <div className='Accordion_content'>{children}</div>
    </div>
  )
}
export default Accordion
