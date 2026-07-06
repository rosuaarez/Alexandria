import Image from 'next/image'

interface OptimizedImageProps {
  src: string
  alt: string
  width: number
  height: number
  className?: string
  priority?: boolean
  rounded?: boolean
}

// Wrapper de next/image preparado para los assets reales que llegarán más adelante
// (thumbnails de recursos, avatares reales). Por ahora solo encapsula los tipos y
// los defaults correctos; aún no se usa con imágenes reales.
export function OptimizedImage({
  src,
  alt,
  width,
  height,
  className,
  priority = false,
  rounded = false,
}: OptimizedImageProps) {
  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      priority={priority}
      style={rounded ? { borderRadius: '50%' } : undefined}
    />
  )
}
