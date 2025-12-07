import * as XLSX from 'xlsx';
import axios from 'axios';
import { message } from 'antd';

export const exportToExcel = (data, filename, sheetName = 'Sheet1') => {
  try {
    // Create workbook and worksheet
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(data);

    // Add the worksheet to the workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

    // Save the file
    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
    const fullFilename = `${filename}_${timestamp}.xlsx`;

    XLSX.writeFile(workbook, fullFilename);

    return { success: true, filename: fullFilename };
  } catch (error) {
    console.error('Error exporting to Excel:', error);
    return { success: false, error: error.message };
  }
};

export const exportKisanDefaulters = async () => {
  let hideLoading;
  try {
    hideLoading = message.loading('Fetching all kisan balance data...', 0);

    const response = await axios.get('/api/all-kisan-defaulters');
    const allKisans = response.data;

    // Hide loading message before showing result
    hideLoading();

    if (!allKisans || allKisans.length === 0) {
      message.success('No kisan data available for export.');
      return;
    }

    const exportData = allKisans.map((kisan, index) => ({
      'S.No': index + 1,
      'Kisan Name': kisan.name,
      'Balance Amount (₹)': kisan.balance,
      'Export Date': new Date().toLocaleDateString('en-IN'),
      'Export Time': new Date().toLocaleTimeString('en-IN'),
    }));

    const result = exportToExcel(exportData, 'All_Kisan_Balance_Report', 'Kisan Balance');

    if (result.success) {
      message.success(`${allKisans.length} kisan records exported successfully!`);
    } else {
      message.error('Failed to create Excel file');
    }

    return result;
  } catch (error) {
    // Ensure loading message is hidden even on error
    if (hideLoading) hideLoading();
    console.error('Error fetching kisan data:', error);
    message.error('Failed to fetch kisan data. Please try again.');
    return { success: false, error: 'Failed to fetch kisan data' };
  }
};
export const exportPurchaserDefaulters = async () => {
  let hideLoading;
  try {
    hideLoading = message.loading('Fetching all purchaser balance data...', 0);

    const response = await axios.get('/api/all-purchaser-defaulters');
    const allPurchasers = response.data;

    // Hide loading message before showing result
    hideLoading();

    if (!allPurchasers || allPurchasers.length === 0) {
      message.success('No purchaser data available for export.');
      return;
    }

    const exportData = allPurchasers.map((purchaser, index) => ({
      'S.No': index + 1,
      'Purchaser Name': purchaser.name,
      'Balance Amount (₹)': purchaser.balance,
      'Export Date': new Date().toLocaleDateString('en-IN'),
      'Export Time': new Date().toLocaleTimeString('en-IN'),
    }));

    const result = exportToExcel(exportData, 'All_Purchaser_Balance_Report', 'Purchaser Balance');

    if (result.success) {
      message.success(`${allPurchasers.length} purchaser records exported successfully!`);
    } else {
      message.error('Failed to create Excel file');
    }

    return result;
  } catch (error) {
    // Ensure loading message is hidden even on error
    if (hideLoading) hideLoading();
    console.error('Error fetching purchaser data:', error);
    message.error('Failed to fetch purchaser data. Please try again.');
    return { success: false, error: 'Failed to fetch purchaser data' };
  }
};
