import { Query, Resolver } from '@nestjs/graphql';
import { AmbientWeather } from './weather.models';
import { WeatherService } from './weather.service';

@Resolver(() => AmbientWeather)
export class WeatherResolver {
  constructor(private readonly weather: WeatherService) {}

  @Query(() => AmbientWeather, { nullable: true })
  ambientWeather(): Promise<AmbientWeather | null> {
    return this.weather.current();
  }
}
