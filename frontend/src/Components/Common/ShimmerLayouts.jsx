import React from 'react';
import { Card, Row, Col } from 'antd';
import Shimmer from './Shimmer';

/**
 * Dashboard Shimmer Layout
 * Mimics the dashboard structure with statistics cards and charts
 */
export const DashboardShimmer = () => (
  <div style={{ padding: '24px', paddingBottom: '40px' }}>
    {/* Header Section */}
    <div style={{ textAlign: 'center', marginBottom: '32px' }}>
      <Shimmer width={200} height={16} style={{ margin: '0 auto 8px' }} />
      <Shimmer width={300} height={32} style={{ margin: '0 auto' }} />
    </div>

    {/* Statistics Cards */}
    <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
      {[1, 2, 3, 4].map(i => (
        <Col xs={24} sm={12} lg={6} key={i}>
          <Card
            style={{
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              border: '1px solid #f0f0f0',
            }}
          >
            <Shimmer width="60%" height={14} style={{ marginBottom: '8px' }} />
            <Shimmer width="80%" height={28} />
          </Card>
        </Col>
      ))}
    </Row>

    {/* Charts Section */}
    <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
      {[1, 2, 3].map(i => (
        <Col xs={24} lg={8} key={i}>
          <Card
            style={{
              height: '320px',
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              border: '1px solid #f0f0f0',
            }}
            bodyStyle={{ height: 'calc(100% - 57px)', padding: '16px' }}
          >
            <Shimmer width="40%" height={16} style={{ marginBottom: '16px' }} />
            <Shimmer width="100%" height={200} borderRadius={8} />
          </Card>
        </Col>
      ))}
    </Row>

    {/* Analytics Section */}
    <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
      {[1, 2, 3].map(i => (
        <Col xs={24} lg={8} key={i}>
          <Card
            style={{
              height: '400px',
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              border: '1px solid #f0f0f0',
            }}
            bodyStyle={{ height: '100%', padding: '16px' }}
          >
            <Shimmer width="60%" height={16} style={{ marginBottom: '16px' }} />
            <Shimmer width="100%" height={280} borderRadius={8} />
          </Card>
        </Col>
      ))}
    </Row>

    {/* Bottom Analytics Section */}
    <Row gutter={[16, 16]} style={{ marginBottom: '32px' }}>
      {[1, 2].map(i => (
        <Col xs={24} lg={12} key={i}>
          <Card
            style={{
              height: '400px',
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              border: '1px solid #f0f0f0',
            }}
            bodyStyle={{ height: 'calc(100% - 57px)', padding: '16px' }}
          >
            <Shimmer width="50%" height={16} style={{ marginBottom: '16px' }} />
            <Shimmer width="100%" height={300} borderRadius={8} />
          </Card>
        </Col>
      ))}
    </Row>
  </div>
);

/**
 * Table Shimmer Layout
 * Mimics a table with search and action buttons
 */
export const TableShimmer = () => (
  <div style={{ padding: '24px' }}>
    {/* Header with search and buttons */}
    <div
      style={{
        marginBottom: '24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <Shimmer width={300} height={32} borderRadius={6} />
      <div style={{ display: 'flex', gap: '8px' }}>
        <Shimmer width={100} height={32} borderRadius={6} />
        <Shimmer width={120} height={32} borderRadius={6} />
      </div>
    </div>

    {/* Table */}
    <Card style={{ borderRadius: '8px' }}>
      {/* Table Header */}
      <div
        style={{ borderBottom: '1px solid #f0f0f0', padding: '16px', display: 'flex', gap: '16px' }}
      >
        {[1, 2, 3, 4, 5].map(i => (
          <Shimmer key={i} width={`${Math.random() * 40 + 60}px`} height={14} />
        ))}
      </div>

      {/* Table Rows */}
      {[1, 2, 3, 4, 5, 6, 7, 8].map(row => (
        <div
          key={row}
          style={{
            padding: '16px',
            borderBottom: '1px solid #f5f5f5',
            display: 'flex',
            gap: '16px',
          }}
        >
          {[1, 2, 3, 4, 5].map(col => (
            <Shimmer key={col} width={`${Math.random() * 60 + 40}px`} height={16} />
          ))}
        </div>
      ))}
    </Card>

    {/* Pagination */}
    <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'flex-end' }}>
      <Shimmer width={200} height={32} borderRadius={6} />
    </div>
  </div>
);

/**
 * Form Shimmer Layout
 * Mimics a form with input fields and buttons
 */
export const FormShimmer = () => (
  <div style={{ padding: '24px' }}>
    <Card
      style={{
        maxWidth: '600px',
        margin: '0 auto',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      }}
    >
      {/* Form Title */}
      <Shimmer width="60%" height={24} style={{ marginBottom: '24px' }} />

      {/* Form Fields */}
      {[1, 2, 3, 4, 5].map(i => (
        <div key={i} style={{ marginBottom: '24px' }}>
          <Shimmer width="30%" height={14} style={{ marginBottom: '8px' }} />
          <Shimmer width="100%" height={32} borderRadius={6} />
        </div>
      ))}

      {/* Action Buttons */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '32px' }}>
        <Shimmer width={80} height={32} borderRadius={6} />
        <Shimmer width={100} height={32} borderRadius={6} />
      </div>
    </Card>
  </div>
);

/**
 * Detail Page Shimmer Layout
 * Mimics a detail page with summary cards and content sections
 */
export const DetailPageShimmer = () => (
  <div style={{ padding: '24px' }}>
    {/* Page Header */}
    <div style={{ marginBottom: '24px' }}>
      <Shimmer width="40%" height={28} style={{ marginBottom: '8px' }} />
      <Shimmer width="60%" height={16} />
    </div>

    {/* Summary Cards */}
    <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
      {[1, 2, 3, 4].map(i => (
        <Col xs={24} sm={12} lg={6} key={i}>
          <Card style={{ textAlign: 'center' }}>
            <Shimmer
              width="70%"
              height={14}
              style={{ marginBottom: '8px', margin: '0 auto 8px' }}
            />
            <Shimmer width="50%" height={24} style={{ margin: '0 auto' }} />
          </Card>
        </Col>
      ))}
    </Row>

    {/* Content Sections */}
    <Row gutter={[16, 16]}>
      <Col xs={24} lg={16}>
        <Card title={<Shimmer width="30%" height={16} />} style={{ marginBottom: '16px' }}>
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} style={{ marginBottom: '16px' }}>
              <Shimmer width="100%" height={16} />
            </div>
          ))}
        </Card>
      </Col>
      <Col xs={24} lg={8}>
        <Card title={<Shimmer width="40%" height={16} />}>
          {[1, 2, 3].map(i => (
            <div key={i} style={{ marginBottom: '16px' }}>
              <Shimmer width={`${Math.random() * 40 + 60}%`} height={14} />
            </div>
          ))}
        </Card>
      </Col>
    </Row>
  </div>
);

/**
 * Simple Shimmer Layout
 * Basic shimmer for simple loading states
 */
export const SimpleShimmer = ({ height = '400px' }) => (
  <div
    style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: height,
      padding: '24px',
      width: '100%',
    }}
  >
    <div style={{ width: '100%' }}>
      {[1, 2, 3, 4, 5].map(i => (
        <Shimmer key={i} width="100%" height={16} style={{ marginBottom: '12px' }} />
      ))}
    </div>
  </div>
);
