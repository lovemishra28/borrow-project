import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground transition-colors duration-300">
      {/* Hero Section */}
      <section className="bg-primary text-primary-foreground py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-20"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
            Build. Share. Collaborate.
          </h1>
          <p className="text-xl md:text-2xl mb-10 text-primary-foreground/80 max-w-3xl mx-auto">
            The ultimate platform for students to showcase microprojects, borrow
            components, and find mentorship within campus.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/components"
              className="bg-background text-foreground px-8 py-3 rounded-lg font-bold text-lg hover:bg-background/90 transition-colors shadow-lg md:w-1/3"
            >
              Browse Components
            </Link>
            <Link
              href="/projects"
              className="bg-background text-foreground px-8 py-3 rounded-lg font-bold text-lg hover:bg-background/90 transition-colors shadow-lg md:w-1/3"
            >
              View Projects
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
              Why use CampusShare?
            </h2>
            <p className="mt-4 text-xl text-muted-foreground">
              Stop buying expensive parts for one-time use. Start collaborating.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            {/* Feature 1 */}
            <div className="p-8 bg-card text-card-foreground rounded-2xl border border-border hover:shadow-xl transition-all text-center group">
              <div className="w-16 h-16 bg-accent/10 text-accent rounded-full flex items-center justify-center mx-auto mb-6 text-3xl group-hover:scale-110 transition-transform">
                📦
              </div>
              <h3 className="text-xl font-bold mb-3">Component Lending</h3>
              <p className="text-muted-foreground leading-relaxed">
                Need an Arduino for 2 days? Don't buy it. Borrow from seniors or
                peers who have spare parts gathering dust.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-8 bg-card text-card-foreground rounded-2xl border border-border hover:shadow-xl transition-all text-center group">
              <div className="w-16 h-16 bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl group-hover:scale-110 transition-transform">
                🚀
              </div>
              <h3 className="text-xl font-bold mb-3">Project Showcase</h3>
              <p className="text-muted-foreground leading-relaxed">
                Document your hard work. Upload code snippets, diagrams, and
                results to build a portfolio that stands out to recruiters.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-8 bg-card text-card-foreground rounded-2xl border border-border hover:shadow-xl transition-all text-center group">
              <div className="w-16 h-16 bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl group-hover:scale-110 transition-transform">
                🤝
              </div>
              <h3 className="text-xl font-bold mb-3">Trust & Community</h3>
              <p className="text-muted-foreground leading-relaxed">
                A closed ecosystem for our college. Build your{" "}
                <strong>Reputation Score</strong> by helping others and
                returning items on time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-20 bg-secondary text-secondary-foreground border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">How it Works</h2>
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div className="relative">
              <div className=" text-6xl font-bold text-[#FF6D1F] mb-4">01</div>
              <h4 className="text-lg font-semibold mb-2">Sign Up</h4>
              <p className="text-sm text-muted-foreground">
                Register with your college email ID to verify your student
                status.
              </p>
            </div>
            <div className="relative">
              <div className=" text-6xl font-bold text-[#FF6D1F] mb-4">02</div>
              <h4 className="text-lg font-semibold mb-2">List or Request</h4>
              <p className="text-sm text-muted-foreground">
                Post extra components you own or request items you need.
              </p>
            </div>
            <div className="relative">
              <div className=" text-6xl font-bold text-[#FF6D1F] mb-4">03</div>
              <h4 className="text-lg font-semibold mb-2">Connect</h4>
              <p className="text-sm text-muted-foreground">
                Approve requests via the dashboard and meet on campus.
              </p>
            </div>
            <div className="relative">
              <div className="text-6xl font-bold text-[#FF6D1F] mb-4">04</div>
              <h4 className="text-lg font-semibold mb-2">Build & Return</h4>
              <p className="text-sm text-muted-foreground">
                Complete your project, return the item, and earn reputation
                points.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-[#222222] text-white py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to start building?</h2>
          <p className="mb-8 text-gray-400 text-lg">
            Join students from CSE, ECE, ME, and more. Stop working in silos and
            start leveraging the community power.
          </p>
          <Link
            href="/register"
            className="inline-block bg-[#FF6D1F] hover:bg-orange-800 text-white font-bold py-4 px-10 rounded-full transition-all transform hover:scale-105 shadow-lg"
          >
            Create Your Account
          </Link>
          <p className="mt-4 text-sm text-gray-500">
            Already have an account?{" "}
            <Link href="/login" className="text-[#FF6D1F] hover:underline">
              Log in here
            </Link>
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#FAF3E1] border-t border-gray-200 py-10">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-500 mb-4">
            © {new Date().getFullYear()} CampusShare. Built for students, by
            students.
          </p>
          <div className="flex justify-center space-x-6 text-sm text-gray-400">
            <Link href="/components" className="hover:text-gray-600">
              Marketplace
            </Link>
            <Link href="/projects" className="hover:text-gray-600">
              Showcase
            </Link>
            <Link href="/dashboard" className="hover:text-gray-600">
              My Dashboard
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
