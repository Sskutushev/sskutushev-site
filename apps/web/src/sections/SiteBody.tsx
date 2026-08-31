import type { SiteCopy } from '../content/site-copy';
import type { Locale, Portfolio } from '../lib/portfolio';
import type { EngineeringMetrics } from '../lib/use-engineering-metrics';
import type { DataState } from '../ui/StatusDot';
import { Architecture } from './Architecture';
import { Capabilities } from './Capabilities';
import { Contact } from './Contact';
import { Engineering } from './Engineering';
import { Experience } from './Experience';
import { Manifesto } from './Manifesto';
import { Work } from './Work';

/**
 * Every section below the hero, in one chunk.
 *
 * The hero pin is 240vh, so none of this is reachable without scrolling more
 * than two screens. Mounting it after the first paint keeps its markup, its
 * layout and its share of the entry chunk off the path to the largest
 * contentful paint, and the visitor cannot tell the difference.
 */
export function SiteBody({
  copy,
  data,
  dataDetail,
  dataState,
  locale,
  runtime,
  onEvidenceVisible,
}: {
  copy: SiteCopy;
  data: Portfolio;
  dataDetail: string;
  dataState: DataState;
  locale: Locale;
  runtime: EngineeringMetrics;
  onEvidenceVisible: (visible: boolean) => void;
}): React.JSX.Element {
  return (
    <>
      <Manifesto copy={copy} />
      <Work cases={data.caseStudies} copy={copy} locale={locale} />
      <Architecture copy={copy} detail={dataDetail} locale={locale} state={dataState} />
      <Engineering
        copy={copy}
        dataDetail={dataDetail}
        dataState={dataState}
        locale={locale}
        onVisible={onEvidenceVisible}
        runtime={runtime}
      />
      <Capabilities copy={copy} locale={locale} skills={data.skills} />
      <Experience copy={copy} items={data.experience} />
      <Contact copy={copy} locale={locale} />
    </>
  );
}
