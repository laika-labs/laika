import { User, UserNote, useAppActors } from './fixtures/actors'
import { beforeEach, describe, it } from '@serenity-js/playwright-test'
import { Navigate } from '@serenity-js/web'
import { Ensure, equals } from '@serenity-js/assertions'
import { notes } from '@serenity-js/core'
import { laikaWebAppUrl } from './fixtures/constants'
import {
  ClickCreateNewRequestDialog,
  FillAbi,
  FillContractAddrInput,
  SelectChain,
  SubmitCreateContractRequest,
} from './app/create-request/tasks'
import { contractAddressInput, selectedChain } from './app/create-request/questions'

describe('Create Contract Request', () => {
  useAppActors()

  beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      window.localStorage.setItem('evmCollections', '')
    })
  })

  it(`with ${User} should able to create new request from chain explorer.`, async ({ actorCalled }) => {
    await actorCalled(User).attemptsTo(
      Navigate.to(laikaWebAppUrl),
      ClickCreateNewRequestDialog('Chain Explorer'),
      SelectChain(),
      FillContractAddrInput(),
      SubmitCreateContractRequest(),
      Ensure.that(
        contractAddressInput.attribute('value'),
        equals(notes<UserNote>().get('requestContract').contractAddress),
      ),
      Ensure.that(selectedChain.text(), equals(notes<UserNote>().get('requestContract').chain)),
    )
  })

  it(`with ${User} should able to create new request by fill-in form.`, async ({ actorCalled }) => {
    await actorCalled(User).attemptsTo(
      Navigate.to(laikaWebAppUrl),
      ClickCreateNewRequestDialog('New Request'),
      SelectChain(),
      FillContractAddrInput(),
      FillAbi(),
      SubmitCreateContractRequest(),
      Ensure.that(
        contractAddressInput.attribute('value'),
        equals(notes<UserNote>().get('requestContract').contractAddress),
      ),
      Ensure.that(selectedChain.text(), equals(notes<UserNote>().get('requestContract').chain)),
    )
  })
})
