import type { OrgStatus } from '@/modules/tenancy'
import { StatusPill, type StatusTone } from '@/shared/components/ui/status-pill'

/** Guide p.27 colours: Active green · Pending saffron · Trial purple · Suspended red · Closed grey */
const TONE: Record<OrgStatus, StatusTone> = {
     active: 'success',
     pending_approval: 'warning',
     trial: 'progress',
     suspended: 'error',
     closed: 'neutral',
}

export function OrgStatusPill({ status, label }: { status: OrgStatus; label: string }) {
     return <StatusPill tone={TONE[status]}>{label}</StatusPill>
}
