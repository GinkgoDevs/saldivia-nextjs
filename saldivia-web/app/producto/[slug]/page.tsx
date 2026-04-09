interface Props {
  params: { slug: string }
}

export default function ProductoPage({ params }: Props) {
  return (
    <main>
      <h1>Producto: {params.slug}</h1>
      <p>Ficha técnica — en desarrollo</p>
    </main>
  )
}
