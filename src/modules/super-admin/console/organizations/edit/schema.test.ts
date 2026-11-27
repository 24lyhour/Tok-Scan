import { describe, expect, it } from 'vitest'

import { orgEditSchema, trialEndsAtToISO, validateOrgEdit } from './schema'

const valid = {
     name: '  Mahob   Kitchen ',
     slug: 'Mahob Kitchen',
     businessType: 'restaurant',
     businessTypeOther: 'stale text',
     trialEndsAt: '2030-01-31',
     ownerName: 'Sokha Chan',
     ownerEmail: ' Owner@Example.COM ',
}

describe('console · edit organization', () => {
     it('cleans up what staff type, like onboarding does', () => {
          const result = validateOrgEdit(orgEditSchema, valid)
          expect(result.ok).toBe(true)
          if (!result.ok) return
          expect(result.data).toMatchObject({
               name: 'Mahob Kitchen',
               slug: 'mahob-kitchen',
               businessTypeOther: '',
               ownerEmail: 'owner@example.com',
          })
     })

     it('needs the own words for "other", a real email and a real date', () => {
          const result = validateOrgEdit(orgEditSchema, {
               ...valid,
               businessType: 'other',
               businessTypeOther: '',
               ownerEmail: 'not-an-email',
               trialEndsAt: '31/01/2030',
          })
          expect(result.ok).toBe(false)
          if (result.ok) return
          expect(result.fieldErrors).toMatchObject({
               businessTypeOther: 'required',
               ownerEmail: 'emailInvalid',
               trialEndsAt: 'required',
          })
     })

     it('allows no trial end, stored as midnight UTC otherwise', () => {
          expect(validateOrgEdit(orgEditSchema, { ...valid, trialEndsAt: '' }).ok).toBe(true)
          expect(trialEndsAtToISO('')).toBeNull()
          expect(trialEndsAtToISO('2030-01-31')).toBe('2030-01-31T00:00:00.000Z')
     })
})
