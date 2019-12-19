import * as React from 'react';
import { AbstractNodeFactory } from 'storm-react-diagrams';

import NodeWidget from './NodeWidget';
import { NodeModel } from './NodeModel';

export class NodeFactory extends AbstractNodeFactory {
  constructor() {
    super('condition');
  }

  generateReactWidget(diagramEngine, node) {
    return (
      <NodeWidget
        diagramEngine={diagramEngine}
        node={node}
        classBaseName='diamond-node'
        className='condition-node'
      />
    );
  }

  getNewInstance() {
    return new NodeModel();
  }
}
