import { combineReducers } from 'redux';
import SegmentsReducer from './SegmentsReducer';
import CriteriaReducer from './CriteriaReducer';
import TriggersReducer from './TriggersReducer';
import CanvasReducer from './CanvasReducer';
import ScenarioReducer from './ScenarioReducer';
import MailsReducer from './MailsReducer';
import GoalsReducer from './GoalsReducer';
import BannersReducer from './BannersReducer';

export default combineReducers({
  segments: SegmentsReducer,
  triggers: TriggersReducer,
  canvas: CanvasReducer,
  criteria: CriteriaReducer,
  scenario: ScenarioReducer,
  mails: MailsReducer,
  goals: GoalsReducer,
  banners: BannersReducer,
});
