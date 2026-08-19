// import image1 from '../../assets/Blogs/blog-1.jpg'
// import image2 from '../../assets/Blogs/blog-2.jpg'
// import image3 from '../../assets/Blogs/blog-3.jpg'
// import image4 from '../../assets/Blogs/blog-4.jpg'
// import image5 from '../../assets/Blogs/blog-5.jpg'
// import image6 from '../../assets/Blogs/blog-6.jpg'
// import image7 from '../../assets/Blogs/blog-7.jpg'
// import image8 from '../../assets/Blogs/blog-8.jpg'

// const date = new Date().toLocaleDateString()

// export const blogs = [
//   {
//     id: '0000.1',
//     image: image1,
//     status: 'Market Recovery',
//     date: date,
//     title: "Kenya's Auto Market Bounces Back — Sales Up 22% in 2025",
//     description:
//       "After years of declining new vehicle sales, Kenya's automotive sector has staged a strong comeback. New vehicle sales hit 12,427 units in the first eleven months of 2025 — already surpassing the entire 2024 total of 11,352 units, a 22.3% year-on-year jump. The Central Bank of Kenya cut its benchmark lending rate eight times, from 13% down to 9.25%, making vehicle financing significantly more accessible. Businesses in construction, transport and logistics responded by renewing fleets, while improved cash flow unlocked pent-up demand across the country.",
//   },
//   {
//     id: '0000.2',
//     image: image2,
//     status: 'Top Models',
//     date: date,
//     title: 'Isuzu D-Max Dominates 2025 — The Best-Selling Vehicle in Kenya',
//     description:
//       "Isuzu East Africa retained its commanding position as Kenya's top vehicle manufacturer, capturing a 52.2% market share in 2025 with 5,938 units sold between January and November — up 22.8% year on year. The Isuzu D-Max pickup leads all model rankings, up 30.9%, reflecting strong demand from agriculture, construction and logistics. The Toyota Hilux holds second place, surging 118.4%, while CFAO Motors and Simba Corporation follow Isuzu in the brand rankings. Trucks overall accounted for 5,496 units in 2025, making commercial vehicles the engine of Kenya's automotive recovery.",
//   },
//   {
//     id: '0000.3',
//     image: image3,
//     status: 'Used Cars',
//     date: date,
//     title: "Kenya's Used Car Market Hits $1.28 Billion — and It's Still Growing",
//     description:
//       "The Kenyan used car market is valued at USD 1.28 billion in 2025 and is forecast to reach USD 1.54 billion by 2031, growing at a 3.17% CAGR. A 329% surge in online searches for second-hand cars reflects just how aggressively buyers are shifting away from new vehicles. Rising inflation, high bank interest rates and heavy import duties on new cars have made pre-owned Japanese imports the vehicle of choice for the growing middle class. The 5–8-year-old bracket commands over 50% of used car transactions, though stricter age limits are pushing buyers toward newer stock.",
//   },
//   {
//     id: '0000.4',
//     image: image4,
//     status: 'Regulations',
//     date: date,
//     title: "The 8-Year Import Age Limit: What It Means for Kenyan Car Buyers",
//     description:
//       "Starting January 2025, Kenya enforces a strict 8-year age cap on all imported vehicles — a rule that is reshaping supply, pricing and the second-hand dealer landscape. Older, affordable units that previously flooded the market from Japan are now cut off, pushing average used car prices higher. Organised dealers who can finance newer stock are benefiting most, while informal roadside traders face inventory shortages. Buyers seeking budget options are feeling the squeeze, though the policy is broadly improving vehicle quality standards and reducing road safety risks from aging cars.",
//   },
//   {
//     id: '0000.5',
//     image: image5,
//     status: 'Electric Vehicles',
//     date: date,
//     title: "Is Kenya Ready for EVs? Green Number Plates, Roam & the EV Revolution",
//     description:
//       "Interest in electric vehicles in Kenya rose 41% between 2022 and 2024 and is accelerating. The government's Draft Electric Mobility Policy, issued March 2025, introduces green number plates for EVs and targets a 5% electric vehicle share of the market. Companies like Roam and BasiGo are already running electric buses on Nairobi routes, while EV charging infrastructure is slowly expanding. The cost-benefit analysis is improving — lower running costs and tax incentives are starting to offset higher purchase prices. For urban commuters, the question is no longer if but when.",
//   },
//   {
//     id: '0000.6',
//     image: image6,
//     status: 'SUVs & MPVs',
//     date: date,
//     title: "Why Kenyans Are Choosing SUVs and MPVs Over Saloon Cars",
//     description:
//       "Saloon car sales in Kenya hit a historic low in 2025, with just 31 units sold — a stark indicator of how consumer preferences have shifted. SUVs and MPVs now dominate the market, driven by Kenya's growing middle class, urban expansion and the practical realities of Kenyan roads. Compact SUVs are particularly popular in Nairobi, where traffic congestion makes maneuverability key, while full-size SUVs like the Land Cruiser Prado and GLE hold their ground in corporate and upcountry markets. Hatchbacks, led by the Honda Fit and Toyota Vitz, remain the affordable urban favourite.",
//   },
//   {
//     id: '0000.7',
//     image: image7,
//     status: 'Online Buying',
//     date: date,
//     title: "43% of Used Car Sales Now Happen Online — The Digital Shift in Kenya",
//     description:
//       "Online platforms now account for 43.28% of all used car transactions in Kenya and are growing at 8.14% annually. Platforms like Jiji, Peach Cars and Autochek are transforming how Kenyans buy cars — offering vehicle history checks, certified inspections and integrated financing in a single flow. Fintech-enabled auto loans are making it easier to buy from the comfort of a phone. Buyers no longer need to visit Kirinyaga Road to find a reliable vehicle. The shift to digital is also forcing informal dealers to adopt better practices or lose market share to organised, transparent competitors.",
//   },
//   {
//     id: '0000.8',
//     image: image8,
//     status: 'Honda Rising',
//     date: date,
//     title: "Honda Gains Ground on Toyota — Brand Trends Reshaping Kenya's Market",
//     description:
//       "Toyota remains the most searched vehicle brand in Kenya, with a steady 9% growth in interest. But Honda is closing the gap fast — brand interest surged 48% between 2022 and 2024, making it the fastest-growing major brand in the Kenyan market. The Honda Fit leads Honda's charge, prized for its fuel efficiency and reliability. Car insurance searches rose 37% over the same period, signalling growing vehicle ownership and financial awareness. Meanwhile, Mitsubishi made a surprise entry into the top three new vehicle brands in 2025, recording a 413.7% growth in sales from a low base.",
//   },
// ]

