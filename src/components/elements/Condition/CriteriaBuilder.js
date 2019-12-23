import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import uuidv4 from 'uuid/v4';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/AddCircleOutline';
import { Card, CardContent, FormControl, InputLabel, Select, MenuItem, IconButton, CardMedia } from '@material-ui/core';

import { makeStyles, useTheme } from '@material-ui/core/styles';

const useCriteriaFormStyles = makeStyles({
  card: {
    // minWidth: '200px'
  },
  cardContent: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    backgroundColor: '#F2F2F2',
  },
  cardContent2: {
    backgroundColor: '#F2F2F2'
  },
  formControl: {
    minWidth: '180px',
    // flex: '0'
  },

  icon: {
    // flex: '0'
  }
});

// Props - node, table, criteria
function CriteriaForm(props) {
  const classes = useCriteriaFormStyles();
  const [selectedCriteria, setSelectedCriteria] = React.useState('');

  const handleChange = event => {
    setSelectedCriteria(event.target.value);
  };

  return (
    <Card className={classes.card}>
      <CardContent className={classes.cardContent}>
        <FormControl className={classes.formControl}>
          <InputLabel id="select-criteria-label">Criteria</InputLabel>
          <Select
            labelId="select-criteria-label"
            id="select-criteria"
            value={selectedCriteria}
            onChange={handleChange}
          >
            {props.criteria.map(cr => (
              <MenuItem key={cr.key} value={cr.key}>{cr.label}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <IconButton size="small" className={classes.icon} aria-label="delete">
          <DeleteIcon />
        </IconButton>
      </CardContent>

      {/* <CardContent className={classes.cardContent2}>
      </CardContent> */}
    </Card>
  );
}

const useCriteriaTableStyles = makeStyles({
  andContainer: {
    display: 'flex',
    justifyContent: 'center',
    flexGrow: 0,
    maxWidth: '100%',
    flexBasis: '100%'
  }
});

// Props - blueprint
function CriteriaTable(props) {
  const classes = useCriteriaTableStyles();
  const [nodes, setNodes] = useState([{id: uuidv4(), key: null}])

  const handleClick = () => {
    setNodes([...nodes, {id:uuidv4(), key:null}]);
  };

  return (
    <>
      {nodes.map((n, index) => (
        <React.Fragment key={n.id}>
          { index >= 1 &&
            <div className={classes.andContainer}>AND</div>
          }
          <Grid item xs={12}>
            <CriteriaForm 
              node={n}
              table={props.blueprint.table} 
              criteria={props.blueprint.criteria}>
            </CriteriaForm>
          </Grid>
        </React.Fragment>
      ))}

      <Grid item xs={12}>
        <Button onClick={handleClick} className={classes.button} startIcon={<AddIcon />}>
          Add new criteria
        </Button>
      </Grid>
    </>
  )
}

const useCriteriaBuilderStyles = makeStyles({
  criteriaBox: {
    // padding: '8px',
  },
  selectedButton: {
    backgroundColor: "#E4E4E4"
  }, 
  deselectedButton: {
    color:  "#A6A6A6"
  }
});

export default function CriteriaBuilder(props) {
  const classes = useCriteriaBuilderStyles();
  const criteria = useSelector(state => state.criteria.criteria);
  const [selectedTable, setSelectedTable] = useState(criteria[0].table)

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <ButtonGroup aria-label="outlined button group">
          {criteria.map(criteriaBlueprint => (
            <Button 
              onClick={() => setSelectedTable(criteriaBlueprint.table)}
              className={selectedTable === criteriaBlueprint.table ? classes.selectedButton : classes.deselectedButton}
              key={criteriaBlueprint.table}>{criteriaBlueprint.table}</Button>
          ))}
        </ButtonGroup>
      </Grid>

      {criteria.filter(cb => cb.table === selectedTable).map(criteriaBlueprint => (
          <CriteriaTable key={criteriaBlueprint.table} blueprint={criteriaBlueprint}></CriteriaTable>
        )
      )}
    </Grid>
  )
}