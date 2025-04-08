'use client'

import { Suspense, useEffect, useState } from 'react';
import styled from 'styled-components';
import Layout from '@/components/Layout/Layout';
import ContactForm from '@/components/Contact/ContactForm';

const ContactPage = styled.div`
  min-height: 100vh;
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.primary[100]} 0%,
    white 25%,
    ${({ theme }) => theme.colors.primary[100]} 50%,
    white 75%,
    ${({ theme }) => theme.colors.primary[100]} 100%
  );
  padding: ${({ theme }) => theme.spacing['2xl']} 0;
`;

const ContactContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.spacing.xl};

  @media (max-width: 768px) {
    padding: 0 ${({ theme }) => theme.spacing.md};
  }
`;

const ContactHeader = styled.div`
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing['2xl']};
`;

const Title = styled.h1`
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: 3rem;
  color: ${({ theme }) => theme.colors.primary[800]};
  margin-bottom: ${({ theme }) => theme.spacing.md};

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const Description = styled.p`
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 1.25rem;
  color: ${({ theme }) => theme.colors.neutral[700]};
  line-height: 1.8;
  max-width: 600px;
  margin: 0 auto;

  @media (max-width: 768px) {
    font-size: 1rem;
    line-height: 1.6;
  }
`;

export default function Contact() {
  const [description, setDescription] = useState('Have a custom order request, or a a question? Send us a message, and we\'ll get back to you as soon as possible!');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchContactDescription = async () => {
      try {
        const response = await fetch('/api/contact-page');
        const data = await response.json();
        if (data.description) {
          setDescription(data.description);
        }
      } catch (error) {
        console.error('Error fetching contact description:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchContactDescription();
  }, []);

  return (
    <Layout>
      <Suspense fallback={<div>Loading...</div>}>
        <ContactPage>
          <ContactContainer>
            <ContactHeader>
              <Title>Contact Us</Title>
              <Description>
                {isLoading ? 'Loading...' : description}
              </Description>
            </ContactHeader>
            <ContactForm />
          </ContactContainer>
        </ContactPage>
      </Suspense>
    </Layout>
  );
} 