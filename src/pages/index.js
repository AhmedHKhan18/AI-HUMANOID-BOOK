import React from 'react';
import clsx from 'clsx';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Translate, {translate} from '@docusaurus/Translate';
import styles from './index.module.css';

// Hero Section - Matching reference book style
function HomepageHero() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header className={styles.heroSection}>
      <div className={styles.heroContent}>
        <h1 className={styles.heroTitle}>
          <Translate id="homepage.hero.title">Physical AI & Humanoid Robotics</Translate>
        </h1>
        <p className={styles.heroSubtitle}>
          <Translate id="homepage.hero.subtitle">
            A Comprehensive Open-Source Textbook for Building Intelligent Humanoid Robots
          </Translate>
        </p>
        <div className={styles.heroButtons}>
          <Link className={clsx('button button--primary button--lg', styles.heroButton)} to="docs/intro">
            <Translate id="homepage.hero.button">Start Reading →</Translate>
          </Link>
        </div>
      </div>
    </header>
  );
}

// What This Textbook Covers Section - Matching reference style
function WhatThisBookCovers() {
  const TopicBlocks = [
    {
      label: translate({id: 'homepage.module1.label', message: 'Module 1'}),
      heading: translate({id: 'homepage.module1.heading', message: 'ROS 2 Foundations'}),
      path: 'ros2-fundamentals',
      description: translate({id: 'homepage.module1.description', message: 'Master the Robot Operating System 2 for communication, control architecture, and package development in modern robotics.'})
    },
    {
      label: translate({id: 'homepage.module2.label', message: 'Module 2'}),
      heading: translate({id: 'homepage.module2.heading', message: 'Simulation & Digital Twins'}),
      path: 'robot-simulation',
      description: translate({id: 'homepage.module2.description', message: 'Build realistic virtual environments with Gazebo and Unity for testing, development, and AI model training.'})
    },
    {
      label: translate({id: 'homepage.module3.label', message: 'Module 3'}),
      heading: translate({id: 'homepage.module3.heading', message: 'NVIDIA Isaac Platform'}),
      path: 'nvidia-isaac-platform',
      description: translate({id: 'homepage.module3.description', message: 'Integrate Isaac Sim and Isaac ROS for GPU-accelerated perception, navigation, and manipulation capabilities.'})
    },
    {
      label: translate({id: 'homepage.module4.label', message: 'Module 4'}),
      heading: translate({id: 'homepage.module4.heading', message: 'Vision-Language-Action (VLA)'}),
      path: 'conversational-robotics-vla',
      description: translate({id: 'homepage.module4.description', message: 'Implement multimodal AI systems that understand natural language, perceive the world, and execute complex physical tasks.'})
    },
  ];

  return (
    <section className={styles.sectionPadding}>
      <div className={styles.container}>
        <h2 className={styles.sectionHeading}>
          <Translate id="homepage.whatCovers.title">What This Textbook Covers</Translate>
        </h2>
        <div className={styles.topicBlocksGrid}>
          {TopicBlocks.map((block, idx) => (
            <div key={idx} className={styles.topicBlock}>
              <span className={styles.topicLabel}>{block.label}</span>
              <h3 className={styles.topicHeading}>{block.heading}</h3>
              <p className={styles.topicDescription}>{block.description}</p>
              <Link to={`/docs/${block.path}`} className={styles.topicLink}>
                <Translate id="homepage.openModule">Open Module →</Translate>
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
        <h2 className={styles.sectionHeading}>
          <Translate id="homepage.motivation.title">Why This Textbook is AI-Native & Future-Focused</Translate>
        </h2>
        <p className={styles.motivationText}>
          <Translate id="homepage.motivation.text">
            Physical AI represents the convergence of artificial intelligence with embodied robotics—creating machines that don't just process information, but interact meaningfully with the physical world. This textbook bridges the gap between theoretical AI and practical humanoid robotics, providing a comprehensive framework for building truly intelligent, autonomous agents. Unlike traditional resources that treat AI and robotics separately, we integrate cutting-edge vision-language-action models, GPU-accelerated perception, and modern software architectures from the ground up. Every chapter emphasizes not just implementation, but the fundamental reasoning behind architectural decisions, preparing you to build the next generation of humanoid robots that can understand, adapt, and thrive in real-world environments.
          </Translate>
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
        <h2 className={styles.sectionHeading}>
          <Translate id="homepage.learningPath.title">Your Learning Path</Translate>
        </h2>
        <p className={styles.pathDescription}>
          <Translate id="homepage.learningPath.description">
            This textbook follows a carefully structured progression from foundational concepts to advanced integration.
            Each module builds upon the previous, culminating in a fully autonomous humanoid robot system.
          </Translate>
        </p>
        <div className={styles.ctaButtons}>
          <Link className={clsx('button button--primary button--lg')} to="/docs/intro">
            <Translate id="homepage.learningPath.beginButton">Begin Your Journey →</Translate>
          </Link>
          <Link className={clsx('button button--outline button--primary button--lg')} to="/docs/intro">
            <Translate id="homepage.learningPath.tocButton">View Table of Contents</Translate>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <Layout
      title={translate({id: 'homepage.title', message: 'Home'})}
      description={translate({id: 'homepage.description', message: 'A comprehensive guide to understanding and building intelligent robots, integrating cutting-edge AI methodologies with practical humanoid robotics applications.'})}>
      <HomepageHero />
      <main>
        <WhatThisBookCovers />
        <MotivationSection />
        <ChaptersOverview />
      </main>
    </Layout>
  );
}
