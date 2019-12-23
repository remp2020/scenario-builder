import * as React from 'react';
import { connect } from 'react-redux';
import ConditionIcon from '@material-ui/icons/CallSplit';
import OkIcon from '@material-ui/icons/Check';
import NopeIcon from '@material-ui/icons/Close';
// import Grid from '@material-ui/core/Grid';
// import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
// import ButtonGroup from '@material-ui/core/ButtonGroup';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
// import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import StatisticsTooltip from '../../StatisticTooltip';
import { PortWidget } from './../../widgets/PortWidget';
import { setCanvasZoomingAndPanning } from '../../../actions';
import CriteriaBuilder from './CriteriaBuilder';

class NodeWidget extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      nodeFormName: this.props.node.name,
      criteria: this.props.node.name,
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
      selectedSegment: this.props.node.selectedSegment,
      anchorElementForTooltip: null
    });
    this.props.dispatch(setCanvasZoomingAndPanning(false));
  };

  closeDialog = () => {
    this.setState({ dialogOpened: false });
    this.props.dispatch(setCanvasZoomingAndPanning(true));
  };

  handleNodeMouseEnter = event => {
    if (!this.state.dialogOpened) {
      this.setState({ anchorElementForTooltip: event.currentTarget });
    }
  };

  handleNodeMouseLeave = () => {
    this.setState({ anchorElementForTooltip: null });
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
              : 'Condition'}
          </div>
        </div>

        <div className='node-container'>
          <div className={this.bem('__icon')}>
            <ConditionIcon />
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
                <NopeIcon
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
        >
            <DialogTitle id='form-dialog-title'>
              Event Condition
            </DialogTitle>
            <DialogContent>
              <CriteriaBuilder criteria={this.state.criteria}></CriteriaBuilder>
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

            {/* <Button
              color='primary'
              onClick={() => {
                // https://github.com/projectstorm/react-diagrams/issues/50 huh

                this.props.node.name = this.state.nodeFormName;
                this.props.node.selectedSegment = this.state.selectedSegment;

                this.props.diagramEngine.repaintCanvas();
                this.closeDialog();
              }}
            >
              Save changes
            </Button> */}
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { criteria, dispatch } = state;

  return {
    criteria: criteria.criteria,
    dispatch
  };
}

export default connect(mapStateToProps)(NodeWidget);
