import { describe, expect, it } from 'vitest'

import { DEFAULT_BRAND_COLOR } from '../../collections/organizations/constants'
import { validate } from '../errors'
import { LOGO_MAX_BYTES, organizationSchema } from './schema'

const base = { name: 'Mahob', slug: 'Mahob Group', businessType: 'cafe' }

describe('organizationSchema', () => {
     it('slugifies the web address and keeps a known brand colour', () => {
          const result = validate(organizationSchema, { ...base, brandColor: '#7A2E3A' })
          expect(result).toMatchObject({
               ok: true,
               data: { slug: 'mahob-group', brandColor: '#7A2E3A', removeLogo: false },
          })
     })

     it('falls back to the default colour for anything else', () => {
          const result = validate(organizationSchema, { ...base, brandColor: '#000' })
          expect(result.ok && result.data.brandColor).toBe(DEFAULT_BRAND_COLOR)
     })

     it('rejects reserved addresses and unknown business types', () => {
          expect(
               validate(organizationSchema, { ...base, slug: 'admin', businessType: 'x' }),
          ).toEqual({
               ok: false,
               fieldErrors: { slug: 'slugReserved', businessType: 'required' },
          })
     })

     it('treats an empty file input as "no logo"', () => {
          const result = validate(organizationSchema, { ...base, logo: new File([], '') })
          expect(result.ok && result.data.logo).toBeUndefined()
     })

     it('checks logo type and size', () => {
          const gif = new File(['x'], 'a.gif', { type: 'image/gif' })
          const huge = new File([new Uint8Array(LOGO_MAX_BYTES + 1)], 'a.png', {
               type: 'image/png',
          })
          expect(validate(organizationSchema, { ...base, logo: gif })).toMatchObject({
               fieldErrors: { logo: 'logoType' },
          })
          expect(validate(organizationSchema, { ...base, logo: huge })).toMatchObject({
               fieldErrors: { logo: 'logoSize' },
          })
     })

     it('needs the owner\'s own words when the type is "Other"', () => {
          expect(validate(organizationSchema, { ...base, businessType: 'other' })).toEqual({
               ok: false,
               fieldErrors: { businessTypeOther: 'required' },
          })
          const ok = validate(organizationSchema, {
               ...base,
               businessType: 'other',
               businessTypeOther: '  Bakery ',
          })
          expect(ok.ok && ok.data.businessTypeOther).toBe('Bakery')
     })

     it('drops the free text for the fixed types', () => {
          const result = validate(organizationSchema, { ...base, businessTypeOther: 'Bakery' })
          expect(result.ok && result.data.businessTypeOther).toBe('')
     })
})
