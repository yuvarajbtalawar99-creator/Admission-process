import React, { useState, useEffect } from 'react';
import { CreditCard, DollarSign, Receipt, CheckCircle2 } from 'lucide-react';
import Toast from '../../components/common/Toast';
import studentService from '../../services/student.service';

interface FeeItem {
  id: string;
  name: string;
  amount: number;
  dueDate: string;
  status: 'PAID' | 'PENDING' | 'OVERDUE';
}

export const FeePaymentPage: React.FC = () => {
  const [fees, setFees] = useState<FeeItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [selectedFee, setSelectedFee] = useState<string | null>(null);
  
  // Payment Form State
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Fetch fees on mount
  const fetchFees = async () => {
    try {
      setFetching(true);
      const data = await studentService.getStudentFees();
      
      // Map database fee models to frontend FeeItem structure
      const mapped = data.map((f: any) => {
        const remainingAmount = Number(f.totalAmount) - Number(f.paidAmount);
        const formattedDate = new Date(f.dueDate).toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric'
        });
        
        return {
          id: f.id,
          name: `Tuition & Semester Fees (Sem ${f.semester})`,
          amount: remainingAmount > 0 ? remainingAmount : Number(f.totalAmount),
          dueDate: formattedDate,
          status: f.status,
        };
      });

      setFees(mapped);
    } catch (err: any) {
      setToastMessage({
        type: 'error',
        message: err.response?.data?.error || 'Failed to load fee information.'
      });
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchFees();
  }, []);

  const totalPaid = fees.filter(f => f.status === 'PAID').reduce((sum, f) => sum + f.amount, 0);
  const totalDue = fees.filter(f => f.status !== 'PAID').reduce((sum, f) => sum + f.amount, 0);

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFee) {
      setToastMessage({ type: 'error', message: 'Please select a fee invoice to pay.' });
      return;
    }
    if (!cardNumber || !expiry || !cvv) {
      setToastMessage({ type: 'error', message: 'Please fill in all card details.' });
      return;
    }

    const feeToPay = fees.find(f => f.id === selectedFee);
    if (!feeToPay) return;

    setLoading(true);
    
    // Generate a unique idempotency key for this payment attempt
    const idempotencyKey = `pay-${selectedFee}-${Date.now()}`;
    const txnRef = `TXN-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

    try {
      await studentService.payFee(selectedFee, {
        amount: feeToPay.amount,
        paymentMethod: 'CARD',
        transactionReference: txnRef,
        headers: {
          'x-idempotency-key': idempotencyKey
        }
      });

      setToastMessage({
        type: 'success',
        message: `Payment of ₹${feeToPay.amount.toLocaleString()} successful! Reference: ${txnRef}`
      });

      // Clear input fields and refresh fee ledger
      setCardNumber('');
      setExpiry('');
      setCvv('');
      setSelectedFee(null);
      await fetchFees();
    } catch (err: any) {
      setToastMessage({
        type: 'error',
        message: err.response?.data?.error || 'Payment failed. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    if (status === 'PAID') return 'text-[#16A34A] bg-[#E8F5E9] dark:bg-emerald-950/30 dark:text-emerald-400';
    if (status === 'PENDING') return 'text-[#4F46E5] bg-[#E8E5FF] dark:bg-indigo-950/30 dark:text-indigo-400';
    return 'text-rose-600 bg-rose-50 dark:bg-rose-950/30 dark:text-rose-450';
  };

  return (
    <div className="space-y-6 pb-6 animate-fade-in">
      {toastMessage && (
        <Toast
          type={toastMessage.type}
          message={toastMessage.message}
          onClose={() => setToastMessage(null)}
        />
      )}

      {/* Header Overview Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between glass-panel rounded-[32px] p-6 shadow-ambient">
        <div>
          <h2 className="text-[22px] font-bold text-neutral-900 dark:text-white tracking-tight">Fee Ledger & Payments</h2>
          <p className="text-xs text-neutral-400 dark:text-neutral-500 font-medium">Manage tuition payments & invoice history</p>
        </div>

        <div className="flex items-center space-x-6 mt-4 md:mt-0">
          <div>
            <p className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Total Dues</p>
            <p className="text-[32px] font-extrabold text-rose-550 dark:text-rose-400 tracking-tight mt-0.5">${totalDue}</p>
          </div>
          <div className="h-10 w-px bg-neutral-200 dark:bg-neutral-800"></div>
          <div>
            <p className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Total Cleared</p>
            <p className="text-[32px] font-extrabold text-[#16A34A] tracking-tight mt-0.5">${totalPaid}</p>
          </div>
        </div>
      </div>

      {/* BENTO GRID DETAILS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT COLUMN: INVOICE TABLE (col-span-2) */}
        <div className="lg:col-span-2 glass-table-container rounded-[32px] p-6 shadow-ambient">
          <h3 className="text-lg font-bold tracking-tight mb-6 flex items-center gap-2 border-b border-neutral-100 dark:border-neutral-800/50 pb-3">
            <Receipt className="w-5 h-5" />
            <span>Academic Fees Ledger</span>
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs uppercase font-bold tracking-wider">
                <tr>
                  <th className="px-6 py-4">Fee Item</th>
                  <th className="px-6 py-4 text-center">Amount</th>
                  <th className="px-6 py-4">Due Date</th>
                  <th className="px-6 py-4 text-center">Status</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/50">
                {fees.map((item) => (
                  <tr 
                    key={item.id} 
                    className={`hover:bg-neutral-50/50 dark:hover:bg-neutral-850/30 transition-all ${
                      selectedFee === item.id ? 'bg-[#E8E5FF]/40 dark:bg-indigo-950/20' : ''
                    }`}
                  >
                    <td className="px-6 py-4 font-bold text-neutral-900 dark:text-white">{item.name}</td>
                    <td className="px-6 py-4 text-center font-bold text-neutral-900 dark:text-white">${item.amount}</td>
                    <td className="px-6 py-4 text-neutral-500 dark:text-neutral-400 font-semibold">{item.dueDate}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-3 py-1.5 rounded-xl text-xs font-bold ${getStatusBadge(item.status)}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {item.status !== 'PAID' ? (
                        <button
                          onClick={() => setSelectedFee(item.id)}
                          className="btn-primary-custom text-xs font-bold px-4 py-2 rounded-xl transition-all duration-300 hover:scale-[1.03] cursor-pointer"
                        >
                          Select
                        </button>
                      ) : (
                        <span className="text-[11px] text-[#16A34A] font-bold uppercase tracking-wider flex items-center justify-end gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Cleared
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* RIGHT COLUMN: SECURE PAYMENT GATEWAY CARD */}
        <div className="glass-panel rounded-[32px] p-6 shadow-ambient flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-neutral-900 dark:text-white tracking-tight mb-4 flex items-center gap-2 border-b border-neutral-100 dark:border-neutral-800/50 pb-3">
              <CreditCard className="w-5 h-5 text-neutral-500" />
              <span>Secure Payment Gateway</span>
            </h3>

            {selectedFee ? (
              <form onSubmit={handlePayment} className="space-y-4">
                <div className="p-4 rounded-2xl bg-[#E8E5FF] text-[#4F46E5] dark:bg-indigo-950/20 dark:text-indigo-400 border border-[#D9D6FF]/55 mb-4">
                  <p className="text-[11px] font-bold uppercase tracking-wider">Active Invoice Selection</p>
                  <p className="text-sm font-bold mt-1 text-neutral-850 dark:text-white">
                    {fees.find(f => f.id === selectedFee)?.name}
                  </p>
                  <p className="text-2xl font-black mt-2 text-neutral-900 dark:text-white">
                    ${fees.find(f => f.id === selectedFee)?.amount}
                  </p>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider block">
                    Cardholder Name
                  </label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    required
                    className="w-full bg-neutral-50 dark:bg-neutral-200/50 border border-neutral-200 dark:border-neutral-750 focus:border-neutral-400 dark:focus:border-neutral-650 rounded-2xl py-3 px-4 text-sm outline-none transition-colors placeholder:text-neutral-300 dark:placeholder:text-neutral-600"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider block">
                    Card Number
                  </label>
                  <input
                    type="text"
                    maxLength={16}
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, ''))}
                    placeholder="4111 2222 3333 4444"
                    required
                    className="w-full bg-neutral-50 dark:bg-neutral-200/50 border border-neutral-200 dark:border-neutral-750 focus:border-neutral-400 dark:focus:border-neutral-650 rounded-2xl py-3 px-4 text-sm outline-none transition-colors placeholder:text-neutral-300 dark:placeholder:text-neutral-600"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider block">
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      placeholder="MM/YY"
                      value={expiry}
                      onChange={(e) => setExpiry(e.target.value)}
                      required
                      className="w-full bg-neutral-50 dark:bg-neutral-200/50 border border-neutral-200 dark:border-neutral-750 focus:border-neutral-400 dark:focus:border-neutral-650 rounded-2xl py-3 px-4 text-sm outline-none transition-colors placeholder:text-neutral-300 dark:placeholder:text-neutral-600"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider block">
                      CVV Code
                    </label>
                    <input
                      type="password"
                      maxLength={3}
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value.replace(/\D/g, ''))}
                      placeholder="•••"
                      required
                      className="w-full bg-neutral-50 dark:bg-neutral-200/50 border border-neutral-200 dark:border-neutral-750 focus:border-neutral-400 dark:focus:border-neutral-650 rounded-2xl py-3 px-4 text-sm outline-none transition-colors"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full btn-primary-custom font-bold py-3.5 rounded-2xl text-sm transition-all duration-300 hover:scale-[1.02] cursor-pointer disabled:opacity-50"
                  >
                    {loading ? 'Processing Secure Payment...' : 'Pay Invoice Amount'}
                  </button>
                </div>
              </form>
            ) : (
              <div className="text-center py-12 flex flex-col items-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-neutral-50 dark:bg-neutral-800 flex items-center justify-center border border-neutral-200/55 dark:border-neutral-700/55">
                  <DollarSign className="w-6 h-6 text-neutral-400" />
                </div>
                <p className="text-xs font-bold text-neutral-400 uppercase tracking-wider max-w-[180px] leading-relaxed mx-auto">
                  Select a pending fee invoice from the ledger to activate payment
                </p>
              </div>
            )}
          </div>

          <div className="border-t border-neutral-100 dark:border-neutral-800/50 mt-6 pt-4 text-center">
            <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider flex items-center justify-center gap-1">
              🔒 256-bit Encrypted SSL Gateway
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default FeePaymentPage;
