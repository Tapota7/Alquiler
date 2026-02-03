import { Tenant, Payment, PaymentStatus, OwnerProfile, FilterCriteria } from '../types';
import ExportControls from './ExportControls';
import AdvancedFilterPanel from './AdvancedFilterPanel';
import { generateReceiptPDF } from '../utils/exportUtils';
import React, { useState, useMemo } from 'react';
import { CreditCard, Printer, FileText, Send, CheckCircle2, Clock, AlertCircle, ChevronLeft, ChevronRight, X } from 'lucide-react';

interface PaymentTrackerProps {
  tenants: Tenant[];
  payments: Payment[];
  onUpdate: (payments: Payment[]) => void;
  owner: OwnerProfile;
}

const PaymentTracker: React.FC<PaymentTrackerProps> = ({ tenants, payments, onUpdate, owner }) => {
  const [currentViewDate, setCurrentViewDate] = useState(new Date());
  const monthYearStr = currentViewDate.toISOString().slice(0, 7);
  const [filterCriteria, setFilterCriteria] = useState<FilterCriteria>({});

  const [selectedPaymentForReceipt, setSelectedPaymentForReceipt] = useState<Payment | null>(null);

  const nextMonth = () => setCurrentViewDate(new Date(currentViewDate.setMonth(currentViewDate.getMonth() + 1)));
  const prevMonth = () => setCurrentViewDate(new Date(currentViewDate.setMonth(currentViewDate.getMonth() - 1)));

  // Matrix of tenants and their payment status for the current month
  const tableData = useMemo(() => {
    let data = tenants.map(tenant => {
      const payment = payments.find(p => p.tenantId === tenant.id && p.monthYear === monthYearStr);

      const today = new Date();
      const currentMonthInt = currentViewDate.getMonth();
      const currentYearInt = currentViewDate.getFullYear();

      const dueDate = new Date(currentYearInt, currentMonthInt, tenant.paymentDay);
      const isOverdue = !payment && today > dueDate;

      return {
        tenant,
        payment,
        isOverdue
      };
    });

    // Apply Filters
    if (Object.keys(filterCriteria).length > 0) {
      data = data.filter(({ tenant, payment, isOverdue }) => {
        // Status Filter
        if (filterCriteria.status && filterCriteria.status.length > 0) {
          const status = payment ? PaymentStatus.PAID : (isOverdue ? PaymentStatus.OVERDUE : PaymentStatus.PENDING);
          if (!filterCriteria.status.includes(status)) return false;
        }

        // Amount Filter
        if (filterCriteria.amountRange) {
          const amount = payment ? payment.amount : tenant.monthlyRent;
          if (amount < filterCriteria.amountRange.min || amount > filterCriteria.amountRange.max) return false;
        }

        return true;
      });
    }

    return data;
  }, [tenants, payments, monthYearStr, currentViewDate, filterCriteria]);

  const togglePayment = (tenant: Tenant, currentPayment?: Payment) => {
    if (currentPayment) {
      if (window.confirm('¿Deseas anular el registro de este pago?')) {
        onUpdate(payments.filter(p => p.id !== currentPayment.id));
      }
    } else {
      const newPayment: Payment = {
        id: crypto.randomUUID(),
        tenantId: tenant.id,
        amount: tenant.monthlyRent,
        date: new Date().toISOString(),
        monthYear: monthYearStr,
        status: PaymentStatus.PAID,
        concept: `Renta de ${new Intl.DateTimeFormat('es-ES', { month: 'long', year: 'numeric' }).format(currentViewDate)}`
      };
      onUpdate([...payments, newPayment]);
    }
  };

  const sendNotification = (tenant: Tenant, isOverdue: boolean) => {
    const month = new Intl.DateTimeFormat('es-ES', { month: 'long' }).format(currentViewDate);
    const message = isOverdue
      ? `Hola ${tenant.fullName}, recordatorio de pago de renta de ${month} pendiente. Favor de realizar el pago de ${owner.currency}${tenant.monthlyRent}. ¡Gracias!`
      : `Hola ${tenant.fullName}, registro de pago de renta de ${month} recibido con éxito por un monto de ${owner.currency}${tenant.monthlyRent}. ¡Gracias!`;

    const url = `https://wa.me/${tenant.phone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShareReceipt = async (payment: Payment) => {
    const tenant = tenants.find(t => t.id === payment.tenantId);
    if (!tenant) return;

    const pdfFile = generateReceiptPDF(payment, tenant, owner.name, 'file') as File;
    const shareData = {
      files: [pdfFile],
      title: 'Recibo de Alquiler',
      text: `Hola ${tenant.fullName}, aquí tienes tu recibo de alquiler de ${payment.monthYear}.`,
    };

    if (navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        if (error instanceof Error && error.name !== 'AbortError') {
          console.error('Error sharing:', error);
          alert('Hubo un error al intentar compartir el recibo.');
        }
      }
    } else {
      // Fallback for browsers that don't support file sharing
      const message = `Hola ${tenant.fullName}, hemos registrado tu pago de ${owner.currency}${payment.amount.toLocaleString()}. Puedes ver tu recibo aquí: [Link temporal de prueba]`;
      const url = `https://wa.me/${tenant.phone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
      window.open(url, '_blank');
      alert('Tu navegador no soporta compartir archivos directamente. Se ha enviado un mensaje de texto por WhatsApp como alternativa.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Seguimiento de Pagos</h2>
          <p className="text-slate-500 dark:text-slate-400">Controla quién ha pagado la renta este mes.</p>
        </div>

        <div className="flex items-center bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-1 shadow-sm">
          <button onClick={prevMonth} className="p-2 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-xl transition-colors text-slate-600 dark:text-slate-300">
            <ChevronLeft size={20} />
          </button>
          <span className="px-6 font-bold text-slate-700 dark:text-white capitalize">
            {new Intl.DateTimeFormat('es-ES', { month: 'long', year: 'numeric' }).format(currentViewDate)}
          </span>
          <button onClick={nextMonth} className="p-2 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-xl transition-colors text-slate-600 dark:text-slate-300">
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <AdvancedFilterPanel
        onFilterChange={setFilterCriteria}
        onClear={() => setFilterCriteria({})}
      />

      <div className="flex justify-end bg-white/50 dark:bg-slate-800/50 p-2 rounded-xl">
        <ExportControls
          data={tableData.map(d => ({
            Inquilino: d.tenant.fullName,
            Monto: d.tenant.monthlyRent,
            Estado: d.payment ? 'PAGADO' : d.isOverdue ? 'ATRASADO' : 'PENDIENTE',
            FechaPago: d.payment ? new Date(d.payment.date).toLocaleDateString() : '-'
          }))}
          filename={`pagos-${monthYearStr}`}
        />
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-700/50 border-b border-slate-100 dark:border-slate-700">
                <th className="px-6 py-4 text-xs font-semibold text-slate-400 dark:text-slate-300 uppercase tracking-wider">Inquilino / Propiedad</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-400 dark:text-slate-300 uppercase tracking-wider">Monto</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-400 dark:text-slate-300 uppercase tracking-wider">Estado</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-400 dark:text-slate-300 uppercase tracking-wider">Fecha Pago</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-400 dark:text-slate-300 uppercase tracking-wider text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-700">
              {tableData.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center text-slate-400 dark:text-slate-500">
                    No hay inquilinos registrados (o no coinciden con los filtros).
                  </td>
                </tr>
              ) : (
                tableData.map(({ tenant, payment, isOverdue }) => (
                  <tr key={tenant.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-700/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 font-bold shrink-0">
                          {tenant.fullName.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-slate-800 dark:text-white leading-none">{tenant.fullName}</p>
                          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{tenant.address}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-semibold text-slate-700 dark:text-slate-300">{owner.currency}{tenant.monthlyRent.toLocaleString()}</span>
                    </td>
                    <td className="px-6 py-4">
                      {payment ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 text-xs font-bold rounded-full">
                          <CheckCircle2 size={12} /> PAGADO
                        </span>
                      ) : isOverdue ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-50 text-red-600 text-xs font-bold rounded-full">
                          <AlertCircle size={12} /> ATRASADO
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-600 text-xs font-bold rounded-full">
                          <Clock size={12} /> PENDIENTE
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-slate-500 dark:text-slate-400">
                        {payment ? new Date(payment.date).toLocaleDateString('es-ES') : '-'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => togglePayment(tenant, payment)}
                          className={`p-2 rounded-xl transition-all ${payment ? 'text-red-400 hover:bg-red-50' : 'text-emerald-500 hover:bg-emerald-50'}`}
                          title={payment ? "Anular pago" : "Registrar pago"}
                        >
                          {payment ? <X size={18} /> : <CreditCard size={18} />}
                        </button>

                        {payment && (
                          <button
                            onClick={() => setSelectedPaymentForReceipt(payment)}
                            className="p-2 text-indigo-500 hover:bg-indigo-50 rounded-xl"
                            title="Ver Recibo"
                          >
                            <Printer size={18} />
                          </button>
                        )}

                        <button
                          onClick={() => sendNotification(tenant, isOverdue)}
                          className="p-2 text-emerald-500 hover:bg-emerald-50 rounded-xl"
                          title="Enviar Recordatorio WhatsApp"
                        >
                          <Send size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Receipt Preview Modal */}
      {selectedPaymentForReceipt && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setSelectedPaymentForReceipt(null)} />
          <div className="relative w-full max-w-2xl bg-white rounded-[2rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 bg-slate-50 border-b border-slate-100 flex items-center justify-between no-print">
              <h3 className="text-lg font-bold text-slate-800">Recibo de Alquiler</h3>
              <div className="flex gap-3">
                <button
                  onClick={handlePrint}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-indigo-700"
                >
                  <Printer size={16} /> Imprimir
                </button>
                <button
                  onClick={() => handleShareReceipt(selectedPaymentForReceipt)}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-emerald-700"
                >
                  <Send size={16} /> Compartir WhatsApp
                </button>
                <button
                  onClick={() => setSelectedPaymentForReceipt(null)}
                  className="p-2 text-slate-400 hover:bg-slate-100 rounded-xl"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="p-8 md:p-12 overflow-y-auto receipt-content bg-white" id="receipt-printable">
              {/* Receipt Header */}
              <div className="flex flex-col md:flex-row justify-between gap-8 mb-12">
                <div>
                  <h1 className="text-4xl font-black text-slate-800 mb-4">RECIBO</h1>
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Nº Recibo</p>
                    <p className="text-lg font-mono font-bold text-slate-700">{selectedPaymentForReceipt.id.slice(0, 8).toUpperCase()}</p>
                  </div>
                </div>
                <div className="text-right">
                  <h2 className="text-xl font-bold text-indigo-600 mb-2">{owner.name}</h2>
                  <p className="text-sm text-slate-500">{owner.address}</p>
                  <p className="text-sm text-slate-500">{owner.phone} | {owner.email}</p>
                </div>
              </div>

              {/* Receipt Body */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
                <div className="space-y-6">
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1">Para</label>
                    <p className="text-lg font-bold text-slate-800">{tenants.find(t => t.id === selectedPaymentForReceipt.tenantId)?.fullName}</p>
                    <p className="text-sm text-slate-500">{tenants.find(t => t.id === selectedPaymentForReceipt.tenantId)?.address}</p>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1">Concepto</label>
                    <p className="text-slate-700">{selectedPaymentForReceipt.concept}</p>
                  </div>
                </div>
                <div className="space-y-6 md:text-right">
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1">Fecha de Pago</label>
                    <p className="text-lg font-bold text-slate-800">{new Date(selectedPaymentForReceipt.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                  </div>
                  <div className="bg-slate-50 p-6 rounded-3xl md:inline-block">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1">Total Pagado</label>
                    <p className="text-3xl font-black text-indigo-600">{owner.currency}{selectedPaymentForReceipt.amount.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              {/* Signature Area */}
              <div className="pt-20 flex justify-between items-end border-t border-slate-100">
                <div className="text-xs text-slate-400 italic">
                  * Este documento es un comprobante de pago oficial emitido por RentMaster.
                </div>
                <div className="w-48 border-t-2 border-slate-200 pt-2 text-center">
                  <p className="text-sm font-bold text-slate-700">Firma Autorizada</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white; }
          .receipt-content { padding: 0 !important; }
          #root > div { display: block; }
          aside, header, main > div:not(.receipt-content) { display: none !important; }
        }
      `}</style>
    </div>
  );
};

export default PaymentTracker;
