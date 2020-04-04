module.exports = {
    pluginOptions: {
        electronBuilder: {
            builderOptions: {
                appId: "WarpLauncher",
                productName: "WarpLauncher",
                publish: [ {
                    provider: "github",
                    owner: "NoFrosty",
                    repo:"fantastic-octo-memory"
                }],
                nsis: {
                    displayLanguageSelector: true,
                    oneClick: false,
                    perMachine: false,
                    allowElevation: true,
                    allowToChangeInstallationDirectory: true
                },
                compression: 'maximum',
                copyright: "© 2019-2020 Evorine All Rights Reserved",
            }
        }
    }
  }