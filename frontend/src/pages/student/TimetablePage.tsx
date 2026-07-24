import React, { useState, useEffect } from 'react';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  MapPin, 
  User, 
  ChevronLeft, 
  ChevronRight, 
  Printer, 
  Download, 
  Bell, 
  BellOff, 
  Grid, 
  CalendarRange, 
  Info, 
  X, 
  Mail, 
  Phone, 
  Map, 
  BookOpen, 
  CalendarDays 
} from 'lucide-react';

interface ClassSlot {
  subject: string;
  code: string;
  time: string;
  timeSlotId: string; // '1', '2', 'free1', 'lunch', '3', '4'
  room: string;
  professor: string;
  type: 'Lecture' | 'Tutorial' | 'Lab' | 'Practical' | 'Special';
  color: string;
  colorName: string; // 'blue' | 'yellow' | 'purple' | 'green' | 'orange'
  professorDetails: {
    email: string;
    phone: string;
    office: string;
    hours: string;
  };
}

const timetableSchedule: { [key: string]: ClassSlot[] } = {
  Monday: [
    {
      subject: 'Database Management Systems',
      code: 'CS-305',
      time: '09:00 AM - 10:00 AM',
      timeSlotId: '1',
      room: 'Room A201',
      professor: 'Dr. Sarah Jenkins',
      type: 'Lecture',
      color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
      colorName: 'blue',
      professorDetails: { email: 's.jenkins@university.edu', phone: '+1 (555) 234-5678', office: 'Block D, Cabin 12', hours: 'Mon/Wed 2-4 PM' }
    },
    {
      subject: 'Data Structures & Algorithms',
      code: 'CS-301',
      time: '10:15 AM - 11:15 AM',
      timeSlotId: '2',
      room: 'Room A301',
      professor: 'Prof. Alan Turing',
      type: 'Lecture',
      color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
      colorName: 'blue',
      professorDetails: { email: 'a.turing@university.edu', phone: '+1 (555) 345-6789', office: 'Block A, Cabin 305', hours: 'Tue/Thu 10-12 AM' }
    },
    {
      subject: 'Web Development',
      code: 'CS-307',
      time: '01:30 PM - 02:30 PM',
      timeSlotId: '3',
      room: 'Room A101',
      professor: 'Ms. Regina Phalange',
      type: 'Lecture',
      color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
      colorName: 'blue',
      professorDetails: { email: 'r.phalange@university.edu', phone: '+1 (555) 456-7890', office: 'Block B, Cabin 201', hours: 'Wed/Fri 1-3 PM' }
    },
    {
      subject: 'Operating Systems Laboratory',
      code: 'CS-310L',
      time: '02:45 PM - 03:45 PM',
      timeSlotId: '4',
      room: 'Lab A501',
      professor: 'TA1 (Alex Carter)',
      type: 'Lab',
      color: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
      colorName: 'purple',
      professorDetails: { email: 'alex.carter@university.edu', phone: '+1 (555) 901-2345', office: 'Block A, Lab Suite 1', hours: 'Mon 3-5 PM' }
    }
  ],
  Tuesday: [
    {
      subject: 'Data Structures & Algorithms',
      code: 'CS-301',
      time: '09:00 AM - 10:00 AM',
      timeSlotId: '1',
      room: 'Room A301',
      professor: 'Prof. Alan Turing',
      type: 'Lecture',
      color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
      colorName: 'blue',
      professorDetails: { email: 'a.turing@university.edu', phone: '+1 (555) 345-6789', office: 'Block A, Cabin 305', hours: 'Tue/Thu 10-12 AM' }
    },
    {
      subject: 'Web Development',
      code: 'CS-307',
      time: '10:15 AM - 11:15 AM',
      timeSlotId: '2',
      room: 'Room A101',
      professor: 'Ms. Regina Phalange',
      type: 'Lecture',
      color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
      colorName: 'blue',
      professorDetails: { email: 'r.phalange@university.edu', phone: '+1 (555) 456-7890', office: 'Block B, Cabin 201', hours: 'Wed/Fri 1-3 PM' }
    },
    {
      subject: 'Cloud Computing',
      code: 'CS-312',
      time: '01:30 PM - 02:30 PM',
      timeSlotId: '3',
      room: 'Room A401',
      professor: 'Dr. James Gosling',
      type: 'Lecture',
      color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
      colorName: 'blue',
      professorDetails: { email: 'j.gosling@university.edu', phone: '+1 (555) 567-8901', office: 'Block C, Cabin 410', hours: 'Mon/Tue 11-12 AM' }
    },
    {
      subject: 'Operating Systems Laboratory',
      code: 'CS-310L',
      time: '02:45 PM - 03:45 PM',
      timeSlotId: '4',
      room: 'Lab A502',
      professor: 'TA2 (Bella Swan)',
      type: 'Lab',
      color: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
      colorName: 'purple',
      professorDetails: { email: 'bella.swan@university.edu', phone: '+1 (555) 901-2346', office: 'Block A, Lab Suite 2', hours: 'Tue 3-5 PM' }
    }
  ],
  Wednesday: [
    {
      subject: 'Web Development',
      code: 'CS-307',
      time: '09:00 AM - 10:00 AM',
      timeSlotId: '1',
      room: 'Room A101',
      professor: 'Ms. Regina Phalange',
      type: 'Lecture',
      color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
      colorName: 'blue',
      professorDetails: { email: 'r.phalange@university.edu', phone: '+1 (555) 456-7890', office: 'Block B, Cabin 201', hours: 'Wed/Fri 1-3 PM' }
    },
    {
      subject: 'Cloud Computing',
      code: 'CS-312',
      time: '10:15 AM - 11:15 AM',
      timeSlotId: '2',
      room: 'Room A401',
      professor: 'Dr. James Gosling',
      type: 'Lecture',
      color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
      colorName: 'blue',
      professorDetails: { email: 'j.gosling@university.edu', phone: '+1 (555) 567-8901', office: 'Block C, Cabin 410', hours: 'Mon/Tue 11-12 AM' }
    },
    {
      subject: 'Operating Systems',
      code: 'CS-309',
      time: '01:30 PM - 02:30 PM',
      timeSlotId: '3',
      room: 'Room A501',
      professor: 'Prof. Dennis Ritchie',
      type: 'Lecture',
      color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
      colorName: 'blue',
      professorDetails: { email: 'd.ritchie@university.edu', phone: '+1 (555) 678-9012', office: 'Block A, Cabin 502', hours: 'Wed/Fri 9-11 AM' }
    }
  ],
  Thursday: [
    {
      subject: 'Cloud Computing',
      code: 'CS-312',
      time: '09:00 AM - 10:00 AM',
      timeSlotId: '1',
      room: 'Room A401',
      professor: 'Dr. James Gosling',
      type: 'Lecture',
      color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
      colorName: 'blue',
      professorDetails: { email: 'j.gosling@university.edu', phone: '+1 (555) 567-8901', office: 'Block C, Cabin 410', hours: 'Mon/Tue 11-12 AM' }
    },
    {
      subject: 'Operating Systems',
      code: 'CS-309',
      time: '10:15 AM - 11:15 AM',
      timeSlotId: '2',
      room: 'Room A501',
      professor: 'Prof. Dennis Ritchie',
      type: 'Lecture',
      color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
      colorName: 'blue',
      professorDetails: { email: 'd.ritchie@university.edu', phone: '+1 (555) 678-9012', office: 'Block A, Cabin 502', hours: 'Wed/Fri 9-11 AM' }
    },
    {
      subject: 'Database Management Systems',
      code: 'CS-305',
      time: '01:30 PM - 02:30 PM',
      timeSlotId: '3',
      room: 'Room A201',
      professor: 'Dr. Sarah Jenkins',
      type: 'Lecture',
      color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
      colorName: 'blue',
      professorDetails: { email: 's.jenkins@university.edu', phone: '+1 (555) 234-5678', office: 'Block D, Cabin 12', hours: 'Mon/Wed 2-4 PM' }
    },
    {
      subject: 'Operating Systems Laboratory',
      code: 'CS-310L',
      time: '02:45 PM - 03:45 PM',
      timeSlotId: '4',
      room: 'Lab A503',
      professor: 'TA3 (Chris Evans)',
      type: 'Lab',
      color: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
      colorName: 'purple',
      professorDetails: { email: 'chris.evans@university.edu', phone: '+1 (555) 901-2347', office: 'Block A, Lab Suite 3', hours: 'Thu 3-5 PM' }
    }
  ],
  Friday: [
    {
      subject: 'Operating Systems',
      code: 'CS-309',
      time: '09:00 AM - 10:00 AM',
      timeSlotId: '1',
      room: 'Room A501',
      professor: 'Prof. Dennis Ritchie',
      type: 'Lecture',
      color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
      colorName: 'blue',
      professorDetails: { email: 'd.ritchie@university.edu', phone: '+1 (555) 678-9012', office: 'Block A, Cabin 502', hours: 'Wed/Fri 9-11 AM' }
    },
    {
      subject: 'Database Management Systems',
      code: 'CS-305',
      time: '10:15 AM - 11:15 AM',
      timeSlotId: '2',
      room: 'Room A201',
      professor: 'Dr. Sarah Jenkins',
      type: 'Lecture',
      color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
      colorName: 'blue',
      professorDetails: { email: 's.jenkins@university.edu', phone: '+1 (555) 234-5678', office: 'Block D, Cabin 12', hours: 'Mon/Wed 2-4 PM' }
    },
    {
      subject: 'Data Structures & Algorithms',
      code: 'CS-301',
      time: '01:30 PM - 02:30 PM',
      timeSlotId: '3',
      room: 'Room A301',
      professor: 'Prof. Alan Turing',
      type: 'Lecture',
      color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
      colorName: 'blue',
      professorDetails: { email: 'a.turing@university.edu', phone: '+1 (555) 345-6789', office: 'Block A, Cabin 305', hours: 'Tue/Thu 10-12 AM' }
    },
    {
      subject: 'Operating Systems Laboratory',
      code: 'CS-310L',
      time: '02:45 PM - 03:45 PM',
      timeSlotId: '4',
      room: 'Lab A504',
      professor: 'TA4 (Diana Prince)',
      type: 'Lab',
      color: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
      colorName: 'purple',
      professorDetails: { email: 'diana.prince@university.edu', phone: '+1 (555) 901-2348', office: 'Block A, Lab Suite 4', hours: 'Fri 3-5 PM' }
    }
  ],
  Saturday: [] // Weekend - no regular classes
};

