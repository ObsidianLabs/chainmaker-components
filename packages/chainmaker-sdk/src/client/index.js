import platform from '@obsidians/platform'
import { IpcChannel } from '@obsidians/ipc'
const { REACT_APP_SERVER_URL } = process.env

export default class InvokeClient {
  constructor() {
    this.channel = platform.isDesktop ? new IpcChannel('sdk') : new IpcChannel()
  }

  invokeInit(initOption) {
    this.channel.invoke('inint', initOption)
  }

  invokeCall(methodName, ...data) {
    return this.channel.invoke('call', { methodName, ...data })
  }

  dispose() {}
}