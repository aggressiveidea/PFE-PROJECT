export const initKnowledgeGraphAnimation = (container) => {
    if (typeof window === "undefined") return () => {}
  
    const width = container.clientWidth
    const height = container.clientHeight
  
    const canvas = document.createElement("canvas")
    canvas.width = width * window.devicePixelRatio
    canvas.height = height * window.devicePixelRatio
    canvas.style.width = `${width}px`
    canvas.style.height = `${height}px`
    container.appendChild(canvas)
  
    const ctx = canvas.getContext("2d")
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
  
    // Generate nodes with larger sizes
    const nodes = Array.from({ length: 25 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 20 + 15, // Much larger nodes
      color: getRandomColor(),
      vx: (Math.random() - 0.5) * 0.8,
      vy: (Math.random() - 0.5) * 0.8,
    }))
  
    // Generate more visible links
    const links = []
    for (let i = 0; i < nodes.length; i++) {
      const numLinks = Math.floor(Math.random() * 3) + 2 // Ensure at least 2 links per node
      for (let j = 0; j < numLinks; j++) {
        const target = Math.floor(Math.random() * nodes.length)
        if (i !== target) {
          links.push({ source: i, target })
        }
      }
    }
  
    let animationFrameId
  
    const animate = () => {
      ctx.clearRect(0, 0, width, height)
  
      // Draw links with increased opacity and width
      ctx.strokeStyle = "rgba(255, 255, 255, 0.3)" // More visible links
      ctx.lineWidth = 2 // Thicker lines
  
      links.forEach((link) => {
        const source = nodes[link.source]
        const target = nodes[link.target]
  
        ctx.beginPath()
        ctx.moveTo(source.x, source.y)
        ctx.lineTo(target.x, target.y)
        ctx.stroke()
      })
  
      // Draw and update nodes
      nodes.forEach((node) => {
        // Update position with slower movement
        node.x += node.vx * 0.3
        node.y += node.vy * 0.3
  
        // Bounce off walls with some padding
        const padding = 50
        if (node.x < padding || node.x > width - padding) {
          node.vx *= -1
        }
        if (node.y < padding || node.y > height - padding) {
          node.vy *= -1
        }
  
        // Keep nodes within bounds
        node.x = Math.max(padding, Math.min(width - padding, node.x))
        node.y = Math.max(padding, Math.min(height - padding, node.y))
  
        // Draw node with stronger gradient
        const gradient = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, node.radius)
        gradient.addColorStop(0, node.color)
        gradient.addColorStop(0.7, node.color.replace("0.7", "0.3")) // Softer edge
        gradient.addColorStop(1, "rgba(255, 255, 255, 0)")
  
        ctx.beginPath()
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2)
        ctx.fillStyle = gradient
        ctx.fill()
  
        // Add a subtle glow effect
        ctx.beginPath()
        ctx.arc(node.x, node.y, node.radius + 5, 0, Math.PI * 2)
        ctx.fillStyle = node.color.replace("0.7", "0.1")
        ctx.fill()
  
        // Add some sample text to nodes (for larger nodes)
        if (node.radius > 25) {
          const terms = ["Cloud", "API", "Data", "IoT", "AI", "ML", "UI/UX", "DevOps"]
          const term = terms[Math.floor(Math.random() * terms.length)]
  
          ctx.font = "bold 12px Arial"
          ctx.fillStyle = "rgba(255, 255, 255, 0.9)"
          ctx.textAlign = "center"
          ctx.textBaseline = "middle"
          ctx.fillText(term, node.x, node.y)
        }
      })
  
      animationFrameId = requestAnimationFrame(animate)
    }
  
    animate()
  
    const handleResize = () => {
      canvas.width = container.clientWidth * window.devicePixelRatio
      canvas.height = container.clientHeight * window.devicePixelRatio
      canvas.style.width = `${container.clientWidth}px`
      canvas.style.height = `${container.clientHeight}px`
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
    }
  
    window.addEventListener("resize", handleResize)
  
    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener("resize", handleResize)
      if (container.contains(canvas)) {
        container.removeChild(canvas)
      }
    }
  }
  
  function getRandomColor() {
    const colors = [
      "rgba(147, 51, 234, 0.7)", 
      "rgba(192, 38, 211, 0.7)", 
      "rgba(79, 70, 229, 0.7)", 
      "rgba(236, 72, 153, 0.7)", 
      "rgba(255, 255, 255, 0.5)", 
    ]
    return colors[Math.floor(Math.random() * colors.length)]
  }
  
  
  
  