/** Khmer — have a native speaker review before launch. */
import type { WorkspaceContent } from '../en/workspace'

export const workspace: WorkspaceContent = {
     nav: {
          main: 'ម៉ឺនុយមេ',
          open: 'បើកម៉ឺនុយ',
          locked: 'សូមបន្ថែមម៉ឺនុយជាមុនសិន',
          groups: {
               overview: 'ទិដ្ឋភាពទូទៅ',
               catalogue: 'កាតាឡុក',
               operations: 'ប្រតិបត្តិការ',
               people: 'មនុស្ស និងរបាយការណ៍',
          },
          items: {
               dashboard: 'ផ្ទាំងគ្រប់គ្រង',
               menu: 'គ្រប់គ្រងម៉ឺនុយ',
               categories: 'ប្រភេទ',
               products: 'ផលិតផល',
               orders: 'ការកុម្ម៉ង់',
               billing: 'វិក្កយបត្រ',
               payments: 'ការទូទាត់',
               tables: 'តុ',
               qr: 'កូដ QR',
               customers: 'អតិថិជន',
               staff: 'បុគ្គលិក',
               reports: 'របាយការណ៍លក់',
               settings: 'ការកំណត់',
          },
     },
     switcher: {
          label: 'ប្តូរស្ថាប័ន ឬសាខា',
          current: '{outlet} · {index} ក្នុងចំណោម {total} សាខា',
          organizations: 'ស្ថាប័ន',
          membership: '{role} · {outlets}',
          outletCount: { other: '{count} សាខា' },
          outletsOf: 'សាខា · {org}',
          tables: 'តុ {count}',
          allOutlets: 'សាខាទាំងអស់',
          reportsOnly: 'របាយការណ៍ប៉ុណ្ណោះ',
          createOutlet: 'បង្កើតសាខា',
          used: 'បានប្រើ {used} / {max}',
          roles: { owner: 'ម្ចាស់', admin: 'អ្នកគ្រប់គ្រង', member: 'សមាជិក' },
     },
     plan: {
          trial: 'សាកល្បងឥតគិតថ្លៃ',
          outlets: 'សាខា {used}/{max}',
          ends: 'បញ្ចប់ {date}',
          choose: 'ជ្រើសរើសគម្រោង',
     },
     topbar: {
          today: 'ថ្ងៃនេះ {date}',
          search: 'ស្វែងរកការកុម្ម៉ង់ តុ វិក្កយបត្រ…',
          notifications: 'ការជូនដំណឹង',
     },
     user: {
          role: '{role} · {org}',
     },
     dashboard: {
          kpi: {
               revenue: 'ចំណូលសរុប',
               orders: 'ការកុម្ម៉ង់សរុប',
               pending: 'កំពុងរង់ចាំ',
               completed: 'បានបញ្ចប់',
               customers: 'អតិថិជន',
               avgTicket: 'មធ្យមក្នុងមួយវិក្កយបត្រ',
          },
          noOrders: 'មិនទាន់មានការកុម្ម៉ង់នៅឡើយ — លេខនឹងបង្ហាញនៅទីនេះ នៅពេលភ្ញៀវចាប់ផ្តើមកុម្ម៉ង់។',
          liveTables: 'តុផ្ទាល់',
          inUse: 'កំពុងប្រើ {used} ក្នុងចំណោម {total}',
          legend: {
               available: 'ទំនេរ',
               occupied: 'មានភ្ញៀវ',
               ordering: 'កំពុងកុម្ម៉ង់',
               awaiting: 'រង់ចាំការទូទាត់',
          },
          editTables: 'កែតុ',
     },
}
