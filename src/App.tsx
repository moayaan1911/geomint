/** @format */

import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import Map from './components/Map';
import GenerateNFTPreview from './components/GenerateNFTPreview';
import MintNFT from './components/MintNft';
import { Toaster, toast } from 'react-hot-toast';
import { Loader } from './components/Loader';
import { FaEthereum } from 'react-icons/fa';
import Header from './components/Header';

const App: React.FC = () => {
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null);
  const [latLng, setLatLng] = useState<{ lat: number; lng: number } | null>(
    null
  );
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [showNFTPreview, setShowNFTPreview] = useState<boolean>(false);

  const handleSelectAddress = (
    address: string,
    latLng: { lat: number; lng: number }
  ) => {
    setSelectedAddress(address);
    setLatLng(latLng);
    setShowNFTPreview(false);
  };

  const handleConnectWallet = async () => {
    setIsConnecting(true);
    if (typeof window.ethereum !== 'undefined') {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        await provider.send('eth_requestAccounts', []);
        const signer = await provider.getSigner();
        const address = await signer.getAddress();
        setWalletAddress(address);
        setShowNFTPreview(true);
      } catch (error) {
        console.error('Error connecting to MetaMask:', error);
        toast.error('Failed to connect to MetaMask.');
      } finally {
        setIsConnecting(false);
      }
    } else {
      toast.error(
        'MetaMask is not installed. Please install it to use this feature.'
      );
      setIsConnecting(false);
    }
  };

  const switchToSepolia = async () => {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0xaa36a7' }],
      });
    } catch (switchError) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if ((switchError as any).code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: '0xaa36a7',
                chainName: 'Sepolia Test Network',
                rpcUrls: ['https://rpc.sepolia.org'],
                nativeCurrency: {
                  name: 'SepoliaETH',
                  symbol: 'ETH',
                  decimals: 18,
                },
                blockExplorerUrls: ['https://sepolia.etherscan.io'],
              },
            ],
          });
        } catch (addError) {
          console.error('Error adding Sepolia network:', addError);
        }
      } else {
        console.error('Error switching to Sepolia network:', switchError);
      }
    }
  };

  useEffect(() => {
    const checkNetwork = async () => {
      if (typeof window.ethereum !== 'undefined') {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const network = await provider.getNetwork();
        if (network.chainId !== BigInt(11155111)) {
          await switchToSepolia();
        }
      }
    };

    checkNetwork();
  }, [walletAddress]);

  return (
    <div className='p-4 h-screen w-screen overflow-x-hidden'>
      <Toaster />
      <Header onSelectAddress={handleSelectAddress} />
      {selectedAddress && latLng && (
        <div className='mt-4'>
          <h2 className='text-xl font-semibold'>Selected Address:</h2>
          <p>{selectedAddress}</p>
          <p>Latitude: {latLng.lat}</p>
          <p>Longitude: {latLng.lng}</p>
        </div>
      )}
      <Map
        latLng={latLng}
        address={selectedAddress}
      />
      {selectedAddress && latLng && (
        <div className='flex flex-col items-center mt-4'>
          <button
            onClick={handleConnectWallet}
            className='bg-blue-500 text-white p-2 rounded flex items-center justify-center'>
            {isConnecting ? <Loader /> : <FaEthereum className='mr-2' />}
            {isConnecting ? 'Connecting...' : 'Generate NFT'}
          </button>
          <p className='mt-2 text-sm text-center text-gray-600'>
            MAKE SURE METAMASK IS INSTALLED
          </p>
          {showNFTPreview && walletAddress && (
            <>
              <div className='text-center font-semibold text-amber-600 mt-8 text-lg'>
                NFT Preview
              </div>
              <GenerateNFTPreview
                address={selectedAddress}
                latLng={latLng}
                walletAddress={walletAddress}
              />
              <MintNFT
                walletAddress={walletAddress}
                latLng={latLng}
              />
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default App;
