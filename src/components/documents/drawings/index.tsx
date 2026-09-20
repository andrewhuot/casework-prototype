import type { DrawingSpec } from '@/data/types';
import { RoofPlan } from './RoofPlan';
import { SingleLineDiagram } from './SingleLineDiagram';
import { SitePlan } from './SitePlan';
import { SurveySketch } from './SurveySketch';

export function Drawing({ spec }: { spec: DrawingSpec }) {
  switch (spec.kind) {
    case 'site_plan':
      return <SitePlan spec={spec} />;
    case 'survey':
      return <SurveySketch spec={spec} />;
    case 'roof_plan':
      return <RoofPlan spec={spec} />;
    case 'single_line':
      return <SingleLineDiagram spec={spec} />;
  }
}
