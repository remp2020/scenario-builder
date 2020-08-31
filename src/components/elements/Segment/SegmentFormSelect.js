import React from 'react';
import {useSelector} from "react-redux";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";

function optionLabel(option) {
    return typeof(option) === 'string' ? option : option.name;
}

function optionSelected(option, value) {
    if (value && value.hasOwnProperty('code')) {
        return option.code === value.code;
    }

    return false;
}

function value(selectedSegment, items) {
    const item = items.filter(item => item.code === selectedSegment)[0];

    return item ? item : null;
}

export default function SegmentFormSelect(props) {
    const items = useSelector(state => state.segments.avalaibleSegments.filter(
        item => item.table === props.selectedSegmentSourceTable
    ))[0].segments.sort(
        (a,b) => a.group.sorting - b.group.sorting === 0 ? a.group.id - b.group.id : a.group.sorting - b.group.sorting
    );

    return (
        <Autocomplete
            value={value(props.selectedSegment, items)}
            options={items}
            getOptionSelected={optionSelected}
            getOptionLabel={optionLabel}
            groupBy={(option) => option.group.name}
            style={{ width: 700, marginLeft: 10, marginBottom:5 }}
            onChange={(event, value) => {props.onSegmentSelectedChange(value)}}
            renderInput={params => (
                <TextField {...params} variant="standard" label="Segment" fullWidth />
            )}
        />
    );
}