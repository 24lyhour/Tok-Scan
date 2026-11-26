'use client'

import {
     useActionState,
     useCallback,
     useId,
     useState,
     useSyncExternalStore,
     useTransition,
     type FormEvent,
} from 'react'

import type { FieldErrors, FormState, Validation } from '@/shared/lib/validation'

type Options<F extends string, C extends string> = {
     /** Server action (same signature as for useActionState) */
     action: (prev: FormState<F, C>, formData: FormData) => Promise<FormState<F, C>>
     /** Same Zod check the server runs — gives instant feedback without a round trip */
     validate: (formData: FormData) => Validation<F, C, unknown>
     /** Field names in screen order: the first invalid one gets focus */
     fields: readonly F[]
     /** Last check before sending, e.g. the captcha. Return false to stop. */
     beforeSubmit?: () => boolean
     /** Runs after every server response (e.g. reset the captcha) */
     onResponse?: (state: FormState<F, C>) => void
}

/**
 * Are all required fields filled in? Checks inputs with `required` (checkbox → ticked) and
 * custom groups marked `data-required="true"` + `data-filled` (e.g. day chips).
 * Browser-autofilled fields count as filled (Chrome hides their value until the first click).
 */
function isAutofilled(el: Element): boolean {
     for (const selector of [':autofill', ':-webkit-autofill']) {
          try {
               if (el.matches(selector)) return true
          } catch {
               // selector not supported by this browser
          }
     }
     return false
}

function requiredFilled(form: HTMLFormElement): boolean {
     const inputs = form.querySelectorAll<
          HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
     >('input[required], textarea[required], select[required]')
     for (const el of inputs) {
          if (el instanceof HTMLInputElement && el.type === 'checkbox') {
               if (!el.checked) return false
          } else if (!el.value.trim() && !isAutofilled(el)) {
               return false
          }
     }
     for (const group of form.querySelectorAll('[data-required="true"]')) {
          if (group.getAttribute('data-filled') !== 'true') return false
     }
     return true
}

/**
 * Every tok-scan form works the same way:
 * - the submit button stays disabled until every required field has a value (`ready`)
 * - validate on submit → show errors and focus the first one → send to the server action →
 *   show server errors the same way. Inputs keep their values on error.
 *
 *   <form {...form.formProps}> … <SubmitButton disabled={!form.ready} … />
 */
export function useActionForm<F extends string, C extends string>({
     action,
     validate,
     fields,
     beforeSubmit,
     onResponse,
}: Options<F, C>) {
     const uid = useId()
     const id = (field: F) => `${uid}-${field}`
     const [errors, setErrors] = useState<FieldErrors<F, C>>({})
     /** Show field errors and put the cursor in the first one */
     const show = (next: FieldErrors<F, C>) => {
          setErrors(next)
          const first = fields.find((f) => next[f])
          if (first) document.getElementById(id(first))?.focus()
     }

     // Wrap the server action: its answer (errors) is applied right here, not in an effect
     const [state, dispatch, pending] = useActionState(
          async (prev: FormState<F, C>, formData: FormData) => {
               const next = await action(prev, formData)
               if (next.status === 'error') {
                    onResponse?.(next)
                    if (next.fieldErrors) show(next.fieldErrors)
               }
               return next
          },
          { status: 'idle' },
     )
     const [, startTransition] = useTransition()
     // The <form> element (callback ref → state), watched for "are required fields filled?"
     const [formEl, setFormEl] = useState<HTMLFormElement | null>(null)
     const subscribe = useCallback(
          (notify: () => void) => {
               if (!formEl) return () => {}
               // Re-check AFTER React has handled the event. Re-checking synchronously inside the
               // input event would re-render before React stores the typed value and wipe it
               // (seen on the keystroke that fills the last required field).
               let timer: ReturnType<typeof setTimeout> | undefined
               const later = () => {
                    clearTimeout(timer)
                    timer = setTimeout(notify, 0)
               }
               // Typing fires input/change; chips and toggles change hidden inputs / data-filled
               const observer = new MutationObserver(later)
               observer.observe(formEl, {
                    subtree: true,
                    childList: true,
                    attributes: true,
                    attributeFilter: ['value', 'data-filled', 'checked'],
               })
               formEl.addEventListener('input', later)
               formEl.addEventListener('change', later)
               return () => {
                    clearTimeout(timer)
                    observer.disconnect()
                    formEl.removeEventListener('input', later)
                    formEl.removeEventListener('change', later)
               }
          },
          [formEl],
     )
     const ready = useSyncExternalStore(
          subscribe,
          () => (formEl ? requiredFilled(formEl) : false),
          () => false,
     )

     const onSubmit = (e: FormEvent<HTMLFormElement>) => {
          e.preventDefault()
          // Include the clicked button (name/value), e.g. intent=print
          const submitter = (e.nativeEvent as SubmitEvent).submitter
          const formData = new FormData(e.currentTarget, submitter)
          const check = validate(formData)
          if (!check.ok) return show(check.fieldErrors)
          setErrors({})
          if (beforeSubmit && !beforeSubmit()) return
          // Manual dispatch (not <form action>) so React doesn't reset the inputs on error
          startTransition(() => dispatch(formData))
     }

     const clearError = (field: F) =>
          setErrors((e) => (e[field] ? { ...e, [field]: undefined } : e))

     /** id / name / aria props for a field's input */
     const fieldProps = (field: F, { hint = false } = {}) => ({
          id: id(field),
          name: field,
          'aria-invalid': errors[field] ? true : undefined,
          'aria-describedby': errors[field]
               ? `${id(field)}-error`
               : hint
                 ? `${id(field)}-hint`
                 : undefined,
     })

     return {
          state,
          pending,
          errors,
          hasErrors: Object.values(errors).some(Boolean),
          /** Every required field has a value — enable the submit button */
          ready,
          /** Spread onto <form> */
          formProps: {
               ref: setFormEl,
               noValidate: true,
               onSubmit,
          },
          id,
          clearError,
          fieldProps,
     }
}
