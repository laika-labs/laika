import { By, PageElement } from '@serenity-js/web'

export const contractAddressInput = PageElement.located(By.css('input[name="address"]')).describedAs(
  'contract address input',
)

export const selectedChain = PageElement.located(By.css('button[role="combobox"]')).describedAs('contract chain')
