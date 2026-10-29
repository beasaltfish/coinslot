export const MARKETPLACE = 'beasaltfish/idle-arcade'

// the plugin that installs every game and adds /idle
export const HUB_ID = 'idle-arcade'

export function installCommand(id: string): string {
  return `/plugin install ${id} --marketplace ${MARKETPLACE}`
}
