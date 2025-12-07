import React from 'react';
import { Tooltip } from 'antd';

/**
 * EllipsisText - A reusable component for text truncation with ellipsis and hover tooltip
 *
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Text content to display
 * @param {number} props.maxWidth - Maximum width before truncation (optional)
 * @param {string} props.placement - Tooltip placement (default: 'top')
 * @param {Object} props.style - Additional styles for the text container
 * @param {string} props.className - CSS class name
 * @param {boolean} props.showTooltip - Whether to show tooltip on hover (default: true)
 * @param {string} props.tooltipTitle - Custom tooltip content (defaults to children text)
 * @param {Object} props.tooltipProps - Additional props for Tooltip component
 */
const EllipsisText = ({
  children,
  maxWidth,
  placement = 'top',
  style = {},
  className = '',
  showTooltip = true,
  tooltipTitle,
  tooltipProps = {},
  ...restProps
}) => {
  const textStyle = {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    display: 'inline-block',
    maxWidth: maxWidth || '100%',
    verticalAlign: 'top',
    ...style,
  };

  // Extract text content for tooltip
  const getTextContent = node => {
    if (typeof node === 'string') return node;
    if (typeof node === 'number') return String(node);
    if (React.isValidElement(node) && node.props.children) {
      return getTextContent(node.props.children);
    }
    if (Array.isArray(node)) {
      return node.map(getTextContent).join('');
    }
    return '';
  };

  const textContent = tooltipTitle || getTextContent(children);

  const textElement = (
    <span style={textStyle} className={className} {...restProps}>
      {children}
    </span>
  );

  if (!showTooltip || !textContent) {
    return textElement;
  }

  return (
    <Tooltip title={textContent} placement={placement} mouseEnterDelay={0.5} {...tooltipProps}>
      {textElement}
    </Tooltip>
  );
};

export default EllipsisText;
