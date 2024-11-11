// EditApprovalModal.js
import React, { useState } from 'react';
import { Modal, Box, Typography, Button, Switch, FormControlLabel } from '@mui/material';
import api from '../../Api';

const EditApprovalModal = ({ open, handleClose, movieId, currentStatus, fetchMovies }) => {
  const [isApproved, setIsApproved] = useState(currentStatus);

  const handleApprovalChange = (event) => {
    setIsApproved(event.target.checked);
  };

  const handleSave = async () => {
    try {
      await api.put(`/movies/${movieId}`, { isApproved });
      fetchMovies(); // Refresh movie list after update
      handleClose();
    } catch (error) {
      console.error("Error updating approval status:", error);
    }
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={{ p: 4, bgcolor: 'white', borderRadius: 2, width: 400, margin: 'auto', mt: 8 }}>
        <Typography variant="h6" gutterBottom>
          Edit Approval Status
        </Typography>
        <FormControlLabel
          control={<Switch checked={isApproved} onChange={handleApprovalChange} />}
          label="Approved"
        />
        <Box mt={2}>
          <Button onClick={handleSave} variant="contained" color="primary" sx={{ mr: 1 }}>
            Save
          </Button>
          <Button onClick={handleClose} variant="outlined" color="secondary">
            Cancel
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default EditApprovalModal;
