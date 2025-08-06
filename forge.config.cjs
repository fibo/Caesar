/** @type {import('@electron-forge/shared-types').ForgeConfig} */
module.exports = {
  packagerConfig: {
    appCategoryType: 'public.app-category.utilities',
    asar: true,
    ignore: [
      /README\.md/,
      /\.editorconfig/,
      /\.github/,
      /\.gitignore/,
      /\.lefthook\.yml/,
      /\.npmrc/,
      /\.prettierrc/,
      /forge\.config\.cjs/,
      /tsconfig\.json/
    ]
  },
  makers: [
    {
      name: '@electron-forge/maker-dmg',
      config: {}
    }
  ]
}
