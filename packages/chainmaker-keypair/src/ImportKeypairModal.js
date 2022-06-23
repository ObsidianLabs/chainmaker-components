import React, { PureComponent } from 'react'

import {
  Modal,
  DebouncedFormGroup,
  ButtonOptions,
  Label,
  Button,
} from '@obsidians/ui-components'

import notification from '@obsidians/notification'
import { t } from '@obsidians/i18n'

import keypairManager from './keypairManager'

export default class ImportKeypairModal extends PureComponent {
  constructor (props) {
    super(props)
    const defaultChain = props.chains && props.chains[0].key
    this.state = {
      chain: defaultChain,
      pending: false,
      name: '',
      secret: '',
      valid: false,
      feedback: '',
      keypair: {},
    }

    this.modal = React.createRef()
    this.input = React.createRef()
  }

  openModal (chain) {
    this.modal.current.openModal()
    if (chain) {
      this.setState({ chain })
    }
    this.setState({ name: '', secret: '', keypair: null, valid: false, feedback: '' })
    setTimeout(() => this.input.current?.focus(), 100)
    return new Promise(resolve => this.onResolve = resolve)
  }

  onChange = secret => {
    this.setState({ secret })
    this.refreshKeypair(secret, this.state.chain)
  }

  setChain = chain => {
    const secret = this.state.secret
    this.setState({ chain })
    this.refreshKeypair(secret, chain)
  }

  refreshKeypair = (secret, chain) => {
    if (!secret) {
      this.setState({ keypair: null, valid: false, feedback: '' })
      return
    }
    try {
      const keypair = this.props.kp.importKeypair(secret, chain)
      this.setState({
        keypair,
        valid: true,
        feedback: <span>Address: <code>{keypair.address}</code></span>
      })
    } catch (e) {
      console.warn(e)
      this.setState({ keypair: null, valid: false, feedback: `Not a valid ${this.props.secretName.toLowerCase()}` })
    }
  }

  onConfirm = async () => {
    const { name, keypair } = this.state

    if (!keypair) {
      this.onResolve()
      return
    }

    // if (this.props.keypairs.find(k => k.name === name)) {
    //   notification.error(
    //     t('keypair.failImport'),
    //     t('keypair.failText', {name})
    //   )
    //   return
    // }

    // if (this.props.keypairs.find(k => k.address === keypair.address)) {
    //   notification.error(
    //     t('keypair.failImport'),
    //     t('keypair.failImportText', {address: keypair.address}),
    //   )
    //   return
    // }

    this.setState({ pending: true })
    await keypairManager.saveKeypair(name, keypair)
    this.setState({ pending: false, secret: '' })

    this.modal.current.closeModal()
    this.onResolve(true)
  }

  renderChainOptions () {
    const { chains } = this.props
    const { chain } = this.state

    if (!chains) {
      return null
    }
    return <>
      <Label>The keypair can be used on</Label>
      <div>
        <ButtonOptions
          size='sm'
          className='mb-3'
          options={chains}
          selected={chain}
          onSelect={chain => this.setChain(chain)}
        />
      </div>
    </>
  }

  async validCert(cert){
    let testBegin = /-----BEGIN[^-]+-----/.test(cert)
    let testEnd = /-----END[^-]+-----/.test(cert)
    if (!testBegin || !testEnd) return false
    async function digestMessage(message) {
      const msgUint8 = new TextEncoder().encode(message);                           // encode as (utf-8) Uint8Array
      const hashBuffer = await crypto.subtle.digest('SHA-1', msgUint8);           // hash the message
      const hashArray = Array.from(new Uint8Array(hashBuffer));                     // convert buffer to byte array
      const hashHex = hashArray.map(b => b.toString(16).toUpperCase().padStart(2, '0')).join(':'); // convert bytes to hex string
      return hashHex;
    }

    return await digestMessage(cert)
  }

  async validAllCert(inputSecret){
    const keys = ['tlsKey', 'tlsCrt', 'signKey', 'signCrt']
    let secret = inputSecret || this.state.secret || {}
    let valid = true
    let crtfingerprint = ''
    for (let key of keys){
      let fingerprint = await this.validCert(secret[key])
      console.log('fingerprint', fingerprint)
      if (fingerprint === false) {
        valid = false
      } else if (key === 'signCrt') {
        crtfingerprint = fingerprint
      }
    }
    this.setState({
      secret: JSON.stringify(inputSecret),
      keypair: Object.assign({}, {
        secret: JSON.stringify(inputSecret),
        address: crtfingerprint,
      }),
      valid: valid,
    })
  }

  onChangeSecret(type, value) {
    let secret = JSON.parse(this.state.secret || '{}')
    secret[type] = value
    this.validAllCert(secret)
  }

  render () {
    const {
      name,
      secret,
      valid,
      feedback,
    } = this.state

    const {tlsKey, tlsCrt, signKey, signCrt} = JSON.parse(secret || '{}')

    return (
      <Modal
        ref={this.modal}
        title={`${t('keypair.import')} ${t('keypair.keypair')}`}
        textConfirm={t('keypair.import')}
        pending={this.state.pending && `${t('keypair.importing')}...`}
        onConfirm={this.onConfirm}
        confirmDisabled={!name || !valid}
      >
        <DebouncedFormGroup
          ref={this.input}
          label='Name'
          maxLength='200'
          placeholder={t('keypair.createPlaceholder')}
          onChange={name => this.setState({ name })}
        />
        {this.renderChainOptions()}
        <DebouncedFormGroup
          size='sm'
          rows='3'
          label='TLS Key'
          type='textarea'
          importFromFile='.key'
          placeholder='Please enter the TLS'
          formGroupClassName='d-flex flex-column flex-grow-1 code'
          inputGroupClassName='flex-grow-1'
          className='h-100 code'
          value={tlsKey}
          onChange={value=> this.onChangeSecret('tlsKey', value)}
        />
        <DebouncedFormGroup
          size='sm'
          rows='3'
          label='TLS Crt'
          type='textarea'
          importFromFile='.crt'
          placeholder='Please enter the TLS'
          formGroupClassName='d-flex flex-column flex-grow-1 code'
          inputGroupClassName='flex-grow-1'
          className='h-100 code'
          value={tlsCrt}
          onChange={value=> this.onChangeSecret('tlsCrt', value)}
        />
        <DebouncedFormGroup
          size='sm'
          rows='3'
          label='Sign Key'
          type='textarea'
          importFromFile='.key'
          placeholder='Please enter the TLS'
          formGroupClassName='d-flex flex-column flex-grow-1 code'
          inputGroupClassName='flex-grow-1'
          className='h-100 code'
          value={signKey}
          onChange={value=> this.onChangeSecret('signKey', value)}
        />
        <DebouncedFormGroup
          size='sm'
          rows='3'
          label='Sign Crt'
          type='textarea'
          importFromFile='.crt'
          placeholder='Please enter the TLS'
          formGroupClassName='d-flex flex-column flex-grow-1 code'
          inputGroupClassName='flex-grow-1'
          className='h-100 code'
          value={signCrt}
          onChange={value=> this.onChangeSecret('signCrt', value)}
        />
      </Modal>
    )
  }
}
