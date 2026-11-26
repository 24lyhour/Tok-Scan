/** Khmer — have a native speaker review before launch. */
import type { CommonMessages } from './en'

export const km: CommonMessages = {
     meta: {
          title: 'tok·scan — ការកុម្ម៉ង់ និងទូទាត់តាម QR សម្រាប់ភោជនីយដ្ឋានកម្ពុជា',
          titleTemplate: '%s · tok·scan',
          description:
               'ភ្ញៀវកុម្ម៉ង់ពីទូរស័ព្ទ ផ្ទះបាយឃើញភ្លាមៗ ហើយវិក្កយបត្រទូទាត់តាម KHQR។ ភោជនីយដ្ឋានមួយ ឬម្ភៃសាខា។',
     },
     language: 'ភាសា',
     home: 'ទំព័រដើម tok-scan',
     skipToContent: 'រំលងទៅមាតិកា',
     poweredBy: 'ដំណើរការដោយ',
     actions: {
          continue: 'បន្ត',
          back: 'ត្រឡប់ក្រោយ',
          cancel: 'បោះបង់',
          save: 'រក្សាទុក',
          saveChanges: 'រក្សាទុកការផ្លាស់ប្តូរ',
          close: 'បិទ',
          edit: 'កែសម្រួល',
          delete: 'លុប',
          tryAgain: 'ព្យាយាមម្តងទៀត',
          logIn: 'ចូលគណនី',
          logOut: 'ចាកចេញ',
     },
     states: {
          loading: 'កំពុងផ្ទុក…',
          saving: 'កំពុងរក្សាទុក…',
          saved: 'បានរក្សាទុក',
          empty: 'មិនទាន់មានអ្វីនៅឡើយ',
          error: 'មានបញ្ហាអ្វីមួយ។ សូមព្យាយាមម្តងទៀត។',
          required: 'ត្រូវបំពេញ',
          optional: 'មិនបង្ខំ',
          /** Under a disabled button — followed by a red * */
          fillRequired: 'សូមបំពេញព័ត៌មានទាំងអស់ដែលមានសញ្ញា',
     },
}
