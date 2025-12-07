import { message, notification } from 'antd';

/**
 * Global configuration for Ant Design message and notification components
 * This ensures all toasts appear in the bottom-left corner consistently
 */
export const configureGlobalNotification = () => {
  // Configure message (small toasts) - bottom-left placement
  message.config({
    top: undefined,
    bottom: 24,
    duration: 3,
    maxCount: 3,
    rtl: false,
    prefixCls: 'ant-message',
  });

  // Configure notification (large toasts) - bottom-left placement
  notification.config({
    placement: 'bottomLeft',
    bottom: 24,
    duration: 3,
    maxCount: 3,
    rtl: false,
  });
};
