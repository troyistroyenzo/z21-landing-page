import Link from 'next/link';

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <section className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Privacy Policy</h1>
        <p className="text-zinc-400 mb-8">Last updated: {new Date().toLocaleDateString()}</p>

        <div className="space-y-6 text-zinc-300 leading-relaxed">
          <p>
            This is a placeholder privacy policy page. Replace this content with your final policy text.
            It explains what data you collect, why you collect it, how you store and process it, and how
            users can request access or deletion.
          </p>

          <h2 className="text-xl font-semibold text-white">What we collect</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Contact details (name, email, social links)</li>
            <li>Form responses related to the sprint application</li>
            <li>Basic analytics (page views, device, rough location)</li>
          </ul>

          <h2 className="text-xl font-semibold text-white">How we use it</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>To review fit for the 1:1 sprint or cohort</li>
            <li>To provide onboarding, scheduling, and support</li>
            <li>To improve our products, content, and operations</li>
          </ul>

          <h2 className="text-xl font-semibold text-white">Data retention & deletion</h2>
          <p>
            We retain data as long as needed for the purposes above. You may request access, correction,
            or deletion by emailing <a className="underline hover:text-zinc-100" href="mailto:hey@z21.build">hey@z21.build</a>.
          </p>

          <h2 className="text-xl font-semibold text-white">Third parties</h2>
          <p>
            We may use trusted third-party vendors (e.g., hosting, analytics, email) that process data on our
            behalf under contractual safeguards.
          </p>

          <h2 className="text-xl font-semibold text-white">Contact</h2>
          <p>
            For any privacy questions, contact us at <a className="underline hover:text-zinc-100" href="mailto:hey@z21.build">hey@z21.build</a>.
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
