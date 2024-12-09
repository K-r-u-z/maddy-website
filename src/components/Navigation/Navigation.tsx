'use client'

import { useState, useEffect } from 'react'
import styled from 'styled-components'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter, usePathname } from 'next/navigation'

interface MobileMenuProps {
  $isOpen: boolean;
}

interface NavLinkProps {
  $isActive?: boolean;
}

const MOBILE_BREAKPOINT = '1024px';

const Nav = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 50;
  background-color: ${({ theme }) => theme.colors.primary[100]};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing['2xl']};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  backdrop-filter: blur(8px);
  border-bottom: 1px solid ${({ theme }) => theme.colors.primary[200]};

  @media (max-width: ${MOBILE_BREAKPOINT}) {
    padding: ${({ theme }) => theme.spacing.md};
    background: linear-gradient(
      to right,
      ${({ theme }) => theme.colors.primary[100]},
      ${({ theme }) => theme.colors.primary[50]},
      ${({ theme }) => theme.colors.primary[100]}
    );
  }
`;

const NavContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xl};
  padding: 0 ${({ theme }) => theme.spacing.md};

  @media (max-width: ${MOBILE_BREAKPOINT}) {
    padding: 0;
  }
`;

const Logo = styled.div`
  width: 50px;
  height: 50px;
  position: relative;
  cursor: pointer;
  transition: transform 0.2s ease;
  z-index: 60;

  &:hover {
    transform: scale(1.05);
  }

  @media (max-width: 768px) {
    width: 40px;
    height: 40px;
  }
`;

const DesktopNav = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.xl};
  align-items: center;
  margin: 0 auto;

  @media (max-width: ${MOBILE_BREAKPOINT}) {
    display: none;
  }
`;

const MobileNav = styled.div<MobileMenuProps>`
  display: none;
  
  @media (max-width: ${MOBILE_BREAKPOINT}) {
    display: block;
    position: fixed;
    inset: 0;
    top: 0;
    width: 100%;
    height: 100vh;
    background-color: rgba(255, 255, 255, 0.8);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    opacity: ${({ $isOpen }) => ($isOpen ? '1' : '0')};
    visibility: ${({ $isOpen }) => ($isOpen ? 'visible' : 'hidden')};
    transition: all 0.3s ease;
    z-index: 90;
  }
`;

const MobileNavContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  width: 100%;
  padding: ${({ theme }) => theme.spacing.xl};
  padding-top: 0;
  padding-bottom: 0;
  gap: ${({ theme }) => theme.spacing.lg};
  margin-top: -40px;
`;

const NavLink = styled.a<NavLinkProps>`
  font-family: ${({ theme }) => theme.fonts.body};
  color: ${({ theme }) => theme.colors.primary[900]};
  text-decoration: none;
  transition: all 0.2s ease;
  font-weight: 500;
  position: relative;

  &:after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    width: 0;
    height: 2px;
    background-color: ${({ theme }) => theme.colors.primary[600]};
    transition: width 0.2s ease;
  }

  &:hover {
    color: ${({ theme }) => theme.colors.primary[700]};
  }

  &:hover:after {
    width: 100%;
  }

  @media (max-width: ${MOBILE_BREAKPOINT}) {
    font-size: 2rem;
    padding: ${({ theme }) => theme.spacing.sm} 0;
    font-weight: 500;
    color: ${({ $isActive, theme }) => 
      $isActive ? theme.colors.secondary[500] : theme.colors.primary[800]};
    width: 100%;
    text-align: center;
    font-family: ${({ theme }) => theme.fonts.heading};
    position: relative;
    
    &:after {
      content: '';
      position: absolute;
      bottom: 4px;
      left: 50%;
      transform: translateX(-50%);
      width: ${({ $isActive }) => ($isActive ? '100px' : '50px')};
      height: 2px;
      background-color: ${({ $isActive, theme }) => 
        $isActive ? theme.colors.secondary[500] : theme.colors.primary[800]};
    }
  }
`;

const OrderButton = styled.button`
  background-color: ${({ theme }) => theme.colors.primary[500]};
  color: white;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.lg};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  border: none;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  &:hover {
    background-color: ${({ theme }) => theme.colors.primary[600]};
    transform: translateY(-1px);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.15);
  }

  @media (max-width: ${MOBILE_BREAKPOINT}) {
    display: none;
  }
`;

