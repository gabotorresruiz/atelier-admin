/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/no-unstable-nested-components */
import React, { forwardRef, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ListItem, ListItemIcon, ListItemText } from '@mui/material';

const ListItemLink = ({ icon, id, onClick, selectedItem, text, to }) => {
  const renderLink = useMemo(
    () =>
      forwardRef((itemProps, ref) => (
        <Link to={to} ref={ref} {...itemProps} role={undefined} />
      )),
    [to],
  );

  return (
    <li>
      <ListItem
        button
        component={renderLink}
        onClick={onClick}
        id={id}
        selected={selectedItem === id}
      >
        {icon ? <ListItemIcon>{icon}</ListItemIcon> : null}
        <ListItemText primary={text} />
      </ListItem>
    </li>
  );
};

export default ListItemLink;
