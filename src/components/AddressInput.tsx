/** @format */

import React, { useState } from 'react';
import axios from 'axios';
import { Loader } from './Loader';

interface AddressInputProps {
  onSelectAddress: (
    address: string,
    latLng: { lat: number; lng: number }
  ) => void;
}

interface Suggestion {
  formatted: string;
  geometry: {
    lat: number;
    lng: number;
  };
}

const AddressInput: React.FC<AddressInputProps> = ({ onSelectAddress }) => {
  const [value, setValue] = useState('');
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setValue(inputValue);

    if (inputValue.length > 2) {
      setIsLoading(true);
      try {
        const response = await axios.get(
          'https://api.opencagedata.com/geocode/v1/json',
          {
            params: {
              q: inputValue,
              key: import.meta.env.VITE_OPENCAGE_API_KEY,
            },
          }
        );
        setSuggestions(response.data.results);
      } catch (error) {
        console.error('Failed to fetch suggestions:', error);
      } finally {
        setIsLoading(false);
      }
    } else {
      setSuggestions([]);
    }
  };

  const handleSelect = (
    address: string,
    latLng: { lat: number; lng: number }
  ) => {
    setValue(address);
    setSuggestions([]);
    onSelectAddress(address, latLng);
  };

  return (
    <div className='relative'>
      <div className='flex items-center border w-full'>
        <input
          value={value}
          onChange={handleInput}
          placeholder='Enter your city or state'
          className={`w-11/12 pl-10 py-2`}
        />
        {isLoading && <Loader className='text-2xl pl-1 text-blue-500 ' />}
      </div>
      {suggestions.length > 0 && (
        <ul className='absolute bg-white border w-full mt-1 max-h-60 overflow-y-auto'>
          {suggestions.map((suggestion: Suggestion) => (
            <li
              key={suggestion.geometry.lat + suggestion.geometry.lng}
              onClick={() =>
                handleSelect(suggestion.formatted, {
                  lat: suggestion.geometry.lat,
                  lng: suggestion.geometry.lng,
                })
              }
              className='p-2 cursor-pointer hover:bg-gray-200'>
              {suggestion.formatted}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AddressInput;
