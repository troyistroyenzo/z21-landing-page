import TypeformCTAButton from '@/app/vibe-check/components/TypeformCTAButton';

export default function VibeCheckPage() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-8">
      <div className="max-w-4xl mx-auto text-center space-y-8">
        <h1 
          className="text-5xl font-bold"
          style={{
            background: 'linear-gradient(90deg, #fca5a5, #fed7aa, #fef3c7, #d9f99d, #a7f3d0, #bfdbfe, #ddd6fe, #fecdd3)',
            backgroundSize: '200% 200%',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            animation: 'rainbow-flow 8s ease infinite'
          }}
        >
          Join The Z21 Launchpad
        </h1>
        
        <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
          Build {'>'} talk. Take your AI skills from zero to hero.
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
