import { useState } from 'react'
import { Check, Copy, X } from 'lucide-react'
import { toast } from 'sonner'
import { formatUnits, parseUnits } from 'viem'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard'

const unitList = [
  { name: 'Wei', sup: -18, unit: 1 },
  { name: 'KWei', sup: -15, unit: 4 },
  { name: 'MWei', sup: -12, unit: 7 },
  { name: 'GWei', sup: -9, unit: 10 },
  { name: 'Szabo', sup: -6, unit: 13 },
  { name: 'Finney', sup: -3, unit: 16 },
  { name: 'Ether', sup: 0, unit: 19 },
  { name: 'KEther', sup: 3, unit: 22 },
  { name: 'MEther', sup: 6, unit: 25 },
  { name: 'GEther', sup: 9, unit: 28 },
  { name: 'TEther', sup: 12, unit: 31 },
]

interface UnitConverterProps {
  handleClose: () => void
}

export function UnitConverter({ handleClose }: UnitConverterProps) {
  const [value, setValue] = useState('1')
  const [unit, setUnit] = useState(19)
  const [copyIndex, setCopyIndex] = useState<number | null>(null)

  const [, copy] = useCopyToClipboard()

  const handleCopy = (text: string, index: number) => {
    return async () => {
      if (await copy(text)) {
        setCopyIndex(index)
        toast('Copied to clipboard')
        setTimeout(() => {
          setCopyIndex(null)
        }, 1000)
      } else {
        toast.error('Failed to copy to clipboard')
      }
    }
  }

  const handleChange = (unit: number) => {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      setValue(e.target.value)
      setUnit(unit)
    }
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between p-2">
        <small className="text-sm leading-none font-medium">Unit Converter</small>
        <Button variant="secondary" size="icon" onClick={handleClose}>
          <X />
        </Button>
      </div>
      <div className="flex flex-col gap-2 p-2">
        {unitList.map((item, index) => (
          <div key={index} className="flex items-center gap-1">
            <Button
              variant="secondary"
              size="icon"
              onClick={handleCopy(formatUnits(parseUnits(value, unit), item.unit), index)}
            >
              {index === copyIndex ? <Check /> : <Copy />}
            </Button>
            <Input
              type="number"
              placeholder="Wei"
              className="w-auto flex-auto"
              value={formatUnits(parseUnits(value, unit), item.unit)}
              onChange={handleChange(item.unit)}
            />
            <Button variant="secondary" className="w-32 justify-start whitespace-nowrap">
              {item.name} (
              {item.sup !== 0 ? (
                <>
                  10 <sup>{item.sup}</sup>
                </>
              ) : (
                1
              )}
              )
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}
