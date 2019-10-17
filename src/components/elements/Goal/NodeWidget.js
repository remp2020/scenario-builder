import * as React from 'react';
import { connect } from 'react-redux';
import OkIcon from '@material-ui/icons/Check';
import TimeoutIcon from '@material-ui/icons/AccessTime';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import GoalIcon from '@material-ui/icons/CheckBox';

import StatisticsTooltip from '../../StatisticTooltip';
import { PortWidget } from './../../widgets/PortWidget';
import MaterialSelect from '../../MaterialSelect';
import { setCanvasZoomingAndPanning } from '../../../actions';

class NodeWidget extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      nodeFormName: this.props.node.name,
      selectedGoals: this.props.node.selectedGoals,
      timeoutTime: this.props.node.timeoutTime,
      timeoutUnit: this.props.node.timeoutUnit,
      dialogOpened: false,
      anchorElementForTooltip: null,      
    };
  }

  bem(selector) {
    return (
      this.props.classBaseName +
      selector +
      ' ' +
      this.props.className +
      selector +
      ' '
    );
  }

  getClassName() {
    return this.props.classBaseName + ' ' + this.props.className;
  }

  openDialog = () => {
    this.setState({
      dialogOpened: true,
      nodeFormName: this.props.node.name,
      selectedGoals: this.props.node.selectedGoals,
      timeoutTime: this.props.node.timeoutTime,
      timeoutUnit: this.props.node.timeoutUnit,
      anchorElementForTooltip: null
    });
    this.props.dispatch(setCanvasZoomingAndPanning(false));
  };

  closeDialog = () => {
    this.setState({ dialogOpened: false });
    this.props.dispatch(setCanvasZoomingAndPanning(true));
  };

  transformOptionsForSelect = () => {
    const goals = this.props.goals.map(goal => ({
      value: goal.code,
      label: goal.name,
    }));
    return goals;
  };

  handleNodeMouseEnter = event => {
    if (!this.state.dialogOpened) {
      this.setState({ anchorElementForTooltip: event.currentTarget });
    }
  };

  handleNodeMouseLeave = () => {
    this.setState({ anchorElementForTooltip: null });
  };

  getFormatedValue = () => {
    let goals = {};
    this.props.goals.forEach(goal => {
      goals[goal.code] = goal;
    });

    let matches = [];

    if (this.state.selectedGoals !== undefined) {
      this.state.selectedGoals.forEach(goalCode => {
        matches.push({
          value: goalCode,
          label: goals[goalCode].name 
        });
      });
    }

    return matches;
  };

  render() {
    return (
      <div
        className={this.getClassName()}
        onDoubleClick={() => {
          this.openDialog();
        }}
        onMouseEnter={this.handleNodeMouseEnter}
        onMouseLeave={this.handleNodeMouseLeave}
      >
        <div className={this.bem('__title')}>
          <div className={this.bem('__name')}>
            {this.props.node.name ? this.props.node.name : 'Goal'}
          </div>
        </div>

        <div className='node-container'>
          <div className={this.bem('__icon')}>
            <GoalIcon />
          </div>

          <div className={this.bem('__ports')}>
            <div className={this.bem('__left')}>
              <PortWidget name='left' node={this.props.node} />
            </div>

            <div className={this.bem('__right')}>
              <PortWidget name='right' node={this.props.node}>
                <OkIcon
                  style={{
                    position: 'absolute',
                    top: '-20px',
                    right: '-20px',
                    color: '#2ECC40'
                  }}
                />
              </PortWidget>
            </div>

            <div className={this.bem('__bottom')}>
              <PortWidget name='bottom' node={this.props.node}>
                <TimeoutIcon
                  style={{
                    position: 'absolute',
                    top: '8px',
                    right: '-22px',
                    color: '#FF695E'
                  }}
                />
              </PortWidget>
            </div>
          </div>
        </div>

        <StatisticsTooltip
          id={this.props.node.id}
          anchorElement={this.state.anchorElementForTooltip}
        />

        <Dialog
          open={this.state.dialogOpened}
          onClose={this.closeDialog}
          aria-labelledby='form-dialog-title'
          onKeyUp={event => {
            if (event.keyCode === 46 || event.keyCode === 8) {
              event.preventDefault();
              event.stopPropagation();
              return false;
            }
          }}
          // fullScreen={this.state.creatingNewSegment}
          // disableEscapeKeyDown={this.state.creatingNewSegment}
        >            
          <DialogTitle id='form-dialog-title'>Goal node</DialogTitle>

          <DialogContent>
            <DialogContentText>
              Goal node evaluates whether user has completed selected onboarding goals. 
              Timeout value can be optionally specified, defining a point in time when evalution of completed goals is stopped.
              Execution flow can be directed two ways from the node - a positive direction, when all goals are completed, or a negative one, when timeout threshold is reached.
            </DialogContentText>

            <Grid container spacing={32}>
              <Grid item xs={6}>
                <TextField
                  margin='normal'
                  id='goal-name'
                  label='Node name'
                  fullWidth
                  value={this.state.nodeFormName}
                  onChange={event => {
                    this.setState({
                      nodeFormName: event.target.value
                    });
                  }}
                />
              </Grid>
            </Grid>

            <Grid container spacing={32}>
              <Grid item xs={12}>
                <MaterialSelect
                  options={this.transformOptionsForSelect()}
                  value={this.getFormatedValue()}
                  onChange={selectedGoals => {
                    this.setState({
                      selectedGoals: selectedGoals.map(item => item.value)
                    });
                  }}
                  isMulti={true}
                  placeholder='Pick goals'
                  label='Selected Goal(s)'
                />
              </Grid>
            </Grid>
            
            <Grid container spacing={32}>
              <Grid item xs={6}>
                <TextField
                  id='timeout-time'
                  label='Timeout time'
                  type='number'
                  placeholder="No timeout"
                  helperText="Optionally select a timeout"
                  fullWidth
                  value={this.state.timeoutTime}
                  onChange={event => {
                    this.setState({
                      timeoutTime: event.target.value
                    });
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel htmlFor='time-unit'>Time unit</InputLabel>
                  <Select
                    value={this.state.timeoutUnit}
                    onChange={event => {
                      this.setState({
                        timeoutUnit: event.target.value
                      });
                    }}
                    inputProps={{
                      name: 'time-unit',
                      id: 'time-unit'
                    }}
                  >
                    <MenuItem value='minutes'>Minutes</MenuItem>
                    <MenuItem value='hours'>Hours</MenuItem>
                    <MenuItem value='days'>Days</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

          </DialogContent>

          <DialogActions>
            <Button
              color='secondary'
              onClick={() => {
                this.closeDialog();
              }}
            >
              Cancel
            </Button>

            <Button
              color='primary'
              onClick={() => {
                this.props.node.name = this.state.nodeFormName;
                this.props.node.selectedGoals = this.state.selectedGoals;
                this.props.node.timeoutTime = this.state.timeoutTime;
                this.props.node.timeoutUnit = this.state.timeoutUnit;
                this.props.diagramEngine.repaintCanvas();
                this.closeDialog();
              }}
            >
              Save changes
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { goals, dispatch } = state;

  return {
    goals: goals.availableGoals,
    dispatch
  };
}

export default connect(mapStateToProps)(NodeWidget);
