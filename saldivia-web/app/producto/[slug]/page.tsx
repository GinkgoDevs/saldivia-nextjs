interface Props {
  params: Promise<{ slug: string }>
}

export default async function ProductoPage({ params }: Props) {
  const { slug } = await params
  return (
    <main>
      <h1>Producto: {slug}</h1>
      <p>Ficha técnica — en desarrollo</p>
    </main>
  )
}
