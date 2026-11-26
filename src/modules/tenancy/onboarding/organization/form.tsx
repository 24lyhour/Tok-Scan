'use client'

import { Check, ImagePlus, LoaderCircle } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

import { useTranslations } from '@/i18n/client'
import {
     ChoiceChips,
     ColorSwatches,
     Field,
     FormAlert,
     inputClass,
     SubmitButton,
     useActionForm,
} from '@/shared/components/form'
import { formValues } from '@/shared/lib/validation'
import { cn } from '@/shared/lib/utils'

import {
     BRAND_COLORS,
     BUSINESS_TYPES,
     ORGANIZATION_LIMITS,
     type BrandColor,
     type BrandColorId,
     type BusinessType,
} from '../../collections/organizations/constants'
import { slugify } from '../../collections/organizations/slug'
import { type OnboardingErrorCode, slugProblemToError, validate } from '../errors'
import { checkSlugAvailability, saveOrganization } from './actions'
import { LOGO_TYPES, type OrganizationField, organizationSchema } from './schema'

const FIELDS: OrganizationField[] = [
     'name',
     'slug',
     'logo',
     'brandColor',
     'businessType',
     'businessTypeOther',
]

export type OrganizationFormValues = {
     name: string
     slug: string
     brandColor: BrandColor
     businessType: BusinessType
     /** Owner's own type when businessType is 'other' */
     businessTypeOther: string
     logoUrl: string | null
}

type SlugStatus = 'idle' | 'checking' | 'available' | OnboardingErrorCode

