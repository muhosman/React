import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import { ListItemButton } from '@mui/material';
import { useState } from 'react';
import { RoundedCorner } from '@mui/icons-material';

export default function PinnedSubheaderList({listOfCompanies, onItemClick}) {

  const [selectedIndex, setSelectedIndex] = useState(0);

  return (
    <List
      sx={{
        width: '100%',
        maxWidth: 450,
        bgcolor: 'background.paper',
        position: 'relative',
        overflow: 'auto',
        borderRadius: 2,
        maxHeight: 250,
        '& ul': { padding: 0 },
      }}
      subheader={<li />}
    >
    <ul>
      <ListSubheader sx={{color: 'rgba(5, 47, 143, 0.9)', fontWeight: 'bold'}}>Subcompanies</ListSubheader>
      {listOfCompanies.map((item) => (
        <ListItemButton key={item.name} onClick={() => onItemClick(item)} selected={selectedIndex === 1}>
        <ListItemText primary={item.name} />
        </ListItemButton>
      ))}
    </ul>
    </List>
  );
}

