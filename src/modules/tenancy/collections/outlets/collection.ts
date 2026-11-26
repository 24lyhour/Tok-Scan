import type { CollectionConfig } from 'payload'

import {
     requireTenantManager,
     tenantManagers,
     tenantManagersCreate,
     tenantMembers,
} from '@/modules/core/payload'

import { OUTLET_DEFAULTS, OUTLET_LIMITS, WEEKDAYS } from './constants'

const percent = (name: string, defaultValue: number) =>
     ({ name, type: 'number', defaultValue, min: 0, max: 100 }) as const

/**
 * Outlets — a branch of an organization (Module 14 §3.2). Tenant-scoped: the multi-tenant plugin
 * adds the `tenant` field (→ organizations). Tables, orders and money live per outlet.
 */
export const Outlets: CollectionConfig = {
     slug: 'outlets',
     admin: { useAsTitle: 'name', defaultColumns: ['name', 'address', 'status', 'createdAt'] },
     access: {
          read: tenantMembers,
          create: tenantManagersCreate,
          update: tenantManagers,
          delete: tenantManagers,
     },
     hooks: { beforeChange: [requireTenantManager] },
     fields: [
          { name: 'name', type: 'text', required: true, maxLength: OUTLET_LIMITS.name },
          { name: 'address', type: 'text', maxLength: OUTLET_LIMITS.address },
          { name: 'phone', type: 'text' },
          {
               name: 'currency',
               type: 'group',
               fields: [
                    {
                         name: 'primary',
                         type: 'select',
                         defaultValue: 'USD',
                         options: ['USD', 'KHR'],
                    },
                    {
                         name: 'secondary',
                         type: 'select',
                         defaultValue: 'KHR',
                         options: ['KHR', 'USD'],
                    },
                    {
                         name: 'exchangeRate',
                         type: 'number',
                         defaultValue: OUTLET_DEFAULTS.exchangeRate,
                         min: 1,
                         admin: { description: 'KHR per 1 USD' },
                    },
               ],
          },
          {
               name: 'taxes',
               type: 'group',
               admin: {
                    description:
                         'Calculation order: subtotal → discount → service → VAT → rounding',
               },
               fields: [
                    {
                         name: 'vatEnabled',
                         type: 'checkbox',
                         defaultValue: OUTLET_DEFAULTS.vatEnabled,
                    },
                    percent('vatPercent', OUTLET_DEFAULTS.vatPercent),
                    {
                         name: 'serviceChargeEnabled',
                         type: 'checkbox',
                         defaultValue: OUTLET_DEFAULTS.serviceChargeEnabled,
                    },
                    percent('serviceChargePercent', OUTLET_DEFAULTS.serviceChargePercent),
                    {
                         name: 'lightingTaxEnabled',
                         type: 'checkbox',
                         defaultValue: OUTLET_DEFAULTS.lightingTaxEnabled,
                    },
                    percent('lightingTaxPercent', OUTLET_DEFAULTS.lightingTaxPercent),
               ],
          },
          {
               name: 'vatTin',
               type: 'text',
               maxLength: OUTLET_LIMITS.vatTin,
               admin: { description: 'Printed on every receipt' },
          },
          {
               name: 'openingHours',
               type: 'group',
               fields: [
                    {
                         name: 'days',
                         type: 'select',
                         hasMany: true,
                         defaultValue: OUTLET_DEFAULTS.days,
                         options: [...WEEKDAYS],
                    },
                    { name: 'opens', type: 'text', defaultValue: OUTLET_DEFAULTS.opens },
                    { name: 'closes', type: 'text', defaultValue: OUTLET_DEFAULTS.closes },
               ],
          },
          {
               name: 'status',
               type: 'select',
               defaultValue: 'active',
               options: [
                    { label: 'Active', value: 'active' },
                    { label: 'Temporarily closed', value: 'temporarily_closed' },
                    { label: 'Archived', value: 'archived' },
               ],
               admin: { position: 'sidebar' },
          },
     ],
}
