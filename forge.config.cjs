const path = require('path')

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
      /assets\/images\/dmg-installer-background\.png/,
      /forge\.config\.cjs/,
      /tsconfig\.json/
    ]
  },
  makers: [
    {
      name: '@electron-forge/maker-dmg',
      config: {
        // Template image: node_modules/electron-installer-dmg/resources/mac/background.png
        background: path.join(
          __dirname,
          'assets',
          'images',
          'dmg-installer-background.png'
        )
      }
    }
  ]
}
