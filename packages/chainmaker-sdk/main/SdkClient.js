const { Sdk, User, Utils } = require('chainmaker-sdk');
const fs = require('fs')
const path = require('path');
const methods = require('./SdkMethods')
const os = require('os');

const convertToBuffer = str => Buffer.from(JSON.parse(JSON.stringify(str)), 'utf-8')

const getNodeConfig = ({ nodeAddr, tlsEnable, options}) => {
  return [{
    nodeAddr,
    tlsEnable,
    options: {
      pem: convertToBuffer(options.pem),
      clientKey: convertToBuffer(options.clientKey),
      clientCert: convertToBuffer(options.clientCert),
      hostName: options.hostName
    }
  }]
}

module.exports = class SdkClient {
  constructor() {
    this.utils = Utils
    this.sdkInstance = null
    this.sdkMethods = null
    this.userList = []
    this.nodeConfigArray = []
    this.userKeyPathFile = null
    this.userCrtPathFile= null
  }

   saveToTemp({ userKeyString, userCertString }) {
    this.userKeyPathFile = path.join(os.tmpdir(), 'tempUser.key')
    this.userCrtPathFile = path.join(os.tmpdir(), 'tempUser.crt')
    fs.writeFileSync(this.userKeyPathFile, userKeyString)
    fs.writeFileSync(this.userCrtPathFile, userCertString)
  }

  removeTemp() {
    if (!this.userKeyPathFile || !this.userCrtPathFile) return
    fs.unlinkSync(this.userKeyPathFile)
    fs.unlinkSync(this.userCrtPathFile)
    this.userCrtPathFile = this.userCrtPathFile = ''
  }

  initSDK({ chainId, orgId, userKeyString, userCertString, nodeConfigArray, timeout }) {
    if (!this.userCrtPathFile || !this.userKeyPathFile) {
      this.saveToTemp({ userKeyString, userCertString })
    }
    this.sdkInstance = new Sdk(
      chainId,
      orgId,
      this.userKeyPathFile,
      this.userCrtPathFile,
      getNodeConfig(nodeConfigArray[0]),
      3000
    )
  }

  initUserList({ orgId, userKeyString, userCertString }) {
    if (!this.userCrtPathFile || !this.userKeyPathFile) {
      this.saveToTemp({ userKeyString, userCertString })
    }
    const newUser = new User(
      orgId,
      this.userKeyPathFile,
      this.userCrtPathFile,
    )
    this.userList.push(newUser)
  }

  initMethods() {
    const callMethods = (sdk, methods) => (name, ...data) => methods[name](sdk, ...data)
    this.callSdkMethods = callMethods(this.sdkInstance, methods)
  }

  invokeMethods(name, ...data) {
   return this.callSdkMethods(name, ...data)
  }
}