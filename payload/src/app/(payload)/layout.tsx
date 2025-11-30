/* THIS FILE WAS GENERATED AUTOMATICALLY BY PAYLOAD. */
import type { Metadata } from 'next'

import config from '@payload-config'
import { RootLayout } from '@payloadcms/next/layouts'
import React from 'react'

import './custom.scss'

type Args = {
  children: React.ReactNode
}

export const metadata: Metadata = {
  title: 'Bounce House Rental - Admin',
  description: 'Bounce House Rental Management System',
}

const Layout = ({ children }: Args) => <RootLayout config={config}>{children}</RootLayout>

export default Layout
