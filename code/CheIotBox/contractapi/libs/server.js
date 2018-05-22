var insight= require('./nodes/insight')

let nodeConfigs = {
  insight: insight
}

const defaultNodeId = 'insight'
let currentNodeId = defaultNodeId

module.exports =  {
  currentNode() {
    return nodeConfigs[currentNodeId]
  },

  setNodeId(nodeId) {
    if (nodeConfigs[nodeId]) {
      currentNodeId = nodeId
    }
  }
}
