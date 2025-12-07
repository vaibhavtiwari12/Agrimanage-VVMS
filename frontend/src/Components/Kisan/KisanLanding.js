import React, { useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import {
  Breadcrumb,
  Button,
  Card,
  Col,
  Row,
  Select,
  Input,
  Table,
  Badge,
  Spin,
  message,
  Pagination,
  Tooltip,
} from 'antd';
import {
  PlusOutlined,
  UsergroupAddOutlined,
  DownloadOutlined,
  TableOutlined,
  AppstoreOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons';
import { getAllKisan } from '../../Utility/utility';
import { FormattedMessage, useIntl } from 'react-intl';
import { TableShimmer } from '../Common';
import axios from 'axios';

const { Option } = Select;

const KisanLanding = () => {
  const intlA = useIntl();
  const history = useHistory();
  const [kisans, setKisans] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState('Name'); // Default: search by name
  const [inventory, setInventory] = useState([]);
  const [itemType, setItemType] = useState('');
  const [filteredKisans, setFilteredKisans] = useState([]);

  // Table sort state
  const [tableSort, setTableSort] = useState({});

  // Pagination state
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);

  // Sort state
  const [sortField, setSortField] = useState();
  const [sortOrder, setSortOrder] = useState();

  // Mobile responsive state
  const [isMobileOrTablet, setIsMobileOrTablet] = useState(window.innerWidth <= 768);
  const [viewMode, setViewMode] = useState(window.innerWidth <= 768 ? 'card' : 'table'); // Default to card on mobile

  // Fetch paginated kisans from backend
  const fetchPaginatedKisans = async (params = {}) => {
    setIsLoading(true);
    try {
      // Build params object, only including defined values
      const requestParams = {
        page: params.page !== undefined ? params.page : page,
        pageSize: params.pageSize !== undefined ? params.pageSize : pageSize,
      };

      // Only add these params if they have values
      const currentSearchTerm = params.searchTerm !== undefined ? params.searchTerm : searchTerm;
      const currentSearchType = params.searchType !== undefined ? params.searchType : searchType;
      const currentItemType = params.itemType !== undefined ? params.itemType : itemType;
      const currentSortField = params.hasOwnProperty('sortField') ? params.sortField : sortField;
      const currentSortOrder = params.hasOwnProperty('sortOrder') ? params.sortOrder : sortOrder;

      if (currentSearchTerm) requestParams.searchTerm = currentSearchTerm;
      if (currentSearchType) requestParams.searchType = currentSearchType;
      if (currentItemType) requestParams.itemType = currentItemType;
      // Only include sort parameters if both sortField and sortOrder have valid values
      if (currentSortField && (currentSortOrder === 1 || currentSortOrder === -1)) {
        requestParams.sortField = currentSortField;
        requestParams.sortOrder = currentSortOrder;
      }

      const { data } = await axios.get('/kisan/get', {
        params: requestParams,
      });
      setKisans(data.kisans);
      setFilteredKisans(data.kisans);
      setTotal(data.total);
    } catch (e) {
      message.error(
        intlA.formatMessage({ id: 'failedToFetchKisans', defaultMessage: 'Failed to fetch kisans' })
      );
    }
    setIsLoading(false);
  };

  // Fetch inventory and initial kisans
  useEffect(() => {
    document.title = 'VVMS - Kisan';
    const fetchData = async () => {
      const inventoryData = await axios.get('/inventory/get');
      if (inventoryData.data.length <= 0) {
        history.push('/inventory');
      } else {
        setInventory(inventoryData.data);
      }
      // Removed fetchPaginatedKisans({ page: 1, pageSize });
    };
    fetchData();
    // eslint-disable-next-line
  }, [history]);

  // Handle window resize for responsive behavior
  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth <= 768;
      setIsMobileOrTablet(isMobile);
      if (!isMobile) {
        setViewMode('table'); // Always use table view on desktop
      } else if (viewMode === 'table') {
        setViewMode('card'); // Switch to card view when moving to mobile
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [viewMode]);

  // Refetch on filter/search/page/pageSize change
  useEffect(() => {
    // Skip search if phone number search type is selected but doesn't have exactly 10 digits
    if (searchType === 'PhoneNumber' && searchTerm && searchTerm.length !== 10) {
      return;
    }

    // Always fetch data. If searchType is set but searchTerm is empty, fetch will return all records
    fetchPaginatedKisans({ page, pageSize });
    // eslint-disable-next-line
  }, [searchTerm, searchType, itemType, page, pageSize]);

  // Reset page to 1 when searchTerm, searchType, or itemType changes
  useEffect(() => {
    setPage(1);
    // eslint-disable-next-line
  }, [searchTerm, searchType, itemType]);

  const handleAddKisanClick = () => {
    history.push('/addKisan');
  };

  const handleItemChange = value => {
    setItemType(value);
    // No client-side filtering here; backend handles filtering
  };

  const handleSearchTermChange = e => {
    setSearchTerm(e.target.value);
  };

  const handleSearchTypeChange = value => {
    setSearchType(value);
    setSearchTerm(''); // Clear search value when search type changes
  };

  // Delete Kisan handler - REMOVED

  // Utility function to export kisans as CSV
  const exportKisansAsCSV = async () => {
    try {
      // Fetch all kisans (no pagination, no filters, but with current sort)
      const { data } = await axios.get('/kisan/get', {
        params: {
          page: 1,
          pageSize: 100000,
          sortField,
          sortOrder,
          searchTerm: searchTerm || undefined,
          searchType: searchType || undefined,
          itemType: itemType || undefined,
        },
      });
      const kisans = data.kisans;
      if (!kisans.length) {
        message.info(
          intlA.formatMessage({ id: 'noKisansToExport', defaultMessage: 'No kisans to export' })
        );
        return;
      }
      // Prepare CSV header and rows
      const header = [
        intlA.formatMessage({ id: 'name', defaultMessage: 'Name' }),
        intlA.formatMessage({ id: 'fatherName', defaultMessage: 'Father Name' }),
        intlA.formatMessage({ id: 'phoneNumberLabel', defaultMessage: 'Phone Number' }),
        intlA.formatMessage({ id: 'address', defaultMessage: 'Address' }),
        intlA.formatMessage({ id: 'commodity', defaultMessage: 'Commodity' }),
        intlA.formatMessage({
          id: 'outstandingAdvanceLabel',
          defaultMessage: 'Outstanding Advance',
        }),
        'Carry Forward Amount',
        'Date',
      ];
      const rows = kisans.map(k => [
        k.name,
        k.fatherName,
        k.phone,
        k.address,
        k.kisanCommodity,
        k.balance,
        k.carryForwardAmount,
        k.date ? new Date(k.date).toLocaleDateString() : '',
      ]);
      const csvContent = [header, ...rows]
        .map(r => r.map(x => `"${(x ?? '').toString().replace(/"/g, '""')}"`).join(','))
        .join('\n');
      // Download
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `kisans_list_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (e) {
      message.error(
        intlA.formatMessage({
          id: 'failedToExportKisans',
          defaultMessage: 'Failed to export kisans',
        })
      );
    }
  };

  // Table columns
  const columns = [
    {
      title: '#',
      dataIndex: 'index',
      key: 'index',
      render: (text, record, idx) => idx + 1,
      width: 50,
    },
    {
      title: intlA.formatMessage({ id: 'kisanName', defaultMessage: 'Name' }),
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => <Link to={`/kisanDetails/${record._id}`}>{record.name}</Link>,
      ellipsis: true,
    },
    {
      title: intlA.formatMessage({ id: 'fatherName', defaultMessage: 'Father Name' }),
      dataIndex: 'fatherName',
      key: 'fatherName',
      ellipsis: true,
    },
    {
      title: intlA.formatMessage({ id: 'commodity', defaultMessage: 'Commodity' }),
      dataIndex: 'kisanCommodity',
      key: 'kisanCommodity',
      render: text => (
        <Badge
          color="#52c41a"
          text={text}
          style={{ background: '#f6ffed', borderRadius: 8, padding: '0 8px' }}
        />
      ),
      width: 100,
    },
    {
      title: intlA.formatMessage({ id: 'phoneNumberLabel', defaultMessage: 'Phone Number' }),
      dataIndex: 'phone',
      key: 'phone',
      ellipsis: true,
    },
    {
      title: intlA.formatMessage({
        id: 'outstandingAdvanceLabel',
        defaultMessage: 'Outstanding Advance',
      }),
      dataIndex: 'balance',
      key: 'balance',
      sorter: true, // Enable remote sorting
      render: (amt, record) => (
        <span style={{ color: amt < 0 ? '#ff4d4f' : '#389e0d', fontWeight: 600 }}>
          {typeof amt === 'number' ? `₹${amt.toLocaleString()}` : '—'}
        </span>
      ),
      width: 150,
    },
    {
      title: intlA.formatMessage({ id: 'status', defaultMessage: 'Status' }),
      dataIndex: 'status',
      key: 'status',
      render: (status, record) =>
        record.balance < 0 ? (
          <Badge
            status="error"
            text={intlA.formatMessage({ id: 'outstanding', defaultMessage: 'Outstanding' })}
          />
        ) : (
          <Badge
            status="success"
            text={intlA.formatMessage({ id: 'clear', defaultMessage: 'Clear' })}
          />
        ),
      width: 110,
    },
  ];

  const handleReset = () => {
    setItemType('');
    setSearchTerm('');
    setSearchType('');
    setFilteredKisans(kisans);
    setPage(1);
    setSortField(undefined);
    setSortOrder(undefined);
    setTableSort({});
    // Fetch data with reset filters
    fetchPaginatedKisans({
      page: 1,
      pageSize,
      searchTerm: '',
      searchType: '',
      itemType: '',
      sortField: undefined,
      sortOrder: undefined,
    });
  };

  // Render card view for mobile
  const renderCardView = () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        width: '100%',
        padding: isMobileOrTablet ? '0' : '0 12px',
      }}
    >
      {filteredKisans.map((kisan, index) => (
        <Card
          key={kisan._id}
          size="small"
          hoverable
          style={{
            width: '100%',
            borderRadius: 12,
            border: '1px solid #d9d9d9',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          }}
          bodyStyle={{ padding: 16, width: '100%' }}
          actions={[
            <Link to={`/kisanDetails/${kisan._id}`} style={{ color: '#1677ff', fontWeight: 500 }}>
              <FormattedMessage id="viewButtonText" defaultMessage="View Details" />
            </Link>,
          ]}
        >
          <Card.Meta
            title={
              <div
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
              >
                <span style={{ color: '#1677ff', fontSize: 16 }}>
                  <Link to={`kisanDetails/${kisan._id}`}>{kisan.name}</Link>
                </span>
                <span style={{ fontSize: 12, color: '#999', fontWeight: 'normal' }}>
                  #{(page - 1) * pageSize + index + 1}
                </span>
              </div>
            }
            description={
              <div style={{ marginTop: 8 }}>
                {/* Father Name */}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ color: '#666', fontSize: 13 }}>
                    <FormattedMessage id="fatherName" defaultMessage="Father Name" />:
                  </span>
                  <span style={{ fontSize: 13, fontWeight: 500 }}>{kisan.fatherName}</span>
                </div>

                {/* Phone Number */}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ color: '#666', fontSize: 13 }}>
                    <FormattedMessage id="phoneNumberLabel" defaultMessage="Phone" />:
                  </span>
                  <span style={{ fontSize: 13, fontWeight: 500 }}>{kisan.phone}</span>
                </div>

                {/* Commodity */}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ color: '#666', fontSize: 13 }}>
                    <FormattedMessage id="commodity" defaultMessage="Commodity" />:
                  </span>
                  <Badge
                    color="#52c41a"
                    text={kisan.kisanCommodity}
                    style={{
                      background: '#f6ffed',
                      borderRadius: 6,
                      padding: '2px 8px',
                      fontSize: 12,
                    }}
                  />
                </div>

                {/* Outstanding Advance */}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ color: '#666', fontSize: 13 }}>
                    <FormattedMessage
                      id="outstandingAdvanceLabel"
                      defaultMessage="Outstanding Advance"
                    />
                    :
                  </span>
                  <span
                    style={{
                      fontSize: 14,
                      fontWeight: 600,
                      color: kisan.balance < 0 ? '#ff4d4f' : '#389e0d',
                    }}
                  >
                    {typeof kisan.balance === 'number' ? `₹${kisan.balance.toLocaleString()}` : '—'}
                  </span>
                </div>

                {/* Status */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginTop: 12,
                  }}
                >
                  <span style={{ color: '#666', fontSize: 13 }}>
                    <FormattedMessage id="status" defaultMessage="Status" />:
                  </span>
                  {kisan.balance < 0 ? (
                    <Badge
                      status="error"
                      text={intlA.formatMessage({
                        id: 'outstanding',
                        defaultMessage: 'Outstanding',
                      })}
                    />
                  ) : (
                    <Badge
                      status="success"
                      text={intlA.formatMessage({ id: 'clear', defaultMessage: 'Clear' })}
                    />
                  )}
                </div>
              </div>
            }
          />
        </Card>
      ))}
    </div>
  );

  return (
    <div
      className="kisan-landing ant-page-bg"
      style={{ minHeight: '100vh', padding: '0 0 32px 0' }}
    >
      <Breadcrumb style={{ margin: '16px 0 0 16px' }}>
        <Breadcrumb.Item>
          <Link to="/">
            <FormattedMessage id="home" defaultMessage="Home" />
          </Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <FormattedMessage id="kisan" defaultMessage="Kisan" />
        </Breadcrumb.Item>
      </Breadcrumb>
      <Card
        style={{
          margin: isMobileOrTablet ? '24px 12px 0 12px' : '24px 24px 0 24px',
          borderRadius: 12,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: '#fff',
        }}
        bodyStyle={{ padding: isMobileOrTablet ? 16 : 24 }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: isMobileOrTablet ? 'flex-start' : 'center',
            justifyContent: 'space-between',
            width: '100%',
            flexDirection: isMobileOrTablet ? 'column' : 'row',
            gap: isMobileOrTablet ? 16 : 0,
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              width: isMobileOrTablet ? '100%' : 'auto',
            }}
          >
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                padding: isMobileOrTablet ? 8 : 12,
                borderRadius: 12,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <UsergroupAddOutlined
                style={{ fontSize: isMobileOrTablet ? 18 : 24, color: '#fff' }}
              />
            </div>
            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontSize: isMobileOrTablet ? 16 : 20,
                  fontWeight: 600,
                  color: '#fff',
                  marginBottom: 4,
                }}
              >
                <FormattedMessage id="kisanLandingTitle" defaultMessage="Kisan Management" />
              </div>
              {!isMobileOrTablet && (
                <div
                  style={{
                    fontSize: 14,
                    color: 'rgba(255, 255, 255, 0.9)',
                  }}
                >
                  <FormattedMessage
                    id="kisanDescription"
                    defaultMessage="Manage farmers and their agricultural activities"
                  />
                </div>
              )}
            </div>
          </div>
          <div
            style={{
              display: 'flex',
              gap: 12,
              width: isMobileOrTablet ? '100%' : 'auto',
              justifyContent: isMobileOrTablet ? 'flex-end' : 'flex-start',
            }}
          >
            <Button
              type="primary"
              icon={<PlusOutlined />}
              size={isMobileOrTablet ? 'middle' : 'large'}
              style={{
                fontWeight: 600,
                borderRadius: 8,
                backgroundColor: '#fff',
                borderColor: '#fff',
                color: '#667eea',
                fontSize: isMobileOrTablet ? 14 : 16,
              }}
              onClick={handleAddKisanClick}
            >
              <FormattedMessage id="addKisanButtonText" defaultMessage="New Kisan" />
            </Button>
          </div>
        </div>
      </Card>

      {/* Filter/Search Controls Card */}
      <Card
        style={{
          margin: isMobileOrTablet ? '24px 12px 0 12px' : '24px 24px 0 24px',
          borderRadius: 12,
        }}
      >
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={8} md={7} lg={6}>
            <div style={{ fontWeight: 500, marginBottom: 4 }}>
              <FormattedMessage id="nameOfTheCommodity" defaultMessage="Name of the Commodity:" />
            </div>
            <Select
              allowClear
              showSearch
              placeholder={intlA.formatMessage({
                id: 'selectTradingType',
                defaultMessage: '-- Select a Commodity --',
              })}
              value={itemType || undefined}
              onChange={handleItemChange}
              style={{ width: '100%' }}
              optionFilterProp="children"
              filterOption={(input, option) =>
                (option?.children ?? '').toLowerCase().includes(input.toLowerCase())
              }
            >
              <Option value="">
                <FormattedMessage id="selectACommodity" defaultMessage="-- Select a Commodity --" />
              </Option>
              {inventory.map(item => (
                <Option key={item._id} value={item.itemName}>
                  {item.itemName}
                </Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} sm={8} md={7} lg={6}>
            <div style={{ fontWeight: 500, marginBottom: 4 }}>
              <FormattedMessage id="searchBy" defaultMessage="Search by:" />
            </div>
            <Select
              value={searchType || undefined}
              onChange={handleSearchTypeChange}
              style={{ width: '100%' }}
              placeholder={intlA.formatMessage({
                id: 'selectSearchType',
                defaultMessage: 'Select search type',
              })}
              allowClear
            >
              <Option value="Name">
                <FormattedMessage id="name" defaultMessage="Name" />
              </Option>
              <Option value="FatherName">
                <FormattedMessage id="fatherName" defaultMessage="Father Name" />
              </Option>
              <Option value="PhoneNumber">
                <FormattedMessage id="phoneNumberLabel" defaultMessage="Phone Number" />
              </Option>
            </Select>
          </Col>
          <Col xs={24} sm={8} md={7} lg={6}>
            <div style={{ fontWeight: 500, marginBottom: 4 }}>
              <FormattedMessage id="searchValue" defaultMessage="Search Value:" />
              {searchType === 'PhoneNumber' && (
                <Tooltip
                  title={intlA.formatMessage({
                    id: 'phoneSearchInfo',
                    defaultMessage:
                      'Phone search will trigger only when exactly 10 digits are entered',
                  })}
                  placement="top"
                >
                  <InfoCircleOutlined style={{ marginLeft: 8, color: '#1890ff', cursor: 'help' }} />
                </Tooltip>
              )}
            </div>
            <Input
              placeholder={
                searchType
                  ? intlA.formatMessage({ id: 'enterValue', defaultMessage: 'Enter value...' })
                  : intlA.formatMessage({
                      id: 'selectSearchByToEnable',
                      defaultMessage: "Select 'Search by' to enable this field",
                    })
              }
              value={searchTerm}
              onChange={handleSearchTermChange}
              allowClear
              disabled={!searchType}
            />
          </Col>
          <Col
            xs={24}
            sm={24}
            md={3}
            lg={3}
            style={{ display: 'flex', alignItems: 'flex-end', height: '100%', marginTop: 24 }}
          >
            <Button style={{ width: '100%' }} onClick={handleReset}>
              <FormattedMessage id="reset" defaultMessage="Reset" />
            </Button>
          </Col>
        </Row>
      </Card>

      {/* Table Card with Heading and Icon */}
      <Card
        style={{
          margin: isMobileOrTablet ? '24px 12px' : '24px',
          borderRadius: 12,
        }}
        title={
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              flexWrap: 'wrap',
            }}
          >
            <UsergroupAddOutlined
              style={{ fontSize: isMobileOrTablet ? 20 : 24, color: '#1677ff' }}
            />
            <span
              style={{
                fontWeight: 700,
                fontSize: isMobileOrTablet ? 16 : 20,
                lineHeight: 1.2,
              }}
            >
              <FormattedMessage id="kisanList" defaultMessage="Kisan List" />
            </span>
          </div>
        }
        extra={
          <Button
            type="link"
            icon={<DownloadOutlined />}
            onClick={exportKisansAsCSV}
            style={{ color: '#1677ff', fontWeight: 600, fontSize: isMobileOrTablet ? 14 : 16 }}
            size={isMobileOrTablet ? 'small' : 'middle'}
          >
            <FormattedMessage id="exportKisansList" defaultMessage="Export Kisans List" />
          </Button>
        }
      >
        {isLoading ? (
          <TableShimmer />
        ) : (
          <>
            {/* Mobile View Toggle - positioned above content */}
            {isMobileOrTablet && (
              <div
                style={{
                  marginBottom: 16,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  padding: '0 8px',
                  gap: 16,
                  width: '100%',
                }}
              >
                {/* View Toggle Buttons - Centered */}
                <Button.Group>
                  <Button
                    type={viewMode === 'table' ? 'primary' : 'default'}
                    icon={<TableOutlined />}
                    onClick={() => setViewMode('table')}
                    size="small"
                  >
                    Table
                  </Button>
                  <Button
                    type={viewMode === 'card' ? 'primary' : 'default'}
                    icon={<AppstoreOutlined />}
                    onClick={() => setViewMode('card')}
                    size="small"
                  >
                    Cards
                  </Button>
                </Button.Group>

                {/* Sort Dropdown - Below the toggle buttons, right aligned */}
                <div
                  style={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'flex-end',
                    paddingRight: 8,
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                    }}
                  >
                    <span style={{ fontSize: 13, color: '#666' }}>
                      <FormattedMessage id="sortBy" defaultMessage="Sort by:" />
                    </span>
                    <Select
                      value={
                        sortField === 'balance' && sortOrder === 1
                          ? 'balance_desc'
                          : sortField === 'balance' && sortOrder === -1
                            ? 'balance_asc'
                            : 'none'
                      }
                      onChange={value => {
                        if (value === 'none') {
                          setSortField(undefined);
                          setSortOrder(undefined);
                          setPage(1);
                          fetchPaginatedKisans({
                            page: 1,
                            pageSize,
                            sortField: undefined,
                            sortOrder: undefined,
                          });
                        } else if (value === 'balance_asc') {
                          setSortField('balance');
                          setSortOrder(-1);
                          setPage(1);
                          fetchPaginatedKisans({
                            page: 1,
                            pageSize,
                            sortField: 'balance',
                            sortOrder: -1,
                          });
                        } else if (value === 'balance_desc') {
                          setSortField('balance');
                          setSortOrder(1);
                          setPage(1);
                          fetchPaginatedKisans({
                            page: 1,
                            pageSize,
                            sortField: 'balance',
                            sortOrder: 1,
                          });
                        }
                      }}
                      style={{ width: 140 }}
                      size="small"
                    >
                      <Option value="none">
                        <FormattedMessage id="defaultSort" defaultMessage="Default" />
                      </Option>
                      <Option value="balance_asc">
                        <FormattedMessage
                          id="advanceLowToHigh"
                          defaultMessage="Advance: Low to High"
                        />
                      </Option>
                      <Option value="balance_desc">
                        <FormattedMessage
                          id="advanceHighToLow"
                          defaultMessage="Advance: High to Low"
                        />
                      </Option>
                    </Select>
                  </div>
                </div>
              </div>
            )}

            {/* Conditional rendering based on view mode and device */}
            {isMobileOrTablet && viewMode === 'card' ? (
              <>
                {renderCardView()}
                {/* Summary row for card view */}
                <div
                  style={{
                    marginTop: 24,
                    padding: 16,
                    background: '#fafafa',
                    borderRadius: 8,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: 8,
                  }}
                >
                  <span style={{ fontWeight: 600 }}>
                    <FormattedMessage id="kisanList" defaultMessage="Kisan List" /> ({total})
                  </span>
                  <span style={{ color: '#888', fontSize: 14 }}>
                    <FormattedMessage
                      id="ofKisans"
                      defaultMessage="{currentPage} of {total} kisans"
                      values={{
                        currentPage: filteredKisans.length,
                        total: total,
                      }}
                    />
                  </span>
                </div>
              </>
            ) : (
              <Table
                dataSource={filteredKisans.map((k, idx) => ({
                  ...k,
                  key: k._id,
                  index: (page - 1) * pageSize + idx + 1,
                }))}
                columns={columns}
                pagination={false}
                bordered
                size="middle"
                scroll={{ x: true }}
                style={{ background: '#fff', borderRadius: 8 }}
                summary={() => (
                  <Table.Summary fixed>
                    <Table.Summary.Row>
                      <Table.Summary.Cell index={0} colSpan={columns.length - 2}>
                        <span style={{ fontWeight: 600 }}>
                          <FormattedMessage id="kisanList" defaultMessage="Kisan List" /> ({total})
                        </span>
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={columns.length - 2} colSpan={2} align="right">
                        <span style={{ color: '#888' }}>
                          <FormattedMessage
                            id="ofKisans"
                            defaultMessage="{currentPage} of {total} kisans"
                            values={{
                              currentPage: filteredKisans.length,
                              total: total,
                            }}
                          />
                        </span>
                      </Table.Summary.Cell>
                    </Table.Summary.Row>
                  </Table.Summary>
                )}
                onChange={(_, __, sorter) => {
                  setTableSort(sorter);
                  if (sorter && sorter.field) {
                    setSortField(sorter.field);
                    setSortOrder(
                      sorter.order === 'ascend' ? 1 : sorter.order === 'descend' ? -1 : undefined
                    );
                    setPage(1);
                    fetchPaginatedKisans({
                      page: 1,
                      pageSize,
                      sortField: sorter.field,
                      sortOrder:
                        sorter.order === 'ascend' ? 1 : sorter.order === 'descend' ? -1 : undefined,
                    });
                  } else {
                    setSortField(undefined);
                    setSortOrder(undefined);
                  }
                }}
                sortDirections={['ascend', 'descend', 'ascend']}
                {...(tableSort && tableSort.columnKey ? { sortOrder: tableSort.order } : {})}
              />
            )}
            {/* Responsive Pagination Section */}
            <Row justify="space-between" align="middle" style={{ marginTop: 16 }} gutter={[16, 16]}>
              <Col xs={24} sm={12} md={8} lg={6}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: isMobileOrTablet ? 'center' : 'flex-start',
                    flexWrap: 'wrap',
                    gap: 8,
                  }}
                >
                  <span style={{ fontSize: isMobileOrTablet ? 14 : 16 }}>
                    <FormattedMessage id="show" defaultMessage="Show" />
                  </span>
                  <Select
                    value={pageSize}
                    onChange={value => {
                      setPageSize(value);
                      setPage(1);
                    }}
                    style={{ width: isMobileOrTablet ? 70 : 80 }}
                    size={isMobileOrTablet ? 'small' : 'middle'}
                  >
                    {[10, 20, 50, 100].map(size => (
                      <Option key={size} value={size}>
                        {size}
                      </Option>
                    ))}
                  </Select>
                  <span style={{ fontSize: isMobileOrTablet ? 14 : 16 }}>
                    <FormattedMessage id="entries" defaultMessage="entries" />
                  </span>
                </div>
              </Col>
              <Col xs={24} sm={12} md={16} lg={18}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: isMobileOrTablet ? 'center' : 'flex-end',
                    width: '100%',
                  }}
                >
                  <Pagination
                    current={page}
                    pageSize={pageSize}
                    total={total}
                    showSizeChanger={false}
                    onChange={p => setPage(p)}
                    size={isMobileOrTablet ? 'small' : 'default'}
                    showQuickJumper={!isMobileOrTablet}
                    showTotal={(total, range) =>
                      !isMobileOrTablet ? (
                        <span style={{ marginRight: 16, color: '#666' }}>
                          {`${range[0]}-${range[1]} of ${total} items`}
                        </span>
                      ) : null
                    }
                    responsive={true}
                  />
                </div>
              </Col>
            </Row>
          </>
        )}
      </Card>
    </div>
  );
};

export default KisanLanding;
