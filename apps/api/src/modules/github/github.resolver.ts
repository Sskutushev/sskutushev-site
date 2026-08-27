import { Query, Resolver } from '@nestjs/graphql';
import { GithubActivityModel } from './github.models';
import { GithubService } from './github.service';

@Resolver()
export class GithubResolver {
  constructor(private readonly github: GithubService) {}

  @Query(() => GithubActivityModel)
  githubActivity(): Promise<GithubActivityModel> {
    return this.github.activity();
  }
}
