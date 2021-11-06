type Props = {
  alt: string
  height: string
  src: string
  width: string
}

export const PVImage = ({ alt, height, src, width }: Props) => {
  return (
    <img
      alt={alt}
      className='pv-image'
      height={height}
      src={src}
      width={width}
    />
  )
}

