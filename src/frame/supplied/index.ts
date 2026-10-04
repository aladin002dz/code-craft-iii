// Supplied project modules learner code may import, by the path it imports them with.
import * as chat from './chat'
import * as network from './network'

network.installMockServer()

export const suppliedModules: Record<string, unknown> = {
  './chat.js': chat,
  './network.js': network,
}

/** Start every supplied module fresh, so each preview and each check begins from the same state. */
export function resetSupplied() {
  chat.resetChat()
  network.resetNetwork()
}
