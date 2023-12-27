import { By, PageElement } from '@serenity-js/web'

export const contractAddressInput = PageElement.located(
  By.css('input[name="address"][placeholder="Contract Address"]'),
).describedAs('contract address input')

export const selectedChain = PageElement.located(By.css('button[role="combobox"] span')).describedAs('contract chain')