/** Step 2 · Your organization (guide p.23, second screen). */
export function OrganizationForm({
     initial,
     menuBase,
}: {
     initial: OrganizationFormValues
     /** "tok-scan.store/r/" — shown in front of the web address */
     menuBase: string
}) {
     const { m } = useTranslations('onboarding')
     const common = useTranslations('common').m
     const copy = m.organization

     const form = useActionForm({
          action: saveOrganization,
          validate: (data) => validate(organizationSchema, formValues(data)),
          fields: FIELDS,
     })
     const { errors, state } = form

     const [name, setName] = useState(initial.name)
     const [slug, setSlug] = useState(initial.slug)
     // Until the owner edits the address, it follows the business name
     const [slugTouched, setSlugTouched] = useState(Boolean(initial.slug))
     const [brandColor, setBrandColor] = useState<BrandColor>(initial.brandColor)
     const [businessType, setBusinessType] = useState<BusinessType>(initial.businessType)
     const [businessTypeOther, setBusinessTypeOther] = useState(initial.businessTypeOther)
     // Address suggestions use the type: "mahob-cafe", or the owner's own words ("mahob-bakery")
     const typeHint = businessType === 'other' ? businessTypeOther : businessType
     const { status: slugStatus, suggestions } = useSlugCheck(slug, initial.slug, typeHint)
     const chooseSlug = (next: string) => {
          setSlug(next)
          // Cleared → follow the business name again
          setSlugTouched(next !== '')
          form.clearError('slug')
     }

     const fileRef = useRef<HTMLInputElement>(null)
     const [logoPreview, setLogoPreview] = useState<string | null>(initial.logoUrl)
     const [removeLogo, setRemoveLogo] = useState(false)

     const onLogo = (file: File | undefined) => {
          form.clearError('logo')
          if (logoPreview?.startsWith('blob:')) URL.revokeObjectURL(logoPreview)
          setLogoPreview(file ? URL.createObjectURL(file) : initial.logoUrl)
          setRemoveLogo(false)
     }
     const clearLogo = () => {
          if (fileRef.current) fileRef.current.value = ''
          onLogo(undefined)
          setLogoPreview(null)
          setRemoveLogo(Boolean(initial.logoUrl))
     }

     const msg = (field: OrganizationField) => (errors[field] ? m.errors[errors[field]] : undefined)
     // Live slug problems show under the field before submitting
     const slugError =
          msg('slug') ??
          (slugStatus !== 'idle' && slugStatus !== 'checking' && slugStatus !== 'available'
               ? m.errors[slugStatus]
               : undefined)

     return (
          <form {...form.formProps} className="flex flex-1 flex-col">
               <FormAlert message={state.formError ? m.errors[state.formError] : undefined} />

               <div className="space-y-5">
                    <Field id={form.id('name')} label={copy.name} error={msg('name')} required>
                         <input
                              {...form.fieldProps('name')}
                              autoComplete="organization"
                              required
                              maxLength={ORGANIZATION_LIMITS.name}
                              placeholder={copy.namePlaceholder}
                              value={name}
                              onChange={(e) => {
                                   setName(e.target.value)
                                   if (!slugTouched) {
                                        setSlug(slugify(e.target.value))
                                        form.clearError('slug')
                                   }
                                   form.clearError('name')
                              }}
                              className={inputClass}
                         />
                    </Field>

                    <Field
                         id={form.id('slug')}
                         label={copy.slug}
                         required
                         hint={copy.slugHint}
                         error={slugError}
                         labelAction={<SlugBadge status={slugStatus} copy={copy} />}
                    >
                         <div className="flex h-12 items-center rounded-[11px] border border-line bg-white transition-[border-color,box-shadow] duration-[120ms] focus-within:border-brand-500 focus-within:ring-3 focus-within:ring-brand-500/15 has-aria-invalid:border-error">
                              <span className="pl-3.5 text-sm text-ink-3 select-none">
                                   {menuBase}
                              </span>
                              <input
                                   {...form.fieldProps('slug', { hint: true })}
                                   autoCapitalize="none"
                                   spellCheck={false}
                                   required
                                   value={slug}
                                   onChange={(e) => chooseSlug(e.target.value.toLowerCase())}
                                   onBlur={() => setSlug((s) => slugify(s))}
                                   aria-invalid={slugError ? true : undefined}
                                   className="h-full min-w-0 flex-1 bg-transparent pr-3.5 text-[0.9375rem] font-medium text-ink outline-none"
                              />
                         </div>
                         {suggestions.length > 0 && (
                              <div
                                   className="mt-2 flex flex-wrap items-center gap-1.5"
                                   aria-live="polite"
                              >
                                   <span className="text-xs text-ink-3">{copy.slugSuggest}</span>
                                   {suggestions.map((s) => (
                                        <button
                                             key={s}
                                             type="button"
                                             onClick={() => chooseSlug(s)}
                                             className="rounded-full border border-brand-300 bg-brand-50 px-2.5 py-1 text-xs font-medium text-brand-700 hover:bg-brand-100"
                                        >
                                             {s}
                                        </button>
                                   ))}
                              </div>
                         )}
                    </Field>

                    <Field
                         id={form.id('logo')}
                         label={copy.logo}
                         hint={copy.logoHint}
                         error={msg('logo')}
                    >
                         <div className="flex items-center gap-3">
                              <span
                                   className={cn(
                                        'flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-line text-white',
                                        logoPreview && 'bg-white',
                                   )}
                                   style={logoPreview ? undefined : { backgroundColor: brandColor }}
                              >
                                   {logoPreview ? (
                                        // eslint-disable-next-line @next/next/no-img-element -- local blob preview
                                        <img
                                             src={logoPreview}
                                             alt={copy.logoCurrent}
                                             className="size-full object-contain"
                                        />
                                   ) : (
                                        <span className="text-xl font-bold">
                                             {(name.trim()[0] ?? 'T').toUpperCase()}
                                        </span>
                                   )}
                              </span>
                              <input
                                   ref={fileRef}
                                   {...form.fieldProps('logo', { hint: true })}
                                   type="file"
                                   accept={LOGO_TYPES.join(',')}
                                   onChange={(e) => onLogo(e.target.files?.[0])}
                                   className="sr-only"
                              />
                              <input
                                   type="hidden"
                                   name="removeLogo"
                                   value={removeLogo ? 'on' : 'off'}
                              />
                              <button
                                   type="button"
                                   onClick={() => fileRef.current?.click()}
                                   className="inline-flex h-10 items-center gap-2 rounded-xl border border-line bg-white px-3.5 text-sm font-semibold text-ink hover:bg-paper"
                              >
                                   <ImagePlus aria-hidden className="size-4" />
                                   {logoPreview ? copy.logoReplace : copy.logoChoose}
                              </button>
                              {logoPreview && (
                                   <button
                                        type="button"
                                        onClick={clearLogo}
                                        className="h-10 rounded-xl px-2 text-sm font-medium text-ink-3 hover:text-error"
                                   >
                                        {copy.logoRemove}
                                   </button>
                              )}
                         </div>
                    </Field>

                    <div>
                         <p className="mb-1.5 text-sm font-medium text-ink">{copy.brandColor}</p>
                         <ColorSwatches
                              name="brandColor"
                              label={copy.brandColor}
                              colors={(Object.keys(BRAND_COLORS) as BrandColorId[]).map((id) => ({
                                   value: BRAND_COLORS[id],
                                   label: copy.colors[id],
                              }))}
                              value={brandColor}
                              onChange={(c) => setBrandColor(c as BrandColor)}
                              checkedLabel={copy.contrastChecked}
                         />
                    </div>

                    <Field
                         id={form.id('businessType')}
                         label={copy.businessType}
                         error={msg('businessType')}
                         required
                    >
                         <ChoiceChips
                              id={form.id('businessType')}
                              name="businessType"
                              required
                              label={copy.businessType}
                              options={BUSINESS_TYPES.map((t) => ({
                                   value: t,
                                   label: copy.types[t],
                              }))}
                              value={businessType}
                              onChange={(t) => {
                                   setBusinessType(t)
                                   form.clearError('businessType')
                              }}
                              invalid={Boolean(errors.businessType)}
                         />
                    </Field>

                    {businessType === 'other' && (
                         <Field
                              id={form.id('businessTypeOther')}
                              label={copy.otherType}
                              error={msg('businessTypeOther')}
                              required
                         >
                              <input
                                   {...form.fieldProps('businessTypeOther')}
                                   required
                                   autoFocus
                                   maxLength={ORGANIZATION_LIMITS.businessTypeOther}
                                   placeholder={copy.otherTypePlaceholder}
                                   value={businessTypeOther}
                                   onChange={(e) => {
                                        setBusinessTypeOther(e.target.value)
                                        form.clearError('businessTypeOther')
                                   }}
                                   className={inputClass}
                              />
                         </Field>
                    )}
               </div>

               <div className="mt-auto pt-8">
                    <SubmitButton
                         pending={form.pending}
                         disabled={!form.ready}
                         label={common.actions.continue}
                         pendingLabel={common.states.saving}
                    />
               </div>
          </form>
     )
}

