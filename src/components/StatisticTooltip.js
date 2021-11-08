import React from 'react';
import PropTypes from 'prop-types';
import Popover from '@material-ui/core/Popover';
import { connect } from 'react-redux';

class StatisticsTooltip extends React.Component {
  static propTypes = {
    id: PropTypes.string.isRequired,
    anchorElement: PropTypes.instanceOf(Element)
  };

  render() {
    const { anchorElement } = this.props;
    const data = this.props.statistics[this.props.id] ?? null;
    const variants = this.props.variants ?? [];

    if (data === null) {
      return null;
    }

    return (
      <Popover
        open={Boolean(anchorElement)}
        anchorEl={anchorElement}
        style={{ pointerEvents: 'none' }}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center'
        }}
      >
        <div className='node-tooltip-wrapper'>
          {data ?
            <div className="scenario-tooltip" style={{padding: '10px'}}>
              <strong style={{color: 'red'}}>Statistics</strong>
              <hr/>

              <strong>Last 24 hours</strong><br/>
              <table>
                <tbody>
                {data.hasOwnProperty('finished') ?
                  <tr>
                    <td>Finished:</td>
                    <td>{data.finished["24h"]}</td>
                  </tr> : null}
                {data.hasOwnProperty('matched') ?<tr>
                  <td>Matched:</td>
                  <td>{data.matched["24h"]}</td>
                </tr> : null}
                {data.hasOwnProperty('notMatched') ? <tr>
                    <td>Not matched:</td>
                    <td>{data.notMatched["24h"]}</td>
                  </tr> : null}
                {data.hasOwnProperty('waiting') ? <tr>
                    <td>Waiting:</td>
                    <td>{data.waiting["24h"]}</td>
                  </tr> : null}
                {variants.flatMap((variant) => (
                  <tr key={variant.code}>
                    <td>{variant.name}:</td>
                    <td>{data[variant.code] ? data[variant.code]["24h"] : 0}</td>
                  </tr>
                ))}
                </tbody>
              </table>

              <strong>Last 30 days</strong><br/>

              <table>
                <tbody>
                  {data.hasOwnProperty('finished') ?
                    <tr>
                      <td>Finished:</td>
                      <td>{data.finished["30d"]}</td>
                    </tr> : null}
                  {data.hasOwnProperty('matched') ?
                    <tr>
                      <td>Matched:</td>
                      <td>{data.matched["30d"]}</td>
                    </tr> : null}
                  {data.hasOwnProperty('notMatched') ?
                    <tr>
                      <td>Not matched:</td>
                      <td>{data.notMatched["30d"]}</td>
                    </tr> : null}
                  {data.hasOwnProperty('waiting') ?
                    <tr>
                      <td>Waiting:</td>
                      <td>{data.waiting["30d"]}</td>
                    </tr> : null}
                  {variants.flatMap((variant) => (
                    <tr key={variant.code}>
                      <td>{variant.name}:</td>
                      <td>{data[variant.code] ? data[variant.code]["30d"] : 0}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            : ''}
        </div>
      </Popover>
    );
  }
}

function mapStateToProps(state) {
  return {
    statistics: state.statistics.statistics
  };
}

export default connect(mapStateToProps)(StatisticsTooltip);
