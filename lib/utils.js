import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const formatCurrency = (amount, currency = 'VND') => {
  if (!amount && amount !== 0) return '0';
  
  if (currency === 'VND') {
    return new Intl.NumberFormat('vi-VN').format(amount);
  }
  
  // If currency is empty string or falsy, just format as number
  if (!currency || currency === '') {
    return new Intl.NumberFormat('vi-VN').format(amount);
  }
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount);
};

export const formatNumber = (number) => {
  return new Intl.NumberFormat().format(number);
};

export const generateTransactionId = () => {
  return 'TXN' + Date.now() + Math.random().toString(36).substr(2, 9).toUpperCase();
};

export const validateTikTokId = (tiktokId) => {
  // TikTok ID validation: alphanumeric, dots, underscores, 1-24 characters
  const regex = /^[a-zA-Z0-9_.]{1,24}$/;
  return regex.test(tiktokId);
};

export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export const validateUsername = (username) => {
  // Username: alphanumeric and underscores, 3-30 characters
  const regex = /^[a-zA-Z0-9_]{3,30}$/;
  return regex.test(username);
};

export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
      document.body.removeChild(textArea);
      return true;
    } catch (err) {
      document.body.removeChild(textArea);
      return false;
    }
  }
};
