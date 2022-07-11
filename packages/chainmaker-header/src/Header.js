import React, { PureComponent } from 'react'
import redux from '@obsidians/redux'
import Navbar from 'chainmaker-navbar'
import keypairManager from '@obsidians/keypair'
import { navbarItem } from '@obsidians/workspace'
import { NewProjectModal } from '@obsidians/chainmaker-project'
import { networkManager } from '@obsidians/chainmaker-network'
import { utils } from '@obsidians/sdk'
import { t } from '@obsidians/i18n'
import headerActions from './headerActions'

export default class Header extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      keypairs: []
    }

    this.updatedDropdownStarred = this.updatedDropdownStarred.bind(this)
    this.updateDropdownStarredContract = this.updateDropdownStarredContract.bind(this)
    this.updateContractName = this.updateContractName.bind(this)
  }

  componentDidMount() {
    keypairManager.loadAllKeypairs().then(this.updateKeypairs)
    keypairManager.onUpdated(this.updateKeypairs)
  }

  updateKeypairs = keypairs => this.setState({ keypairs })

  updatedDropdownStarred(starred, addressIcon) {
    const result = starred.map(item => {
      return {
        id: item,
        name: keypairManager.getName(item) ||
          <code className='small'>
            {utils.isValidAddressReturn(item).substr(0, 10)}
            ...{utils.isValidAddressReturn(item).substr(-8)}
          </code>,
        icon: addressIcon,
      }
    })
    if (!result.length) return []
    return [{ divider: true }, { header: 'starred' }, ...result]
  }

  updateDropdownStarredContract(starredContracts, addressIcon, contractIcon, extraContractItems) {
    let result = starredContracts.map(item => {
      return {
        id: item,
        name: <code className='small'>{utils.isValidAddressReturn(item).substr(0, 10)}...{utils.isValidAddressReturn(item).substr(-8)}</code>,
        icon: addressIcon,
      }
    })

    result = [{ header: 'starred' }, ...result.map(item => ({ ...item, icon: contractIcon }))]
    !starredContracts.length && result.push({ none: true })
    result = extraContractItems ? [...extraContractItems, ...result] : result

    return result
  }

  updateContractName(selectedContract, extraContractItems) {
    if (!selectedContract) return
    let result
      // todo:process address for this case
    result = extraContractItems ? extraContractItems.find(item => item.id === selectedContract)?.name : result
    if (!result) {
      result = <code>{utils.isValidAddressReturn(selectedContract)}</code>
    }
    return result
  }

  render() {
    const {
      noExplorer,
      profile,
      projects,
      selectedProject,
      starred = [],
      starredContracts = starred,
      keypairManagerFilter,
      browserAccounts = [],
      extraContractItems,
      selectedContract,
      selectedAccount,
      network,
      networkList,
      AuthModal,
      createProject,
      logo = null,
    } = this.props

    const username = profile.get('username') || projects.get('selected')?.toJS()?.author
    const navbarLeft = [navbarItem(projects, selectedProject, 'local')]

    
    const contractIcon = isSelected => isSelected ? 'fas fa-file-invoice' : 'far fa-file'
    const addressIcon = isSelected => isSelected ? 'fas fa-map-marker-alt' : 'far fa-map-marker'

    const dropdownStarred = this.updatedDropdownStarred(starred, addressIcon)
    const dropdownStarredInContract = this.updateDropdownStarredContract(starredContracts, addressIcon, contractIcon, extraContractItems)
    const contractName = this.updateContractName(selectedContract, extraContractItems)

    const selectAccountTemp = utils.isValidAddressReturn(selectedAccount)
    const accountName = selectAccountTemp && (keypairManager.getName(selectAccountTemp) || <code>{selectAccountTemp}</code>)

    const contractNavbarItem = {
      route: 'contract',
      title: t('header.title.contract'),
      icon: 'fas fa-file-invoice',
      selected: { id: selectedContract, name: contractName },
      dropdown: dropdownStarredInContract,
      onClickItem: selected => headerActions.selectContract(network.id, selected),
      contextMenu: () => [{
        text: 'Remove from Starred',
        onClick: ({ id }) => redux.dispatch('REMOVE_ACCOUNT', { network: network.id, account: id }),
      }],
    }

    const explorerNavbarItem = {
      route: 'account',
      title: t('header.title.explorer'),
      icon: 'fas fa-map-marker-alt',
      noneIcon: 'fas fa-map-marker-times',
      selected: { id: selectedAccount, name: accountName },
      dropdown: [...dropdownStarred],
      onClickItem: selected => headerActions.selectAccount(network.id, selected),
      contextMenu: address => {
        if (starred.indexOf(address) === -1) {
          return
        }
        return [{
          text: 'Remove from Starred',
          onClick: ({ id }) => {
            redux.dispatch('REMOVE_ACCOUNT', { network: network.id, account: id })
          },
        }]
      },
    }

    const networkReplaceName = Object.assign({}, network, { name: network.fullName })
  
    const networkNavbarItem = {
      route: 'network',
      title: t('header.title.network'),
      icon: network.icon,
      selected: networkReplaceName,
      dropdown: networkList,
      onClickItem: (_, network) => {
        if (network.name === 'Custom') {
          redux.dispatch('CUSTOM_MODAL_STATUS', true)
          return
        }
        networkManager.setNetwork(network)
      },
    }

    const navbarRight = noExplorer
      ? [contractNavbarItem, networkNavbarItem]
      : [contractNavbarItem, explorerNavbarItem, networkNavbarItem]
    

    return (
      <>
        <Navbar
          profile={profile}
          navbarLeft={navbarLeft}
          navbarRight={navbarRight}
        >
          {logo}
        </Navbar>
        <NewProjectModal createProject={createProject} />
        {AuthModal && <AuthModal />}
      </>
    )
  }
}
