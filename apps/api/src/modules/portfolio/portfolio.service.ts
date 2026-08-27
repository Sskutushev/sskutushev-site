import { Injectable } from '@nestjs/common';
import { CacheService } from '../../cache/cache.service';
import { PrismaService } from '../../database/prisma.service';
import { Locale, type PortfolioModel } from './portfolio.models';

@Injectable()
export class PortfolioService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cache: CacheService,
  ) {}

  async getPortfolio(locale: Locale): Promise<PortfolioModel> {
    const result = await this.cache.getOrLoad(`portfolio:v2:${locale}`, 60, 3600, async () => {
      const profile = await this.prisma.profile.findUniqueOrThrow({
        where: { slug: 'sergey-skutushev' },
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
}
