import type { CheckDef } from './run'

const BUTTON = 'Keep the button in the panel so it can be clicked.'
const flags = (values: unknown[]) => values.filter((value): value is boolean => typeof value === 'boolean')

export const lesson1: CheckDef[] = [
  {
    id: 'toggles-state',
    async run(ctx) {
      const isDark = () => flags(ctx.allState())
      const before = isDark()
      ctx.expect(before.length === 1, 'The panel should keep isDark with useState(false).')
      await ctx.click(ctx.need(ctx.find('button'), BUTTON))
      ctx.expect(isDark()[0] !== before[0], 'Clicking the button did not change isDark. Call setIsDark inside handleToggle.')
      await ctx.click(ctx.need(ctx.find('button'), BUTTON))
      ctx.expect(
        isDark()[0] === before[0],
        'A second click should switch isDark back. Set it to the opposite of its current value, not to a fixed value.',
      )
    },
  },
  {
    id: 'theme-follows-state',
    async run(ctx) {
      const panel = ctx.need(ctx.find('section'), 'Keep the <section> that wraps the settings panel.')
      const isDark = () => flags(ctx.allState())[0]
      const themeMatches = () => panel.classList.contains('dark') === isDark() && panel.classList.contains('light') === !isDark()
      ctx.expect(themeMatches(), 'The panel class should be "dark" when isDark is true and "light" when it is false.')
      const startedAs = isDark()
      await ctx.click(ctx.need(ctx.find('button'), BUTTON))
      ctx.expect(isDark() !== startedAs, 'isDark has not changed yet, so the theme cannot change. Start with the first objective.')
      ctx.expect(themeMatches(), 'isDark changed but the panel theme did not follow it. Use isDark to choose the panel class.')
    },
  },
  {
    id: 'label-follows-state',
    async run(ctx) {
      const label = () => ctx.text(ctx.need(ctx.find('button'), BUTTON))
      const isDark = () => flags(ctx.allState())[0]
      const labelMatches = () => (isDark() ? /light/i : /dark/i).test(label())
      ctx.expect(labelMatches(), 'The button should offer light mode while isDark is true, and dark mode while it is false.')
      const startedAs = isDark()
      await ctx.click(ctx.need(ctx.find('button'), BUTTON))
      ctx.expect(isDark() !== startedAs, 'isDark has not changed yet, so the label cannot change. Start with the first objective.')
      ctx.expect(labelMatches(), 'isDark changed but the button label did not follow it. Use isDark to choose the label.')
    },
  },
]
