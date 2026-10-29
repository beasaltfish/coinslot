export const MARKETPLACE = 'beasaltfish/idle-arcade'

export function installCommand(id: string): string {
  return `/plugin install ${id} --marketplace ${MARKETPLACE}`
}
