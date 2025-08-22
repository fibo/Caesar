const { FusesPlugin } = require('@electron-forge/plugin-fuses')
const { FuseV1Options, FuseVersion } = require('@electron/fuses')
const path = require('path')

/** @type {import('@electron-forge/shared-types').ForgeConfig} */
module.exports = {
  packagerConfig: {
    appCategoryType: 'public.app-category.utilities',
    asar: true,
    icon: path.resolve(__dirname, 'assets', 'logos', 'Caesar'),
    ignore: [
      /README\.md/,
      /\.editorconfig/,
      /\.github/,
      /\.gitignore/,
      /\.lefthook\.yml/,
      /\.npmrc/,
      /\.prettierrc/,
      /assets\/images\/dmg-installer-background\.png/,
      /assets\/logos\//,
      /assets\/videos\//,
      /forge\.config\.cjs/,
      /tsconfig\.json/
    ],
    name: 'Caesar'
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
        ),
        icon: path.join(__dirname, 'assets', 'logos', 'Caesar.icns')
      }
    },
    {
      name: '@electron-forge/maker-squirrel',
      platforms: ['win32'],
      config: () => ({
        iconUrl:
          'https://raw.githubusercontent.com/fibo/Caesar/refs/heads/main/assets/logos/Caesar.ico',
        loadingGif: path.join(
          __dirname,
          'assets',
          'videos',
          'ALEA_IACTA_EST.gif'
        ),
        setupIcon: path.join(__dirname, 'assets', 'logo', 'Caesar.ico')
      })
    }
  ],
  plugins: [
    new FusesPlugin({
      version: FuseVersion.V1,
      [FuseV1Options.RunAsNode]: false,
      [FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
      [FuseV1Options.EnableNodeCliInspectArguments]: false,
      [FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: true,
      [FuseV1Options.OnlyLoadAppFromAsar]: true
    })
  ]
}
