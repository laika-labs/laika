import { describe, it } from '@serenity-js/playwright-test'
import { Navigate, PageElements, By } from '@serenity-js/web'
import { Ensure, equals } from '@serenity-js/assertions'

describe('Todo List', () => {
  // - feature or component name

  const displayedItems = () => PageElements.located(By.css('.todo-list li')).describedAs('displayed items')

  describe('when the user is', () => {
    // - one or more nested `describe` blocks
    describe('a guest', () => {
      //   to group scenarios
      describe('their list', () => {
        //   by context in which they apply

        it('is empty', async ({ actor }) => {
          // - verify expected behaviour
          await actor.attemptsTo(
            //   using a default `actor`
            Navigate.to('https://todo-app.serenity-js.org/'),
            Ensure.that(displayedItems().count(), equals(0)),
          )
        })
      })
    })
  })
})
