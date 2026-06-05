'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import ParticleBackground from '@/components/landing/ParticleBackground';
import HeroSection from '@/components/landing/HeroSection';
import AgentShowcase from '@/components/landing/AgentShowcase';
import IdeaInput from '@/components/landing/IdeaInput';
import HowItWorks from '@/components/landing/HowItWorks';

export default function Home() {
  const router = useRouter();
  const [isLaunching, setIsLaunching] = useState(false);

  const handleLaunch = (idea: string) => {
    setIsLaunching(true);
    // Store idea in sessionStorage for dashboard to pick up
    sessionStorage.setItem('projectIdea', idea);
    // Navigate to dashboard after brief animation
    setTimeout(() => {
      router.push('/dashboard');
    }, 1500);
  };

  return (
    <main className="relative min-h-screen overflow-hidden">
      <ParticleBackground />

      {/* Launch overlay */}
      {isLaunching && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: 'rgba(6, 6, 15, 0.95)' }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: [0, 1.2, 1] }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="text-center"
          >
            <motion.div
              animate={{ rotate: 360, y: [0, -20, 0] }}
              transition={{ duration: 1.5, ease: 'easeInOut' }}
              className="text-8xl mb-6"
            >
              🚀
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-3xl font-bold text-gradient-primary"
            >
              Assembling AI Company...
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="text-[#8892b0] mt-3"
            >
              Recruiting 12 AI agents for your project
            </motion.p>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '300px' }}
              transition={{ delay: 0.3, duration: 1.2, ease: 'easeInOut' }}
              className="h-1 bg-gradient-to-r from-[#00d4ff] to-[#a855f7] rounded-full mx-auto mt-6"
            />
          </motion.div>
        </motion.div>
      )}

      {/* Content */}
      <div className="relative z-10">
        <HeroSection />

        {/* Agent Showcase Section */}
        <section className="py-24 px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Meet Your{' '}
              <span className="text-gradient-primary">AI Workforce</span>
            </h2>
            <p className="text-lg text-[#8892b0] max-w-2xl mx-auto">
              12 specialized agents with unique personalities, expertise, and debate styles.
              They argue, challenge, and improve each other&apos;s work.
            </p>
          </motion.div>
          <AgentShowcase />
        </section>

        {/* Idea Input Section */}
        <section id="launch" className="py-24 px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Launch Your{' '}
              <span className="text-gradient-fire">AI Company</span>
            </h2>
            <p className="text-lg text-[#8892b0] max-w-2xl mx-auto">
              Describe your product idea and watch the AI company come alive.
              Agents will debate, design, code, test, and deploy your application.
            </p>
          </motion.div>
          <IdeaInput onLaunch={handleLaunch} />
        </section>

        {/* How It Works Section */}
        <section className="py-24 px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              How{' '}
              <span className="text-gradient-cool">It Works</span>
            </h2>
            <p className="text-lg text-[#8892b0] max-w-2xl mx-auto">
              From idea to deployed application in 14 autonomous stages.
              Watch real debates unfold as agents fight for the best approach.
            </p>
          </motion.div>
          <HowItWorks />
        </section>

        {/* Footer */}
        <footer className="py-12 px-6 border-t border-white/5">
          <div className="max-w-6xl mx-auto text-center">
            <p className="text-[#8892b0]">
              Built for{' '}
              <span className="text-[#00d4ff] font-semibold">HackIndia</span>{' '}
              — AI Company Simulator
            </p>
            <p className="text-[#4a5568] text-sm mt-2">
              Powered by Multi-Agent AI Orchestration
            </p>
          </div>
        </footer>
      </div>
    </main>
  );
}
