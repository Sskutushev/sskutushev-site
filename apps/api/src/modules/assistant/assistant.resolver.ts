import { Args, Query, Resolver } from '@nestjs/graphql';
import { Locale } from '../portfolio/portfolio.models';
import { AssistantAnswerModel } from './assistant.models';
import { AssistantService } from './assistant.service';

@Resolver()
export class AssistantResolver {
  constructor(private readonly assistant: AssistantService) {}

  @Query(() => AssistantAnswerModel)
  askProfile(
    @Args('question', { type: () => String }) question: string,
    @Args('locale', { type: () => Locale }) locale: Locale,
  ): Promise<AssistantAnswerModel> {
    return this.assistant.ask(question, locale);
  }
}
