import React from 'react';
import { CreditCard, CheckCircle2, Download, Search } from 'lucide-react';

interface Transaction {
  id: string;
  invoiceNumber: string;
  category: string;
  amount: number;
  date: string;
  method: string;
  status: 'SUCCESS' | 'PENDING' | 'FAILED';
}

const transactions: Transaction[] = [
  { id: 'TXN-9021034', invoiceNumber: 'INV-2026-004', category: 'Tuition Fee (Sem 3)', amount: 4500, date: '12 Jul 2026', method: 'Visa ending 4242', status: 'SUCCESS' },
  { id: 'TXN-9018402', invoiceNumber: 'INV-2026-002', category: 'Hostel Rent (Sem 3)', amount: 1500, date: '14 Jul 2026', method: 'MasterCard ending 8812', status: 'SUCCESS' },
  { id: 'TXN-8802914', invoiceNumber: 'INV-2025-012', category: 'Tuition Fee (Sem 2)', amount: 4000, date: '10 Jan 2026', method: 'Net Banking HDFC', status: 'SUCCESS' },
  { id: 'TXN-8801452', invoiceNumber: 'INV-2025-009', category: 'Hostel Rent (Sem 2)', amount: 1500, date: '12 Jan 2026', method: 'UPI / PhonePe', status: 'SUCCESS' },
  { id: 'TXN-8201948', invoiceNumber: 'INV-2025-001', category: 'Library Security Deposit', amount: 500, date: '18 Aug 2025', method: 'UPI / GooglePay', status: 'SUCCESS' },
];

export const PaymentsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Top Welcome Card */}
      <div className="glass-panel rounded-[32px] p-6 shadow-ambient">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
              <CreditCard className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-neutral-900 dark:text-white tracking-tight">Payment Receipts Ledger</h2>
              <p className="text-xs text-neutral-400 dark:text-neutral-500 font-medium">Verify and download past transaction records</p>
            </div>
          </div>

          {/* Search bar inside header */}
          <div className="flex items-center space-x-2">
            <div className="relative">
              <input
                type="text"
                placeholder="Search Txn ID/Invoice"
                className="bg-neutral-50 dark:bg-neutral-200/50 border border-neutral-200/50 dark:border-neutral-750 focus:border-neutral-400 dark:focus:border-neutral-650 rounded-xl py-2 px-3 pl-8 text-xs outline-none transition-colors placeholder:text-neutral-300 dark:placeholder:text-neutral-600"
              />
              <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-2.5 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* Transaction History Table Card */}
      <div className="w-full overflow-hidden rounded-[28px] glass-table-container shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs uppercase font-bold tracking-wider">
              <tr>
                <th className="px-6 py-4">Transaction ID</th>
                <th className="px-6 py-4">Invoice</th>
                <th className="px-6 py-4">Fee Category</th>
                <th className="px-6 py-4 text-center">Amount</th>
                <th className="px-6 py-4">Payment Method</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/50">
              {transactions.map((txn) => (
                <tr key={txn.id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/30 transition-all duration-150">
                  <td className="px-6 py-4">
                    <p className="font-bold text-neutral-900 dark:text-white tracking-tight">{txn.id}</p>
                    <p className="text-neutral-400 text-xs mt-0.5 font-medium">{txn.date}</p>
                  </td>
                  <td className="px-6 py-4 font-mono text-xs font-semibold text-neutral-500">{txn.invoiceNumber}</td>
                  <td className="px-6 py-4 font-semibold">{txn.category}</td>
                  <td className="px-6 py-4 text-center font-bold text-neutral-900 dark:text-white">${txn.amount.toLocaleString()}</td>
                  <td className="px-6 py-4 text-xs font-medium text-neutral-500 dark:text-neutral-400">{txn.method}</td>
                  <td className="px-6 py-4">
                    <span className="text-[11px] text-emerald-500 font-bold uppercase tracking-wider flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Success
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-neutral-600 dark:text-white hover:text-indigo-500 dark:hover:text-indigo-400 font-bold text-xs transition-colors duration-150 cursor-pointer flex items-center justify-end gap-1 ml-auto">
                      <Download className="w-3.5 h-3.5" />
                      <span>Receipt</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PaymentsPage;
