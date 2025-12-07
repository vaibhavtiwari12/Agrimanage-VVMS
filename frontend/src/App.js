import React, { lazy, Suspense, useEffect, useState } from 'react';
import { Switch, Route, Redirect, useHistory } from 'react-router-dom';
import AuthenticatedRoute from './Auth/AuthenticatedRoute';
import UnAuthenticatedRoute from './Auth/unAuthenticatedRoute';
import ErrorBoundary from './Components/ErrorBoundary/ErrorBoundary';
import Landing from './Components/Landing/Landing';
import Footer from './Components/Footer/Footer';
import NavBar from './Components/NavBar/NavBar';
import { I18nProvider, LOCALES, getStoredLocale, storeLocale } from './i18n';
import axios from 'axios';
import './App.css';
import EditKisan from './Components/Kisan/EditKisan/EditKisan';
import EditPurchaser from './Components/Purchaser/EditPurchaser';
import YearSelector from './Components/YearSeletor/YearSelector';
import YearContext from './Context/YearContext';
import { setYearChange } from './Utility/utility';
import { Spin } from 'antd';
import { configureGlobalNotification } from './config/messageConfig';

/* import Login from "./Components/Login/Login";
import AddKisan from "./Components/Kisan/AddKisan/AddKisan";
import CreditForm from "./Components/Kisan/KisanDetails/CreditForm";
import Debitform from "./Components/Kisan/KisanDetails/DebitForm";
import Kisandetails from "./Components/Kisan/KisanDetails/KisanDetails";
import KisanLanding from "./Components/Kisan/KisanLanding";
import Report from "./Components/Kisan/Report/Report";
import Advancesettlementform from "./Components/Kisan/KisanDetails/AdvanceSettlementForm";
import InventoryLanding from "./Components/Inventory/InventoryLanding";
import AddInventoryType from "./Components/Inventory/AddInventoryType";
import Purchaserlanding from "./Components/Purchaser/PurchaserLanding";
import AddPurchaser from "./Components/Purchaser/AddPurchaser";
import Purchaserdetails from "./Components/Purchaser/PurchaserDetails";
const NavBar = lazy(()=> import("./Components/NavBar/NavBar"))
const Landing = lazy(()=>import ("./Components/Landing/Landing"));
const Footer = lazy(()=> import("./Components/Footer/Footer"))
import Purchasercreditform from "./Components/Purchaser/PurchaserCreditForm"; */

const Login = lazy(() => import('./Components/Login/Login'));
const AddKisan = lazy(() => import('./Components/Kisan/AddKisan/AddKisan'));
const CreditForm = lazy(() => import('./Components/Kisan/KisanDetails/CreditForm'));
const Debitform = lazy(() => import('./Components/Kisan/KisanDetails/DebitForm'));
const Kisandetails = lazy(() => import('./Components/Kisan/KisanDetails/KisanDetails'));
const KisanLanding = lazy(() => import('./Components/Kisan/KisanLanding'));
const Report = lazy(() => import('./Components/Report/Report'));
const Advancesettlementform = lazy(
  () => import('./Components/Kisan/KisanDetails/AdvanceSettlementForm')
);
const InventoryLanding = lazy(() => import('./Components/Inventory/InventoryLanding'));
const AddInventoryType = lazy(() => import('./Components/Inventory/AddInventoryType'));
const Purchaserlanding = lazy(() => import('./Components/Purchaser/PurchaserLanding'));
const AddPurchaser = lazy(() => import('./Components/Purchaser/AddPurchaser'));
const Purchaserdetails = lazy(() => import('./Components/Purchaser/PurchaserDetails'));
const Purchasercreditform = lazy(() => import('./Components/Purchaser/PurchaserCreditForm'));

