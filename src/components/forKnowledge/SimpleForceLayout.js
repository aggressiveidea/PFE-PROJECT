class SimpleForceLayout {
  constructor(nodes, edges, options = {}) {
    this.nodes = nodes.map((node) => ({
      ...node,
      vx: 0,
      vy: 0,
      fx: node.fixed ? node.x : null,
      fy: node.fixed ? node.y : null,
    }));

    this.edges = edges;

    this.options = {
      width: 500,
      height: 400,
      linkDistance: 50,
      linkStrength: 0.7,
      charge: -30,
      gravity: 0.1,
      friction: 0.9,
      alpha: 0.1,
      alphaDecay: 0.02,
      alphaMin: 0.001,
      ...options,
    };

    this.alpha = this.options.alpha;
  }

  initializePositions() {
    this.nodes.forEach((node) => {
      if (node.x === undefined || node.y === undefined) {
        node.x = Math.random() * this.options.width;
        node.y = Math.random() * this.options.height;
      }
    });
  }

  tick() {
    if (this.alpha < this.options.alphaMin) return false;

    this.applyLinkForces();
    this.applyManyBodyForces();
    this.applyCenterForce();

    this.nodes.forEach((node) => {
      if (node.fx !== null) {
        node.x = node.fx;
        node.vx = 0;
      } else {
        node.vx *= this.options.friction;
        node.x += node.vx;
      }

      if (node.fy !== null) {
        node.y = node.fy;
        node.vy = 0;
      } else {
        node.vy *= this.options.friction;
        node.y += node.vy;
      }
    });

    this.alpha +=
      (this.options.alphaMin - this.alpha) * this.options.alphaDecay;

    return true;
  }

  applyLinkForces() {
    this.edges.forEach((edge) => {
      const source = this.nodes.find((n) => n.id === edge.source);
      const target = this.nodes.find((n) => n.id === edge.target);

      if (!source || !target) return;

      const dx = target.x - source.x;
      const dy = target.y - source.y;
      const distance = Math.sqrt(dx * dx + dy * dy) || 1;

      const force =
        (this.options.linkStrength * (distance - this.options.linkDistance)) /
        distance;

      if (source.fx === null) {
        source.vx += dx * force;
        source.vy += dy * force;
      }

      if (target.fx === null) {
        target.vx -= dx * force;
        target.vy -= dy * force;
      }
    });
  }

  applyManyBodyForces() {
    for (let i = 0; i < this.nodes.length; i++) {
      const node1 = this.nodes[i];

      for (let j = i + 1; j < this.nodes.length; j++) {
        const node2 = this.nodes[j];

        const dx = node2.x - node1.x;
        const dy = node2.y - node1.y;
        const distanceSquared = dx * dx + dy * dy || 1;
        const distance = Math.sqrt(distanceSquared);

        const force = this.options.charge / distanceSquared;


        if (node1.fx === null) {
          node1.vx -= dx * force;
          node1.vy -= dy * force;
        }

        if (node2.fx === null) {
          node2.vx += dx * force;
          node2.vy += dy * force;
        }
      }
    }
  }

  // Apply force toward the center
  applyCenterForce() {
    const centerX = this.options.width / 2;
    const centerY = this.options.height / 2;

    this.nodes.forEach((node) => {
      if (node.fx === null) {
        node.vx += (centerX - node.x) * this.options.gravity;
        node.vy += (centerY - node.y) * this.options.gravity;
      }
    });
  }

  // Run the simulation for a specified number of steps
  run(steps = 100) {
    this.initializePositions();

    for (let i = 0; i < steps; i++) {
      if (!this.tick()) break;
    }

    return this.nodes;
  }

  // Get the current state of the nodes
  getPositions() {
    return this.nodes.map((node) => ({
      id: node.id,
      x: node.x,
      y: node.y,
    }));
  }
}

export default SimpleForceLayout;
