import { describe } from 'node:test'
import { User, useAppActors } from './fixtures/actors'
import { it } from '@serenity-js/playwright-test'
import { Navigate } from '@serenity-js/web'
import { laikaWebAppUrl } from './fixtures/constants'
import {
  ClickCreateNewRequestDialog,
  FillContractAddrInput,
  SelectChain,
  SubmitCreateContractRequest,
} from './app/create-request/tasks'

describe('Contract Request', () => {
  useAppActors()

  it(`with ${User} should able to create new request.`, async ({ actorCalled }) => {
    await actorCalled(User).attemptsTo(
      Navigate.to(laikaWebAppUrl),
      ClickCreateNewRequestDialog(),
      SelectChain(),
      FillContractAddrInput(),
      SubmitCreateContractRequest(),
    )
  })
})
