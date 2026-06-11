import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { noteId, price, phone, pin } = body;

    // Validate inputs
    if (!noteId || !price || !phone || !pin) {
      return NextResponse.json(
        { success: false, error: 'Missing payment parameters' },
        { status: 400 }
      );
    }

    if (pin.length !== 6 || isNaN(Number(pin))) {
      return NextResponse.json(
        { success: false, error: 'Invalid PIN security format' },
        { status: 400 }
      );
    }

    // Simulate DANA payment processing delay (300ms)
    await new Promise((resolve) => setTimeout(resolve, 300));

    // Success response simulating webhook or gateway redirect success payload
    return NextResponse.json({
      success: true,
      transactionId: `TX-DANA-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      merchant: 'NoteShare ITS Academic',
      amount: price,
      date: new Date().toISOString(),
      status: 'PAID'
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Error processing payment' },
      { status: 500 }
    );
  }
}
