import Link from 'next/link';

export default function CookiePolicyPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <section className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Cookie Policy</h1>
        <p className="text-zinc-400 mb-8">Last updated: {new Date().toLocaleDateString()}</p>

        <div className="space-y-6 text-zinc-300 leading-relaxed">
          <p>
            This is a placeholder cookie policy page. Replace this content with your final policy.
            It explains how cookies and similar technologies are used on this site.
          </p>

          <h2 className="text-xl font-semibold text-white">What are cookies?</h2>
          <p>
            Cookies are small text files placed on your device to store data that can be
            retrieved by the website on subsequent visits. They help with functionality,
            performance, and analytics.
          </p>

          <h2 className="text-xl font-semibold text-white">How we use cookies</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Essential: to deliver core site functionality</li>
            <li>Analytics: to understand usage and improve the experience</li>
            <li>Preference: to remember settings like language or theme</li>
          </ul>

          <h2 className="text-xl font-semibold text-white">Managing cookies</h2>
          <p>
            You can control cookies via your browser settings. Most browsers allow you to block
            or delete cookies. Note that disabling cookies may impact site functionality.
          </p>

          <h2 className="text-xl font-semibold text-white">Contact</h2>
          <p>
            For questions about this policy, email{' '}
            <a className="underline hover:text-zinc-100" href="mailto:hey@z21.build">hey@z21.build</a>.
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
