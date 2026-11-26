'use client'

import { Eye, EyeOff } from 'lucide-react'
import { useState, type ComponentProps } from 'react'

import { cn } from '@/shared/lib/utils'

import { inputClass } from './field'

/** Password input with a show/hide button. */
export function PasswordInput({
     showLabel,
     hideLabel,
     className,
     ...props
}: Omit<ComponentProps<'input'>, 'type'> & { showLabel: string; hideLabel: string }) {
     const [visible, setVisible] = useState(false)
     return (
          <div className="relative">
               <input
                    {...props}
                    type={visible ? 'text' : 'password'}
                    className={cn(inputClass, 'pr-12', className)}
               />
               <button
                    type="button"
                    onClick={() => setVisible((v) => !v)}
                    aria-label={visible ? hideLabel : showLabel}
                    aria-pressed={visible}
                    aria-controls={props.id}
                    className="absolute inset-y-0 right-0 flex w-12 items-center justify-center rounded-r-[11px] text-ink-3 hover:text-ink"
               >
                    {visible ? <EyeOff className="size-[18px]" /> : <Eye className="size-[18px]" />}
               </button>
          </div>
     )
}
