import React, { useState } from 'react';
import { 
  User, 
  Mail, 
  MessageSquare, 
  Calendar, 
  MapPin, 
  Clock, 
  Phone, 
  Search, 
  X, 
  CheckCircle2, 
  Video 
} from 'lucide-react';
import Toast from '../../components/common/Toast';

interface Teacher {
  id: string;
  name: string;
  avatar: string;
  designation: string;
  department: 'Computer Science' | 'Computer Science (AIML)' | 'Mathematics' | 'Electronics';
  email: string;
  phone: string;
  officeLocation: string;
  status: 'AVAILABLE' | 'IN_LECTURE' | 'OFFICE_HOURS' | 'AWAY';
  subjects: string[];
}

const initialTeachers: Teacher[] = [
  {
    id: 'TCH-101',
    name: 'Dr. Ramesh R. Patil',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&fit=crop',
    designation: 'Professor & HOD',
    department: 'Computer Science',
    email: 'rrpatil@jcer.edu.in',
    phone: '+91 94481 22340',
    officeLocation: 'Room 201, 2nd Floor, Main Block',
    status: 'AVAILABLE',
    subjects: ['System Software & Compilers', 'Automata Theory']
  },
  {
    id: 'TCH-102',
    name: 'Prof. Sneha K. Belagavi',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&fit=crop',
    designation: 'Associate Professor',
    department: 'Computer Science',
    email: 'snehab@jcer.edu.in',
    phone: '+91 88612 90443',
    officeLocation: 'Staff Room A, 1st Floor, CS Block',
    status: 'IN_LECTURE',
    subjects: ['Computer Networks', 'Network Security']
  },
  {
    id: 'TCH-103',
    name: 'Dr. Vinayaka B. Joshi',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&fit=crop',
    designation: 'Associate Professor',
    department: 'Computer Science',
    email: 'vjoshi@jcer.edu.in',
    phone: '+91 98801 11204',
    officeLocation: 'Database Lab Coordinator Cabin, CS Block',
    status: 'OFFICE_HOURS',
    subjects: ['Database Management Systems', 'Big Data Analytics']
  },
  {
    id: 'TCH-104',
    name: 'Prof. Amit S. Hiremath',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&fit=crop',
    designation: 'Assistant Professor',
    department: 'Computer Science',
    email: 'amith@jcer.edu.in',
    phone: '+91 74112 55981',
    officeLocation: 'Web Tech Lab, Ground Floor, CS Block',
    status: 'AVAILABLE',
    subjects: ['Web Technology & Applications', 'UI/UX Design']
  },
  {
    id: 'TCH-105',
    name: 'Prof. Raghavendra Deshpande',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&fit=crop',
    designation: 'Assistant Professor',
    department: 'Mathematics',
    email: 'rdeshpande@jcer.edu.in',
    phone: '+91 99015 67420',
    officeLocation: 'Staff Room C, 3rd Floor, Basic Science Block',
    status: 'AWAY',
    subjects: ['Operations Research', 'Advanced Mathematics-II']
  },
  {
    id: 'TCH-106',
    name: 'Dr. Savita M. Kulkarni',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&fit=crop',
    designation: 'Professor',
    department: 'Electronics',
    email: 'skulkarni@jcer.edu.in',
    phone: '+91 98450 88210',
    officeLocation: 'VLSI Design Lab, 2nd Floor, EC Block',
    status: 'OFFICE_HOURS',
    subjects: ['Microcontrollers & Embedded Systems', 'Signals & Systems']
  }
];

