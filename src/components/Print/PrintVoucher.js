import React from 'react';

const PrintVoucher = ({ header, details, onClose }) => {
  const validDetails = details.filter(row => row.item_code);
  const total = validDetails.reduce((sum, row) => sum + (row.qty * row.rate), 0);

  return (
    <div className="print-modal" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', zIndex: 2000 }}>
      <div className="print-buttons" style={{ position: 'absolute', top: '20px', right: '20px', zIndex: 2001 }}>
        <button onClick={() => window.print()} style={{ padding: '10px 20px', marginRight: '10px', background: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Print</button>
        <button onClick={onClose} style={{ padding: '10px 20px', background: '#6c757d', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Close</button>
      </div>
      
      <div className="print-content" style={{ background: 'white', width: '100%', maxWidth: '210mm', margin: '0 auto', padding: '15px', fontFamily: 'Arial, sans-serif', boxSizing: 'border-box' }}>
        <div style={{ textAlign: 'center', borderBottom: '2px solid #000', paddingBottom: '15px', marginBottom: '20px' }}>
          <h1 style={{ margin: 0, fontSize: '24px' }}>SALES VOUCHER</h1>
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div>
            <div><strong>Voucher No:</strong> {header.vr_no}</div>
            <div><strong>Date:</strong> {new Date(header.vr_date).toLocaleDateString()}</div>
          </div>
          <div>
            <div><strong>Account:</strong> {header.ac_name}</div>
            <div><strong>Status:</strong> {header.status === 'A' ? 'Active' : 'Inactive'}</div>
          </div>
        </div>
        
        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
          <thead>
            <tr style={{ background: '#f0f0f0' }}>
              <th style={{ border: '1px solid #000', padding: '8px' }}>Sr.</th>
              <th style={{ border: '1px solid #000', padding: '8px' }}>Item Code</th>
              <th style={{ border: '1px solid #000', padding: '8px' }}>Item Name</th>
              <th style={{ border: '1px solid #000', padding: '8px' }}>Description</th>
              <th style={{ border: '1px solid #000', padding: '8px' }}>Qty</th>
              <th style={{ border: '1px solid #000', padding: '8px' }}>Rate</th>
              <th style={{ border: '1px solid #000', padding: '8px' }}>Amount</th>
            </tr>
          </thead>
          <tbody>
            {validDetails.map((row, index) => (
              <tr key={index}>
                <td style={{ border: '1px solid #000', padding: '8px', textAlign: 'center' }}>{index + 1}</td>
                <td style={{ border: '1px solid #000', padding: '8px' }}>{row.item_code}</td>
                <td style={{ border: '1px solid #000', padding: '8px' }}>{row.item_name}</td>
                <td style={{ border: '1px solid #000', padding: '8px' }}>{row.description}</td>
                <td style={{ border: '1px solid #000', padding: '8px', textAlign: 'right' }}>{row.qty}</td>
                <td style={{ border: '1px solid #000', padding: '8px', textAlign: 'right' }}>₹{row.rate}</td>
                <td style={{ border: '1px solid #000', padding: '8px', textAlign: 'right' }}>₹{(row.qty * row.rate).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        
        <div style={{ textAlign: 'right', fontSize: '18px', fontWeight: 'bold', marginBottom: '30px' }}>
          Total Amount: ₹{total.toFixed(2)}
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '40px' }}>
          <div></div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ marginBottom: '40px' }}>_____________________</div>
            <div>Authorized Signature</div>
          </div>
        </div>
      </div>
      
      <style>{`
        @media print {
          * { visibility: hidden; }
          .print-content, .print-content * { visibility: visible; }
          .print-buttons { display: none !important; }
          .print-content {
            position: absolute;
            top: 0;
            left: 0;
            width: 100% !important;
            max-width: none !important;
            margin: 0 !important;
            padding: 10mm !important;
            page-break-inside: avoid !important;
            height: auto !important;
            overflow: visible !important;
          }
        }
      `}</style>
    </div>
  );
};

export default PrintVoucher;