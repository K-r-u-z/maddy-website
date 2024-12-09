'use client'

import { useState, useEffect } from 'react';
import styled from 'styled-components';
import Image from 'next/image';

const MenuSection = styled.section`
  padding: ${({ theme }) => theme.spacing['2xl']} 0;
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.primary[100]} 0%,
    white 25%,
    ${({ theme }) => theme.colors.primary[100]} 50%,
    white 75%,
    ${({ theme }) => theme.colors.primary[100]} 100%
  );
  min-height: 90vh;
  position: relative;
  
  &:before {
    content: '';
    position: absolute;
    top: -50px;
    left: 0;
    right: 0;
    height: 100px;
    background: linear-gradient(to bottom, transparent, ${({ theme }) => theme.colors.primary[100]});
    pointer-events: none;
  }
`;

const MenuContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.spacing.xl};
  position: relative;
  z-index: 1;
`;

const MenuHeader = styled.div`
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing['2xl']};
`;

const MenuTitle = styled.h2`
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: 3rem;
  color: ${({ theme }) => theme.colors.primary[800]};
  margin-bottom: ${({ theme }) => theme.spacing.md};

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const MenuDescription = styled.p`
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 1.25rem;
  color: ${({ theme }) => theme.colors.neutral[700]};
  max-width: 600px;
  margin: 0 auto;
`;

const MenuGrid = styled.div<{ $isSingleItem: boolean }>`
  display: grid;
  grid-template-columns: ${({ $isSingleItem }) => 
    $isSingleItem ? '1fr' : 'repeat(auto-fit, minmax(300px, 1fr))'};
  gap: ${({ theme }) => theme.spacing.xl};
  justify-content: center;
  align-items: center;
  margin: 0 auto;
  max-width: ${({ $isSingleItem }) => $isSingleItem ? '500px' : '1400px'};
  padding: ${({ theme }) => theme.spacing.xl} 0;
  
  @media (max-width: 1024px) {
    max-width: ${({ $isSingleItem }) => $isSingleItem ? '450px' : '1200px'};
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    max-width: ${({ $isSingleItem }) => $isSingleItem ? '400px' : '600px'};
  }
`;

const MenuItem = styled.div<{ $isSingleItem: boolean }>`
  display: flex;
  flex-direction: column;
  background: white;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.2s ease;
  width: 100%;
  max-width: ${({ $isSingleItem }) => $isSingleItem ? '500px' : 'none'};
  margin: ${({ $isSingleItem }) => $isSingleItem ? '0 auto' : '0'};

  &:hover {
    transform: ${({ $isSingleItem }) => 
      $isSingleItem ? 'scale(1.02)' : 'translateY(-4px)'};
  }

  @media (max-width: 1024px) {
    max-width: ${({ $isSingleItem }) => $isSingleItem ? '450px' : 'none'};
  }

  @media (max-width: 768px) {
    max-width: ${({ $isSingleItem }) => $isSingleItem ? '400px' : 'none'};
  }
`;

const MenuImageContainer = styled.div<{ $isSingleItem: boolean }>`
  position: relative;
  width: 100%;
  padding-top: ${({ $isSingleItem }) => $isSingleItem ? '80%' : '60%'};
`;

const StyledImage = styled(Image)`
  object-fit: cover;
`;

const MenuItemContent = styled.div<{ $isSingleItem: boolean }>`
  padding: ${({ theme }) => theme.spacing.xl};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};

  @media (max-width: 768px) {
    padding: ${({ theme }) => theme.spacing.lg};
    gap: ${({ theme }) => theme.spacing.sm};
  }
`;

const MenuItemTitle = styled.h3<{ $isSingleItem: boolean }>`
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: ${({ $isSingleItem }) => $isSingleItem ? '1.75rem' : '1.5rem'};
  color: ${({ theme }) => theme.colors.primary[700]};
  margin: 0;

  @media (max-width: 768px) {
    font-size: ${({ $isSingleItem }) => $isSingleItem ? '1.5rem' : '1.25rem'};
  }
`;

