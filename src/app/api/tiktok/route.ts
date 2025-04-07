import { NextResponse } from 'next/server'

const TIKTOK_VIDEOS = [
  '7488112353528024326',
  '7488373471215471927',
  '7486511406398016774',
  '7489440434830298373',
]

export async function GET() {
  try {
    const videos = await Promise.all(
      TIKTOK_VIDEOS.map(async (videoId) => {
        const response = await fetch(
          `https://www.tiktok.com/oembed?url=https://www.tiktok.com/@legalistas.ar/video/${videoId}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json',
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Methods': 'GET',
              'Access-Control-Allow-Headers': 'Content-Type',
              'Access-Control-Allow-Credentials': 'true',
              'Access-Control-Max-Age': '3600',
            },
          }
        )
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        return await response.json()
      })
    )
    return NextResponse.json(videos)
  } catch (error) {
    console.error('Error fetching TikTok videos:', error)
    return NextResponse.json(
      { error: 'Failed to fetch TikTok videos' },
      { status: 500 }
    )
  }
}
