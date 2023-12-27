import { Task, Wait, notes } from '@serenity-js/core'
import { By, PageElement, Click, PageElements, Text, Enter } from '@serenity-js/web'
import { isPresent, equals } from '@serenity-js/assertions'
import { UserNote } from '../../fixtures/actors'

const newRequestBtn = PageElement.located(By.css('[aria-haspopup="dialog"]')).describedAs('New request button')

const triggerNewRequestDialogBtn = (text: string) =>
  PageElements.located(By.css('h3.font-semibold.leading-none.tracking-tight'))
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

const newRequestAbiInput = PageElement.located(By.css('textarea[name="abi"]')).describedAs('abi text area')

const submitCreateRequest = PageElements.located(By.css('[type="submit"]')).describedAs('submit button').first()

export const ClickCreateNewRequestDialog = (type: string): Task =>
  Task.where(
    '#actor create new request of a contract',
    Wait.until(newRequestBtn, isPresent()),
    Click.on(newRequestBtn),
    Wait.until(triggerNewRequestDialogBtn(type), isPresent()),
    Click.on(triggerNewRequestDialogBtn(type)),
  )

export const FillContractAddrInput = (): Task =>
  Task.where(
    '#actor type contract address input',
    Wait.until(newRequestContractAddrInput, isPresent()),
    Enter.theValue(notes<UserNote>().get('requestContract').contractAddress).into(newRequestContractAddrInput),
  )

export const FillAbi = (): Task =>
  Task.where(
    '#actor fill contract abi',
    Wait.until(newRequestAbiInput, isPresent()),
    Enter.theValue(notes<UserNote>().get('requestContract').abi).into(newRequestAbiInput),
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
