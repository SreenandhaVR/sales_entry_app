import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Save, Printer, Calendar, XCircle, CheckCircle } from 'lucide-react';

// === API Service Definitions (Embedded for self-contained execution) ===

const API_BASE_URL = 'http://5.189.180.8:8010';

// Mock axios-like implementation since we can't import axios in artifacts
const api = {
  get: async (endpoint) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return { data };
  },
  post: async (endpoint, data) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const error = new Error(`HTTP error! status: ${response.status}`);
      error.response = {
        status: response.status,
        data: errorData
      };
      throw error;
    }
    const responseData = await response.json();
    return { data: responseData };
  }
};

const itemService = {
  // Fetches all items from the /item endpoint
  getAllItems: () => api.get('/item'),
};

const salesService = {
  // Fetches all sales headers
  getHeaders: () => api.get('/header'),
  // Fetches sales details (might need a parameter like vr_no in a real app)
  getDetails: () => api.get('/detail'),
  // Creates a new sales entry, sending both header and detail data
  createSalesEntry: (data) => api.post('/header/multiple', data),
};
// === End API Service Definitions ===


// Custom Modal Component to replace native alerts
const Modal = ({ message, type, onClose }) => {
  const isSuccess = type === 'success';
  const icon = isSuccess ? <CheckCircle size={24} className="text-green-500" /> : <XCircle size={24} className="text-red-500" />;
  const title = isSuccess ? 'Success!' : 'Error!';

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm transform transition-all sm:my-8 sm:align-middle">
        <div className="flex flex-col items-center justify-center text-center">
          {icon}
          <h3 className="mt-3 text-lg leading-6 font-medium text-gray-900">{title}</h3>
          <div className="mt-2">
            <p className="text-sm text-gray-500">{message}</p>
          </div>
          <div className="mt-4">
            <button
              type="button"
              className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};


