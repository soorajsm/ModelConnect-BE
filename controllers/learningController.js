import { learningTopics } from '../utils/learningContent.js';

export function listLearningTopics(_req, res) {
  res.json({
    items: learningTopics.map((topic) => ({
      slug: topic.slug,
      title: topic.title,
      description: topic.description,
      level: topic.level,
      duration: topic.duration,
      modules: topic.modules,
      checklist: topic.checklist,
      videos: topic.videos,
    })),
  });
}

export function getLearningTopic(req, res) {
  const topic = learningTopics.find((item) => item.slug === req.params.slug);
  if (!topic) return res.status(404).json({ message: 'Learning topic not found' });
  res.json({ item: topic });
}
