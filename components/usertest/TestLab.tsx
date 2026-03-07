import React, { useEffect, useState } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { Id } from '../../convex/_generated/dataModel';
import { useNotification } from '../NotificationProvider';

type Task = {
  _id: Id<"tasks">;
  title: string;
  instruction: string;
  order: number;
};

const ProgressBar: React.FC<{ progress: number }> = ({ progress }) => (
  <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
    <div className="h-2 bg-amber-400 rounded-full" style={{ width: `${progress}%` }} />
  </div>
);

const RatingButtons: React.FC<{ value: number | null; onChange: (v: number) => void }> = ({ value, onChange }) => {
  const labels = ['Very Hard', 'Hard', 'Neutral', 'Easy', 'Very Easy'];
  return (
    <div className="flex gap-2">
      {labels.map((l, i) => {
        const val = 5 - i;
        return (
          <button
            key={l}
            className={`px-3 py-2 rounded-md text-sm font-semibold ${value === val ? 'bg-amber-400 text-black' : 'bg-white'} shadow`}
            onClick={() => onChange(val)}
          >
            {l}
          </button>
        );
      })}
    </div>
  );
};

export const TestLab: React.FC<{ onSessionCreated?: (id: string) => void }> = ({ onSessionCreated }) => {
  const { error: notifyError } = useNotification();
  const tasksQuery = useQuery(api.api.getTasks);
  const createSession = useMutation(api.api.createTestSession);
  const submitTask = useMutation(api.api.submitTaskFeedback);
  const submitFinal = useMutation(api.api.submitFinalFeedback);

  const [sessionId, setSessionId] = useState<Id<"test_sessions"> | null>(() => {
    try {
      return localStorage.getItem('hmb_test_session_id') as Id<"test_sessions"> | null;
    } catch { return null; }
  });

  const [started, setStarted] = useState<boolean>(!!sessionId);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [rating, setRating] = useState<number | null>(null);
  const [confusion, setConfusion] = useState('');
  const [improve, setImprove] = useState('');
  const [finalSubmitted, setFinalSubmitted] = useState(false);

  const tasks: Task[] = (tasksQuery || []) as any;

  const createDefault = useMutation(api.api.createDefaultTasks);

  useEffect(() => {
    if (tasksQuery && (tasksQuery as any).length === 0) {
      // Seed default tasks if none exist
      createDefault({});
    }
  }, [tasksQuery]);

  useEffect(() => {
    if (!started) return;
    if (!sessionId) {
      // create session
      (async () => {
        const id = await createSession({ sessionToken: undefined });
        const sid = id as Id<"test_sessions">;
        setSessionId(sid);
        localStorage.setItem('hmb_test_session_id', sid as string);
        if (onSessionCreated) onSessionCreated(sid as string);
      })();
    }
  }, [started]);

  const progress = tasks.length ? Math.round(((currentIndex) / tasks.length) * 100) : 0;

  const handleCompleteTask = () => {
    setShowFeedback(true);
    setRating(null);
    setConfusion('');
    setImprove('');
  };

  const handleSubmitFeedback = async () => {
    if (!sessionId) { notifyError('Session not started'); return; }
    const task = tasks[currentIndex];
    await submitTask({ sessionId, taskId: task._id, difficultyRating: rating || 3, confusionText: confusion, improvementText: improve });
    setShowFeedback(false);
    if (currentIndex + 1 < tasks.length) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // finished tasks — show final
      setFinalSubmitted(false);
    }
  };

  const handleSubmitFinal = async (overall: number, confusingPart: string, featureImprovement: string) => {
    if (!sessionId) return;
    await submitFinal({ sessionId, overallRating: overall, confusingPart, featureImprovement });
    setFinalSubmitted(true);
    localStorage.removeItem('hmb_test_session_id');
  };

  if (!started) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <div className="bg-white rounded-xl p-8 shadow-lg">
          <h1 className="text-2xl font-black">HoldMyBeer Test Lab 🍺</h1>
          <p className="mt-3 text-sm text-gray-600">Help us improve HoldMyBeer by completing a few simple tasks and rating your experience.</p>
          <ul className="mt-4 text-sm space-y-2">
            <li>Estimated time: 3–5 minutes</li>
            <li>Progress bar will show your progress</li>
          </ul>
          <div className="mt-6">
            <button className="px-6 py-3 bg-amber-400 rounded-lg font-bold" onClick={() => setStarted(true)}>Start Test</button>
          </div>
        </div>
      </div>
    );
  }

  if (finalSubmitted) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <div className="bg-white rounded-xl p-8 shadow-lg text-center">
          <h2 className="text-xl font-black">Thanks for testing HoldMyBeer</h2>
          <p className="mt-3 text-gray-600">Your feedback helps us build a better platform.</p>
          <div className="mt-6">
            <div className="inline-flex items-center gap-3 px-4 py-2 bg-amber-100 text-amber-800 rounded-full font-bold">Early Access Badge</div>
          </div>
        </div>
      </div>
    );
  }

  const currentTask = tasks[currentIndex];

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="bg-white rounded-xl p-6 shadow">
        <ProgressBar progress={progress} />
        <div className="mt-4">
          <div className="text-sm text-gray-500">Task {Math.min(currentIndex + 1, tasks.length)} of {tasks.length}</div>
          <h3 className="text-lg font-bold mt-2">{currentTask?.title || 'Loading...'}</h3>
          <p className="mt-2 text-gray-700">{currentTask?.instruction}</p>
        </div>

        <div className="mt-6 flex gap-3">
          <button className="px-4 py-3 bg-amber-400 rounded font-bold" onClick={handleCompleteTask}>I completed this task</button>
        </div>

        {showFeedback && (
          <div className="mt-6 bg-gray-50 p-4 rounded">
            <h4 className="font-semibold">How easy was this task?</h4>
            <div className="mt-2"><RatingButtons value={rating} onChange={setRating} /></div>

            <div className="mt-4">
              <label className="block text-sm font-medium">Did you experience any confusion?</label>
              <textarea className="w-full mt-1 p-2 rounded border" value={confusion} onChange={(e) => setConfusion(e.target.value)} />
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium">What could we improve? (optional)</label>
              <input className="w-full mt-1 p-2 rounded border" value={improve} onChange={(e) => setImprove(e.target.value)} />
            </div>

            <div className="mt-4 flex justify-end">
              <button className="px-4 py-2 bg-amber-500 rounded font-bold" onClick={handleSubmitFeedback}>Next Task</button>
            </div>
          </div>
        )}

        {/* After last task, show final feedback UI */}
        {(!showFeedback && currentIndex + 1 > tasks.length - 1) && (
          <div className="mt-6 bg-gray-50 p-4 rounded">
            <FinalFeedback onSubmit={handleSubmitFinal} />
          </div>
        )}
      </div>
    </div>
  );
};

