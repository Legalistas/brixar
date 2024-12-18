'use client'

import React, { useState, useEffect } from "react"
import QuickStats from "./components/QuickStats/QuickStats"
import Properties from "./components/Properties/Properties"
import Projects from "./components/Projects/Projects"
import { Property } from "@/types/property"

export default function AdminDashboard() {
  const [statistics, setStatistics] = useState({
    brixs: 0,
    totalBrixs: 0,
    projects: 0,
    properties: 0,
    allProperties: [] as Property[],
  })

  useEffect(() => {
    // Simulating data fetch
    setStatistics({
      brixs: 10,
      totalBrixs: 10 * 1000,
      projects: 1,
      properties: 2,
      allProperties: [], // This should be populated with actual Property objects
    })
  }, []) // Empty dependency array means this effect runs once on mount

  return (
    <div className="flex flex-col">
      <QuickStats statistics={statistics} />
      <div className="mt-4 grid grid-cols-12 gap-4">
        <div className="col-span-12 xl:col-span-9">
          <Properties />
        </div>
        <div className="col-span-12 xl:col-span-3 flex flex-col gap-7.5">
          <Projects count={statistics.projects} />
        </div>
      </div>
    </div>
  )
}

