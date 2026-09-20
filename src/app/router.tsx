import { createHashRouter, Navigate } from 'react-router-dom';
import { AppShell } from '@/components/shell/AppShell';
import { QueueScreen } from '@/screens/Queue/QueueScreen';
import { CaseReviewScreen } from '@/screens/CaseReview/CaseReviewScreen';
import { RulebookScreen } from '@/screens/Rulebook/RulebookScreen';
import { ProvingGroundScreen } from '@/screens/ProvingGround/ProvingGroundScreen';
import { ScoreboardScreen } from '@/screens/Scoreboard/ScoreboardScreen';

export const router = createHashRouter([
  {
    path: '/',
    element: <AppShell />,
    children: [
      { index: true, element: <QueueScreen /> },
      { path: 'cases/:caseId', element: <CaseReviewScreen /> },
      { path: 'rulebook', element: <RulebookScreen /> },
      { path: 'proving-ground', element: <ProvingGroundScreen /> },
      { path: 'scoreboard', element: <ScoreboardScreen /> },
      { path: '*', element: <Navigate to="/" replace /> },
    ],
  },
]);
