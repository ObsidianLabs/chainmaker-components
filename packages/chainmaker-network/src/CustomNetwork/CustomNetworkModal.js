import React, { PureComponent } from 'react'
import headerActions from '@obsidians/chainmaker-header'
import {
  Modal,
  Table,
  Button,
  IconButton,
  UncontrolledTooltip,
} from '@obsidians/ui-components'

import redux from '@obsidians/redux'
import notification from '@obsidians/notification'

import networkManager from '../networkManager'
import NewCustomNetworkModal from './NewCustomNetworkModal'
import { t } from '@obsidians/i18n'

export default class CustomNetworkModal extends PureComponent {
  constructor(props) {
    super(props)
    this.state = { connecting: '', customNetworkItem: null }
    this.modal = React.createRef()
    this.newConnectionModal = React.createRef()
    this.deleteModal = React.createRef()
  }

  openModal = (customNetwork = {}) => {
    this.setState({ connecting: '' })
    this.modal.current?.openModal()
  }

  openNewConnectionModal = (modify, option) => {
    this.newConnectionModal.current?.openModal(modify, option)
  }

  delete = item => {
    this.deleteModal.current?.openModal()
    this.setState({
      customNetworkItem: item,
    })
  }

  deleteConfirm = async () => {
    const currentNetwork = this.state.customNetworkItem?.name
    this.deleteModal.current.closeModal()
    const customNetworkMap = redux.getState().customNetworks.toJS()


    if (redux.getState().networkConnect && customNetworkMap[currentNetwork].active) {
      this.modal.current.closeModal()
      networkManager.setNetwork(networkManager.networks[0], {
        redirect: false,
        notify: false
      })
    }
    networkManager.deleteNetwork(currentNetwork)
    redux.dispatch('REMOVE_CUSTOM_NETWORK', currentNetwork)
  }

  connect = async (option, keepConnect) => {
    if (keepConnect) {
      networkManager.setNetwork(option)
      this.modal.current?.closeModal()
      return
    }
    redux.dispatch('ACTIVE_CUSTOM_NETWORK', '')
    redux.dispatch('CHANGE_NETWORK_STATUS', false)
    redux.dispatch('SELECT_NETWORK', '')
    notification.error(t('network.network.network'), t('network.network.networkDisconnect'))

    // console.log('option', option)
    // console.log('keepConnect', keepConnect)
    // try {
    //   this.setState({ connecting: option.name })
    // const newOption = networkManager.getCustomNetParams(option)
    // console.log('end', newOption)
    //   const status = await networkManager.updateCustomNetwork({
    //     url: newOption.url,
    //     name: newOption.name,
    //     option: newOption,
    //     notify: true
    //   })
    //   console.log('connect', status)
    //   if (status) {
    //     this.setState({ connecting: newOption.name })
        // redux.dispatch('SELECT_NETWORK', network.id)
        // const connectCustomeNetwork = networkManager.networks?.find(item => item.id == option.name)
        // networkManager.setNetwork(connectCustomeNetwork)
    //     this.modal.current?.closeModal()
    //     return
    //   }
    // } catch (e) { 
    //   notification.error(t('network.custom.err'), t('network.custom.errText'))
    //   this.setState({ connecting: '' })
    // }
  }

  renderTableBody = () => {
    const { connecting } = this.state
    const customNetworks = this.props.customNetworks.toArray()
    customNetworks.sort((a, b) => a[0].localeCompare(b[0]))
    if (customNetworks.length) {
      return customNetworks.map(([name, item], i) => {
        return (
          <tr key={`custom-network-${i}`} className='hover-flex'>
            <td className='d-flex'>
              <div className='text-overflow-dots' id={`custom-${name}`}>
                <span >
                  {name}
                </span>
              </div>
              {
                name &&
                <UncontrolledTooltip placement='right' target={`custom-${name}`}>
                  {name}
                </UncontrolledTooltip>
              }
            </td>
            <td className='text-overflow-dots'>{item.get('nodeConfigArray')[0].options.hostName}</td>
            <td align='right'>
              <div className='d-flex align-items-center justify-content-between'>
                <Button
                  key={item.get('active') ?`${name}-connecting` : `${name}-connect`}
                  size='sm'
                  color='success'
                  onClick={() => this.connect(item.toJS(), !item.get('active'))}>
                  {
                    item.get('active') ? <><i className='fas fa-spin fa-spinner mr-1'/>{t('network.custom.connecting')}</> : (t('network.custom.connect'))
                  }
                </Button>
                {
                  connecting !== name &&
                  <div className='d-flex hover-show'>
                    <IconButton
                      color='transparent'
                      className='text-muted'
                      onClick={() => this.openNewConnectionModal(true, item.toJS())}
                      icon='fas fa-pencil-alt'
                    />
                    <IconButton
                      color='transparent'
                      className='ml-1 text-muted delete-test'
                      onClick={() => this.delete(item.toJS())}
                    />
                  </div>
                }
              </div>
            </td>
          </tr>
        )
      })
    }
    return <tr key='custom-network-none'><td align='middle' colSpan={3}>({t('network.custom.none')})</td></tr>
  }

  onClosed = () => redux.dispatch('CUSTOM_MODAL_STATUS', false)

  render() {
    const networkConnectingText = t('network.custom.delTipsEnd')
    const networkNotConnectedText = t('network.custom.delConTips')
    const currentNetwork = this.state.customNetworkItem?.name
    const customNetworkMap = redux.getState().customNetworks.toJS()
    const connected = redux.getState().networkConnect && customNetworkMap[currentNetwork]?.active

    return <>
      <Modal
        ref={this.modal}
        title={t('network.custom.custom')}
        textActions={[t('network.custom.create')]}
        onClosed={this.onClosed}
        onActions={[() => this.openNewConnectionModal()]}
      >
        <Table
          tableSm
          TableHead={(
            <tr>
              <th style={{ width: '25%' }}>name</th>
              <th style={{ width: '40%' }}>Host Name</th>
              <th></th>
            </tr>
          )}
        >
          {this.renderTableBody()}
        </Table>
      </Modal>
      <Modal
        ref={this.deleteModal}
        title={t('network.custom.del')}
        size='md'
        textConfirm={t('network.custom.delConfirm')}
        noCancel={true}
        onConfirm={this.deleteConfirm}
      >
        <div>
          {t('network.custom.delTips')}
          <kbd className='color-danger'>{this.state.customNetworkItem?.name} </kbd>
          {t('network.custom.delTwoTips')}
          {connected ? networkConnectingText : networkNotConnectedText}
        </div>
      </Modal>
      <NewCustomNetworkModal ref={this.newConnectionModal} />
    </>
  }
}
