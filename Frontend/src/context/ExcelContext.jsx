import React, { createContext, useContext, useState } from 'react';
import * as XLSX from 'xlsx';

const ExcelContext = createContext();

export const useExcel = () => {
  const context = useContext(ExcelContext);
  if (!context) {
    throw new Error('useExcel must be used within ExcelProvider');
  }
  return context;
};

export const ExcelProvider = ({ children }) => {
  const [isExporting, setIsExporting] = useState(false);

  /**
   * Main export function
   * @param {Object} data - The data to export
   * @param {Object} config - Configuration options
   */
  const exportToExcel = async (data, config = {}) => {
    const {
      fileName = 'export',
      sheetName = 'Sheet1',
      dataType = 'default',
      includeHeader = true,
      includeSummary = true,
      autoWidth = true,
      headerStyle = {
        fill: { fgColor: { rgb: "2563EB" } },
        font: { bold: true, color: { rgb: "FFFFFF" }, sz: 12 },
        alignment: { horizontal: "center", vertical: "center" }
      }
    } = config;

    setIsExporting(true);

    try {
      // Generate worksheet data based on type
      const worksheetData = generateWorksheetData(data, dataType, includeHeader, includeSummary);
      
      // Create workbook and worksheet
      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

      // Apply column widths
      if (autoWidth) {
        worksheet['!cols'] = calculateColumnWidths(worksheetData);
      }

      // Apply header styles
      if (includeHeader) {
        applyHeaderStyles(worksheet, worksheetData[0].length, headerStyle);
      }

      // Add worksheet to workbook
      XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

      // Generate file and download
      const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
      const fullFileName = `${fileName}_${timestamp}.xlsx`;
      
      XLSX.writeFile(workbook, fullFileName);

      return { success: true, fileName: fullFileName };
    } catch (error) {
      console.error('Excel export error:', error);
      return { success: false, error: error.message };
    } finally {
      setIsExporting(false);
    }
  };

  /**
   * Generate worksheet data based on data type
   */
  const generateWorksheetData = (data, dataType, includeHeader, includeSummary) => {
    switch (dataType) {
      case 'salesman':
        return generateSalesmanData(data, includeHeader, includeSummary);
      case 'users':
        return generateUsersData(data, includeHeader, includeSummary);
      case 'sales':
        return generateSalesData(data, includeHeader, includeSummary);
      case 'invoice':
        return generateInvoiceData(data, includeHeader, includeSummary);
      case 'products':
        return generateProductsData(data, includeHeader, includeSummary);
      default:
        return generateDefaultData(data, includeHeader);
    }
  };

  /**
   * Salesman data generator
   */
  const generateSalesmanData = (data, includeHeader, includeSummary) => {
    const { salesmans, summary } = data;
    const rows = [];

    // Title row
    rows.push(['SALESMAN MASTERS REPORT']);
    rows.push([`Generated on: ${new Date().toLocaleString('en-IN')}`]);
    rows.push([]); // Empty row

    // Summary section
    if (includeSummary && summary) {
      rows.push(['SUMMARY']);
      rows.push(['Total Salesman:', summary.total]);
      rows.push(['Active:', summary.active]);
      rows.push(['Inactive:', summary.inactive]);
      rows.push([]); // Empty row
    }

    // Headers
    if (includeHeader) {
      rows.push(['SL.NO.', 'CODE', 'NAME', 'ROUTE NO.', 'STATUS']);
    }

    // Data rows
    salesmans.forEach((salesman, index) => {
      rows.push([
        index + 1,
        salesman.codeNo,
        salesman.name,
        salesman.routeNo,
        salesman.status
      ]);
    });

    return rows;
  };

  /**
   * Users data generator
   */
  const generateUsersData = (data, includeHeader, includeSummary) => {
    const { users, summary } = data;
    const rows = [];

    rows.push(['USERS REPORT']);
    rows.push([`Generated on: ${new Date().toLocaleString('en-IN')}`]);
    rows.push([]);

    if (includeSummary && summary) {
      rows.push(['SUMMARY']);
      rows.push(['Total Users:', summary.total]);
      rows.push(['Active Users:', summary.active]);
      rows.push(['Admins:', summary.admins]);
      rows.push([]);
    }

    if (includeHeader) {
      rows.push(['ID', 'NAME', 'EMAIL', 'ROLE', 'STATUS']);
    }

    users.forEach(user => {
      rows.push([
        user.id,
        user.name,
        user.email,
        user.role,
        user.status
      ]);
    });

    return rows;
  };

  /**
   * Sales data generator
   */
  const generateSalesData = (data, includeHeader, includeSummary) => {
    const { sales, totals } = data;
    const rows = [];

    rows.push(['SALES REPORT']);
    rows.push([`Generated on: ${new Date().toLocaleString('en-IN')}`]);
    rows.push([]);

    if (includeSummary && totals) {
      rows.push(['SUMMARY']);
      rows.push(['Total Revenue:', `$${totals.revenue.toLocaleString()}`]);
      rows.push(['Total Orders:', totals.orders]);
      rows.push(['Average Order Value:', `$${Math.round(totals.revenue / totals.orders)}`]);
      rows.push([]);
    }

    if (includeHeader) {
      rows.push(['PERIOD', 'REVENUE', 'ORDERS', 'GROWTH %']);
    }

    sales.forEach(item => {
      rows.push([
        item.period,
        item.revenue,
        item.orders,
        item.growth
      ]);
    });

    return rows;
  };

  /**
   * Invoice data generator
   */
  const generateInvoiceData = (data, includeHeader, includeSummary) => {
    const { invoiceNo, customer, items, total } = data;
    const rows = [];

    rows.push([`INVOICE #${invoiceNo}`]);
    rows.push([`Date: ${new Date().toLocaleDateString()}`]);
    rows.push([]);
    rows.push(['BILL TO:']);
    rows.push([customer.name]);
    rows.push([customer.email]);
    rows.push([customer.address]);
    rows.push([]);

    if (includeHeader) {
      rows.push(['ITEM', 'QUANTITY', 'PRICE', 'AMOUNT']);
    }

    items.forEach(item => {
      rows.push([
        item.name,
        item.quantity,
        `$${item.price}`,
        `$${item.quantity * item.price}`
      ]);
    });

    rows.push([]);
    rows.push(['', '', 'TOTAL:', `$${total}`]);

    return rows;
  };

  /**
   * Products data generator
   */
  const generateProductsData = (data, includeHeader, includeSummary) => {
    const { products, summary } = data;
    const rows = [];

    rows.push(['PRODUCTS INVENTORY']);
    rows.push([`Generated on: ${new Date().toLocaleString('en-IN')}`]);
    rows.push([]);

    if (includeSummary && summary) {
      rows.push(['SUMMARY']);
      rows.push(['Total Products:', summary.total]);
      rows.push(['In Stock:', summary.inStock]);
      rows.push(['Out of Stock:', summary.outOfStock]);
      rows.push([]);
    }

    if (includeHeader) {
      rows.push(['ID', 'NAME', 'CATEGORY', 'PRICE', 'STOCK', 'STATUS']);
    }

    products.forEach(product => {
      rows.push([
        product.id,
        product.name,
        product.category,
        product.price,
        product.stock,
        product.status
      ]);
    });

    return rows;
  };

  
  const generateDefaultData = (data, includeHeader) => {
    const rows = [];

    // If data is array of objects
    if (Array.isArray(data) && data.length > 0) {
      if (includeHeader) {
        rows.push(Object.keys(data[0]));
      }
      data.forEach(item => {
        rows.push(Object.values(item));
      });
    } else {
      // If data is single object or other format
      rows.push(['KEY', 'VALUE']);
      Object.entries(data).forEach(([key, value]) => {
        rows.push([key, JSON.stringify(value)]);
      });
    }

    return rows;
  };

  /**
   * Calculate optimal column widths
   */
  const calculateColumnWidths = (data) => {
    const colWidths = [];
    
    // Get max length for each column
    data.forEach(row => {
      row.forEach((cell, colIndex) => {
        const cellLength = String(cell).length;
        if (!colWidths[colIndex] || cellLength > colWidths[colIndex]) {
          colWidths[colIndex] = cellLength;
        }
      });
    });

    // Convert to width objects (add some padding)
    return colWidths.map(width => ({ wch: Math.min(width + 2, 50) }));
  };

  /**
   * Apply styles to header row
   */
  const applyHeaderStyles = (worksheet, numCols, headerStyle) => {
    // This is a simplified version. For full styling, you'd need xlsx-style or similar
    // Basic implementation sets column widths and could be extended with actual styling
    const range = XLSX.utils.decode_range(worksheet['!ref']);
    
    for (let col = range.s.c; col <= range.e.c; col++) {
      const cellAddress = XLSX.utils.encode_cell({ r: 0, c: col });
      if (!worksheet[cellAddress]) continue;
      
      // Note: Basic XLSX library doesn't support styling without additional plugins
      // For production, consider using xlsx-style or exceljs
    }
  };

  /**
   * Export multiple sheets
   */
  const exportMultipleSheets = async (sheetsData, fileName = 'export') => {
    setIsExporting(true);

    try {
      const workbook = XLSX.utils.book_new();

      sheetsData.forEach(({ data, sheetName, dataType, config = {} }) => {
        const worksheetData = generateWorksheetData(
          data, 
          dataType, 
          config.includeHeader !== false, 
          config.includeSummary !== false
        );
        
        const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

        if (config.autoWidth !== false) {
          worksheet['!cols'] = calculateColumnWidths(worksheetData);
        }

        XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
      });

      const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
      const fullFileName = `${fileName}_${timestamp}.xlsx`;
      
      XLSX.writeFile(workbook, fullFileName);

      return { success: true, fileName: fullFileName };
    } catch (error) {
      console.error('Excel export error:', error);
      return { success: false, error: error.message };
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <ExcelContext.Provider value={{ 
      exportToExcel, 
      exportMultipleSheets,
      isExporting 
    }}>
      {children}
    </ExcelContext.Provider>
  );
};