const MenuButton = styled.button<MobileMenuProps>`
  display: none;
  
  @media (max-width: ${MOBILE_BREAKPOINT}) {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 24px;
    height: 20px;
    position: fixed;
    top: 25px;
    right: 20px;
    background: none;
    border: none;
    cursor: pointer;
    z-index: 100;
    padding: 0;
    margin-right: ${({ theme }) => theme.spacing.md};

    span {
      width: 100%;
      height: 2px;
      background-color: ${({ theme, $isOpen }) => 
        $isOpen ? theme.colors.primary[700] : theme.colors.primary[900]};
      transition: transform 0.3s ease, opacity 0.3s ease, background-color 0.3s ease;
      transform-origin: center;
      display: block;

      &:first-child {
        transform: ${({ $isOpen }) =>
          $isOpen ? 'translateY(9px) rotate(45deg)' : 'none'};
      }

      &:nth-child(2) {
        opacity: ${({ $isOpen }) => ($isOpen ? 0 : 1)};
      }

      &:last-child {
        transform: ${({ $isOpen }) =>
          $isOpen ? 'translateY(-9px) rotate(-45deg)' : 'none'};
      }
    }
  }
`;

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const router = useRouter();
  const pathname = usePathname();
  const isHomePage = pathname === '/';

  useEffect(() => {
    if (isHomePage) {
      const handleScroll = () => {
        const sections = ['home', 'about', 'menu', 'how-to-order', 'faq'];
        const currentSection = sections.find(section => {
          const element = document.getElementById(section);
          if (element) {
            const rect = element.getBoundingClientRect();
            return rect.top <= 100 && rect.bottom >= 100;
          }
          return false;
        });
        if (currentSection) {
          setActiveSection(currentSection);
        }
      };

      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, [isHomePage]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setIsOpen(false);

    if (href.startsWith('#')) {
      // If it's a hash link and we're not on the home page, go home first
      if (!isHomePage) {
        router.push('/');
        // Wait for navigation to complete before scrolling
        setTimeout(() => {
          const element = document.getElementById(href.substring(1));
          element?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      } else {
        // If we're already home, just scroll
        const element = document.getElementById(href.substring(1));
        element?.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // For non-hash links (like /contact), use regular navigation
      router.push(href);
    }
  };

  const handleOrderClick = () => {
    window.open('https://forms.office.com/Pages/ResponsePage.aspx?id=JUduhRIIxEabGTNNLgMYdOiXhLZCYHBOrwOKyP9fOqhUOVZTRkpPRVZDNzk2RjRJNVlTRkhQS1JCTy4u', '_blank');
  };

  const navLinks = (
    <>
      <NavLink 
        href="#home" 
        onClick={(e) => handleLinkClick(e, '#home')} 
        $isActive={isHomePage && activeSection === 'home'}
      >
        Home
      </NavLink>
      <NavLink 
        href="#about" 
        onClick={(e) => handleLinkClick(e, '#about')} 
        $isActive={isHomePage && activeSection === 'about'}
      >
        About
      </NavLink>
      <NavLink 
        href="#menu" 
        onClick={(e) => handleLinkClick(e, '#menu')} 
        $isActive={isHomePage && activeSection === 'menu'}
      >
        Menu
      </NavLink>
      <NavLink 
        href="#how-to-order" 
        onClick={(e) => handleLinkClick(e, '#how-to-order')} 
        $isActive={isHomePage && activeSection === 'how-to-order'}
      >
        How to Order
      </NavLink>
      <NavLink 
        href="#faq" 
        onClick={(e) => handleLinkClick(e, '#faq')} 
        $isActive={isHomePage && activeSection === 'faq'}
      >
        FAQ
      </NavLink>
      <NavLink 
        href="https://forms.office.com/Pages/ResponsePage.aspx?id=JUduhRIIxEabGTNNLgMYdOiXhLZCYHBOrwOKyP9fOqhUOVZTRkpPRVZDNzk2RjRJNVlTRkhQS1JCTy4u"
        onClick={(e) => {
          e.preventDefault();
          window.open(e.currentTarget.href, '_blank');
          setIsOpen(false);
        }}
        target="_blank"
        rel="noopener noreferrer"
      >
        Custom Order Form
      </NavLink>
      <NavLink 
        href="/contact" 
        onClick={(e) => handleLinkClick(e, '/contact')} 
        $isActive={pathname === '/contact'}
      >
        Contact
      </NavLink>
    </>
  );

  return (
    <Nav>
      <NavContainer>
        <Logo>
          <Image
            src="/images/logo.png"
            alt="Cake Pops by Maddy Logo"
            fill
            style={{ objectFit: 'contain' }}
          />
        </Logo>
        <DesktopNav>
          {navLinks}
          <OrderButton onClick={handleOrderClick}>Order Now</OrderButton>
        </DesktopNav>
        <MenuButton $isOpen={isOpen} onClick={() => setIsOpen(!isOpen)}>
          <span />
          <span />
          <span />
        </MenuButton>
      </NavContainer>
      <MobileNav $isOpen={isOpen}>
        <MobileNavContent>
          {navLinks}
        </MobileNavContent>
      </MobileNav>
    </Nav>
  );
};

export default Navigation; 