import { MeshNode, MeshMessage, EmergencyAlert, MessageRelayStatus } from '../types';

export class EmergencyNetworkService {
  /**
   * Calculates Euclidean distance in meters between two lat/lng pairs
   */
  static getDistanceMeters(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371e3; // Earth radius in metres
    const phi1 = (lat1 * Math.PI) / 180;
    const phi2 = (lat2 * Math.PI) / 180;
    const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
    const deltaLambda = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
      Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c);
  }

  /**
   * Discovers peers within range of current node
   */
  static discoverNearbyDevices(currentNodeId: string, allNodes: MeshNode[]): MeshNode[] {
    const current = allNodes.find((n) => n.id === currentNodeId);
    if (!current) return [];

    return allNodes.filter((node) => {
      if (node.id === current.id) return false;
      const distance = this.getDistanceMeters(current.lat, current.lng, node.lat, node.lng);
      // Can communicate if distance <= maximum range of the transmitting/receiving pair
      const effectiveRange = Math.max(current.rangeMeters, node.rangeMeters);
      return distance <= effectiveRange;
    });
  }

  /**
   * Creates an emergency message packet formatted for simulated mesh relay
   */
  static createEmergencyMessage(alert: EmergencyAlert, originNodeId: string): MeshMessage {
    return {
      messageId: `PKT-${alert.id}-${Date.now().toString(36).toUpperCase()}`,
      senderId: originNodeId,
      senderName: alert.userName,
      timestamp: new Date().toISOString(),
      location: alert.location,
      emergencyType: alert.emergencyType,
      priority: alert.priority,
      hopCount: 0,
      maxHops: 6,
      status: 'OFFLINE',
      currentCarrierNodeId: originNodeId,
      pathNodeIds: [originNodeId],
      payloadSummary: `[SOS:${alert.emergencyType}] ${alert.peopleCount} ppl at ${alert.location.address}. ${alert.details}`,
    };
  }

  /**
   * Simulates finding the best next hop towards a gateway
   */
  static selectNextHop(
    currentCarrierId: string,
    message: MeshMessage,
    allNodes: MeshNode[]
  ): MeshNode | null {
    const nearby = this.discoverNearbyDevices(currentCarrierId, allNodes);
    if (nearby.length === 0) return null;

    // Filter out nodes already in the hop path to prevent looping
    const unvisited = nearby.filter((n) => !message.pathNodeIds.includes(n.id));
    if (unvisited.length === 0) return null;

    // Prioritize direct gateways first
    const directGateway = unvisited.find((n) => n.isGateway);
    if (directGateway) return directGateway;

    // Next prioritize high-altitude drones or responder radios
    const highPowerNode = unvisited.find(
      (n) => n.type === 'drone_node' || n.type === 'responder_radio'
    );
    if (highPowerNode) return highPowerNode;

    // Otherwise choose node closest to any known gateway
    const gateways = allNodes.filter((n) => n.isGateway);
    if (gateways.length > 0) {
      const primaryGateway = gateways[0];
      return unvisited.sort((a, b) => {
        const distA = this.getDistanceMeters(a.lat, a.lng, primaryGateway.lat, primaryGateway.lng);
        const distB = this.getDistanceMeters(b.lat, b.lng, primaryGateway.lat, primaryGateway.lng);
        return distA - distB;
      })[0];
    }

    return unvisited[0];
  }

  /**
   * Helper to find a path from source node to gateway
   */
  static findPathToGateway(sourceNodeId: string, allNodes: MeshNode[]): string[] {
    const path = [sourceNodeId];
    let currentId = sourceNodeId;

    for (let hop = 0; hop < 5; hop++) {
      const currentNode = allNodes.find((n) => n.id === currentId);
      if (!currentNode || currentNode.isGateway) break;

      const dummyMsg: MeshMessage = {
        messageId: 'PATH_PROBE',
        senderId: sourceNodeId,
        senderName: 'probe',
        timestamp: new Date().toISOString(),
        location: { lat: 12.95, lng: 77.58, address: '', zone: '' },
        emergencyType: 'Trapped',
        priority: 'CRITICAL',
        hopCount: hop,
        maxHops: 5,
        status: 'OFFLINE',
        pathNodeIds: path,
      };

      const nextNode = this.selectNextHop(currentId, dummyMsg, allNodes);
      if (!nextNode || path.includes(nextNode.id)) break;

      path.push(nextNode.id);
      currentId = nextNode.id;
      if (nextNode.isGateway) break;
    }

    return path;
  }
}