const MenuItemDescription = styled.p<{ $isSingleItem: boolean }>`
  color: ${({ theme }) => theme.colors.neutral[600]};
  font-size: ${({ $isSingleItem }) => $isSingleItem ? '1.1rem' : '1rem'};
  line-height: 1.6;
  margin: 0;
  flex: 1;

  @media (max-width: 768px) {
    font-size: 1rem;
    line-height: 1.5;
  }
`;

const MenuItemPrice = styled.p<{ $isSingleItem: boolean }>`
  color: ${({ theme }) => theme.colors.primary[500]};
  font-size: ${({ $isSingleItem }) => $isSingleItem ? '1.5rem' : '1.25rem'};
  font-weight: 600;
  margin: 0;
  margin-top: auto;

  @media (max-width: 768px) {
    font-size: ${({ $isSingleItem }) => $isSingleItem ? '1.25rem' : '1.1rem'};
  }
`;

const LoadingPlaceholder = styled.div`
  min-height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.primary[500]};
  font-size: 1.2rem;
`;

const SoldOutOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
`;

const SoldOutText = styled.span`
  background: ${({ theme }) => theme.colors.neutral[900]};
  color: white;
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.lg}`};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-weight: bold;
  font-size: 1.2rem;
  transform: rotate(-15deg);
`;

interface MenuItem {
  _id: string;
  title: string;
  description: string;
  price: string;
  image: string;
  isVisible: boolean;
  isSoldOut: boolean;
}

const Menu = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await fetch('/api/public/menu');
        if (!response.ok) throw new Error('Failed to fetch menu items');
        const data = await response.json();
        const visibleItems = data.filter((item: MenuItem) => item.isVisible);
        setMenuItems(visibleItems);
      } catch (error) {
        console.error('Error fetching menu items:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMenuItems();
  }, []);

  const formatPrice = (price: string) => {
    const cleanPrice = price.replace('$', '').trim();
    return cleanPrice.startsWith('$') ? cleanPrice : `$${cleanPrice}`;
  };

  if (loading) {
    return (
      <MenuSection id="menu">
        <MenuContainer>
          <MenuHeader>
            <MenuTitle>Our Menu</MenuTitle>
            <MenuDescription>
              Each cake pop is handcrafted with love and attention to detail. 
              Custom orders and designs are available upon request.
            </MenuDescription>
          </MenuHeader>
          <LoadingPlaceholder>Loading menu items...</LoadingPlaceholder>
        </MenuContainer>
      </MenuSection>
    );
  }

  const isSingleItem = menuItems.length === 1;

  return (
    <MenuSection id="menu">
      <MenuContainer>
        <MenuHeader>
          <MenuTitle>Our Menu</MenuTitle>
          <MenuDescription>
            Each cake pop is handcrafted with love and attention to detail. 
            Custom orders and designs are available upon request.
          </MenuDescription>
        </MenuHeader>
        <MenuGrid $isSingleItem={isSingleItem}>
          {menuItems.map((item) => (
            <MenuItem key={item._id} $isSingleItem={isSingleItem}>
              <MenuImageContainer $isSingleItem={isSingleItem}>
                <StyledImage
                  src={item.image || '/images/placeholder.jpg'}
                  alt={item.title}
                  fill
                  sizes={isSingleItem ? '500px' : '300px'}
                  priority={isSingleItem}
                  style={{ 
                    objectFit: 'cover',
                    opacity: item.isSoldOut ? 0.7 : 1 
                  }}
                />
                {item.isSoldOut && (
                  <SoldOutOverlay>
                    <SoldOutText>Sold Out</SoldOutText>
                  </SoldOutOverlay>
                )}
              </MenuImageContainer>
              <MenuItemContent $isSingleItem={isSingleItem}>
                <MenuItemTitle $isSingleItem={isSingleItem}>{item.title}</MenuItemTitle>
                <MenuItemDescription $isSingleItem={isSingleItem}>{item.description}</MenuItemDescription>
                <MenuItemPrice $isSingleItem={isSingleItem}>{formatPrice(item.price)}</MenuItemPrice>
              </MenuItemContent>
            </MenuItem>
          ))}
        </MenuGrid>
      </MenuContainer>
    </MenuSection>
  );
};

export default Menu; 