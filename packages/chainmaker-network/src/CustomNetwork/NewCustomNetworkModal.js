import React, { PureComponent } from 'react'
import {
  Modal,
  DebouncedFormGroup,
  FormGroup,
  Label
} from '@obsidians/ui-components'
import headerActions from '@obsidians/eth-header'
import redux from '@obsidians/redux'
import notification from '@obsidians/notification'
import { Input } from 'reactstrap'
import networkManager from '../networkManager'
import { t } from '@obsidians/i18n'

export default class CustomNetworkModal extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      pending: false,
      status: null,
      modify: false,
      option: { tlsEnable: false },
      originalOption: {},
    }
    this.modal = React.createRef()
    this.input = React.createRef()
  }

  openModal = (modify = false, newOption = {}) => {
    this.name = newOption.hostName
    this.setState({
      pending: false,
      status: null,
      modify,
      option: { ...this.setState.option, ...newOption },
      originalOption: newOption
    })
    this.modal.current?.openModal()
    setTimeout(() => this.input.current?.focus(), 50)
  }

  tryCreateSdk = async option => {

    this.setState({ pending: true })
    try {
      const status = await networkManager.updateCustomNetwork(option)
      console.log('tryCreateSdk', status)
      if (status) {
        this.setState({ pending: false, status })
        return
      }
    } catch (error) {
      notification.error(t('network.custom.err'), t('network.custom.errText'))
      this.setState({ pending: false })
    }
  }

  onConfirm = async () => {
    const { modify, status, option, originalOption } = this.state
    const customNetworkMap = redux.getState().customNetworks.toJS()
    const customNetworkNames = Object.keys(customNetworkMap);
    const connected = customNetworkMap[option.name]?.active;

    if (customNetworkNames.includes(option.name) && !modify) {
      notification.error(t('network.custom.invalidName'), t('network.custom.invalidNameText', { name: option.name }))
      return
    } else {
      if (!status) {
        this.tryCreateSdk({ ...option, notify: false })
      } else {
        if (modify) {
          redux.dispatch('MODIFY_CUSTOM_NETWORK', { name: this.name, option })
          if (option.url.trim() !== originalOption.url && connected) {
            this.connect(option)
          }
        } else {
          redux.dispatch('ADD_CUSTOM_NETWORK', option)
        }
        const customeNetworkMap = redux.getState().customNetworks.toJS()
        const customeNetworkGroup = Object.keys(customeNetworkMap).map(name => ({
          group: 'others',
          icon: 'fas fa-vial',
          id: name,
          networkId: name,
          name: name,
          fullName: name,
          notification: `${t('network.network.switchedTo')} <b>${name}</b>.`,
          url: customeNetworkMap[name].url,
        })).sort((a, b) => a.name.localeCompare(b.name))
        const newNetworks = networkManager.networks.filter(item => item.group !== 'others' || item.id === 'others').concat([{
          fullName: 'Custom Network',
          group: 'others',
          icon: 'fas fa-vial',
          id: 'custom',
          name: 'Custom',
          notification: `${t('network.network.switchedTo')} <b>Custom</b> ${t('network.network.networkLow')}.`,
          symbol: 'ETH',
          url: '',
        }]).concat(customeNetworkGroup)
        networkManager.addNetworks(newNetworks)

        this.setState({ pending: false, status: null })
        this.modal.current.closeModal()
      }
    }
  }

  connect = async option => {
    try {
      const status = await networkManager.updateCustomNetwork(option)
      if (status) {
        redux.dispatch('UPDATE_UI_STATE', { customNetworkOption: option })
        redux.dispatch('CHANGE_NETWORK_STATUS', true)
        headerActions.updateNetwork(option.name)
        networkManager.setNetwork({
          ...option,
          name: option.hostName
        })
        return
      }
    } catch (error) {
      notification.error(t('network.custom.err'), t('network.custom.errText'))
      redux.dispatch('CHANGE_NETWORK_STATUS', false)
    }
  }

  render() {
    const { modify, pending, status, option } = this.state

    return (
      <Modal
        ref={this.modal}
        title={`${modify ? t('network.custom.modify') : t('header.title.new')} ${t('network.custom.customConnect')}`}
        pending={pending && t('network.custom.try')}
        textConfirm={status ? modify ? t('network.custom.update') : t('network.custom.add') : t('network.custom.check')}
        onConfirm={this.onConfirm}
        confirmDisabled={!option.hostName || !option.orgId || !option.chainId || !option.ipAdress || !option.pem}>
        <DebouncedFormGroup
          ref={this.input}
          label='Host Name'
          maxLength='50'
          value={option.hostName}
          placeholder='Please enter the host name'
          onChange={hostName => this.setState({ option: { ...option, hostName } })}
        />
        <DebouncedFormGroup
          label='OrgId'
          maxLength='50'
          value={option.orgId}
          onChange={orgId => this.setState({ option: { ...option, orgId } })}
          placeholder='Please enter the organization Id'
          validator={v => !/^[0-9a-zA-Z\-_]*$/.test(v) && 'orgId can only contain letters, digits, dash or underscore.'}
        />
        <DebouncedFormGroup
          label='ChainId'
          maxLength='50'
          value={option.chainId}
          onChange={chainId => this.setState({ option: { ...option, chainId } })}
          placeholder='Please enter the chainId'
          validator={v => !/^[0-9a-zA-Z\-_]*$/.test(v) && 'chainId can only contain letters, digits, dash or underscore.'}
        />
        <DebouncedFormGroup
          label='IP Address: Port'
          maxLength='50'
          placeholder='Please enter the IP adress with port number(127.0.0.1:8080)'
          value={option.ipAdress}
          onChange={ipAdress => this.setState({ option: { ...option, ipAdress } })}
        />
        <FormGroup check className={'actionConfirm__checkbox'} style={{
          paddingTop: '15px',
          paddingBottom: '15px'
        }}>
          <Input type='checkbox' id='enablTls'
            onChange={tlsEnable => this.setState({ option: { ...option, tlsEnable } })}
            checked={option.tlsEnable} />
          <Label check htmlFor='enablTls'>Enable TTLS</Label>
        </FormGroup>
        <DebouncedFormGroup
          size='sm'
          rows='3'
          label='Pem Certificate'
          type='textarea'
          importFromFile='.crt'
          placeholder='Please enter the Pem Certificate'
          formGroupClassName='d-flex flex-column flex-grow-1 code'
          inputGroupClassName='flex-grow-1'
          className='h-100 code'
          value={option.pem}
          onChange={pem => this.setState({ option: { ...option, pem } })}
        />
      </Modal>
    )
  }
}
