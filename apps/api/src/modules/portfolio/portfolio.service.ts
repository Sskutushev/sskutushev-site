import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Prisma } from '@prisma/client';
import { GraphQLError } from 'graphql';
import { CacheService } from '../../cache/cache.service';
import { PrismaService } from '../../database/prisma.service';
import {
  Locale,
  type ManagedProfileModel,
  type PortfolioModel,
  type UpdateProfileInput,
} from './portfolio.models';

const profileSlug = 'sergey-kutushev';
const portfolioCacheKeys = ['portfolio:v2:ru', 'portfolio:v2:en'] as const;

@Injectable()
export class PortfolioService {
  constructor(
    private readonly config: ConfigService,
    private readonly prisma: PrismaService,
    private readonly cache: CacheService,
  ) {}

  async getPortfolio(locale: Locale): Promise<PortfolioModel> {
    const result = await this.cache.getOrLoad(`portfolio:v2:${locale}`, 60, 3600, async () => {
      const profile = await this.prisma.profile.findUniqueOrThrow({
        where: { slug: profileSlug },
        include: {
          skills: { orderBy: { priority: 'asc' } },
          socialLinks: { orderBy: { sortOrder: 'asc' } },
          experiences: {
            orderBy: { sortOrder: 'asc' },
            include: { highlights: { orderBy: { sortOrder: 'asc' } } },
          },
          caseStudies: {
            orderBy: { sortOrder: 'asc' },
            include: {
              translations: { where: { locale } },
              technologies: { include: { skill: true } },
            },
          },
        },
      });
      return {
        profile: {
          fullName: profile.fullName,
          headline: profile.headline,
          summary: profile.summary,
          location: profile.location,
          availability: profile.availability,
          yearsExperience: profile.yearsExperience,
          version: profile.version,
        },
        skills: profile.skills.map(({ name, category }) => ({ name, category })),
        experience: profile.experiences.map((item) => ({
          company: item.companyLabel,
          role: item.role,
          period: `${item.startDate.getUTCFullYear()} — ${item.endDate?.getUTCFullYear() ?? 'NOW'}`,
          summary: item.summary,
          highlights: item.highlights.map(({ title, description }) => `${title}: ${description}`),
        })),
        socialLinks: profile.socialLinks.map(({ type, url }) => ({ type, url })),
        caseStudies: profile.caseStudies.flatMap((item) => {
          const translation = item.translations[0];
          return translation
            ? [
                {
                  slug: item.slug,
                  title: translation.title,
                  problem: translation.problem,
                  approach: translation.approach,
                  result: translation.result,
                  technologies: item.technologies.map(({ skill }) => skill.name),
                },
              ]
            : [];
        }),
      };
    });
    return { ...result.value, stale: result.stale };
  }

  async updateProfile(input: UpdateProfileInput): Promise<ManagedProfileModel> {
    this.assertMutationsEnabled();
    const profile = await this.prisma.profile.findUnique({
      where: { slug: profileSlug },
      select: { id: true },
    });
    if (!profile) throw new NotFoundException('Profile not found');

    const data = this.profileUpdate(input);
    const updated = await this.prisma.$transaction(async (transaction) => {
      const result = await transaction.profile.updateMany({
        where: { id: profile.id, version: input.expectedVersion },
        data: { ...data, version: { increment: 1 } },
      });
      if (result.count !== 1) {
        throw new GraphQLError('Profile was updated by another request', {
          extensions: { code: 'CONFLICT', http: { status: 409 } },
        });
      }
      if (input.socialLinks) {
        await transaction.socialLink.deleteMany({ where: { profileId: profile.id } });
        if (input.socialLinks.length) {
          await transaction.socialLink.createMany({
            data: input.socialLinks.map((link, index) => ({
              profileId: profile.id,
              type: link.type,
              url: link.url,
              sortOrder: index + 1,
            })),
          });
        }
      }
      return transaction.profile.findUniqueOrThrow({
        where: { id: profile.id },
        include: { socialLinks: { orderBy: { sortOrder: 'asc' } } },
      });
    });
    await this.cache.delete(...portfolioCacheKeys);
    return {
      fullName: updated.fullName,
      headline: updated.headline,
      summary: updated.summary,
      location: updated.location,
      availability: updated.availability,
      yearsExperience: updated.yearsExperience,
      version: updated.version,
      updatedAt: updated.updatedAt,
      socialLinks: updated.socialLinks.map(({ type, url }) => ({ type, url })),
    };
  }

  private profileUpdate(input: UpdateProfileInput): Prisma.ProfileUpdateManyMutationInput {
    return {
      ...(input.fullName === undefined ? {} : { fullName: input.fullName }),
      ...(input.headline === undefined ? {} : { headline: input.headline }),
      ...(input.summary === undefined ? {} : { summary: input.summary }),
      ...(input.location === undefined ? {} : { location: input.location }),
      ...(input.availability === undefined ? {} : { availability: input.availability }),
      ...(input.yearsExperience === undefined ? {} : { yearsExperience: input.yearsExperience }),
    };
  }

  private assertMutationsEnabled(): void {
    if (!this.config.get<boolean>('ENABLE_MUTATIONS')) {
      throw new ForbiddenException('Mutations are disabled in this environment');
    }
  }
}
