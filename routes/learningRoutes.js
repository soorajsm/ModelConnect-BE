import { Router } from 'express';
import { getLearningTopic, listLearningTopics } from '../controllers/learningController.js';

const router = Router();
router.get('/', listLearningTopics);
router.get('/:slug', getLearningTopic);

export default router;