const SalesEntry = () => {
  // Initial state for header section
  const [header, setHeader] = useState({
    vr_no: '',
    vr_date: new Date().toISOString().split('T')[0],
    ac_name: '',
    ac_amt: 0,
    status: 'A'
  });

  // Initial state for detail section
  const [details, setDetails] = useState([
    {
      sr_no: 1,
      item_code: '',
      item_name: '',
      description: '',
      qty: 0,
      rate: 0
    }
  ]);

  // State for item master data fetched from API
  const [itemMaster, setItemMaster] = useState([]);
  const [itemNameMap, setItemNameMap] = useState({});
  const [loadingItems, setLoadingItems] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalType, setModalType] = useState('success'); // 'success' or 'error'

  const statusOptions = [
    { value: 'A', label: 'Active' },
    { value: 'I', label: 'Inactive' }
  ];

  // Fetch item master data on component mount
  useEffect(() => {
    const fetchItemMaster = async () => {
      try {
        setLoadingItems(true);
        const response = await itemService.getAllItems();
        const items = response.data || []; // Assuming response.data is an array of items

        const masterData = items.map(item => ({
          value: item.item_code, // Assuming item_code is the unique identifier
          label: item.item_code, // Display item_code in dropdown
          name: item.item_name // Store item_name to map
        }));

        const nameMap = items.reduce((acc, item) => {
          acc[item.item_code] = item.item_name;
          return acc;
        }, {});

        setItemMaster(masterData);
        setItemNameMap(nameMap);
      } catch (err) {
        console.error('Failed to fetch item master data:', err);
        setModalMessage('Failed to load item data. This is likely due to the API server being unreachable or a Cross-Origin Resource Sharing (CORS) issue. Please check your API server status and CORS configuration.');
        setModalType('error');
        setShowModal(true);
      } finally {
        setLoadingItems(false);
      }
    };

    fetchItemMaster();
  }, []); // Empty dependency array means this runs once on mount

  // Calculate total amount
  const calculateTotal = (currentDetails) => {
    return currentDetails.reduce((sum, row) => sum + (parseFloat(row.qty || 0) * parseFloat(row.rate || 0)), 0);
  };

  // Update header field
  const handleHeaderChange = (field, value) => {
    setHeader(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  // Update detail row
  const handleDetailChange = (index, field, value) => {
    const updatedDetails = details.map((row, i) => {
      if (i === index) {
        const updatedRow = { ...row, [field]: value };

        // Auto-populate item name when item code changes
        if (field === 'item_code') {
          updatedRow.item_name = itemNameMap[value] || '';
        }

        return updatedRow;
      }
      return row;
    });

    setDetails(updatedDetails);

    // Update header total after details are updated
    setHeader(prev => ({ ...prev, ac_amt: calculateTotal(updatedDetails) }));
  };

  // Add new row
  const addRow = () => {
    const newRow = {
      sr_no: details.length + 1,
      item_code: '',
      item_name: '',
      description: '',
      qty: 0,
      rate: 0
    };
    setDetails([...details, newRow]);
  };

  // Remove row
  const removeRow = (index) => {
    if (details.length > 1) {
      const updatedDetails = details.filter((_, i) => i !== index)
        .map((row, i) => ({ ...row, sr_no: i + 1 }));
      setDetails(updatedDetails);

      // Update header total
      setHeader(prev => ({ ...prev, ac_amt: calculateTotal(updatedDetails) }));
    }
  };

  // Client-side validation
  const validateForm = () => {
    if (!header.vr_no || isNaN(parseInt(header.vr_no))) {
      setModalMessage('Voucher Number is required and must be a valid number.');
      setModalType('error');
      setShowModal(true);
      return false;
    }
    if (!header.vr_date) {
      setModalMessage('Voucher Date is required.');
      setModalType('error');
      setShowModal(true);
      return false;
    }
    if (!header.ac_name.trim()) {
      setModalMessage('Account Name is required.');
      setModalType('error');
      setShowModal(true);
      return false;
    }

    for (const detail of details) {
      if (!detail.item_code) {
        setModalMessage(`Item Code is required for Sr. No. ${detail.sr_no}.`);
        setModalType('error');
        setShowModal(true);
        return false;
      }
      if (isNaN(parseFloat(detail.qty)) || parseFloat(detail.qty) <= 0) {
        setModalMessage(`Quantity must be a positive number for Sr. No. ${detail.sr_no}.`);
        setModalType('error');
        setShowModal(true);
        return false;
      }
      if (isNaN(parseFloat(detail.rate)) || parseFloat(detail.rate) <= 0) {
        setModalMessage(`Rate must be a positive number for Sr. No. ${detail.sr_no}.`);
        setModalType('error');
        setShowModal(true);
        return false;
      }
    }
    return true;
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      
      // Prepare submission data with proper data types and structure
      const submissionData = {
        header_table: {
          vr_no: parseInt(header.vr_no),
          vr_date: header.vr_date,
          ac_name: header.ac_name.trim(),
          ac_amt: parseFloat(calculateTotal(details).toFixed(2)), // Using parseFloat for consistency
          status: header.status
        },
        detail_table: details
          .filter(detail => detail.item_code) // Only include rows with item codes
          .map((detail, index) => ({
            vr_no: parseInt(header.vr_no),
            sr_no: index + 1, // Ensure sequential sr_no
            item_code: detail.item_code.trim(),
            item_name: detail.item_name.trim(),
            description: (detail.description || '').trim(),
            qty: parseFloat(parseFloat(detail.qty || 0).toFixed(3)), // Round to 3 decimal places
            rate: parseFloat(parseFloat(detail.rate || 0).toFixed(2)) // Round to 2 decimal places
          }))

      // Additional validation for detail table
      if (submissionData.detail_table.length === 0) {
        setModalMessage('At least one detail row with valid item code is required.');
        setModalType('error');
        setShowModal(true);
        return;
      }

      // Log the data being sent for debugging
      console.log('Submitting data:', JSON.stringify(submissionData, null, 2));

      // Validate the data structure before sending
      if (!submissionData.header_table || !submissionData.detail_table) {
        throw new Error('Invalid data structure. Both header_table and detail_table are required.');
      }

      // Additional validation for required fields
      const requiredHeaderFields = ['vr_no', 'vr_date', 'ac_name', 'ac_amt', 'status'];
      const missingHeaderFields = requiredHeaderFields.filter(field => !submissionData.header_table[field]);
      if (missingHeaderFields.length > 0) {
        throw new Error(`Missing required header fields: ${missingHeaderFields.join(', ')}`);
      }

      const response = await salesService.createSalesEntry(submissionData);
      
      if (!response || !response.data) {
        throw new Error('Invalid response from server');
      }

      const message = response.data.message || 'Sales entry saved successfully!';
      setModalMessage(message);
      setModalType('success');
      setShowModal(true);

      // Reset form on success
      setHeader({
        vr_no: '',
        vr_date: new Date().toISOString().split('T')[0],
        ac_name: '',
        ac_amt: 0,
        status: 'A'
      });
      setDetails([{
        sr_no: 1,
        item_code: '',
        item_name: '',
        description: '',
        qty: 0,
        rate: 0
      }]);
     } catch (err) {
  // Declare apiMessage first
  let apiMessage = 'Failed to submit sales entry.';

  // Pretty print the whole error to console for debugging
  console.error('API Error Details:', {
    status: err?.response?.status,
    statusText: err?.response?.statusText,
    data: err?.response?.data,
    message: err?.message,
    config: {
      url: err?.config?.url,
      method: err?.config?.method,
      data: JSON.parse(err?.config?.data || '{}'),
      headers: err?.config?.headers
    }
  });

  // Build a user-friendly error message
  if (err?.response?.status === 500) {
    apiMessage = 'Server encountered an error while processing your request. This might be due to:\n' +
                '1. Invalid data format\n' +
                '2. Database connection issues\n' +
                '3. Server processing error\n\n' +
                'Please try again and contact support if the issue persists.';
  } else if (err?.response?.status === 400) {
    apiMessage = 'Invalid data submitted. Please check your input and try again.';
  } else if (err?.response?.status === 404) {
    apiMessage = 'The requested service endpoint was not found.';
  } else if (err?.response?.data?.message) {
    apiMessage = err.response.data.message;
  } else if (err?.message) {
    apiMessage = err.message;
  }

  setModalMessage(apiMessage);
  setModalType('error');
  setShowModal(true);
} finally {
  setLoading(false);
}
  }
// Function to handle printing
const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Sales Voucher ${header.vr_no}</title>
          <style>
            body { font-family: 'Inter', sans-serif; margin: 20px; color: #333; }
            h1 { text-align: center; color: #111827; margin-bottom: 20px; }
            .header-info, .detail-info { margin-bottom: 20px; border: 1px solid #eee; padding: 15px; border-radius: 8px; }
            .header-info div, .detail-info div { margin-bottom: 10px; }
            .header-info strong, .detail-info strong { display: inline-block; width: 120px; color: #374151; }
            table { width: 100%; border-collapse: collapse; margin-top: 15px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f9fafb; font-weight: 600; color: #374151; }
            .total-section { text-align: right; margin-top: 20px; font-size: 1.1rem; font-weight: 700; color: #059669; }
            .total-section span { display: inline-block; width: 150px; }
            @media print {
              button { display: none; }
              body { margin: 0; }
              .header-info, .detail-info { border: none; padding: 0; }
              table, th, td { border-color: #ccc; }
            }
          </style>
        </head>
        <body>
          <h1>Sales Voucher #${header.vr_no}</h1>

          <div class="header-info">
            <div><strong>Voucher No.:</strong> ${header.vr_no}</div>
            <div><strong>Voucher Date:</strong> ${header.vr_date}</div>
            <div><strong>Account Name:</strong> ${header.ac_name}</div>
            <div><strong>Status:</strong> ${statusOptions.find(opt => opt.value === header.status)?.label || header.status}</div>
          </div>

          <h2>Detail Information</h2>
          <div class="detail-info">
            <table>
              <thead>
                <tr>
                  <th>Sr. No.</th>
                  <th>Item Code</th>
                  <th>Item Name</th>
                  <th>Description</th>
                  <th>Quantity</th>
                  <th>Rate</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                ${details.map(row => `<tr>
                    <td>${row.sr_no}</td>
                    <td>${row.item_code}</td>
                    <td>${row.item_name}</td>
                    <td>${row.description}</td>
                    <td>${row.qty}</td>
                    <td>${parseFloat(row.rate || 0).toFixed(2)}</td>
                    <td>${(parseFloat(row.qty || 0) * parseFloat(row.rate || 0)).toFixed(2)}</td>
                  </tr>`).join('')}
              </tbody>
            </table>
          </div>

          <div class="total-section">
            Grand Total: <span>₹${calculateTotal(details).toFixed(2)}</span>
          </div>

          <button onclick="window.print()" style="display: block; margin: 30px auto; padding: 10px 20px; background-color: #3b82f6; color: white; border: none; border-radius: 5px; cursor: pointer;">Print Document</button>
        </body>
      </html>
    `);
    printWindow.document.close();
    // Automatically trigger print dialog, if desired.
    // printWindow.print();
  };


  return (
    <div className="sales-entry">
      {showModal && <Modal message={modalMessage} type={modalType} onClose={() => setShowModal(false)} />}

      <div className="page-header">
        <div>
          <h1>Sales Entry</h1>
          <p>Create and manage sales vouchers</p>
        </div>
        <div className="header-actions">
          <button className="btn btn-primary" onClick={handleSubmit} disabled={loading || loadingItems}>
            <Save size={20} />
            <span>{loading ? 'Saving...' : 'Save Entry'}</span>
          </button>
          <button className="btn btn-secondary" onClick={handlePrint} disabled={loading || loadingItems}>
            <Printer size={20} />
            <span>Print</span>
          </button>
        </div>
      </div>

      {/* Header Section */}
      <div className="section-card">
        <div className="section-header">
          <h2>Header Information</h2>
        </div>
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="vr_no">Voucher No.</label>
            <input
              id="vr_no"
              type="number"
              value={header.vr_no}
              onChange={(e) => handleHeaderChange('vr_no', e.target.value)}
              placeholder="Enter voucher number"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="vr_date">Voucher Date</label>
            <input
              id="vr_date"
              type="date"
              value={header.vr_date}
              onChange={(e) => handleHeaderChange('vr_date', e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="ac_name">Account Name</label>
            <input
              id="ac_name"
              type="text"
              value={header.ac_name}
              onChange={(e) => handleHeaderChange('ac_name', e.target.value)}
              placeholder="Enter account name"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="status">Status</label>
            <select
              id="status"
              value={header.status}
              onChange={(e) => handleHeaderChange('status', e.target.value)}
              required
            >
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Total Amount</label>
            <input
              type="number"
              value={calculateTotal(details).toFixed(2)} // Always calculate from details
              readOnly
              className="total-input"
            />
          </div>
        </div>
      </div>

      {/* Detail Section */}
      <div className="section-card">
        <div className="section-header">
          <h2>Detail Information</h2>
          <button className="btn-add" onClick={addRow} disabled={loading || loadingItems}>
            <Plus size={16} />
            Add Row
          </button>
        </div>
        {loadingItems ? (
          <div className="p-4 text-center text-gray-600">Loading item data...</div>
        ) : (
          <div className="table-container">
            <table className="details-table">
              <thead>
                <tr>
                  <th>Sr. No.</th>
                  <th>Item Code</th>
                  <th>Item Name</th>
                  <th>Description</th>
                  <th>Quantity</th>
                  <th>Rate</th>
                  <th>Amount</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {details.map((row, index) => (
                  <tr key={index}>
                    <td>
                      <span className="sr-badge">{row.sr_no}</span>
                    </td>
                    <td>
                      <select
                        value={row.item_code}
                        onChange={(e) => handleDetailChange(index, 'item_code', e.target.value)}
                      >
                        <option value="">Select Item</option>
                        {itemMaster.map(item => (
                          <option key={item.value} value={item.value}>
                            {item.label}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <input
                        type="text"
                        value={row.item_name}
                        readOnly
                        placeholder="Auto-populated"
                      />
                    </td>
                    <td>
                      <textarea
                        value={row.description}
                        onChange={(e) => handleDetailChange(index, 'description', e.target.value)}
                        placeholder="Enter description"
                        rows={1}
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        step="0.001"
                        value={row.qty}
                        onChange={(e) => handleDetailChange(index, 'qty', e.target.value)}
                        placeholder="0"
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        step="0.01"
                        value={row.rate}
                        onChange={(e) => handleDetailChange(index, 'rate', e.target.value)}
                        placeholder="0.00"
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        value={(parseFloat(row.qty || 0) * parseFloat(row.rate || 0)).toFixed(2)}
                        readOnly
                        className="amount-cell"
                      />
                    </td>
                    <td>
                      <button
                        className="btn-delete"
                        onClick={() => removeRow(index)}
                        disabled={details.length === 1 || loading}
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="summary">
          <div className="summary-left">
            <span>Total Rows: {details.length}</span>
          </div>
          <div className="summary-right">
            <div className="grand-total-label">Grand Total</div>
            <div className="grand-total-amount">₹{calculateTotal(details).toFixed(2)}</div>
          </div>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="bottom-actions">
        <button className="btn btn-primary btn-large" onClick={handleSubmit} disabled={loading || loadingItems}>
          <Save size={20} />
          {loading ? 'Saving Sales Entry...' : 'Save Sales Entry'}
        </button>
        <button className="btn btn-secondary btn-large" onClick={handlePrint} disabled={loading || loadingItems}>
          <Printer size={20} />
          Print Preview
        </button>
      </div>

<style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
          background-color: #f9fafb;
          color: #111827;
        }

        .sales-entry {
          min-height: 100vh;
          padding: 1rem;
          max-width: 1400px;
          margin: 0 auto;
        }

        .page-header {
          background: white;
          border-radius: 0.5rem;
          border: 1px solid #e5e7eb;
          padding: 1.5rem;
          margin-bottom: 1.5rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
        }

        .page-header h1 {
          font-size: 1.875rem;
          font-weight: 700;
          color: #111827;
          margin-bottom: 0.25rem;
        }

        .page-header p {
          color: #6b7280;
          font-size: 0.875rem;
        }

        .header-actions {
          display: flex;
          gap: 0.75rem;
        }

        .btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          border-radius: 0.5rem;
          font-weight: 500;
          font-size: 0.875rem;
          cursor: pointer;
          transition: all 0.2s ease;
          border: 1px solid transparent;
        }

        .btn-primary {
          background-color: #3b82f6;
          color: white;
          border-color: #3b82f6;
        }

        .btn-primary:hover:not(:disabled) {
          background-color: #2563eb;
          border-color: #2563eb;
        }

        .btn-primary:disabled {
          background-color: #9ca3af;
          border-color: #9ca3af;
          cursor: not-allowed;
        }

        .btn-secondary {
          background-color: white;
          color: #374151;
          border-color: #d1d5db;
        }

        .btn-secondary:hover:not(:disabled) {
          background-color: #f9fafb;
          border-color: #9ca3af;
        }
        .btn-secondary:disabled {
          background-color: #f9fafb;
          color: #9ca3af;
          border-color: #e5e7eb;
          cursor: not-allowed;
        }


        .btn-large {
          padding: 1rem 2rem;
          font-size: 1rem;
        }

        .section-card {
          background: white;
          border-radius: 0.5rem;
          border: 1px solid #e5e7eb;
          margin-bottom: 1.5rem;
          box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
        }

        .section-header {
          padding: 1.5rem;
          border-bottom: 1px solid #e5e7eb;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .section-header h2 {
          font-size: 1.25rem;
          font-weight: 600;
          color: #111827;
        }

        .btn-add {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          background-color: #10b981;
          color: white;
          border: none;
          border-radius: 0.375rem;
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          transition: background-color 0.2s ease;
        }

        .btn-add:hover:not(:disabled) {
          background-color: #059669;
        }
        .btn-add:disabled {
          background-color: #9ca3af;
          cursor: not-allowed;
        }

        .form-grid {
          padding: 1.5rem;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
        }

        .form-group label {
          font-weight: 500;
          color: #374151;
          margin-bottom: 0.5rem;
        }

        .form-group input,
        .form-group select,
        .form-group textarea {
          padding: 0.75rem;
          border: 1px solid #d1d5db;
          border-radius: 0.375rem;
          font-size: 0.875rem;
          transition: border-color 0.2s ease;
        }

        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .total-input {
          background-color: #f9fafb;
          font-weight: 600;
          color: #059669;
        }

        .table-container {
          overflow-x: auto;
          padding: 1.5rem;
        }

        .details-table {
          width: 100%;
          border-collapse: collapse;
        }

        .details-table th {
          background-color: #f9fafb;
          padding: 0.75rem;
          text-align: left;
          font-weight: 600;
          color: #374151;
          border-bottom: 2px solid #e5e7eb;
        }

        .details-table td {
          padding: 0.75rem;
          border-bottom: 1px solid #e5e7eb;
        }

        .details-table tr:hover {
          background-color: #f9fafb;
        }

        .details-table input,
        .details-table select,
        .details-table textarea {
          width: 100%;
          padding: 0.5rem;
          border: 1px solid #d1d5db;
          border-radius: 0.25rem;
          font-size: 0.875rem;
        }

        .details-table input:focus,
        .details-table select:focus,
        .details-table textarea:focus {
          outline: none;
          border-color: #3b82f6;
        }

        .center {
          text-align: center;
        }

        .sr-badge {
          display: inline-block;
          background-color: #e5e7eb;
          color: #374151;
          padding: 0.25rem 0.5rem;
          border-radius: 0.25rem;
          font-size: 0.75rem;
          font-weight: 600;
        }
        .amount-cell {
            background-color: #f9fafb;
            font-weight: 500;
            color: #374151;
        }

        .btn-delete {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          background-color: #ef4444;
          color: white;
          border: none;
          border-radius: 0.25rem;
          cursor: pointer;
          transition: background-color 0.2s ease;
        }

        .btn-delete:hover:not(:disabled) {
          background-color: #dc2626;
        }

        .btn-delete:disabled {
          background-color: #9ca3af;
          cursor: not-allowed;
        }

        .summary {
          padding: 1.5rem;
          border-top: 1px solid #e5e7eb;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .summary-left {
          color: #6b7280;
          font-size: 0.875rem;
        }

        .summary-right {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .grand-total-label {
          font-weight: 600;
          color: #374151;
        }

        .grand-total-amount {
          font-size: 1.25rem;
          font-weight: 700;
          color: #059669;
        }

        .bottom-actions {
          display: flex;
          gap: 1rem;
          justify-content: center;
          padding: 2rem 0;
        }

        @media (max-width: 768px) {
          .sales-entry {
            padding: 0.5rem;
          }

          .page-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
          }

          .header-actions {
            width: 100%;
            justify-content: flex-end;
          }

          .form-grid {
            grid-template-columns: 1fr;
          }

          .section-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
          }

          .table-container {
            font-size: 0.75rem;
          }

          .details-table th,
          .details-table td {
            padding: 0.5rem;
          }

          .bottom-actions {
            flex-direction: column;
            align-items: stretch;
          }
        }
      `}</style>
    </div>
  );
};

export default SalesEntry;