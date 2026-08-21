import { NextRequest, NextResponse } from 'next/server'

// GET /api/withdrawals/:id - Get withdrawal details
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    // Database query will be implemented later
    
    return NextResponse.json({
      id,
      amount: 0,
      status: 'pending'
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch withdrawal' },
      { status: 500 }
    )
  }
}

// PATCH /api/withdrawals/:id - Update withdrawal status (admin only)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    
    // Auth check and database update will be implemented later
    
    return NextResponse.json({
      message: 'Withdrawal updated successfully'
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update withdrawal' },
      { status: 500 }
    )
  }
}
