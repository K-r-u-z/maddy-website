'use client'

import styled from 'styled-components';
import Link from 'next/link';
import { FaFacebook, FaInstagram } from 'react-icons/fa';

const FooterContainer = styled.footer`
  background-color: ${({ theme }) => theme.colors.primary[100]};
  padding: ${({ theme }) => theme.spacing.xl} 0;
  border-top: 1px solid ${({ theme }) => theme.colors.primary[200]};
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.spacing.xl};
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${({ theme }) => theme.spacing.xl};

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    text-align: center;
    gap: ${({ theme }) => theme.spacing.lg};
    padding: 0 ${({ theme }) => theme.spacing.md};
  }
`;

const FooterSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

const FooterTitle = styled.h3`
  font-family: ${({ theme }) => theme.fonts.heading};
  color: ${({ theme }) => theme.colors.primary[800]};
  font-size: 1.25rem;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const FooterLink = styled.a`
  color: ${({ theme }) => theme.colors.primary[700]};
  text-decoration: none;
  transition: color 0.2s ease;
  font-size: 1rem;

  &:hover {
    color: ${({ theme }) => theme.colors.primary[900]};
  }
`;

const SocialLinks = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  
  @media (max-width: 768px) {
    justify-content: center;
  }
`;

const SocialIcon = styled.a`
  color: ${({ theme }) => theme.colors.primary[700]};
  font-size: 1.5rem;
  transition: all 0.2s ease;

  &:hover {
    color: ${({ theme }) => theme.colors.primary[900]};
    transform: translateY(-2px);
  }
`;

const Copyright = styled.div`
  text-align: center;
  margin-top: ${({ theme }) => theme.spacing.xl};
  padding-top: ${({ theme }) => theme.spacing.lg};
  border-top: 1px solid ${({ theme }) => theme.colors.primary[200]};
  color: ${({ theme }) => theme.colors.primary[700]};
  font-size: 0.875rem;

  a {
    color: ${({ theme }) => theme.colors.secondary[600]};
    text-decoration: none;
    transition: color 0.2s ease;

    &:hover {
      color: ${({ theme }) => theme.colors.secondary[700]};
    }
  }
`;

const Footer = () => {
  return (
    <FooterContainer>
      <FooterContent>
        <FooterSection>
          <FooterTitle>Quick Links</FooterTitle>
          <FooterLink href="#about">About</FooterLink>
          <FooterLink href="#menu">Menu</FooterLink>
          <FooterLink href="#how-to-order">How to Order</FooterLink>
          <FooterLink href="#faq">FAQ</FooterLink>
          <FooterLink href="/privacy-policy">Privacy Policy</FooterLink>
        </FooterSection>
        <FooterSection>
          <FooterTitle>Contact</FooterTitle>
          <FooterLink href="mailto:cakepopsbymaddy@gmail.com">
            contact@cakepopsbymaddy.com
          </FooterLink>
          <FooterLink 
            href="https://www.linkedin.com/in/madelyn-solesbee"
            target="_blank"
            rel="noopener noreferrer"
          >
            LinkedIn: madelyn-solesbee
          </FooterLink>
        </FooterSection>
        <FooterSection>
          <FooterTitle>Follow Us</FooterTitle>
          <SocialLinks>
            <SocialIcon 
              href="https://www.facebook.com/profile.php?id=61568286911068"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
            >
              <FaFacebook />
            </SocialIcon>
            <SocialIcon 
              href="https://www.instagram.com/cakepopsbymaddy/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
            >
              <FaInstagram />
            </SocialIcon>
          </SocialLinks>
        </FooterSection>
      </FooterContent>
      <Copyright>
        © {new Date().getFullYear()} Cake Pops by Maddy. All rights reserved. 
        <br />
        Developed by <a href="https://github.com/K-r-u-z" target="_blank" rel="noopener noreferrer">Kruz</a>
      </Copyright>
    </FooterContainer>
  );
};

export default Footer; 