import { useEffect, useState, useCallback } from 'react'
import { supabase } from '../lib/superbaseClient.js'

/**
 * useBlogs — fetches blog posts from Supabase.
 *
 * @param {object}  options
 * @param {string}  options.select  - Supabase column selector (default: '*')
 * @param {number}  options.limit   - Max rows to fetch (default: undefined = all)
 * @param {string}  options.id      - Fetch a single post by id (default: undefined)
 *
 * @returns {{ blogs, blog, loading, error, refetch }}
 *
 * Usage examples
 * ──────────────
 * // All blogs (full fields)
 * const { blogs, loading } = useBlogs()
 *
 * // Lightweight list (RecentPost sidebar)
 * const { blogs } = useBlogs({ select: 'id,title,image_url,date,status', limit: 5 })
 *
 * // Single post (BlogDetails)
 * const { blog } = useBlogs({ id: '0000.1' })
 */
export function useBlogs({ select = '*', limit, id } = {}) {
  const [blogs,   setBlogs]   = useState([])
  const [blog,    setBlog]    = useState(null)
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      if (id) {
        // ── Single post ───────────────────────────────────────────────────
        const { data, error } = await supabase
          .from('blogs')
          .select(select)
          .eq('id', id)
          .single()

        if (error) throw error
        setBlog(data)
      } else {
        // ── List ──────────────────────────────────────────────────────────
        let query = supabase
          .from('blogs')
          .select(select)
          .order('date', { ascending: false })

        if (limit) query = query.limit(limit)

        const { data, error } = await query
        if (error) throw error
        const map = new Map()
        ;(data || []).forEach(b => {
          if (b.title && !map.has(b.title)) map.set(b.title, b)
        })
        setBlogs(Array.from(map.values()))
      }
    } catch (err) {
      setError(err)
    } finally {
      setLoading(false)
    }
  }, [select, limit, id])

  useEffect(() => { fetchData() }, [fetchData])

  return { blogs, blog, loading, error, refetch: fetchData }
}