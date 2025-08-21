import React from 'react';
import styles from './input.module.scss';

const Input = ({ 
  label, 
  error, 
  required = false, 
  icon, 
  className = '', 
  type = 'text',
  ...props 
}) => {
  const inputClasses = [
    styles.input,
    error && styles.error,
    icon && styles.hasIcon,
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={styles.inputGroup}>
      {label && (
        <label className={styles.label}>
          {label}
          {required && <span className={styles.required}>*</span>}
        </label>
      )}
      <div className={styles.inputWrapper}>
        {icon && <span className={styles.icon}>{icon}</span>}
        <input
          type={type}
          className={inputClasses}
          {...props}
        />
      </div>
      {error && <span className={styles.errorMessage}>{error}</span>}
    </div>
  );
};

export default Input;
