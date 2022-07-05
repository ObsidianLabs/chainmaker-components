import platform from '@obsidians/platform'
import { t } from '@obsidians/i18n'

const PEM = [
`-----BEGIN CERTIFICATE-----
MIICSDCCAe6gAwIBAgIIJpmfvV5S33EwCgYIKoZIzj0EAwIwYjELMAkGA1UEBhMC
Q04xEDAOBgNVBAgTB0JlaWppbmcxEDAOBgNVBAcTB0JlaWppbmcxETAPBgNVBAoT
CG9yZy1yb290MQ0wCwYDVQQLEwRyb290MQ0wCwYDVQQDEwRyb290MB4XDTIyMDUx
MDEwNDQ0M1oXDTIyMTEwNjEwNDQ0M1owZDELMAkGA1UEBhMCQ04xEDAOBgNVBAgT
B0JlaWppbmcxEDAOBgNVBAcTB0JlaWppbmcxFzAVBgNVBAoTDm9yZzEuY210ZXN0
bmV0MQswCQYDVQQLEwJjYTELMAkGA1UEAxMCY2EwWTATBgcqhkjOPQIBBggqhkjO
PQMBBwNCAAS1+7yCgRCAG1UzA0UvwlkJgH9bUT03VSmleA7CNXunMjeEOK6/UiVP
OPL0ea3d9vtZKUCZ0qIJkFUjiGoyjGTvo4GLMIGIMA4GA1UdDwEB/wQEAwIBBjAP
BgNVHRMBAf8EBTADAQH/MCkGA1UdDgQiBCCTzC3I+UX0JV+VdPw2tVX1efP22/Zu
/cYIZDH/nf65UjArBgNVHSMEJDAigCAYphLqTPoKnaRWgPAHUrD4iEyNdA+m4K3c
xR2etMgZWTANBgNVHREEBjAEggCCADAKBggqhkjOPQQDAgNIADBFAiEA3yMt86gf
F5z87Jv0m+LfYz/S85cv5kE3+nHpl0i+Aq0CIGZONqD26h0V2LsAACwoXtGV9lum
IVZFV4Duo+panJRY
-----END CERTIFICATE-----`,
`-----BEGIN CERTIFICATE-----
MIICSDCCAe6gAwIBAgIIDVt9g6nWOyswCgYIKoZIzj0EAwIwYjELMAkGA1UEBhMC
Q04xEDAOBgNVBAgTB0JlaWppbmcxEDAOBgNVBAcTB0JlaWppbmcxETAPBgNVBAoT
CG9yZy1yb290MQ0wCwYDVQQLEwRyb290MQ0wCwYDVQQDEwRyb290MB4XDTIyMDUx
MDEwNDQ0M1oXDTIyMTEwNjEwNDQ0M1owZDELMAkGA1UEBhMCQ04xEDAOBgNVBAgT
B0JlaWppbmcxEDAOBgNVBAcTB0JlaWppbmcxFzAVBgNVBAoTDm9yZzIuY210ZXN0
bmV0MQswCQYDVQQLEwJjYTELMAkGA1UEAxMCY2EwWTATBgcqhkjOPQIBBggqhkjO
PQMBBwNCAASKsvIVwCJ34umU21qU1xH+dwrBD9G4SL+MMOYl9c2LpM/vHicWA7eI
FQUWJrMUymwy9yckc/MRvi/62iFiZdZko4GLMIGIMA4GA1UdDwEB/wQEAwIBBjAP
BgNVHRMBAf8EBTADAQH/MCkGA1UdDgQiBCCZlg9nA+ibEqg0pdTQHVpy0RYiQdI3
HKE9QPwW9aeILDArBgNVHSMEJDAigCAYphLqTPoKnaRWgPAHUrD4iEyNdA+m4K3c
xR2etMgZWTANBgNVHREEBjAEggCCADAKBggqhkjOPQQDAgNIADBFAiAk3lHVoJBk
I2q8vIfMryzqgdPye3qeyHhtNLS6FeEVuwIhAJKnlFaC16JJvcsIDXFGsK2idYr6
T04OXDlyGIzsxy0u
-----END CERTIFICATE-----`,
`-----BEGIN CERTIFICATE-----
MIICSDCCAe6gAwIBAgIIBXIJ/LARJNowCgYIKoZIzj0EAwIwYjELMAkGA1UEBhMC
Q04xEDAOBgNVBAgTB0JlaWppbmcxEDAOBgNVBAcTB0JlaWppbmcxETAPBgNVBAoT
CG9yZy1yb290MQ0wCwYDVQQLEwRyb290MQ0wCwYDVQQDEwRyb290MB4XDTIyMDUx
MDEwNDQ0M1oXDTIyMTEwNjEwNDQ0M1owZDELMAkGA1UEBhMCQ04xEDAOBgNVBAgT
B0JlaWppbmcxEDAOBgNVBAcTB0JlaWppbmcxFzAVBgNVBAoTDm9yZzMuY210ZXN0
bmV0MQswCQYDVQQLEwJjYTELMAkGA1UEAxMCY2EwWTATBgcqhkjOPQIBBggqhkjO
PQMBBwNCAARCgRFG7pnL1okEaOQY3YdDNRHRG/e0BV7feKTl0cTualTYmirHTfze
eQFI1yqKArO8dKSWNETyut02eGlWPsHQo4GLMIGIMA4GA1UdDwEB/wQEAwIBBjAP
BgNVHRMBAf8EBTADAQH/MCkGA1UdDgQiBCB9gXIiBtZzijobZz2OXFAvHk80gNI7
WWSu8+0/QlyvUTArBgNVHSMEJDAigCAYphLqTPoKnaRWgPAHUrD4iEyNdA+m4K3c
xR2etMgZWTANBgNVHREEBjAEggCCADAKBggqhkjOPQQDAgNIADBFAiEArwK4SL5F
wYZEjSoz1/A1Pd4rRsj+xwSnF3mvnpRn7coCIG/3gpMa9wu4Etu6D8CsYnxEGnuo
R7yI2228VWlDyFtx
-----END CERTIFICATE-----`,
`-----BEGIN CERTIFICATE-----
MIICRzCCAe6gAwIBAgIIJHWo1TNDwgcwCgYIKoZIzj0EAwIwYjELMAkGA1UEBhMC
Q04xEDAOBgNVBAgTB0JlaWppbmcxEDAOBgNVBAcTB0JlaWppbmcxETAPBgNVBAoT
CG9yZy1yb290MQ0wCwYDVQQLEwRyb290MQ0wCwYDVQQDEwRyb290MB4XDTIyMDUx
MDEwNDQ0M1oXDTIyMTEwNjEwNDQ0M1owZDELMAkGA1UEBhMCQ04xEDAOBgNVBAgT
B0JlaWppbmcxEDAOBgNVBAcTB0JlaWppbmcxFzAVBgNVBAoTDm9yZzQuY210ZXN0
bmV0MQswCQYDVQQLEwJjYTELMAkGA1UEAxMCY2EwWTATBgcqhkjOPQIBBggqhkjO
PQMBBwNCAASHnbggKxwve7pC9hlkNKMpcMfvSgQ8rt1+3xS1ucQG1fVWt1S/Kd8+
JTQOYtatPSsqqUL6el7L/3wh+f9TMbpko4GLMIGIMA4GA1UdDwEB/wQEAwIBBjAP
BgNVHRMBAf8EBTADAQH/MCkGA1UdDgQiBCAZ5DbXH/F1Phf45VV0q9TOyYYFAZrK
+F8a635JJYkgXDArBgNVHSMEJDAigCAYphLqTPoKnaRWgPAHUrD4iEyNdA+m4K3c
xR2etMgZWTANBgNVHREEBjAEggCCADAKBggqhkjOPQQDAgNHADBEAiBx3dBR5KJu
eaH/doklKRZMOu4iAuICNvbkOncdcILyfgIgBJc+Af2WVdXwFP7FD5TgpOS/Q8hw
3JlSknYu6bi+Bx4=
-----END CERTIFICATE-----`,
]

