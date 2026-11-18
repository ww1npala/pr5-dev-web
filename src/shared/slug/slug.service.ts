import { Injectable } from '@nestjs/common';

@Injectable()
export class SlugService {
  private readonly cyrillicMap: Record<string, string> = {
    а: 'a',
    б: 'b',
    в: 'v',
    г: 'h',
    ґ: 'g',
    д: 'd',
    е: 'e',
    є: 'ye',
    ж: 'zh',
    з: 'z',
    и: 'y',
    і: 'i',
    ї: 'yi',
    й: 'y',
    к: 'k',
    л: 'l',
    м: 'm',
    н: 'n',
    о: 'o',
    п: 'p',
    р: 'r',
    с: 's',
    т: 't',
    у: 'u',
    ф: 'f',
    х: 'kh',
    ц: 'ts',
    ч: 'ch',
    ш: 'sh',
    щ: 'shch',
    ь: '',
    ю: 'yu',
    я: 'ya',
    ы: 'y',
    э: 'e',
    ъ: '',
  };

  generateSlug(title: string): string {
    const transliterated = title
      .toLowerCase()
      .split('')
      .map((char) =>
        Object.prototype.hasOwnProperty.call(this.cyrillicMap, char)
          ? this.cyrillicMap[char]
          : char,
      )
      .join('');

    return transliterated
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  }
}