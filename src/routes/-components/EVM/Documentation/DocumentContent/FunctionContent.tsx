import { Editor, type EditorProps } from '@monaco-editor/react'
import { formatAbi } from 'abitype'

import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { useEVMCollectionStore, type EVMABIMethod } from '@/store/collections'

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
  fontSize: 14,
  lineHeight: 48,
  matchBrackets: 'never',
  scrollbar: {
    vertical: 'hidden',
    handleMouseWheel: false,
  },
  colorDecoratorsLimit: 0,
  renderLineHighlight: 'none',
}

export function FunctionContent({
  method,
  abi,
  contractId,
}: {
  method: EVMABIMethod
  abi: EVMABIMethod[]
  contractId: string
}) {
  const { updateContractComment } = useEVMCollectionStore()
  const handleUpdateComment = (comment: string) => {
    updateContractComment(contractId, method.name, comment)
  }

  return (
    <>
      <p className="leading-7 [&:not(:first-child)]:mt-6">{method.name}</p>
      <Input
        className={cn(
          'hover:bg-secondary my-1 resize-none border-none shadow-none transition-colors duration-200',
          !method.comment && 'text-secondary-600',
        )}
        placeholder="Click here to add comment"
        onChange={(e) => handleUpdateComment(e.target.value)}
        value={method.comment || ''}
      />
      <div className="bg-secondary h-16 rounded-lg p-2 [&_.cursor]:!hidden">
        <Editor
          defaultLanguage="sol"
          value={formatAbi(abi.filter((item) => item.name === method.name))[0]}
          options={editorOptions}
          theme="vs-dark"
        />
      </div>
    </>
  )
}
