import { LOCALES } from "../locales";
const en = {
  [LOCALES.ENGLISH]: {
    /*common*/
    name: "Name",
    fatherName: "Father Name",
    phone: "Phone Number",
    address: "Address",
    currency: "₹",
    companyName: "Name of the Firm",
    editKisan: "Edit Kisan",
    editPurchaser:"Edit Purchaser",

    /*login Page */
    login: "LOGIN",
    username: "User Name",
    password: "Password",
    signin: "Sign In",
    usernameError: "UserName is required",
    passwordError: "Password is required",

    /*Header*/
    hello: "hello",
    purchaser: "Purchaser",
    kisan: "Kisan",
    report: "Report",
    logout: "Logout",
    inventory: "Inventory",

    /*Home Page*/
    welcomeMsg: "Welcome to the Digital Platform of",
    brandName: "Maharaj Vegetable Company",

    /*Kisan Landing Page*/
    kisanLandingTitle: "Kisan Landing Page",
    addKisanButtonText: "New Kisan",
    searchBy: "Search by",
    searchValue: "Search Value",
    searchButtonText: "Search",
    resetButtonText: "Reset",
    printButtonText: "Print",
    currencyWithBracket:"(₹)",

    /*Add Kisan Page*/
    newKisanDeatils: "Details Of New Kisan",
    nameIsRequired: "Name is required.",
    fatherNameIsRequired: "Father's name is required.",
    phoneIsRequired: "Phone number is required.",
    addressIsRequired: "Phone number is required.",
    addNewKisanButtonText: "Add New kisan",
    addKisanSuccessful: "Kisan has been added successfully",
    editKisanSuccessful: "Kisan has been Edited successfully",
    updateKisanBtnText: "Update Kisan Details",

    /*Kisan Detail Page*/
    kisanDetailsTitle: "Kisan Details",
    carryForwardAmount: "Total Carry Forward Upto Last Bill",
    giveAdvanceKisanButtonText: "Give Advance",
    createBillKisanButtonText: "Create Bill",
    depositAdvanceKisanButtonText: "Advance Settlement",
    transactionDetailsTitle: "Transaction Details",

    /*Table columns Kisan Detail Page*/
    currentBillTableRowSectionText:"Entered Amounts In The Bill (₹)",
    overAllOutstandingTableRowSectionText:"Total Outstanding After Bill (₹)",
    balance: "Outstanding Advance",
    date: "Date",
    comment: "Comment",
    advanceDebited: "Advance Given",
    grossTotalWithCurrency: "Trading Total",
    billTotal: "Bill Total",
    advanceCredited: "Advance Recovered",
    cashPaid: "Cash Paid",
    totalPaymentOfThisBill : "Total Payment Of This Bill",
    carryForwardFromThisBill : "Carry Forward",
    carryForward: "Total Carry Forward",
    actions: "Actions",
    editButtonText: "Edit",
    viewButtonText: "View",
    yesButton: "Yes",
    noButton: "No",
    entryAddSuccessMsg:"Entry Added Successfully...!",
    entryEditSuccessMsg:"Entry Edited Successfully...!",

    /*Debit Entry Form*/
    advanceDetails: "Advance Details",
    createEntryButtonText: "Create Entry",
    amountSBGTZ: "The amount should be greater than 0.",
    amountCNBZ: "The amount is required, 0 not allowed, +ve amd -ve both amounts are allowed.",
    advanceSCNBMTO: "Amount cannot be more than outstanding balance. Max allowed amount =  ₹ ",

    /*Advance Deposit Form*/
    advanceDepositDetails: "Advance Recovery Details",
    balanceTextTillThisWithoutCurrency: "Outstanding advance before this transaction",

    /*Credit Entry Form*/
    billDetails: "Bill Details",
    carryForwardSectionTitle: "Carry Forward Details",
    carryForwardTotal: "Carry Forward Total",
    tradingSectionTitle: "Trading Details",
    selectTradingType: "-- Select a Commodity  --",
    numberOfBags: "Number of Bags",
    totalWeight: "Total Weight (In KGs)",
    ratePerKg: "Rate per KG (₹)",
    grossTotal: "Trading Total (Cost of Commodity) : ₹ ",
    purchaserSectionTitle: "Purchaser Details",
    purchaserName: "Purchaser Name",
    selectPurchaser: "-- Select a Purchaser --",
    deductionsSectionTitle: "Deductions",
    commission: "Commission (In %) :",
    totalCommission: "Total Commission :",
    hammali: "Handling Charges/Hammali (₹) :",
    bhada: "Transportation Charges/Bhada (₹):",
    netTotal: "Bill Total (After Deductions) : ₹ ",
    paymentToSettle: "Payment To Settle",
    paymentSettlementSectionTitle: "Payment Settlement",
    advanceSettlementSectionTitle: "Advance Settlement",
    settlementSectionTitleForPaymentOnly: "Payment Summary",
    billettlementSummarySectionTitle: "Bill Settlement",
    balanceAfterBillTextWithoutCurrency: "Outstanding Advance After Bill (₹)",
    whatAreYouBuyingText: "Name of the Commodity  :",
    Matar: "Matar",
    Tamatar: "Tamatar",
    Dhaniya: "Dhaniya",
    editCreditEntryButtonTitle: "Update Entry",
    billDateSectionTitle: "Bill Date",
    billDateLabel: "Display Date On Bill",
    backDatedBillMsg:"Back Dated Bill",

    /*Credit Entry Form Errors*/
    numberOfBagsCNBLTZ: "Number of Bags cannot be less than 0.",
    totalWeightCNBLTZ: "Total Weight cannot be less than 0.",
    ratePerKgCNBLTZ: "Rate cannot be less than 0.",
    totalCommissionCNBLTZ: "Commission cannot be less than 0.",
    hammaliCNBLTZ: "Handling Charges (Hammali) cannot be less than 0.",
    bhadaCNBLTZ: "Transportation Charges (Bhada) cannot be less than 0.",
    balanceCNBLTZ: "Advance Recovered cannot be less than 0.",
    cashPaidCNBLTZ: "Cash Paid cannot be less than 0.",
    balanceCBMTCB:
      'Advance Recovered cannot be more than the "Amount to Settle". Max allowed amount =  ₹ ',
    balanceCBMTOA:
      'Advance Recovered cannot be more than "Outstanding Advance". Max allowed amount =  ₹ ',
    cashPaidCBMTCB:
      'Cash paid cannot be greater than the "Amount to Settle". Max allowed amount =  ₹  ',
    commentIsRequired: "Comment is required.",
    selectTradingAndPurchaserIsRequired: "If you are selecting any Commodity, It is essential to select a Purchaser.",
    selectingPurchaserIsRequired: "Selecting a Purchaser is required.",
    advanceSettlementAddedSuccessfully:"Advance Settlement Entry been added successfully.",
    advanceSettlementUpdatedSuccessfully:"Advance Settlement Entry has been Edited successfully.",
    kisanHasTxnAfterThisDateMsg: "This kisan has some other transactions recorded after the selected date, Hence your are not allowed to create bill for selected date.",
    purchaserHasTxnAfterThisDateMsg: "Selected Purchaser has some other transactions recorded after the selected date, Hence you are not allowed to create the bill of this kisan with this Purchaser on selected date.",
    actualBillCreationDateMsg: "Created on",
    /* Inventory Langing */
    inventoryLandingTitle: "Inventory",
    addfasalType: "Add Commodity",
    noInventoryForThisItem: "No Inventory is Available for This commodity.",
    transacted: "Transacted ",

    /* Inventory Add Item Type */
    inventoryAddHeading: "Add New Commodity Detail",
    inventory_itemName: "Commodity Name",
    inventory_itemError: "Commodity name is required.",
    inventory_addSuccessful: "Commodity Added Successfully !",

    /* Purchaser Landing Page */
    purchaserLandingTitle: "Purchaser Landing Page",
    addPurchaserButtonText: "Add Purchaser",
    newPurchaserDeatils: "Details Of New Purchaser",

    /*Add Purchaser Form*/
    companyNameIsRequired: "Firm name is required.",
    purchaser_addSuccessful: "Purchaser has been added successfully",
    purchaser_editSuccessful : "Purchaser has been edited successfully",

    /*Purchase Table*/
    nameOfPurchase: "Purchaser Name",
    outstandingPayment: "Total Outstanding Payments (₹)",
    outstandingPaymentADT: "Outstanding Till This Entry  (₹)",

    /*Purchaser Details*/
    purchaserDetailsPageTitle: "Purchaser Details",
    purchaserPaymentEntryButtonText: "Payment Entry",
    purchaseTotal: "Purchase Total (₹)",
    transactionType: "Transaction Type",
    tt_purchase: "Purchase",
    tt_payment: "Payment",
    purchaserPaymentFormTitle: "Payment Details",
    paymentAmount: "Payment Amount",
    negativePaymentPopupHeading: "Negative Amount Alert !",
    negativePaymentPopupContent: "Please confirm if you want to enter amount (₹) = ",

    /*Dashboard Page*/
    totalAdvacePendingWithKisan:"Total kisan Advance Pending (₹)",
    totalPurchaserOutstanding:"Total Purchaser Outstanding (₹)",
    totalItemweight:"Total Item weight (in KGs)",
    totalBagsSoldToday:"Total bags sold today (in Packs)",

  },
};
export default en;
