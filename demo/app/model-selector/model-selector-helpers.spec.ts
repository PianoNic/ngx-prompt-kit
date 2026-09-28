import {
  DEFAULT_PRICE_TIER_THRESHOLDS,
  highlightSegments,
  modelMatches,
  priceTier,
  type SelectorModel,
} from 'ngx-prompt-kit/model-selector';

describe('priceTier', () => {
  it('blends input and output 3:1 against the default thresholds', () => {
    expect(DEFAULT_PRICE_TIER_THRESHOLDS).toEqual({ low: 2.5, high: 10 });
    expect(priceTier(0.3, 2.5)).toBe(1); // blended 0.85
    expect(priceTier(1, 5)).toBe(1); // blended 2.0
    expect(priceTier(1.25, 10)).toBe(2); // blended 3.44
    expect(priceTier(3, 15)).toBe(2); // blended 6.0
    expect(priceTier(15, 75)).toBe(3); // blended 30
  });

  it('treats the thresholds as exclusive upper bounds', () => {
    expect(priceTier(0, 0)).toBe(1);
    expect(priceTier(2.5, 2.5)).toBe(2); // blended exactly low
    expect(priceTier(10, 10)).toBe(3); // blended exactly high
  });

  it('weights input three times heavier than output', () => {
    expect(priceTier(3, 1)).toBe(2); // blended 2.5
    expect(priceTier(1, 3)).toBe(1); // blended 1.5
  });

  it('accepts partial custom thresholds', () => {
    expect(priceTier(3, 15, { high: 5 })).toBe(3);
    expect(priceTier(3, 15, { low: 7 })).toBe(1);
    expect(priceTier(3, 15, { low: 1, high: 100 })).toBe(2);
  });

  it('rejects negative or non-finite prices and inverted thresholds', () => {
    expect(() => priceTier(-1, 1)).toThrow(RangeError);
    expect(() => priceTier(1, Number.NaN)).toThrow(RangeError);
    expect(() => priceTier(Number.POSITIVE_INFINITY, 1)).toThrow(RangeError);
    expect(() => priceTier(1, 1, { low: 10, high: 2 })).toThrow(RangeError);
  });
});

describe('highlightSegments', () => {
  it('returns the whole text unmatched for an empty query', () => {
    expect(highlightSegments('Codestral', '  ')).toEqual([{ text: 'Codestral', match: false }]);
  });

  it('marks every case-insensitive occurrence, keeping original casing', () => {
    expect(highlightSegments('Code for code', 'CODE')).toEqual([
      { text: 'Code', match: true },
      { text: ' for ', match: false },
      { text: 'code', match: true },
    ]);
  });
});

describe('modelMatches', () => {
  const model: SelectorModel = {
    id: 'm',
    name: 'Gemini 3 Flash',
    maker: 'Google',
    description: 'Very fast, with a huge context window.',
    capabilities: ['Vision'],
  };

  it('searches name, maker, description and capabilities', () => {
    expect(modelMatches(model, 'flash')).toBe(true);
    expect(modelMatches(model, 'GOOGLE')).toBe(true);
    expect(modelMatches(model, 'context')).toBe(true);
    expect(modelMatches(model, 'vision')).toBe(true);
    expect(modelMatches(model, 'reasoning')).toBe(false);
    expect(modelMatches(model, '')).toBe(true);
  });
});
