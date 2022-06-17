const { Sdk, User, Utils } = require('chainmaker-sdk');
const fs = require('fs')
const path = require('path');
const methods = require('./SdkMethods')

const getFilePath = path => path.join(__dirname, path)
const readFile = path => fs.readFileSync(path.join(__dirname, path))
// const getNodeConfig = ({ nodeAddr, tlsEnable, caPath, clientKeyPath, clientCertPath, hostName }) => {
//   return {
//     nodeAddr,
//     tlsEnable,
//     options: {
//       pem: readFile(caPath),
//       clientKey: readFile(clientCertPath),
//       clientCert: readFile(clientKeyPath),
//       hostName
//     }
//   }
// }

module.exports = class SdkClient {
  constructor() {
    this.utils = Utils
    this.sdkInstance = null
    this.sdkMethods = null
    this.userList = []
    this.nodeConfigArray = []
  }

  // updateNodeConfigArr = (nodeInfo) => {
  //   this.nodeConfigArray = nodeInfo.reduce((prev, cur) => {
  //     prev.push(getNodeConfig(cur))
  //     return prev
  //   }, [])
  // }

  initSDK({ chainId, orgId, userKeyPath, userCertPath, nodeConfigArray, timeout }) {
    this.sdkInstance = new Sdk(
      chainId,
      orgId,
      userKeyPathFile = getFilePath(userKeyPath),
      userCertPathFile = getFilePath(userCertPath),
      nodeConfigArray,
      timeout
    )
  }

  initUserList({ orgId, userKeyPath, userCertPath }) {
    const newUser = new User(
      orgId,
      userKeyPathFile = getFilePath(userKeyPath),
      userCertPathFile = getFilePath(userCertPath)
    )
    this.userList.push(newUser)
  }

  initMethods() {
    const callMethods = (sdk, methods) => (name, ...data) => methods[name](sdk, ...data)
    this.callSdkMethods = callMethods(this.sdkInstance, methods)
  }


  invokeMethods(name, ...data) {
    this.callSdkMethods(name, ...data)
  }
}