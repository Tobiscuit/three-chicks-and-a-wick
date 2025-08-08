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

  test('returns static payload when PREVIEW_MODE=static', async () => {
    process.env.PREVIEW_MODE = 'static';
    const { magicRequestV2Handler } = require('./index');
    const res = await magicRequestV2Handler(baseEvent);
    expect(res).toHaveProperty('json');
    const parsed = JSON.parse(res.json);
    expect(parsed.meta.mode).toBe('static');
    expect(parsed.candle.name).toMatch(/Your The Spark Magic Candle/);
    expect(parsed.preview.blocks[1].text).toMatch(/Inspired by your idea/);
  });

  test('returns ai payload when PREVIEW_MODE=ai and model yields JSON', async () => {
    process.env.PREVIEW_MODE = 'ai';

    // Mock Gemini SDK before loading handler
    const mockText = JSON.stringify({
      version: '1.0',
      candle: { name: 'Library Ember', size: 'The Spark (8oz)' },
      preview: { blocks: [ { type: 'heading', level: 2, text: 'Library Ember' } ] },
      design: { tokens: {}, classes: {} },
      animation: { entrance: 'fadeIn', durationMs: 300 }
    });

    jest.isolateModules(async () => {
      const response = { text: () => mockText };
      const model = { generateContent: jest.fn().mockResolvedValue({ response }) };
      const GoogleGenerativeAI = jest.fn().mockImplementation(() => ({ getGenerativeModel: () => model }));
      jest.doMock('@google/generative-ai', () => ({ GoogleGenerativeAI }), { virtual: true });

      const { magicRequestV2Handler } = require('./index');
      const res = await magicRequestV2Handler(baseEvent);
      const parsed = JSON.parse(res.json);
      expect(parsed.candle.name).toBe('Library Ember');
      // meta is added by handler for ai mode
      expect(parsed.meta && parsed.meta.mode).toBe('ai');
    });
  });

  test('falls back to static JSON when AI returns invalid', async () => {
    process.env.PREVIEW_MODE = 'ai';

    const response = { text: () => 'not-json' };
    const model = { generateContent: jest.fn().mockResolvedValue({ response }) };
    const GoogleGenerativeAI = jest.fn().mockImplementation(() => ({ getGenerativeModel: () => model }));
    jest.doMock('@google/generative-ai', () => ({ GoogleGenerativeAI }), { virtual: true });

    const { magicRequestV2Handler } = require('./index');
    const res = await magicRequestV2Handler(baseEvent);
    const parsed = JSON.parse(res.json);
    // The handler throws then returns fallback in catch with error message in paragraph
    expect(parsed.preview.blocks[1].text).toMatch(/AI/);
  });
});


