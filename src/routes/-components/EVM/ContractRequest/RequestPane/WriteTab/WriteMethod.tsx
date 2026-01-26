import { useCallback } from 'react'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { RotateCwIcon, SendIcon } from 'lucide-react'
import type { Address } from 'viem'
import { mainnet } from 'viem/chains'
import { useSwitchChain, useWriteContract } from 'wagmi'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { useContractMethod } from '@/hooks/useContractMethod'
import type { EVMABIMethod } from '@/store/collections'
import { useResponseStore } from '@/store/responses'

import { MethodInputs } from '../MethodInputs'

export function WriteMethod({
  chainId,
  functionName,
  abi,
  contractAddress,
}: {
  chainId?: number
  functionName: string
  abi: EVMABIMethod
  contractAddress: string | Address
}) {
  const { pushResponse } = useResponseStore()
  const { switchChain } = useSwitchChain()
  const { writeContract, isPending } = useWriteContract({})

  const { args, substitutedArgs, substitutedAddress, handleInputChange, validateAndExecute } = useContractMethod({
    abi,
    contractAddress,
  })

  const effectiveChainId = chainId ?? mainnet.id

  const handleWriteClick = useCallback(() => {
    validateAndExecute(() => {
      if (!substitutedAddress) return

      writeContract(
        {
          abi: [abi],
          address: substitutedAddress,
          functionName,
          args: substitutedArgs,
          chainId: effectiveChainId,
        },
        {
          onSettled(data, error) {
            if (error) {
              pushResponse({
                type: 'WRITE',
                functionName,
                chainId: effectiveChainId,
                address: substitutedAddress,
                error,
              })
              return
            }

            pushResponse({
              type: 'WRITE',
              functionName,
              chainId: effectiveChainId,
              address: substitutedAddress,
              txHash: data,
            })
          },
        },
      )
    })
  }, [
    validateAndExecute,
    substitutedAddress,
    writeContract,
    abi,
    functionName,
    substitutedArgs,
    effectiveChainId,
    pushResponse,
  ])

  const handleSwitchNetwork = useCallback(() => {
    if (chainId) {
      switchChain({ chainId })
    }
  }, [chainId, switchChain])

  return (
    <Card size="sm">
      <CardHeader>
        <CardTitle className="text-muted-foreground font-mono">{functionName}</CardTitle>
      </CardHeader>
      {abi.inputs.length > 0 && (
        <CardContent>
          <MethodInputs
            functionName={functionName}
            inputs={abi.inputs}
            args={args}
            onInputChange={handleInputChange}
            inputIdPrefix="writeInput"
          />
        </CardContent>
      )}
      <CardFooter>
        <ConnectButton.Custom>
          {({ account, chain, openConnectModal, mounted }) => {
            const ready = mounted
            const connected = ready && account && chain

            return (
              <div
                {...(!ready && {
                  'aria-hidden': true,
                  style: {
                    opacity: 0,
                    pointerEvents: 'none',
                    userSelect: 'none',
                  },
                })}
              >
                {(() => {
                  if (!connected) {
                    return (
                      <Button size="sm" onClick={openConnectModal}>
                        Connect Wallet
                      </Button>
                    )
                  }

                  if (chain.unsupported) {
                    return (
                      <Button size="sm" onClick={handleSwitchNetwork}>
                        Switch Network
                      </Button>
                    )
                  }

                  return (
                    <Button size="sm" onClick={handleWriteClick}>
                      {isPending ? (
                        <RotateCwIcon className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <SendIcon className="mr-2 h-4 w-4" />
                      )}
                      Write
                    </Button>
                  )
                })()}
              </div>
            )
          }}
        </ConnectButton.Custom>
      </CardFooter>
    </Card>
  )
}
