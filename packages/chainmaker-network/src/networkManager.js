import platform from '@obsidians/platform'
import headerActions from '@obsidians/chainmaker-header'
import notification from '@obsidians/notification'
import redux from '@obsidians/redux'
import { t } from '@obsidians/i18n'
import keypairManager from '@obsidians/keypair'

import { getCachingKeys, dropByCacheKey } from 'react-router-cache-route'

class NetworkManager {
  constructor() {
    this.networks = []
    this._sdk = null
    this.network = undefined
    this.Sdks = new Map()
  }

  get networkId() {
    return this.network?.id
  }

  get Sdk() {
    return this.Sdks.get(this.networkId)
  }

  get sdk() {
    return this._sdk
  }

  get current() {
    return this.networks.find(n => n.id === this.networkId)
  }

  get symbol() {
    return this.current?.symbol
  }

  addSdk(Sdk, networks) {
    networks.forEach(n => this.Sdks.set(n.id, Sdk))
    this.networks = [...this.networks, ...networks]
    const enabled = !process.env.REACT_APP_DISABLE_BROWSER_EXTENSION
  }

  addNetworks(networks) {
    networks.forEach(n => this.Sdks.set(n.id, this.Sdks.get(n.id)))
    this.networks = networks
  }

  deleteNetwork(networkId) {
    const index = this.networks.findIndex(n => n.id === networkId)
    if (index === -1) {
      return
    }
    this.networks.splice(index, 1)
    this.Sdks.delete(networkId)
  }

  async getUserKeyFilePath(address) {
    const allKeys = await keypairManager.loadAllKeypairs()
    if (!allKeys.length) return null
    const targetAdress = address ?
      allKeys.find(item => item.address === address).address
      : allKeys[0].address
 
    const readKeys = await keypairManager.getSecret(targetAdress)
    return JSON.parse(readKeys)
  }

  getCustomNetParams(oldParam) {
    const { name, chainId, orgId, ipAdress, pem, tlsEnable, hostName, user } = oldParam
    return {
      id: name,
      preset: false,
      name: name,
      fullName: name,
      icon: 'fas fa-globe',
      chainId: chainId,
      orgId: orgId,
      url: ipAdress,
      nodeConfigArray: [
        {
          nodeAddr: ipAdress,
          tlsEnable: tlsEnable,
          options: {
            pem: pem,
            clientKey: '',
            clientCert: '',
            hostName: hostName
          },
        }
      ],
      userKeyString: '',
      userCertString: '',
      user: user
    }
  }

  async updateCustomNetwork({ url, name, option = {}, notify = true }) {
    const info = await this.createSdk(option, true)


    if (info && notify) {
      redux.dispatch('SELECT_NETWORK', option.name)
      redux.dispatch('CHANGE_NETWORK_STATUS', true)
      redux.dispatch('ADD_CUSTOM_NETWORK', option)
      notification.success(t('network.network.connected'), `${t('network.network.connectedTo')} <b>${name || url}</b>`)
    }

    return info
  }

  async createSdk(params, isCustom = false) {
    const sdk = await this.newSdk(params, isCustom)
    try {
      const info = await sdk.networkInfo()
      this._sdk = sdk
      return info
    } catch (e) {
      console.warn(e)
      notification.error('Invalid Parameters', '')
      return false
    }
  }


  async newSdk(params, isCustom = false) {
    const networkId = isCustom ? 'custom' : params.id.split('.')[0]
    const Sdk = this.Sdks.get(networkId)
    const userKeys = await this.getUserKeyFilePath(params.preset ? null : params.user)
    const { nodeConfigArray } = params
    if (!userKeys) {
      notification.error('No Available Keypiar', 'Please create or import a keypair in the keypair manager first.')
      return null
    }
    if (!Sdk) return null
   

    params.nodeConfigArray[0].options = {
      ...nodeConfigArray[0].options,
      clientKey: userKeys.tlsKey,
      clientCert: userKeys.tlsCrt
    }
    params.userCertString = userKeys.signCrt
    params.userKeyString = userKeys.signKey
    
    return new Sdk(params)
  }

  async updateSdk(params) {
    this._sdk = await this.newSdk({ ...this.network, ...params })
    await new Promise(resolve => {
      const h = setInterval(() => {
        if (!this.sdk) {
          clearInterval(h)
          return
        }
        this.sdk.getStatus().then(() => {
          clearInterval(h)
          resolve()
        }).catch(() => null)
      }, 1000)
    })
  }

  async disposeSdk() {
    this._sdk && this._sdk.dispose()
    if (this.networkId === 'dev') {
      this._sdk = null
    }
    if (this.onSdkDisposedCallback) {
      this.onSdkDisposedCallback()
    }
  }

  onSdkDisposed(callback) {
    this.onSdkDisposedCallback = callback
  }

  async reconnectNetwork() {
    this.setNetwork(this.network)
  }

  async setNetwork(network, { force, redirect = true, notify = true } = {}) {
    redux.dispatch('ACTIVE_CUSTOM_NETWORK', network)
    if (!network || network.id === redux.getState().network) return
  
    const cachingKeys = getCachingKeys()
    cachingKeys.filter(key => key.startsWith('contract-') || key.startsWith('account-')).forEach(dropByCacheKey)

    this.network = network
    if (network.id && network.id !== 'dev') {
      try {
        this._sdk = await this.newSdk(network)
      } catch (error) {
        this._sdk && this._sdk.dispose()
        this._sdk = null
      }
    } else {
      this._sdk && this._sdk.dispose()
      this._sdk = null
    }

    redux.dispatch('SELECT_NETWORK', network.id)

    if (notify) {
      network.notification && notification.success(t('network.network.network'), network.notification)
      redux.dispatch('CHANGE_NETWORK_STATUS', true)
    }
    if (redirect) {
      headerActions.updateNetwork(network.id)
    }
  }
}

export default new NetworkManager()