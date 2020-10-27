import uuidv4 from 'uuid/v4';

///////////////////////////
// local reducer and state for criteria builder
///////////////////////////

export function emptyNode() {
	return {
		id: uuidv4(),
		key: '',
		values: {},
	};
}

export function actionSetNodeValues(nodeId, values) {
	return {
		type: 'SET_NODE_VALUES',
		payload: {
			values: values,
			nodeId: nodeId,
		}
	};
}

export function actionUpdateNodeValues(nodeId, values) {
	return {
		type: 'UPDATE_NODE_VALUES',
		payload: {
			values: values,
			nodeId: nodeId,
		}
	};
}
export function actionSetKeyForNode(nodeId, key) {
	return {
		type: 'SET_KEY_FOR_NODE',
		payload: {
			key: key,
			nodeId: nodeId,
		}
	};
}

export function actionDeleteNode(nodeId) {
	return {
		type: 'DELETE_NODE',
		payload: {
			nodeId: nodeId,
		}
	};
}

export function actionAddCriterion() {
	return {
		type: 'ADD_CRITERION'
	};
}

export function actionSetEvent(event) {
	return {
		type: 'SET_EVENT',
		payload: event
	};
}

export function reducer(state, action) {
	switch (action.type) {
		case 'UPDATE_NODE_VALUES':
			return {
				...state, nodes: state.nodes.map(node => {
					if (node.id === action.payload.nodeId) {
						return {
							...node,
							values: Object.assign(node.values, action.payload.values)
						};
					}
					return node;
				})
			};
		case 'SET_NODE_VALUES':
			return {
				...state, nodes: state.nodes.map(node => {
					if (node.id === action.payload.nodeId) {
						return {
							...node,
							values: action.payload.values
						};
					}
					return node;
				})
			};
		case 'SET_EVENT':
			// this also resets nodes state
			return {
				...state, nodes: [emptyNode()], event: action.payload
			};
		case 'ADD_CRITERION':
			return {
				...state, nodes: [...state.nodes, emptyNode()]
			};
		case 'DELETE_NODE':
			return {
				...state, nodes: state.nodes.filter(n => n.id !== action.payload.nodeId)
			};
		case 'SET_KEY_FOR_NODE':
			let newNodes = state.nodes.map(node => {
				if (action.payload.nodeId === node.id) return {
					id: node.id,
					key: action.payload.key,
					values: {}, // reset values, TODO: add default value depending on key type
				};
				return node;
			});
			return {
				...state, nodes: newNodes
			};
		default:
			throw new Error("unsupported action type " + action.type);
	}
}
