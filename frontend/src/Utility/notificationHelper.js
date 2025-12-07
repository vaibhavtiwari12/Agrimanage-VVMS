import React from 'react';
import { notification } from 'antd';

// Helper functions to replace message calls with notification calls
export const notifySuccess = (description, message = 'Success') => {
  notification.success({
    message,
    description,
    duration: 1,
  });
};

export const notifyError = (description, message = 'Error') => {
  notification.error({
    message,
    description,
    duration: 1,
  });
};

export const notifyWarning = (description, message = 'Warning') => {
  notification.warning({
    message,
    description,
    duration: 1,
  });
};

export const notifyInfo = (description, message = 'Information') => {
  notification.info({
    message,
    description,
    duration: 1,
  });
};

// For backwards compatibility, create message-like API
export const messageCompat = {
  success: content => notifySuccess(content),
  error: content => notifyError(content),
  warning: content => notifyWarning(content),
  info: content => notifyInfo(content),
  loading: (content, duration = 0) => {
    const key = `loading_${Date.now()}`;
    notification.info({
      key,
      message: 'Loading',
      description: content,
      duration,
      icon: <span style={{ animation: 'spin 1s linear infinite' }}>⏳</span>,
    });
    // Return a function to hide the loading notification
    return () => notification.destroy(key);
  },
};
