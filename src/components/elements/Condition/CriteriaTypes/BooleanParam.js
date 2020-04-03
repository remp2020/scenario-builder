import React from 'react';
import PropTypes from 'prop-types';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { actionSetNodeValues } from '../criteriaReducer';

export default function BooleanParam(props) {
    // if not selected yet, set selection to True
    if (props.node.values.selection === undefined) {
      props.dispatch(actionSetNodeValues(props.node.id, {
        selection: true
      }));
    }

    const handleChange = (event) => {
      props.dispatch(actionSetNodeValues(props.node.id, {
        selection: event.target.checked
      }));
    };
  
    return (
      <FormControlLabel
          onChange={handleChange}
          control={<Switch />}
          checked={props.node.values.selection !== undefined && props.node.values.selection}
          label={props.params.label}
        />
    );
  }

BooleanParam.propTypes = {
    // node = {values: {selection: true}, key: 'type_of_boolean_condition', id: '1'}
    node: PropTypes.object.isRequired,
    // params = {label: 'Is recurrent', type: 'boolean'}
    params: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
};