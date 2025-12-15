import React, { useState } from 'react';
import { Modal, Form, Input, Button, Alert, Descriptions, Result, Space, Typography } from 'antd';
import {
  CalendarOutlined,
  ExclamationCircleOutlined,
  CheckCircleOutlined,
  DatabaseOutlined,
} from '@ant-design/icons';
import axios from 'axios';

const { Text, Title, Paragraph } = Typography;

const CreateYearModal = ({ visible, onClose, onYearCreated }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [creationResults, setCreationResults] = useState(null);

  const handleConfirmAndCreate = async () => {
    try {
      const values = await form.validateFields();

      // Show confirmation modal
      Modal.confirm({
        title: (
          <Space>
            <span>Confirm Year Creation</span>
          </Space>
        ),
        width: 550,
        content: (
          <div style={{ marginTop: 16 }}>
            <Alert
              message="The following will be created:"
              type="info"
              showIcon
              style={{ marginBottom: 16 }}
            />

            <Descriptions column={1} size="small" bordered>
              <Descriptions.Item label="Year Entry">
                <Text strong>{values.year}</Text> in years collection
              </Descriptions.Item>
              <Descriptions.Item label="Kisan Collection">
                <Text code>kisans{values.year.split('-')[0]}</Text>
                <br />
                <Text type="secondary" style={{ fontSize: 12 }}>
                  All kisans copied with balances reset to 0, transactions removed
                </Text>
              </Descriptions.Item>
              <Descriptions.Item label="Purchaser Collection">
                <Text code>purchasers{values.year.split('-')[0]}</Text>
                <br />
                <Text type="secondary" style={{ fontSize: 12 }}>
                  All purchasers copied with balances reset to 0, transactions removed
                </Text>
              </Descriptions.Item>
              <Descriptions.Item label="Inventory Collection">
                <Text code>inventory{values.year.split('-')[0]}</Text>
                <br />
                <Text type="secondary" style={{ fontSize: 12 }}>
                  All items copied with totalWeight and totalBags reset to 0
                </Text>
              </Descriptions.Item>
            </Descriptions>

            <Alert
              message="This process cannot be undone!"
              description="Make sure you want to create this year before proceeding."
              type="error"
              showIcon
              style={{ marginTop: 16 }}
            />
          </div>
        ),
        okText: 'Create Year',
        okType: 'primary',
        cancelText: 'Cancel',
        onOk: () => createYear(values.year),
      });
    } catch (error) {
      // Form validation failed
    }
  };

  const createYear = async yearValue => {
    setLoading(true);
    try {
      const response = await axios.post('/year', { value: yearValue });

      // Store results and show results modal
      setCreationResults({
        year: yearValue,
        stats: response.data.stats,
        collections: response.data.collections,
      });
      setShowResults(true);
      form.resetFields();
    } catch (error) {
      let errorMessage = 'Failed to create year. Please try again.';

      if (error.response?.status === 400) {
        if (error.response?.data?.error === 'Year already exists') {
          errorMessage = `Year ${yearValue} already exists`;
        } else if (error.response?.data?.error) {
          errorMessage = error.response.data.error;
        }
      }

      Modal.error({
        title: 'Year Creation Failed',
        content: errorMessage,
      });

      console.error('Error creating year:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleResultsClose = () => {
    setShowResults(false);
    setCreationResults(null);
    onClose();
    onYearCreated?.();
  };

  const handleCancel = () => {
    form.resetFields();
    onClose();
  };

  return (
    <>
      {/* Create Year Input Modal */}
      <Modal
        title={
          <span style={{ fontSize: 18, fontWeight: 600 }}>
            <CalendarOutlined style={{ marginRight: 8, color: '#1890ff' }} />
            Create New Year
          </span>
        }
        open={visible && !showResults}
        onCancel={handleCancel}
        footer={[
          <Button key="cancel" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" loading={loading} onClick={handleConfirmAndCreate}>
            Next
          </Button>,
        ]}
        width={450}
      >
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item
            label="Year (Academic Format)"
            name="year"
            rules={[
              { required: true, message: 'Please enter a year' },
              {
                pattern: /^\d{4}-\d{2}$/,
                message: 'Please enter year in format: YYYY-YY (e.g., 2025-26)',
              },
            ]}
            tooltip="Enter year in academic format, e.g., 2025-26"
          >
            <Input
              placeholder="e.g., 2025-26"
              prefix={<CalendarOutlined style={{ color: '#bfbfbf' }} />}
              size="large"
            />
          </Form.Item>

          <Alert
            message="What happens next?"
            description="After entering the year, you'll see a confirmation dialog showing exactly what will be created. Review it carefully before proceeding."
            type="info"
            showIcon
            style={{ marginTop: 8 }}
          />
        </Form>
      </Modal>

      {/* Results Modal */}
      <Modal
        open={showResults}
        onCancel={handleResultsClose}
        footer={[
          <Button key="ok" type="primary" onClick={handleResultsClose}>
            OK
          </Button>,
        ]}
        width={600}
        centered
      >
        {creationResults && (
          <Result
            status="success"
            icon={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
            title={
              <Title level={3} style={{ marginBottom: 8 }}>
                Year {creationResults.year} Created Successfully!
              </Title>
            }
            subTitle="All collections have been created and data has been migrated"
            extra={
              <div style={{ textAlign: 'left', marginTop: 24 }}>
                <Title level={5} style={{ marginBottom: 16 }}>
                  <DatabaseOutlined style={{ marginRight: 8, color: '#1890ff' }} />
                  Collections Created:
                </Title>

                <Descriptions bordered column={1} size="small">
                  <Descriptions.Item label="Kisans Collection">
                    <Text code>{creationResults.collections.kisans}</Text>
                    <br />
                    <Text type="success" strong>
                      {creationResults.stats.kisansCopied}
                    </Text>
                    <Text type="secondary"> records created</Text>
                  </Descriptions.Item>
                  <Descriptions.Item label="Purchasers Collection">
                    <Text code>{creationResults.collections.purchasers}</Text>
                    <br />
                    <Text type="success" strong>
                      {creationResults.stats.purchasersCopied}
                    </Text>
                    <Text type="secondary"> records created</Text>
                  </Descriptions.Item>
                  <Descriptions.Item label="Inventory Collection">
                    <Text code>{creationResults.collections.inventory}</Text>
                    <br />
                    <Text type="success" strong>
                      {creationResults.stats.inventoriesCopied}
                    </Text>
                    <Text type="secondary"> items created</Text>
                  </Descriptions.Item>
                </Descriptions>

                <Alert
                  message="All balances have been reset to zero and transactions removed"
                  type="success"
                  showIcon
                  style={{ marginTop: 16 }}
                />
              </div>
            }
          />
        )}
      </Modal>
    </>
  );
};

export default CreateYearModal;
