import React from 'react'

export default function useRenderCount(name) {
  const RenderCount = React.useRef(0)

  React.useEffect(() => {
    RenderCount.current = RenderCount.current + 1
    console.log(`Render${name}Count`, RenderCount)
  }, [RenderCount])

  return {
    RenderCount,
  }
}
