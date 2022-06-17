// import platform from '@obsidians/platform'
import { t } from '@obsidians/i18n'

const networks = []
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