/** Debounced live check of the web address: format first, then "is it taken?" on the server. */
/**
 * Debounced live check of the web address on the server: format, "is it taken?", and free
 * alternatives to suggest when it can't be used.
 */
/** `typeHint` (business type or the owner's own words) shapes the suggestions */
function useSlugCheck(slug: string, savedSlug: string, typeHint: string) {
     const value = slugify(slug)
     // Last server answer, tagged with the address + type it was for
     const [answer, setAnswer] = useState<{
          key: string
          status: SlugStatus
          suggestions: string[]
     } | null>(null)
     const key = `${value}|${typeHint}`
     const needsCheck = Boolean(value) && value !== savedSlug

     useEffect(() => {
          if (!needsCheck) return
          let alive = true
          const timer = setTimeout(async () => {
               try {
                    const result = await checkSlugAvailability(value, typeHint)
                    if (!alive) return
                    setAnswer({
                         key,
                         status: result.problem ? slugProblemToError[result.problem] : 'available',
                         suggestions: result.suggestions,
                    })
               } catch {
                    if (alive) setAnswer({ key, status: 'idle', suggestions: [] })
               }
          }, 400)
          return () => {
               alive = false
               clearTimeout(timer)
          }
     }, [needsCheck, value, typeHint, key])

     // Everything else is derived from the input — no state to keep in sync
     if (!value) return { status: 'idle' as SlugStatus, suggestions: [] }
     if (!needsCheck) return { status: 'available' as SlugStatus, suggestions: [] }
     if (answer?.key !== key) return { status: 'checking' as SlugStatus, suggestions: [] }
     return { status: answer.status, suggestions: answer.suggestions }
}

function SlugBadge({
     status,
     copy,
}: {
     status: SlugStatus
     copy: { slugChecking: string; slugAvailable: string }
}) {
     if (status === 'checking') {
          return (
               <span
                    className="inline-flex items-center gap-1 text-xs text-ink-3"
                    aria-live="polite"
               >
                    <LoaderCircle aria-hidden className="size-3.5 animate-spin" />
                    {copy.slugChecking}
               </span>
          )
     }
     if (status === 'available') {
          return (
               <span
                    className={cn(
                         'inline-flex items-center gap-1 text-xs font-medium text-success',
                    )}
                    aria-live="polite"
               >
                    <Check aria-hidden className="size-3.5" />
                    {copy.slugAvailable}
               </span>
          )
     }
     return null
}
