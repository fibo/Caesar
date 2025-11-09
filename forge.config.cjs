const path = require('node:path')
const { MakerBase } = require('@electron-forge/maker-base')
const { FusesPlugin } = require('@electron-forge/plugin-fuses')
const { FuseV1Options, FuseVersion } = require('@electron/fuses')
const { build } = require('app-builder-lib')
const pkg = require('./package.json')

const assetsDir = path.resolve(__dirname, 'app', 'ui', 'assets')

class NsisMaker extends MakerBase {
  name = 'nsis'
  defaultPlatforms = ['win32']

  isSupportedOnCurrentPlatform() {
    return process.platform === 'win32'
  }

  /** @param {import('@electron-forge/maker-base').MakerOptions} options */
  async make({ dir, targetArch }) {
    // Started from this code found in
    // https://github.com/electron-userland/electron-builder/blob/e5f5799fbb193a7a8700fcaaf1ab9e79c9c694ce/packages/electron-forge-maker-nsis/main.js#L12
    //
    //   return buildForge(options, { win: [`nsis:${options.targetArch}`] });
    //
    return build({
      prepackaged: dir,
      publish: null,
      config: {
        directories: {
          output: path.resolve(dir, '..', 'make')
        },
        icon: path.join(assetsDir, 'logos', 'Caesar.ico'),
        mac: {
          identity: null
        },
        win: {
          artifactName: `Caesar-installer-v${pkg.version}.exe`,
          cscLink: null
        }
      },
      win: [`nsis:${targetArch}`]
    })
  }
}

/** @type {import('@electron-forge/shared-types').ForgeConfig} */
module.exports = {
  hooks: {
    readPackageJson: async (_forgeConfig, packageJson) => {
      delete packageJson.author
      delete packageJson.keywords
      delete packageJson.scripts
      delete packageJson.volta
      return packageJson
    }
  },
  makers: [
    // Windows installer.
    new NsisMaker(),

    // MacOS installer.
    {
      name: '@electron-forge/maker-dmg',
      config: {
        // Template image: node_modules/electron-installer-dmg/resources/mac/background.png
        background: path.join(
          assetsDir,
          'images',
          'dmg-installer-background.png'
        ),
        icon: path.join(assetsDir, 'logos', 'Caesar.icns')
      }
    }
  ],
  packagerConfig: {
    appCategoryType: 'public.app-category.utilities',
    asar: true,
    icon: path.resolve(assetsDir, 'logos', 'Caesar'),
    ignore: [
      /README\.md/,
      /\.editorconfig/,
      /\.github/,
      /\.gitignore/,
      /\.lefthook\.yml/,
      /\.npmrc/,
      /\.prettierrc/,
      /app\/ui\/assets\/images\/dmg-installer-background\.png/,
      /app\/ui\/assets\/logos\//,
      /forge\.config\.cjs/,
      /tsconfig\.json/
    ],
    name: 'Caesar'
  },
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
