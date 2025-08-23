import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Plus, Trash2, Save, Printer, XCircle, CheckCircle, Loader2, Hash } from 'lucide-react';

import {
  updateHeader,
  updateDetail,
  addDetailRow,
  removeDetailRow,
  resetForm,
  clearError,
  submitSalesEntry,
  fetchItemMaster,
  getNextVrNo
} from '../../store/slices/salesEntrySlice';
import { validateCompleteForm } from '../../utils/validation';
import PrintVoucher from '../../components/Print/PrintVoucher';
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
            <p>{typeof message === 'string' ? message : JSON.stringify(message)}</p>
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
  const dispatch = useDispatch();
  const {
    header = {},
    details = [],
    itemMaster = [],
    loading,
    itemsLoading,
    vrNoLoading,
    error,
    lastSavedEntry
  } = useSelector((state) => state.salesEntry || {});

  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalType, setModalType] = useState('success');
  const [itemNameMap, setItemNameMap] = useState({});
  const [showPrint, setShowPrint] = useState(false);

  const statusOptions = [
    { value: 'A', label: 'Active' },
    { value: 'I', label: 'Inactive' },
  ];

  // Fetch item master data
  useEffect(() => {
    dispatch(fetchItemMaster());
  }, [dispatch]);

  // Update item name map when itemMaster changes
  useEffect(() => {
    if (itemMaster.length > 0) {
      const nameMap = itemMaster.reduce((acc, item) => {
        acc[item.item_code] = item.item_name;
        return acc;
      }, {});
      setItemNameMap(nameMap);
    }
  }, [itemMaster]);

  // Handle success/error states
  useEffect(() => {
    if (lastSavedEntry) {
      setModalMessage('Sales entry saved successfully!');
      setModalType('success');
      setShowModal(true);
      dispatch(resetForm());
    }
  }, [lastSavedEntry, dispatch]);

  useEffect(() => {
    if (error) {
      setModalMessage(error);
      setModalType('error');
      setShowModal(true);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const calculateTotal = (currentDetails) =>
    currentDetails.reduce(
      (sum, row) =>
        sum + parseFloat(row.qty || 0) * parseFloat(row.rate || 0),
      0
    );

  const handleGetNextVrNo = () => {
    dispatch(getNextVrNo());
  };

  const handleHeaderChange = (field, value) => {
    dispatch(updateHeader({ field, value }));
  };

  const handleDetailChange = (index, field, value) => {
    let processedValue = value;
    if (field === 'item_code') {
      processedValue = String(value).trim().toUpperCase();
    } else if (field === 'qty' || field === 'rate') {
      processedValue = parseFloat(value) || 0;
    } else {
      processedValue = String(value).trim();
    }
    
    dispatch(updateDetail({ index, field, value: processedValue }));
  };

  const addRow = () => {
    dispatch(addDetailRow());
  };

  const removeRow = (index) => {
    dispatch(removeDetailRow(index));
  };

  // Enhanced validation using validation.js
  const validateForm = () => {
    const errorMessage = validateCompleteForm(header, details);
    
    if (errorMessage) {
      setModalMessage(errorMessage);
      setModalType('error');
      setShowModal(true);
      return false;
    }
    
    return true;
  };

  // Enhanced submit with better error handling
  const handleSubmit = () => {
    if (!validateForm()) return;
    
    dispatch(submitSalesEntry({ header, details }));
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

      {showPrint && lastSavedEntry && (
        <PrintVoucher
          header={lastSavedEntry.header}
          details={lastSavedEntry.details}
          onClose={() => setShowPrint(false)}
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
            disabled={loading || itemsLoading}
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
            onClick={() => {
              if (lastSavedEntry) {
                setShowPrint(true);
              } else {
                setModalMessage('Please save the entry first before printing.');
                setModalType('error');
                setShowModal(true);
              }
            }}
            disabled={loading || itemsLoading || !lastSavedEntry}
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
            <div className={styles.inputGroup}>
              <input
                type="number"
                value={header.vr_no || ''}
                onChange={(e) => handleHeaderChange('vr_no', e.target.value)}
                placeholder="Enter voucher number"
              />
              <button
                type="button"
                className={styles.btnGetNext}
                onClick={handleGetNextVrNo}
                disabled={vrNoLoading}
                title="Get Next VR No"
              >
                {vrNoLoading ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Hash size={16} />
                )}
              </button>
            </div>
          </div>
          <div className={styles.formGroup}>
            <label>Voucher Date *</label>
            <input
              type="date"
              value={header.vr_date || ''}
              onChange={(e) => handleHeaderChange('vr_date', e.target.value)}
            />
          </div>
          <div className={styles.formGroup}>
            <label>Account Name *</label>
            <input
              type="text"
              value={header.ac_name || ''}
              onChange={(e) => handleHeaderChange('ac_name', e.target.value)}
              placeholder="Enter account name"
            />
          </div>
          <div className={styles.formGroup}>
            <label>Status</label>
            <select
              value={header.status || 'A'}
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
              value={formatCurrency(calculateTotal(details) || 0)} 
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
            disabled={itemsLoading}
          >
            <Plus size={16} /> Add Item
          </button>
        </div>
        
        {itemsLoading ? (
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
                {(details || []).map((row = {}, idx) => (
                  <tr key={idx}>
                    <td>{row.sr_no || 0}</td>
                    <td>
                      <select
                        value={row.item_code || ''}
                        onChange={(e) =>
                          handleDetailChange(idx, 'item_code', e.target.value)
                        }
                      >
                        <option value="">Select Item</option>
                        {(itemMaster || []).map((item = {}) => (
                          <option key={item.item_code} value={item.item_code}>
                            {item.item_code}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <input value={row.item_name || ''} readOnly />
                    </td>
                    <td>
                      <textarea
                        value={row.description || ''}
                        onChange={(e) =>
                          handleDetailChange(idx, 'description', e.target.value)
                        }
                        placeholder="Enter description"
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        value={row.qty || 0}
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
                        value={row.rate || 0}
                        onChange={(e) =>
                          handleDetailChange(idx, 'rate', e.target.value)
                        }
                        min="0"
                        step="0.01"
                      />
                    </td>
                    <td className={styles.amountCell}>
                      {formatCurrency((row.qty || 0) * (row.rate || 0))}
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
          disabled={loading || itemsLoading}
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
          onClick={() => {
            if (lastSavedEntry) {
              setShowPrint(true);
            } else {
              setModalMessage('Please save the entry first before printing.');
              setModalType('error');
              setShowModal(true);
            }
          }}
          disabled={loading || itemsLoading || !lastSavedEntry}
        >
          <Printer size={20} />
          Print Preview
        </button>
      </div>
    </div>
  );
};

export default SalesEntry;