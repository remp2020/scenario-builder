import React, { useState, useEffect, useImperativeHandle, useReducer, useContext, forwardRef } from 'react';
import { useSelector } from 'react-redux';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import uuidv4 from 'uuid/v4';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/AddCircleOutline';
import { Card, CardContent, FormControl, InputLabel, Select, MenuItem, IconButton, CardMedia } from '@material-ui/core';

import { makeStyles, useTheme } from '@material-ui/core/styles';

const BuilderDispatch = React.createContext(null);

function emptyNode() {
  return {id: uuidv4(), key: ''};
}

////////////////////
// local reducer
////////////////////

function actionSetKeyForNode(key, nodeId) {
  return {
    type: 'SET_KEY_FOR_NODE',
    payload: {
      key: key,
      nodeId: nodeId,
    }
  }; 
}

function actionDeleteNode(nodeId) {
  return {
    type: 'DELETE_NODE',
    payload: {
      nodeId: nodeId,
    }
  }; 
}

function actionAddCriterion() {
  return {type: 'ADD_CRITERION'};
}

function actionSetTable(table) {
  return {type: 'SET_TABLE', payload: table};
}

function reducer(state, action) {
  switch(action.type) {
    case 'SET_TABLE':
      // this also resets nodes state
      return {...state, nodes: [emptyNode()], table: action.payload};
    case 'ADD_CRITERION':
      return {...state, nodes: [...state.nodes, emptyNode()]};
    case 'DELETE_NODE':
      return {...state, nodes: state.nodes.filter(n => n.id !== action.payload.nodeId)};
    case 'SET_KEY_FOR_NODE':
      let newNodes = [...state.nodes].map(node => {
        if (action.payload.nodeId === node.id) return {
          id: node.id,
          key: action.payload.key,
        };
        return node;
      });
      return {...state, nodes: newNodes};
    default:
      throw new Error("unsupported action type " + action.type)
  }
}

////////////////////
// CriteriaForm
////////////////////

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
  },
});

// Props - node, criteria
function CriteriaForm(props) {
  const classes = useCriteriaFormStyles();
  const dispatch = useContext(BuilderDispatch);

  const handleChange = event => {
    dispatch(actionSetKeyForNode(event.target.value, props.node.id));
  };

  return (
    <Card className={classes.card}>
      <CardContent className={classes.cardContent}>
        <FormControl className={classes.formControl}>
          <InputLabel id="select-criteria-label">Criteria</InputLabel>
          <Select
            labelId="select-criteria-label"
            id="select-criteria"
            placeholder="Select criteria"
            value={props.node.key}
            onChange={handleChange}
          >
            {props.criteria.map(cr => (
              <MenuItem key={cr.key} value={cr.key}>{cr.label}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <IconButton onClick={() => dispatch(actionDeleteNode(props.node.id))} 
          size="small" 
          className={classes.icon} 
          aria-label="delete">
          <DeleteIcon />
        </IconButton>
      </CardContent>

      {/* <CardContent className={classes.cardContent2}>
      </CardContent> */}
    </Card>
  );
}

////////////////////
// CriteriaTable
////////////////////

const useCriteriaTableStyles = makeStyles({
  andContainer: {
    display: 'flex',
    justifyContent: 'center',
    flexGrow: 0,
    maxWidth: '100%',
    flexBasis: '100%'
  }
});

// Props - blueprint, nodes
function CriteriaTable(props) {
  const classes = useCriteriaTableStyles();
  const dispatch = useContext(BuilderDispatch);

  return (
    <>
      {props.nodes.map((node, index) => (
        <React.Fragment key={node.id}>
          { index >= 1 &&
            <div className={classes.andContainer}>AND</div>
          }
          <Grid item xs={12}>
            <CriteriaForm
              node={node}
              criteria={props.blueprint.criteria}>
            </CriteriaForm>
          </Grid>
        </React.Fragment>
      ))}

      <Grid item xs={12}>
        <Button onClick={() => dispatch(actionAddCriterion())} className={classes.button} startIcon={<AddIcon />}>
          Add new criteria
        </Button>
      </Grid>
    </>
  )
}

////////////////////
// CriteriaBuilder
////////////////////

const useCriteriaBuilderStyles = makeStyles({
  selectedButton: {
    backgroundColor: "#E4E4E4"
  }, 
  deselectedButton: {
    color:  "#A6A6A6"
  }
});

function CriteriaBuilder(props, ref) {
  const classes = useCriteriaBuilderStyles();
  const criteria = useSelector(state => state.criteria.criteria);

  const [state, dispatch] = useReducer(reducer, {
    version: 1,
    table: criteria[0].table,
    nodes: [emptyNode()] // by default, one empty node
  });

  // expose state to outer node
  useImperativeHandle(ref, () => ({
    state: state
  }));

  return (
    <BuilderDispatch.Provider value={dispatch}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <ButtonGroup aria-label="outlined button group">
            {criteria.map(criteriaBlueprint => (
              <Button 
                onClick={() => dispatch(actionSetTable(criteriaBlueprint.table))}
                className={state.table === criteriaBlueprint.table ? classes.selectedButton : classes.deselectedButton}
                key={criteriaBlueprint.table}>{criteriaBlueprint.table}</Button>
            ))}
          </ButtonGroup>
        </Grid>

        {criteria.filter(cb => cb.table === state.table).map(criteriaBlueprint => (
            <CriteriaTable 
              key={criteriaBlueprint.table} 
              blueprint={criteriaBlueprint}
              nodes={state.nodes}></CriteriaTable>
          )
        )}
      </Grid>
    </BuilderDispatch.Provider>
  )
}

// forwardRef is here used to access local state from parent node
export default forwardRef(CriteriaBuilder)
