import React from 'react';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';

const AdminTests: React.FC = () => {
  const data = useQuery(api.api.adminGetTestResponses);
  if (!data) return <div className="p-6">Loading analytics…</div>;

  const { sessions, tasks, feedback, finals } = data as any;

  const taskStats = tasks.map((t: any) => {
    const taskFeedback = feedback.filter((f: any) => f.taskId === t._id);
    const avg = taskFeedback.length ? (taskFeedback.reduce((s: any, r: any) => s + r.difficultyRating, 0) / taskFeedback.length) : null;
    const completion = sessions.length ? Math.round((taskFeedback.length / sessions.length) * 100) : 0;
    return { title: t.title, avg, completion };
  });

  const totalTesters = sessions.length;
  const completedSessions = sessions.filter((s: any) => s.completedAt).length;
  const completionRate = sessions.length ? Math.round((completedSessions / sessions.length) * 100) : 0;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold">User Testing — Admin</h2>
      <div className="mt-4 bg-white p-4 rounded shadow">
        <div className="grid grid-cols-3 gap-4">
          <div className="p-3 bg-gray-50 rounded">
            <div className="text-sm text-gray-500">Total Testers</div>
            <div className="text-xl font-bold">{totalTesters}</div>
          </div>
          <div className="p-3 bg-gray-50 rounded">
            <div className="text-sm text-gray-500">Completed</div>
            <div className="text-xl font-bold">{completedSessions} ({completionRate}%)</div>
          </div>
          <div className="p-3 bg-gray-50 rounded">
            <div className="text-sm text-gray-500">Feedback Entries</div>
            <div className="text-xl font-bold">{feedback.length}</div>
          </div>
        </div>

        <div className="mt-6">
          <h3 className="font-semibold">Per-Task Analytics</h3>
          <table className="w-full mt-2 text-sm">
            <thead>
              <tr className="text-left text-gray-600">
                <th>Task</th>
                <th>Avg Rating</th>
                <th>Completion %</th>
              </tr>
            </thead>
            <tbody>
              {taskStats.map((t: any) => (
                <tr key={t.title} className="border-t">
                  <td className="py-2">{t.title}</td>
                  <td className="py-2">{t.avg ? t.avg.toFixed(1) : '—'}</td>
                  <td className="py-2">{t.completion}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminTests;
