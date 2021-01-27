import * as React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ActionIcon from '@material-ui/icons/Extension';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import { PortWidget } from "../../widgets/PortWidget";
import Autocomplete from '@material-ui/lab/Autocomplete';
import { setCanvasZoomingAndPanning } from "../../../actions";
import { withStyles } from '@material-ui/core/styles';
import { createFilterOptions } from '@material-ui/lab/Autocomplete';

const styles = theme => ({
  autocomplete: {
    margin: theme.spacing(1)
  },
  subtitle: {
    paddingLeft: '6px',
    color: theme.palette.grey[600]
  },
});

const filterOptions = createFilterOptions({
  matchFrom: 'any',
  trim: true,
  ignoreAccents: true,
  ignoreCase: true,
  stringify: option => {
    return option.label + " " + option.value;
  },
});

class NodeWidget extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      nodeFormName: this.props.node.name,
      selectedGeneric: this.props.node.selectedGeneric,
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
    const match = this.props.generics.find(generic => {
      return generic.code === this.state.selectedGeneric;
    });

    return match ? match : null;
  };

  // maybe refactor to more effective way if is a problem
  transformOptionsForSelect = () => {
    const generics = [];

    Object.keys(this.props.generics).forEach(key => {
      generics.push({
        value: this.props.generics[key].code,
        label: this.props.generics[key].label
      });
    });

    return generics;
  };

  getSelectedGenericValue = () => {
    const selected = this.props.generics.find(
      generic => generic.code === this.props.node.selectedGeneric
    );

    return selected ? ` - ${selected.label}` : '';
  };

  render() {
    const { classes } = this.props;
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
              : `Generic ${this.getSelectedGenericValue()}`}
          </div>
        </div>

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
          <DialogTitle id='form-dialog-title'>Generic action node</DialogTitle>

          <DialogContent>
            <DialogContentText>Runs defined generic action.</DialogContentText>

            <Grid container>
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

            <Grid container alignItems='center' alignContent='space-between'>
              <Grid item xs={12}>
                <Autocomplete
                  value={this.getFormatedValue()}
                  options={this.transformOptionsForSelect()}
                  getOptionLabel={(option) => option.label}
                  filterOptions={filterOptions}
                  onChange={(event, selectedOption) => {
                    if (selectedOption !== null) {
                      this.setState({
                        selectedGeneric: selectedOption.value
                      });
                    }
                  }}
                  renderInput={params => (
                    <TextField {...params} variant="standard" label="Action" fullWidth />
                  )}
                  renderOption={(option, { selected }) => (
                    <div>
                      <span className={classes.title}>{option.label}</span>
                      <small className={classes.subtitle}>({option.value})</small>
                    </div>
                  )}
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
                // https://github.com/projectstorm/react-diagrams/issues/50 huh

                this.props.node.name = this.state.nodeFormName;
                this.props.node.selectedGeneric = this.state.selectedGeneric;

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

NodeWidget.propTypes = {
  classes: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
  return {
    generics: state.generics.generics,
  };
}

export default connect(mapStateToProps)(
  withStyles(styles)(NodeWidget)
);
