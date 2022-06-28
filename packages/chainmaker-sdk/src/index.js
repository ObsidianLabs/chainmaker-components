import kp from './keyPair'
import networks, { customNetworks } from './networks'
import Client from './client'
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

    constructor(data) {
      this.networkId = data.id
      this.client = new Client(data)
    }

    get utils() { return utils }

    dispose() { this.client.dispose() }

    isValidAddress(address) { }

    async networkInfo() { 
      return this.client.networkInfo()
    }

    async getStatus() { 
      return this.client.getStatus()
    }

    async latest() { 
      return this.client.latest()
    }

    async getTransferTransaction() { 
      return this.client.getTransactions()
    }

    async getDeployTransaction() {
      console.log('getDeployTransaction')
      return ''
     }

    sendTransaction(arg) { 
      console.log('sendTransaction')
      return ''
    }

    async getTransactions() {
      console.log('getTransactions')
      return ''
     }

    async getTokens(address) { 
      console.log('getTokens')
      return ''
    }

    async getTokenInfo(address) {
      console.log('getTokenInfo')
      return ''
     }

  }
}

export default getFinalSDK({
  kp,
  networks,
  customNetworks,
  utils,
  Client
})

export {
  getFinalSDK,
  kp,
  utils,
  Client
}

export { default as redux } from './redux'
