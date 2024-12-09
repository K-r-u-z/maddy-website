'use client'

import React from 'react'
import styled, { ThemeProvider, createGlobalStyle } from 'styled-components'
import { theme } from '@/styles/theme'
import Navigation from '../Navigation/Navigation'
import Footer from '../Footer/Footer'

const GlobalStyle = createGlobalStyle`
  *, *::before, *::after {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html {
    scroll-behavior: smooth;
    scroll-padding-top: 70px;
  }

  body {
    font-family: ${({ theme }) => theme.fonts.body};
    color: ${({ theme }) => theme.colors.neutral[800]};
    min-height: 100vh;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  img {
    display: block;
    max-width: 100%;
  }

  button {
    font: inherit;
  }
`

const StyledMain = styled.main`
  min-height: 100vh;
  padding-top: 70px; // Add padding to account for fixed navigation
`

interface LayoutProps {
  children: React.ReactNode
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <Navigation />
      <StyledMain>{children}</StyledMain>
      <Footer />
    </ThemeProvider>
  )
}

export default Layout 