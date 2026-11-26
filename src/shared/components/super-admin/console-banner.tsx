import styles from './console-banner.module.css'

/** Top of the Payload data admin: points staff to the real console (/console, guide p.27). */
export function ConsoleBanner({
     title,
     body,
     href,
     action,
}: {
     title: string
     body: string
     href: string
     action: string
}) {
     return (
          <section className={styles.banner}>
               <div>
                    <h2 className={styles.title}>{title}</h2>
                    <p className={styles.body}>{body}</p>
               </div>
               <a href={href} className={styles.action}>
                    {action} →
               </a>
          </section>
     )
}
