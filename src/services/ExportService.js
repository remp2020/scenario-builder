function unitTimeToMinutes(time, unit) {
  switch (unit) {
    case 'minutes':
      return parseInt(time);
    case 'hours':
      return time * 60;
    case 'days':
      return time * 60 * 24;
    default:
      return parseInt(time);
  }
}

export class ExportService {
  constructor(model) {
    this.model = model;
  }

  exportPayload() {
    const payload = {};
    const serializedModel = this.model.serializeDiagram();
    const triggers = ['trigger', 'before_trigger'];

    payload.triggers = {};
    payload.elements = {};

    payload.visual = {};

    serializedModel.nodes
      .filter(node => triggers.includes(node.type))
      .map(node => (payload.triggers[node.id] = this.formatNode(node)));

    Object.entries(this.model.getNodes()).forEach(node => {
      payload.visual[node[0]] = {
        x: node[1].x,
        y: node[1].y
      };
    });

    Object.entries(this.model.getNodes()).forEach(node => {
      if (!triggers.includes(node[1].type)) {
        payload.elements[node[0]] = this.formatNode(node[1].serialize());
      }
    });

    return payload;
  }

  getAllChildrenNodes(node, portName = 'right') {
    const port = node.ports.find(port => port.name === portName);

    return port.links.map(link => {
      let nextNode = null;

      if (this.model.links[link].targetPort.parent.id !== node.id) {
        nextNode = this.model.links[link].targetPort.parent;
      } else {
        nextNode = this.model.links[link].sourcePort.parent;
      }

      return { ...nextNode.serialize(), portName };
    });
  }

  getPositiveAndNegativeDescendants(node) {
    const descendantsPositive = this.getAllChildrenNodes(node, 'right').map(
      descendantNode => this.formatDescendant(descendantNode, node)
    );
    const descendantsNegative = this.getAllChildrenNodes(node, 'bottom').map(
      descendantNode => this.formatDescendant(descendantNode, node)
    );
    return [...descendantsPositive, ...descendantsNegative];
  }

  formatNode(node) {
    if (node.type === 'email') {
      return {
        id: node.id,
        name: node.name ? node.name : '',
        type: 'email',
        email: {
          code: node.selectedMail,
          descendants: this.getAllChildrenNodes(node).map(descendantNode =>
            this.formatDescendant(descendantNode, node)
          )
        }
      };
    } else if (node.type === 'banner') {
      return {
        id: node.id,
        name: node.name ? node.name : '',
        type: 'banner',
        banner: {
          id: node.selectedBanner,
          expiresInMinutes: unitTimeToMinutes(node.expiresInTime, node.expiresInUnit),
          descendants: this.getAllChildrenNodes(node).map(descendantNode =>
            this.formatDescendant(descendantNode, node)
          )
        }
      };
    } else if (node.type === 'generic') {
      return {
        id: node.id,
        name: node.name ? node.name : '',
        type: 'generic',
        generic: {
          code: node.selectedGeneric,
          descendants: this.getAllChildrenNodes(node).map(descendantNode =>
            this.formatDescendant(descendantNode, node)
          )
        }
      };
    } else if (node.type === 'condition') {
      return {
        id: node.id,
        name: node.name ? node.name : '',
        type: 'condition',
        condition: {
          conditions: node.conditions,
          descendants: this.getPositiveAndNegativeDescendants(node),
        }
      };
    } else if (node.type === 'segment') {
      return {
        id: node.id,
        name: node.name ? node.name : '',
        type: 'segment',
        segment: {
          code: node.selectedSegment ? node.selectedSegment : 'all_users',
          descendants: this.getPositiveAndNegativeDescendants(node),
        }
      };
    } else if (node.type === 'trigger') {
      return {
        id: node.id,
        name: node.name ? node.name : '',
        type: 'event',
        event: {
          code: node.selectedTrigger ? node.selectedTrigger : 'user_created'
        },
        elements: this.getAllChildrenNodes(node).map(
          descendantNode => descendantNode.id
        )
      };
    } else if (node.type === 'before_trigger') {
      return {
        id: node.id,
        name: node.name ? node.name : '',
        type: 'before_event',
        event: {
          code: node.selectedTrigger ? node.selectedTrigger : 'subscription_ends'
        },
        elements: this.getAllChildrenNodes(node).map(
          descendantNode => descendantNode.id
        ),
        options: {
          minutes: unitTimeToMinutes(node.time, node.timeUnit)
        }
      };
    } else if (node.type === 'wait') {
      return {
        id: node.id,
        name: node.name ? node.name : '',
        type: 'wait',
        wait: {
          minutes: unitTimeToMinutes(node.waitingTime, node.waitingUnit),
          descendants: this.getAllChildrenNodes(node).map(descendantNode =>
            this.formatDescendant(descendantNode, node)
          )
        }
      };
    } else if (node.type === 'goal') {
      let goalProperties = {
        codes: node.selectedGoals ? node.selectedGoals : [],
        descendants: this.getPositiveAndNegativeDescendants(node),
        recheckPeriodMinutes: unitTimeToMinutes(node.recheckPeriodTime, node.recheckPeriodUnit)
      };

      if (node.timeoutTime && node.timeoutUnit) {
        goalProperties.timeoutMinutes = unitTimeToMinutes(node.timeoutTime, node.timeoutUnit);
      }

      return {
        id: node.id,
        name: node.name ? node.name : '',
        type: 'goal',
        goal: goalProperties,
      };
    } else if (node.type === 'push_notification') {
      return {
        id: node.id,
        name: node.name ? node.name : '',
        type: 'push_notification',
        push_notification: {
          template: node.selectedTemplate,
          application: node.selectedApplication,
          descendants: this.getAllChildrenNodes(node).map(descendantNode =>
            this.formatDescendant(descendantNode, node)
          )
        },

      }
    }
  }

  formatDescendant = (node, parentNode) => {
    let descendant = {
      uuid: node.id
    };

    if (parentNode.type === 'segment') {
      descendant.direction = node.portName === 'right' ? 'positive' : 'negative';
    } else if (parentNode.type === 'goal') {
      descendant.direction = node.portName === 'right' ? 'positive' : 'negative';
    } else if (parentNode.type === 'condition') {
      descendant.direction = node.portName === 'right' ? 'positive' : 'negative';
    }

    return descendant;
  };

  
}