function App() {
  const [isAuthenticated, userHasAuthenticated] = useState('INIT');
  const [locale, setLocale] = useState(getStoredLocale());
  const [year, setYear] = useState();
  const [isYearLoading, setIsYearLoading] = useState(true);
  const [yearOptions, setYearOptions] = useState([]);
  const history = useHistory();

  // Configure global notification positioning on app initialization
  useEffect(() => {
    configureGlobalNotification();
  }, []);

  // Load year data when authentication state changes
  useEffect(() => {
    if (isAuthenticated === 'INIT' || isAuthenticated === 'TRUE') {
      loadYearData();
    } else if (isAuthenticated === 'FALSE') {
      clearYearData();
    }
  }, [isAuthenticated]);

  // Handle session validation on route changes
  useEffect(() => {
    let doesHistoryAlreadyLoaded = false;
    const unlisten = history.listen(() => {
      validateSession();
      doesHistoryAlreadyLoaded = true;
    });

    if (!doesHistoryAlreadyLoaded) {
      validateSession();
    }

    return unlisten; // Cleanup listener
  }, [year, isAuthenticated]);

  // Redirect to year selector when conditions are met
  useEffect(() => {
    if (
      isAuthenticated === 'TRUE' &&
      !isYearLoading &&
      year === undefined &&
      yearOptions.length > 0
    ) {
      history.push('/yearSelector');
    }
  }, [isAuthenticated, isYearLoading, year, yearOptions]);

  // Load year options and current year from backend
  const loadYearData = async () => {
    try {
      const [optionsRes, yearRes] = await Promise.all([
        axios.get('/year'),
        axios.get('/api/getYear'),
      ]);

      setYearOptions(optionsRes.data);

      if (yearRes.data && yearRes.data.year) {
        setYear(yearRes.data.year);
      } else {
        setYear(undefined);
      }
    } catch (error) {
      console.error('Error loading year data:', error);
      setYearOptions([]);
      setYear(undefined);
    } finally {
      setIsYearLoading(false);
    }
  };

  // Clear year data when user is not authenticated
  const clearYearData = () => {
    setYear(undefined);
    setYearOptions([]);
    setIsYearLoading(false);
  };

  // Validate user session
  const validateSession = async () => {
    try {
      const sessionDetails = await axios.get('/hasValidSession');
      window.sessionStorage.setItem('userName', sessionDetails.data.User);
      userHasAuthenticated('TRUE');
    } catch (error) {
      window.sessionStorage.removeItem('userName');
      userHasAuthenticated('FALSE');
      setYear(undefined);
    }
  };

  // Handle user logout
  const logout = async () => {
    window.sessionStorage.removeItem('userName');
    await axios.get('/logout');
    setYear(undefined);
    history.push('/Login');
  };

  // Handle language change
  const changelanguage = isLanguageEnglish => {
    const newLocale = isLanguageEnglish ? LOCALES.ENGLISH : LOCALES.HINDI;
    setLocale(newLocale);
    storeLocale(newLocale);
  };

  // Handle year change and update backend
  const yearChangeHandler = async newYear => {
    setYear(newYear);
    try {
      await axios.post('/yearChange', { year: newYear });
    } catch (error) {
      console.error('Error updating year:', error);
    }
  };

  // Render loading spinner
  const renderLoadingSpinner = () => (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        width: '100%',
        height: '100vh',
        paddingTop: '50px',
      }}
    >
      <Spin size="large" tip="Loading..." />
    </div>
  );

  return (
    <React.Fragment>
      <Suspense fallback={renderLoadingSpinner()}>
        <YearContext.Provider
          value={{
            year,
            onSetYear: yearChangeHandler,
            yearOptions,
            isYearLoading,
          }}
        >
          <ErrorBoundary>
            <I18nProvider locale={locale}>
              <div className="app-wrapper">
                <NavBar
                  isAuthenticated={isAuthenticated}
                  logout={logout}
                  changelanguage={changelanguage}
                />
                <div className="AppContent">
                  {/* Only render routes after auth and year are loaded */}
                  {isAuthenticated !== 'INIT' && !isYearLoading ? (
                    <Switch>
                      {/* Home */}
                      <AuthenticatedRoute
                        exact
                        path="/"
                        component={Landing}
                        appProps={{ isAuthenticated, year }}
                      />

                      {/* Year Selector */}
                      <AuthenticatedRoute
                        exact
                        path="/yearSelector"
                        component={YearSelector}
                        appProps={{ isAuthenticated, year, yearOptions }}
                      />

                      {/* Authentication */}
                      <UnAuthenticatedRoute
                        exact
                        path="/Login"
                        component={Login}
                        history={history}
                        appProps={{ isAuthenticated, year }}
                      />

                      {/* Inventory */}
                      <AuthenticatedRoute
                        exact
                        path="/inventory"
                        component={InventoryLanding}
                        appProps={{ isAuthenticated, year }}
                      />
                      <AuthenticatedRoute
                        exact
                        path="/addInventoryType"
                        component={AddInventoryType}
                        appProps={{ isAuthenticated, year }}
                      />

                      {/* Kisan Module */}
                      <AuthenticatedRoute
                        exact
                        path="/kisan"
                        component={KisanLanding}
                        appProps={{ isAuthenticated, year }}
                      />
                      <AuthenticatedRoute
                        exact
                        path="/addKisan"
                        component={AddKisan}
                        appProps={{ isAuthenticated, year }}
                      />
                      <AuthenticatedRoute
                        exact
                        path="/editKisan/:id"
                        component={EditKisan}
                        appProps={{ isAuthenticated, year }}
                      />
                      <AuthenticatedRoute
                        exact
                        path="/kisanDetails/:id"
                        component={Kisandetails}
                        appProps={{ isAuthenticated, year }}
                      />
                      <AuthenticatedRoute
                        exact
                        path="/kisanDebitForm/:id/:type"
                        component={Debitform}
                        appProps={{ isAuthenticated, year }}
                      />
                      <AuthenticatedRoute
                        exact
                        path="/kisanDebitForm/:id/:type/:transactionNumber"
                        component={Debitform}
                        appProps={{ isAuthenticated, year }}
                      />
                      <AuthenticatedRoute
                        exact
                        path="/kisanCreditForm/:id/:type"
                        component={CreditForm}
                        appProps={{ isAuthenticated, year }}
                      />
                      <AuthenticatedRoute
                        exact
                        path="/kisanCreditForm/:id/:type/:transactionNumber"
                        component={CreditForm}
                        appProps={{ isAuthenticated, year }}
                      />
                      <AuthenticatedRoute
                        exact
                        path="/kisanAdvanceSettlement/:id/:type"
                        component={Advancesettlementform}
                        appProps={{ isAuthenticated, year }}
                      />
                      <AuthenticatedRoute
                        exact
                        path="/kisanAdvanceSettlement/:id/:type/:transactionNumber"
                        component={Advancesettlementform}
                        appProps={{ isAuthenticated, year }}
                      />

                      {/* Purchaser Module */}
                      <AuthenticatedRoute
                        exact
                        path="/purchaser"
                        component={Purchaserlanding}
                        appProps={{ isAuthenticated, year }}
                      />
                      <AuthenticatedRoute
                        exact
                        path="/addPurchaser"
                        component={AddPurchaser}
                        appProps={{ isAuthenticated, year }}
                      />
                      <AuthenticatedRoute
                        exact
                        path="/editPurchaser/:id"
                        component={EditPurchaser}
                        appProps={{ isAuthenticated, year }}
                      />
                      <AuthenticatedRoute
                        exact
                        path="/purchaserDetails/:id"
                        component={Purchaserdetails}
                        appProps={{ isAuthenticated, year }}
                      />
                      <AuthenticatedRoute
                        exact
                        path="/purchaserCreditForm/:id/:type"
                        component={Purchasercreditform}
                        appProps={{ isAuthenticated, year }}
                      />
                      <AuthenticatedRoute
                        exact
                        path="/purchaserCreditForm/:id/:type/:transactionNumber"
                        component={Purchasercreditform}
                        appProps={{ isAuthenticated, year }}
                      />

                      {/* Reports */}
                      <AuthenticatedRoute
                        exact
                        path="/Report"
                        component={Report}
                        appProps={{ isAuthenticated, year }}
                      />
                    </Switch>
                  ) : (
                    renderLoadingSpinner()
                  )}
                </div>
                <Footer />
              </div>
            </I18nProvider>
          </ErrorBoundary>
        </YearContext.Provider>
      </Suspense>
    </React.Fragment>
  );
}

export default App;
