import React, { PureComponent } from 'react'
import { Screen, LoadingScreen, ErrorPage } from '@obsidians/ui-components'
import redux from '@obsidians/redux'
import { networkManager, utils } from '@obsidians/chainmaker-network'
import { t } from '@obsidians/i18n'
import AccountTransactions from './AccountTransactions'

export default class AccountPage extends PureComponent {
  state = {
    error: null,
    tokens: [],
    tokenInfo: null,
    loading: true
  }

  constructor (props) {
    super(props)
    this.accountTransactions = React.createRef()
    props.cacheLifecycles.didRecover(this.componentDidRecover)
  }

  componentDidMount() {
    this.props.onDisplay(this)
    this.refresh()
  }

  componentDidRecover = () => {
    this.props.onDisplay(this)
  }

  refresh = async () => {
    this.setState({ loading: true })

    await new Promise(resolve => setTimeout(resolve, 10))

    if (!this.props.value) {
      this.handleFailed()
      return
    }
  }

  handleFailed = () => {
    this.setState({ loading: false, error: true })
  }

  handleReconnectNetwork = () => {
    redux.dispatch('CHANGE_NETWORK_STATUS', false)
    redux.dispatch('SELECT_NETWORK', '')
    networkManager.reconnectNetwork()
    this.props.onRefresh()
  }

  render () {
    const { history, value } = this.props
    const { error, tokens, tokenInfo } = this.state
    if (!networkManager.sdk) return null
    
    if (!this.props.value) {
      return (
        <Screen>
          <h4 className='display-4'>{t('explorer.page.newPage')}</h4>
          <p className='lead'>{t('explorer.page.newPageText', { chainName: process.env.CHAIN_NAME })}</p>
        </Screen>
      )
    }

    // if (this.state.loading) return <LoadingScreen />

    if (error) {
      if (typeof error === 'string') {
        return (
          <Screen>
            <ErrorPage
              btnText={t('network.network.reconnect')}
              btnClick={this.handleReconnectNetwork}
              btnStatus={!utils.isNetworkConnectError(error)}
              title={utils.isNetworkConnectError(error) ? t('network.network.error') : 'Error'}
              description={utils.isNetworkConnectError(error) ? t('network.network.errorDesc') : error}
            />
          </Screen>
        )
      } else {
        return (
          <Screen>
            <h4 className='display-4'>{t('explorer.page.invalidAddress')}</h4>
            <p className='lead'><kbd>{this.props.value}</kbd></p>
          </Screen>
        )
      }
    }

    return (
      <div className='d-flex flex-1 flex-column overflow-auto'>
        <div className='d-flex flex-fill overflow-hidden'>
          <div className='col-12 p-0 border-top-black overflow-auto'>
            <AccountTransactions
              ref={this.accountTransactions}
              blockValue={value}
              handleFailed={this.handleFailed} />
          </div>
        </div>
      </div>
    )
  }
}

AccountPage.defaultProps = {}