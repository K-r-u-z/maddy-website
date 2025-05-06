'use client'

import Image from 'next/image';
import styled, { useTheme } from 'styled-components';
import { SprinkleContainer } from './SprinkleContainer';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

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
    ${({ theme }) => `${theme.colors.neutral[900]}99`},
    ${({ theme }) => `${theme.colors.neutral[800]}99`}
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
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.xl};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  border: none;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  font-size: 1.2rem;
  position: relative;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};

  &:hover {
    background-color: ${({ theme }) => theme.colors.primary[600]};
    transform: translateY(-2px);
    box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
  }

  @media (max-width: 768px) {
    font-size: 1.1rem;
    padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.lg};
    width: 100%;
    justify-content: center;
  }
`;

const DropdownArrow = styled.span<{ $isOpen: boolean }>`
  display: inline-block;
  width: 0;
  height: 0;
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-top: 5px solid white;
  transition: transform 0.2s ease;
  transform: ${({ $isOpen }) => ($isOpen ? 'rotate(180deg)' : 'rotate(0)')};
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  margin-top: ${({ theme }) => theme.spacing.sm};
  background-color: white;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  min-width: 200px;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  @media (max-width: 768px) {
    position: static;
    margin-top: ${({ theme }) => theme.spacing.sm};
    width: 100%;
    box-shadow: none;
    border: none;
    background-color: ${({ theme }) => theme.colors.primary[500]};
    border-radius: ${({ theme }) => theme.borderRadius.full};
    overflow: hidden;
  }
`;

const DropdownItem = styled.a`
  padding: ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.colors.primary[900]};
  text-decoration: none;
  transition: all 0.2s ease;
  font-weight: 500;
  cursor: pointer;

  &:hover {
    background-color: ${({ theme }) => theme.colors.primary[50]};
    color: ${({ theme }) => theme.colors.primary[700]};
  }

  @media (max-width: 768px) {
    color: white;
    text-align: center;
    padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
    border-bottom: 1px solid ${({ theme }) => theme.colors.primary[400]};

    &:last-child {
      border-bottom: none;
    }

    &:hover {
      background-color: ${({ theme }) => theme.colors.primary[600]};
      color: white;
    }
  }
`;

const SecondaryButton = styled(CTAButton)`
  background-color: white;
  color: ${({ theme }) => theme.colors.primary[500]};

  &:hover {
    background-color: ${({ theme }) => theme.colors.primary[600]};
  }
`;

const Disclaimer = styled.p`
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.neutral[300]};
  margin-top: ${({ theme }) => theme.spacing.lg};
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
  line-height: 1.4;
`;

const Hero = () => {
  const router = useRouter();
  const [isOrderDropdownOpen, setIsOrderDropdownOpen] = useState(false);

  const handleOrderClick = () => {
    setIsOrderDropdownOpen(!isOrderDropdownOpen);
  };

  const handleOrderOptionClick = (url: string) => {
    setIsOrderDropdownOpen(false);
    window.open(url, '_blank');
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
          sizes="100vw"
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
            sizes="(max-width: 768px) 250px, 400px"
          />
        </LogoContainer>
        <Subtitle>
          Here to make you pop!
        </Subtitle>
        <ButtonContainer>
          <CTAButton onClick={handleOrderClick}>
            Order Now
            <DropdownArrow $isOpen={isOrderDropdownOpen} />
            {isOrderDropdownOpen && (
              <DropdownMenu>
                <DropdownItem onClick={() => handleOrderOptionClick('https://docs.google.com/forms/d/e/1FAIpQLSer1nVptxBtb3IGkv7fW2w2Qy22Y2zWoY48R2hHGnhwURdHBg/viewform?usp=dialog')}>
                  Standard Order
                </DropdownItem>
                <DropdownItem onClick={() => handleOrderOptionClick('https://docs.google.com/forms/d/e/1FAIpQLSdyt4I5Ii58i-Sn_RfrTiungQvdo18Wl9G2phaK6hhAKnFfsQ/viewform?usp=dialog')}>
                  Custom Order
                </DropdownItem>
              </DropdownMenu>
            )}
          </CTAButton>
          <SecondaryButton onClick={handleViewMenuClick}>View Menu</SecondaryButton>
        </ButtonContainer>
        <Disclaimer>
          PROCESSED AND PREPARED BY A HOME-BASED FOOD PRODUCTION OPERATION THAT IS NOT SUBJECT TO SOUTH CAROLINA'S FOOD SAFETY REGULATIONS
        </Disclaimer>
      </HeroContent>
    </HeroContainer>
  );
};

export default Hero; 