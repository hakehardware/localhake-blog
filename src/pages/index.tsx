import type {ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';

import styles from './index.module.css';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx(styles.hero)}>
      <div className="container">
        <div className={styles.terminal}>
          <span className={styles.prompt}>{'>'}</span>
          <Heading as="h1" className={styles.title}>
            {siteConfig.title}
          </Heading>
        </div>
        <p className={styles.tagline}>~/homelab/tutorials</p>
        <div className={styles.buttons}>
          <Link
            className={clsx('button button--primary button--lg', styles.heroButton)}
            to="/blog">
            Read the Blog
          </Link>
          <Link
            className={clsx('button button--secondary button--lg', styles.heroButton)}
            to="/wiki/overview">
            Hake Homelab
          </Link>
        </div>
      </div>
    </header>
  );
}

interface SectionProps {
  tag: string;
  children: ReactNode;
}

function Section({tag, children}: SectionProps): ReactNode {
  return (
    <section className={styles.section}>
      <div className={styles.sectionHeader}>
        <span className={styles.tag}>[{tag}]</span>
      </div>
      <div className={styles.sectionContent}>
        {children}
      </div>
    </section>
  );
}

interface SocialLinkItem {
  href: string;
  label: string;
  icon: string;
  placeholder?: boolean;
}

const socialLinks: SocialLinkItem[] = [
  {
    href: 'https://localhake.com',
    label: 'Home',
    icon: '⌂',
  },
  {
    href: 'https://www.youtube.com/@hakehardware',
    label: 'YouTube',
    icon: '▶',
  },
  {
    href: '#',
    label: 'Instagram',
    icon: '📷',
    placeholder: true,
  },
  {
    href: '#',
    label: 'TikTok',
    icon: '♪',
    placeholder: true,
  },
];

function SocialLinks(): ReactNode {
  return (
    <div className={styles.socialLinks}>
      {socialLinks.map((link) => (
        <a
          key={link.label}
          href={link.href}
          className={clsx(styles.socialLink, {
            [styles.placeholder]: link.placeholder,
          })}
          target="_blank"
          rel="noopener noreferrer"
        >
          <span className={styles.socialIcon}>{link.icon}</span>
          <span>{link.label}</span>
        </a>
      ))}
    </div>
  );
}

export default function Home(): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title="Blog"
      description="Companion site for Hake Hardware YouTube channel. Written tutorials, homelab documentation, and self-hosted guides for enthusiasts.">
      <HomepageHeader />
      <main className={styles.main}>
        <Section tag="ABOUT">
          <p className={styles.aboutText}>
            Companion site for the <strong>Hake Hardware</strong> YouTube channel. 
            Here you'll find written tutorials, documentation, and guides for 
            homelab enthusiasts looking to build and optimize their own setups.
          </p>
        </Section>

        <Section tag="CONTENT">
          <div className={styles.contentGrid}>
            <Link to="/blog" className={styles.contentCard}>
              <span className={styles.contentIcon}>📝</span>
              <h3 className={styles.contentTitle}>Localhake [Blog]</h3>
              <p className={styles.contentDescription}>
                Video companion posts with step-by-step tutorials and guides.
              </p>
            </Link>
            <Link to="/wiki/overview" className={styles.contentCard}>
              <span className={styles.contentIcon}>📚</span>
              <h3 className={styles.contentTitle}>Hake Homelab</h3>
              <p className={styles.contentDescription}>
                Documentation of my homelab infrastructure, hosts, and services.
              </p>
            </Link>
          </div>
        </Section>

        <Section tag="CONNECT">
          <p className={styles.connectText}>
            Follow along on social media for the latest updates and content.
          </p>
          <SocialLinks />
        </Section>
      </main>
    </Layout>
  );
}
