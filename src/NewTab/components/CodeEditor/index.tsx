import React, { ReactElement, Suspense } from 'react'
const Editor = React.lazy(() => import('react-simple-code-editor'))
import hljs from 'highlight.js'

const LightTheme = React.lazy(() => import('./LightTheme'))
const DarkTheme = React.lazy(() => import('./DarkTheme'))

import useStore from 'src/utils/hooks/useStore'
import _ from 'lodash'

interface Props {
  value: string
  onChange: (e: string) => void
  language: 'yaml' | 'json'
  id?: string
  placeholder?: string
}

const CodeEditor = ({
  value,
  onChange,
  language,
  id,
  placeholder
}: Props): ReactElement => {
  const isDarkMode = useStore((store) => store.isDarkMode)

  return (
    <div className='border rounded overflow-auto w-full my-1'>
      <Suspense
        fallback={<div className='min-h-[12rem] max-h-[20rem]'>loading...</div>}
      >
        {isDarkMode ? <DarkTheme /> : <LightTheme />}
        <Editor
          id={id}
          className='font-mono min-h-[12rem] max-h-[20rem]'
          placeholder={placeholder}
          value={value}
          onValueChange={onChange}
          highlight={(code) => {
            return hljs.highlight(code, {
              language
            }).value
          }}
          padding={4}
        />
      </Suspense>
    </div>
  )
}
export default CodeEditor
