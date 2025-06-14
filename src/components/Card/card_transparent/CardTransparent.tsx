'use client'
import { useTheme } from '@payloadcms/ui'
import {
  ExistingFileIconExtensions,
  iconPathsByTheme,
} from '../../ui/file_preview/file_icons/file_icon_map'
import styles from './CardTransparent.module.css'

const CardTransparent = ({
  href,
  title,
  subtitle,
  description,
  extension,
  iconPath,
  onClick,
}: {
  href?: string
  title?: string
  subtitle?: string
  description?: string
  extension?: ExistingFileIconExtensions
  iconPath?: string
  onClick?: () => void
}) => {
  const { theme } = useTheme()
  const src = extension ? iconPathsByTheme(theme)[extension] : iconPath || ''
  return (
    <div
      className={`${styles.container} ${styles.card}`}
      data-pointer={href !== undefined || onClick !== undefined}
      onClick={onClick}
    >
      <div className={styles.iconContainer}>
        <img className={styles.icon} src={src || ''} alt={title} />
      </div>

      <div className={styles.titleContainer}>
        {title && <h4>{title}</h4>}
        {subtitle && <h6>{subtitle}</h6>}
      </div>
      <div>{description && <div>{description}</div>}</div>
    </div>
  )
}

export default CardTransparent
