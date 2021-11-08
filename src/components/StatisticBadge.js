import React from "react";
import {useSelector} from 'react-redux';
import Chip from "@material-ui/core/Chip";

function StatisticBadge(props) {

  const formatLabelNumbers = number => {
    if (number < 1000) {
      return number;
    }
    if (number < 1000000) {
      return Number(number / 1000).toFixed((number > 100000 ? 0 : 1)) + 'K';
    }

    return Number(number / 1000000).toFixed(1) + 'M';
  };

  const defaultTimePeriod = '24h';
  const statistics = useSelector(state => state.statistics.statistics);
  const data = statistics[props.elementId] ?? null;

  if (data === null) {
    return null;
  }

  let label = null;
  if (data.hasOwnProperty('finished')) {
    label = data.finished[defaultTimePeriod];
  }

  if (props.position === 'right' && data.hasOwnProperty('matched')) {
    label = data.matched[defaultTimePeriod];
  }

  if (props.position === 'bottom' && data.hasOwnProperty('notMatched')) {
    label = data.notMatched[defaultTimePeriod];
  }

  if (props.hasOwnProperty('index')) {
    if (!data[props.index]) {
      label = 0;
    } else {
      label = data[props.index][defaultTimePeriod];
    }
  }

  if (label === null) {
    return null;
  }

  return (
      <Chip
        label={formatLabelNumbers(label)}
        color="primary"
        size="small"
        style={{backgroundColor: props.color, height: '16px', borderRadius: '4px', fontSize: '0.7rem'}}
        className={"statistic-badge statistic-badge-" + props.position}
      />
  );
}


export default StatisticBadge;