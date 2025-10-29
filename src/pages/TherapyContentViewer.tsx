import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle, Clock, Heart } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { getTherapyContent } from '../utils/therapyContentStorage';
import { getAllTherapies } from '../utils/therapyStorage';
import { TherapyContent } from '../types/therapyContent';
import { Therapy } from '../types/therapy';

function TherapyContentViewer() {
  const { therapySlug } = useParams<{ therapySlug: string }>();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [therapy, setTherapy] = useState<Therapy | null>(null);
  const [content, setContent] = useState<TherapyContent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTherapyContent();
  }, [therapySlug]);

  const loadTherapyContent = () => {
    const therapies = getAllTherapies();

    const foundTherapy = therapies.find(t => {
      const titleSlug = t.title.toLowerCase()
        .replace(/\s+&\s+/g, '-')
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '');

      const titleKey = t.title.toLowerCase();
      if (therapySlug === 'cbt' && titleKey.includes('cbt')) return true;
      if (therapySlug === 'mindfulness' && titleKey.includes('mindfulness')) return true;
      if (therapySlug === 'stress' && titleKey.includes('stress')) return true;
      if (therapySlug === 'gratitude' && titleKey.includes('gratitude')) return true;
      if (therapySlug === 'music' && titleKey.includes('music')) return true;
      if (therapySlug === 'tetris' && titleKey.includes('tetris')) return true;
      if (therapySlug === 'art' && titleKey.includes('art')) return true;
      if (therapySlug === 'exposure' && titleKey.includes('exposure')) return true;
      if (therapySlug === 'video' && titleKey.includes('video')) return true;
      if (therapySlug === 'act' && (titleKey.includes('act') || titleKey.includes('acceptance'))) return true;

      return titleSlug === therapySlug;
    });

    if (foundTherapy) {
      setTherapy(foundTherapy);
      const therapyContent = getTherapyContent(foundTherapy.id);
      setContent(therapyContent);
    }

    setLoading(false);
  };

  const renderContent = () => {
    if (!content || !content.contentData) {
      return (
        <div className={`text-center p-8 rounded-xl ${
          theme === 'dark' ? 'bg-gray-800' : 'bg-white'
        } shadow-lg`}>
          <Heart className={`w-16 h-16 mx-auto mb-4 ${
            theme === 'dark' ? 'text-purple-400' : 'text-purple-500'
          }`} />
          <h3 className={`text-xl font-semibold mb-2 ${
            theme === 'dark' ? 'text-white' : 'text-gray-800'
          }`}>
            Content Coming Soon
          </h3>
          <p className={`mb-6 ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            This therapy module is being prepared by our team. Check back soon!
          </p>
          <button
            onClick={() => navigate('/therapy-modules')}
            className="px-6 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg hover:from-purple-600 hover:to-blue-600 transition-all duration-300"
          >
            Back to Therapies
          </button>
        </div>
      );
    }

    switch (content.therapyType) {
      case 'cbt_thought_records':
        return renderCBTContent();
      case 'mindfulness_breathing':
        return renderMindfulnessContent();
      case 'relaxation_music':
        return renderMusicContent();
      case 'gratitude':
        return renderGratitudeContent();
      case 'stress_management':
        return renderStressManagementContent();
      default:
        return renderGenericContent();
    }
  };

  const renderCBTContent = () => {
    const data = content?.contentData as any;
    return (
      <div className="space-y-6">
        {data?.instructions && (
          <div className={`p-4 rounded-lg ${
            theme === 'dark' ? 'bg-gray-800' : 'bg-blue-50'
          }`}>
            <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
              {data.instructions}
            </p>
          </div>
        )}

        {data?.steps?.map((step: any, index: number) => (
          <motion.div
            key={step.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`p-6 rounded-xl ${
              theme === 'dark' ? 'bg-gray-800' : 'bg-white'
            } shadow-lg`}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold">
                {step.order}
              </div>
              <h3 className={`text-lg font-semibold ${
                theme === 'dark' ? 'text-white' : 'text-gray-800'
              }`}>
                {step.title}
              </h3>
            </div>
            <p className={`text-sm mb-3 ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              {step.prompt}
            </p>
            <textarea
              placeholder={step.placeholder}
              className={`w-full p-3 rounded-lg border-2 ${
                theme === 'dark'
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'bg-gray-50 border-gray-200 text-gray-800'
              } focus:border-purple-500 focus:outline-none transition-colors`}
              rows={4}
            />
          </motion.div>
        ))}
      </div>
    );
  };

  const renderMindfulnessContent = () => {
    const data = content?.contentData as any;
    return (
      <div className="space-y-6">
        {data?.breathingPatterns?.length > 0 && (
          <div>
            <h3 className={`text-xl font-semibold mb-4 ${
              theme === 'dark' ? 'text-white' : 'text-gray-800'
            }`}>
              Breathing Exercises
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              {data.breathingPatterns.map((pattern: any) => (
                <div
                  key={pattern.id}
                  className={`p-6 rounded-xl ${
                    theme === 'dark' ? 'bg-gray-800' : 'bg-white'
                  } shadow-lg`}
                >
                  <h4 className={`font-semibold mb-2 ${
                    theme === 'dark' ? 'text-white' : 'text-gray-800'
                  }`}>
                    {pattern.name}
                  </h4>
                  <p className={`text-sm mb-4 ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {pattern.description}
                  </p>
                  <div className="flex items-center gap-4 text-sm">
                    <div>
                      <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                        Inhale: {pattern.inhale}s
                      </span>
                    </div>
                    <div>
                      <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                        Hold: {pattern.hold}s
                      </span>
                    </div>
                    <div>
                      <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                        Exhale: {pattern.exhale}s
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {data?.mindfulnessExercises?.length > 0 && (
          <div>
            <h3 className={`text-xl font-semibold mb-4 ${
              theme === 'dark' ? 'text-white' : 'text-gray-800'
            }`}>
              Mindfulness Exercises
            </h3>
            {data.mindfulnessExercises.map((exercise: any) => (
              <div
                key={exercise.id}
                className={`p-6 rounded-xl ${
                  theme === 'dark' ? 'bg-gray-800' : 'bg-white'
                } shadow-lg`}
              >
                <h4 className={`font-semibold mb-2 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-800'
                }`}>
                  {exercise.title}
                </h4>
                <p className={`text-sm mb-4 ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {exercise.description}
                </p>
                <div className="space-y-2">
                  {exercise.instructions.map((instruction: string, index: number) => (
                    <div key={index} className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className={`text-sm ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        {instruction}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderMusicContent = () => {
    const data = content?.contentData as any;
    return (
      <div className={`p-8 rounded-xl text-center ${
        theme === 'dark' ? 'bg-gray-800' : 'bg-white'
      } shadow-lg`}>
        <Heart className={`w-16 h-16 mx-auto mb-4 ${
          theme === 'dark' ? 'text-purple-400' : 'text-purple-500'
        }`} />
        <h3 className={`text-xl font-semibold mb-2 ${
          theme === 'dark' ? 'text-white' : 'text-gray-800'
        }`}>
          Music Library
        </h3>
        <p className={`mb-4 ${
          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
        }`}>
          Curated relaxation music will be available here soon
        </p>
        {data?.categories?.length > 0 && (
          <div className="flex flex-wrap gap-2 justify-center">
            {data.categories.map((category: string) => (
              <span
                key={category}
                className={`px-3 py-1 rounded-full text-sm ${
                  theme === 'dark'
                    ? 'bg-gray-700 text-gray-300'
                    : 'bg-purple-100 text-purple-700'
                }`}
              >
                {category}
              </span>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderGratitudeContent = () => {
    const data = content?.contentData as any;
    return (
      <div className="space-y-6">
        <div className={`p-4 rounded-lg ${
          theme === 'dark' ? 'bg-gray-800' : 'bg-blue-50'
        }`}>
          <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
            Take a moment each day to reflect on what you're grateful for. Research shows that gratitude practice can improve mental health and overall well-being.
          </p>
        </div>

        {data?.prompts?.map((prompt: any, index: number) => (
          <motion.div
            key={prompt.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`p-6 rounded-xl ${
              theme === 'dark' ? 'bg-gray-800' : 'bg-white'
            } shadow-lg`}
          >
            <div className="flex items-center gap-2 mb-3">
              <Heart className="w-5 h-5 text-purple-500" />
              <span className={`text-xs px-2 py-1 rounded-full ${
                theme === 'dark'
                  ? 'bg-gray-700 text-gray-300'
                  : 'bg-purple-100 text-purple-700'
              }`}>
                {prompt.category}
              </span>
            </div>
            <p className={`text-lg font-medium mb-3 ${
              theme === 'dark' ? 'text-white' : 'text-gray-800'
            }`}>
              {prompt.prompt}
            </p>
            <textarea
              placeholder="Write your thoughts here..."
              className={`w-full p-3 rounded-lg border-2 ${
                theme === 'dark'
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'bg-gray-50 border-gray-200 text-gray-800'
              } focus:border-purple-500 focus:outline-none transition-colors`}
              rows={4}
            />
          </motion.div>
        ))}
      </div>
    );
  };

  const renderStressManagementContent = () => {
    const data = content?.contentData as any;
    return (
      <div className="space-y-6">
        {data?.techniques?.map((technique: any, index: number) => (
          <motion.div
            key={technique.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`p-6 rounded-xl ${
              theme === 'dark' ? 'bg-gray-800' : 'bg-white'
            } shadow-lg`}
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className={`text-lg font-semibold ${
                theme === 'dark' ? 'text-white' : 'text-gray-800'
              }`}>
                {technique.title}
              </h3>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="w-4 h-4" />
                <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                  {technique.duration} min
                </span>
              </div>
            </div>
            <p className={`text-sm mb-4 ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              {technique.description}
            </p>
            <div className="space-y-2">
              {technique.steps.map((step: string, idx: number) => (
                <div key={idx} className="flex items-start gap-2">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-0.5">
                    {idx + 1}
                  </div>
                  <span className={`text-sm ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    {step}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    );
  };

  const renderGenericContent = () => {
    return (
      <div className={`text-center p-8 rounded-xl ${
        theme === 'dark' ? 'bg-gray-800' : 'bg-white'
      } shadow-lg`}>
        <Heart className={`w-16 h-16 mx-auto mb-4 ${
          theme === 'dark' ? 'text-purple-400' : 'text-purple-500'
        }`} />
        <h3 className={`text-xl font-semibold mb-2 ${
          theme === 'dark' ? 'text-white' : 'text-gray-800'
        }`}>
          Therapy Content
        </h3>
        <p className={`mb-6 ${
          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
        }`}>
          This therapy module content is being configured. Please check back later.
        </p>
      </div>
    );
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        theme === 'dark' ? 'bg-gray-900' : 'bg-gradient-to-br from-purple-50 via-blue-50 to-teal-50'
      }`}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (!therapy) {
    return (
      <div className={`min-h-screen flex items-center justify-center p-4 ${
        theme === 'dark' ? 'bg-gray-900' : 'bg-gradient-to-br from-purple-50 via-blue-50 to-teal-50'
      }`}>
        <div className={`text-center p-8 rounded-xl ${
          theme === 'dark' ? 'bg-gray-800' : 'bg-white'
        } shadow-lg max-w-md`}>
          <h3 className={`text-xl font-semibold mb-2 ${
            theme === 'dark' ? 'text-white' : 'text-gray-800'
          }`}>
            Therapy Not Found
          </h3>
          <p className={`mb-6 ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            The therapy module you're looking for doesn't exist.
          </p>
          <button
            onClick={() => navigate('/therapy-modules')}
            className="px-6 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg hover:from-purple-600 hover:to-blue-600 transition-all duration-300"
          >
            Back to Therapies
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${
      theme === 'dark' ? 'bg-gray-900' : 'bg-gradient-to-br from-purple-50 via-blue-50 to-teal-50'
    }`}>
      <div className="max-w-4xl mx-auto p-6">
        <button
          onClick={() => navigate('/therapy-modules')}
          className={`flex items-center gap-2 mb-6 px-4 py-2 rounded-lg transition-colors ${
            theme === 'dark'
              ? 'text-gray-300 hover:bg-gray-800'
              : 'text-gray-700 hover:bg-white'
          }`}
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Therapies</span>
        </button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className={`p-6 rounded-xl ${
            theme === 'dark' ? 'bg-gray-800' : 'bg-white'
          } shadow-lg`}>
            <h1 className={`text-3xl font-bold mb-3 ${
              theme === 'dark' ? 'text-white' : 'text-gray-800'
            }`}>
              {therapy.title}
            </h1>
            <p className={`text-lg mb-4 ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              {therapy.description}
            </p>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Clock className={`w-4 h-4 ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                }`} />
                <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                  {therapy.duration}
                </span>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs ${
                therapy.difficulty === 'Beginner'
                  ? 'bg-green-100 text-green-800'
                  : therapy.difficulty === 'Intermediate'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-red-100 text-red-800'
              }`}>
                {therapy.difficulty}
              </span>
            </div>
          </div>
        </motion.div>

        {renderContent()}
      </div>
    </div>
  );
}

export default TherapyContentViewer;
