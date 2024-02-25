import { Copy, X } from 'lucide-react'
import { ChangeEvent, useState } from 'react'
import { formatUnits, parseUnits } from 'viem'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard'
import { toast } from '@/components/ui/use-toast'

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

export default function UnitConverter({ handleClose }: UnitConverterProps) {
  const [value, setValue] = useState('1')
  const [unit, setUnit] = useState(19)

  const [, copy] = useCopyToClipboard()

  const handleCopy = (text: string) => {
    return async () => {
      if (await copy(text)) {
        toast({
          description: 'Copied to clipboard',
        })
      } else {
        toast({
          description: 'Failed to copy to clipboard',
          variant: 'destructive',
        })
      }
    }
  }

  const handleChange = (unit: number) => {
    return (e: ChangeEvent<HTMLInputElement>) => {
      setValue(e.target.value)
      setUnit(unit)
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-2">
        <small className="text-sm font-medium leading-none">Unit Converter</small>
        <Button variant="secondary" size="icon" onClick={handleClose}>
          <X className="w-4 h-4" />
        </Button>
      </div>
      <div className="flex flex-col gap-2 p-2">
        {unitList.map((item, index) => (
          <div key={index} className="flex items-center gap-1">
            <Button
              variant="secondary"
              size="icon"
              onClick={handleCopy(formatUnits(parseUnits(value, unit), item.unit))}
            >
              <Copy className="w-4 h-4" />
            </Button>
            <Input
              type="number"
              placeholder="Wei"
              className="flex-auto w-auto"
              value={formatUnits(parseUnits(value, unit), item.unit)}
              onChange={handleChange(item.unit)}
            />
            <Button variant="secondary" className="justify-start w-32 whitespace-nowrap">
              {item.name} (10{Boolean(item.sup) && <sup>{item.sup}</sup>})
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}
