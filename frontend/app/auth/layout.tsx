const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <section className="h-[100dvh] md:py-10 bg-background-primary overflow-hidden relative flex items-center md:items-start justify-center">
      {/* Background Image with Blur */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(/images/auth.jpg)',
          filter: 'blur(3px)',
          transform: 'scale(1.1)' // Slight scale to prevent blur edges
        }}
      />
      
      {/* Overlay for better content readability */}
      <div className="absolute inset-0 bg-black/20" />
      
      {/* Content Container */}
      <div className="w-[350px] relative z-10 mx-auto bg-white/65 backdrop-blur-sm py-8 px-4 rounded-xl shadow-2xl">
        {children}
      </div>
    </section>
  )
}

export default AuthLayout
