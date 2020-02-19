import React from 'react';
import PropTypes from 'prop-types';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { actionSetNodeValues } from '../criteriaReducer';

const elementStyles = makeStyles(theme => ({
  // Puts visually OR/AND between tags
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

function selectedOptions(selectedValues, options) {
  const s = new Set(selectedValues);
  let selected = options.filter(option => {
    let has = s.has(option.value);
    if (has) {
      // for free-solo mode
      s.delete(option.value);
    }
    return has;
  });
  // If free solo mode is enabled, there might be additional selected values (outside of options), add them as well
  return selected.concat([...s]);
}

function optionLabel(option) {
  if (typeof(option) === 'string') {
    // free-solo value
    return option;
  } else {
    // predefined option value
    return option.label;
  }
}

export default function StringLabeledArrayParam(props) {
  const classes = elementStyles({operator: props.params.operator});
  const handleChange = (event, values) => {
    props.dispatch(actionSetNodeValues(props.node.id, {
      operator: props.params.operator, // TODO add ability to change operator
      selection: values.map(item => {
        if (typeof(item) === 'string') {
          // free-solo value
          return item;
        } else {
          // predefined option value
          return item.value;
        }
      })
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
        getOptionLabel={optionLabel}
        onChange={handleChange}
        value={selectedOptions(props.node.values.selection, props.params.options)}
        freeSolo={props.params.freeSolo}
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

StringLabeledArrayParam.propTypes = {
  // node = {values: {selection: ['city_1'], operator: 'or'}, key: 'type', id: '1'}
  node: PropTypes.object.isRequired,
  // params = {label: 'Cities', type: 'string_labeled_array', options: [{value: 'city_1', label: 'City 1'}], operator: 'or', freeSolo: true}
  params: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
};