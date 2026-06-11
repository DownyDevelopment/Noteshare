import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { amount, phone } = body;

    if (!amount || amount <= 0 || !phone) {
      return NextResponse.json(
        { success: false, error: 'Parameters are missing or invalid' },
        { status: 400 }
      );
    }

    if (amount < 10000) {
      return NextResponse.json(
        { success: false, error: 'Minimal withdrawal limit is Rp 10.000' },
        { status: 400 }
      );
    }

    // Simulate database and payment network latency (250ms)
    await new Promise((resolve) => setTimeout(resolve, 250));

    return NextResponse.json({
      success: true,
      withdrawalId: `TX-OUT-DANA-${Date.now()}`,
      destination: phone,
      amount: amount,
      status: 'COMPLETED',
      date: new Date().toISOString()
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Error processing withdrawal' },
      { status: 500 }
    );
  }
}
