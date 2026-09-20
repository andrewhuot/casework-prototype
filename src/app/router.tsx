import { createHashRouter, Navigate, useParams } from 'react-router-dom';
import { AppShell } from '@/components/shell/AppShell';
import { QueueScreen } from '@/screens/Queue/QueueScreen';
import { CaseReviewScreen } from '@/screens/CaseReview/CaseReviewScreen';
import { RulebookScreen } from '@/screens/Rulebook/RulebookScreen';
import { ProvingGroundScreen } from '@/screens/ProvingGround/ProvingGroundScreen';
import { ScoreboardScreen } from '@/screens/Scoreboard/ScoreboardScreen';

/** Keyed by case so local selection state never carries over between cases. */
function CaseReviewRoute() {
  const { caseId = '' } = useParams();
  return <CaseReviewScreen key={caseId} />;
}

export const router = createHashRouter([
  {
    path: '/',
    element: <AppShell />,
    children: [
      { index: true, element: <QueueScreen /> },
      { path: 'cases/:caseId', element: <CaseReviewRoute /> },
      { path: 'rulebook', element: <RulebookScreen /> },
      { path: 'proving-ground', element: <ProvingGroundScreen /> },
      { path: 'scoreboard', element: <ScoreboardScreen /> },
      { path: '*', element: <Navigate to="/" replace /> },
    ],
  },
]);
