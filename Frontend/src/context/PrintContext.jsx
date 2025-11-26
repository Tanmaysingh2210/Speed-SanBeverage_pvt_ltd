import React, { createContext, useContext, useState } from 'react';

const PrintContext = createContext();

export const usePrint = () => {
  const context = useContext(PrintContext);
  if (!context) {
    throw new Error('usePrint must be used within PrintProvider');
  }
  return context;
};

export const PrintProvider = ({ children }) => {
  const [isPrinting, setIsPrinting] = useState(false);

  const print = async (data, config = {}) => {
    const {
      title = 'Document',
      pageType = 'default',
      orientation = 'portrait',
      showHeader = true,
      showFooter = true,
      customStyles = ''
    } = config;

    setIsPrinting(true);

    try {
      const content = renderContentByType(data, pageType);

      const printWindow = window.open('', '_blank');
      printWindow.document.write(`
        <html>
          <head>
            <title>${title}</title>
            <style>
              @media print {
                body { margin: 0; }
                @page { size: ${orientation}; margin: 1cm; }
              }
              * { box-sizing: border-box; }
              body { 
                font-family: Arial, sans-serif; 
                padding: 20px;
                color: #333;
              }
              .print-header {
                text-align: center;
                border-bottom: 3px solid #2563eb;
                padding-bottom: 15px;
                margin-bottom: 25px;
              }
              .print-header h1 {
                margin: 0;
                font-size: 28px;
                color: #1e40af;
              }
              .print-header .meta {
                color: #666;
                font-size: 13px;
                margin-top: 8px;
              }
              .print-footer {
                text-align: center;
                border-top: 2px solid #e5e7eb;
                padding-top: 12px;
                margin-top: 30px;
                color: #666;
                font-size: 11px;
              }
              .summary-grid {
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                gap: 15px;
                margin: 20px 0;
              }
              .summary-card {
                border: 2px solid #e5e7eb;
                border-radius: 8px;
                padding: 15px;
                text-align: center;
                background: #f9fafb;
              }
              .summary-card .label {
                font-size: 13px;
                color: #6b7280;
                margin-bottom: 8px;
                font-weight: 500;
              }
              .summary-card .value {
                font-size: 32px;
                font-weight: bold;
                color: #2563eb;
              }
              table { 
                width: 100%; 
                border-collapse: collapse; 
                margin: 20px 0;
                font-size: 14px;
              }
              th, td { 
                padding: 12px; 
                border: 1px solid #d1d5db; 
                text-align: left;
              }
              th { 
                background-color: #2563eb; 
                color: white;
                font-weight: 600;
                text-transform: uppercase;
                font-size: 12px;
                letter-spacing: 0.5px;
              }
              tr:nth-child(even) {
                background-color: #f9fafb;
              }
              .badge {
                display: inline-block;
                padding: 5px 12px;
                border-radius: 5px;
                font-size: 12px;
                font-weight: 600;
              }
              .badge-active { 
                background: #d1fae5; 
                color: #065f46; 
                border: 1px solid #10b981;
              }
              .badge-inactive { 
                background: #fee2e2; 
                color: #991b1b; 
                border: 1px solid #ef4444;
              }
              h2 {
                color: #1e40af;
                margin-top: 25px;
                margin-bottom: 15px;
                font-size: 20px;
                border-bottom: 2px solid #dbeafe;
                padding-bottom: 8px;
              }
              ${customStyles}
            </style>
          </head>
          <body>
            ${showHeader ? `
              <div class="print-header">
                <h1>${title}</h1>
                <div class="meta">
                  Generated on ${new Date().toLocaleString('en-IN', {
        timeZone: 'Asia/Kolkata',
        dateStyle: 'full',
        timeStyle: 'short'
      })}
                </div>
              </div>
            ` : ''}
            
            ${content}
            
            ${showFooter ? `
              <div class="print-footer">
                <p>© ${new Date().getFullYear()} SAN Beverages Pvt. Ltd. - Confidential Document</p>
                <p style="font-size: 10px; color: #9ca3af; margin-top: 5px;">
                  This is a system-generated document. No signature required.
                </p>
              </div>
            ` : ''}
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.focus();

      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 250);

    } catch (error) {
      console.error('Print error:', error);
      alert('Failed to print. Please try again.');
    } finally {
      setIsPrinting(false);
    }
  };

  const renderContentByType = (data, pageType) => {
    switch (pageType) {
      case 'salesman':
        return renderSalesmanReport(data);
      case 'users':
        return renderUsersTable(data);
      case 'sales':
        return renderSalesReport(data);
      case 'invoice':
        return renderInvoice(data);
      default:
        return renderDefault(data);
    }
  };

  // Salesman-specific renderer
  const renderSalesmanReport = (data) => {
    const { salesmans, summary } = data;
    return `
      <h2>Salesman List</h2>
      ${summary ? `
        <div class="summary-grid">
          <div class="summary-card">
            <div class="label">Total Salesman</div>
            <div class="value">${summary.total}</div>
          </div>
          <div class="summary-card">
            <div class="label">Active</div>
            <div class="value" style="color: #10b981;">${summary.active}</div>
          </div>
          <div class="summary-card">
            <div class="label">Inactive</div>
            <div class="value" style="color: #ef4444;">${summary.inactive}</div>
          </div>
        </div>
      ` : ''}
      <table>
        <thead>
          <tr>
            <th style="width: 60px;">SL. NO.</th>
            <th>CODE</th>
            <th>NAME</th>
            <th style="width: 100px;">ROUTE NO.</th>
            <th style="width: 100px;">STATUS</th>
          </tr>
        </thead>
        <tbody>
          ${salesmans.map((salesman, index) => `
            <tr>
              <td style="text-align: center;">${index + 1}</td>
              <td><strong>${salesman.codeNo}</strong></td>
              <td>${salesman.name}</td>
              <td style="text-align: center;">${salesman.routeNo}</td>
              <td style="text-align: center;">
                <span class="badge badge-${salesman.status.toLowerCase()}">
                  ${salesman.status}
                </span>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
      <div style="margin-top: 20px; padding: 15px; background: #f3f4f6; border-radius: 8px; border-left: 4px solid #2563eb;">
        <strong>Note:</strong> This report contains ${salesmans.length} salesman record(s).
      </div>
    `;
  };

  // Users table renderer (from previous example)
  const renderUsersTable = (data) => {
    const { users, summary } = data;
    return `
      <h2>Users List</h2>
      ${summary ? `
        <div class="summary-grid">
          <div class="summary-card">
            <div class="label">Total Users</div>
            <div class="value">${summary.total || users.length}</div>
          </div>
          <div class="summary-card">
            <div class="label">Active Users</div>
            <div class="value">${summary.active || 0}</div>
          </div>
          <div class="summary-card">
            <div class="label">Admins</div>
            <div class="value">${summary.admins || 0}</div>
          </div>
        </div>
      ` : ''}
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          ${users.map(user => `
            <tr>
              <td>${user.id}</td>
              <td>${user.name}</td>
              <td>${user.email}</td>
              <td><span class="badge badge-active">${user.role}</span></td>
              <td><span class="badge badge-${user.status}">${user.status}</span></td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
  };

  const renderSalesReport = (data) => {
    const { sales, totals } = data;
    return `
      <h2>Sales Report</h2>
      ${totals ? `
        <div class="summary-grid">
          <div class="summary-card">
            <div class="label">Total Revenue</div>
            <div class="value">$${totals.revenue.toLocaleString()}</div>
          </div>
          <div class="summary-card">
            <div class="label">Total Orders</div>
            <div class="value">${totals.orders}</div>
          </div>
          <div class="summary-card">
            <div class="label">Avg Order Value</div>
            <div class="value">$${Math.round(totals.revenue / totals.orders)}</div>
          </div>
        </div>
      ` : ''}
      <table>
        <thead>
          <tr>
            <th>Period</th>
            <th>Revenue</th>
            <th>Orders</th>
            <th>Growth</th>
          </tr>
        </thead>
        <tbody>
          ${sales.map(item => `
            <tr>
              <td>${item.period}</td>
              <td>$${item.revenue.toLocaleString()}</td>
              <td>${item.orders}</td>
              <td><span class="badge ${item.growth >= 0 ? 'badge-active' : 'badge-inactive'}">${item.growth}%</span></td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
  };

  const renderInvoice = (data) => {
    const { invoiceNo, customer, items, total } = data;
    return `
      <div style="display: flex; justify-content: space-between; margin-bottom: 30px;">
        <div>
          <h2>Invoice #${invoiceNo}</h2>
          <p>Date: ${new Date().toLocaleDateString()}</p>
        </div>
        <div style="text-align: right;">
          <h3>Bill To:</h3>
          <p>${customer.name}<br>${customer.email}<br>${customer.address}</p>
        </div>
      </div>
      <table>
        <thead>
          <tr>
            <th>Item</th>
            <th>Quantity</th>
            <th>Price</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          ${items.map(item => `
            <tr>
              <td>${item.name}</td>
              <td>${item.quantity}</td>
              <td>$${item.price}</td>
              <td>$${item.quantity * item.price}</td>
            </tr>
          `).join('')}
          <tr style="background: #f3f4f6; font-weight: bold;">
            <td colspan="3" style="text-align: right;">Total:</td>
            <td style="font-size: 18px;">$${total}</td>
          </tr>
        </tbody>
      </table>
    `;
  };

  const renderDefault = (data) => {
    return `
      <div style="padding: 20px; background: #f9fafb; border-radius: 8px;">
        <pre style="white-space: pre-wrap; font-family: monospace; font-size: 12px;">${JSON.stringify(data, null, 2)}</pre>
      </div>
    `;
  };

  return (
    <PrintContext.Provider value={{ print, isPrinting }}>
      {children}
    </PrintContext.Provider>
  );
};

