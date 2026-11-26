import { WatchTenantCollection as WatchTenantCollection_1d0591e3cf4f332c83a86da13a0de59a } from '@payloadcms/plugin-multi-tenant/client'
import { TenantField as TenantField_1d0591e3cf4f332c83a86da13a0de59a } from '@payloadcms/plugin-multi-tenant/client'
import { AssignTenantFieldTrigger as AssignTenantFieldTrigger_1d0591e3cf4f332c83a86da13a0de59a } from '@payloadcms/plugin-multi-tenant/client'
import { AdminIcon as AdminIcon_3bcde8b357f08c83ace54e6030282853 } from '../../../shared/components/super-admin'
import { AdminLogo as AdminLogo_3bcde8b357f08c83ace54e6030282853 } from '../../../shared/components/super-admin'
import { AdminLoginCaptcha as AdminLoginCaptcha_3bcde8b357f08c83ace54e6030282853 } from '../../../shared/components/super-admin'
import { AdminOwnerLink as AdminOwnerLink_9de202c6b7c7e655eec1c0fbb9fcea9b } from '../../../modules/super-admin/admin/login'
import { ConsoleOverview as ConsoleOverview_7734754098134bf52c9982043a5c8110 } from '../../../modules/super-admin/admin/console-overview'
import { AdminLoginPanel as AdminLoginPanel_9de202c6b7c7e655eec1c0fbb9fcea9b } from '../../../modules/super-admin/admin/login'
import { AdminLoginIntro as AdminLoginIntro_9de202c6b7c7e655eec1c0fbb9fcea9b } from '../../../modules/super-admin/admin/login'
import { TenantSelector as TenantSelector_d6d5f193a167989e2ee7d14202901e62 } from '@payloadcms/plugin-multi-tenant/rsc'
import { AdminTheme as AdminTheme_3bcde8b357f08c83ace54e6030282853 } from '../../../shared/components/super-admin'
import { TenantSelectionProvider as TenantSelectionProvider_d6d5f193a167989e2ee7d14202901e62 } from '@payloadcms/plugin-multi-tenant/rsc'
import { CollectionCards as CollectionCards_f9c02e79a4aed9a3924487c0cd4cafb1 } from '@payloadcms/next/rsc'
import { VercelBlobClientUploadHandler as VercelBlobClientUploadHandler_16c82c5e25f430251a3e3ba57219ff4e } from '@payloadcms/storage-vercel-blob/client'

/** @type import('payload').ImportMap */
export const importMap = {
  "@payloadcms/plugin-multi-tenant/client#WatchTenantCollection": WatchTenantCollection_1d0591e3cf4f332c83a86da13a0de59a,
  "@payloadcms/plugin-multi-tenant/client#TenantField": TenantField_1d0591e3cf4f332c83a86da13a0de59a,
  "@payloadcms/plugin-multi-tenant/client#AssignTenantFieldTrigger": AssignTenantFieldTrigger_1d0591e3cf4f332c83a86da13a0de59a,
  "/shared/components/super-admin#AdminIcon": AdminIcon_3bcde8b357f08c83ace54e6030282853,
  "/shared/components/super-admin#AdminLogo": AdminLogo_3bcde8b357f08c83ace54e6030282853,
  "/shared/components/super-admin#AdminLoginCaptcha": AdminLoginCaptcha_3bcde8b357f08c83ace54e6030282853,
  "/modules/super-admin/admin/login#AdminOwnerLink": AdminOwnerLink_9de202c6b7c7e655eec1c0fbb9fcea9b,
  "/modules/super-admin/admin/console-overview#ConsoleOverview": ConsoleOverview_7734754098134bf52c9982043a5c8110,
  "/modules/super-admin/admin/login#AdminLoginPanel": AdminLoginPanel_9de202c6b7c7e655eec1c0fbb9fcea9b,
  "/modules/super-admin/admin/login#AdminLoginIntro": AdminLoginIntro_9de202c6b7c7e655eec1c0fbb9fcea9b,
  "@payloadcms/plugin-multi-tenant/rsc#TenantSelector": TenantSelector_d6d5f193a167989e2ee7d14202901e62,
  "/shared/components/super-admin#AdminTheme": AdminTheme_3bcde8b357f08c83ace54e6030282853,
  "@payloadcms/plugin-multi-tenant/rsc#TenantSelectionProvider": TenantSelectionProvider_d6d5f193a167989e2ee7d14202901e62,
  "@payloadcms/next/rsc#CollectionCards": CollectionCards_f9c02e79a4aed9a3924487c0cd4cafb1,
  "@payloadcms/storage-vercel-blob/client#VercelBlobClientUploadHandler": VercelBlobClientUploadHandler_16c82c5e25f430251a3e3ba57219ff4e
}
