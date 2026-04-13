// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(
  {
    rules: {
      'vue/multi-word-component-names': 'off',
      '@stylistic/comma-dangle': 'off',
      'comma-dangle': 'off',
      '@stylistic/semi': 'off',
      '@stylistic/no-extra-semi': 'off',
      '@stylistic/member-delimiter-style': 'off',
      '@stylistic/quotes': 'off',
      '@stylistic/quote-props': 'off',
      'vue/html-quotes': 'off',
      'nuxt/nuxt-config-keys-order': 'off'
    }
  }
)
