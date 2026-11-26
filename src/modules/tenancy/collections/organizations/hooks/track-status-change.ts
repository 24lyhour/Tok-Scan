import type { CollectionBeforeChangeHook } from 'payload'

/**
 * Approve / suspend audit (guide p.27: "every action on tenant data is logged"): when the status
 * changes, remember who changed it and when. Server code without a user (onboarding) leaves
 * `statusChangedBy` empty. Full audit log arrives with Module 13.
 */
export const trackStatusChange: CollectionBeforeChangeHook = ({
     data,
     originalDoc,
     operation,
     req,
}) => {
     if (operation !== 'update' || !data.status || data.status === originalDoc?.status) return data
     return {
          ...data,
          statusChangedAt: new Date().toISOString(),
          statusChangedBy: req.user?.id ?? null,
     }
}
