import { Application } from "../models/Application.js";
import { ClientProfile } from "../models/ClientProfile.js";
import { ModelProfile } from "../models/ModelProfile.js";
import { Opportunity } from "../models/Opportunity.js";
import { PortfolioItem } from "../models/PortfolioItem.js";
import { isMemoryMode } from "../config/runtime.js";
import { memoryStore } from "../utils/memoryStore.js";

function calcProfileCompletion(profile) {
  if (!profile) return 20;
  const fields = [profile.fullName, profile.city, profile.bio, profile.heightCm, profile.profileImageUrl, profile.categories?.length];
  return Math.round((fields.filter(Boolean).length / fields.length) * 100);
}

export async function getDashboardSummary(req, res) {
  let modelProfile = null;
  let clientProfile = null;
  const stats = { applications: 0, opportunities: 0, portfolio: 0, saved: 0, profileCompletion: 20 };

  if (isMemoryMode) {
    if (req.user.role === 'model') {
      modelProfile = memoryStore.modelProfiles.find((item) => item.userId === req.user._id) || null;
      stats.applications = memoryStore.applications.filter((item) => item.modelId === req.user._id).length;
      stats.portfolio = memoryStore.portfolio.filter((item) => item.userId === req.user._id).length;
      stats.profileCompletion = calcProfileCompletion(modelProfile);
    }
    if (req.user.role === 'client') {
      clientProfile = memoryStore.clientProfiles.find((item) => item.userId === req.user._id) || null;
      stats.opportunities = memoryStore.opportunities.filter((item) => item.createdBy === req.user._id).length;
      stats.applications = memoryStore.applications.length;
    }
    return res.json({
      user: { id: req.user._id, name: req.user.name, email: req.user.email, role: req.user.role, avatar: req.user.avatar, phone: req.user.phone, isVerified: req.user.isVerified },
      stats,
      modelProfile,
      clientProfile,
    });
  }

  if (req.user.role === "model") {
    const [profile, applicationCount, portfolioCount] = await Promise.all([
      ModelProfile.findOne({ userId: req.user._id }).lean(),
      Application.countDocuments({ modelId: req.user._id }),
      PortfolioItem.countDocuments({ userId: req.user._id })
    ]);
    modelProfile = profile;
    stats.applications = applicationCount;
    stats.portfolio = portfolioCount;
    stats.profileCompletion = calcProfileCompletion(profile);
  }

  if (req.user.role === "client") {
    const [profile, opportunityCount, applicationCount] = await Promise.all([
      ClientProfile.findOne({ userId: req.user._id }).lean(),
      Opportunity.countDocuments({ createdBy: req.user._id }),
      Application.countDocuments({})
    ]);
    clientProfile = profile;
    stats.opportunities = opportunityCount;
    stats.applications = applicationCount;
  }

  res.json({
    user: { id: req.user._id, name: req.user.name, email: req.user.email, role: req.user.role, avatar: req.user.avatar, phone: req.user.phone, isVerified: req.user.isVerified },
    stats,
    modelProfile,
    clientProfile
  });
}
