import { Hero } from '@/components/landing/hero';
import { DemoPreview } from '@/components/landing/demo-preview';
import { DemoShowcase } from '@/components/landing/demo-showcase';
import { AiAgents } from '@/components/landing/ai-agents';
import { CoreFeatures } from '@/components/landing/core-features';
import { ReportExample } from '@/components/landing/report-example';
import { HowItWorks } from '@/components/landing/how-it-works';
import { Comparison } from '@/components/landing/comparison';
import { WhoItsFor } from '@/components/landing/who-its-for';

export default function Home() {
  return (
    <>
      <Hero />
      <DemoPreview />
      <DemoShowcase />
      <AiAgents />
      <CoreFeatures />
      <ReportExample />
      <HowItWorks />
      <Comparison />
      <WhoItsFor />
    </>
  );
}
