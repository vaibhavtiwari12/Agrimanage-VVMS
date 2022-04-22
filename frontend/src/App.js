import React, { lazy, Suspense, useEffect, useState } from "react";
import { Switch, Route, Redirect, useHistory } from "react-router-dom";
import AuthenticatedRoute from "./Auth/AuthenticatedRoute";
import UnAuthenticatedRoute from "./Auth/unAuthenticatedRoute";
import ErrorBoundary from "./Components/ErrorBoundary/ErrorBoundary";
import Landing from "./Components/Landing/Landing";
import Footer from "./Components/Footer/Footer";
import NavBar from "./Components/NavBar/NavBar";
import { I18nProvider, LOCALES } from "./i18n";
import axios from "axios";
import "./App.css";
import EditKisan from "./Components/Kisan/EditKisan/EditKisan";
import EditPurchaser from "./Components/Purchaser/EditPurchaser";

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

const Login = lazy(()=> import("./Components/Login/Login"));
const AddKisan = lazy(()=> import("./Components/Kisan/AddKisan/AddKisan"))
const CreditForm = lazy(()=> import("./Components/Kisan/KisanDetails/CreditForm"))
const Debitform = lazy(()=> import("./Components/Kisan/KisanDetails/DebitForm"))
const Kisandetails = lazy(()=> import("./Components/Kisan/KisanDetails/KisanDetails"))
const KisanLanding = lazy(()=> import("./Components/Kisan/KisanLanding"))
const Report = lazy(()=> import("./Components/Report/Report"))
const Advancesettlementform = lazy(()=> import("./Components/Kisan/KisanDetails/AdvanceSettlementForm"))
const InventoryLanding = lazy(()=> import("./Components/Inventory/InventoryLanding"))
const AddInventoryType = lazy(()=> import("./Components/Inventory/AddInventoryType"))
const Purchaserlanding = lazy(()=> import("./Components/Purchaser/PurchaserLanding"))
const AddPurchaser = lazy(()=> import("./Components/Purchaser/AddPurchaser"))
const Purchaserdetails = lazy(()=> import("./Components/Purchaser/PurchaserDetails"))
const Purchasercreditform = lazy(()=> import("./Components/Purchaser/PurchaserCreditForm"))


function App() {
   const [isAuthenticated, userHasAuthenticated] = useState("INIT");
   const [locale, setLocale] = useState(LOCALES.ENGLISH);
   const history = useHistory();
   useEffect(() => {
      let doesHisotoryAlreadyLoaded = false;
      history.listen(() => {
         onLoad();
         doesHisotoryAlreadyLoaded = true;
      });
      if (!doesHisotoryAlreadyLoaded) {
         onLoad();
      }
   }, []);

   async function onLoad() {
      try {
         const sessionDetails = await axios.get("/hasValidSession");
         window.sessionStorage.setItem("userName", sessionDetails.data.User);
         userHasAuthenticated("TRUE");
      } catch (error) {
         window.sessionStorage.removeItem("userName");
         userHasAuthenticated("FALSE");
      }
   }

   const logout = async () => {
      window.sessionStorage.removeItem("userName");
      await axios.get("/logout");
      history.push("/Login");
   };

   const changelanguage = (isLanguageEnglish) => {
      if (isLanguageEnglish) {
         setLocale(LOCALES.ENGLISH);
      } else {
         setLocale(LOCALES.HINDI);
      }
   };

   return (
      <React.Fragment>
         <Suspense fallback={<div className="text-center mt-5">Loading...</div>}>
            <ErrorBoundary>
               <I18nProvider locale={locale}>
                  <NavBar
                     isAuthenticated={isAuthenticated}
                     logout={logout}
                     changelanguage={changelanguage}
                  />
                  <div className="AppContent">
                     <Switch>
                        <AuthenticatedRoute
                           exact
                           path="/"
                           component={Landing}
                           appProps={{ isAuthenticated }}
                        />
                        <UnAuthenticatedRoute
                           exact
                           path="/Login"
                           component={Login}
                           history={history}
                           appProps={{ isAuthenticated }}
                        />
                        <AuthenticatedRoute
                           exact
                           path="/addKisan"
                           component={AddKisan}
                           appProps={{ isAuthenticated }}
                        />
                        <AuthenticatedRoute
                           exact
                           path="/editKisan/:id"
                           component={EditKisan}
                           appProps={{ isAuthenticated }}
                        />
                        <AuthenticatedRoute
                           exact
                           path="/addInventoryType"
                           component={AddInventoryType}
                           appProps={{ isAuthenticated }}
                        />
                        <AuthenticatedRoute
                           exact
                           path="/kisan"
                           component={KisanLanding}
                           appProps={{ isAuthenticated }}
                        />
                        <AuthenticatedRoute
                           exact
                           path="/kisanDetails/:id"
                           component={Kisandetails}
                           appProps={{ isAuthenticated }}
                        />

                        <AuthenticatedRoute
                           exact
                           path="/kisanDebitForm/:id/:type"
                           component={Debitform}
                           appProps={{ isAuthenticated }}
                        />
                        <AuthenticatedRoute
                           exact
                           path="/kisanDebitForm/:id/:type/:transactionNumber"
                           component={Debitform}
                           appProps={{ isAuthenticated }}
                        />
                        <AuthenticatedRoute
                           exact
                           path="/kisanCreditForm/:id/:type"
                           component={CreditForm}
                           appProps={{ isAuthenticated }}
                        />
                        <AuthenticatedRoute
                           exact
                           path="/kisanCreditForm/:id/:type/:transactionNumber"
                           component={CreditForm}
                           appProps={{ isAuthenticated }}
                        />
                        <AuthenticatedRoute
                           exact
                           path="/kisanAdvanceSettlement/:id/:type"
                           component={Advancesettlementform}
                           appProps={{ isAuthenticated }}
                        />
                        <AuthenticatedRoute
                           exact
                           path="/kisanAdvanceSettlement/:id/:type/:transactionNumber"
                           component={Advancesettlementform}
                           appProps={{ isAuthenticated }}
                        />
                        <AuthenticatedRoute
                           exact
                           path="/inventory"
                           component={InventoryLanding}
                           appProps={{ isAuthenticated }}
                        />

                        {/* Purchaser Module */}
                        <AuthenticatedRoute
                           exact
                           path="/purchaser"
                           component={Purchaserlanding}
                           appProps={{ isAuthenticated }}
                        />
                        <AuthenticatedRoute
                           exact
                           path="/addPurchaser"
                           component={AddPurchaser}
                           appProps={{ isAuthenticated }}
                        />
                        <AuthenticatedRoute
                           exact
                           path="/editPurchaser/:id"
                           component={EditPurchaser}
                           appProps={{ isAuthenticated }}
                        />
                        <AuthenticatedRoute
                           exact
                           path="/Report"
                           component={Report}
                           appProps={{ isAuthenticated }}
                        />
                        <AuthenticatedRoute
                           exact
                           path="/purchaserDetails/:id"
                           component={Purchaserdetails}
                           appProps={{ isAuthenticated }}
                        />
                        <AuthenticatedRoute
                           exact
                           path="/purchaserCreditForm/:id/:type"
                           component={Purchasercreditform}
                           appProps={{ isAuthenticated }}
                        />
                        <AuthenticatedRoute
                           exact
                           path="/purchaserCreditForm/:id/:type/:transactionNumber"
                           component={Purchasercreditform}
                           appProps={{ isAuthenticated }}
                        />
                     </Switch>
                  </div>
                  <Footer />
               </I18nProvider>
            </ErrorBoundary>
         </Suspense>
      </React.Fragment>
   );
}

export default App;
