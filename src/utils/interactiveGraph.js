export const initInteractiveGraph = (container, language) => {
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
  
    const categories = ["hardware", "software", "networking", "security", "ai"]
  
    const nodes = []
    const categoryColors = {
      hardware: "#9333EA",
      software: "#C026D3",
      networking: "#4F46E5",
      security: "#EC4899",
      ai: "#8B5CF6",
    }
  
    nodes.push({
      id: "center",
      label: language === "en" ? "ICT" : language === "fr" ? "TIC" : "تكنولوجيا المعلومات",
      x: width / 2,
      y: height / 2,
      radius: 40,
      color: "#ffffff",
      textColor: "#333333",
      category: "center",
      fixed: true,
    })

    categories.forEach((category, i) => {
      const angle = (i / categories.length) * Math.PI * 2
      const distance = 180 
  
      nodes.push({
        id: category,
        label: category,
        x: width / 2 + Math.cos(angle) * distance,
        y: height / 2 + Math.sin(angle) * distance,
        radius: 30, 
        color: categoryColors[category],
        textColor: "#ffffff",
        category,
        fixed: true,
      })
    })
    const terms = [
      { id: "ai-1", label: "Machine Learning", category: "ai" },
      { id: "ai-2", label: "Neural Networks", category: "ai" },
      { id: "ai-3", label: "Computer Vision", category: "ai" },
      { id: "hardware-1", label: "CPU", category: "hardware" },
      { id: "hardware-2", label: "GPU", category: "hardware" },
      { id: "hardware-3", label: "RAM", category: "hardware" },
      { id: "software-1", label: "Operating System", category: "software" },
      { id: "software-2", label: "Database", category: "software" },
      { id: "software-3", label: "API", category: "software" },
      { id: "networking-1", label: "Router", category: "networking" },
      { id: "networking-2", label: "Protocol", category: "networking" },
      { id: "networking-3", label: "Firewall", category: "networking" },
      { id: "security-1", label: "Encryption", category: "security" },
      { id: "security-2", label: "Authentication", category: "security" },
      { id: "security-3", label: "Vulnerability", category: "security" },
    ]
  
    terms.forEach((term) => {

      const parentNode = nodes.find((node) => node.id === term.category)
      const angle = Math.random() * Math.PI * 2
      const distance = 90 + Math.random() * 40 
  
      ctx.font = "12px Arial"
      const textWidth = ctx.measureText(term.label).width
  
      nodes.push({
        id: term.id,
        label: term.label,
        x: parentNode.x + Math.cos(angle) * distance,
        y: parentNode.y + Math.sin(angle) * distance,
        radius: Math.max(20, textWidth / 1.5), 
        color: categoryColors[term.category],
        textColor: "#ffffff",
        category: term.category,
        parent: term.category,
        fixed: false,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
      })
    })
  
    const links = []
  
    categories.forEach((category) => {
      links.push({ source: "center", target: category, strength: 0.1 })
    })
  
    terms.forEach((term) => {
      links.push({ source: term.category, target: term.id, strength: 0.05 })
    })
  
    links.push({ source: "ai-1", target: "software-2", strength: 0.02 })
    links.push({ source: "networking-3", target: "security-1", strength: 0.02 })
    links.push({ source: "hardware-2", target: "ai-2", strength: 0.02 })
  
    let selectedNode = null
    let hoveredNode = null
    let isDragging = false
    let draggedNode = null
  
    let animationFrameId
  
    const animate = () => {
      ctx.clearRect(0, 0, width, height)
  
      nodes.forEach((node) => {
        if (node.fixed || node === draggedNode) return
  
        links.forEach((link) => {
          if (link.source === node.id || link.target === node.id) {
            const otherNodeId = link.source === node.id ? link.target : link.source
            const otherNode = nodes.find((n) => n.id === otherNodeId)
  
            const dx = otherNode.x - node.x
            const dy = otherNode.y - node.y
            const distance = Math.sqrt(dx * dx + dy * dy)
            const targetDistance = otherNode.radius + node.radius + 60
  
            if (distance === 0) return
  
            const force = (distance - targetDistance) * link.strength
  
            node.vx += (dx / distance) * force
            node.vy += (dy / distance) * force
          }
        })
  
        const dx = width / 2 - node.x
        const dy = height / 2 - node.y
        node.vx += dx * 0.0005
        node.vy += dy * 0.0005
  
        node.vx *= 0.95
        node.vy *= 0.95
  
        // Update position
        node.x += node.vx
        node.y += node.vy
  
        // Keep nodes within bounds
        node.x = Math.max(node.radius, Math.min(width - node.radius, node.x))
        node.y = Math.max(node.radius, Math.min(height - node.radius, node.y))
      })
  
      ctx.lineWidth = 2 
  
      links.forEach((link) => {
        const sourceNode = nodes.find((node) => node.id === link.source)
        const targetNode = nodes.find((node) => node.id === link.target)
  
        const isHighlighted = selectedNode && (selectedNode.id === sourceNode.id || selectedNode.id === targetNode.id)
  
        ctx.strokeStyle = isHighlighted ? "rgba(255, 255, 255, 0.8)" : "rgba(255, 255, 255, 0.4)" 
  
        ctx.beginPath()
        ctx.moveTo(sourceNode.x, sourceNode.y)
        ctx.lineTo(targetNode.x, targetNode.y)
        ctx.stroke()
      })
  
      nodes.forEach((node) => {
        const isSelected = selectedNode === node
        const isHovered = hoveredNode === node
  
        const gradient = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, node.radius)
  
        gradient.addColorStop(0, node.color)
        gradient.addColorStop(0.8, node.color)
        gradient.addColorStop(1, node.color.replace("1)", "0.7)"))
  
        ctx.beginPath()
        ctx.arc(node.x, node.y, node.radius + (isSelected ? 5 : 0) + (isHovered ? 3 : 0), 0, Math.PI * 2)
        ctx.fillStyle = gradient
        ctx.fill()
  
        if (isSelected || isHovered) {
          ctx.beginPath()
          ctx.arc(node.x, node.y, node.radius + 8, 0, Math.PI * 2)
          ctx.fillStyle = node.color.replace("1)", "0.3)")
          ctx.fill()
  
          ctx.strokeStyle = "#ffffff"
          ctx.lineWidth = 2
          ctx.stroke()
        }
  
        ctx.font = `${isSelected ? "bold " : ""}12px Arial`
        ctx.textAlign = "center"
        ctx.textBaseline = "middle"
        ctx.fillStyle = node.textColor || "#fff"
        ctx.fillText(node.label, node.x, node.y)
      })
  
      animationFrameId = requestAnimationFrame(animate)
    }
  
    animate()
  
    const getNodeAtPosition = (x, y) => {
      for (let i = nodes.length - 1; i >= 0; i--) {
        const node = nodes[i]
        const dx = node.x - x
        const dy = node.y - y
        const distance = Math.sqrt(dx * dx + dy * dy)
  
        if (distance <= node.radius) {
          return node
        }
      }
      return null
    }
  
    const handleMouseMove = (event) => {
      const rect = canvas.getBoundingClientRect()
      const x = event.clientX - rect.left
      const y = event.clientY - rect.top
  
      hoveredNode = getNodeAtPosition(x, y)
  
      if (isDragging && draggedNode) {
        draggedNode.x = x
        draggedNode.y = y
        draggedNode.vx = 0
        draggedNode.vy = 0
      }
  
      canvas.style.cursor = hoveredNode ? "pointer" : "default"
    }
  
    const handleMouseDown = (event) => {
      const rect = canvas.getBoundingClientRect()
      const x = event.clientX - rect.left
      const y = event.clientY - rect.top
  
      const node = getNodeAtPosition(x, y)
  
      if (node) {
        isDragging = true
        draggedNode = node
  
        if (node !== selectedNode) {
          selectedNode = node
  
          const infoPanel = document.querySelector(".graph-info-panel")
          if (infoPanel) {
            infoPanel.style.display = "block"
          }
        }
      } else {
        selectedNode = null
  
        const infoPanel = document.querySelector(".graph-info-panel")
        if (infoPanel) {
          infoPanel.style.display = "none"
        }
      }
    }
  
    const handleMouseUp = () => {
      isDragging = false
      draggedNode = null
    }
  
    canvas.addEventListener("mousemove", handleMouseMove)
    canvas.addEventListener("mousedown", handleMouseDown)
    canvas.addEventListener("mouseup", handleMouseUp)
  
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
      canvas.removeEventListener("mousemove", handleMouseMove)
      canvas.removeEventListener("mousedown", handleMouseDown)
      canvas.removeEventListener("mouseup", handleMouseUp)
      if (container.contains(canvas)) {
        container.removeChild(canvas)
      }
    }
  }
  
  
  
  