const networks = [
  {
    id: 'testnode-1',
    group: 'Test Chain',
    name: 'org1-cmtestnet',
    fullName: 'org1-cmtestnet',
    icon: 'fas fa-globe',
    notification: `${t('network.network.switchedTo')} <b>Chainmaker org1-cmtestnet</b>.`,
    url: '152.136.217.46:12302',
    chainId: 'chainmaker_testnet_chain',
    symbol: '',
    orgId: 'org5.cmtestnet',
    nodeConfigArray: [
      {
        nodeAddr: '152.136.217.46:12302',
        tlsEnable: true,
        options: {
          pem: PEM[0],
          clientKey: '',
          clientCert:  '',
          hostName: 'common1.tls.org1.cmtestnet'
        },
      }
    ],
    userKeyString: '',
    userCertString: '',
    preset: true
  },
  {
    id: 'testnode-2',
    group: 'Test Chain',
    name: 'org2-cmtestnet',
    fullName: 'org2-cmtestnet',
    icon: 'fas fa-globe',
    notification: `${t('network.network.switchedTo')} <b>Chainmaker org2-cmtestnet</b>.`,
    url: '49.232.86.161:12302',
    chainId: 'chainmaker_testnet_chain',
    symbol: '',
    orgId: 'org5.cmtestnet',
    nodeConfigArray: [
      {
        nodeAddr: '49.232.86.161:12302',
        tlsEnable: true,
        options: {
          pem: PEM[1],
          clientKey: '',
          clientCert: '',
          hostName: 'common1.tls.org2.cmtestnet'
        },
      }
    ],
    userKeyString: '',
    userCertString: '',
    preset: true
  },
  // {
  //   id: 'testnode-3',
  //   group: 'Test Chain',
  //   name: 'org3-cmtestnet',
  //   fullName: 'org3-cmtestnet',
  //   icon: 'fas fa-globe',
  //   notification: `${t('network.network.switchedTo')} <b>Chainmaker org3-cmtestnet</b>.`,
  //   url: '49.232.86.161:12302',
  //   chainId: 'chainmaker_testnet_chain',
  //   symbol: '',
  //   orgId: 'org5.cmtestnet',
  //   nodeConfigArray: [
  //     {
  //       nodeAddr: '49.232.86.161:12302',
  //       tlsEnable: true,
  //       options: {
  //         pem: PEM[2],
  //         clientKey: '',
  //         clientCert: '',
  //         hostName: 'common1.tls.org3.cmtestnet'
  //       },
  //     }
  //   ],
  //   userKeyString: '',
  //   userCertString: ''
  // }
  // {
  //   id: 'testnode-4',
  //   group: 'Test Chain',
  //   name: 'org4-cmtestnet',
  //   fullName: 'org4-cmtestnet',
  //   icon: 'fas fa-globe',
  //   notification: `${t('network.network.switchedTo')} <b>Chainmaker org4-cmtestnet</b>.`,
  //   url: '152.136.210.129:12304',
  //   chainId: 'chainmaker_testnet_chain',
  //   symbol: '',
  //   orgId: 'org5.cmtestnet',
  //   nodeConfigArray: [
  //     {
  //       nodeAddr: '152.136.210.129:12304',
  //       tlsEnable: true,
  //       options: {
  //         pem: PEM[3],
  //         clientKey: '',
  //         clientCert: '',
  //         hostName: 'common1.tls.org4.cmtestnet'
  //       },
  //     }
  //   ],
  //   userKeyString: '',
  //   userCertString: ''
  // }
]

if (platform.isDesktop) {
  networks.unshift({
    id: 'dev',
    group: 'default',
    name: 'Development',
    fullName: 'Development',
    icon: 'fas fa-laptop-code',
    notification: `${t('network.network.switchedTo')} <b>Ethereum Instances for Development</b> ${t('network.network.networkLow')}.`,
    url: 'http://localhost:8545',
    chainId: 0,
    symbol: 'ETH',
  })
}

export default networks

export const customNetworks = [
  {
    id: 'custom',
    group: 'others',
    name: 'Custom',
    fullName: 'Custom Network',
    icon: 'fas fa-edit',
    notification: `${t('network.network.switchedTo')} <b>Custom</b> ${t('network.network.networkLow')}.`,
    url: '',
    symbol: 'ETH',
  }
]