import { Task, Wait, notes } from '@serenity-js/core'
import { By, PageElement, Click, PageElements, Text, Enter } from '@serenity-js/web'
import { isPresent, equals } from '@serenity-js/assertions'
import { UserNote } from '../../fixtures/actors'

const newRequestBtn = PageElement.located(By.css('[aria-haspopup="dialog"]')).describedAs('New request button')

const triggerNewRequestDialogBtn = (text: string) =>
  PageElements.located(By.css('.font-semibold.leading-none.tracking-tight'))
    .describedAs('new request type button')
    .where(Text, equals(text))
    .first()

const newRequestSelectChainBtn = PageElement.located(By.css('button[role="combobox"]')).describedAs(
  'select chain dropdown button',
)

const selectChainItem = PageElements.located(By.css('[role="option"]'))
  .describedAs('chain')
  .where(Text, equals(notes<UserNote>().get('requestContract').chain))
  .first()

const newRequestContractAddrInput = PageElement.located(
  By.css('[placeholder="Paste your smart contract address here."]').describedAs('contract address input'),
)

const submitCreateRequest = PageElements.located(By.css('[type="submit"]')).describedAs('submit button').first()

export const ClickCreateNewRequestDialog = (): Task =>
  Task.where(
    '#actor create new request of a contract',
    Wait.until(newRequestBtn, isPresent()),
    Click.on(newRequestBtn),
    Wait.until(triggerNewRequestDialogBtn('Chain Explorer'), isPresent()),
    Click.on(triggerNewRequestDialogBtn('Chain Explorer')),
  )

export const FillContractAddrInput = (): Task =>
  Task.where(
    '#actor type contract address input',
    Wait.until(newRequestContractAddrInput, isPresent()),
    Enter.theValue(notes<UserNote>().get('requestContract').contractAddress).into(newRequestContractAddrInput),
  )

export const SelectChain = (): Task =>
  Task.where(
    '#actor select chain',
    Wait.until(newRequestSelectChainBtn, isPresent()),
    Click.on(newRequestSelectChainBtn),
    Wait.until(selectChainItem, isPresent()),
    Click.on(selectChainItem),
  )

export const SubmitCreateContractRequest = (): Task =>
  Task.where('#actor load contract', Wait.until(submitCreateRequest, isPresent()), Click.on(submitCreateRequest))
