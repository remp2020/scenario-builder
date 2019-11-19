import * as React from 'react';
import { connect } from 'react-redux';
import ActionIcon from '@material-ui/icons/Adjust';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

import { PortWidget } from '../../widgets/PortWidget';
import StatisticsTooltip from '../../StatisticTooltip';
import MaterialSelect from '../../MaterialSelect';
import { setCanvasZoomingAndPanning } from '../../../actions';

class NodeWidget extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      nodeFormName: this.props.node.name,
      selectedBanner: this.props.node.selectedBanner,
      dialogOpened: false,
      anchorElementForTooltip: null,
      expiresInTime: this.props.node.expiresInTime,
      expiresInUnit: this.props.node.expiresInUnit,
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

  getFormatedValue = () => {
    const match = this.props.banners.find(banner => {
      return banner.id === this.state.selectedBanner;
    });

    return match
      ? {
          value: match.id,
          label: match.name
        }
      : {};
  };

  // maybe refactor to more effective way if is a problem
  transformOptionsForSelect = () => {
    const banners = this.props.banners.map(banner => ({
      value: banner.id,
      label: banner.name,
    }));
    return banners;
  };

  getSelectedMailValue = () => {
    const selected = this.props.banners.find(
      banner => banner.id === this.props.node.selectedBanner
    );

    return selected ? ` - ${selected.name}` : '';
  };

  render() {
    return (
      <div
        className={this.getClassName()}
        style={{ background: this.props.node.color }}
        onDoubleClick={() => {
          this.openDialog();
        }}
        onMouseEnter={this.handleNodeMouseEnter}
        onMouseLeave={this.handleNodeMouseLeave}
      >
        <div className='node-container'>
          <div className={this.bem('__icon')}>
            <ActionIcon />
          </div>

          <div className={this.bem('__ports')}>
            <div className={this.bem('__left')}>
              <PortWidget name='left' node={this.props.node} />
            </div>
            <div className={this.bem('__right')}>
              <PortWidget name='right' node={this.props.node} />
            </div>
          </div>
        </div>
        <div className={this.bem('__title')}>
          <div className={this.bem('__name')}>
            {this.props.node.name
              ? this.props.node.name
              : `Banner ${this.getSelectedMailValue()}`}
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
          fullWidth
        >
          <DialogTitle id='form-dialog-title'>Banner node</DialogTitle>

          <DialogContent>
            <DialogContentText>Shows a one-time banner to user.</DialogContentText>

            <Grid container spacing={32}>
              <Grid item xs={6}>
                <TextField
                  margin='normal'
                  id='action-name'
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
                      selectedBanner: event.value
                    });
                  }}
                  placeholder='Pick one'
                  label='Selected Banner'
                />
              </Grid>
            </Grid>

            <Grid container spacing={32}>
              <Grid item xs={6}>
                <TextField
                  id='expires-in-time'
                  label='Expires in'
                  type='number'
                  helperText="Banner is not shown after given period"
                  fullWidth
                  value={this.state.expiresInTime}
                  onChange={event => {
                    this.setState({
                      expiresInTime: event.target.value
                    });
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel htmlFor='time-unit'>Time unit</InputLabel>
                  <Select
                    value={this.state.expiresInUnit}
                    onChange={event => {
                      this.setState({
                        expiresInUnit: event.target.value
                      });
                    }}
                    inputProps={{
                      name: 'expires-in-unit',
                      id: 'expires-in-unit'
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
                // https://github.com/projectstorm/react-diagrams/issues/50 huh

                this.props.node.name = this.state.nodeFormName;
                this.props.node.selectedBanner = this.state.selectedBanner;

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
  return {
    banners: state.banners.availableBanners
  };
}

export default connect(mapStateToProps)(NodeWidget);
