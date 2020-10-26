import React, { useImperativeHandle, useReducer, useContext, forwardRef } from 'react';
import { useSelector } from 'react-redux';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/AddCircleOutline';
import { Card, CardContent, FormControl, InputLabel, Select, MenuItem, IconButton } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import StringLabeledArrayParam from './CriteriaTypes/StringLabeledArrayParam';
import BooleanParam from './CriteriaTypes/BooleanParam';
import NumberParam from './CriteriaTypes/NumberParam';
import { emptyNode, reducer, actionSetEvent, actionSetKeyForNode, actionAddCriterion, actionDeleteNode } from './criteriaReducer';

const BuilderDispatch = React.createContext(null);

////////////////////
// CriteriaParams
////////////////////

// Props - node, params
function CriteriaParams(props) {
  const dispatch = useContext(BuilderDispatch);
  let typeParams = props.params[props.node.key];
  switch (typeParams.type) {
    case 'string_labeled_array':
      return (<StringLabeledArrayParam node={props.node} params={typeParams} dispatch={dispatch}></StringLabeledArrayParam>);
    case 'boolean':
      return (<BooleanParam node={props.node} params={typeParams} dispatch={dispatch}></BooleanParam>);
    case 'number':
      return (<NumberParam node={props.node} params={typeParams} dispatch={dispatch}></NumberParam>);
    default:
      throw new Error("unsupported node type " + typeParams.type);
  }
}

////////////////////
// CriteriaForm
////////////////////

const useCriteriaFormStyles = makeStyles({
  cardContent: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    backgroundColor: '#F2F2F2',
  },
  formControl: {
    minWidth: '180px',
  },
});

// Props - node, criteria
function CriteriaForm(props) {
  const classes = useCriteriaFormStyles();
  const dispatch = useContext(BuilderDispatch);

  return (
    <Card>
      <CardContent className={classes.cardContent}>
        <FormControl className={classes.formControl}>
          <InputLabel id="select-criteria-label">Criteria</InputLabel>
          <Select
            labelId="select-criteria-label"
            id="select-criteria"
            placeholder="Select criteria"
            value={props.node.key}
            onChange={e => dispatch(actionSetKeyForNode(props.node.id, e.target.value))}
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

      { props.node.key &&
        <CardContent>
          <CriteriaParams 
            node={props.node} 
            params={props.criteria.filter(cr => cr.key === props.node.key)[0].params}>
          </CriteriaParams>
        </CardContent>
      }
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
    event: criteria[0].event,
    nodes: [emptyNode()] // by default, one empty node
  , ...props.conditions});

  // expose state to outer node
  useImperativeHandle(ref, () => ({
    state: state
  }));

  return (
    <BuilderDispatch.Provider value={dispatch}>
      <Grid container item xs={12} spacing={3}>
        <Grid item xs={12}>
          <ButtonGroup aria-label="outlined button group">
            {criteria.map(criteriaBlueprint => (
              <Button 
                onClick={() => dispatch(actionSetEvent(criteriaBlueprint.event))}
                className={state.event === criteriaBlueprint.event ? classes.selectedButton : classes.deselectedButton}
                key={criteriaBlueprint.event}>{criteriaBlueprint.event}</Button>
            ))}
          </ButtonGroup>
        </Grid>

        {criteria.filter(cb => cb.event === state.event).map(criteriaBlueprint => (
            <CriteriaTable 
              key={criteriaBlueprint.event} 
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
