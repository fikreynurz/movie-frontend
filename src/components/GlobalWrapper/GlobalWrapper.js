// src/components/GlobalWrapper/GlobalWrapper.js
import React from 'react';
import { Box } from '@mui/material';

const GlobalWrapper = ({ children }) => {
  return (
    <Box my={4} mx={2}>  {/* Mengatur margin secara global */}
      {children}
    </Box>
  );
};

export default GlobalWrapper;
