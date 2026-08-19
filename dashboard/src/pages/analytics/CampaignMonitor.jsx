import React, { useState, useEffect, useMemo, useRef } from 'react'
import { createPortal } from 'react-dom'
import { Link, useLocation } from 'react-router-dom'
import { useAnalyticsStore } from '../../context/AnalyticsStore'
import { useCRMStore } from '../../context/CRMStore'
import { supabase } from '../../lib/superbaseClient'
import { generateExecutivePDF, generateExecutiveExcel } from '../../utils/executiveReportExporter'
import UniversalPagination from '../../components/common/UniversalPagination'
import PredictiveSelect from '../../components/common/PredictiveSelect'
import ActionTooltip from '../../components/common/ActionTooltip'
import {
  Megaphone, Plus, Share2, Copy, Check, QrCode, Download, ExternalLink,
  Search, Filter, TrendingUp, Users, MessageSquare, Zap, Eye, Globe,
  MapPin, Layers, Award, Sparkles, X, Play, Pause, BarChart2, MousePointer,
  Video, PhoneCall, Building2, ShoppingCart, Tag, Edit3, Trash2, AlertTriangle,
  Car, Sliders, ShieldCheck, CheckCircle2, ChevronRight
} from 'lucide-react'

// Authentic Brand Logo SVG Components
const FacebookLogo = () => (
  <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24">
    <path fill="#1877F2" d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
)

const InstagramLogo = () => (
  <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24">
    <radialGradient id="ig-grad-cm" cx="30%" cy="107%" r="130%">
      <stop offset="0%" stopColor="#fdf497" />
      <stop offset="5%" stopColor="#fdf497" />
      <stop offset="45%" stopColor="#fd5949" />
      <stop offset="60%" stopColor="#d6249f" />
      <stop offset="90%" stopColor="#285AEB" />
    </radialGradient>
    <path fill="url(#ig-grad-cm)" d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
)

const WhatsAppLogo = () => (
  <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24">
    <path fill="#25D366" d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z"/>
  </svg>
)

const GoogleAdsLogo = () => (
  <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
  </svg>
)

const TikTokLogo = () => (
  <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24">
    <path fill="#00F2FE" d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 11-2.89-2.89c.32 0 .63.05.93.15V9.45a6.34 6.34 0 00-.93-.07 6.34 6.34 0 106.34 6.34V9.28a8.16 8.16 0 004.77 1.52V7.35a4.85 4.85 0 01-1.00-.66z" />
  </svg>
)

const YouTubeLogo = () => (
  <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24">
    <path fill="#FF0000" d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
)

const LinkedInLogo = () => (
  <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24">
    <path fill="#0A66C2" d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.25V10.9H6.46M7.86 6.77a1.62 1.62 0 1 0 0 3.24 1.62 1.62 0 0 0 0-3.24z"/>
  </svg>
)

