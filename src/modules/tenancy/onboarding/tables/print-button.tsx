'use client'

import { Printer } from 'lucide-react'

/** Opens the browser print dialog (print to paper, or "Save as PDF"). */
export function PrintButton({ label }: { label: string }) {
     return (
          <button
               type="button"
               onClick={() => window.print()}
               className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-brand-700 px-5 text-sm font-semibold text-white hover:bg-brand-800 focus-visible:ring-3 focus-visible:ring-brand-300 focus-visible:outline-none"
          >
               <Printer aria-hidden className="size-4" />
               {label}
          </button>
     )
}
