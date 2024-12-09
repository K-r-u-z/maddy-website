'use client'

import { useState, useEffect } from 'react';
import styled from 'styled-components';
import Image from 'next/image';

const AboutSection = styled.section`
  padding: ${({ theme }) => theme.spacing['2xl']} 0;
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.primary[200]} 0%,
    ${({ theme }) => theme.colors.primary[100]} 25%,
    ${({ theme }) => theme.colors.primary[200]} 50%,
    ${({ theme }) => theme.colors.primary[100]} 75%,
    ${({ theme }) => theme.colors.primary[200]} 100%
  );
  min-height: 90vh;
  display: flex;
  align-items: center;
  position: relative;
  
  &:before {
    content: '';
    position: absolute;
    top: -50px;
    left: 0;
    right: 0;
    height: 100px;
    background: linear-gradient(to bottom, transparent, ${({ theme }) => theme.colors.primary[200]});
    pointer-events: none;
  }

  &:after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: radial-gradient(
      ${({ theme }) => theme.colors.primary[300]} 1px,
      transparent 1px
    );
    background-size: 40px 40px;
    opacity: 0.4;
    pointer-events: none;
  }
`;

const AboutContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.spacing.xl};
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.spacing['2xl']};
  align-items: center;
  position: relative;
  z-index: 1;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    text-align: center;
    gap: ${({ theme }) => theme.spacing.xl};
  }
`;

const AboutContent = styled.div`
  max-width: 500px;

  @media (max-width: 768px) {
    margin: 0 auto;
  }
`;

const AboutTitle = styled.h2`
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: 3rem;
  color: ${({ theme }) => theme.colors.primary[800]};
  margin-bottom: ${({ theme }) => theme.spacing.xl};

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const AboutText = styled.p`
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 1.125rem;
  color: ${({ theme }) => theme.colors.neutral[700]};
  line-height: 1.8;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const ContactSection = styled.div`
  margin-top: ${({ theme }) => theme.spacing.xl};
`;

const ContactTitle = styled.h3`
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: 1.5rem;
  color: ${({ theme }) => theme.colors.primary[700]};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const ContactLink = styled.a`
  display: block;
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 1.125rem;
  color: ${({ theme }) => theme.colors.secondary[600]};
  text-decoration: none;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  transition: color 0.2s ease;

  &:hover {
    color: ${({ theme }) => theme.colors.secondary[700]};
  }
`;

const ImageContainer = styled.div`
  position: relative;
  width: 100%;
  height: 600px;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  overflow: hidden;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 25px 30px -5px rgba(0, 0, 0, 0.15), 0 15px 15px -5px rgba(0, 0, 0, 0.08);
  }

  img {
    transition: transform 0.3s ease;
  }

  &:hover img {
    transform: scale(1.05);
  }

  @media (max-width: 768px) {
    height: 400px;
    margin-top: ${({ theme }) => theme.spacing.xl};
  }
`;

interface AboutData {
  title: string;
  description: string;
  image: string;
}

const About = () => {
  const [aboutData, setAboutData] = useState<AboutData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAbout = async () => {
      try {
        const response = await fetch('/api/public/about');
        const data = await response.json();
        if (data._id) {
          setAboutData(data);
        }
      } catch (error) {
        console.error('Error fetching about data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAbout();
  }, []);

  if (isLoading) {
    return null; // or a loading spinner if you prefer
  }

  return (
    <AboutSection id="about">
      <AboutContainer>
        <AboutContent>
          <AboutTitle>{aboutData?.title || 'About Me'}</AboutTitle>
          {aboutData?.description.split('\n').map((paragraph, index) => (
            <AboutText key={index}>{paragraph}</AboutText>
          ))}
          <ContactSection>
            <ContactTitle>Need to get in contact with me?</ContactTitle>
            <ContactLink href="mailto:cakepopsbymaddy@gmail.com">
              cakepopsbymaddy@gmail.com
            </ContactLink>
            <ContactLink 
              href="https://www.linkedin.com/in/madelyn-solesbee" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              LinkedIn: madelyn-solesbee
            </ContactLink>
          </ContactSection>
        </AboutContent>
        <ImageContainer>
          <Image
            src={aboutData?.image || '/images/about.png'}
            alt="Maddy making cake pops"
            fill
            style={{ objectFit: 'cover' }}
            priority
          />
        </ImageContainer>
      </AboutContainer>
    </AboutSection>
  );
};

export default About; 