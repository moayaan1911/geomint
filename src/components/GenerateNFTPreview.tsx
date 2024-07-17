/** @format */

import React, { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

interface GenerateNFTPreviewProps {
  address: string | null;
  latLng: { lat: number; lng: number } | null;
  walletAddress: string;
}

const GenerateNFTPreview: React.FC<GenerateNFTPreviewProps> = ({
  address,
  latLng,
  walletAddress,
}) => {
  const [timestamp, setTimestamp] = useState<string>('');
  const [uniqueId, setUniqueId] = useState<string>('');

  useEffect(() => {
    const now = new Date();
    setTimestamp(now.toLocaleString());

    setUniqueId(uuidv4());
  }, []);

  return (
    <div
      id='nft-preview'
      className='bg-blue-400 my-4 rounded shadow-lg text-white mx-auto w-96 h-96 text-center flex flex-col items-center justify-center gap-4 p-4 text-sm font-mono italic font-semibold overflow-hidden'>
      <div className='flex flex-col items-center justify-center h-full w-full gap-4'>
        <strong>
          Address: <span className='text-black'> {address} </span>
        </strong>
        <strong>
          Latitude: <span className='text-black'> {latLng?.lat} </span>
        </strong>
        <strong>
          Longitude: <span className='text-black'> {latLng?.lng} </span>
        </strong>
        <strong>
          Timestamp: <span className='text-black'> {timestamp} </span>
        </strong>
        <strong>
          Unique ID: <span className='text-black'> {uniqueId} </span>
        </strong>
        <strong>
          Wallet Address:<span className='text-black'> {walletAddress} </span>
        </strong>
      </div>
    </div>
  );
};

export default GenerateNFTPreview;
