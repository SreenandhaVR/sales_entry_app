import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Save, Printer, XCircle, CheckCircle, Loader2 } from 'lucide-react';

import { itemService, salesService } from '../../store/services/allAPI';
import styles from '../../pages/SalesEntryForm/sales.module.scss';

// Enhanced Modal Component
const Modal = ({ message, type, onClose }) => {
  const isSuccess = type === 'success';
  const icon = isSuccess ? (
    <CheckCircle size={48} className={styles.successIcon} />
  ) : (
    <XCircle size={48} className={styles.errorIcon} />
  );
  const title = isSuccess ? 'Success!' : 'Error!';

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalInner}>
          {icon}
          <h3 className={styles.modalTitle}>{title}</h3>
          <div className={styles.modalBody}>
            <p>{message}</p>
          </div>
          <div className={styles.modalActions}>
            <button type="button" className={styles.btnPrimary} onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const SalesEntry = () => {
  const [header, setHeader] = useState({
    vr_no: '',
    vr_date: new Date().toISOString().split('T')[0],
    ac_name: '',
    ac_amt: 0,
    status: 'A',
  });

  const [details, setDetails] = useState([
    { sr_no: 1, item_code: '', item_name: '', description: '', qty: 0, rate: 0 },
  ]);

  const [itemMaster, setItemMaster] = useState([]);
  const [itemNameMap, setItemNameMap] = useState({});
  const [loadingItems, setLoadingItems] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalType, setModalType] = useState('success');

  const statusOptions = [
    { value: 'A', label: 'Active' },
    { value: 'I', label: 'Inactive' },
  ];

  // Fetch item master data
  useEffect(() => {
    const fetchItemMaster = async () => {
      try {
        setLoadingItems(true);
        const response = await itemService.getAllItems();
        const items = response.data || [];

        const masterData = items.map((item) => ({
          value: item.item_code,
          label: item.item_code,
          name: item.item_name,
        }));

        const nameMap = items.reduce((acc, item) => {
          acc[item.item_code] = item.item_name;
          return acc;
        }, {});

        setItemMaster(masterData);
        setItemNameMap(nameMap);
      } catch (err) {
        setModalMessage('Failed to load item data. Please check API server.');
        setModalType('error');
        setShowModal(true);
      } finally {
        setLoadingItems(false);
      }
    };

    fetchItemMaster();
  }, []);

  const calculateTotal = (currentDetails) =>
    currentDetails.reduce(
      (sum, row) =>
        sum + parseFloat(row.qty || 0) * parseFloat(row.rate || 0),
      0
    );

  const handleHeaderChange = (field, value) => {
    setHeader((prev) => ({ ...prev, [field]: value }));
  };

  const handleDetailChange = (index, field, value) => {
    const updatedDetails = details.map((row, i) => {
      if (i === index) {
        const updatedRow = { ...row };
        if (field === 'item_code') {
          updatedRow.item_code = String(value).trim().toUpperCase();
          updatedRow.item_name = (itemNameMap[value] || '').toUpperCase();
        } else if (field === 'qty' || field === 'rate') {
          updatedRow[field] = parseFloat(value) || 0;
        } else {
          updatedRow[field] = String(value).trim();
        }
        return updatedRow;
      }
      return row;
    });

    setDetails(updatedDetails);
    setHeader((prev) => ({ ...prev, ac_amt: calculateTotal(updatedDetails) }));
  };

  const addRow = () => {
    setDetails([
      ...details,
      {
        sr_no: details.length + 1,
        item_code: '',
        item_name: '',
        description: '',
        qty: 0,
        rate: 0,
      },
    ]);
  };

  const removeRow = (index) => {
    if (details.length > 1) {
      const updatedDetails = details
        .filter((_, i) => i !== index)
        .map((row, i) => ({ ...row, sr_no: i + 1 }));
      setDetails(updatedDetails);
      setHeader((prev) => ({ ...prev, ac_amt: calculateTotal(updatedDetails) }));
    }
  };

  // Enhanced validation
  const validateForm = () => {
    if (!header.vr_no || isNaN(parseInt(header.vr_no))) {
      setModalMessage('Please enter a valid Voucher Number.');
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

    const validDetails = details.filter(detail => detail.item_code);
    
    if (validDetails.length === 0) {
      setModalMessage('At least one item must be selected.');
      setModalType('error');
      setShowModal(true);
      return false;
    }

    for (const [index, detail] of validDetails.entries()) {
      if (!detail.qty || parseFloat(detail.qty) <= 0) {
        setModalMessage(`Quantity must be greater than 0 for row ${index + 1}.`);
        setModalType('error');
        setShowModal(true);
        return false;
      }
      
      if (!detail.rate || parseFloat(detail.rate) <= 0) {
        setModalMessage(`Rate must be greater than 0 for row ${index + 1}.`);
        setModalType('error');
        setShowModal(true);
        return false;
      }
    }
    
    return true;
  };

  // Enhanced submit with better error handling
  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    try {
      setLoading(true);

      const total = calculateTotal(details);
      
      const submissionData = {
        header_table: {
          vr_no: parseInt(header.vr_no) || 0,
          vr_date: header.vr_date,
          ac_name: header.ac_name.trim().toUpperCase(),
          ac_amt: parseFloat(total.toFixed(2)) || 0,
          status: header.status,
        },
        detail_table: details
          .filter(detail => detail.item_code)
          .map((detail, index) => ({
            vr_no: parseInt(header.vr_no) || 0,
            sr_no: index + 1,
            item_code: detail.item_code.toString().trim(),
            item_name: detail.item_name || '',
            description: detail.description?.trim() || 'N/A',
            qty: parseFloat(detail.qty) || 0,
            rate: parseFloat(detail.rate) || 0,
          })),
      };

      console.log("Payload being sent:", JSON.stringify(submissionData, null, 2));

      await salesService.createSalesEntry(submissionData);
      setModalMessage('Sales entry saved successfully!');
      setModalType('success');
      setShowModal(true);

      // Reset form
      setHeader({
        vr_no: '',
        vr_date: new Date().toISOString().split('T')[0],
        ac_name: '',
        ac_amt: 0,
        status: 'A',
      });
      setDetails([{ sr_no: 1, item_code: '', item_name: '', description: '', qty: 0, rate: 0 }]);
      
    } catch (err) {
      console.error("Error submitting:", err);
      
      let errorMessage = 'Failed to save sales entry.';
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.response?.status) {
        errorMessage = `Server error (${err.response.status}). Please try again.`;
      } else if (!navigator.onLine) {
        errorMessage = 'No internet connection. Please check your network.';
      }
      
      setModalMessage(errorMessage);
      setModalType('error');
      setShowModal(true);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    }).format(amount);
  };

  return (
    <div className={styles.salesEntry}>
      {showModal && (
        <Modal
          message={modalMessage}
          type={modalType}
          onClose={() => setShowModal(false)}
        />
      )}

      {/* Page Header */}
      <div className={styles.pageHeader}>
        <div>
          <h1>Sales Entry</h1>
          <p>Create and manage sales vouchers efficiently</p>
        </div>
        <div className={styles.headerActions}>
          <button
            className={styles.btnPrimary}
            onClick={handleSubmit}
            disabled={loading || loadingItems}
          >
            {loading ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save size={20} />
                <span>Save Entry</span>
              </>
            )}
          </button>
          <button
            className={styles.btnSecondary}
            onClick={() => window.print()}
            disabled={loading || loadingItems}
          >
            <Printer size={20} />
            <span>Print</span>
          </button>
        </div>
      </div>

      {/* Header Section */}
      <div className={styles.sectionCard}>
        <div className={styles.sectionHeader}>
          <h2>Header Information</h2>
        </div>
        <div className={styles.formGrid}>
          <div className={styles.formGroup}>
            <label>Voucher No. *</label>
            <input
              type="number"
              value={header.vr_no}
              onChange={(e) => handleHeaderChange('vr_no', e.target.value)}
              placeholder="Enter voucher number"
            />
          </div>
          <div className={styles.formGroup}>
            <label>Voucher Date *</label>
            <input
              type="date"
              value={header.vr_date}
              onChange={(e) => handleHeaderChange('vr_date', e.target.value)}
            />
          </div>
          <div className={styles.formGroup}>
            <label>Account Name *</label>
            <input
              type="text"
              value={header.ac_name}
              onChange={(e) => handleHeaderChange('ac_name', e.target.value)}
              placeholder="Enter account name"
            />
          </div>
          <div className={styles.formGroup}>
            <label>Status</label>
            <select
              value={header.status}
              onChange={(e) => handleHeaderChange('status', e.target.value)}
            >
              {statusOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
          <div className={styles.formGroup}>
            <label>Total Amount</label>
            <input 
              value={formatCurrency(calculateTotal(details))} 
              readOnly 
              className={styles.totalInput}
            />
          </div>
        </div>
      </div>

      {/* Detail Section */}
      <div className={styles.sectionCard}>
        <div className={styles.sectionHeader}>
          <h2>Item Details</h2>
          <button 
            className={styles.btnAdd} 
            onClick={addRow}
            disabled={loadingItems}
          >
            <Plus size={16} /> Add Item
          </button>
        </div>
        
        {loadingItems ? (
          <div className={styles.loading}>
            <Loader2 size={24} className="animate-spin" />
            Loading items...
          </div>
        ) : (
          <div className={styles.tableContainer}>
            <table className={styles.detailsTable}>
              <thead>
                <tr>
                  <th>Sr.</th>
                  <th>Item Code *</th>
                  <th>Item Name</th>
                  <th>Description</th>
                  <th>Qty *</th>
                  <th>Rate *</th>
                  <th>Amount</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {details.map((row, idx) => (
                  <tr key={idx}>
                    <td>{row.sr_no}</td>
                    <td>
                      <select
                        value={row.item_code}
                        onChange={(e) =>
                          handleDetailChange(idx, 'item_code', e.target.value)
                        }
                      >
                        <option value="">Select Item</option>
                        {itemMaster.map((item) => (
                          <option key={item.value} value={item.value}>
                            {item.label}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <input value={row.item_name} readOnly />
                    </td>
                    <td>
                      <textarea
                        value={row.description}
                        onChange={(e) =>
                          handleDetailChange(idx, 'description', e.target.value)
                        }
                        placeholder="Enter description"
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        value={row.qty}
                        onChange={(e) =>
                          handleDetailChange(idx, 'qty', e.target.value)
                        }
                        min="0"
                        step="0.01"
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        value={row.rate}
                        onChange={(e) =>
                          handleDetailChange(idx, 'rate', e.target.value)
                        }
                        min="0"
                        step="0.01"
                      />
                    </td>
                    <td className={styles.amountCell}>
                      {formatCurrency(row.qty * row.rate)}
                    </td>
                    <td>
                      <button
                        className={styles.btnDelete}
                        onClick={() => removeRow(idx)}
                        disabled={details.length === 1}
                        title="Delete row"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Bottom Actions */}
      <div className={styles.bottomActions}>
        <button
          className={styles.btnPrimary}
          onClick={handleSubmit}
          disabled={loading || loadingItems}
        >
          {loading ? (
            <>
              <Loader2 size={20} className="animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save size={20} />
              Save Sales Entry
            </>
          )}
        </button>
        <button
          className={styles.btnSecondary}
          onClick={() => window.print()}
          disabled={loading || loadingItems}
        >
          <Printer size={20} />
          Print Preview
        </button>
      </div>
    </div>
  );
};

export default SalesEntry;