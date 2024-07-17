/** @format */

import React, { useState } from 'react';
import { ethers } from 'ethers';
import html2canvas from 'html2canvas';
import axios from 'axios';
import { abi, contractAddress } from '../utils/contant';
import { FaEthereum } from 'react-icons/fa';
import { Loader } from './Loader';
import Confetti from 'react-confetti';
import { toast } from 'react-hot-toast';

interface MintNFTProps {
  walletAddress: string;
  latLng: { lat: number; lng: number };
}

const MintNFT: React.FC<MintNFTProps> = ({ walletAddress, latLng }) => {
  const [transactionHash, setTransactionHash] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [minted, setMinted] = useState<boolean>(false);

  const handleMintNFT = async () => {
    const mintKey = `mint-${latLng.lat.toFixed(1)}-${latLng.lng.toFixed(1)}`;
    console.log('mintKey', mintKey);

    if (localStorage.getItem(mintKey)) {
      toast.error('You have already minted an NFT for this location.');
      return;
    }

    setLoading(true);
    toast.loading('Minting NFT...');
    try {
      const element = document.getElementById('nft-preview');
      if (!element) {
        throw new Error('NFT preview element not found');
      }

      const canvas = await html2canvas(element);
      const dataUrl = canvas.toDataURL('image/png');

      const formData = new FormData();
      formData.append('file', dataUrl);
      formData.append('upload_preset', 'imagePreset');

      const response = await axios.post(
        'https://api.cloudinary.com/v1_1/dogvctfpi/image/upload',
        formData
      );
      const imageUrl = response.data.secure_url;
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const contract = new ethers.Contract(contractAddress, abi, signer);

      const tokenURI = imageUrl;

      const tx = await contract.mintTo(walletAddress, tokenURI);
      await tx.wait();

      setTransactionHash(tx.hash);
      setMinted(true);
      localStorage.setItem(mintKey, tx.hash);
      toast.success('NFT minted successfully!');
    } catch (error) {
      console.error('Error minting NFT:', error);
      toast.error('Error minting NFT. Please try again.');
    } finally {
      setLoading(false);
      toast.dismiss();
    }
  };

  return (
    <div className='flex justify-center'>
      {!minted && (
        <button
          onClick={handleMintNFT}
          className='bg-green-500 text-white p-2 rounded flex items-center'
          disabled={loading}>
          {loading ? (
            <>
              <Loader className='mr-2' />
              Minting NFT...
            </>
          ) : (
            <>
              <FaEthereum className='mr-2' />
              Mint NFT
            </>
          )}
        </button>
      )}
      {transactionHash && (
        <>
          <Confetti />
          <div className='mt-2 text-center'>
            <p>NFT minted successfully!</p>
            <p>
              Transaction Hash:{' '}
              <a
                href={`https://sepolia.etherscan.io/tx/${transactionHash}`}
                target='_blank'
                rel='noopener noreferrer'
                className='text-blue-500 underline'>
                {transactionHash}
              </a>
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default MintNFT;
