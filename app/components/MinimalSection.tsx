export default function MinimalSection() {
  return (
    <section
      id="minimal"
      className="w-full min-h-screen relative overflow-hidden bg-white"
    >
      <div className="absolute inset-0 flex items-center justify-center px-6 py-16">
        <div className="relative w-full max-w-8xl shadow-none rounded-3xl p-10 md:p-14 lg:p-16 overflow-hidden">
          <div className="flex flex-col items-center justify-center text-center space-y-6">
            <div className="space-y-1 mb-8">
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-chaney text-black dark:text-white">
                <span className="font-dancing">Building</span>{" "}
                <span className="font-chaney font-bold">Digital</span>
              </h1>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-chaney font-bold text-black dark:text-white">
                experiences with code
              </h2>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-chaney font-bold text-black dark:text-white">
                and creative solutions
              </h2>
            </div>

            <p className="text-sm md:text-base text-zinc-700 dark:text-zinc-300 leading-relaxed max-w-2xl mt-6">
              Web applications, mobile apps, APIs, databases, cloud infrastructure, and scalable systems; all built with modern technologies and best practices.
            </p>

            <div className="mt-12 text-xs text-zinc-500 dark:text-zinc-400">
              trusted by passion
            </div>
          </div>
        </div>
      </div>
      
    </section>
  );
}

