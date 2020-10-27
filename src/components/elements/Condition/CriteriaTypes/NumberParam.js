import React from 'react';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { makeStyles } from '@material-ui/core/styles';
import { actionSetNodeValues, actionUpdateNodeValues } from '../criteriaReducer';

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 100,
  },
  numberInput: {
    margin: theme.spacing(1),
  }
}));

export default function NumberParam(props) {
  const classes = useStyles();

  // if only one operator, select it by default
  if (props.node.values.operator === undefined && props.params.operators.length === 1) {
    props.dispatch(actionSetNodeValues(props.node.id, {
      operator: props.params.operators[0]
    }));
  }

  const handleOperatorChange = (event) => {
    props.dispatch(actionUpdateNodeValues(props.node.id, {
      operator: event.target.value
    }));
  };

  const handleInputChange = (event) => {
    props.dispatch(actionUpdateNodeValues(props.node.id, {
      selection: event.target.value
    }));
  };
  
  return (
    <React.Fragment>
      <FormControl className={classes.formControl} disabled={props.params.operators.length === 1}>
          <InputLabel>Operator</InputLabel>
          <Select
            autoWidth
            value={props.node.values.operator ?? ''}
            onChange={handleOperatorChange}
          >
            {props.params.operators.map(op => (
              <MenuItem key={op} value={op}>{op}</MenuItem>
            ))}
          </Select>
      </FormControl>

      <TextField className={classes.numberInput}
          label={props.params.unit}
          type="number"
          onChange={handleInputChange}
          value={props.node.values.selection ?? ''}
          // attributes passed down to <input> HTML tag
          inputProps={props.params.numberInputAttributes ?? {}}
        />
    </React.Fragment>
  );
}

NumberParam.propTypes = {
    // node = {values: {selection: 3, operator: '>'}, key: 'type_of_number_condition', id: '1'}
    node: PropTypes.object.isRequired,
    // params = {label: 'Subscription type length', type: 'number', 'operators': ['=', '<', '>'], unit: 'Day(s)', numberInputAttributes: {min: 0}}
    params: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
};