'use client'

import styles from './Skeleton.module.css'

interface SkeletonProps {
  width?: string
  height?: string
  borderRadius?: string
}

export function Skeleton({
  width = '100%',
  height = '16px',
  borderRadius = '6px',
}: SkeletonProps) {
  return (
    <span
      className={styles.skeleton}
      style={{ width, height, borderRadius }}
      aria-hidden
    />
  )
}
