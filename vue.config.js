module.exports = {
    pluginOptions: {
      electronBuilder: {
        builderOptions: {
          appId: 'WarpLauncher',
          productName: 'WarpLauncher',
          publish: [
            {
              provider: 'github',
              owner: 'NoFrosty',
              repo: 'fantastic-octo-memory'
            }
          ],
          win: {
            target: [
            {
              target: "nsis",
              arch: ["x64"]
            }
          ]
        },
          nsis: {
            oneClick: true,
            perMachine: false
          },
          compression: 'maximum',
          copyright: '© 2019-2020 Evorine All Rights Reserved'
        }
      },
      i18n: {
        locale: 'en',
        fallbackLocale: 'en',
        localeDir: 'locales',
        enableInSFC: false
      }
    }
  }
