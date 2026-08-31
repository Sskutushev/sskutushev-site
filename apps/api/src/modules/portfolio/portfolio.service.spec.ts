import { ForbiddenException } from '@nestjs/common';
import type { ConfigService } from '@nestjs/config';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { CacheService } from '../../cache/cache.service';
import type { PrismaService } from '../../database/prisma.service';
import { Locale } from './portfolio.models';
import { PortfolioService } from './portfolio.service';

const storedProfile = {
  id: 'profile-1',
  fullName: 'Sergey Kutushev',
  headline: 'Senior+ Fullstack / Product Engineer',
  summary: 'Backend-oriented product engineering.',
  location: 'Remote',
  availability: 'Open',
  yearsExperience: 11,
  version: 4,
  updatedAt: new Date('2026-08-28T00:00:00.000Z'),
  socialLinks: [{ type: 'GitHub', url: 'https://github.com/Sskutushev' }],
};

/** A profile with one localised row and one experience that has none. */
function readProfile(locale: string) {
  const translated = locale === 'ru';
  return {
    ...storedProfile,
    translations: translated
      ? [
          {
            headline: 'Инженер продукта',
            summary: 'Продуктовая инженерия с уклоном в backend.',
            location: 'Санкт-Петербург',
            availability: 'Открыт',
          },
        ]
      : [],
    skills: [{ name: 'NestJS', category: 'Backend' }],
    experiences: [
      {
        companyLabel: 'Refty.ai',
        role: 'Senior Fullstack Developer',
        startDate: new Date('2026-01-01T00:00:00.000Z'),
        endDate: null,
        summary: 'Базовый текст.',
        translations: translated ? [{ summary: 'Локализованный текст.' }] : [],
        highlights: [
          {
            title: 'Base title',
            description: 'base description',
            translations: translated
              ? [{ title: 'Ranking V3', description: 'три режима ранжирования' }]
              : [],
          },
        ],
      },
    ],
    caseStudies: [],
  };
}

function createReadService(locale: string) {
  const prisma = {
    profile: { findUniqueOrThrow: vi.fn().mockResolvedValue(readProfile(locale)) },
  };
  const cache = {
    getOrLoad: vi.fn(
      async (_key: string, _fresh: number, _stale: number, load: () => Promise<unknown>) => ({
        value: await load(),
        stale: false,
      }),
    ),
  };
  const service = new PortfolioService(
    { get: vi.fn(() => false) } as unknown as ConfigService,
    prisma as unknown as PrismaService,
    cache as unknown as CacheService,
  );
  return { service, prisma };
}

function createService(enabled = true) {
  const transaction = {
    profile: {
      updateMany: vi.fn().mockResolvedValue({ count: 1 }),
      findUniqueOrThrow: vi.fn().mockResolvedValue(storedProfile),
    },
    socialLink: {
      deleteMany: vi.fn().mockResolvedValue({ count: 1 }),
      createMany: vi.fn().mockResolvedValue({ count: 1 }),
    },
  };
  const prisma = {
    profile: { findUnique: vi.fn().mockResolvedValue({ id: 'profile-1' }) },
    $transaction: vi.fn((operation: (client: typeof transaction) => Promise<unknown>) =>
      operation(transaction),
    ),
  };
  const cache = { delete: vi.fn().mockResolvedValue(undefined) };
  const service = new PortfolioService(
    { get: vi.fn(() => enabled) } as unknown as ConfigService,
    prisma as unknown as PrismaService,
    cache as unknown as CacheService,
  );
  return { service, prisma, transaction, cache };
}

describe('PortfolioService read path', () => {
  beforeEach(() => vi.clearAllMocks());

  it('projects the requested locale across profile, summary and highlights', async () => {
    // A Russian heading over an English summary is the defect these tables
    // exist to remove; it is not enough for the case studies alone to translate.
    const { service, prisma } = createReadService('ru');
    const portfolio = await service.getPortfolio(Locale.RU);

    expect(prisma.profile.findUniqueOrThrow).toHaveBeenCalledWith(
      expect.objectContaining({
        include: expect.objectContaining({ translations: { where: { locale: 'ru' } } }),
      }),
    );
    expect(portfolio.profile.headline).toBe('Инженер продукта');
    expect(portfolio.experience[0]?.summary).toBe('Локализованный текст.');
    expect(portfolio.experience[0]?.highlights).toEqual(['Ranking V3: три режима ранжирования']);
  });

  it('falls back to the base columns when a locale has no row', async () => {
    // Adding a language stays a data change rather than a migration.
    const { service } = createReadService('en');
    const portfolio = await service.getPortfolio(Locale.EN);

    expect(portfolio.profile.headline).toBe(storedProfile.headline);
    expect(portfolio.experience[0]?.summary).toBe('Базовый текст.');
    expect(portfolio.experience[0]?.highlights).toEqual(['Base title: base description']);
  });
});

describe('PortfolioService write path', () => {
  beforeEach(() => vi.clearAllMocks());

  it('fails closed when mutations are disabled', async () => {
    const { service, prisma } = createService(false);
    await expect(
      service.updateProfile({ expectedVersion: 3, headline: 'Changed' }),
    ).rejects.toBeInstanceOf(ForbiddenException);
    expect(prisma.$transaction).not.toHaveBeenCalled();
  });

  it('updates profile and social links atomically, then invalidates localized caches', async () => {
    const { service, transaction, cache } = createService();
    const result = await service.updateProfile({
      expectedVersion: 3,
      headline: 'Senior+ Fullstack / Product Engineer',
      socialLinks: [{ type: 'GitHub', url: 'https://github.com/Sskutushev' }],
    });

    expect(transaction.profile.updateMany).toHaveBeenCalledWith({
      where: { id: 'profile-1', version: 3 },
      data: {
        headline: 'Senior+ Fullstack / Product Engineer',
        version: { increment: 1 },
      },
    });
    expect(transaction.socialLink.deleteMany).toHaveBeenCalledWith({
      where: { profileId: 'profile-1' },
    });
    expect(transaction.socialLink.createMany).toHaveBeenCalledWith({
      data: [
        {
          profileId: 'profile-1',
          type: 'GitHub',
          url: 'https://github.com/Sskutushev',
          sortOrder: 1,
        },
      ],
    });
    expect(cache.delete).toHaveBeenCalledWith('portfolio:v2:ru', 'portfolio:v2:en');
    expect(result).toMatchObject({ version: 4, socialLinks: storedProfile.socialLinks });
  });

  it('returns a named conflict when the expected version lost the race', async () => {
    const { service, transaction, cache } = createService();
    transaction.profile.updateMany.mockResolvedValue({ count: 0 });

    await expect(
      service.updateProfile({ expectedVersion: 2, summary: 'Stale write' }),
    ).rejects.toMatchObject({ extensions: { code: 'CONFLICT', http: { status: 409 } } });
    expect(transaction.socialLink.deleteMany).not.toHaveBeenCalled();
    expect(cache.delete).not.toHaveBeenCalled();
  });
});
