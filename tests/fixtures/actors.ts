import { Browser } from '@playwright/test'
import { Actor, Cast, Notepad, TakeNotes } from '@serenity-js/core'
import { BrowseTheWebWithPlaywright } from '@serenity-js/playwright'
import { test } from '@serenity-js/playwright-test'
import { testUsdtAbi } from '../mocks/abi'

export const User = 'user'

export interface UserNote {
  requestContract: {
    chain: string
    contractAddress: string
    abi: string
  }
}

const userData: Record<string, UserNote> = {
  [User]: {
    requestContract: {
      chain: 'OP Mainnet',
      contractAddress: '0x94b008aA00579c1307B0EF2c499aD98a8ce58e58',
      abi: testUsdtAbi,
    },
  },
}

export class AppActors implements Cast {
  constructor(private readonly browser: Browser) {}

  prepare(actor: Actor): Actor {
    const actorNote = userData[actor.name]
    const notepad = actorNote ? Notepad.with<UserNote>(actorNote) : Notepad.empty<UserNote>()

    return actor.whoCan(BrowseTheWebWithPlaywright.using(this.browser), TakeNotes.using(notepad))
  }
}

export const useAppActors = (): void =>
  test.use({
    actors: async ({ browser }, use) => use(new AppActors(browser)),
  })
