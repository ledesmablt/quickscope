import React, { ReactElement, Suspense } from 'react'
const Editor = React.lazy(() => import('react-simple-code-editor'))
import { highlight, languages } from 'prismjs/components/prism-core'
import 'prismjs/components/prism-json'
import 'prismjs/components/prism-yaml'
import 'prismjs/themes/prism.css'

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
  return (
    <div className='border rounded overflow-auto w-full my-1'>
      <Suspense fallback={<p>loading...</p>}>
        <Editor
          id={id}
          className='font-mono min-h-[12rem] max-h-[20rem]'
          placeholder={placeholder}
          value={value}
          onValueChange={onChange}
          highlight={(code) => highlight(code, languages[language])}
          padding={4}
        />
      </Suspense>
    </div>
  )
}
export default CodeEditor
