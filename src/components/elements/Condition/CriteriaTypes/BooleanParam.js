import React from 'react';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { actionSetNodeValues } from '../criteriaReducer';

// Props - node, params, dispatch
// Example:
// node = {values: {selection: true}, key: 'type', id: '1'}
// params = {label: 'Is recurrent', type: 'boolean'}
export default function BooleanParam(props) {
    const handleChange = (event) => {
      props.dispatch(actionSetNodeValues(props.node.id, {
        selection: event.target.checked
      }));
    };
  
    return (
      <FormControlLabel
          onChange={handleChange}
          control={<Switch />}
          checked={props.node.values.selection}
          label={props.params.label}
        />
    );
  }