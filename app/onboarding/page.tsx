'use client';

import { useState } from 'react';
import IntakeForm from './components/IntakeForm';

export default function OnboardingPage() {
  return (
    <main className="min-h-screen bg-black">
      <IntakeForm />
    </main>
  );
}
