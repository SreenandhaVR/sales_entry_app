import React, { useState } from 'react';
import { Plus, Trash2, Save, Printer, Calendar } from 'lucide-react';
import Button from '../../components/Button/Button';
import Input from '../../components/Input/Input';
import Select from '../../components/Select/Select';
import styles from './Home.module.scss';

const Home = () => {
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

  // Sample item master data
  const itemMaster = [
    { value: 'ITEM001', label: 'ITEM001' },
    { value: 'ITEM002', label: 'ITEM002' },
    { value: 'ITEM003', label: 'ITEM003' },
    { value: 'ITEM111', label: 'ITEM111' },
    { value: 'ITEM 2', label: 'ITEM 2' }
  ];

  const itemNameMap = {
    'ITEM001': 'Product A',
    'ITEM002': 'Product B', 
    'ITEM003': 'Service X',
    'ITEM111': 'ITEM NAME 111',
    'ITEM 2': 'ITEM NAME 2'
  };

  const statusOptions = [
    { value: 'A', label: 'Active' },
    { value: 'I', label: 'Inactive' }
  ];

  // Calculate total amount
  const calculateTotal = () => {
    return details.reduce((sum, row) => sum + (row.qty * row.rate), 0);
  };

  // Update header field
  const handleHeaderChange = (field, value) => {
    setHeader(prev => ({
      ...prev,
      [field]: value,
      ...(field !== 'ac_amt' && { ac_amt: calculateTotal() })
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
    
    // Update header total
    const newTotal = updatedDetails.reduce((sum, row) => sum + (row.qty * row.rate), 0);
    setHeader(prev => ({ ...prev, ac_amt: newTotal }));
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
      const newTotal = updatedDetails.reduce((sum, row) => sum + (row.qty * row.rate), 0);
      setHeader(prev => ({ ...prev, ac_amt: newTotal }));
    }
  };

  // Handle form submission
  const handleSubmit = () => {
    const submissionData = {
      header_table: {
        ...header,
        vr_no: parseInt(header.vr_no)
      },
      detail_table: details.map(detail => ({
        ...detail,
        vr_no: parseInt(header.vr_no),
        qty: parseFloat(detail.qty),
        rate: parseFloat(detail.rate)
      }))
    };
    
    console.log('Submission Data:', submissionData);
    alert('Form submitted');
  };

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        {/* Page Header */}
        <div className={styles.pageHeader}>
          <div className={styles.headerInfo}>
            <h1 className={styles.title}>Sales Entry</h1>
            <p className={styles.subtitle}>Create and manage sales vouchers</p>
          </div>
          <div className={styles.headerActions}>
            <Button variant="primary" icon={<Save size={20} />} onClick={handleSubmit}>
              Save Entry
            </Button>
            <Button variant="secondary" icon={<Printer size={20} />}>
              Print
            </Button>
          </div>
        </div>

        {/* Header Section */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>
              <div className={styles.sectionIcon}>
                <span>H</span>
              </div>
              Header Information
            </h2>
          </div>
          
          <div className={styles.sectionContent}>
            <div className={styles.headerGrid}>
              <Input
                label="Voucher No."
                type="number"
                value={header.vr_no}
                onChange={(e) => handleHeaderChange('vr_no', e.target.value)}
                placeholder="Enter voucher number"
                required
              />

              <Input
              
                label="Voucher Date"
                type="date"
                value={header.vr_date}
                onChange={(e) => handleHeaderChange('vr_date', e.target.value)}
                icon={<Calendar size={20} />}
                required
              />

              <Input
                label="Account Name"
                value={header.ac_name}
                onChange={(e) => handleHeaderChange('ac_name', e.target.value)}
                placeholder="Enter account name"
                required
              />

              <Select
                label="Status"
                options={statusOptions}
                value={header.status}
                onChange={(e) => handleHeaderChange('status', e.target.value)}
                required
              />
            </div>

            <div className={styles.totalSection}>
              <div className={styles.totalGrid}>
                <div></div>
                <div></div>
                <Input
                  label="Total Amount"
                  type="number"
                  value={header.ac_amt.toFixed(2)}
                  readOnly
                  icon={<span>₹</span>}
                  className={styles.totalInput}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Detail Section */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>
              <div className={`${styles.sectionIcon} ${styles.detailIcon}`}>
                <span>D</span>
              </div>
              Detail Information
            </h2>
            <Button variant="success" size="small" icon={<Plus size={18} />} onClick={addRow}>
              Add Row
            </Button>
          </div>

          <div className={styles.sectionContent}>
            <div className={styles.tableContainer}>
              <div className={styles.tableHeader}>
                <div className={styles.colSrNo}>Sr. No.</div>
                <div className={styles.colItemCode}>Item Code</div>
                <div className={styles.colItemName}>Item Name</div>
                <div className={styles.colDescription}>Description</div>
                <div className={styles.colQty}>Quantity</div>
                <div className={styles.colRate}>Rate</div>
                <div className={styles.colAction}>Action</div>
              </div>

              <div className={styles.tableBody}>
                {details.map((row, index) => (
                  <div key={index} className={styles.tableRow}>
                    <div className={styles.colSrNo}>
                      <span className={styles.srBadge}>{row.sr_no}</span>
                    </div>

                    <div className={styles.colItemCode}>
                      <Select
                        options={itemMaster}
                        value={row.item_code}
                        onChange={(e) => handleDetailChange(index, 'item_code', e.target.value)}
                        placeholder="Select Item"
                      />
                    </div>

                    <div className={styles.colItemName}>
                      <Input
                        value={row.item_name}
                        readOnly
                        placeholder="Auto-populated"
                      />
                    </div>

                    <div className={styles.colDescription}>
                      <textarea
                        value={row.description}
                        onChange={(e) => handleDetailChange(index, 'description', e.target.value)}
                        className={styles.textarea}
                        placeholder="Enter description"
                        rows={1}
                      />
                    </div>

                    <div className={styles.colQty}>
                      <Input
                        type="number"
                        step="0.001"
                        value={row.qty}
                        onChange={(e) => handleDetailChange(index, 'qty', parseFloat(e.target.value) || 0)}
                        placeholder="0"
                      />
                    </div>

                    <div className={styles.colRate}>
                      <Input
                        type="number"
                        step="0.01"
                        value={row.rate}
                        onChange={(e) => handleDetailChange(index, 'rate', parseFloat(e.target.value) || 0)}
                        placeholder="0.00"
                        icon={<span>₹</span>}
                      />
                    </div>

                    <div className={styles.colAction}>
                      <button
                        onClick={() => removeRow(index)}
                        disabled={details.length === 1}
                        className={styles.deleteButton}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <div className={styles.rowTotal}>
                      Row Total: ₹{(row.qty * row.rate).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.summary}>
              <div className={styles.summaryLeft}>
                <span>Total Rows: {details.length}</span>
              </div>
              <div className={styles.summaryRight}>
                <div className={styles.grandTotalLabel}>Grand Total</div>
                <div className={styles.grandTotalAmount}>₹{calculateTotal().toFixed(2)}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className={styles.bottomActions}>
          <Button variant="primary" size="large" icon={<Save size={20} />} onClick={handleSubmit}>
            Save Sales Entry
          </Button>
          <Button variant="secondary" size="large" icon={<Printer size={20} />}>
            Print Preview
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Home;