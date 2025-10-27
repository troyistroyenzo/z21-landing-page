import TypeformCTAButton from '@/app/vibe-check/components/TypeformCTAButton';

export default function VibeCheckPage() {
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
      </div>
    </div>
  );
}
