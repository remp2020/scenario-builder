import React from 'react';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { actionSetNodeValues } from '../criteriaReducer';

const useStringLabeledArrayParamStyles = makeStyles(theme => ({
  // Puts OR/AND between tags
  chipRoot: props => ({
    "&:not(:first-child)": {
      "&::before": {
        content: "'" + props.operator + "'",
        textTransform: 'uppercase',
        position: 'absolute',
        left: '-20px',
      },
      marginLeft: '20px'
    },
    position: 'relative'
  })
}));

// TODO: rewrite to use Autocomplete getOptionSelected attribute once it's stable
function selectedOptions(selectedValues, options) {
  const s = new Set(selectedValues);
  return options.filter(option => s.has(option.value));
}

// Props - node, params, dispatch
// Example:
// node = {values: {selection: ['city_1'], operator: 'or'}, key: 'type', id: '1'}
// params = {label: 'Cities', type: 'string_labeled_array', options: [{value: 'city_1', label: 'City 1'}], operator: 'or'}
export default function StringLabeledArrayParam(props) {
  const classes = useStringLabeledArrayParamStyles({operator: props.params.operator});
  const handleChange = (event, values) => {
    props.dispatch(actionSetNodeValues(props.node.id, {
      operator: props.params.operator, // TODO add ability to change operator
      selection: values.map(item => item.value)
    }));
  };

  return (
    <Autocomplete
        multiple
        ChipProps={{
          classes: {
            root: classes.chipRoot
          }
        }}
        options={props.params.options}
        getOptionLabel={option => option.label}
        onChange={handleChange}
        value={selectedOptions(props.node.values.selection, props.params.options)}
        renderInput={params => (
          <TextField
            {...params}
            variant="standard"
            label={props.params.label}
            placeholder=""
            fullWidth
          />
        )}
      />
  );
}