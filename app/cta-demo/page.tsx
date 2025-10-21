import TypeformCTAButton from '@/app/cta-demo/components/TypeformCTAButton';

export default function CTADemoPage() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-8">
      <div className="max-w-4xl mx-auto text-center space-y-8">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
          Join Z21 Launchpad
        </h1>
        
        <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
          Build {'>'} talk. We ship, measure, repeat.
        </p>

        <div className="flex flex-col items-center gap-8 mt-12">
          <TypeformCTAButton 
            text="Start Your Journey"
            variant="primary"
            size="lg"
          />
        </div>

        {/* <div className="mt-16 p-6 bg-zinc-900 rounded-lg border border-zinc-800">
          <h2 className="text-2xl font-semibold mb-4">Implementation Notes</h2>
          <div className="text-left space-y-4 text-zinc-400">
            <div>
              <h3 className="text-white font-semibold mb-2">✅ Features Implemented:</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>Smooth Framer Motion animations between questions</li>
                <li>Swipe gestures for navigation (drag left/right)</li>
                <li>Field validation with error messages</li>
                <li>Progress bar and step indicators</li>
                <li>Auto-advance for select questions</li>
                <li>Enter key navigation for text inputs</li>
                <li>Google Analytics event tracking</li>
                <li>Responsive design</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-2">📋 Next Steps:</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>Create your Supabase project and run the SQL script in <code className="bg-zinc-800 px-1 rounded">supabase/create_cta_table.sql</code></li>
                <li>Add your Supabase credentials to <code className="bg-zinc-800 px-1 rounded">.env.local</code></li>
                <li>Customize questions in <code className="bg-zinc-800 px-1 rounded">app/content/ctaQuestions.ts</code></li>
                <li>Add the TypeformCTAButton to your landing page components</li>
              </ul>
            </div>

            <div className="p-4 bg-yellow-900/20 border border-yellow-900 rounded-lg">
              <p className="text-yellow-400">
                <strong>Note:</strong> Form submission will fail until you configure Supabase credentials in your environment variables.
              </p>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
}
