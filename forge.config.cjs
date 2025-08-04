/** @type {import('@electron-forge/shared-types').ForgeConfig} */
module.exports = {
  packagerConfig: {
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
      name: "@electron-forge/maker-dmg",
      config: {}
    }
  ]
}
