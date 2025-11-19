import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { date, time, service, name } = body || {}

    if (!date || !time || !service) {
      return NextResponse.json(
        {
          success: false,
          message: 'Missing required fields: date, time, and service are required',
        },
        { status: 400 }
      )
    }

    const scriptUrl = process.env.GOOGLE_CALENDAR_WEBAPP_URL

    if (!scriptUrl) {
      console.error('GOOGLE_CALENDAR_WEBAPP_URL is not configured')
      return NextResponse.json(
        {
          success: false,
          message: 'Calendar service is not configured. Please contact support.',
        },
        { status: 500 }
      )
    }

    const payload = {
      date,
      time,
      service,
      name: name || 'Availability Check',
      checkOnly: true,
    }

    const response = await fetch(scriptUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      cache: 'no-store',
    })

    let result: any = null
    try {
      result = await response.json()
    } catch (error) {
      console.error('Failed to parse availability response', error)
    }

    if (!response.ok || !result) {
      console.error('Availability check error from Google Script', { status: response.status, result })
      return NextResponse.json(
        {
          success: false,
          message: result?.message || 'Unable to verify calendar availability. Please try another time slot.',
          details: result,
        },
        { status: response.status === 200 ? 502 : response.status }
      )
    }

    if (result.success === false) {
      return NextResponse.json(
        {
          success: false,
          message: result.message || 'Selected time slot is no longer available. Please choose a different slot.',
          details: result,
        },
        { status: 409 }
      )
    }

    return NextResponse.json(
      {
        success: true,
        message: result.message || 'Slot is available.',
        data: result,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Calendar availability check failed:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to check calendar availability. Please try another slot.',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

