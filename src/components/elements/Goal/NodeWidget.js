import * as React from 'react';
import { connect } from 'react-redux';
import OkIcon from '@material-ui/icons/Check';
import NopeIcon from '@material-ui/icons/Close';
import TimeoutIcon from '@material-ui/icons/AccessTime';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
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
      selectedGoal: this.props.node.selectedGoal,
      dialogOpened: false,
      anchorElementForTooltip: null
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
      selectedGoal: this.props.node.selectedGoal,
      anchorElementForTooltip: null
    });
    this.props.dispatch(setCanvasZoomingAndPanning(false));
  };

  closeDialog = () => {
    this.setState({ dialogOpened: false });
    this.props.dispatch(setCanvasZoomingAndPanning(true));
  };

  // maybe refactor to more effective way if is a problem
  transformOptionsForSelect = () => {

    return [];

    // this.props.goals

    // const lodashGrouped = groupBy(
    //   this.props.segments,
    //   segment => segment.group.name
    // );

    // const properlyGrouped = [];

    // Object.keys(lodashGrouped).forEach(key => {
    //   properlyGrouped.push({
    //     label: key,
    //     sorting: lodashGrouped[key][0].group.sorting,
    //     options: lodashGrouped[key].map(segment => ({
    //       value: segment.code,
    //       label: segment.name
    //     }))
    //   });
    // });

    // const properlyGroupedSorted = properlyGrouped.sort((a, b) => {
    //   return a.sorting - b.sorting;
    // });

    // return properlyGroupedSorted;
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
    const match = this.props.goals.find(goal => {
      return goal.code === this.state.selectedGoal;
    });

    return match
      ? {
          value: match.code,
          label: match.name
        }
      : {};
  };

  getSelectedGoalValue = () => {
    const selected = this.props.goals.find(
      goal => goal.code === this.props.node.selectedGoal
    );

    return selected ? ` - ${selected.name}` : '';
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
            {this.props.node.name
              ? this.props.node.name
              : `Goal ${this.getSelectedGoalValue()}`}
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
              Goal node evaluates whether user has completed selected onboarding goal.
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
                  onChange={event => {
                    this.setState({
                      selectedGoal: event.value
                    });
                  }}
                  placeholder='Pick one'
                  label='Selected Goal'
                />
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
                this.props.node.selectedGoal = this.state.selectedGoal;

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
