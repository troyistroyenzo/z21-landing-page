import Link from 'next/link';

export default function DisclaimerPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <section className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Disclaimer</h1>
        <p className="text-zinc-400 mb-8">Last updated: {new Date().toLocaleDateString()}</p>

        <div className="space-y-6 text-zinc-300 leading-relaxed">
          <p>
            This is a placeholder disclaimer page. Replace this copy with your final language.
            The content on this website, in workshops, and in any related materials is provided
            for educational purposes only and does not constitute professional advice of any kind.
          </p>

          <h2 className="text-xl font-semibold text-white">No Guarantees</h2>
          <p>
            While real examples and results may be shared, your outcomes will vary based on
            your skills, implementation quality, market conditions, and other factors outside our control.
          </p>

          <h2 className="text-xl font-semibold text-white">No Professional Advice</h2>
          <p>
            Nothing herein should be interpreted as financial, legal, tax, or compliance advice.
            Always consult a qualified professional for your specific situation.
          </p>

          <h2 className="text-xl font-semibold text-white">Responsibility</h2>
          <p>
            You are solely responsible for how you use or implement any information or tools shared in
            our programs, and for complying with applicable laws, policies, and platform terms.
          </p>
        </div>

        <div className="mt-10">
          <Link href="/" className="text-zinc-400 hover:text-white underline">
            ← Back to Home
          </Link>
        </div>
      </section>
    </main>
  );
}
