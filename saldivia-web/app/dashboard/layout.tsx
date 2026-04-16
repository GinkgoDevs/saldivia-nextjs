export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
<<<<<<< add/SkeletonsAndHero
  return <div className="min-h-screen bg-surface">{children}</div>;
=======
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    redirect('/dashboard/login')
  }

  return (
    <div>
      {children}
    </div>
  )
>>>>>>> main
}
