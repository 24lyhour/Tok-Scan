/**
 * A separate account for the password-reset e2e test (so changing its password can't break
 * tests that log in as the test owner). The reset token comes straight from Payload — no email.
 */
import { getPayload } from 'payload'

import config from '../../src/payload.config'

export const resetUser = {
     email: 'e2e-reset@test.tok-scan.local',
     password: 'e2e-old-password-1',
     name: 'E2E Reset',
}

export async function resetTokenForTestUser(): Promise<string> {
     const payload = await getPayload({ config: await config })
     const { docs } = await payload.find({
          collection: 'users',
          where: { email: { equals: resetUser.email } },
          limit: 1,
          depth: 0,
          overrideAccess: true,
     })
     if (docs[0]) {
          await payload.update({
               collection: 'users',
               id: docs[0].id,
               data: { password: resetUser.password },
               overrideAccess: true,
          })
     } else {
          await payload.create({ collection: 'users', data: resetUser, overrideAccess: true })
     }
     const token = await payload.forgotPassword({
          collection: 'users',
          data: { email: resetUser.email },
          disableEmail: true,
     })
     if (!token) throw new Error('No reset token')
     return token
}
