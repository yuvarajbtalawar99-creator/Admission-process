import React, { useEffect, useState } from 'react';
import StudentService from '../../services/student.service';
import Loading from '../../components/common/Loading';
import Toast from '../../components/common/Toast';
import { User, Phone, ShieldAlert, FileText } from 'lucide-react';

interface ProfileData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  address: string;
  fatherName: string;
  motherName: string;
  parentPhone: string;
  parentEmail: string;
  enrollmentNumber: string;
  department: string;
  departmentCode: string;
  semester: number;
  batch: number;
  bloodGroup: string;
  emergencyContact: {
    name: string;
    phone: string;
    relation: string;
  };
}

export const StudentProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editMode, setEditMode] = useState(false);

  // Editable fields
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await (StudentService as any).getStudentProfile();
      setProfile(response);
      setPhone(response.phone || '');
      setAddress(response.address || '');
    } catch (err: any) {
      setToastMessage({
        type: 'error',
        message: err.response?.data?.error || 'Failed to load profile details.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      await StudentService.updateProfile({ phone, address });
      setToastMessage({
        type: 'success',
        message: 'Profile updated successfully!',
      });
      setEditMode(false);
      await fetchProfile();
    } catch (err: any) {
      setToastMessage({
        type: 'error',
        message: err.response?.data?.error || 'Failed to save changes.',
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (!profile) {
    return (
      <div className="text-center py-12">
        <p className="text-rose-500 font-semibold">Error loading profile details.</p>
        <button
          onClick={fetchProfile}
          className="mt-4 bg-[#1A1A1A] hover:bg-neutral-800 text-white px-6 py-2.5 rounded-xl text-sm transition-all"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-6 animate-fade-in">
      {toastMessage && (
        <Toast
          type={toastMessage.type}
          message={toastMessage.message}
          onClose={() => setToastMessage(null)}
        />
      )}

      {/* Header Profile Info Card */}
      <div className="glass-panel rounded-[32px] p-6 shadow-ambient flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-6">
        <div className="relative group">
          <img
            src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&fit=crop"
            alt="Profile Avatar"
            className="w-24 h-24 rounded-[24px] border border-neutral-200/50 dark:border-neutral-850/30 object-cover shadow-md"
          />
        </div>
        
        <div className="flex-1 text-center md:text-left space-y-2.5">
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
            {profile.firstName} {profile.lastName}
          </h1>
          <p className="text-neutral-500 dark:text-neutral-400 text-sm font-semibold tracking-wide">
            {profile.department}
          </p>
          <div className="flex flex-wrap justify-center md:justify-start gap-2.5 pt-1">
            <span className="badge-active-custom text-xs font-bold px-3.5 py-1.5 rounded-xl">
              ID: {profile.enrollmentNumber}
            </span>
            <span className="bg-[#E8E5FF] text-[#4F46E5] text-xs font-bold px-3.5 py-1.5 rounded-xl">
              Sem {profile.semester}
            </span>
            <span className="bg-[#E1F5FE] text-[#0284C7] text-xs font-bold px-3.5 py-1.5 rounded-xl">
              Batch: {profile.batch}
            </span>
          </div>
        </div>

        <div>
  <button
    onClick={() => setEditMode(!editMode)}
    className={`w-full md:w-auto px-6 py-3 rounded-2xl border font-bold text-sm transition-all duration-300 hover:scale-[1.02] cursor-pointer ${
      editMode
        ? 'bg-neutral-800 border-neutral-700 text-white' 
        : 'btn-primary-custom border-transparent shadow-sm'
    }`}
  >
    {editMode ? 'Cancel Edit' : 'Edit Contact Info'}
  </button>
</div>
      </div>

      {/* Main Grid Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT & CENTER DETAILS COLUMN (col-span-2) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Contact Details Card */}
          <div className="glass-panel rounded-[32px] p-6 shadow-ambient">
            <h3 className="text-[19px] font-bold text-neutral-900 dark:text-white mb-6 flex items-center gap-2 border-b border-neutral-100 dark:border-neutral-800/50 pb-3">
              <Phone className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
              <span>Contact Information</span>
            </h3>

            {editMode ? (
              <form onSubmit={handleSave} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider block">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-750 focus:border-neutral-400 dark:focus:border-neutral-650 rounded-2xl py-3.5 px-4 text-sm outline-none transition-colors"
                  />
                </div>
                
                <div className="space-y-1">
                  <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider block">
                    Residential Address
                  </label>
                  <textarea
                    rows={3}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-750 focus:border-neutral-400 dark:focus:border-neutral-650 rounded-2xl py-3.5 px-4 text-sm outline-none transition-colors"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={saving}
                    className="btn-primary-custom font-bold px-6 py-3 rounded-2xl text-sm transition-all duration-300 hover:scale-[1.02] cursor-pointer"
                  >
                    {saving ? 'Saving changes...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Email Address</p>
                  <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-200 mt-1">{profile.email}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Phone Number</p>
                  <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-200 mt-1">{profile.phone || 'Not provided'}</p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Residential Address</p>
                  <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-200 mt-1 leading-relaxed">{profile.address || 'Not provided'}</p>
                </div>
              </div>
            )}
          </div>

          {/* Parents Details Card */}
          <div className="glass-panel rounded-[32px] p-6 shadow-ambient">
            <h3 className="text-[19px] font-bold text-neutral-900 dark:text-white mb-6 flex items-center gap-2 border-b border-neutral-100 dark:border-neutral-800/50 pb-3">
              <User className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
              <span>Family & Parent Details</span>
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Father's Name</p>
                <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-200 mt-1">{profile.fatherName || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Mother's Name</p>
                <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-200 mt-1">{profile.motherName || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Parent Phone</p>
                <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-200 mt-1">{profile.parentPhone || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Parent Email</p>
                <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-200 mt-1">{profile.parentEmail || 'N/A'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: GENERAL INFO & EMERGENCY CONTACT */}
        <div className="space-y-6">
          
          {/* General Info Card */}
          <div className="glass-panel rounded-[32px] p-6 shadow-ambient">
            <h3 className="text-[19px] font-bold text-neutral-900 dark:text-white mb-6 flex items-center gap-2 border-b border-neutral-100 dark:border-neutral-800/50 pb-3">
              <FileText className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
              <span>General Information</span>
            </h3>
            
            <div className="space-y-5">
              <div>
                <p className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Date of Birth</p>
                <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-200 mt-1">
                  {profile.dateOfBirth ? new Date(profile.dateOfBirth).toLocaleDateString(undefined, {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                  }) : 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Gender</p>
                <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-200 mt-1">{profile.gender}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Blood Group</p>
                <p className="text-sm font-semibold text-neutral-850 dark:text-neutral-200 mt-1">
                  <span className="bg-[#E8F5E9] text-[#16A34A] text-xs font-bold px-3 py-1 rounded-lg">
                    {profile.bloodGroup || 'O+'}
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* Emergency Contact Card */}
          <div className="glass-panel rounded-[32px] p-6 shadow-ambient">
            <h3 className="text-[19px] font-bold text-neutral-900 dark:text-white mb-6 flex items-center gap-2 border-b border-neutral-100 dark:border-neutral-800/50 pb-3">
              <ShieldAlert className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
              <span>Emergency Contact</span>
            </h3>
            
            <div className="space-y-4">
              <div>
                <p className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Contact Name</p>
                <p className="text-sm font-semibold text-neutral-850 dark:text-neutral-200 mt-1">{profile.emergencyContact?.name || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Relation</p>
                <p className="text-sm font-semibold text-neutral-850 dark:text-neutral-200 mt-1">{profile.emergencyContact?.relation || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Emergency Phone</p>
                <p className="text-sm font-semibold text-neutral-850 dark:text-neutral-200 mt-1">{profile.emergencyContact?.phone || 'N/A'}</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default StudentProfilePage;
