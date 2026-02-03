
import { Tenant, Payment, PaymentStatus } from '../types';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';

// Helper to format currency
const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('es-AR', { style: 'currency', currency: currency }).format(amount);
};

export const exportToCSV = (data: any[], filename: string) => {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    XLSX.writeFile(wb, `${filename}.csv`);
};

export const exportToExcel = (data: any[], filename: string) => {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    XLSX.writeFile(wb, `${filename}.xlsx`);
};

export const generateReceiptPDF = (payment: Payment, tenant: Tenant, ownerName: string) => {
    const doc = new jsPDF();

    doc.setFontSize(20);
    doc.text('Recibo de Pago', 105, 20, { align: 'center' });

    doc.setFontSize(12);
    doc.text(`Fecha: ${new Date(payment.date).toLocaleDateString()}`, 20, 40);
    doc.text(`Recibo N°: ${payment.id.slice(0, 8)}`, 20, 50);

    doc.text('De:', 20, 70);
    doc.setFont('helvetica', 'bold');
    doc.text(tenant.fullName, 30, 70);
    doc.setFont('helvetica', 'normal');

    doc.text('Para:', 20, 80);
    doc.setFont('helvetica', 'bold');
    doc.text(ownerName, 30, 80);
    doc.setFont('helvetica', 'normal');

    doc.text(`Concepto: ${payment.concept} (${payment.monthYear})`, 20, 100);

    doc.setFontSize(16);
    doc.text(`Total: ${formatCurrency(payment.amount, 'ARS')}`, 150, 120, { align: 'right' });

    doc.setFontSize(10);
    doc.text('Gracias por su pago.', 105, 140, { align: 'center' });

    doc.save(`Recibo_${tenant.fullName}_${payment.monthYear}.pdf`);
};
