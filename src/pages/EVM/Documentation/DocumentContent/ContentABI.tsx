import { formatAbi } from 'abitype'
import { Fragment } from 'react'

import { useTheme } from '@/components/ThemeProvider'
import { EVMABIMethod } from '@/store/collections'
import { Editor, EditorProps } from '@monaco-editor/react'

interface ABIProps {
  title: string
  abi: EVMABIMethod[]
}

const editorOptions: EditorProps['options'] = {
  readOnly: true,
  lineNumbers: 'off',
  glyphMargin: false,
  folding: false,
  lineDecorationsWidth: 0,
  lineNumbersMinChars: 0,
  minimap: { enabled: false },
  overviewRulerLanes: 0,
  wordWrap: 'off',
  fontSize: 12,
  lineHeight: 48,
  matchBrackets: 'never',
  scrollbar: {
    vertical: 'hidden',
    handleMouseWheel: false,
  },
  colorDecoratorsLimit: 0,
  renderLineHighlight: 'none',
}

export default function ContentABI({ title, abi }: ABIProps) {
  const { resolvedTheme } = useTheme()
  return (
    <>
      <h4 className="mt-6 text-xl font-semibold tracking-tight scroll-m-20 first:mt-0">{title}</h4>
      {abi.map((event) => {
        return (
          <Fragment key={event.name}>
            <p className="leading-7 [&:not(:first-child)]:mt-6">{event.name}</p>
            <div className="p-2 rounded-lg bg-secondary h-16 [&_.cursor]:!hidden">
              <Editor
                defaultLanguage="sol"
                value={formatAbi(abi.filter((item) => item.name === event.name))[0]}
                options={editorOptions}
                theme={resolvedTheme === 'light' ? 'light' : 'vs-dark'}
              />
            </div>
          </Fragment>
        )
      })}
    </>
  )
}
