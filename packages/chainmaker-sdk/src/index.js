import kp from './keyPairs'
import networks, { customNetworks } from './networks'
import invokeClient from './client'
import utils from './utils'
import { IpcChannel } from '@obsidians/ipc'
import notification from '@obsidians/notification'

let current
const channel = new IpcChannel('sdk')
channel.off('error')
channel.on('error', msg => {
  current && current.dismiss()
  current = notification.error('Error', msg)
})

const getFinalSDK = ({ kp, networks,  customNetworks = [], utils,  Client }) => {
  return class Sdk {
    static get kp() { return kp }
    static get networks() { return networks }
    static get customNetworks() { return customNetworks }

    constructor() {
      this.client = new Client()
    }

    get utils() { return utils }

    dispose() { this.client.dispose() }

    isValidAddress(address) { }

    async networkInfo() { }

    async getStatus() { }

    async latest() { }

    async getTransferTransaction() { }

    async getDeployTransaction() { }

    sendTransaction(arg) { }

    async getTransactions() { }

    async getTokens(address) { }

    async getTokenInfo(address) { }

  }
}

export default getFinalSDK({
  kp,
  networks,
  customNetworks,
  invokeClient,
  utils
})

export {
  getFinalSDK,
  kp,
  invokeClient,
  utils
}

export { default as redux } from './redux'
