import { v4 } from 'uuid'

export type ID = string & { readonly _: unique symbol }

export function uuid(): ID {
  return v4() as ID
}
