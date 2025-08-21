import React from 'react';
import styles from './select.module.scss';

const Select = ({ 
  label, 
  options = [], 
  error, 
  required = false, 
  placeholder = 'Select option',
  className = '',
  ...props 
}) => {
  const selectClasses = [
    styles.select,
    error && styles.error,
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={styles.selectGroup}>
      {label && (
        <label className={styles.label}>
          {label}
          {required && <span className={styles.required}>*</span>}
        </label>
      )}
      <div className={styles.selectWrapper}>
        <select className={selectClasses} {...props}>
          <option value="">{placeholder}</option>
          {options.map((option, index) => (
            <option key={index} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      {error && <span className={styles.errorMessage}>{error}</span>}
    </div>
  );
};

export default Select;