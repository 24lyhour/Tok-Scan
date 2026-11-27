'use client'

import type { ReactElement, ReactNode } from 'react'
import { Dialog, DialogTrigger, Heading, Modal, ModalOverlay } from 'react-aria-components'

/**
 * "Are you sure?" dialog (react-aria: focus trap, Esc / click outside closes it, screen-reader
 * alert). `trigger` must be a react-aria `Button`; `actions` gets `close` for the Cancel button.
 * Bottom sheet on phones, centred card from `sm` up.
 */
export function ConfirmDialog({
     trigger,
     title,
     description,
     actions,
}: {
     trigger: ReactElement
     title: string
     description: string
     actions: (close: () => void) => ReactNode
}) {
     return (
          <DialogTrigger>
               {trigger}
               <ModalOverlay
                    isDismissable
                    className="fixed inset-0 z-50 flex items-end justify-center bg-ink/40 p-4 sm:items-center"
               >
                    <Modal className="w-full max-w-sm rounded-2xl bg-card p-6 shadow-dialog">
                         <Dialog role="alertdialog" className="outline-none">
                              {({ close }) => (
                                   <>
                                        <Heading
                                             slot="title"
                                             className="text-lg font-bold tracking-tight text-ink"
                                        >
                                             {title}
                                        </Heading>
                                        <p className="mt-2 text-sm text-ink-2">{description}</p>
                                        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                                             {actions(close)}
                                        </div>
                                   </>
                              )}
                         </Dialog>
                    </Modal>
               </ModalOverlay>
          </DialogTrigger>
     )
}