const FinalFeedback: React.FC<{ onSubmit: (overall: number, confusingPart: string, featureImprovement: string) => void }> = ({ onSubmit }) => {
  const [overall, setOverall] = useState(5);
  const [confusing, setConfusing] = useState('');
  const [improve, setImprove] = useState('');

  return (
    <div>
      <h4 className="font-semibold">Overall how easy was HoldMyBeer to use?</h4>
      <div className="mt-2 flex gap-2">
        {[1, 2, 3, 4, 5].map(s => (
          <button key={s} className={`px-3 py-2 rounded ${overall === s ? 'bg-amber-400 font-bold' : 'bg-white'}`} onClick={() => setOverall(s)}>{'⭐'.repeat(s)}</button>
        ))}
      </div>

      <div className="mt-4">
        <label className="block text-sm font-medium">What was the most confusing part?</label>
        <textarea className="w-full mt-1 p-2 rounded border" value={confusing} onChange={(e) => setConfusing(e.target.value)} />
      </div>

      <div className="mt-4">
        <label className="block text-sm font-medium">What feature would you improve?</label>
        <input className="w-full mt-1 p-2 rounded border" value={improve} onChange={(e) => setImprove(e.target.value)} />
      </div>

      <div className="mt-4 flex justify-end">
        <button className="px-4 py-2 bg-amber-500 rounded font-bold" onClick={() => onSubmit(overall, confusing, improve)}>Submit Feedback</button>
      </div>
    </div>
  );
};

export default TestLab;