// Base Fallback Product Catalog for link generator
const PRODUCT_CATALOG = [
  { id: '37', name: '2019 LANDCRUISER PRADO KAKADU', price: 'KES 9,799,999', category: 'SUV', image: 'https://images.unsplash.com/photo-1594502184342-2e12f877aa73?auto=format&fit=crop&w=400&q=80' },
  { id: 'v-102', name: 'Range Rover Vogue P530 First Edition', price: 'KES 38,000,000', category: 'Luxury SUV', image: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=400&q=80' },
  { id: 'v-103', name: 'Mercedes-Benz G63 AMG (2024)', price: 'KES 32,500,000', category: 'Luxury SUV', image: 'https://images.unsplash.com/photo-1520050206274-a1ae44613e6d?auto=format&fit=crop&w=400&q=80' },
  { id: 'v-104', name: 'Porsche 911 Carrera S (2024)', price: 'KES 24,000,000', category: 'Sports Coupe', image: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=400&q=80' },
  { id: 'v-105', name: 'BMW X7 M60i V8 Twin-Turbo', price: 'KES 26,500,000', category: 'SUV', image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=400&q=80' }
]

// 13 Comprehensive Digital Ad Platform Presets with Authentic Brand Icons
const PLATFORM_PRESETS = [
  { id: 'facebook', name: 'Facebook Paid Ads', utm_source: 'facebook', utm_medium: 'paid_cpc', color: 'text-blue-500 bg-blue-500/10 border-blue-500/30', icon: FacebookLogo, tag: 'Paid Ad' },
  { id: 'instagram_paid', name: 'Instagram Paid Ads', utm_source: 'instagram', utm_medium: 'paid_cpc', color: 'text-pink-500 bg-pink-500/10 border-pink-500/30', icon: InstagramLogo, tag: 'Paid Ad' },
  { id: 'whatsapp', name: 'WhatsApp Campaign', utm_source: 'whatsapp', utm_medium: 'status_story', color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/30', icon: WhatsAppLogo, tag: 'Organic/Chat' },
  { id: 'email', name: 'Email Newsletter', utm_source: 'email', utm_medium: 'newsletter', color: 'text-indigo-500 bg-indigo-500/10 border-indigo-500/30', icon: Sparkles, tag: 'Direct Outreach' },
  { id: 'google', name: 'Google Ads PPC', utm_source: 'google', utm_medium: 'paid_search', color: 'text-amber-500 bg-amber-500/10 border-amber-500/30', icon: GoogleAdsLogo, tag: 'Paid Search' },
  { id: 'tiktok', name: 'TikTok / Social', utm_source: 'tiktok', utm_medium: 'influencer_post', color: 'text-rose-500 bg-rose-500/10 border-rose-500/30', icon: TikTokLogo, tag: 'Influencer' },
  { id: 'classifieds', name: 'Classified Portals (Jiji/Cheki)', utm_source: 'classifieds', utm_medium: 'marketplace_listing', color: 'text-purple-500 bg-purple-500/10 border-purple-500/30', icon: ShoppingCart, tag: 'Free/Paid Portal' },
  { id: 'youtube', name: 'YouTube Video & Shorts', utm_source: 'youtube', utm_medium: 'video_description', color: 'text-red-500 bg-red-500/10 border-red-500/30', icon: YouTubeLogo, tag: 'Video Walkthrough' },
  { id: 'instagram', name: 'Instagram Reels & Bio', utm_source: 'instagram', utm_medium: 'reels_bio', color: 'text-pink-500 bg-pink-500/10 border-pink-500/30', icon: InstagramLogo, tag: 'Social Media' },
  { id: 'sms', name: 'SMS Bulk Outreach', utm_source: 'sms_outreach', utm_medium: 'bulk_sms', color: 'text-cyan-500 bg-cyan-500/10 border-cyan-500/30', icon: PhoneCall, tag: 'Direct Mobile' },
  { id: 'qr', name: 'Showroom QR Code', utm_source: 'showroom_qr', utm_medium: 'print_sticker', color: 'text-teal-500 bg-teal-500/10 border-teal-500/30', icon: QrCode, tag: 'Offline Print' },
  { id: 'gmb', name: 'Google Maps / Local SEO', utm_source: 'google_maps', utm_medium: 'gmb_product', color: 'text-sky-500 bg-sky-500/10 border-sky-500/30', icon: MapPin, tag: 'Free Local SEO' },
  { id: 'linkedin', name: 'LinkedIn Executive B2B', utm_source: 'linkedin', utm_medium: 'b2b_post', color: 'text-[#0a66c2] bg-[#0a66c2]/10 border-[#0a66c2]/30', icon: LinkedInLogo, tag: 'Corporate B2B' }
]

export default function CampaignMonitor() {
  const location = useLocation()
  const campaigns = useAnalyticsStore(state => state.campaigns)
  const campaignClicks = useAnalyticsStore(state => state.campaignClicks)
  const createCampaign = useAnalyticsStore(state => state.createCampaign)
  const updateCampaign = useAnalyticsStore(state => state.updateCampaign)
  const deleteCampaign = useAnalyticsStore(state => state.deleteCampaign)
  const toggleCampaignStatus = useAnalyticsStore(state => state.toggleCampaignStatus)
  const leads = useCRMStore(state => state.leads)
  const crmCampaigns = useCRMStore(state => state.campaigns) || []
  const adminTheme = useCRMStore(state => state.adminTheme)
  const isLight = adminTheme === 'light'

  // Dynamic Environment URL Resolver (Prevents broken localhost links in production/mobile)
  const resolveTargetUrl = (targetUrl, vehicleId, utmSource, utmMedium, utmCampaign, campId) => {
    const currentOrigin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5173'
    
    if (targetUrl && typeof targetUrl === 'string') {
      if (targetUrl.startsWith('http://localhost:5173')) {
        return targetUrl.replace('http://localhost:5173', currentOrigin)
      }
      if (targetUrl.startsWith('http')) {
        return targetUrl
      }
      if (targetUrl.startsWith('/')) {
        return `${currentOrigin}${targetUrl}`
      }
    }

    const vId = vehicleId || '37'
    const src = utmSource || 'campaign'
    const med = utmMedium || 'cpc'
    const cmp = utmCampaign || 'promo'
    const id = campId || 'cmp-1'
    return `${currentOrigin}/vehicle/${vId}?utm_source=${src}&utm_medium=${med}&utm_campaign=${cmp}&camp_id=${id}`
  }

  // Supabase Inventory list
  const [dbVehicles, setDbVehicles] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [copiedId, setCopiedId] = useState(null)
  const [qrModalCampaign, setQrModalCampaign] = useState(null)

  // Edit & Delete modal states
  const [editingCampaign, setEditingCampaign] = useState(null)
  const [deletingCampaign, setDeletingCampaign] = useState(null)
  const [editFormData, setEditFormData] = useState({ name: '', budget: '', platform: '', vehicleId: '' })

  // ROI Intelligence Modal State
  const [isRoiModalOpen, setIsRoiModalOpen] = useState(false)
  const [simBudget, setSimBudget] = useState('25000')
  const [simMargin, setSimMargin] = useState('600000')

  // AI Planner & Multi-Touch Attribution Modal States
  const [isPlannerModalOpen, setIsPlannerModalOpen] = useState(false)
  const [isAttributionModalOpen, setIsAttributionModalOpen] = useState(false)
  const [targetSalesUnits, setTargetSalesUnits] = useState('3')

  const touchpointJourneys = useAnalyticsStore(state => state.touchpointJourneys) || []

  // Store Subscriptions for Perfection Suite
  const reallocateCampaignBudget = useCRMStore(state => state.reallocateCampaignBudget)
  const launchOmnichannelCampaign = useCRMStore(state => state.launchOmnichannelCampaign)
  const addAttributionCampaign = useAnalyticsStore(state => state.addAttributionCampaign)
  const crmState = useCRMStore()
  const analyticsState = useAnalyticsStore()

  // AI Optimizer & Wizard States
  const [aiBudgetShiftApplied, setAiBudgetShiftApplied] = useState(false)
  const [showAiBanner, setShowAiBanner] = useState(true)

  // 1-Click Omnichannel Campaign Launcher Wizard State
  const [showLauncherWizard, setShowLauncherWizard] = useState(false)
  const [wizardStep, setWizardStep] = useState(1)
  const [wizardForm, setWizardForm] = useState({
    name: 'Q4 Luxury SUV Omnichannel Blitz',
    vehicle_id: '37',
    budget: 500000,
    start_date: new Date().toISOString().split('T')[0],
    end_date: '2026-12-31',
    description: 'Automated omnichannel campaign across Meta, WhatsApp, Email, & Showroom QR.',
    channels: ['Meta Paid Ads', 'WhatsApp Campaign', 'Email Broadcast', 'Showroom QR']
  })

  // Multi-Touch Prospect Journey Timeline Modal State
  const [selectedJourneyModal, setSelectedJourneyModal] = useState(null)

  const handleApplyAiShift = () => {
    reallocateCampaignBudget('camp-sms-106', 'camp-meta-101', 50000)
    setAiBudgetShiftApplied(true)
  }

  const handleWizardSubmit = (e) => {
    e.preventDefault()
    const selectedVeh = availableVehicles.find(v => String(v.id) === String(wizardForm.vehicle_id)) || availableVehicles[0]

    launchOmnichannelCampaign({
      ...wizardForm,
      vehicle_name: selectedVeh?.name
    })

    addAttributionCampaign({
      name: wizardForm.name,
      vehicle_id: wizardForm.vehicle_id,
      vehicle_name: selectedVeh?.name,
      budget: wizardForm.budget,
      channels: wizardForm.channels
    })

    setShowLauncherWizard(false)
    setWizardStep(1)
  }

  const handleExportPDF = () => {
    generateExecutivePDF('attribution', crmState, analyticsState, location.pathname)
  }

  const handleExportCSV = () => {
    generateExecutiveExcel('attribution', crmState, analyticsState, location.pathname)
  }

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedPlatform, setSelectedPlatform] = useState('All')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  // Auto-refresh polling effect for instant live updates without browser refresh (30s)
  useEffect(() => {
    const initAnalytics = useAnalyticsStore.getState().initAnalytics
    initAnalytics()
    const timer = setInterval(() => {
      initAnalytics()
    }, 30000)
    return () => clearInterval(timer)
  }, [])

  // Handle URL Sub-menu Tabs for all 12 ad channels
  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const tab = params.get('tab')
    setCurrentPage(1)
    if (tab === 'planner') {
      setIsPlannerModalOpen(true)
    } else if (tab === 'attribution') {
      setIsAttributionModalOpen(true)
    } else if (tab === 'roi') {
      setIsRoiModalOpen(true)
    } else if (tab === 'links') {
      setIsModalOpen(prev => prev ? prev : true)
    } else if (tab === 'meta' || tab === 'facebook') {
      setSelectedPlatform(prev => prev === 'Facebook' ? prev : 'Facebook')
    } else if (tab === 'instagram_paid') {
      setSelectedPlatform(prev => prev === 'Instagram Paid' ? prev : 'Instagram Paid')
    } else if (tab === 'whatsapp') {
      setSelectedPlatform(prev => prev === 'WhatsApp' ? prev : 'WhatsApp')
    } else if (tab === 'email') {
      setSelectedPlatform(prev => prev === 'Email' ? prev : 'Email')
    } else if (tab === 'google') {
      setSelectedPlatform(prev => prev === 'Google' ? prev : 'Google')
    } else if (tab === 'tiktok') {
      setSelectedPlatform(prev => prev === 'TikTok' ? prev : 'TikTok')
    } else if (tab === 'classifieds') {
      setSelectedPlatform(prev => prev === 'Classified' ? prev : 'Classified')
    } else if (tab === 'youtube') {
      setSelectedPlatform(prev => prev === 'YouTube' ? prev : 'YouTube')
    } else if (tab === 'instagram') {
      setSelectedPlatform(prev => prev === 'Instagram' ? prev : 'Instagram')
    } else if (tab === 'sms') {
      setSelectedPlatform(prev => prev === 'SMS' ? prev : 'SMS')
    } else if (tab === 'qr') {
      setQrModalCampaign(prev => prev ? prev : (campaigns[0] || null))
    } else if (tab === 'gmb') {
      setSelectedPlatform(prev => prev === 'Google Maps' ? prev : 'Google Maps')
    } else if (tab === 'linkedin') {
      setSelectedPlatform(prev => prev === 'LinkedIn' ? prev : 'LinkedIn')
    }
  }, [location.search, campaigns])

  // Link Generator Modal Form State
  const [formVehicleId, setFormVehicleId] = useState('37')
  const [formPlatform, setFormPlatform] = useState('meta')
  const [formCrmCampaignId, setFormCrmCampaignId] = useState('camp-1')
  const [formCampaignName, setFormCampaignName] = useState('')
  const [formBudget, setFormBudget] = useState('25000')

  // Predictive Dropdown State
  const [vehicleSearchQuery, setVehicleSearchQuery] = useState('')
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  // Canvas ref for QR Code generation
  const qrCanvasRef = useRef(null)

  // Fetch Supabase vehicles
  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const { data, error } = await supabase.from('car_listings').select('*').limit(20)
        if (!error && Array.isArray(data) && data.length > 0) {
          setDbVehicles(data)
        }
      } catch (e) {
        console.error('Campaign inventory fetch error:', e)
      }
    }
    fetchVehicles()
  }, [])

  // Resolve Full Catalog
  const availableVehicles = useMemo(() => {
    if (dbVehicles.length > 0) {
      return dbVehicles.map(v => ({
        id: String(v.id),
        name: v.listing_title || `${v.make} ${v.model}`,
        price: v.price ? `KES ${Number(v.price).toLocaleString()}` : 'KES 15,000,000',
        category: v.body_type || 'SUV',
        image: (Array.isArray(v.images) && v.images[0])
          ? (typeof v.images[0] === 'string' ? v.images[0] : v.images[0].url)
          : 'https://images.unsplash.com/photo-1594502184342-2e12f877aa73?auto=format&fit=crop&w=400&q=80'
      }))
    }
    return PRODUCT_CATALOG
  }, [dbVehicles])

  // Selected vehicle resolved object
  const selectedVehicleObj = useMemo(() => {
    return availableVehicles.find(v => String(v.id) === String(formVehicleId)) || availableVehicles[0]
  }, [availableVehicles, formVehicleId])

  // Predictive filtered vehicles list
  const predictiveVehiclesList = useMemo(() => {
    if (!vehicleSearchQuery.trim()) return availableVehicles
    const q = vehicleSearchQuery.toLowerCase()
    return availableVehicles.filter(v =>
      v.name.toLowerCase().includes(q) ||
      v.category.toLowerCase().includes(q) ||
      v.price.toLowerCase().includes(q)
    )
  }, [availableVehicles, vehicleSearchQuery])

  // Filtered Campaigns
  const filteredCampaigns = useMemo(() => {
    return campaigns.filter(c => {
      const vName = c.vehicleName || c.vehicle_name || ''
      const cName = c.name || ''
      const sTerm = searchTerm.toLowerCase()
      const matchesSearch = cName.toLowerCase().includes(sTerm) || vName.toLowerCase().includes(sTerm)

      const cPlatform = (c.platform || '').toLowerCase()
      const selPlatform = selectedPlatform.toLowerCase()

      const matchesPlatform = selectedPlatform === 'All' ||
        cPlatform.includes(selPlatform) ||
        (selPlatform.includes('facebook') && (cPlatform.includes('meta') || cPlatform.includes('facebook'))) ||
        (selPlatform.includes('meta') && (cPlatform.includes('meta') || cPlatform.includes('facebook'))) ||
        (Array.isArray(c.channels) && c.channels.some(ch => ch.toLowerCase().includes(selPlatform)))

      return matchesSearch && matchesPlatform
    })
  }, [campaigns, searchTerm, selectedPlatform])

  // Paginated Campaigns
  const totalPages = Math.ceil(filteredCampaigns.length / itemsPerPage) || 1
  const paginatedCampaigns = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage
    return filteredCampaigns.slice(start, start + itemsPerPage)
  }, [filteredCampaigns, currentPage, itemsPerPage])

  // Dynamic Summary Metrics computed live based on active platform filter & search
  const totalClicks = useMemo(() => {
    return filteredCampaigns.reduce((sum, camp) => {
      const dynamicClicks = campaignClicks.filter(cl => {
        const clCampId = cl.campaign_id || cl.campaignId || cl.camp_id
        const clVehicleId = String(cl.vehicle_id || cl.vehicleId || '')
        const campVehicleId = String(camp.vehicle_id || camp.vehicleId || '')
        const matchesCampId = clCampId && clCampId === camp.id
        const matchesUtm = cl.utm_campaign && camp.utm_campaign && cl.utm_campaign.toLowerCase() === camp.utm_campaign.toLowerCase()
        const matchesVehicle = clVehicleId && campVehicleId && clVehicleId === campVehicleId
        const matchesVehicleName = cl.vehicleName && camp.vehicleName && cl.vehicleName.toLowerCase().includes(camp.vehicleName.toLowerCase())

        return matchesCampId || matchesUtm || matchesVehicle || matchesVehicleName
      }).length
      return sum + Math.max(camp.clicksCount || 0, dynamicClicks)
    }, 0)
  }, [filteredCampaigns, campaignClicks])

  const totalLeads = useMemo(() => {
    return filteredCampaigns.reduce((sum, camp) => {
      const dynamicLeads = leads.filter(l =>
        l.campaign_id === camp.id ||
        l.crmCampaignId === camp.id ||
        l.campaignId === camp.id ||
        (l.utm_campaign && camp.utm_campaign && l.utm_campaign.toLowerCase() === camp.utm_campaign.toLowerCase()) ||
        (l.vehicleId && (camp.vehicleId || camp.vehicle_id) && String(l.vehicleId) === String(camp.vehicleId || camp.vehicle_id)) ||
        (l.vehicle_id && (camp.vehicleId || camp.vehicle_id) && String(l.vehicle_id) === String(camp.vehicleId || camp.vehicle_id)) ||
        (l.notes && l.notes.includes(camp.id)) ||
        (l.notes && camp.utm_campaign && l.notes.toLowerCase().includes(camp.utm_campaign.toLowerCase())) ||
        (camp.vehicleName && (
          (l.vehicle_name && l.vehicle_name.toLowerCase().includes(camp.vehicleName.toLowerCase())) ||
          (l.source && l.source.toLowerCase().includes(camp.vehicleName.toLowerCase())) ||
          (l.notes && l.notes.toLowerCase().includes(camp.vehicleName.toLowerCase()))
        )) ||
        (l.source && l.source.toLowerCase().includes(camp.platform.toLowerCase().split(' ')[0]))
      ).length
      return sum + Math.max(camp.leadsCount || 0, dynamicLeads)
    }, 0)
  }, [filteredCampaigns, leads])

  const topPlatform = useMemo(() => {
    if (selectedPlatform !== 'All') return selectedPlatform
    const counts = {}
    campaigns.forEach(c => {
      counts[c.platform] = (counts[c.platform] || 0) + c.clicksCount
    })
    campaignClicks.forEach(click => {
      const plat = click.platform || 'Facebook Paid Ads'
      counts[plat] = (counts[plat] || 0) + 1
    })
    const sorted = Object.keys(counts).sort((a, b) => counts[b] - counts[a])
    return sorted[0] || 'Facebook Paid Ads'
  }, [campaigns, campaignClicks, selectedPlatform])

  const overallCTR = useMemo(() => {
    if (!totalClicks || totalClicks === 0) return '0.0%'
    const calc = (totalLeads / totalClicks) * 100
    return `${isNaN(calc) ? '0.0' : calc.toFixed(1)}%`
  }, [totalClicks, totalLeads])

  // Dynamic Platform Share Breakdown Live Calculation across all 12 ad channels
  const platformBreakdown = useMemo(() => {
    const totals = {}
    PLATFORM_PRESETS.forEach(preset => {
      totals[preset.name] = 0
    })

    const normalizePlatform = (nameStr = '') => {
      const match = PLATFORM_PRESETS.find(p =>
        nameStr.toLowerCase().includes(p.name.toLowerCase().split(' ')[0]) ||
        nameStr.toLowerCase().includes(p.id)
      )
      return match ? match.name : 'Meta Paid Ads'
    }

    campaigns.forEach(c => {
      const p = normalizePlatform(c.platform)
      totals[p] = (totals[p] || 0) + (c.clicksCount || 0)
    })

    campaignClicks.forEach(clk => {
      const p = normalizePlatform(clk.platform)
      totals[p] = (totals[p] || 0) + 1
    })

    const grandTotal = Math.max(1, Object.values(totals).reduce((a, b) => a + b, 0))

    return PLATFORM_PRESETS.map(preset => {
      const clicks = totals[preset.name] || 0
      return {
        platform: preset.name,
        clicks,
        percentage: Math.round((clicks / grandTotal) * 100),
        badge: preset.tag,
        icon: preset.icon
      }
    })
  }, [campaigns, campaignClicks])

  // Submit Link Generator Wizard
  const handleCreateCampaignSubmit = (e) => {
    e.preventDefault()
    const selectedVeh = availableVehicles.find(v => v.id === formVehicleId) || availableVehicles[0]
    const preset = PLATFORM_PRESETS.find(p => p.id === formPlatform) || PLATFORM_PRESETS[0]

    const campaignSlug = (formCampaignName || `${selectedVeh.name} Promo`).toLowerCase().replace(/\s+/g, '_')
    const shortCampId = `cmp-${Date.now().toString(36).substring(4)}`

    const generatedUrl = `http://localhost:5173/vehicle/${selectedVeh.id}?utm_source=${preset.utm_source}&utm_medium=${preset.utm_medium}&utm_campaign=${campaignSlug}&camp_id=${shortCampId}`

    createCampaign({
      id: shortCampId,
      name: formCampaignName || `${selectedVeh.name} ${preset.name}`,
      vehicleId: selectedVeh.id,
      vehicleName: selectedVeh.name,
      vehiclePrice: selectedVeh.price,
      platform: preset.name,
      crmCampaignId: formCrmCampaignId,
      utm_source: preset.utm_source,
      utm_medium: preset.utm_medium,
      utm_campaign: campaignSlug,
      targetUrl: generatedUrl,
      budget: `KES ${Number(formBudget || 0).toLocaleString()}`,
      clicksCount: 1,
      leadsCount: 0
    })

    setIsModalOpen(false)
    setFormCampaignName('')
    setSelectedPlatform('All')
    setCurrentPage(1)
  }

  // Copy Trackable URL
  const handleCopyUrl = (url, id) => {
    navigator.clipboard.writeText(url)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2500)
  }

  // Edit & Delete Handlers
  const handleStartEdit = (camp) => {
    setEditingCampaign(camp)
    let existingChannels = []
    if (Array.isArray(camp.channels) && camp.channels.length > 0) {
      existingChannels = camp.channels
    } else if (camp.platform && camp.platform.includes(',')) {
      existingChannels = camp.platform.split(',').map(s => s.trim())
    } else if (camp.platform) {
      existingChannels = [camp.platform]
    }

    setEditFormData({
      name: camp.name || '',
      budget: (camp.budget || '').replace(/[^0-9]/g, '') || '500000',
      platform: camp.platform || 'Meta Paid Ads',
      vehicleId: camp.vehicleId || '37',
      channels: existingChannels
    })
  }

  const handleSaveEditSubmit = (e) => {
    e.preventDefault()
    if (!editingCampaign) return

    const selectedVeh = availableVehicles.find(v => String(v.id) === String(editFormData.vehicleId)) || availableVehicles[0]
    const isOmni = editingCampaign.id?.startsWith('cmp-wiz-') || editingCampaign.platform?.includes(',') || editingCampaign.platform?.includes('Omnichannel')

    const platformStr = isOmni && Array.isArray(editFormData.channels) && editFormData.channels.length > 0
      ? editFormData.channels.join(', ')
      : (editFormData.platform || editingCampaign.platform)

    updateCampaign(editingCampaign.id, {
      name: editFormData.name || editingCampaign.name,
      budget: `KES ${Number(editFormData.budget || 0).toLocaleString()}`,
      budgetKes: Number(editFormData.budget || 0),
      platform: platformStr,
      vehicleId: selectedVeh.id,
      vehicleName: selectedVeh.name,
      vehiclePrice: selectedVeh.price,
      channels: editFormData.channels || []
    })

    setEditingCampaign(null)
  }

  const handleConfirmDelete = () => {
    if (!deletingCampaign) return
    deleteCampaign(deletingCampaign.id)
    setDeletingCampaign(null)
  }

  // Render QR Code Canvas when modal opens
  useEffect(() => {
    if (qrModalCampaign && qrCanvasRef.current) {
      const canvas = qrCanvasRef.current
      const ctx = canvas.getContext('2d')
      const width = 220
      const height = 220
      canvas.width = width
      canvas.height = height

      // Background
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, width, height)

      // Draw stylized QR grid representation
      ctx.fillStyle = '#020617'
      const tileSize = 10
      for (let x = 10; x < width - 10; x += tileSize) {
        for (let y = 10; y < height - 10; y += tileSize) {
          if ((x < 60 && y < 60) || (x > width - 70 && y < 60) || (x < 60 && y > height - 70)) {
            // Corner markers
            ctx.fillRect(x, y, tileSize - 1, tileSize - 1)
          } else if (Math.random() > 0.45) {
            ctx.fillRect(x, y, tileSize - 1, tileSize - 1)
          }
        }
      }

      // Center Brand Logo Accent Box
      ctx.fillStyle = '#c9a84c'
      ctx.fillRect(width / 2 - 18, height / 2 - 18, 36, 36)
      ctx.fillStyle = '#ffffff'
      ctx.font = 'bold 12px sans-serif'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText('FUSE', width / 2, height / 2)
    }
  }, [qrModalCampaign])

  return (
    <div className={`space-y-6 font-sans pb-12 transition-colors duration-300 min-h-screen p-4 md:p-6 rounded-3xl border ${
      isLight ? 'bg-slate-50 border-slate-200 text-slate-900 shadow-xl' : 'bg-[#020617] border-white/10 text-slate-100 shadow-2xl'
    }`}>
      
      {/* Executive Header Bar */}
      <div className={`flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl border transition-all duration-300 ${
        isLight ? 'bg-white border-slate-200 shadow-xl' : 'bg-[#070b14]/90 border-white/10 shadow-2xl backdrop-blur-xl'
      }`}>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#6366f1]/20 to-[#c9a84c]/20 border border-[#6366f1]/40 text-[#6366f1] flex items-center justify-center shadow-lg shadow-[#6366f1]/10">
            <Megaphone size={24} />
          </div>
          <div>
            <div className={`text-[10px] font-mono font-bold tracking-[3px] uppercase ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
              Analytics Suite <span className="text-[#c9a84c]">/</span> Digital Ad Attribution
            </div>
            <h1 className={`text-2xl font-serif font-light mt-0.5 ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
              Campaign Monitor
            </h1>
            <p className={`text-xs ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
              Bind vehicles to Meta, WhatsApp &amp; Email campaigns to track real-time traffic, buyer inquiries, and ROAS.
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <span className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 font-mono font-bold text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span>ATTRIBUTION ACTIVE</span>
          </span>

          <button
            onClick={() => {
              setWizardForm({
                name: 'Q4 Luxury SUV Omnichannel Blitz',
                vehicle_id: availableVehicles[0]?.id || '37',
                budget: 500000,
                start_date: new Date().toISOString().split('T')[0],
                end_date: '2026-12-31',
                description: 'Automated omnichannel campaign across Meta, WhatsApp, Email, & Showroom QR.',
                channels: []
              })
              setWizardStep(1)
              setShowLauncherWizard(true)
            }}
            className="px-4 py-2 rounded-xl bg-[#c9a84c] text-slate-950 font-bold text-xs uppercase hover:bg-[#d9b85c] transition-all cursor-pointer flex items-center gap-1.5 shadow-lg"
          >
            <Sparkles size={15} />
            <span>+ Launch Campaign Wizard</span>
          </button>

          <button
            onClick={() => setIsPlannerModalOpen(true)}
            className={`px-3.5 py-2 rounded-xl border text-xs font-mono flex items-center gap-1.5 transition-all cursor-pointer ${
              isLight ? 'bg-indigo-50 border-indigo-200 text-indigo-800 hover:bg-indigo-100' : 'bg-indigo-950/40 border-indigo-500/30 text-indigo-300 hover:text-white'
            }`}
          >
            <Zap size={14} className="text-[#6366f1]" />
            <span>AI Campaign Planner</span>
          </button>

          <button
            onClick={() => setIsAttributionModalOpen(true)}
            className={`px-3.5 py-2 rounded-xl border text-xs font-mono flex items-center gap-1.5 transition-all cursor-pointer ${
              isLight ? 'bg-cyan-50 border-cyan-200 text-cyan-800 hover:bg-cyan-100' : 'bg-cyan-950/40 border-cyan-500/30 text-cyan-300 hover:text-white'
            }`}
          >
            <Layers size={14} className="text-cyan-400" />
            <span>Multi-Touch Revenue</span>
          </button>

          <button
            onClick={() => setIsRoiModalOpen(true)}
            className={`px-3.5 py-2 rounded-xl border text-xs font-mono flex items-center gap-1.5 transition-all cursor-pointer ${
              isLight ? 'bg-amber-50 border-amber-200 text-amber-800 hover:bg-amber-100' : 'bg-amber-950/40 border-amber-500/30 text-amber-300 hover:text-white'
            }`}
          >
            <TrendingUp size={14} className="text-[#c9a84c]" />
            <span>ROI Math Report</span>
          </button>

          <button
            onClick={handleExportPDF}
            className="px-3.5 py-2 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-300 hover:bg-purple-500/20 text-xs font-mono flex items-center gap-1.5 transition-all cursor-pointer"
            title="Export Formatted PDF Brief"
          >
            <Download size={14} />
            <span>PDF Brief</span>
          </button>

          <button
            onClick={handleExportCSV}
            className={`px-3.5 py-2 rounded-xl border text-xs font-mono flex items-center gap-1.5 transition-all cursor-pointer ${
              isLight ? 'bg-slate-100 border-slate-200 text-slate-800 hover:bg-slate-200' : 'bg-slate-900 border-white/10 text-slate-300 hover:text-white hover:border-[#c9a84c]'
            }`}
            title="Export Raw CSV Data"
          >
            <Download size={14} />
            <span>CSV Export</span>
          </button>

          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-gradient-to-r from-[#6366f1] via-[#06b6d4] to-[#c9a84c] text-white font-semibold text-xs uppercase tracking-wider rounded-xl hover:opacity-90 transition-all flex items-center gap-2 shadow-lg shadow-[#6366f1]/20 cursor-pointer"
          >
            <Plus size={16} />
            <span>Create Trackable Link</span>
          </button>
        </div>
      </div>

      {/* 4 Dynamic Executive KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Total Inbound Clicks */}
        <div className={`p-5 rounded-2xl border transition-all duration-300 relative overflow-hidden group ${
          isLight ? 'bg-white border-slate-200 shadow-xl' : 'bg-[#0f172a]/80 border-white/10 shadow-2xl'
        }`}>
          <div className={`flex items-center justify-between text-xs font-mono mb-3 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
            <span className="uppercase tracking-wider">Total Inbound Clicks</span>
            <MousePointer size={16} className="text-[#6366f1]" />
          </div>
          <h3 className={`text-2xl font-bold font-mono ${isLight ? 'text-slate-900' : 'text-white'}`}>{(totalClicks || 0).toLocaleString()}</h3>
          <p className={`text-xs font-mono mt-2 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
            Across all 3rd party ad links
          </p>
        </div>

        {/* Card 2: Total Inquiries Converted */}
        <div className={`p-5 rounded-2xl border transition-all duration-300 relative overflow-hidden group ${
          isLight ? 'bg-white border-slate-200 shadow-xl' : 'bg-[#0f172a]/80 border-white/10 shadow-2xl'
        }`}>
          <div className={`flex items-center justify-between text-xs font-mono mb-3 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
            <span className="uppercase tracking-wider">Inquiries Converted</span>
            <MessageSquare size={16} className="text-emerald-500" />
          </div>
          <h3 className={`text-2xl font-bold font-mono ${isLight ? 'text-slate-900' : 'text-white'}`}>{totalLeads}</h3>
          <p className={`text-xs font-mono mt-2 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
            Direct buyer inquiries &amp; test drives
          </p>
        </div>

        {/* Card 3: Top Performing Platform */}
        <div className={`p-5 rounded-2xl border transition-all duration-300 relative overflow-hidden group ${
          isLight ? 'bg-white border-slate-200 shadow-xl' : 'bg-[#0f172a]/80 border-white/10 shadow-2xl'
        }`}>
          <div className={`flex items-center justify-between text-xs font-mono mb-3 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
            <span className="uppercase tracking-wider">Top Platform</span>
            <Award size={16} className="text-[#c9a84c]" />
          </div>
          <h3 className={`text-lg font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>{topPlatform}</h3>
          <p className={`text-xs font-mono mt-2 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
            Highest traffic volume generator
          </p>
        </div>

        {/* Card 4: Overall Campaign CTR */}
        <div className={`p-5 rounded-2xl border transition-all duration-300 relative overflow-hidden group ${
          isLight ? 'bg-white border-slate-200 shadow-xl' : 'bg-[#0f172a]/80 border-white/10 shadow-2xl'
        }`}>
          <div className={`flex items-center justify-between text-xs font-mono mb-3 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
            <span className="uppercase tracking-wider">Avg Conversion CTR</span>
            <Zap size={16} className="text-[#06b6d4]" />
          </div>
          <h3 className="text-2xl font-bold font-mono text-[#06b6d4]">{overallCTR}</h3>
          <p className={`text-xs font-mono mt-2 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
            Click-to-inquiry conversion rate
          </p>
        </div>
      </div>

      {/* Campaign Performance Matrix Table & Controls */}
      <div className={`p-5 rounded-2xl border transition-all duration-300 space-y-4 ${
        isLight ? 'bg-white border-slate-200 shadow-xl' : 'bg-[#0f172a]/80 border-white/10 shadow-2xl'
      }`}>
        
        {/* Table Filter Bar */}
        <div className={`flex flex-col md:flex-row items-center justify-between gap-4 border-b pb-4 ${
          isLight ? 'border-slate-200' : 'border-white/10'
        }`}>
          <div className="flex items-center gap-3 w-full md:w-auto">
            {/* Search Input */}
            <div className="relative w-full md:w-72">
              <Search size={14} className="absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="Search campaign name or vehicle..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className={`w-full border rounded-xl pl-9 pr-3 py-2 text-xs font-mono outline-none focus:border-[#c9a84c] transition-all ${
                  isLight
                    ? 'bg-slate-50 border-slate-300 text-slate-900 placeholder:text-slate-400'
                    : 'bg-slate-950 border-white/10 text-slate-100 placeholder:text-slate-500'
                }`}
              />
            </div>

            {/* Predictive Platform Filter */}
            <PredictiveSelect
              options={[
                { value: 'All', label: 'All Platforms', badge: 'All 13 Channels' },
                { value: 'Facebook', label: 'Facebook Paid Ads', badge: 'Paid Ad' },
                { value: 'Instagram Paid', label: 'Instagram Paid Ads', badge: 'Paid Ad' },
                { value: 'WhatsApp', label: 'WhatsApp Campaigns', badge: 'Chat' },
                { value: 'Email', label: 'Email Newsletter', badge: 'Direct' },
                { value: 'Google', label: 'Google Ads PPC', badge: 'Paid Search' },
                { value: 'TikTok', label: 'TikTok / Social', badge: 'Influencer' },
                { value: 'Classified', label: 'Classified Portals (Jiji/Cheki)', badge: 'Marketplace' },
                { value: 'YouTube', label: 'YouTube Video & Shorts', badge: 'Video' },
                { value: 'Instagram', label: 'Instagram Reels & Bio', badge: 'Social' },
                { value: 'SMS', label: 'SMS Bulk Outreach', badge: 'Mobile' },
                { value: 'Showroom', label: 'Showroom QR Code', badge: 'Print QR' },
                { value: 'Google Maps', label: 'Google Maps / Local SEO', badge: 'Free SEO' },
                { value: 'LinkedIn', label: 'LinkedIn B2B', badge: 'Corporate' }
              ]}
              value={selectedPlatform}
              onChange={val => setSelectedPlatform(val || 'All')}
              isLight={isLight}
              className="w-64"
              placeholder="Filter by Platform..."
            />
          </div>

          <div className={`text-xs font-mono ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
            Showing <span className="font-bold text-[#c9a84c]">{filteredCampaigns.length}</span> Active Promotional Campaigns
          </div>
        </div>

        {/* Matrix Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs border-collapse">
            <thead>
              <tr className={`border-b uppercase text-[10px] tracking-wider ${
                isLight ? 'border-slate-300 text-slate-900 bg-slate-100 font-bold' : 'border-white/10 text-slate-400 bg-slate-950/40'
              }`}>
                <th className="p-3">Status</th>
                <th className="p-3">Campaign Name &amp; ID</th>
                <th className="p-3">Associated Vehicle</th>
                <th className="p-3 min-w-[160px] whitespace-nowrap">Platform</th>
                <th className="p-3">Budget</th>
                <th className="p-3">Clicks</th>
                <th className="p-3">Inquiries</th>
                <th className="p-3">CTR</th>
                <th className="p-3 text-right">Quick Actions</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isLight ? 'divide-slate-200' : 'divide-white/5'}`}>
              {paginatedCampaigns.map((camp) => {
                const dynamicClicks = campaignClicks.filter(cl => {
                  const clCampId = cl.campaign_id || cl.campaignId || cl.camp_id
                  const clVehicleId = String(cl.vehicle_id || cl.vehicleId || '')
                  const campVehicleId = String(camp.vehicle_id || camp.vehicleId || '')
                  const matchesCampId = clCampId && clCampId === camp.id
                  const matchesUtm = cl.utm_campaign && camp.utm_campaign && cl.utm_campaign.toLowerCase() === camp.utm_campaign.toLowerCase()
                  const matchesVehicle = clVehicleId && campVehicleId && clVehicleId === campVehicleId
                  const matchesVehicleName = cl.vehicleName && camp.vehicleName && cl.vehicleName.toLowerCase().includes(camp.vehicleName.toLowerCase())

                  return matchesCampId || matchesUtm || matchesVehicle || matchesVehicleName
                }).length
                const totalCampClicks = Math.max(camp.clicksCount || 0, dynamicClicks)

                const dynamicLeads = leads.filter(l =>
                  l.campaign_id === camp.id ||
                  l.crmCampaignId === camp.id ||
                  l.campaignId === camp.id ||
                  (l.utm_campaign && camp.utm_campaign && l.utm_campaign.toLowerCase() === camp.utm_campaign.toLowerCase()) ||
                  (l.vehicleId && (camp.vehicleId || camp.vehicle_id) && String(l.vehicleId) === String(camp.vehicleId || camp.vehicle_id)) ||
                  (l.vehicle_id && (camp.vehicleId || camp.vehicle_id) && String(l.vehicle_id) === String(camp.vehicleId || camp.vehicle_id)) ||
                  (l.notes && l.notes.includes(camp.id)) ||
                  (l.notes && camp.utm_campaign && l.notes.toLowerCase().includes(camp.utm_campaign.toLowerCase())) ||
                  (camp.vehicleName && (
                    (l.vehicle_name && l.vehicle_name.toLowerCase().includes(camp.vehicleName.toLowerCase())) ||
                    (l.source && l.source.toLowerCase().includes(camp.vehicleName.toLowerCase())) ||
                    (l.notes && l.notes.toLowerCase().includes(camp.vehicleName.toLowerCase()))
                  )) ||
                  (l.source && l.source.toLowerCase().includes(camp.platform.toLowerCase().split(' ')[0]))
                ).length
                const totalCampLeads = Math.max(camp.leadsCount || 0, dynamicLeads)

                return (
                  <tr key={camp.id} className={isLight ? 'hover:bg-slate-50 transition-colors' : 'hover:bg-white/[0.02] transition-colors'}>
                    {/* Status */}
                    <td className="p-3">
                      <button
                        onClick={() => toggleCampaignStatus(camp.id)}
                        className={`px-2 py-0.5 rounded text-[10px] font-bold border transition-all cursor-pointer ${
                          camp.status === 'Active'
                            ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30'
                            : 'bg-amber-500/10 text-amber-600 border-amber-500/30'
                        }`}
                      >
                        ● {camp.status}
                      </button>
                    </td>

                    {/* Campaign Name */}
                    <td className="p-3">
                      <div className="space-y-1">
                        <span className={`font-bold block ${isLight ? 'text-slate-900' : 'text-white'}`}>{camp.name}</span>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className={`text-[10px] ${isLight ? 'text-slate-600' : 'text-slate-500'}`}>{camp.id}</span>
                          {(() => {
                            const linkedCrm = crmCampaigns.find(c => c.id === camp.crmCampaignId || c.slug === camp.utm_campaign)
                            if (!linkedCrm) return null
                            return (
                              <span className={`text-[9px] px-1.5 py-0.2 rounded border font-bold uppercase ${
                                isLight ? 'bg-amber-100 text-amber-900 border-amber-300' : 'bg-[#c9a84c]/10 text-[#c9a84c] border-[#c9a84c]/30'
                              }`}>
                                CRM: {linkedCrm.name}
                              </span>
                            )
                          })()}
                        </div>
                      </div>
                    </td>

                    {/* Associated Vehicle */}
                    <td className="p-3">
                      {(() => {
                        const vObj = availableVehicles.find(v => String(v.id) === String(camp.vehicleId || camp.vehicle_id)) ||
                                     availableVehicles.find(v => v.name.toLowerCase().includes(camp.vehicleName?.toLowerCase() || ''))
                        const thumbImg = vObj?.image || camp.vehicleImage || camp.vehicle_image || 'https://images.unsplash.com/photo-1594502184342-2e12f877aa73?auto=format&fit=crop&w=400&q=80'

                        return (
                          <Link
                            to={`/analytics/product-views/${camp.vehicleId}`}
                            className="flex items-center gap-2.5 group hover:opacity-90 transition-all min-w-[200px]"
                          >
                            <div className="w-10 h-8 rounded-lg overflow-hidden border border-[#c9a84c]/30 flex-shrink-0 bg-black/40 shadow-sm group-hover:border-[#c9a84c] transition-colors">
                              <img
                                src={thumbImg}
                                alt={camp.vehicleName}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                onError={(e) => {
                                  e.target.onerror = null
                                  e.target.src = 'https://images.unsplash.com/photo-1594502184342-2e12f877aa73?auto=format&fit=crop&w=400&q=80'
                                }}
                              />
                            </div>
                            <div className="flex flex-col min-w-0">
                              <span className={`font-bold text-xs group-hover:text-[#c9a84c] transition-colors truncate max-w-[180px] ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>
                                {camp.vehicleName}
                              </span>
                              {vObj?.price && (
                                <span className="text-[10px] text-[#c9a84c] font-mono font-medium">
                                  {vObj.price}
                                </span>
                              )}
                            </div>
                          </Link>
                        )
                      })()}
                    </td>

                    {/* Target Platform */}
                    <td className="p-3 min-w-[160px] whitespace-nowrap">
                      <span className={`px-2.5 py-1 rounded-lg border font-bold text-[10px] whitespace-nowrap inline-block ${
                        camp.platform.includes('Meta') ? 'bg-blue-500/10 text-blue-600 border-blue-500/30' :
                        camp.platform.includes('WhatsApp') ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30' :
                        camp.platform.includes('Email') ? 'bg-indigo-500/10 text-indigo-600 border-indigo-500/30' :
                        'bg-amber-500/10 text-amber-600 border-amber-500/30'
                      }`}>
                        {camp.platform}
                      </span>
                    </td>

                    {/* Budget */}
                    <td className={`p-3 font-bold ${isLight ? 'text-slate-900' : 'text-slate-300'}`}>{camp.budget || 'KES 0'}</td>

                    {/* Total Clicks */}
                    <td className="p-3 font-bold text-[#6366f1]">{totalCampClicks.toLocaleString()}</td>

                    {/* Inquiries */}
                    <td className="p-3 font-bold text-emerald-600">{totalCampLeads.toLocaleString()}</td>

                    {/* CTR Score */}
                    <td className="p-3">
                      <span className="font-bold text-[#c9a84c]">
                        {totalCampClicks > 0
                          ? `${((totalCampLeads / totalCampClicks) * 100).toFixed(1)}%`
                          : '0.0%'}
                      </span>
                    </td>

                    {/* Quick Actions */}
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <ActionTooltip text="Copy Trackable Campaign URL" isLight={isLight}>
                          <button
                            onClick={() => handleCopyUrl(resolveTargetUrl(camp.targetUrl, camp.vehicleId, camp.utm_source, camp.utm_medium, camp.utm_campaign, camp.id), camp.id)}
                            className={`p-1.5 rounded-lg border transition-all ${
                              copiedId === camp.id
                                ? 'bg-emerald-500/20 text-emerald-600 border-emerald-500/40'
                                : isLight ? 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-200' : 'bg-slate-900 text-slate-300 hover:text-white border-white/10'
                            }`}
                          >
                            {copiedId === camp.id ? <Check size={14} /> : <Copy size={14} />}
                          </button>
                        </ActionTooltip>

                        {/* QR Code */}
                        <ActionTooltip text="Generate QR Code" isLight={isLight}>
                          <button
                            onClick={() => setQrModalCampaign({ ...camp, targetUrl: resolveTargetUrl(camp.targetUrl, camp.vehicleId, camp.utm_source, camp.utm_medium, camp.utm_campaign, camp.id) })}
                            className={`p-1.5 rounded-lg border transition-all ${
                              isLight ? 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-200' : 'bg-slate-900 text-slate-300 hover:text-white border-white/10'
                            }`}
                          >
                            <QrCode size={14} />
                          </button>
                        </ActionTooltip>

                        {/* Open Link */}
                        <ActionTooltip text="Test Inbound Link" isLight={isLight}>
                          <a
                            href={resolveTargetUrl(camp.targetUrl, camp.vehicleId, camp.utm_source, camp.utm_medium, camp.utm_campaign, camp.id)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`p-1.5 rounded-lg border transition-all ${
                              isLight ? 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-200' : 'bg-slate-900 text-slate-300 hover:text-white border-white/10'
                            }`}
                          >
                            <ExternalLink size={14} />
                          </a>
                        </ActionTooltip>

                        {/* Edit Campaign */}
                        <ActionTooltip text="Edit Campaign Details" isLight={isLight}>
                          <button
                            onClick={() => handleStartEdit(camp)}
                            className={`p-1.5 rounded-lg border transition-all ${
                              isLight ? 'bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200' : 'bg-blue-950/60 text-blue-400 hover:text-white border-blue-500/30'
                            }`}
                          >
                            <Edit3 size={14} />
                          </button>
                        </ActionTooltip>

                        {/* Delete Campaign */}
                        <ActionTooltip text="Delete Promotional Campaign" isLight={isLight}>
                          <button
                            onClick={() => setDeletingCampaign(camp)}
                            className={`p-1.5 rounded-lg border transition-all ${
                              isLight ? 'bg-rose-50 text-rose-700 hover:bg-rose-100 border-rose-200' : 'bg-rose-950/60 text-rose-400 hover:text-white border-rose-500/30'
                            }`}
                          >
                            <Trash2 size={14} />
                          </button>
                        </ActionTooltip>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Universal Pagination */}
        <UniversalPagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredCampaigns.length}
          itemsPerPage={itemsPerPage}
          onPageChange={page => setCurrentPage(page)}
          onItemsPerPageChange={size => {
            setItemsPerPage(size)
            setCurrentPage(1)
          }}
          pageSizeOptions={[5, 10, 25, 50]}
        />
      </div>

      {/* Live Inbound Telemetry Stream */}
      <div className={`p-5 rounded-2xl border transition-all duration-300 space-y-4 ${
        isLight ? 'bg-white border-slate-200 shadow-xl' : 'bg-[#0f172a]/80 border-white/10 shadow-2xl'
      }`}>
        <div className={`flex items-center justify-between border-b pb-3 ${isLight ? 'border-slate-200' : 'border-white/10'}`}>
          <h3 className={`text-base font-serif font-light flex items-center gap-2 ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
            <BarChart2 size={18} className="text-[#6366f1]" />
            <span>Real-time Inbound Campaign Click Feed</span>
          </h3>
          <span className="text-xs font-mono text-emerald-600 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-0.5 rounded-full font-bold">
            ● Live Stream Ticker
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {campaignClicks.slice(0, 4).map((click) => (
            <div key={click.id} className={`p-3.5 rounded-xl border flex items-center justify-between font-mono text-xs ${
              isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/60 border-white/5'
            }`}>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-emerald-600">{click.ip_address}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded border ${
                    isLight ? 'bg-slate-200 text-slate-800 border-slate-300' : 'bg-slate-800 text-slate-300 border-white/10'
                  }`}>
                    {click.platform}
                  </span>
                </div>
                <div className={`text-[11px] font-semibold ${isLight ? 'text-slate-800' : 'text-slate-300'}`}>
                  {click.vehicleName}
                </div>
                <div className={`text-[10px] flex items-center gap-1 ${isLight ? 'text-slate-600' : 'text-slate-500'}`}>
                  <MapPin size={10} />
                  <span>{click.location_name}</span> • <span>{click.device}</span>
                </div>
              </div>

              <div className={`text-[10px] font-semibold text-right ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>
                {new Date(click.timestamp || click.created_at).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dynamic Multi-Platform Traffic Share Breakdown Card */}
      <div className={`p-5 rounded-2xl border transition-all duration-300 space-y-4 ${
        isLight ? 'bg-white border-slate-200 shadow-xl' : 'bg-[#0f172a]/80 border-white/10 shadow-2xl'
      }`}>
        <div className={`flex items-center justify-between border-b pb-3 ${isLight ? 'border-slate-200' : 'border-white/10'}`}>
          <h3 className={`text-base font-serif font-light flex items-center gap-2 ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
            <Layers size={18} className="text-[#c9a84c]" />
            <span>Dynamic Multi-Platform Traffic Share Breakdown</span>
          </h3>
          <span className={`text-xs font-mono font-bold ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
            Live Aggregation
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 font-mono text-xs">
          {platformBreakdown.map((item) => {
            const IconComp = item.icon || Share2

            return (
              <div key={item.platform} className={`p-4 rounded-xl border space-y-2.5 transition-all ${
                isLight ? 'bg-slate-50 border-slate-200 hover:border-slate-300' : 'bg-slate-900/60 border-white/5 hover:border-white/20'
              }`}>
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="p-1.5 rounded-lg bg-[#c9a84c]/10 text-[#c9a84c] border border-[#c9a84c]/30 flex-shrink-0">
                      <IconComp size={14} />
                    </div>
                    <div className="truncate">
                      <span className={`font-bold text-xs block truncate ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>
                        {item.platform}
                      </span>
                      {item.badge && (
                        <span className="text-[9px] text-slate-400 font-normal block truncate">
                          {item.badge}
                        </span>
                      )}
                    </div>
                  </div>

                  <span className="font-bold text-[#c9a84c] flex-shrink-0">{item.percentage}%</span>
                </div>

                <div className={`w-full h-2 rounded-full overflow-hidden border ${isLight ? 'bg-slate-200 border-slate-300' : 'bg-slate-950 border-white/10'}`}>
                  <div
                    className="h-full bg-gradient-to-r from-[#6366f1] via-[#06b6d4] to-[#c9a84c] rounded-full transition-all duration-500"
                    style={{ width: `${Math.max(item.percentage, item.clicks > 0 ? 5 : 0)}%` }}
                  />
                </div>

                <div className={`text-[10px] flex items-center justify-between ${isLight ? 'text-slate-600' : 'text-slate-500'}`}>
                  <span>{(item.clicks || 0).toLocaleString()} clicks</span>
                  <span className="text-emerald-600 font-semibold">● Calculated live</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* --- MODAL 1: Trackable Link Generator Wizard --- */}
      {isModalOpen && createPortal(
        <div className="fixed inset-0 z-[999999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto crm-scroll">
          <div className={`w-full max-w-xl my-auto max-h-[90vh] overflow-y-auto crm-scroll p-6 rounded-3xl border shadow-2xl transition-all font-sans relative ${
            isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-[#0f172a] border-white/10 text-slate-100'
          }`}>
            <button
              onClick={() => setIsModalOpen(false)}
              className={`absolute right-5 top-5 p-1.5 rounded-full hover:bg-white/10 transition-colors ${
                isLight ? 'text-slate-700 hover:bg-slate-100' : 'text-slate-400'
              }`}
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-[#6366f1]/10 border border-[#6366f1]/30 text-[#6366f1] flex items-center justify-center">
                <Plus size={20} />
              </div>
              <div>
                <h3 className="text-xl font-serif font-light">Create Trackable Campaign Link</h3>
                <p className={`text-xs ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                  Select a vehicle, pick target platform presets, and get a trackable URL + QR Code.
                </p>
              </div>
            </div>

            <form onSubmit={handleCreateCampaignSubmit} className="space-y-4">
              {/* Step 1: Predictive Dropdown Select Vehicle */}
              <div className="relative">
                <label className={`block text-xs font-mono font-bold mb-1.5 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                  1. Select Target Vehicle (Predictive Search)
                </label>
                
                {/* Search Input Field */}
                <div className="relative flex items-center">
                  <Search size={16} className={`absolute left-3 ${isLight ? 'text-slate-400' : 'text-slate-500'}`} />
                  <input
                    type="text"
                    value={vehicleSearchQuery}
                    onChange={(e) => {
                      setVehicleSearchQuery(e.target.value)
                      setIsDropdownOpen(true)
                    }}
                    onFocus={() => setIsDropdownOpen(true)}
                    placeholder={selectedVehicleObj ? `${selectedVehicleObj.name} — ${selectedVehicleObj.price}` : 'Type to search vehicles predictively...'}
                    className={`w-full border rounded-xl pl-9 pr-8 py-2.5 text-xs font-mono outline-none focus:border-[#6366f1] focus:ring-1 focus:ring-[#6366f1]/50 transition-all ${
                      isLight ? 'bg-slate-50 border-slate-300 text-slate-900 placeholder:text-slate-500' : 'bg-slate-950 border-white/10 text-slate-100 placeholder:text-slate-400'
                    }`}
                  />
                  {vehicleSearchQuery && (
                    <button
                      type="button"
                      onClick={() => setVehicleSearchQuery('')}
                      className="absolute right-2.5 p-1 rounded-full text-slate-400 hover:text-slate-200"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>

                {/* Selected Item Badge Preview */}
                {selectedVehicleObj && !isDropdownOpen && (
                  <div className={`mt-2 p-2.5 rounded-xl border flex items-center gap-3 transition-all ${
                    isLight ? 'bg-slate-100 border-slate-200' : 'bg-slate-900/80 border-white/10'
                  }`}>
                    <img
                      src={selectedVehicleObj.image}
                      alt={selectedVehicleObj.name}
                      className="w-10 h-10 rounded-lg object-cover border border-[#c9a84c]/30"
                    />
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs font-bold truncate ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
                        {selectedVehicleObj.name}
                      </p>
                      <p className="text-[10px] font-mono text-[#c9a84c] font-bold">
                        {selectedVehicleObj.price} • <span className={isLight ? 'text-slate-600' : 'text-slate-400'}>{selectedVehicleObj.category}</span>
                      </p>
                    </div>
                    <span className="text-[9px] uppercase tracking-wider font-mono font-bold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                      Selected
                    </span>
                  </div>
                )}

                {/* Predictive Floating Dropdown Suggestions */}
                {isDropdownOpen && (
                  <>
                    {/* Backdrop to close dropdown on click outside */}
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setIsDropdownOpen(false)}
                    />
                    <div className={`absolute top-full left-0 right-0 mt-1 z-20 max-h-56 overflow-y-auto crm-scroll rounded-2xl border shadow-2xl backdrop-blur-xl ${
                      isLight ? 'bg-white/95 border-slate-300 divide-slate-100' : 'bg-slate-900/95 border-white/15 divide-white/5'
                    } divide-y`}>
                      {predictiveVehiclesList.length > 0 ? (
                        predictiveVehiclesList.map(v => (
                          <div
                            key={v.id}
                            onClick={() => {
                              setFormVehicleId(v.id)
                              setVehicleSearchQuery('')
                              setIsDropdownOpen(false)
                            }}
                            className={`p-2.5 flex items-center gap-3 cursor-pointer transition-all ${
                              isLight ? 'hover:bg-slate-100 text-slate-900' : 'hover:bg-white/10 text-slate-100'
                            } ${String(v.id) === String(formVehicleId) ? (isLight ? 'bg-indigo-50/80 font-bold' : 'bg-[#6366f1]/20 font-bold') : ''}`}
                          >
                            <img src={v.image} alt={v.name} className="w-9 h-9 rounded-lg object-cover border border-white/10" />
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-bold truncate">{v.name}</p>
                              <p className="text-[10px] font-mono text-[#c9a84c]">{v.price} • {v.category}</p>
                            </div>
                            {String(v.id) === String(formVehicleId) && (
                              <CheckCircle2 size={14} className="text-[#6366f1]" />
                            )}
                          </div>
                        ))
                      ) : (
                        <div className="p-3 text-center text-xs font-mono text-slate-400">
                          No matching vehicles found for "{vehicleSearchQuery}"
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>

              {/* Step 2: Target Platform Presets with Authentic Brand Logos */}
              <div>
                <label className={`block text-xs font-mono font-bold mb-1.5 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                  2. Select Target Platform / Channel
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {PLATFORM_PRESETS.map(preset => {
                    const Icon = preset.icon
                    const isSelected = formPlatform === preset.id
                    return (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => setFormPlatform(preset.id)}
                        className={`p-2.5 rounded-xl border text-left flex items-center gap-2.5 text-xs font-mono font-bold transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#6366f1]/20 border-[#6366f1] text-[#6366f1] shadow-md shadow-[#6366f1]/20 scale-[1.02]'
                            : isLight ? 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-slate-300' : 'bg-slate-900/80 border-white/10 text-slate-300 hover:bg-white/5 hover:border-white/20'
                        }`}
                      >
                        <div className="w-5 h-5 flex items-center justify-center">
                          <Icon />
                        </div>
                        <span className="truncate">{preset.name}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Step 3: Parent CRM Campaign & Tagging */}
              <div>
                <PredictiveSelect
                  label="3. Parent CRM Marketing Campaign Alignment *"
                  options={crmCampaigns.map(c => ({
                    value: c.id,
                    label: c.name,
                    badge: c.type,
                    subtext: `UTM Slug: ${c.slug}`
                  }))}
                  value={formCrmCampaignId}
                  onChange={val => {
                    setFormCrmCampaignId(val)
                    const selectedCrm = crmCampaigns.find(c => c.id === val)
                    if (selectedCrm && !formCampaignName) {
                      setFormCampaignName(`${selectedCrm.name} Ad`)
                    }
                  }}
                  isLight={isLight}
                  placeholder="Select overarching CRM Campaign..."
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className={`block text-xs font-mono font-bold mb-1.5 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                    4. Ad Variant Title (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Prado V8 Meta Blitz"
                    value={formCampaignName}
                    onChange={e => setFormCampaignName(e.target.value)}
                    className={`w-full border rounded-xl px-3 py-2 text-xs font-mono outline-none focus:border-[#6366f1] transition-all ${
                      isLight ? 'bg-slate-50 border-slate-300 text-slate-900 placeholder:text-slate-400' : 'bg-slate-950 border-white/10 text-slate-100 placeholder:text-slate-500'
                    }`}
                  />
                </div>

                <div>
                  <label className={`block text-xs font-mono font-bold mb-1.5 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                    Ad Budget (KES)
                  </label>
                  <input
                    type="number"
                    value={formBudget}
                    onChange={e => setFormBudget(e.target.value)}
                    className={`w-full border rounded-xl px-3 py-2 text-xs font-mono outline-none focus:border-[#6366f1] transition-all ${
                      isLight ? 'bg-slate-50 border-slate-300 text-slate-900 placeholder:text-slate-400' : 'bg-slate-950 border-white/10 text-slate-100 placeholder:text-slate-500'
                    }`}
                  />
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className={`px-4 py-2 rounded-xl border text-xs font-mono font-bold transition-all ${
                    isLight ? 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200' : 'bg-slate-900 border-white/10 text-slate-300 hover:text-white'
                  }`}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-[#6366f1] via-[#06b6d4] to-[#c9a84c] text-white font-semibold text-xs uppercase tracking-wider rounded-xl hover:opacity-90 transition-all shadow-lg shadow-[#6366f1]/20 cursor-pointer"
                >
                  Generate Campaign Link
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* --- MODAL 2: QR Code & 1-Click Social Distribution --- */}
      {qrModalCampaign && createPortal(
        <div className="fixed inset-0 z-[999999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto crm-scroll">
          <div className={`w-full max-w-md my-auto max-h-[90vh] overflow-y-auto crm-scroll p-6 rounded-3xl border shadow-2xl transition-all font-sans relative text-center ${
            isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-[#0f172a] border-white/10 text-slate-100'
          }`}>
            <button
              onClick={() => setQrModalCampaign(null)}
              className={`absolute right-5 top-5 p-1.5 rounded-full hover:bg-white/10 transition-colors ${
                isLight ? 'text-slate-700 hover:bg-slate-100' : 'text-slate-400'
              }`}
            >
              <X size={18} />
            </button>

            <div className="w-12 h-12 mx-auto mb-3 rounded-2xl bg-[#c9a84c]/10 border border-[#c9a84c]/30 text-[#c9a84c] flex items-center justify-center">
              <QrCode size={24} />
            </div>

            <h3 className="text-lg font-serif font-light">{qrModalCampaign.name}</h3>
            <p className={`text-xs font-mono mt-1 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
              Download QR Code for print/flyers or share directly to social media.
            </p>

            {/* Canvas QR Code Display */}
            <div className="my-5 flex justify-center">
              <div className="p-3 bg-white rounded-2xl shadow-xl border border-slate-200">
                <canvas ref={qrCanvasRef} />
              </div>
            </div>

            {/* Copy Link & Social Share Action Strip */}
            <div className="space-y-2 font-mono text-xs">
              <div className={`p-2.5 rounded-xl border flex items-center justify-between gap-2 ${
                isLight ? 'bg-slate-50 border-slate-300' : 'bg-slate-950 border-white/10'
              }`}>
                <span className={`truncate text-[11px] font-semibold ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>{qrModalCampaign.targetUrl}</span>
                <button
                  onClick={() => handleCopyUrl(qrModalCampaign.targetUrl, qrModalCampaign.id)}
                  className="px-2.5 py-1 bg-[#6366f1] text-white rounded-lg font-bold text-[10px] uppercase flex items-center gap-1 hover:opacity-90 transition-all flex-shrink-0"
                >
                  {copiedId === qrModalCampaign.id ? <Check size={12} /> : <Copy size={12} />}
                  <span>{copiedId === qrModalCampaign.id ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              {/* 1-Click WhatsApp & Email share */}
              <div className="grid grid-cols-2 gap-2 pt-2">
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(`Check out this luxury vehicle offer: ${qrModalCampaign.targetUrl}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl bg-emerald-500 text-white font-bold flex items-center justify-center gap-1.5 hover:bg-emerald-600 transition-all"
                >
                  <MessageSquare size={14} />
                  <span>Share WhatsApp</span>
                </a>

                <a
                  href={`mailto:?subject=${encodeURIComponent(qrModalCampaign.name)}&body=${encodeURIComponent(`View listing: ${qrModalCampaign.targetUrl}`)}`}
                  className="p-2.5 rounded-xl bg-indigo-600 text-white font-bold flex items-center justify-center gap-1.5 hover:bg-indigo-700 transition-all"
                >
                  <Sparkles size={14} />
                  <span>Share Email</span>
                </a>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* --- MODAL 3: Edit Ad Campaign Details Modal --- */}
      {editingCampaign && createPortal(
        <div className="fixed inset-0 z-[999999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto crm-scroll">
          <div className={`w-full max-w-xl my-auto max-h-[90vh] overflow-y-auto crm-scroll p-6 rounded-3xl border shadow-2xl transition-all font-sans relative ${
            isLight
              ? 'bg-white border-[#c9a84c]/60 text-slate-900 shadow-[0_0_30px_rgba(201,168,76,0.25)]'
              : 'bg-[#0f172a] border-[#c9a84c]/40 text-slate-100 shadow-[0_0_35px_rgba(201,168,76,0.3)]'
          }`}>
            <button
              onClick={() => setEditingCampaign(null)}
              className="absolute right-5 top-5 p-1.5 rounded-full hover:bg-white/10 text-slate-400 hover:text-slate-200"
            >
              <X size={18} />
            </button>

            {(() => {
              const isOmniEdit = editingCampaign.id?.startsWith('cmp-wiz-') || editingCampaign.platform?.includes(',') || editingCampaign.platform?.includes('Omnichannel')

              return (
                <div>
                  <div className="flex items-center gap-3 mb-4 border-b border-white/10 pb-3">
                    <div className={`p-3 rounded-xl border ${
                      isOmniEdit
                        ? 'bg-[#c9a84c]/20 text-[#c9a84c] border-[#c9a84c]/30'
                        : 'bg-blue-500/10 text-blue-500 border-blue-500/30'
                    }`}>
                      {isOmniEdit ? <Sparkles size={22} /> : <Edit3 size={20} />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-base font-serif font-bold">
                          {isOmniEdit ? 'Edit Omnichannel Campaign Suite' : 'Edit Campaign Details'}
                        </span>
                        {isOmniEdit && (
                          <span className="px-2 py-0.5 rounded bg-[#c9a84c]/20 text-[#c9a84c] border border-[#c9a84c]/30 text-[9px] font-mono font-bold uppercase">
                            Omnichannel Mode
                          </span>
                        )}
                      </div>
                      <p className={`text-xs font-mono mt-0.5 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                        Campaign ID: <span className="text-[#c9a84c] font-bold">{editingCampaign.id}</span>
                      </p>
                    </div>
                  </div>

                  <form onSubmit={handleSaveEditSubmit} className="space-y-4 font-mono text-xs">
                    <div>
                      <label className={`block font-bold mb-1 uppercase tracking-wider ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                        Campaign Variant Name
                      </label>
                      <input
                        type="text"
                        value={editFormData.name}
                        onChange={e => setEditFormData({ ...editFormData, name: e.target.value })}
                        className={`w-full border rounded-xl px-3 py-2 text-xs font-mono outline-none ${
                          isLight ? 'bg-slate-50 border-slate-300 text-slate-900 focus:border-[#c9a84c]' : 'bg-slate-950 border-white/10 text-slate-100 focus:border-[#c9a84c]'
                        }`}
                      />
                    </div>

                    <div>
                      <label className={`block font-bold mb-1 uppercase tracking-wider ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                        Bound Inventory Vehicle
                      </label>
                      <PredictiveSelect
                        options={availableVehicles.map(v => ({
                          value: String(v.id),
                          label: `${v.name} (${v.price})`,
                          badge: v.category
                        }))}
                        value={String(editFormData.vehicleId)}
                        onChange={val => setEditFormData({ ...editFormData, vehicleId: val })}
                        isLight={isLight}
                      />
                    </div>

                    {/* Platform Selector or Channel Toggles */}
                    {isOmniEdit ? (
                      <div>
                        <label className={`block font-bold mb-1.5 uppercase tracking-wider ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                          Active Omnichannel Channels
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          {['Facebook Paid Ads', 'Instagram Paid Ads', 'WhatsApp Campaign', 'Email Broadcast', 'Showroom QR', 'TikTok / Social', 'YouTube Video', 'Classified Portals'].map(ch => {
                            const active = Array.isArray(editFormData.channels) && editFormData.channels.includes(ch)
                            return (
                              <button
                                key={ch}
                                type="button"
                                onClick={() => {
                                  const current = Array.isArray(editFormData.channels) ? [...editFormData.channels] : []
                                  const next = active ? current.filter(c => c !== ch) : [...current, ch]
                                  setEditFormData({ ...editFormData, channels: next })
                                }}
                                className={`p-2 rounded-xl border text-left text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                                  active
                                    ? 'bg-[#c9a84c]/20 border-[#c9a84c] text-[#c9a84c]'
                                    : isLight ? 'bg-slate-50 border-slate-200 text-slate-600' : 'bg-slate-900 border-white/10 text-slate-400'
                                }`}
                              >
                                <span>{ch}</span>
                                {active && <Check size={14} className="text-[#c9a84c]" />}
                              </button>
                            )
                          })}
                        </div>
                      </div>
                    ) : (
                      <div>
                        <label className={`block font-bold mb-1 uppercase tracking-wider ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                          Ad Platform
                        </label>
                        <PredictiveSelect
                          options={[
                            { value: 'Facebook Paid Ads', label: 'Facebook Paid Ads', badge: 'Paid Ad' },
                            { value: 'Instagram Paid Ads', label: 'Instagram Paid Ads', badge: 'Paid Ad' },
                            { value: 'WhatsApp Campaign', label: 'WhatsApp Campaign', badge: 'Chat' },
                            { value: 'Email Newsletter', label: 'Email Newsletter', badge: 'Direct' },
                            { value: 'Google Ads PPC', label: 'Google Ads PPC', badge: 'Paid Search' },
                            { value: 'TikTok / Social', label: 'TikTok / Social', badge: 'Influencer' },
                            { value: 'Classified Portals', label: 'Classified Portals', badge: 'Portal' },
                            { value: 'YouTube Video & Shorts', label: 'YouTube Video & Shorts', badge: 'Video' },
                            { value: 'Instagram Reels & Bio', label: 'Instagram Reels & Bio', badge: 'Social' },
                            { value: 'SMS Bulk Outreach', label: 'SMS Bulk Outreach', badge: 'Mobile' },
                            { value: 'Showroom QR Code', label: 'Showroom QR Code', badge: 'Print QR' },
                            { value: 'Google Maps / Local SEO', label: 'Google Maps / Local SEO', badge: 'SEO' },
                            { value: 'LinkedIn Executive B2B', label: 'LinkedIn Executive B2B', badge: 'B2B' }
                          ]}
                          value={editFormData.platform}
                          onChange={val => setEditFormData({ ...editFormData, platform: val || 'Facebook Paid Ads' })}
                          isLight={isLight}
                        />
                      </div>
                    )}

                    {/* Budget Controls */}
                    <div className={`p-3 rounded-2xl border space-y-2 ${
                      isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-white/10'
                    }`}>
                      <div className="flex items-center justify-between gap-2">
                        <label className={`block uppercase tracking-wider font-bold ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>
                          Ad Budget (KES)
                        </label>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-[#c9a84c]">KES</span>
                          <input
                            type="number"
                            min={1000}
                            step={5000}
                            value={editFormData.budget}
                            onChange={e => setEditFormData({ ...editFormData, budget: Math.max(0, Number(e.target.value)) })}
                            className={`w-36 px-3 py-1.5 rounded-xl border text-right font-mono font-bold text-sm outline-none ${
                              isLight ? 'bg-white border-slate-300 text-slate-900 focus:border-[#c9a84c]' : 'bg-slate-900 border-white/20 text-[#c9a84c] focus:border-[#c9a84c]'
                            }`}
                          />
                        </div>
                      </div>

                      <input
                        type="range"
                        min={5000}
                        max={1000000}
                        step={5000}
                        value={editFormData.budget}
                        onChange={e => setEditFormData({ ...editFormData, budget: Number(e.target.value) })}
                        className="w-full accent-[#c9a84c] cursor-pointer"
                      />
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
                      <button
                        type="button"
                        onClick={() => setEditingCampaign(null)}
                        className={`px-4 py-2 rounded-xl border text-xs font-mono font-bold ${
                          isLight ? 'bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200' : 'bg-slate-900 border-white/10 text-slate-300 hover:text-white'
                        }`}
                      >
                        Cancel
                      </button>

                      <button
                        type="submit"
                        className="px-6 py-2.5 rounded-xl bg-[#c9a84c] text-slate-950 font-bold text-xs uppercase tracking-wider hover:bg-[#d9b85c] transition-all shadow-lg flex items-center gap-1.5 cursor-pointer"
                      >
                        <Sparkles size={15} />
                        <span>Save Omnichannel Adjustments</span>
                      </button>
                    </div>
                  </form>
                </div>
              )
            })()}
          </div>
        </div>,
        document.body
      )}

      {/* --- MODAL 4: Delete Confirmation Dialog Modal --- */}
      {deletingCampaign && createPortal(
        <div className="fixed inset-0 z-[999999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto crm-scroll">
          <div className={`w-full max-w-md my-auto max-h-[90vh] overflow-y-auto crm-scroll p-6 rounded-3xl border shadow-2xl transition-all font-sans relative text-center ${
            isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-[#0f172a] border-white/10 text-slate-100'
          }`}>
            <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-500 flex items-center justify-center shadow-lg shadow-rose-500/10">
              <AlertTriangle size={28} />
            </div>

            <h3 className="text-xl font-serif font-light text-rose-500">Delete Ad Campaign?</h3>
            <p className={`text-xs font-mono mt-2 ${isLight ? 'text-slate-700 font-medium' : 'text-slate-300'}`}>
              Are you sure you want to delete campaign <span className={`font-bold px-1.5 py-0.5 rounded ${isLight ? 'bg-slate-200 text-slate-900' : 'bg-slate-800 text-white'}`}>{deletingCampaign.name}</span> (<span className="text-[#c9a84c]">{deletingCampaign.id}</span>)?
            </p>
            <p className={`text-[11px] font-mono mt-1 ${isLight ? 'text-slate-500 font-semibold' : 'text-slate-500'}`}>
              Historical click logs will remain archived in telemetry reports.
            </p>

            <div className="flex items-center justify-center gap-3 mt-6 pt-3 border-t border-white/10 font-mono text-xs">
              <button
                type="button"
                onClick={() => setDeletingCampaign(null)}
                className={`px-5 py-2.5 rounded-xl border font-bold ${
                  isLight ? 'border-slate-300 text-slate-700 hover:bg-slate-100' : 'border-white/10 text-slate-300 hover:bg-white/5'
                }`}
              >
                Cancel Keep Campaign
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 text-white font-bold uppercase tracking-wider hover:opacity-90 transition-all shadow-lg shadow-rose-600/30"
              >
                Yes Delete Campaign
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* --- MODAL 5: ROI Mathematics & ROAS Financial Intelligence Modal --- */}
      {isRoiModalOpen && createPortal(
        <div className="fixed inset-0 z-[999999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto crm-scroll">
          <div className={`w-full max-w-2xl my-auto max-h-[90vh] overflow-y-auto crm-scroll p-6 rounded-3xl border shadow-2xl transition-all font-sans relative ${
            isLight
              ? 'bg-white border-[#c9a84c]/60 text-slate-900 shadow-[0_0_30px_rgba(201,168,76,0.25)]'
              : 'bg-[#0f172a] border-[#c9a84c]/40 text-slate-100 shadow-[0_0_35px_rgba(201,168,76,0.3)]'
          }`}>
            <button
              onClick={() => setIsRoiModalOpen(false)}
              className={`absolute right-5 top-5 p-1.5 rounded-full hover:bg-white/10 transition-colors ${
                isLight ? 'text-slate-700 hover:bg-slate-100' : 'text-slate-400'
              }`}
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-3 mb-4 border-b pb-4 border-white/10">
              <div className="p-3 rounded-xl bg-amber-500/10 text-[#c9a84c] border border-[#c9a84c]/30">
                <TrendingUp size={24} />
              </div>
              <div>
                <div className="text-[10px] font-mono font-bold tracking-[2.5px] uppercase text-[#c9a84c]">
                  Executive Intelligence Report
                </div>
                <h3 className="text-xl font-serif font-light">ROI &amp; ROAS Mathematics Guide</h3>
              </div>
            </div>

            <div className="space-y-5 font-mono text-xs">
              {/* Mathematics Breakdown Section */}
              <div className={`p-4 rounded-2xl border space-y-3 ${
                isLight ? 'bg-slate-100 border-slate-300 text-slate-900' : 'bg-slate-900/60 border-white/10 text-slate-100'
              }`}>
                <h4 className="font-bold text-sm text-[#c9a84c] flex items-center gap-2">
                  <Award size={16} />
                  <span>Paid Ad Return on Investment Formulas</span>
                </h4>
                <div className="space-y-2 text-[11px] leading-relaxed">
                  <p className={`p-2.5 rounded border ${
                    isLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-black/20 border-white/5 text-slate-200'
                  }`}>
                    <strong className="text-[#6366f1]">ROAS Multiplier:</strong> (Gross Dealer Profit / Total Ad Spend)<br />
                    <span className={isLight ? 'text-slate-700 font-semibold' : 'text-slate-400'}>
                      Example: KES 600,000 Profit / KES 25,000 Spend = <strong className={isLight ? 'text-slate-900' : 'text-white'}>24x ROAS (2,400% ROI)</strong>
                    </span>
                  </p>
                  <p className={`p-2.5 rounded border ${
                    isLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-black/20 border-white/5 text-slate-200'
                  }`}>
                    <strong className="text-emerald-600">Cost Per Lead (CPL):</strong> (Ad Spend / Qualified Buyer Inquiries)<br />
                    <span className={isLight ? 'text-slate-700 font-semibold' : 'text-slate-400'}>
                      Example: KES 25,000 / 28 Leads = <strong className={isLight ? 'text-slate-900' : 'text-white'}>KES 892 per Lead</strong>
                    </span>
                  </p>
                  <p className={`p-2.5 rounded border ${
                    isLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-black/20 border-white/5 text-slate-200'
                  }`}>
                    <strong className="text-cyan-600">Organic Yield Per Click:</strong> (Closed Sales Value / Organic Link Clicks)<br />
                    <span className={isLight ? 'text-slate-700 font-semibold' : 'text-slate-400'}>
                      Example: WhatsApp KES 38M Sale / 184 Clicks = <strong className={isLight ? 'text-slate-900' : 'text-white'}>KES 206,521 / Click</strong>
                    </span>
                  </p>
                </div>
              </div>

              {/* Interactive ROAS Simulator */}
              <div className={`p-4 rounded-2xl border space-y-3 ${
                isLight ? 'bg-amber-50 border-amber-300 text-slate-900' : 'bg-amber-950/20 border-amber-500/30 text-slate-100'
              }`}>
                <h4 className="font-bold text-sm text-[#c9a84c] flex items-center gap-2">
                  <Zap size={16} />
                  <span>Interactive Ad ROAS Simulator</span>
                </h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className={`block text-[10px] uppercase font-bold mb-1 ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>
                      Ad Campaign Budget (KES)
                    </label>
                    <input
                      type="number"
                      value={simBudget}
                      onChange={e => setSimBudget(e.target.value)}
                      className={`w-full border rounded-xl px-3 py-2 text-xs font-mono outline-none ${
                        isLight ? 'bg-white border-slate-300 text-slate-900 font-bold' : 'bg-slate-950 border-white/10 text-slate-100'
                      }`}
                    />
                  </div>

                  <div>
                    <label className={`block text-[10px] uppercase font-bold mb-1 ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>
                      Expected Car Profit Margin (KES)
                    </label>
                    <input
                      type="number"
                      value={simMargin}
                      onChange={e => setSimMargin(e.target.value)}
                      className={`w-full border rounded-xl px-3 py-2 text-xs font-mono outline-none ${
                        isLight ? 'bg-white border-slate-300 text-slate-900 font-bold' : 'bg-slate-950 border-white/10 text-slate-100'
                      }`}
                    />
                  </div>
                </div>

                {/* Calculated Output Display */}
                {Number(simBudget) > 0 && (
                  <div className={`p-3 rounded-xl border flex items-center justify-between font-mono ${
                    isLight ? 'bg-amber-100/80 border-amber-400 text-amber-950' : 'bg-black/40 border-[#c9a84c]/40'
                  }`}>
                    <div>
                      <span className={`text-[10px] uppercase block font-bold ${isLight ? 'text-amber-800' : 'text-slate-400'}`}>Projected ROAS Multiplier</span>
                      <strong className="text-xl text-[#c9a84c]">
                        {(Number(simMargin) / Number(simBudget)).toFixed(1)}x ROAS
                      </strong>
                    </div>

                    <div className="text-right">
                      <span className={`text-[10px] uppercase block font-bold ${isLight ? 'text-amber-800' : 'text-slate-400'}`}>Net Profit Contribution</span>
                      <strong className={isLight ? 'text-emerald-700 text-lg font-black' : 'text-emerald-400 text-lg'}>
                        +KES {(Number(simMargin) - Number(simBudget)).toLocaleString()}
                      </strong>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-3 border-t border-white/10">
                <button
                  onClick={handleExportCSV}
                  className="px-4 py-2 bg-[#6366f1] text-white rounded-xl font-bold uppercase tracking-wider flex items-center gap-1.5 hover:opacity-90 transition-all shadow-lg"
                >
                  <Download size={14} />
                  <span>Download Financial CSV</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsRoiModalOpen(false)}
                  className={`px-5 py-2 rounded-xl border font-bold ${
                    isLight ? 'border-slate-300 text-slate-700 hover:bg-slate-100' : 'border-white/10 text-slate-300 hover:bg-white/5'
                  }`}
                >
                  Close Report
                </button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* --- MODAL 6: AI Campaign Planner & Inventory Velocity Engine --- */}
      {isPlannerModalOpen && createPortal(
        <div className="fixed inset-0 z-[999999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto crm-scroll">
          <div className={`w-full max-w-2xl my-auto max-h-[90vh] overflow-y-auto crm-scroll p-6 rounded-3xl border shadow-2xl transition-all font-sans relative ${
            isLight
              ? 'bg-white border-[#c9a84c]/60 text-slate-900 shadow-[0_0_30px_rgba(201,168,76,0.25)]'
              : 'bg-[#0f172a] border-[#c9a84c]/40 text-slate-100 shadow-[0_0_35px_rgba(201,168,76,0.3)]'
          }`}>
            <button
              onClick={() => setIsPlannerModalOpen(false)}
              className={`absolute right-5 top-5 p-1.5 rounded-full hover:bg-white/10 transition-colors ${
                isLight ? 'text-slate-700' : 'text-slate-400'
              }`}
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-3 mb-4 border-b pb-4 border-white/10">
              <div className="p-3 rounded-xl bg-indigo-500/10 text-[#6366f1] border border-[#6366f1]/30">
                <Zap size={24} />
              </div>
              <div>
                <div className="text-[10px] font-mono font-bold tracking-[2.5px] uppercase text-[#6366f1]">
                  Proactive Campaign Engine
                </div>
                <h3 className="text-xl font-serif font-light">AI Campaign Planner &amp; Stock Matcher</h3>
              </div>
            </div>

            <div className="space-y-5 font-mono text-xs">
              {/* Aged Inventory Scan Alert */}
              <div className={`p-4 rounded-2xl border space-y-3 ${
                isLight ? 'bg-indigo-50 border-indigo-200 text-slate-900' : 'bg-indigo-950/20 border-indigo-500/30 text-slate-100'
              }`}>
                <h4 className="font-bold text-sm text-[#6366f1] flex items-center gap-2">
                  <Car size={16} />
                  <span>Aged Inventory Liquidation Scan (&gt;30 Days Stock)</span>
                </h4>

                <div className={`p-3 rounded-xl border space-y-2 ${
                  isLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-black/20 border-white/5 text-slate-200'
                }`}>
                  <div className="flex items-center justify-between">
                    <span className={`font-bold ${isLight ? 'text-slate-900' : 'text-slate-200'}`}>2019 LANDCRUISER PRADO KAKADU</span>
                    <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-700 dark:text-amber-400 border border-amber-500/30 text-[10px] font-bold">
                      42 DAYS IN SHOWROOM
                    </span>
                  </div>
                  <p className={`text-[11px] ${isLight ? 'text-slate-700 font-medium' : 'text-slate-400'}`}>
                    Price: <strong>KES 9,799,999</strong> | Est. Margin: <strong>KES 600,000</strong>
                  </p>

                  <div className={`p-2.5 rounded border text-[11px] ${
                    isLight ? 'bg-indigo-100/70 border-indigo-300 text-indigo-950 font-medium' : 'bg-indigo-500/10 border-indigo-500/30 text-[#6366f1]'
                  }`}>
                    <strong>🤖 AI Recommendation:</strong> Launch a dual <strong>Meta Paid Ads + WhatsApp Status Blast</strong> with a <strong>KES 35,000</strong> budget to generate 25 leads and close 2 sales within 10 days.
                  </div>
                </div>
              </div>

              {/* What-If Target Sales Volume Simulator */}
              <div className={`p-4 rounded-2xl border space-y-3 ${
                isLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-slate-900/60 border-white/10 text-slate-100'
              }`}>
                <h4 className={`font-bold text-sm flex items-center gap-2 ${isLight ? 'text-slate-900' : 'text-slate-200'}`}>
                  <Sliders size={16} className="text-cyan-500" />
                  <span>"What-If" Ad Budget &amp; Sales Simulator</span>
                </h4>

                <div>
                  <label className={`block text-[10px] uppercase font-bold mb-1 ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>
                    Desired Vehicle Sales Volume (Units)
                  </label>
                  <input
                    type="number"
                    value={targetSalesUnits}
                    onChange={e => setTargetSalesUnits(e.target.value)}
                    className={`w-full border rounded-xl px-3 py-2 text-xs font-mono outline-none ${
                      isLight ? 'bg-white border-slate-300 text-slate-900 font-bold' : 'bg-slate-950 border-white/10 text-slate-100'
                    }`}
                  />
                </div>

                <div className="grid grid-cols-3 gap-2 text-center pt-2">
                  <div className={`p-2.5 rounded-xl border ${isLight ? 'bg-white border-slate-300' : 'bg-black/30 border-white/5'}`}>
                    <span className={`text-[9px] uppercase block font-bold ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>Required Leads</span>
                    <strong className={`text-sm block ${isLight ? 'text-indigo-700 font-black' : 'text-indigo-400'}`}>{Number(targetSalesUnits) * 8} Leads</strong>
                  </div>
                  <div className={`p-2.5 rounded-xl border ${isLight ? 'bg-white border-slate-300' : 'bg-black/30 border-white/5'}`}>
                    <span className={`text-[9px] uppercase block font-bold ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>Target Ad Clicks</span>
                    <strong className={`text-sm block ${isLight ? 'text-cyan-700 font-black' : 'text-cyan-400'}`}>{Number(targetSalesUnits) * 120} Clicks</strong>
                  </div>
                  <div className={`p-2.5 rounded-xl border ${isLight ? 'bg-white border-slate-300' : 'bg-black/30 border-white/5'}`}>
                    <span className={`text-[9px] uppercase block font-bold ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>Suggested Budget</span>
                    <strong className={`text-sm block ${isLight ? 'text-amber-800 font-black' : 'text-amber-400'}`}>KES {(Number(targetSalesUnits) * 12000).toLocaleString()}</strong>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => {
                    setIsPlannerModalOpen(false)
                    setIsModalOpen(true)
                  }}
                  className="px-4 py-2.5 bg-gradient-to-r from-[#6366f1] via-[#06b6d4] to-[#c9a84c] text-white font-bold text-xs uppercase tracking-wider rounded-xl hover:opacity-90 transition-all shadow-lg flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus size={14} />
                  <span>Launch AI Campaign Now</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsPlannerModalOpen(false)}
                  className={`px-5 py-2.5 rounded-xl border font-bold ${
                    isLight ? 'border-slate-300 text-slate-700 hover:bg-slate-100' : 'border-white/10 text-slate-300 hover:bg-white/5'
                  }`}
                >
                  Close Planner
                </button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* --- MODAL 7: Closed-Loop Multi-Touch Revenue Attribution Matrix --- */}
      {isAttributionModalOpen && createPortal(
        <div className="fixed inset-0 z-[999999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto crm-scroll">
          <div className={`w-full max-w-3xl my-auto max-h-[90vh] overflow-y-auto crm-scroll p-6 rounded-3xl border shadow-2xl transition-all font-sans relative ${
            isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-[#0f172a] border-white/10 text-slate-100'
          }`}>
            <button
              onClick={() => setIsAttributionModalOpen(false)}
              className={`absolute right-5 top-5 p-1.5 rounded-full hover:bg-white/10 transition-colors ${
                isLight ? 'text-slate-700' : 'text-slate-400'
              }`}
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-3 mb-4 border-b pb-4 border-white/10">
              <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30">
                <Layers size={24} />
              </div>
              <div>
                <div className="text-[10px] font-mono font-bold tracking-[2.5px] uppercase text-cyan-600 dark:text-cyan-400">
                  Closed-Loop Revenue Matrix
                </div>
                <h3 className="text-xl font-serif font-light">W-Shaped Multi-Touch Attribution</h3>
              </div>
            </div>

            <div className="space-y-5 font-mono text-xs">
              {/* Attribution Weight Model Notice */}
              <div className={`p-4 rounded-2xl border ${
                isLight ? 'bg-cyan-50 border-cyan-200 text-slate-900' : 'bg-cyan-950/20 border-cyan-500/30 text-slate-300'
              }`}>
                <h4 className="font-bold text-sm text-cyan-600 dark:text-cyan-400 mb-1 flex items-center gap-2">
                  <ShieldCheck size={16} />
                  <span>W-Shaped Multi-Touch Weight Model</span>
                </h4>
                <p className={`text-[11px] leading-relaxed ${isLight ? 'text-slate-700 font-medium' : 'text-slate-300'}`}>
                  Revenue is attributed fairly across buyer touchpoints: <strong>20% First-Touch Discovery</strong>, <strong>20% Middle-Touch Nurturing</strong>, and <strong>60% Last-Touch Closing Action</strong>.
                </p>
              </div>

              {/* Touchpoint Journey Cards */}
              <div className="space-y-3">
                <h4 className={`font-bold text-sm ${isLight ? 'text-slate-900' : 'text-slate-200'}`}>Closed Deal Touchpoint Journeys</h4>

                {touchpointJourneys.map(j => (
                  <div key={j.id} className={`p-4 rounded-2xl border space-y-3 ${
                    isLight ? 'bg-slate-50 border-slate-300' : 'bg-slate-900/60 border-white/10'
                  }`}>
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b pb-2 border-slate-200 dark:border-white/10">
                      <div>
                        <strong className={`font-bold block text-sm ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>{j.customerName}</strong>
                        <span className={`text-[11px] ${isLight ? 'text-slate-600 font-semibold' : 'text-slate-400'}`}>{j.vehicleName}</span>
                      </div>
                      <div className="text-right">
                        <span className={`font-bold text-sm block ${isLight ? 'text-emerald-700 font-black' : 'text-emerald-400'}`}>KES {(j.dealValue || 0).toLocaleString()}</span>
                        <span className={`text-[10px] ${isLight ? 'text-slate-500 font-semibold' : 'text-slate-400'}`}>Closed: {j.closedDate}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                      {j.touchpoints.map((tp, idx) => (
                        <div key={idx} className={`p-2.5 rounded-xl border space-y-1 ${
                          isLight ? 'bg-white border-slate-300 text-slate-900 shadow-sm' : 'bg-black/30 border-white/5 text-slate-200'
                        }`}>
                          <span className="text-[10px] text-cyan-600 dark:text-cyan-400 font-bold block">{tp.stage}</span>
                          <span className={`text-xs font-bold block ${isLight ? 'text-slate-900' : 'text-slate-200'}`}>{tp.platform}</span>
                          <span className={`text-[10px] block font-mono ${isLight ? 'text-emerald-700 font-bold' : 'text-emerald-400'}`}>
                            Revenue Credit: KES {(tp.revenueShare || 0).toLocaleString()} ({tp.weightPct}%)
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsAttributionModalOpen(false)}
                  className={`px-5 py-2.5 rounded-xl border font-bold ${
                    isLight ? 'border-slate-300 text-slate-700 hover:bg-slate-100' : 'border-white/10 text-slate-300 hover:bg-white/5'
                  }`}
                >
                  Close Matrix
                </button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* --- MODAL WIZARD: 1-Click Omnichannel Campaign Launcher --- */}
      {showLauncherWizard && createPortal(
        <div className="fixed inset-0 z-[999999] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto crm-scroll animate-fade-in">
          <div className={`max-w-xl w-full my-auto max-h-[90vh] overflow-y-auto crm-scroll p-6 rounded-3xl border shadow-2xl relative font-sans transition-all duration-300 ${
            isLight
              ? 'bg-white border-[#c9a84c]/60 text-slate-900 shadow-[0_0_30px_rgba(201,168,76,0.25)]'
              : 'bg-[#0f172a] border-[#c9a84c]/40 text-slate-100 shadow-[0_0_35px_rgba(201,168,76,0.3)]'
          }`}>
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-[#c9a84c]/20 text-[#c9a84c] border border-[#c9a84c]/30">
                  <Sparkles size={20} />
                </div>
                <div>
                  <span className="text-[9px] uppercase font-mono font-bold text-[#c9a84c] tracking-widest block">3-Step Guided Setup</span>
                  <h3 className={`text-lg font-serif font-bold ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
                    Omnichannel Campaign Launcher Wizard
                  </h3>
                </div>
              </div>

              <button
                onClick={() => {
                  setShowLauncherWizard(false)
                  setWizardStep(1)
                }}
                className="p-1.5 rounded-full hover:bg-white/10 text-slate-400 hover:text-slate-200"
              >
                <X size={18} />
              </button>
            </div>

            {/* Step Progress Bar */}
            <div className="flex items-center justify-between gap-2 mb-6 font-mono text-xs">
              {[
                { step: 1, title: 'Offer & Stock' },
                { step: 2, title: 'Channel Grid' },
                { step: 3, title: 'Instant Launch' }
              ].map(s => (
                <div
                  key={s.step}
                  onClick={() => setWizardStep(s.step)}
                  className={`flex-1 p-2 rounded-xl border text-center cursor-pointer transition-all ${
                    wizardStep === s.step
                      ? 'bg-[#c9a84c]/20 border-[#c9a84c] text-[#c9a84c] font-bold'
                      : wizardStep > s.step
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 font-medium'
                      : isLight ? 'bg-slate-100 border-slate-200 text-slate-500' : 'bg-slate-900 border-white/10 text-slate-500'
                  }`}
                >
                  <div className="text-[10px] uppercase tracking-wider font-bold">Step 0{s.step}</div>
                  <div className="text-xs truncate">{s.title}</div>
                </div>
              ))}
            </div>

            <form onSubmit={handleWizardSubmit} className="space-y-4 text-xs font-mono">
              {wizardStep === 1 && (
                <div className="space-y-4">
                  <div>
                    <label className={`block uppercase tracking-wider mb-1 font-bold ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>
                      Campaign Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={wizardForm.name}
                      onChange={e => setWizardForm({ ...wizardForm, name: e.target.value })}
                      className={`w-full border rounded-xl px-3 py-2 outline-none ${
                        isLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-slate-950 border-white/10 text-slate-200'
                      }`}
                    />
                  </div>

                  <div>
                    <PredictiveSelect
                      label="Target Vehicle Stock Aligned *"
                      options={availableVehicles.map(v => ({
                        value: v.id,
                        label: v.name,
                        badge: v.price,
                        subtext: v.category
                      }))}
                      value={wizardForm.vehicle_id}
                      onChange={val => setWizardForm({ ...wizardForm, vehicle_id: val })}
                      isLight={isLight}
                    />
                  </div>

                  <div>
                    <label className={`block uppercase tracking-wider mb-1 font-bold ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>
                      Campaign Objective / Description
                    </label>
                    <textarea
                      rows={3}
                      value={wizardForm.description}
                      onChange={e => setWizardForm({ ...wizardForm, description: e.target.value })}
                      className={`w-full border rounded-xl px-3 py-2 outline-none font-sans ${
                        isLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-slate-950 border-white/10 text-slate-200'
                      }`}
                    />
                  </div>

                  <div className="pt-3 flex justify-end">
                    <button
                      type="button"
                      onClick={() => setWizardStep(2)}
                      className="px-5 py-2.5 bg-[#c9a84c] text-slate-950 font-bold rounded-xl text-xs uppercase hover:bg-[#d9b85c] cursor-pointer flex items-center gap-1.5"
                    >
                      <span>Next: Channels &amp; Budget</span>
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              )}

              {wizardStep === 2 && (
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className={`block uppercase tracking-wider font-bold ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>
                        Active Marketing Channels ({wizardForm.channels.length} Selected)
                      </label>
                      <span className="text-[10px] text-slate-400 font-mono font-normal">Scroll to view all 12 channels</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-56 overflow-y-auto crm-scroll p-1.5 border border-white/10 rounded-2xl">
                      {PLATFORM_PRESETS.map(preset => {
                        const channel = preset.name
                        const selected = wizardForm.channels.includes(channel)
                        const IconComponent = preset.icon
                        return (
                          <div
                            key={preset.id}
                            onClick={() => {
                              const newChannels = selected
                                ? wizardForm.channels.filter(c => c !== channel)
                                : [...wizardForm.channels, channel]
                              setWizardForm({ ...wizardForm, channels: newChannels })
                            }}
                            className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between gap-2 ${
                              selected
                                ? 'bg-[#c9a84c]/20 border-[#c9a84c] text-[#c9a84c] font-bold shadow-sm'
                                : isLight ? 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100' : 'bg-slate-950 border-white/10 text-slate-400 hover:text-slate-200'
                            }`}
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <div className="p-1.5 rounded-lg bg-[#c9a84c]/10 text-[#c9a84c] flex-shrink-0">
                                <IconComponent size={15} />
                              </div>
                              <span className="text-xs font-semibold leading-tight">{channel}</span>
                            </div>
                            {selected && <CheckCircle2 size={15} className="text-[#c9a84c] flex-shrink-0" />}
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  {/* Budget Setup with Manual Input & Slider */}
                  <div className={`p-4 rounded-2xl border space-y-3 ${
                    isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/60 border-white/10'
                  }`}>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <label className={`block uppercase tracking-wider font-bold ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>
                        Total Initial Budget (KES)
                      </label>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[#c9a84c]">KES</span>
                        <input
                          type="number"
                          min={1000}
                          step={5000}
                          value={wizardForm.budget}
                          onChange={e => setWizardForm({ ...wizardForm, budget: Math.max(0, Number(e.target.value)) })}
                          className={`w-36 px-3 py-1.5 rounded-xl border text-right font-mono font-bold text-sm outline-none ${
                            isLight ? 'bg-white border-slate-300 text-slate-900 focus:border-[#c9a84c]' : 'bg-slate-900 border-white/20 text-[#c9a84c] focus:border-[#c9a84c]'
                          }`}
                        />
                      </div>
                    </div>

                    <input
                      type="range"
                      min={10000}
                      max={2000000}
                      step={10000}
                      value={wizardForm.budget}
                      onChange={e => setWizardForm({ ...wizardForm, budget: e.target.value })}
                      className="w-full accent-[#c9a84c] cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                      <span>KES 10,000</span>
                      <span>KES 1,000,000</span>
                      <span>KES 2,000,000+</span>
                    </div>
                  </div>

                  <div className="pt-2 flex justify-between">
                    <button
                      type="button"
                      onClick={() => setWizardStep(1)}
                      className={`px-4 py-2 rounded-xl border text-xs font-bold uppercase ${
                        isLight ? 'border-slate-300 text-slate-700' : 'border-slate-700 text-slate-400'
                      }`}
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={() => setWizardStep(3)}
                      className="px-5 py-2.5 bg-[#c9a84c] text-slate-950 font-bold rounded-xl text-xs uppercase hover:bg-[#d9b85c] cursor-pointer flex items-center gap-1.5"
                    >
                      <span>Next: Review &amp; Launch</span>
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              )}

              {wizardStep === 3 && (
                <div className="space-y-4">
                  <div className={`p-4 rounded-2xl border space-y-2 ${
                    isLight ? 'bg-amber-50 border-amber-200 text-amber-950' : 'bg-amber-950/30 border-[#c9a84c]/30 text-slate-200'
                  }`}>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-bold text-[#c9a84c]">Campaign Summary</span>
                      <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">READY TO LAUNCH</span>
                    </div>
                    <h4 className="text-sm font-serif font-bold text-[#c9a84c]">{wizardForm.name}</h4>
                    <div className="space-y-2 text-xs font-mono pt-1">
                      <div>Total Budget: <strong className="text-[#c9a84c] font-bold">KES {Number(wizardForm.budget).toLocaleString()}</strong></div>
                      
                      <div className="pt-2">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1.5">
                          Selected Active Channels ({wizardForm.channels.length}):
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {wizardForm.channels.length === 0 ? (
                            <span className="text-xs text-amber-500 font-medium italic">No channels selected — Please go back to Step 2 to select channels.</span>
                          ) : (
                            wizardForm.channels.map(ch => (
                              <span key={ch} className="px-2.5 py-1 rounded-lg bg-[#c9a84c]/20 border border-[#c9a84c]/40 text-[#c9a84c] text-xs font-bold font-mono flex items-center gap-1">
                                <CheckCircle2 size={12} className="text-[#c9a84c]" />
                                <span>{ch}</span>
                              </span>
                            ))
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 flex justify-between">
                    <button
                      type="button"
                      onClick={() => setWizardStep(2)}
                      className={`px-4 py-2 rounded-xl border text-xs font-bold uppercase ${
                        isLight ? 'border-slate-300 text-slate-700' : 'border-slate-700 text-slate-400'
                      }`}
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-[#c9a84c] text-slate-950 font-bold rounded-xl text-xs uppercase hover:bg-[#d9b85c] shadow-lg cursor-pointer flex items-center gap-2"
                    >
                      <Sparkles size={16} />
                      <span>Launch Omnichannel Campaign</span>
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* --- MODAL: Multi-Touch Prospect Journey Timeline --- */}
      {selectedJourneyModal && createPortal(
        <div className="fixed inset-0 z-[999999] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto crm-scroll animate-fade-in">
          <div className={`max-w-xl w-full my-auto max-h-[90vh] overflow-y-auto crm-scroll p-6 rounded-3xl border shadow-2xl relative font-sans transition-all duration-300 ${
            isLight
              ? 'bg-white border-[#c9a84c]/60 text-slate-900 shadow-[0_0_30px_rgba(201,168,76,0.25)]'
              : 'bg-[#0f172a] border-[#c9a84c]/40 text-slate-100 shadow-[0_0_35px_rgba(201,168,76,0.3)]'
          }`}>
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
                  <Layers size={20} />
                </div>
                <div>
                  <span className="text-[9px] uppercase font-mono font-bold text-purple-400 tracking-widest block">Attribution Path</span>
                  <h3 className={`text-lg font-serif font-bold ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
                    {selectedJourneyModal.customerName || selectedJourneyModal.vehicleName}
                  </h3>
                </div>
              </div>

              <button
                onClick={() => setSelectedJourneyModal(null)}
                className="p-1.5 rounded-full hover:bg-white/10 text-slate-400 hover:text-slate-200"
              >
                <X size={18} />
              </button>
            </div>

            {/* Touchpoint Timeline */}
            <div className="space-y-4 font-mono text-xs">
              <div className={`p-3.5 rounded-xl border flex items-center justify-between ${
                isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/60 border-white/10'
              }`}>
                <div>
                  <span className="text-[9px] uppercase text-slate-400 font-bold block">Closed Deal Revenue</span>
                  <span className="text-sm font-bold text-[#c9a84c]">
                    KES {Number(selectedJourneyModal.dealValue || 24500000).toLocaleString()}
                  </span>
                </div>
                <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
                  WON DEAL
                </span>
              </div>

              <div className="space-y-3 pt-2">
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#c9a84c] block">
                  End-to-End Prospect Touchpoints
                </span>

                {(selectedJourneyModal.touchpoints || [
                  { stage: 'First Touch (20%)', platform: 'Meta Paid Ads', campaignId: 'cmp-meta-101', weightPct: 20, revenueShare: 4900000 },
                  { stage: 'Middle Nurture (20%)', platform: 'Showroom QR Code', campaignId: 'cmp-qr-104', weightPct: 20, revenueShare: 4900000 },
                  { stage: 'Last Touch Close (60%)', platform: 'WhatsApp Direct Chat', campaignId: 'cmp-wa-102', weightPct: 60, revenueShare: 14700000 }
                ]).map((tp, idx) => (
                  <div key={idx} className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 ${
                    isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900 border-white/10'
                  }`}>
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className="w-7 h-7 rounded-full bg-[#c9a84c]/20 text-[#c9a84c] border border-[#c9a84c]/30 flex items-center justify-center font-bold text-xs flex-shrink-0">
                        {idx + 1}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className={`font-bold text-xs truncate ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>{tp.platform}</div>
                        <div className="text-[10px] text-slate-400">{tp.stage} • {tp.weightPct}% Weight</div>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="font-bold text-xs text-[#c9a84c]">KES {Number(tp.revenueShare).toLocaleString()}</div>
                      <div className="text-[9px] text-slate-500 font-mono">Attributed</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 mt-5 border-t border-white/10 flex justify-end">
              <button
                onClick={() => setSelectedJourneyModal(null)}
                className="px-5 py-2 bg-[#c9a84c] text-slate-950 font-bold rounded-xl text-xs uppercase hover:bg-[#d9b85c] cursor-pointer"
              >
                Close Timeline
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

    </div>
  )
}
