export type ToolActivationChange = {
  userId?: string | null
  toolId?: string
  isActive?: boolean
  source?: string
}

const TOOL_ACTIVATION_EVENT = "tool-activation-changed"

export const emitToolActivationChange = (detail: ToolActivationChange = {}) => {
  if (typeof window === "undefined") return
  window.dispatchEvent(new CustomEvent(TOOL_ACTIVATION_EVENT, { detail }))
}

export const subscribeToolActivationChange = (
  handler: (event: CustomEvent<ToolActivationChange>) => void
) => {
  if (typeof window === "undefined") return () => {}
  const listener = (event: Event) => {
    handler(event as CustomEvent<ToolActivationChange>)
  }
  window.addEventListener(TOOL_ACTIVATION_EVENT, listener)
  return () => window.removeEventListener(TOOL_ACTIVATION_EVENT, listener)
}
