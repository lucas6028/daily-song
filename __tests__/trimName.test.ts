import { test, expect, describe } from 'vitest';
import { trimName } from 'lib/name';

describe('trimName function', () => {
  test('should trim the song name after hyphen (-)', () => {
    expect(trimName('這麼多年 - 電影《我想和你在一起》插曲')).toBe('這麼多年');
  });

  test('should trim the song name after parentheses ( )', () => {
    const cases = [
      { input: '3D (feat. Jack Harlow)', output: '3D' },
      {
        input: "A Beautiful Life(From the Netflix Film 'A Beautiful Life')",
        output: 'A Beautiful Life',
      },
    ];

    cases.forEach(({ input, output }) => {
      expect(trimName(input)).toBe(output);
    });
  });

  test('should not trim the name if no delimiter is present', () => {
    expect(trimName('Dream')).toBe('Dream');
  });
});
