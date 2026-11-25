import { format } from '@/shared/i18n/site-locale'

/** Dot-paths to every string leaf: 'signup.errors.required', 'hero.title', … (arrays excluded) */
export type MessageKey<T> = {
     [K in keyof T & string]: T[K] extends string
          ? K
          : T[K] extends readonly unknown[]
            ? never
            : T[K] extends object
              ? `${K}.${MessageKey<T[K]>}`
              : never
}[keyof T & string]

export type Translator<T> = (key: MessageKey<T>, values?: Record<string, string | number>) => string

/**
 * t('signup.title') → string, with `{placeholder}` filling.
 * Missing keys return the key itself (and warn in dev) instead of crashing the page.
 */
export function createTranslator<T>(messages: T, namespace: string): Translator<T> {
     return (key, values) => {
          let node: unknown = messages
          for (const part of key.split('.')) {
               node =
                    node && typeof node === 'object'
                         ? (node as Record<string, unknown>)[part]
                         : undefined
          }
          if (typeof node !== 'string') {
               if (process.env.NODE_ENV !== 'production') {
                    console.warn(`[i18n] Missing message "${namespace}.${key}"`)
               }
               return key
          }
          return values ? format(node, values) : node
     }
}
