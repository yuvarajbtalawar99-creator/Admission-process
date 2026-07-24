import React from 'react';
import { toast } from 'react-toastify';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  CheckCircle, 
  AlertTriangle,
  FileText
} from 'lucide-react';

export const TimetableExamPage: React.FC = () => {
  const timetableSlots = [
    { day: 'Monday', time: '09:00 AM - 10:00 AM', subject: 'Database Management Systems', room: 'LH-101', teacher: 'Dr. Smith' },
    { day: 'Monday', time: '10:15 AM - 11:15 AM', subject: 'Data Structures & Algorithms', room: 'LH-101', teacher: 'Prof. John' },
    { day: 'Tuesday', time: '11:30 AM - 12:30 PM', subject: 'Discrete Mathematics', room: 'LH-102', teacher: 'Mr. Raj' },
    { day: 'Wednesday', time: '02:00 PM - 03:00 PM', subject: 'Operating Systems Lab', room: 'Lab-3', teacher: 'Prof. Deepa Nair' },
    { day: 'Thursday', time: '09:00 AM - 10:00 AM', subject: 'Computer Networks', room: 'LH-101', teacher: 'Dr. Smith' },
  ];

  const exams = [
    { subject: 'Database Management Systems', code: 'CS301', date: '15 Jul 2026', time: '10:00 AM - 12:00 PM', hall: 'LH-101', invigilator: 'Dr. Smith' },
    { subject: 'Data Structures & Algorithms', code: 'CS302', date: '17 Jul 2026', time: '10:00 AM - 12:00 PM', hall: 'LH-101', invigilator: 'Prof. John' },
    { subject: 'Computer Networks', code: 'CS303', date: '20 Jul 2026', time: '10:00 AM - 12:00 PM', hall: 'LH-102', invigilator: 'Prof. Deepa Nair' },
  ];

  return (
    <div className="space-y-6 pb-8 animate-fade-in">
      
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="glass-panel rounded-2xl p-5 border-l-4 border-l-sky-500">
          <p className="text-[10px] uppercase font-bold text-neutral-450">Active Timetable</p>
          <h3 className="text-xl font-black text-neutral-800 dark:text-white mt-1">Semester 3, 5 & 7</h3>
          <span className="text-[10px] text-emerald-600 font-extrabold flex items-center gap-1 mt-1">
            <CheckCircle className="w-3 h-3" /> Published
          </span>
        </div>
        <div className="glass-panel rounded-2xl p-5 border-l-4 border-l-violet-500">
          <p className="text-[10px] uppercase font-bold text-neutral-450">Slots Used</p>
          <h3 className="text-xl font-black text-neutral-800 dark:text-white mt-1">28 / 35 Slots</h3>
          <span className="text-[10px] text-neutral-400 font-bold mt-1 block">80% slots utilization</span>
        </div>
        <div className="glass-panel rounded-2xl p-5 border-l-4 border-l-emerald-500">
          <p className="text-[10px] uppercase font-bold text-neutral-450">Room Utilization</p>
          <h3 className="text-xl font-black text-neutral-800 dark:text-white mt-1">85% Capacity</h3>
          <span className="text-[10px] text-neutral-450 font-bold mt-1 block">Optimal rooms usage</span>
        </div>
        <div className="glass-panel rounded-2xl p-5 border-l-4 border-l-amber-500">
          <p className="text-[10px] uppercase font-bold text-neutral-450">Schedule Conflicts</p>
          <h3 className="text-xl font-black text-neutral-800 dark:text-white mt-1">0 Conflicts</h3>
          <span className="text-[10px] text-emerald-600 font-extrabold flex items-center gap-1 mt-1">
            <CheckCircle className="w-3 h-3" /> Clear of overlaps
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Class Timetable */}
        <div className="lg:col-span-7 glass-panel rounded-[28px] p-6 shadow-ambient space-y-4">
          <div className="flex justify-between items-center border-b border-neutral-100 dark:border-neutral-800/50 pb-3">
            <h3 className="font-bold text-neutral-900 dark:text-white text-sm flex items-center gap-1.5">
              <Calendar className="w-4.5 h-4.5 text-sky-500" />
              🗓️ DEPARTMENT TIMETABLE
            </h3>
            <button onClick={() => toast.success('Timetable adjustment dialog launched.')} className="px-3 py-1.5 bg-neutral-900 hover:bg-neutral-850 text-white rounded-xl text-[10px] font-bold cursor-pointer">
              Modify Slots
            </button>
          </div>
          <div className="space-y-3">
            {timetableSlots.map((slot, idx) => (
              <div key={idx} className="p-4 bg-neutral-50 dark:bg-neutral-850/40 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-sky-100 text-sky-700 dark:bg-sky-950/30 dark:text-sky-400 flex items-center justify-center font-bold text-xs flex-shrink-0">
                    {slot.day.substring(0,3)}
                  </div>
                  <div>
                    <h4 className="text-xs font-extrabold text-neutral-850 dark:text-neutral-200">{slot.subject}</h4>
                    <p className="text-[10px] text-neutral-450 font-semibold flex items-center gap-1 mt-0.5">
                      <Clock className="w-3 h-3" /> {slot.time}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-xs font-bold text-neutral-700 dark:text-neutral-300">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-neutral-400" /> {slot.room}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-neutral-400" /> {slot.teacher}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Exams schedule */}
        <div className="lg:col-span-5 glass-panel rounded-[28px] p-6 shadow-ambient space-y-4">
          <div className="flex justify-between items-center border-b border-neutral-100 dark:border-neutral-800/50 pb-3">
            <h3 className="font-bold text-neutral-900 dark:text-white text-sm flex items-center gap-1.5">
              <FileText className="w-4.5 h-4.5 text-violet-500" />
              📝 EXAM DUTIES & HALLS
            </h3>
            <button onClick={() => toast.success('Exam schedule exported.')} className="px-3 py-1.5 bg-neutral-900 hover:bg-neutral-850 text-white rounded-xl text-[10px] font-bold cursor-pointer">
              Export PDF
            </button>
          </div>
          <div className="space-y-3">
            {exams.map((exam, idx) => (
              <div key={idx} className="p-4 bg-neutral-50 dark:bg-neutral-850/40 rounded-2xl border space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-xs font-extrabold text-neutral-850 dark:text-neutral-200">{exam.subject}</h4>
                    <span className="text-[9px] font-mono text-neutral-450">{exam.code}</span>
                  </div>
                  <span className="px-2.5 py-1 bg-violet-100 text-violet-700 dark:bg-violet-950/40 dark:text-violet-400 rounded-lg text-[9px] font-black">{exam.date}</span>
                </div>
                <div className="flex justify-between items-center text-[10px] text-neutral-400 font-bold border-t pt-2">
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {exam.time}</span>
                  <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {exam.hall}</span>
                  <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {exam.invigilator}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};

export default TimetableExamPage;
