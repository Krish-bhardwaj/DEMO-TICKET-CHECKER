import { useState } from 'react'
import { ethers } from 'ethers'
function App() {
  const [color, setColor] = useState('black')
  const [account, setAccount] = useState(null)
  const [event, setEvent] = useState('')
  // connect metamask
  const connectHandler = () => {
    return new Promise(async () => {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        await provider.send('eth_requestAccounts', [])
        const signer = provider.getSigner()
        const accountAddress = await signer.getAddress()
        setAccount(accountAddress)
      } catch (error) {
        console.error(error)
      }
    })
  }
  // disconnect metamask
  const disconnect = async () => {
    await setAccount(null)
    await setColor('black')
  }
  // get all nft from that user account
  const renderTokensForOwner = async (ownerAddress) => {
    var array = []
    await fetch(
      `https://testnets-api.opensea.io/api/v1/assets?owner=${ownerAddress}&order_direction=desc&offset=0&limit=30`,
      { method: 'GET', headers: { Accept: 'application/json' } },
    )
      .then((response) => response.json())
      .then(({ assets }) => {
        assets.forEach((attributes) => {
          //   console.log(attributes.collection.name)
          array.push(attributes.collection.name)
        })
      })
      .catch((error) => console.log(error))
    return array
  }
  // check for a specific nft
  async function check(address, contract) {
    // console.log('Connected via address ' + address)
    var array = await renderTokensForOwner(address)
    // console.log(array)
    var i;
    for (i = 0; i < array.length; i++) {
      if (array[i] === contract) {
        // console.log('OK')
        i = -1;
        break;
      } else {
        // console.log('NOT OK')
      }
    }
    if (i === -1) {
      setColor('green')
    }
    else {
      setColor('red')
    }
  }
  // check if user has a ticket or not
  const valid = async () => {

    await check(account, event)
  }
  // background colour changer
  var background =
    account === null && color === 'black'
      ? 'black'
      : account !== null && color === 'black'
      ? 'black'
      : color === 'green'
      ? 'green'
      : 'red'

  return (
    <div
      className="flex flex-col h-screen justify-center items-center text-white font-bold font-mono text-2xl space-y-5 "
      style={{ 'background-color': background }}
    >
      <img
        src="https://dummyimage.com/100x100/"
        alt="ticket"
        className="rounded-xl"
      />
      <span className='text-white'> CHECK YOUR TICKET </span>
      {account === null && (
        <>
        <input type="text" placeholder="ENTER EVENT NAME" onChange={(e) => setEvent(e.target.value)} className="bg-black text-white text-center" />
        <button
          type="button"
          class="bg-amber-300 text-black rounded-lg text-lg px-3 py-2 text-center inline-flex items-center space-x-10"
          onClick={connectHandler}
        >
          Connect Wallet
        </button>
        </>
      )}

      {account !== null && (
        <>
          <span className="text-sm">
            Your account: {account.substr(0, 4) + '...' + account.substr(38)}
          </span>
          <button
            className="bg-slate-900 text-white rounded-lg text-lg px-3 py-2 text-center inline-flex items-center space-x-10"
            onClick={valid}
          >
            {color === 'black'
              ? 'Check Ticket'
              : color === 'green'
              ? 'Valid'
              : 'Invalid'}
          </button>
          <button
            className="bg-orange-800 text-white rounded-lg text-lg px-3 py-2 text-center inline-flex items-center space-x-10"
            onClick={disconnect}
          >
            Disconnect Wallet
          </button>
        </>
      )}
    </div>
  )
}

export default App
