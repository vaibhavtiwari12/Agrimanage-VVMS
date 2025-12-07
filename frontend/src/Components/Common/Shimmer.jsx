import React from 'react';
import './Shimmer.css';

/**
 * Shimmer Loading Component
 *
 * A reusable shimmer effect component for showing loading states
 *
 * @param {string|number} width - Width of the shimmer element (default: '100%')
 * @param {string|number} height - Height of the shimmer element (default: 16)
 * @param {object} style - Additional inline styles to apply
 * @param {string} className - Additional CSS classes to apply
 * @param {number} borderRadius - Border radius for the shimmer element (default: 4)
 */
const Shimmer = ({ width = '100%', height = 16, style = {}, className = '', borderRadius = 4 }) => (
  <span
    className={`shimmer-effect ${className}`}
    style={{
      display: 'inline-block',
      width,
      height,
      borderRadius,
      ...style,
    }}
  />
);

export default Shimmer;
