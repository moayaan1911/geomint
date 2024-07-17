/** @format */

import React from 'react';
import AddressInput from './AddressInput';
import {
  FaLinkedin,
  FaGithub,
  FaCoffee,
  FaBlogger,
  FaEthereum,
} from 'react-icons/fa';

interface HeaderProps {
  onSelectAddress: (
    address: string,
    latLng: { lat: number; lng: number }
  ) => void;
}

const Header: React.FC<HeaderProps> = ({ onSelectAddress }) => {
  return (
    <div className='text-center p-4'>
      <div className='flex flex-col my-5'>
        <h1 className='text-2xl font-bold mb-4 inline'>
          GeoMint 🌍 - Mint Your Location as an NFT
        </h1>
        <p className='inline text-gray-500 ml-4'>
          Enter your address, generate a unique NFT, and mint it directly.
        </p>
      </div>
      <div className='flex flex-col items-center mb-4'>
        <div className='flex gap-2'>
          Created by
          <a
            className='text-blue-500 underline flex items-center font-semibold text-lg'
            href='https://moayaan.com'
            target='_blank'
            rel='noopener noreferrer'>
            <FaEthereum />
            moayaan.eth
            <FaEthereum />
          </a>
        </div>
        <div className='flex justify-center gap-4 my-6'>
          <a
            href='https://www.linkedin.com/in/ayaaneth/'
            target='_blank'
            rel='noopener noreferrer'>
            <FaLinkedin
              className='text-blue-700'
              size='1.5em'
            />
          </a>
          <a
            href='https://github.com/moayaan1911'
            target='_blank'
            rel='noopener noreferrer'>
            <FaGithub
              className='text-black'
              size='1.5em'
            />
          </a>
          <a
            href='https://www.buymeacoffee.com/moayaan.eth'
            target='_blank'
            rel='noopener noreferrer'>
            <FaCoffee
              className='text-yellow-600'
              size='1.5em'
            />
          </a>
          <a
            href='https://moayaan.hashnode.dev'
            target='_blank'
            rel='noopener noreferrer'>
            <FaBlogger
              className='text-blue-400'
              size='1.5em'
            />
          </a>
        </div>
      </div>
      <AddressInput onSelectAddress={onSelectAddress} />
    </div>
  );
};

export default Header;
