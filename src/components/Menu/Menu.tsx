'use client'

import { useState, useEffect } from 'react';
import styled, { css } from 'styled-components';
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

const MenuItem = styled.div<{ $hasImage: boolean }>`
  background: white;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;
  display: flex;
  flex-direction: ${({ $hasImage }) => $hasImage ? 'column' : 'row'};
  height: 100%;

  &:hover {
    transform: translateY(-4px);
  }

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const MenuImageContainer = styled.div<{ $hasImage: boolean }>`
  position: relative;
  width: 100%;
  padding-top: ${({ $hasImage }) => $hasImage ? '75%' : '0'};
  flex-shrink: 0;
`;

const StyledImage = styled(Image)`
  object-fit: cover;
`;

const MenuItemContent = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const MenuItemTitle = styled.h3<{ $isSingleItem: boolean }>`
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: ${({ $isSingleItem }) => $isSingleItem ? '1.75rem' : '1.5rem'};
  color: ${({ theme }) => theme.colors.primary[700]};
  margin: 0;
  margin-bottom: ${({ theme }) => theme.spacing.md};

  @media (max-width: 768px) {
    font-size: ${({ $isSingleItem }) => $isSingleItem ? '1.5rem' : '1.25rem'};
  }
`;

const MenuItemDescription = styled.p<{ $isSingleItem: boolean }>`
  color: ${({ theme }) => theme.colors.neutral[600]};
  font-size: ${({ $isSingleItem }) => $isSingleItem ? '1.1rem' : '1rem'};
  line-height: 1.6;
  margin: 0;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  flex: 1;

  @media (max-width: 768px) {
    font-size: 1rem;
    line-height: 1.5;
  }
`;

const PriceContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
`;

const Price = styled.span`
  font-weight: bold;
  color: ${({ theme }) => theme.colors.primary[700]};
  font-size: 1.5rem;
`;

const QuantitySelect = styled.select`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border: 2px solid ${({ theme }) => theme.colors.primary[200]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background-color: white;
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.primary[700]};
  cursor: pointer;
  min-width: 80px;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary[300]};
  }

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary[400]};
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.primary[100]};
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

interface PriceQuantityPair {
  price: string;
  quantity: string;
}

interface MenuItem {
  _id: string;
  title: string;
  description: string;
  priceQuantities?: PriceQuantityPair[];
  price?: string;
  quantity?: string;
  image: string;
  isVisible: boolean;
  isSoldOut: boolean;
  showPrice: boolean;
}

const Menu = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [selectedPriceIndices, setSelectedPriceIndices] = useState<{ [key: string]: number }>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await fetch('/api/public/menu');
        const data = await response.json();
        console.log('Fetched menu items:', data);
        setMenuItems(data);
      } catch (error) {
        console.error('Error fetching menu items:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMenuItems();
  }, []);

  const formatPrice = (price: string) => {
    const cleanPrice = price.replace('$', '').trim();
    return cleanPrice.startsWith('$') ? cleanPrice : `$${cleanPrice}`;
  };

  const handlePriceOptionChange = (itemId: string, index: number) => {
    setSelectedPriceIndices(prev => ({
      ...prev,
      [itemId]: index
    }));
  };

  if (isLoading) {
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

  console.log('Rendering menu items:', menuItems);

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
          {menuItems.map((item) => {
            const priceQuantities = item.priceQuantities?.length ? item.priceQuantities : [{
              price: item.price || '0',
              quantity: item.quantity || '1'
            }];
            
            const selectedPriceIndex = selectedPriceIndices[item._id] || 0;
            const selectedPriceQuantity = priceQuantities[selectedPriceIndex];
            const basePrice = parseFloat(priceQuantities[0].price.replace('$', ''));
            const currentPrice = basePrice * (parseInt(selectedPriceQuantity.quantity) / parseInt(priceQuantities[0].quantity));

            return (
              <MenuItem key={item._id} $hasImage={!!item.image}>
                {item.image && (
                  <MenuImageContainer $hasImage={true}>
                    <Image
                      src={item.image}
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
                )}
                <MenuItemContent>
                  <MenuItemTitle $isSingleItem={isSingleItem}>{item.title}</MenuItemTitle>
                  <MenuItemDescription $isSingleItem={isSingleItem}>
                    {item.description}
                  </MenuItemDescription>
                  {item.showPrice && (
                    <PriceContainer>
                      <Price>{formatPrice(currentPrice.toFixed(2))}</Price>
                      {priceQuantities.length > 0 && (
                        <QuantitySelect
                          value={selectedPriceIndex}
                          onChange={(e) => handlePriceOptionChange(item._id, parseInt(e.target.value))}
                          disabled={item.isSoldOut}
                        >
                          {priceQuantities.map((pq, index) => (
                            <option key={index} value={index}>
                              {pq.quantity} count
                            </option>
                          ))}
                        </QuantitySelect>
                      )}
                    </PriceContainer>
                  )}
                  {item.isSoldOut && !item.image && (
                    <SoldOutText style={{ marginTop: '0.5rem', fontSize: '0.875rem' }}>
                      Sold Out
                    </SoldOutText>
                  )}
                </MenuItemContent>
              </MenuItem>
            );
          })}
        </MenuGrid>
      </MenuContainer>
    </MenuSection>
  );
};

export default Menu; 