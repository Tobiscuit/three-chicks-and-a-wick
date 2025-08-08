describe('magicRequestV2Handler', () => {
  const baseEvent = {
    arguments: {
      prompt: 'Cozy library with vanilla and cedar',
      size: 'The Spark (8oz)',
      wick: 'Cotton',
      jar: 'Standard Tin',
    },
  };

  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  // Static mode removed; always AI. We only test error fallback now.

  // Note: AI-success path requires mocking an ESM module; we validate AI error fallback instead.

  test('falls back to error JSON when AI returns invalid', async () => {
    process.env.PREVIEW_MODE = 'ai';

    let run;
    jest.isolateModules(() => {
      const response = { text: () => 'not-json' };
      const model = { generateContent: jest.fn().mockResolvedValue({ response }) };
      const GoogleGenerativeAI = jest.fn().mockImplementation(() => ({ getGenerativeModel: () => model }));
      jest.doMock('@google/generative-ai', () => ({ GoogleGenerativeAI }), { virtual: true });
      const { magicRequestV2Handler } = require('./index');
      run = magicRequestV2Handler(baseEvent);
    });
    const res = await run;
    const parsed = JSON.parse(res.json);
    expect(parsed.candle.name).toBe('Your Magic Candle');
    expect(parsed.preview.blocks[1].text).toMatch(/error|AI/i);
  });
});


