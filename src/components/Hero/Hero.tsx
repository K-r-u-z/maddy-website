'use client'

import Image from 'next/image';
import styled, { useTheme } from 'styled-components';
import { SprinkleContainer } from './SprinkleContainer';
import { useRouter } from 'next/navigation';

const HeroContainer = styled.section`
  position: relative;
  height: 100vh;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background-color: ${({ theme }) => theme.colors.neutral[900]};
  color: ${({ theme }) => theme.colors.neutral[50]};
  margin-top: -70px;
  padding-top: 70px;
`;

const BackgroundImage = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1;

  img {
    object-fit: cover;
    object-position: center;
  }
`;

const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    to bottom,
    ${({ theme }) => `${theme.colors.neutral[900]}E6`},
    ${({ theme }) => `${theme.colors.neutral[800]}E6`}
  );
  z-index: 2;
`;

const BackgroundDecoration = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  opacity: 0.4;
  z-index: 3;
`;

const HeroContent = styled.div`
  position: relative;
  z-index: 4;
  text-align: center;
  padding: ${({ theme }) => theme.spacing['2xl']};
  max-width: 800px;
`;

const LogoContainer = styled.div`
  position: relative;
  width: 400px;
  height: 400px;
  margin: 0 auto;
  margin-bottom: ${({ theme }) => theme.spacing.lg};

  @media (max-width: 768px) {
    width: 250px;
    height: 250px;
  }
`;

const Title = styled.h1`
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: 4.5rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary[200]};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  text-shadow: 3px 3px 6px rgba(0, 0, 0, 0.4);

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const Subtitle = styled.p`
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 1.5rem;
  color: ${({ theme }) => theme.colors.neutral[100]};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  justify-content: center;
  
  @media (max-width: 768px) {
    flex-direction: column;
    width: 100%;
    max-width: 300px;
    margin: 0 auto;
    gap: ${({ theme }) => theme.spacing.sm};
  }
`;

const CTAButton = styled.button`
  background-color: ${({ theme }) => theme.colors.primary[500]};
  color: white;
  padding: ${({ theme }) => `${theme.spacing.md} ${theme.spacing.xl}`};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  border: none;
  font-family: ${({ theme }) => theme.fonts.body};
  font-weight: 600;
  font-size: 1.125rem;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  min-width: 160px;

  &:hover {
    background-color: ${({ theme }) => theme.colors.primary[600]};
    transform: translateY(-2px);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.15);
  }

  @media (max-width: 768px) {
    width: 100%;
    padding: ${({ theme }) => `${theme.spacing.md} ${theme.spacing.lg}`};
    font-size: 1rem;
  }
`;

const SecondaryButton = styled(CTAButton)`
  background-color: transparent;
  color: ${({ theme }) => theme.colors.primary[500]};
  border: 2px solid ${({ theme }) => theme.colors.primary[500]};

  &:hover {
    background-color: ${({ theme }) => theme.colors.primary[500]};
    color: white;
    border-color: ${({ theme }) => theme.colors.primary[500]};
  }

  @media (max-width: 768px) {
    border-width: 2px;
  }
`;

const Hero = () => {
  const router = useRouter();

  const handleOrderClick = () => {
    // Open the Microsoft Forms order form in a new tab
    window.open('https://forms.office.com/Pages/ResponsePage.aspx?id=JUduhRIIxEabGTNNLgMYdOiXhLZCYHBOrwOKyP9fOqhUOVZTRkpPRVZDNzk2RjRJNVlTRkhQS1JCTy4u', '_blank');
  };

  const handleViewMenuClick = () => {
    // Smooth scroll to menu section
    const menuSection = document.getElementById('menu');
    if (menuSection) {
      menuSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <HeroContainer>
      <BackgroundImage>
        <Image
          src="/images/hero-background.jpg"
          alt="Colorful cake pops background"
          fill
          priority
          quality={90}
        />
      </BackgroundImage>
      <Overlay />
      <BackgroundDecoration>
        <SprinkleContainer />
      </BackgroundDecoration>
      <HeroContent>
        <LogoContainer>
          <Image
            src="/images/logo.png"
            alt="Cake Pops by Maddy Logo"
            fill
            style={{ objectFit: 'contain' }}
            priority
          />
        </LogoContainer>
        <Subtitle>
          Here to make you pop!
        </Subtitle>
        <ButtonContainer>
          <CTAButton onClick={handleOrderClick}>Order Now</CTAButton>
          <SecondaryButton onClick={handleViewMenuClick}>View Menu</SecondaryButton>
        </ButtonContainer>
      </HeroContent>
    </HeroContainer>
  );
};

export default Hero; 