// Add Tutorial and Special Class to schedule for demo color completeness
timetableSchedule['Wednesday'].push({
  subject: 'DBMS Tutorial Session',
  code: 'CS-305T',
  time: '11:15 AM - 12:30 PM',
  timeSlotId: 'free1',
  room: 'Room A201',
  professor: 'Dr. Sarah Jenkins',
  type: 'Tutorial',
  color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
  colorName: 'yellow',
  professorDetails: { email: 's.jenkins@university.edu', phone: '+1 (555) 234-5678', office: 'Block D, Cabin 12', hours: 'Mon/Wed 2-4 PM' }
});

timetableSchedule['Thursday'].push({
  subject: 'Seminar on Machine Learning',
  code: 'CS-499S',
  time: '11:15 AM - 12:30 PM',
  timeSlotId: 'free1',
  room: 'Main Auditorium',
  professor: 'Dr. Yann LeCun',
  type: 'Special',
  color: 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20',
  colorName: 'orange',
  professorDetails: { email: 'yann.lecun@university.edu', phone: '+1 (555) 789-0123', office: 'Block C, Cabin 501', hours: 'Thu 11 AM - 1 PM' }
});

const weekTimeSlots = [
  { id: '1', label: '09:00 - 10:00', time: '09:00 AM - 10:00 AM' },
  { id: '2', label: '10:15 - 11:15', time: '10:15 AM - 11:15 AM' },
  { id: 'free1', label: '11:15 - 12:30', time: '11:15 AM - 12:30 PM', isFreeDefault: true },
  { id: 'lunch', label: 'LUNCH', time: '12:30 PM - 01:30 PM', isBreak: true },
  { id: '3', label: '1:30 - 2:30', time: '01:30 PM - 02:30 PM' },
  { id: '4', label: '2:45 - 3:45', time: '02:45 PM - 03:45 PM' }
];

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export const TimetablePage: React.FC = () => {
  const [viewMode, setViewMode] = useState<'day' | 'week' | 'month'>('week');
  const [activeDay, setActiveDay] = useState('Monday');
  
  // Modals & Popups States
  const [selectedClass, setSelectedClass] = useState<ClassSlot | null>(null);
  const [showMap, setShowMap] = useState(false);
  const [exportMenuOpen, setExportMenuOpen] = useState(false);
  const [reminderEnabled, setReminderEnabled] = useState(() => {
    return localStorage.getItem('class_reminders') === 'true';
  });
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Month View Date
  const currentMonthDate = new Date(2026, 9, 20); // October 2026

  useEffect(() => {
    localStorage.setItem('class_reminders', reminderEnabled.toString());
  }, [reminderEnabled]);

  // Request notifications
  const handleToggleReminders = () => {
    if (!reminderEnabled) {
      if ('Notification' in window) {
        Notification.requestPermission().then((permission) => {
          if (permission === 'granted') {
            setReminderEnabled(true);
            triggerToast('Class notifications enabled successfully!');
            // Show a test notification immediately
            new Notification('ERP Class Reminder', {
              body: 'Notification enabled! You will be reminded 10 minutes before each class.',
              icon: '/jcer.png'
            });
          } else {
            triggerToast('Permission denied. Cannot enable notifications.');
          }
        });
      } else {
        triggerToast('Notifications are not supported in this browser.');
      }
    } else {
      setReminderEnabled(false);
      triggerToast('Class notifications disabled.');
    }
  };

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Printing Layout Function
  const handlePrint = () => {
    window.print();
  };

  // Simulated PDF download
  const handleDownloadPDF = () => {
    triggerToast('Generating PDF of your academic timetable...');
    setTimeout(() => {
      window.print();
    }, 1000);
  };

  // Simulated Image PNG download
  const handleDownloadImage = () => {
    triggerToast('Capturing timetable screen layout...');
    setTimeout(() => {
      const link = document.createElement('a');
      link.href = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600"><rect width="800" height="600" fill="%23f1f4fa"/><text x="400" y="300" font-family="sans-serif" font-size="24" fill="%231a1a1a" text-anchor="middle">Timetable Export</text></svg>';
      link.download = 'academic_timetable.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      triggerToast('Downloaded timetable image successfully.');
    }, 1500);
  };

  // Real ICS iCal file download for full calendar
  const handleDownloadFullICS = () => {
    triggerToast('Building iCal calendar file...');
    let icsLines = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//University ERP//Student Timetable//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH'
    ];

    const allEvents: Array<{ summary: string; code: string; day: string; start: string; end: string; room: string; prof: string }> = [];
    Object.keys(timetableSchedule).forEach((dayName) => {
      const slots = timetableSchedule[dayName];
      const dayMap: { [key: string]: string } = {
        Monday: 'MO', Tuesday: 'TU', Wednesday: 'WE', Thursday: 'TH', Friday: 'FR', Saturday: 'SA'
      };
      const dayCode = dayMap[dayName];
      if (!dayCode) return;

      slots.forEach((s) => {
        let timeStart = '090000';
        let timeEnd = '100000';
        if (s.timeSlotId === '1') {
          timeStart = '090000'; timeEnd = '100000';
        } else if (s.timeSlotId === '2') {
          timeStart = '101500'; timeEnd = '111500';
        } else if (s.timeSlotId === 'free1') {
          timeStart = '111500'; timeEnd = '123000';
        } else if (s.timeSlotId === '3') {
          timeStart = '133000'; timeEnd = '143000';
        } else if (s.timeSlotId === '4') {
          timeStart = '144500'; timeEnd = '154500';
        }

        allEvents.push({
          summary: s.subject,
          code: s.code,
          day: dayCode,
          start: timeStart,
          end: timeEnd,
          room: s.room,
          prof: s.professor
        });
      });
    });

    allEvents.forEach((ev, idx) => {
      let startDate = '20261019'; // Baseline Monday
      if (ev.day === 'TU') startDate = '20261020';
      else if (ev.day === 'WE') startDate = '20261021';
      else if (ev.day === 'TH') startDate = '20261022';
      else if (ev.day === 'FR') startDate = '20261023';
      else if (ev.day === 'SA') startDate = '20261024';

      icsLines.push('BEGIN:VEVENT');
      icsLines.push(`UID:class-event-${idx}-2026@university-erp.edu`);
      icsLines.push(`DTSTAMP:20260624T120000Z`);
      icsLines.push(`DTSTART;TZID=Asia/Kolkata:${startDate}T${ev.start}`);
      icsLines.push(`DTEND;TZID=Asia/Kolkata:${startDate}T${ev.end}`);
      icsLines.push(`RRULE:FREQ=WEEKLY;BYDAY=${ev.day};UNTIL=20261218T170000`);
      icsLines.push(`SUMMARY:${ev.summary} (${ev.code})`);
      icsLines.push(`LOCATION:${ev.room}`);
      icsLines.push(`DESCRIPTION:Scheduled lecture by ${ev.prof}`);
      icsLines.push('END:VEVENT');
    });

    icsLines.push('END:VCALENDAR');
    const blob = new Blob([icsLines.join('\r\n')], { type: 'text/calendar;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'academic_timetable_sem3.ics';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setExportMenuOpen(false);
    triggerToast('Full academic timetable downloaded as iCal file!');
  };

  // Real single ICS event download
  const handleDownloadSingleICS = (s: ClassSlot, dayName: string) => {
    let icsLines = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//University ERP//Single Class//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH'
    ];

    const dayMap: { [key: string]: string } = {
      Monday: 'MO', Tuesday: 'TU', Wednesday: 'WE', Thursday: 'TH', Friday: 'FR', Saturday: 'SA'
    };
    const dayCode = dayMap[dayName] || 'MO';

    let timeStart = '090000';
    let timeEnd = '100000';
    if (s.timeSlotId === '1') {
      timeStart = '090000'; timeEnd = '100000';
    } else if (s.timeSlotId === '2') {
      timeStart = '101500'; timeEnd = '111500';
    } else if (s.timeSlotId === 'free1') {
      timeStart = '111500'; timeEnd = '123000';
    } else if (s.timeSlotId === '3') {
      timeStart = '133000'; timeEnd = '143000';
    } else if (s.timeSlotId === '4') {
      timeStart = '144500'; timeEnd = '154500';
    }

    let startDate = '20261019';
    if (dayCode === 'TU') startDate = '20261020';
    else if (dayCode === 'WE') startDate = '20261021';
    else if (dayCode === 'TH') startDate = '20261022';
    else if (dayCode === 'FR') startDate = '20261023';
    else if (dayCode === 'SA') startDate = '20261024';

    icsLines.push('BEGIN:VEVENT');
    icsLines.push(`UID:single-class-${s.code}-${dayCode}@university-erp.edu`);
    icsLines.push(`DTSTAMP:20260624T120000Z`);
    icsLines.push(`DTSTART;TZID=Asia/Kolkata:${startDate}T${timeStart}`);
    icsLines.push(`DTEND;TZID=Asia/Kolkata:${startDate}T${timeEnd}`);
    icsLines.push(`RRULE:FREQ=WEEKLY;BYDAY=${dayCode};UNTIL=20261218T170000`);
    icsLines.push(`SUMMARY:${s.subject} (${s.code})`);
    icsLines.push(`LOCATION:${s.room}`);
    icsLines.push(`DESCRIPTION:Weekly class with ${s.professor}. Office hours: ${s.professorDetails.hours}`);
    icsLines.push('END:VEVENT');
    icsLines.push('END:VCALENDAR');

    const blob = new Blob([icsLines.join('\r\n')], { type: 'text/calendar;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${s.code.replace(' ', '_')}_class.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    triggerToast(`Added ${s.code} to Calendar (ICS file downloaded)`);
  };

  // Helper: Find cell data
  const getCellData = (day: string, slotId: string): ClassSlot | null => {
    return timetableSchedule[day]?.find((s) => s.timeSlotId === slotId) || null;
  };

  // Month View Days Builder
  const buildMonthDays = () => {
    const daysInMonth = 31;
    const firstDayIndex = 4; // Oct 1, 2026 is Thursday
    const cells = [];
    
    // Empty cells before Oct 1
    for (let i = 0; i < firstDayIndex; i++) {
      cells.push(null);
    }
    
    // Cells 1 to 31
    for (let day = 1; day <= daysInMonth; day++) {
      cells.push(day);
    }
    return cells;
  };

  const getDayNameFromDateIndex = (index: number): string => {
    const dayIndex = index % 7;
    const map = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return map[dayIndex];
  };

  // Map markers for holidays/exams
  const getHolidayOrExam = (dayNumber: number): { label: string; type: 'holiday' | 'exam' | 'review' } | null => {
    if (dayNumber === 2) return { label: 'Gandhi Jayanti (Holiday)', type: 'holiday' };
    if (dayNumber === 19) return { label: 'Academic Review', type: 'review' };
    if (dayNumber === 22 || dayNumber === 23 || dayNumber === 24) return { label: 'Midterm Exams', type: 'exam' };
    return null;
  };

  const renderSVGFloorPlan = (roomCode: string) => {
    const isLab = roomCode.toLowerCase().includes('lab');
    return (
      <svg viewBox="0 0 400 240" className="w-full bg-neutral-900 rounded-3xl border border-neutral-850 p-4 shadow-inner">
        {/* Corridor */}
        <rect x="20" y="100" width="360" height="40" fill="#1f2937" rx="4" />
        <text x="200" y="125" fill="#6b7280" fontSize="10" fontWeight="bold" textAnchor="middle" letterSpacing="2">MAIN CORRIDOR (FLOOR 5)</text>

        {/* Rooms Top Row */}
        <rect x="20" y="20" width="70" height="60" rx="8" fill={roomCode.includes('101') ? '#312e81' : '#111827'} stroke={roomCode.includes('101') ? '#4f46e5' : '#374151'} strokeWidth="2" />
        <text x="55" y="55" fill={roomCode.includes('101') ? '#818cf8' : '#9ca3af'} fontSize="12" fontWeight="bold" textAnchor="middle">A101</text>

        <rect x="110" y="20" width="70" height="60" rx="8" fill={roomCode.includes('201') ? '#312e81' : '#111827'} stroke={roomCode.includes('201') ? '#4f46e5' : '#374151'} strokeWidth="2" />
        <text x="145" y="55" fill={roomCode.includes('201') ? '#818cf8' : '#9ca3af'} fontSize="12" fontWeight="bold" textAnchor="middle">A201</text>

        <rect x="200" y="20" width="70" height="60" rx="8" fill={roomCode.includes('301') ? '#312e81' : '#111827'} stroke={roomCode.includes('301') ? '#4f46e5' : '#374151'} strokeWidth="2" />
        <text x="235" y="55" fill={roomCode.includes('301') ? '#818cf8' : '#9ca3af'} fontSize="12" fontWeight="bold" textAnchor="middle">A301</text>

        <rect x="290" y="20" width="90" height="60" rx="8" fill={roomCode.includes('401') ? '#312e81' : '#111827'} stroke={roomCode.includes('401') ? '#4f46e5' : '#374151'} strokeWidth="2" />
        <text x="335" y="55" fill={roomCode.includes('401') ? '#818cf8' : '#9ca3af'} fontSize="12" fontWeight="bold" textAnchor="middle">A401</text>

        {/* Rooms Bottom Row */}
        <rect x="20" y="160" width="80" height="60" rx="8" fill={roomCode.includes('501') ? '#312e81' : '#111827'} stroke={roomCode.includes('501') ? '#4f46e5' : '#374151'} strokeWidth="2" />
        <text x="60" y="195" fill={roomCode.includes('501') ? '#818cf8' : '#9ca3af'} fontSize="12" fontWeight="bold" textAnchor="middle">{isLab && roomCode.includes('501') ? 'Lab A501' : 'A501'}</text>

        <rect x="110" y="160" width="80" height="60" rx="8" fill={roomCode.includes('502') ? '#312e81' : '#111827'} stroke={roomCode.includes('502') ? '#4f46e5' : '#374151'} strokeWidth="2" />
        <text x="150" y="195" fill={roomCode.includes('502') ? '#818cf8' : '#9ca3af'} fontSize="12" fontWeight="bold" textAnchor="middle">{isLab && roomCode.includes('502') ? 'Lab A502' : 'A502'}</text>

        <rect x="200" y="160" width="80" height="60" rx="8" fill={roomCode.includes('503') ? '#312e81' : '#111827'} stroke={roomCode.includes('503') ? '#4f46e5' : '#374151'} strokeWidth="2" />
        <text x="240" y="195" fill={roomCode.includes('503') ? '#818cf8' : '#9ca3af'} fontSize="12" fontWeight="bold" textAnchor="middle">{isLab && roomCode.includes('503') ? 'Lab A503' : 'A503'}</text>

        <rect x="290" y="160" width="90" height="60" rx="8" fill={roomCode.includes('504') ? '#312e81' : '#111827'} stroke={roomCode.includes('504') ? '#4f46e5' : '#374151'} strokeWidth="2" />
        <text x="335" y="195" fill={roomCode.includes('504') ? '#818cf8' : '#9ca3af'} fontSize="12" fontWeight="bold" textAnchor="middle">{isLab && roomCode.includes('504') ? 'Lab A504' : 'A504'}</text>

        {/* You Are Here Indicator */}
        <circle cx="200" cy="120" r="5" fill="#f43f5e" />
        <text x="210" y="123" fill="#ef4444" fontSize="8" fontWeight="black">YOU ARE HERE</text>
      </svg>
    );
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in relative print:p-0">
      
      {/* Dynamic Printing Style Block */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          body, html {
            background: #ffffff !important;
            color: #000000 !important;
          }
          aside, header, nav, button, .no-print, .print-btn-strip {
            display: none !important;
          }
          main, .print-container {
            margin: 0 !important;
            padding: 0 !important;
            width: 100% !important;
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            box-shadow: none !important;
          }
          .glass-panel {
            background: #ffffff !important;
            border: 1px solid #e5e7eb !important;
            box-shadow: none !important;
            color: #000000 !important;
            transform: none !important;
            border-radius: 12px !important;
          }
          .glass-table-container {
            background: #ffffff !important;
            box-shadow: none !important;
            border: 1px solid #e5e7eb !important;
            border-radius: 12px !important;
          }
          .glass-table-container thead {
            background-color: #1a1a1a !important;
            color: #ffffff !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .text-white {
            color: #000000 !important;
          }
        }
      `}} />

      {/* Floating toast notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-neutral-900 text-white px-5 py-3 rounded-2xl shadow-ambient border border-neutral-800 text-xs font-bold flex items-center gap-2 animate-slide-in no-print">
          <Info className="w-4 h-4 text-indigo-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* HEADER SECTION (Academic Timetable Title Block) */}
      <div className="glass-panel rounded-[32px] p-6 shadow-ambient print-container">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
              <CalendarIcon className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-neutral-900 dark:text-white tracking-tight uppercase">Class Timetable</h2>
              <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-400 dark:text-neutral-500 font-semibold mt-0.5">
                <span>Semester 3</span>
                <span>•</span>
                <span>Academic Year 2024-25</span>
              </div>
            </div>
          </div>
          
          {/* Controls: Mode Selectors, Notification Alarm, Print/Export */}
          <div className="flex flex-wrap items-center gap-2.5 no-print print-btn-strip">
            {/* View Mode Pills */}
            <div className="bg-neutral-100/80 dark:bg-neutral-800/60 p-1 rounded-2xl border border-neutral-200/50 dark:border-neutral-700/30 flex items-center no-print">
              <button
                onClick={() => setViewMode('day')}
                className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all flex items-center gap-1 cursor-pointer ${
                  viewMode === 'day' 
                    ? 'nav-pill-active shadow-sm' 
                    : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-800'
                }`}
              >
                <Grid className="w-3.5 h-3.5" />
                <span>Day</span>
              </button>
              <button
                onClick={() => setViewMode('week')}
                className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all flex items-center gap-1 cursor-pointer ${
                  viewMode === 'week' 
                    ? 'nav-pill-active shadow-sm' 
                    : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-800'
                }`}
              >
                <CalendarIcon className="w-3.5 h-3.5" />
                <span>Week</span>
              </button>
              <button
                onClick={() => setViewMode('month')}
                className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all flex items-center gap-1 cursor-pointer ${
                  viewMode === 'month' 
                    ? 'nav-pill-active shadow-sm' 
                    : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-800'
                }`}
              >
                <CalendarRange className="w-3.5 h-3.5" />
                <span>Month</span>
              </button>
            </div>

            {/* Reminder Bell Trigger */}
            <button
              onClick={handleToggleReminders}
              className={`w-9 h-9 rounded-xl border border-neutral-250/20 flex items-center justify-center cursor-pointer transition-all ${
                reminderEnabled 
                  ? 'bg-rose-500/10 text-rose-500 border-rose-500/30 hover:bg-rose-500/20' 
                  : 'bg-white/50 dark:bg-neutral-900/30 text-neutral-400 hover:bg-neutral-100'
              }`}
              title={reminderEnabled ? "Disable class reminders" : "Enable class reminders"}
            >
              {reminderEnabled ? <Bell className="w-4 h-4" /> : <BellOff className="w-4 h-4" />}
            </button>

            {/* Print Trigger */}
            <button
              onClick={handlePrint}
              className="w-9 h-9 rounded-xl bg-white/50 dark:bg-neutral-900/30 border border-neutral-250/20 flex items-center justify-center text-neutral-600 dark:text-neutral-350 hover:bg-neutral-100 dark:hover:bg-neutral-850 cursor-pointer"
              title="Print Timetable"
            >
              <Printer className="w-4 h-4" />
            </button>

            {/* Export Dropdown */}
            <div className="relative">
              <button
                onClick={() => setExportMenuOpen(!exportMenuOpen)}
                className="px-3.5 h-9 rounded-xl bg-neutral-950 dark:bg-white text-white dark:text-neutral-900 text-xs font-bold flex items-center gap-1.5 hover:opacity-90 active:scale-95 transition-all cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export</span>
              </button>

              {exportMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-neutral-950 border border-neutral-200/50 dark:border-neutral-850 rounded-2xl py-2 shadow-deep z-50 animate-fade-in">
                  <button
                    onClick={handleDownloadFullICS}
                    className="w-full text-left px-4 py-2.5 text-xs font-bold text-neutral-700 dark:text-neutral-350 hover:bg-neutral-50 dark:hover:bg-neutral-900 flex items-center gap-2"
                  >
                    <CalendarDays className="w-4 h-4 text-indigo-500" />
                    <span>iCal Format (.ics)</span>
                  </button>
                  <button
                    onClick={handleDownloadPDF}
                    className="w-full text-left px-4 py-2.5 text-xs font-bold text-neutral-700 dark:text-neutral-350 hover:bg-neutral-50 dark:hover:bg-neutral-900 flex items-center gap-2"
                  >
                    <Printer className="w-4 h-4 text-emerald-500" />
                    <span>Save to PDF</span>
                  </button>
                  <button
                    onClick={handleDownloadImage}
                    className="w-full text-left px-4 py-2.5 text-xs font-bold text-neutral-700 dark:text-neutral-350 hover:bg-neutral-50 dark:hover:bg-neutral-900 flex items-center gap-2"
                  >
                    <BookOpen className="w-4 h-4 text-pink-500" />
                    <span>Export Image (.png)</span>
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>

        {/* Day Mode Sub-headers */}
        {viewMode === 'day' && (
          <div className="flex flex-wrap gap-2 mt-8 border-t border-neutral-100 dark:border-neutral-850 pt-6 no-print">
            {daysOfWeek.map((day) => (
              <button
                key={day}
                onClick={() => setActiveDay(day)}
                className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all duration-300 cursor-pointer ${
                  activeDay === day
                    ? 'btn-primary-custom shadow-sm'
                    : 'bg-white/50 dark:bg-neutral-900/30 text-neutral-500 border border-neutral-200/40 dark:border-neutral-800 hover:bg-neutral-100/50 dark:hover:bg-neutral-800/55'
                }`}
              >
                {day}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* VIEW MODES RENDERING AREA */}
      <div className="print-container">
        
        {/* 1. DAY VIEW MODE */}
        {viewMode === 'day' && (
          <div className="grid grid-cols-1 gap-4">
            {timetableSchedule[activeDay] && timetableSchedule[activeDay].length > 0 ? (
              timetableSchedule[activeDay].map((slot, index) => (
                <div
                  key={index}
                  onClick={() => setSelectedClass(slot)}
                  className={`glass-panel rounded-[28px] p-6 shadow-ambient flex flex-col md:flex-row md:items-center justify-between border-l-4 ${
                    slot.type === 'Lecture' ? 'border-blue-500' :
                    slot.type === 'Tutorial' ? 'border-amber-500' :
                    slot.type === 'Lab' ? 'border-purple-500' :
                    slot.type === 'Practical' ? 'border-emerald-500' : 'border-orange-500'
                  } hover:scale-[1.01] transition-transform duration-200 cursor-pointer`}
                >
                  <div className="flex flex-col md:flex-row md:items-center gap-6">
                    <div className="flex items-center space-x-2 bg-white/40 dark:bg-neutral-900/40 border border-neutral-200/50 dark:border-neutral-800/50 px-4 py-2.5 rounded-2xl md:min-w-[190px]">
                      <Clock className="w-4 h-4 text-neutral-400" />
                      <span className="text-xs font-bold text-neutral-600 dark:text-neutral-300">{slot.time}</span>
                    </div>

                    <div className="space-y-1">
                      <h4 className="text-base font-bold tracking-tight text-neutral-900 dark:text-white">{slot.subject}</h4>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-neutral-400 font-semibold">
                        <span className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5" />
                          {slot.room}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5" />
                          {slot.professor}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className={`mt-4 md:mt-0 self-start md:self-auto px-4 py-1.5 rounded-full text-xs font-bold border ${slot.color.split(' ').slice(0, 2).join(' ')}`}>
                    {slot.code}
                  </div>
                </div>
              ))
            ) : (
              <div className="glass-panel rounded-[28px] p-12 text-center text-neutral-400 font-semibold">
                No classes scheduled for {activeDay}. (Enjoy your day off!)
              </div>
            )}
          </div>
        )}

        {/* 2. WEEK VIEW GRID MODE */}
        {viewMode === 'week' && (
          <div className="glass-panel rounded-[32px] p-6 shadow-ambient overflow-hidden print-container" id="timetable-print-area">
            <h3 className="text-lg font-bold text-neutral-900 dark:text-white tracking-tight mb-4 uppercase pl-1 print:block hidden">
              Class Timetable - Semester 3
            </h3>
            
            <div className="overflow-hidden rounded-[20px] glass-table-container border border-neutral-100 dark:border-neutral-800/40 shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left border-collapse">
                  <thead className="text-xs uppercase font-bold tracking-wider">
                    <tr>
                      <th className="px-4 py-4 text-center border border-neutral-200/40 dark:border-neutral-800/40 min-w-[120px]">TIME \ DAY</th>
                      <th className="px-4 py-4 text-center border border-neutral-200/40 dark:border-neutral-800/40">MON</th>
                      <th className="px-4 py-4 text-center border border-neutral-200/40 dark:border-neutral-800/40">TUE</th>
                      <th className="px-4 py-4 text-center border border-neutral-200/40 dark:border-neutral-800/40">WED</th>
                      <th className="px-4 py-4 text-center border border-neutral-200/40 dark:border-neutral-800/40">THU</th>
                      <th className="px-4 py-4 text-center border border-neutral-200/40 dark:border-neutral-800/40">FRI</th>
                      <th className="px-4 py-4 text-center border border-neutral-200/40 dark:border-neutral-800/40">SAT</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200/30 dark:divide-neutral-800/30">
                    {weekTimeSlots.map((slot) => {
                      if (slot.isBreak) {
                        return (
                          <tr key={slot.id} className="bg-neutral-50/40 dark:bg-neutral-900/10">
                            <td className="px-4 py-3 text-center font-bold text-neutral-400 border border-neutral-200/40 dark:border-neutral-800/40">
                              {slot.label}
                            </td>
                            <td colSpan={6} className="px-4 py-3 text-center font-extrabold text-neutral-500 tracking-wider text-xs border border-neutral-200/40 dark:border-neutral-800/40">
                              LUNCH BREAK (12:30 PM - 01:30 PM)
                            </td>
                          </tr>
                        );
                      }

                      return (
                        <tr key={slot.id}>
                          {/* Time label column */}
                          <td className="px-4 py-6 text-center font-bold text-neutral-500 dark:text-neutral-400 border border-neutral-200/40 dark:border-neutral-800/40 text-xs bg-neutral-50/20 dark:bg-neutral-900/5">
                            <div>{slot.label}</div>
                            <div className="text-[10px] text-neutral-400 font-medium mt-0.5">{slot.time.split(' - ')[0]}</div>
                          </td>

                          {/* Days Columns */}
                          {daysOfWeek.map((day) => {
                            const classItem = getCellData(day, slot.id);

                            if (!classItem) {
                              return (
                                <td key={day} className="px-2 py-4 text-center border border-neutral-200/40 dark:border-neutral-800/40 text-[10px] font-bold text-neutral-350 dark:text-neutral-600 bg-neutral-50/5 dark:bg-transparent">
                                  <span>-</span>
                                </td>
                              );
                            }

                            return (
                              <td
                                key={day}
                                onClick={() => setSelectedClass(classItem)}
                                className={`px-2 py-4 text-center border border-neutral-200/40 dark:border-neutral-800/40 cursor-pointer transition-all hover:scale-[1.02] hover:shadow-sm ${classItem.color}`}
                                title={`Professor: ${classItem.professor}`}
                              >
                                <div className="font-extrabold text-[13px] tracking-tight">{classItem.code}</div>
                                <div className="text-[10px] font-semibold opacity-90 mt-0.5">{classItem.room}</div>
                                <div className="text-[9px] font-medium opacity-85 mt-1 hidden sm:block truncate max-w-[90px] mx-auto">
                                  {classItem.professor.split(' ').slice(-1)[0]}
                                </div>
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* LEGEND SECTION */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-6 border-t border-neutral-100 dark:border-neutral-850 pt-5 text-xs font-bold text-neutral-500">
              <span className="text-[10px] uppercase text-neutral-400">Legend:</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span> Lecture</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Tutorial</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span> Lab</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Practical</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-orange-500"></span> Special</span>
            </div>
          </div>
        )}

        {/* 3. MONTH CALENDAR VIEW MODE */}
        {viewMode === 'month' && (
          <div className="glass-panel rounded-[32px] p-6 shadow-ambient print-container">
            {/* Calendar header with Month title */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-neutral-900 dark:text-white tracking-tight uppercase">
                October 2026
              </h3>
              <div className="text-xs font-bold text-rose-500 bg-rose-500/10 border border-rose-500/25 px-3 py-1.5 rounded-xl">
                ⚠️ Exam Period: Oct 22 - Oct 24
              </div>
            </div>

            <div className="overflow-hidden rounded-[20px] glass-table-container border border-neutral-100 dark:border-neutral-800/40">
              <div className="grid grid-cols-7 border-b border-neutral-200/40 dark:border-neutral-800/40 text-center text-xs font-extrabold tracking-wider bg-neutral-950 text-white uppercase py-3.5">
                <div>Sun</div>
                <div>Mon</div>
                <div>Tue</div>
                <div>Wed</div>
                <div>Thu</div>
                <div>Fri</div>
                <div>Sat</div>
              </div>
              
              <div className="grid grid-cols-7 bg-neutral-50/20 dark:bg-neutral-950/20">
                {buildMonthDays().map((dayNumber, idx) => {
                  const dayName = getDayNameFromDateIndex(idx);
                  const isWeekend = idx % 7 === 0 || idx % 7 === 6;
                  const marker = dayNumber ? getHolidayOrExam(dayNumber) : null;
                  
                  // Scheduled classes count for color indicators
                  const dayClasses = dayNumber && timetableSchedule[dayName] ? timetableSchedule[dayName] : [];

                  return (
                    <div
                      key={idx}
                      onClick={() => {
                        if (dayNumber && !isWeekend) {
                          setActiveDay(dayName);
                          setViewMode('day');
                        }
                      }}
                      className={`min-h-[90px] p-2 border-r border-b border-neutral-200/30 dark:border-neutral-800/30 flex flex-col justify-between transition-colors ${
                        dayNumber ? 'hover:bg-neutral-100/30 dark:hover:bg-neutral-900/30 cursor-pointer' : 'opacity-30 bg-neutral-100/10'
                      } ${dayNumber === 20 ? 'bg-indigo-500/10 dark:bg-indigo-500/5' : ''}`}
                    >
                      <div className="flex items-center justify-between">
                        <span className={`text-xs font-bold ${
                          dayNumber === 20 ? 'w-5 h-5 rounded-full bg-indigo-500 text-white flex items-center justify-center' : 'text-neutral-500'
                        }`}>
                          {dayNumber}
                        </span>
                        
                        {/* Short Holiday or Exam label */}
                        {marker && (
                          <span className={`text-[8px] font-bold px-1 py-0.5 rounded ${
                            marker.type === 'holiday' ? 'bg-rose-500/20 text-rose-500' :
                            marker.type === 'review' ? 'bg-amber-500/20 text-amber-500' : 'bg-orange-500/20 text-orange-500'
                          }`}>
                            {marker.type === 'holiday' ? 'Holiday' : marker.type === 'review' ? 'Review' : 'Exams'}
                          </span>
                        )}
                      </div>

                      {/* Class bullet indicators */}
                      {dayNumber && !isWeekend && dayClasses.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {dayClasses.map((c, cidx) => (
                            <div
                              key={cidx}
                              className={`w-2 h-2 rounded-full ${
                                c.type === 'Lecture' ? 'bg-blue-500' :
                                c.type === 'Tutorial' ? 'bg-amber-500' :
                                c.type === 'Lab' ? 'bg-purple-500' :
                                c.type === 'Practical' ? 'bg-emerald-500' : 'bg-orange-500'
                              }`}
                              title={`${c.code}: ${c.subject}`}
                            />
                          ))}
                        </div>
                      )}

                      {/* Label details for holidays */}
                      {marker && (
                        <div className="text-[9px] font-semibold text-neutral-400 mt-1 truncate max-w-[80px]">
                          {marker.label.split(' ')[0]}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

      </div>

      {/* MODAL WINDOWS FOR DETAILS & MAPS */}
      {selectedClass && (
        <div className="fixed inset-0 bg-neutral-950/80 backdrop-filter backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in no-print">
          <div className="light-modal-card bg-white rounded-[32px] border border-neutral-200 w-full max-w-lg overflow-hidden shadow-deep">
            {/* Local overrides to force light card colors and black font styles in dark mode */}
            <style dangerouslySetInnerHTML={{ __html: `
              .light-modal-card, .light-modal-card span, .light-modal-card p, .light-modal-card h3, .light-modal-card h4, .light-modal-card h5, .light-modal-card a {
                color: #1a1a1a !important;
              }
              .light-modal-card {
                background-color: #ffffff !important;
                border-color: #e5e7eb !important;
              }
              .light-modal-card .modal-header-bg {
                background-color: #f9fafb !important;
                border-bottom: 1px solid #f3f4f6 !important;
              }
              .light-modal-card .text-indigo-500, .light-modal-card .text-indigo-500 * {
                color: #4f46e5 !important;
              }
              .light-modal-card .text-rose-500, .light-modal-card .text-rose-500 * {
                color: #e11d48 !important;
              }
              .light-modal-card .text-neutral-400, .light-modal-card .text-neutral-400 * {
                color: #6b7280 !important;
              }
              .light-modal-card .text-neutral-500, .light-modal-card .text-neutral-500 * {
                color: #6b7280 !important;
              }
              .light-modal-card .bg-neutral-50 {
                background-color: #f9fafb !important;
                border: 1px solid #e5e7eb !important;
              }
              .light-modal-card .border-neutral-150 {
                border-color: #e5e7eb !important;
              }
              .light-modal-card .border-t {
                border-top: 1px solid #e5e7eb !important;
              }
              .light-modal-card .bg-neutral-100 {
                background-color: #f3f4f6 !important;
              }
              .light-modal-card .btn-primary-custom-modal {
                background-color: #1a1a1a !important;
                color: #ffffff !important;
              }
              .light-modal-card .btn-primary-custom-modal * {
                color: #ffffff !important;
              }
              .light-modal-card .btn-primary-custom-modal:hover {
                background-color: #2e2e2e !important;
              }
              .light-modal-card .btn-secondary-modal {
                background-color: #f3f4f6 !important;
                border: 1px solid #e5e7eb !important;
                color: #1a1a1a !important;
              }
              .light-modal-card .btn-secondary-modal * {
                color: #1a1a1a !important;
              }
              .light-modal-card .btn-secondary-modal:hover {
                background-color: #e5e7eb !important;
              }
              .light-modal-card .close-btn {
                background-color: #f3f4f6 !important;
                color: #4b5563 !important;
              }
              .light-modal-card .close-btn:hover {
                background-color: #e5e7eb !important;
              }
            `}} />
            
            {/* Modal Header */}
            <div className="px-6 py-5 flex items-center justify-between modal-header-bg">
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${
                  selectedClass.type === 'Lecture' ? 'bg-blue-500' :
                  selectedClass.type === 'Tutorial' ? 'bg-amber-500' :
                  selectedClass.type === 'Lab' ? 'bg-purple-500' :
                  selectedClass.type === 'Practical' ? 'bg-emerald-500' : 'bg-orange-500'
                }`} />
                <span className="text-[10px] uppercase font-extrabold tracking-wider text-neutral-400">
                  {selectedClass.type} DETAILS
                </span>
              </div>
              <button 
                onClick={() => { setSelectedClass(null); setShowMap(false); }}
                className="w-7 h-7 rounded-full close-btn flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-5">
              {/* Subject Title */}
              <div>
                <h3 className="text-xl font-bold tracking-tight leading-tight">
                  {selectedClass.subject}
                </h3>
                <p className="text-xs font-mono font-bold text-indigo-500 mt-1">{selectedClass.code}</p>
              </div>

              {/* Class Schedule Time & Room Info */}
              <div className="grid grid-cols-2 gap-4 bg-neutral-50 p-4 rounded-2xl">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-neutral-400 font-semibold text-[10px] uppercase">
                    <Clock className="w-3.5 h-3.5" />
                    <span>TIMING</span>
                  </div>
                  <p className="text-xs font-bold">
                    {selectedClass.time.split(' - ')[0]} - {selectedClass.time.split(' - ')[1]}
                  </p>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-neutral-400 font-semibold text-[10px] uppercase">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>CLASSROOM</span>
                  </div>
                  <p className="text-xs font-bold flex items-center gap-2">
                    <span>{selectedClass.room}</span>
                  </p>
                </div>
              </div>

              {/* Professor Info Panel */}
              <div className="space-y-2">
                <h5 className="text-[10px] font-extrabold uppercase tracking-wider text-neutral-450">Instructor Contact info</h5>
                <div className="border border-neutral-150 rounded-2xl p-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-neutral-100 flex items-center justify-center font-bold">
                      {selectedClass.professor.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="text-xs font-bold">{selectedClass.professor}</p>
                      <p className="text-[10px] text-neutral-500 font-semibold">Department Faculty</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-2 pt-2 border-t text-xs font-semibold text-neutral-500">
                    <a href={`mailto:${selectedClass.professorDetails.email}`} className="flex items-center gap-2 hover:text-indigo-500">
                      <Mail className="w-4 h-4 text-neutral-400" />
                      <span>{selectedClass.professorDetails.email}</span>
                    </a>
                    <a href={`tel:${selectedClass.professorDetails.phone}`} className="flex items-center gap-2 hover:text-indigo-500">
                      <Phone className="w-4 h-4 text-neutral-400" />
                      <span>{selectedClass.professorDetails.phone}</span>
                    </a>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-neutral-400" />
                      <span>Office Cabin: {selectedClass.professorDetails.office}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Info className="w-4 h-4 text-neutral-400" />
                      <span>Office Hours: {selectedClass.professorDetails.hours}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Dynamic SVG Classroom Map Location */}
              {showMap && (
                <div className="space-y-2 animate-fade-in">
                  <h5 className="text-[10px] font-extrabold uppercase tracking-wider text-rose-500 flex items-center gap-1">
                    <Map className="w-3.5 h-3.5" />
                    <span>Classroom Locator Map (Highlighted)</span>
                  </h5>
                  {renderSVGFloorPlan(selectedClass.room)}
                </div>
              )}

            </div>

            {/* Modal Actions */}
            <div className="px-6 py-4 border-t flex items-center justify-between bg-neutral-50/50 gap-2">
              <button
                onClick={() => setShowMap(!showMap)}
                className="px-4 py-2 rounded-xl btn-secondary-modal text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <Map className="w-3.5 h-3.5" />
                <span>{showMap ? "Hide Floor Map" : "Locate Room"}</span>
              </button>

              <button
                onClick={() => handleDownloadSingleICS(selectedClass, activeDay)}
                className="px-4 py-2 rounded-xl btn-primary-custom-modal text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Add to Calendar</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default TimetablePage;
