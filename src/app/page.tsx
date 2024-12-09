'use client'

import React from 'react'
import Hero from '../components/Hero/Hero'
import About from '../components/About/About'
import Menu from '../components/Menu/Menu'
import HowToOrder from '../components/HowToOrder/HowToOrder'
import FAQ from '../components/FAQ/FAQ'
import Layout from '../components/Layout/Layout'

export default function Home() {
  return (
    <Layout>
      <Hero />
      <About />
      <Menu />
      <HowToOrder />
      <FAQ />
    </Layout>
  );
}
