import styled from 'styled-components';
import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';

const Nav = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 50;
  background-color: ${({ theme }) => theme.colors.primary[100]};
  padding: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  backdrop-filter: blur(8px);
  border-bottom: 1px solid ${({ theme }) => theme.colors.primary[200]};

  @media (max-width: 768px) {
    padding: 0.5rem;
  }
`;

const Container = styled.div`
  max-width: 1200px;
  height: 50px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xl};
  padding: 0 ${({ theme }) => theme.spacing.md};

  @media (max-width: 768px) {
    gap: ${({ theme }) => theme.spacing.md};
    padding: 0 ${({ theme }) => theme.spacing.sm};
  }
`;

const Logo = styled(Link)`
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: 1.5rem;
  color: ${({ theme }) => theme.colors.primary[900]};
  text-decoration: none;
  font-weight: bold;
  transition: color 0.2s ease;
  height: 50px;
  display: flex;
  align-items: center;

  @media (max-width: 768px) {
    font-size: 1.2rem;
  }

  &:hover {
    color: ${({ theme }) => theme.colors.primary[700]};
  }
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.lg};

  @media (max-width: 768px) {
    gap: ${({ theme }) => theme.spacing.md};
  }
`;

const WelcomeText = styled.div`
  color: ${({ theme }) => theme.colors.primary[900]};
  font-weight: 500;

  @media (max-width: 768px) {
    font-size: 0.9rem;
    display: none;
  }
`;

const LogoutButton = styled.button`
  background-color: ${({ theme }) => theme.colors.primary[500]};
  color: white;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.lg};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  border: none;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
    font-size: 0.9rem;
  }

  &:hover {
    background-color: ${({ theme }) => theme.colors.primary[600]};
    transform: translateY(-1px);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.15);
  }

  &:active {
    transform: translateY(0);
  }
`;

const Navigation = () => {
  const { data: session } = useSession();
  const handleLogout = async () => {
    await signOut({ callbackUrl: '/' });
  };

  return (
    <Nav>
      <Container>
        <Logo href="/admin">Admin Dashboard</Logo>
        <RightSection>
          <WelcomeText>Welcome, {session?.user?.name}</WelcomeText>
          <LogoutButton onClick={handleLogout}>
            Logout
          </LogoutButton>
        </RightSection>
      </Container>
    </Nav>
  );
};

export default Navigation; 