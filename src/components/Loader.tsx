/** @format */

import React from 'react';
import { FaSpinner } from 'react-icons/fa';

interface LoaderProps {
  className?: string;
}

export const Loader: React.FC<LoaderProps> = ({ className }) => {
  return <FaSpinner className={`animate-spin ${className}`} />;
};
