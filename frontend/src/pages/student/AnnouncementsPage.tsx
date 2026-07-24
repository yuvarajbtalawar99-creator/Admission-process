import React from 'react';
import { Megaphone, Bookmark, ArrowRight, User } from 'lucide-react';

interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
  author: string;
  category: 'ACADEMIC' | 'EXAM' | 'EVENT' | 'PLACEMENTS';
  color: string;
}

const announcements: Announcement[] = [
  { id: '1', title: 'Schedule for End-Semester Theory Exams (Sem 3)', content: 'The final datesheet for Semester 3 B.Tech examination is now official. The theory examinations will commence on 04 Dec 2026. Hall tickets will be downloadable starting next Monday.', date: '24 Oct 2026', author: 'Controller of Exams', category: 'EXAM', color: 'bg-rose-500/10 text-rose-500' },
  { id: '2', title: 'Hackathon 2026 - Registrations Open!', content: 'VyonLabs Annual Software Hackathon registrations are now open. Form teams of 2-4 and register before Nov 10th. Cash rewards for the top 3 projects, along with immediate internship evaluations.', date: '22 Oct 2026', author: 'Technical Society HOD', category: 'EVENT', color: 'bg-indigo-500/10 text-indigo-500' },
  { id: '3', title: 'Revision of Database Management Systems Syllabus', content: 'Please note the revised practical lab schedule uploaded by Dr. Sarah Jenkins. All students must complete the 12 primary SQL scripts before mock evaluations on Nov 15th.', date: '19 Oct 2026', author: 'Dr. Sarah Jenkins', category: 'ACADEMIC', color: 'bg-emerald-500/10 text-emerald-500' },
  { id: '4', title: 'Pre-Placement Drive: Google Cloud Engineering', content: 'Vite & Google partners pre-placement presentation seminar is scheduled for next Wednesday at 10 AM in the Main Auditorium. Mandatory attendance for CSE third year students.', date: '15 Oct 2026', author: 'Placements Officer', category: 'PLACEMENTS', color: 'bg-sky-500/10 text-sky-500' }
];

export const AnnouncementsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Top Welcome Card */}
      <div className="glass-panel rounded-[32px] p-6 shadow-ambient">
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
            <Megaphone className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-neutral-900 dark:text-white tracking-tight">University Announcements</h2>
            <p className="text-xs text-neutral-400 dark:text-neutral-500 font-medium">Stay updated with the latest circulars, news, and event notices</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {announcements.map((post) => (
          <div
            key={post.id}
            className="glass-panel rounded-[28px] p-6 shadow-ambient space-y-4 hover:scale-[1.01]"
          >
            {/* Header info */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <span className={`text-[10px] font-extrabold px-3 py-1 rounded-full border border-current ${post.color}`}>
                  {post.category}
                </span>
                <span className="text-[11px] text-neutral-400 font-semibold">{post.date}</span>
              </div>
              <button className="text-neutral-400 hover:text-indigo-500 transition-colors">
                <Bookmark className="w-4.5 h-4.5" />
              </button>
            </div>

            {/* Title & Body */}
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-neutral-900 dark:text-white tracking-tight leading-snug">{post.title}</h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 font-medium leading-relaxed">{post.content}</p>
            </div>

            {/* Author Footer */}
            <div className="flex items-center justify-between border-t border-neutral-100 dark:border-neutral-850 pt-4 text-xs font-semibold text-neutral-400">
              <span className="flex items-center gap-1.5">
                <User className="w-4 h-4" />
                {post.author}
              </span>
              <button className="text-neutral-900 dark:text-white hover:text-indigo-500 dark:hover:text-indigo-400 flex items-center gap-1 hover:underline cursor-pointer">
                <span>View Full Document</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AnnouncementsPage;
