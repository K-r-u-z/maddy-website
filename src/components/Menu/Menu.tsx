'use client'

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

const MenuGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: ${({ theme }) => theme.spacing.xl};
  margin-top: ${({ theme }) => theme.spacing['2xl']};
`;

const MenuItem = styled.div`
  background: white;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 20px rgba(0, 0, 0, 0.15);
  }
`;

const MenuImageContainer = styled.div`
  position: relative;
  width: 100%;
  height: 250px;
  overflow: hidden;

  img {
    transition: transform 0.3s ease;
  }

  &:hover img {
    transform: scale(1.05);
  }
`;

const MenuItemContent = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
`;

const MenuItemTitle = styled.h3`
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: 1.5rem;
  color: ${({ theme }) => theme.colors.primary[700]};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const MenuItemDescription = styled.p`
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.neutral[600]};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const MenuItemPrice = styled.span`
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: 1.25rem;
  color: ${({ theme }) => theme.colors.primary[500]};
  font-weight: 600;
`;

const menuItems = [
  {
    id: 1,
    title: 'Classic Vanilla',
    description: 'Vanilla cake pop flavor coming soon...',
    price: 'Price TBD',
    image: '/images/placeholder.jpg'
  },
  {
    id: 2,
    title: 'Double Chocolate',
    description: 'Chocolate cake pop flavor coming soon...',
    price: 'Price TBD',
    image: '/images/placeholder.jpg'
  },
  {
    id: 3,
    title: 'Strawberry Dream',
    description: 'Strawberry cake pop flavor coming soon...',
    price: 'Price TBD',
    image: '/images/placeholder.jpg'
  },
  {
    id: 4,
    title: 'Red Velvet',
    description: 'Red velvet cake pop flavor coming soon...',
    price: 'Price TBD',
    image: '/images/placeholder.jpg'
  },
  {
    id: 5,
    title: 'Birthday Cake',
    description: 'Funfetti cake pop flavor coming soon...',
    price: 'Price TBD',
    image: '/images/placeholder.jpg'
  },
  {
    id: 6,
    title: 'Cookies & Cream',
    description: 'Oreo cake pop flavor coming soon...',
    price: 'Price TBD',
    image: '/images/placeholder.jpg'
  }
];

const Menu = () => {
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
        <MenuGrid>
          {menuItems.map((item) => (
            <MenuItem key={item.id}>
              <MenuImageContainer>
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  style={{ objectFit: 'cover' }}
                />
              </MenuImageContainer>
              <MenuItemContent>
                <MenuItemTitle>{item.title}</MenuItemTitle>
                <MenuItemDescription>{item.description}</MenuItemDescription>
                <MenuItemPrice>{item.price}</MenuItemPrice>
              </MenuItemContent>
            </MenuItem>
          ))}
        </MenuGrid>
      </MenuContainer>
    </MenuSection>
  );
};

export default Menu; 