export const ContactTeacherPage: React.FC = () => {
  const [teachers] = useState<Teacher[]>(initialTeachers);
  const [selectedDept, setSelectedDept] = useState<'ALL' | 'Computer Science' | 'Computer Science (AIML)' | 'Mathematics' | 'Electronics'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal Booking States
  const [bookingTeacher, setBookingTeacher] = useState<Teacher | null>(null);
  const [date, setDate] = useState('');
  const [timeSlot, setTimeSlot] = useState('10:00 AM - 10:30 AM');
  const [reason, setReason] = useState('Doubts Clarification');
  const [notes, setNotes] = useState('');
  const [bookingType, setBookingType] = useState<'IN_PERSON' | 'VIRTUAL'>('IN_PERSON');
  
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !notes.trim()) {
      setToast({ type: 'error', message: 'Please select a date and provide consultation context.' });
      return;
    }

    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setToast({ 
        type: 'success', 
        message: `Consultation request sent successfully to ${bookingTeacher?.name}! They will confirm details shortly.` 
      });
      setBookingTeacher(null);
      setDate('');
      setNotes('');
      setReason('Doubts Clarification');
    }, 1500);
  };

  // Filter & Search Logics
  const filteredTeachers = teachers.filter(t => {
    const matchesDept = selectedDept === 'ALL' || t.department === selectedDept;
    const matchesSearch = 
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.subjects.some(sub => sub.toLowerCase().includes(searchQuery.toLowerCase())) ||
      t.designation.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDept && matchesSearch;
  });

  return (
    <div className="space-y-6 pb-12">
      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}

      {/* Page Title Card */}
      <div className="glass-panel rounded-[32px] p-6 shadow-ambient">
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
            <User className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-neutral-900 dark:text-white tracking-tight">Faculty Directory & Contact Hub</h2>
            <p className="text-xs text-neutral-400 dark:text-neutral-500 font-medium">Get in touch with your subject teachers, schedule appointments, and coordinate office hour slots</p>
          </div>
        </div>
      </div>

      {/* Search and Filters Layout */}
      <div className="glass-panel rounded-[32px] p-6 shadow-ambient space-y-4">
        
        {/* Department Pills */}
        <div className="flex flex-wrap gap-2 items-center">
          {(['ALL', 'Computer Science', 'Computer Science (AIML)', 'Mathematics', 'Electronics'] as const).map((dept) => {
            const colors = {
              ALL: {
                active: 'bg-sky-100 border-sky-400 text-black font-extrabold ring-2 ring-sky-500/20',
                inactive: 'bg-sky-50/60 border-sky-200/50 text-black/70 hover:text-black font-bold hover:bg-sky-100/40'
              },
              'Computer Science': {
                active: 'bg-amber-100 border-amber-400 text-black font-extrabold ring-2 ring-amber-500/20',
                inactive: 'bg-amber-50/50 border-amber-200/50 text-black/70 hover:text-black font-bold hover:bg-amber-100/40'
              },
              'Computer Science (AIML)': {
                active: 'bg-rose-100 border-rose-400 text-black font-extrabold ring-2 ring-rose-500/20',
                inactive: 'bg-rose-50/50 border-rose-200/50 text-black/70 hover:text-black font-bold hover:bg-rose-100/40'
              },
              Mathematics: {
                active: 'bg-emerald-100 border-emerald-400 text-black font-extrabold ring-2 ring-emerald-500/10',
                inactive: 'bg-emerald-50/50 border-emerald-200/50 text-black/70 hover:text-black font-bold hover:bg-emerald-100/40'
              },
              Electronics: {
                active: 'bg-violet-100 border-violet-400 text-black font-extrabold ring-2 ring-violet-500/10',
                inactive: 'bg-violet-50/50 border-violet-200/50 text-black/70 hover:text-black font-bold hover:bg-violet-100/40'
              }
            }[dept];

            return (
              <button
                key={dept}
                onClick={() => setSelectedDept(dept)}
                className={`px-4 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer border ${
                  selectedDept === dept ? colors.active : colors.inactive
                }`}
              >
                {dept === 'ALL' ? 'All Departments' : dept}
              </button>
            );
          })}
        </div>

        {/* Text Search Box */}
        <div className="flex justify-end">
          <div className="relative w-full md:w-80">
            <input
              type="text"
              placeholder="Search teacher by name or subject..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-neutral-50 dark:bg-neutral-200 border border-neutral-200/50 dark:border-neutral-850 focus:ring-2 focus:ring-indigo-500 text-neutral-800 dark:text-neutral-200 rounded-xl py-2 px-3 pl-9 text-xs outline-none transition-colors placeholder:text-neutral-400"
            />
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-neutral-400" />
          </div>
        </div>

        {/* Directory Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTeachers.length > 0 ? (
            filteredTeachers.map((tch) => {
              const deptStyle = {
                'Computer Science': {
                  card: 'bg-amber-50/70 border-amber-200/60 hover:border-amber-400/60 hover:bg-amber-50',
                  dept: 'text-amber-600',
                  pill: 'bg-amber-100 text-amber-800',
                  info: 'bg-amber-50 border-amber-100',
                  accent: '#d97706',
                },
                'Computer Science (AIML)': {
                  card: 'bg-rose-50/70 border-rose-200/60 hover:border-rose-400/60 hover:bg-rose-50',
                  dept: 'text-rose-600',
                  pill: 'bg-rose-100 text-rose-800',
                  info: 'bg-rose-50 border-rose-100',
                  accent: '#e11d48',
                },
                Mathematics: {
                  card: 'bg-emerald-50/70 border-emerald-200/60 hover:border-emerald-400/60 hover:bg-emerald-50',
                  dept: 'text-emerald-600',
                  pill: 'bg-emerald-100 text-emerald-800',
                  info: 'bg-emerald-50 border-emerald-100',
                  accent: '#16a34a',
                },
                Electronics: {
                  card: 'bg-violet-50/70 border-violet-200/60 hover:border-violet-400/60 hover:bg-violet-50',
                  dept: 'text-violet-600',
                  pill: 'bg-violet-100 text-violet-800',
                  info: 'bg-violet-50 border-violet-100',
                  accent: '#7c3aed',
                },
              }[tch.department] ?? {
                card: 'bg-white/40 border-neutral-200/40 hover:border-indigo-500/30 hover:bg-white/80',
                dept: 'text-indigo-500',
                pill: 'bg-neutral-100 text-neutral-600',
                info: 'bg-neutral-50 border-neutral-100',
                accent: '#6366f1',
              };

              return (
              <div 
                key={tch.id}
                className={`group p-5 rounded-[24px] border flex flex-col justify-between transition-all duration-300 ${deptStyle.card}`}
              >
                <div>
                  {/* Top Profile / Availability */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <img 
                        src={tch.avatar} 
                        alt={tch.name} 
                        className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-md group-hover:scale-105 transition-transform"
                        style={{ borderColor: deptStyle.accent + '40' }}
                      />
                      <div>
                        <h3 className="text-xs font-bold text-neutral-800 dark:text-neutral-100 leading-tight">
                          {tch.name}
                        </h3>
                        <p className="text-[10px] text-neutral-500 font-semibold">{tch.designation}</p>
                        <p className={`text-[9px] font-extrabold uppercase mt-0.5 ${deptStyle.dept}`}>{tch.department}</p>
                      </div>
                    </div>

                    {/* Status badge */}
                    <span className={`text-[9px] font-black px-2 py-0.5 rounded-full ${
                      tch.status === 'AVAILABLE'
                        ? 'bg-emerald-500/10 text-emerald-600'
                        : tch.status === 'IN_LECTURE'
                        ? 'bg-rose-500/10 text-rose-600'
                        : tch.status === 'OFFICE_HOURS'
                        ? 'bg-indigo-500/10 text-indigo-500'
                        : 'bg-neutral-400/10 text-neutral-500'
                    }`}>
                      {tch.status.replace('_', ' ')}
                    </span>
                  </div>

                  {/* Core Subjects */}
                  <div className="space-y-1 mb-4">
                    <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest block">Lecturing subjects</span>
                    <div className="flex flex-wrap gap-1">
                      {tch.subjects.map((sub, idx) => (
                        <span key={idx} className={`text-[9px] font-bold px-2 py-0.5 rounded ${deptStyle.pill}`}>
                          {sub}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Contact Meta Details */}
                  <div className={`rounded-xl p-3 border space-y-1.5 text-[10px] text-neutral-600 mb-4 ${deptStyle.info}`}>
                    <div className="flex items-center space-x-2">
                      <Mail className="w-3.5 h-3.5 text-neutral-400 flex-shrink-0" />
                      <a href={`mailto:${tch.email}`} className="font-semibold hover:underline truncate">{tch.email}</a>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Phone className="w-3.5 h-3.5 text-neutral-400 flex-shrink-0" />
                      <span className="font-semibold">{tch.phone}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-3.5 h-3.5 text-neutral-400 flex-shrink-0" />
                      <span className="font-semibold leading-tight">{tch.officeLocation}</span>
                    </div>
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="flex gap-2">
                  <button 
                    onClick={() => {
                      setToast({ type: 'success', message: `Chat session initiated with ${tch.name}. Redirecting...` });
                    }}
                    className="flex-1 py-2.5 rounded-xl border border-neutral-200 text-neutral-700 hover:bg-white text-[10px] font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer bg-white/60"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    Chat
                  </button>

                  <button 
                    onClick={() => setBookingTeacher(tch)}
                    className="flex-1 py-2.5 rounded-xl text-[10px] font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer text-white shadow-sm"
                    style={{ backgroundColor: deptStyle.accent }}
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    Book Office Hour
                  </button>
                </div>
              </div>
              );
            })
          ) : (
            <div className="col-span-full py-12 text-center flex flex-col items-center justify-center space-y-2">
              <User className="w-10 h-10 text-neutral-300" />
              <p className="text-sm font-bold text-neutral-400">No teachers found</p>
              <p className="text-xs text-neutral-500">Try matching details or filter by another department.</p>
            </div>
          )}
        </div>
      </div>

      {/* Booking Modal */}
      {bookingTeacher && (
        <div className="fixed inset-0 bg-neutral-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div 
            className="w-full max-w-md glass-panel rounded-[32px] overflow-hidden shadow-2xl animate-fade-in flex flex-col bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-5 border-b border-neutral-100 dark:border-neutral-250 flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <img src={bookingTeacher.avatar} alt={bookingTeacher.name} className="w-8 h-8 rounded-full object-cover" />
                <div>
                  <h3 className="text-xs font-bold text-neutral-900 dark:text-white leading-tight">Book Appointment</h3>
                  <p className="text-[9px] text-neutral-400 font-semibold mt-0.5">Drafting schedule with {bookingTeacher.name}</p>
                </div>
              </div>
              <button 
                onClick={() => setBookingTeacher(null)}
                className="w-8 h-8 rounded-full flex items-center justify-center bg-neutral-100 dark:bg-neutral-200 hover:scale-105 active:scale-95 transition-all text-neutral-600 dark:text-neutral-400 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleBookingSubmit} className="p-6 space-y-4">
              
              {/* Type Switcher */}
              <div className="space-y-1">
                <label className="text-[9px] font-extrabold text-neutral-400 uppercase tracking-widest block">Consultation Format</label>
                <div className="grid grid-cols-2 gap-2 bg-neutral-50 dark:bg-neutral-250 p-1 rounded-xl border border-neutral-200/50 dark:border-neutral-850">
                  <button 
                    type="button"
                    onClick={() => setBookingType('IN_PERSON')}
                    className={`py-1.5 text-[10px] font-bold rounded-lg flex items-center justify-center gap-1 cursor-pointer transition-all ${
                      bookingType === 'IN_PERSON' 
                        ? 'bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white shadow-sm' 
                        : 'text-neutral-450 hover:text-neutral-900'
                    }`}
                  >
                    <MapPin className="w-3 h-3" />
                    In-Person
                  </button>
                  <button 
                    type="button"
                    onClick={() => setBookingType('VIRTUAL')}
                    className={`py-1.5 text-[10px] font-bold rounded-lg flex items-center justify-center gap-1 cursor-pointer transition-all ${
                      bookingType === 'VIRTUAL' 
                        ? 'bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white shadow-sm' 
                        : 'text-neutral-450 hover:text-neutral-900'
                    }`}
                  >
                    <Video className="w-3 h-3" />
                    Google Meet
                  </button>
                </div>
              </div>

              {/* Date Input */}
              <div className="space-y-1">
                <label className="text-[9px] font-extrabold text-neutral-400 uppercase tracking-widest block">Select Date</label>
                <input 
                  type="date" 
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-neutral-50 dark:bg-neutral-250/40 border border-neutral-200 dark:border-neutral-850 rounded-xl py-2 px-3 text-xs outline-none focus:ring-1 focus:ring-indigo-500 text-neutral-850 dark:text-neutral-200 cursor-pointer"
                  required
                />
              </div>

              {/* Time Slots Selector */}
              <div className="space-y-1">
                <label className="text-[9px] font-extrabold text-neutral-400 uppercase tracking-widest block">Available Slots</label>
                <select 
                  value={timeSlot}
                  onChange={(e) => setTimeSlot(e.target.value)}
                  className="w-full bg-neutral-50 dark:bg-neutral-250/40 border border-neutral-200 dark:border-neutral-250 rounded-xl py-2 px-3 text-xs font-semibold outline-none focus:ring-1 focus:ring-indigo-500 text-neutral-850 dark:text-neutral-200 cursor-pointer"
                >
                  <option value="10:00 AM - 10:30 AM">10:00 AM - 10:30 AM (Morning Hours)</option>
                  <option value="11:30 AM - 12:00 PM">11:30 AM - 12:00 PM (Office Hours)</option>
                  <option value="02:30 PM - 03:00 PM">02:30 PM - 03:00 PM (Afternoon Slot)</option>
                  <option value="04:00 PM - 04:30 PM">04:00 PM - 04:30 PM (Post Lectures)</option>
                </select>
              </div>

              {/* Consultation Topic */}
              <div className="space-y-1">
                <label className="text-[9px] font-extrabold text-neutral-400 uppercase tracking-widest block">Consultation Reason</label>
                <select 
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full bg-neutral-50 dark:bg-neutral-250/40 border border-neutral-200 dark:border-neutral-250 rounded-xl py-2 px-3 text-xs font-semibold outline-none focus:ring-1 focus:ring-indigo-500 text-neutral-850 dark:text-neutral-200 cursor-pointer"
                >
                  <option value="Doubts Clarification">Doubts Clarification</option>
                  <option value="Lab Record Evaluation">Lab Record Evaluation</option>
                  <option value="Project Review Meet">Project Review Meet</option>
                  <option value="Attendance / Internal Marks Discussion">Attendance & Marks Discussion</option>
                </select>
              </div>

              {/* Consultation Brief Context */}
              <div className="space-y-1">
                <label className="text-[9px] font-extrabold text-neutral-400 uppercase tracking-widest block">Short Context / Notes</label>
                <textarea 
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Explain the topic or specific doubts you wish to discuss..."
                  className="w-full bg-neutral-50 dark:bg-neutral-250/40 border border-neutral-200 dark:border-neutral-250 rounded-xl py-2.5 px-3 text-xs outline-none focus:ring-1 focus:ring-indigo-500 text-neutral-850 dark:text-neutral-200"
                  required
                />
              </div>

              {/* Book Consultation Confirm Button */}
              <button 
                type="submit"
                disabled={submitting}
                className="w-full btn-primary-custom font-extrabold text-xs py-3.5 rounded-2xl shadow-lg shadow-indigo-500/10 hover:shadow-indigo-500/20 transition-all cursor-pointer disabled:opacity-50"
              >
                {submitting ? 'Sending Request...' : 'Send Appointment Request'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactTeacherPage;
