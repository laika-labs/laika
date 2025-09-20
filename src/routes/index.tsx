import { createFileRoute } from '@tanstack/react-router'

import { EVM } from './-components/EVM'

export const Route = createFileRoute('/')({
  component: EVM,
})
