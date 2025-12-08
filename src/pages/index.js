import React from 'react';
import clsx from 'clsx';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import styles from './index.module.css';

// Hero Section - Matching reference book style
function HomepageHero() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header className={styles.heroSection}>
      <div className={styles.heroContent}>
        <h1 className={styles.heroTitle}>Physical AI & Humanoid Robotics</h1>
        <p className={styles.heroSubtitle}>
          A Comprehensive Open-Source Textbook for Building Intelligent Humanoid Robots
        </p>
        <div className={styles.heroButtons}>
          <Link className={clsx('button button--primary button--lg', styles.heroButton)} to="docs/intro">
            Start Reading →
          </Link>
        </div>
      </div>
    </header>
  );
}

// What This Textbook Covers Section - Matching reference style
const TopicBlocks = [
  {
    label: 'Module 1',
    heading: 'ROS 2 Foundations',
    path: 'ros2-fundamentals',
    description: 'Master the Robot Operating System 2 for communication, control architecture, and package development in modern robotics.'
  },
  {
    label: 'Module 2',
    heading: 'Simulation & Digital Twins',
    path: 'robot-simulation',
    description: 'Build realistic virtual environments with Gazebo and Unity for testing, development, and AI model training.'
  },
  {
    label: 'Module 3',
    heading: 'NVIDIA Isaac Platform',
    path: 'nvidia-isaac-platform',
    description: 'Integrate Isaac Sim and Isaac ROS for GPU-accelerated perception, navigation, and manipulation capabilities.'
  },
  // {
  //   label: 'Module 4',
  //   heading: 'Humanoid Robot Systems',
  //   // path: '',
  //   description: 'Design and develop software architectures specifically for bipedal humanoid robot platforms and their unique challenges.'
  // },
  {
    label: 'Module 4',
    heading: 'Vision-Language-Action (VLA)',
    path: 'conversational-robotics-vla',
    description: 'Implement multimodal AI systems that understand natural language, perceive the world, and execute complex physical tasks.'
  },
  // {
  //   label: 'Module 6',
  //   heading: 'The Autonomous Humanoid',
  //   // path: '',
  //   description: 'Integrate all components into a fully autonomous humanoid robot capable of real-world task execution and adaptation.'
  // },
];

function WhatThisBookCovers() {
  return (
    <section className={styles.sectionPadding}>
      <div className={styles.container}>
        <h2 className={styles.sectionHeading}>What This Textbook Covers</h2>
        <div className={styles.topicBlocksGrid}>
          {TopicBlocks.map((block, idx) => (
            <div key={idx} className={styles.topicBlock}>
              <span className={styles.topicLabel}>{block.label}</span>
              <h3 className={styles.topicHeading}>{block.heading}</h3>
              <p className={styles.topicDescription}>{block.description}</p>
              <Link to={`/docs/${block.path}`} className={styles.topicLink}>
                Open Module →
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Why This Textbook is AI-Native & Future-Focused
function MotivationSection() {
  return (
    <section className={clsx(styles.sectionPadding, styles.motivationSection)}>
      <div className={styles.containerWide}>
        <h2 className={styles.sectionHeading}>Why This Textbook is AI-Native & Future-Focused</h2>
        <p className={styles.motivationText}>
          Physical AI represents the convergence of artificial intelligence with embodied robotics—creating machines that don't just process information, but interact meaningfully with the physical world. This textbook bridges the gap between theoretical AI and practical humanoid robotics, providing a comprehensive framework for building truly intelligent, autonomous agents. Unlike traditional resources that treat AI and robotics separately, we integrate cutting-edge vision-language-action models, GPU-accelerated perception, and modern software architectures from the ground up. Every chapter emphasizes not just implementation, but the fundamental reasoning behind architectural decisions, preparing you to build the next generation of humanoid robots that can understand, adapt, and thrive in real-world environments.
        </p>
      </div>
    </section>
  );
}

// Learning Path Section - Added for better UX
function ChaptersOverview() {
  return (
    <section className={clsx(styles.sectionPadding, styles.learningPathSection)}>
      <div className={styles.container}>
        <h2 className={styles.sectionHeading}>Your Learning Path</h2>
        <p className={styles.pathDescription}>
          This textbook follows a carefully structured progression from foundational concepts to advanced integration.
          Each module builds upon the previous, culminating in a fully autonomous humanoid robot system.
        </p>
        <div className={styles.ctaButtons}>
          <Link className={clsx('button button--primary button--lg')} to="/docs/intro">
            Begin Your Journey →
          </Link>
          <Link className={clsx('button button--outline button--primary button--lg')} to="/docs/intro">
            View Table of Contents
          </Link>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <Layout
      title={`Home`}
      description="A comprehensive guide to understanding and building intelligent robots, integrating cutting-edge AI methodologies with practical humanoid robotics applications.">
      <HomepageHero />
      <main>
        <WhatThisBookCovers />
        <MotivationSection />
        <ChaptersOverview />
      </main>
    </Layout>
  );
}
