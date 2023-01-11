import React, { useState } from 'react';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MenuIcon from '@mui/icons-material/Menu';

export const MainMenu = ({ showRouteLookup, showStopLookup }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleRouteLookupClick = () => {
    handleClose();
    showRouteLookup();
  };

  const handleStopLookupClick = () => {
    handleClose();
    showStopLookup();
  }

  return (
    <div className={'main-menu-div'}>
      <IconButton
        id="menu-button"
        aria-controls={open ? 'main-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
      >
        <MenuIcon />
      </IconButton>
      <Menu
        id="main-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'menu-button',
        }}
      >
        <MenuItem onClick={handleStopLookupClick}>{'Search for a Stop'}</MenuItem>
        <MenuItem onClick={handleRouteLookupClick}>{'Find Maps by Route'}</MenuItem>
      </Menu>
    </div>
  );
}