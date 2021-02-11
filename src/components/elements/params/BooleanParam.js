import React from 'react';
import PropTypes from 'prop-types';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { actionSetParamValues } from './actions';

export default function BooleanParam(props) {
    // if not selected yet, set selection to True
    if (props.values.selection === undefined) {
      props.dispatch(actionSetParamValues(props.name, {
        selection: true
      }));
    }

    const handleChange = (event) => {
      props.dispatch(actionSetParamValues(props.name, {
        selection: event.target.checked
      }));
    };
  
    return (
      <FormControlLabel
          onChange={handleChange}
          control={<Switch />}
          checked={props.values.selection !== undefined && props.values.selection}
          label={props.blueprint.label}
        />
    );
  }

BooleanParam.propTypes = {
  // name identifying input (same function as in HTML <input>), used in dispatch
  name: PropTypes.any.isRequired,
  // values = {selection: true}
  values: PropTypes.object.isRequired,
  // blueprint = {label: 'Is recurrent', type: 'boolean'}
  blueprint: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
};