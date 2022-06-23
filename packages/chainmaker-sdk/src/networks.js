// import platform from '@obsidians/platform'
import { t } from '@obsidians/i18n'

const PEM = `-----BEGIN CERTIFICATE-----
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
-----END CERTIFICATE-----`

const networks = [
  {
    id: 'testnode-1',
    group: 'Test Chain',
    name: 'TestNet',
    fullName: 'Chainmaker TestNet',
    icon: 'fas fa-globe',
    notification: `${t('network.network.switchedTo')} <b>Chainmaker TestNet</b>.`,
    url: '152.136.217.46:12302',
    chainId: 'chainmaker_testnet_chain',
    symbol: '',
    orgId: 'org5.cmtestnet',
    nodeConfigArray: [
      {
        nodeAddr: '152.136.217.46:12302',
        tlsEnable: true,
        options: {
          pem: PEM,
          clientKey: '',
          clientCert:  '',
          hostName: 'common1.tls.org1.cmtestnet'
        },
      }
    ],
    userKeyString: '',
    userCertString: ''
  }
]
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