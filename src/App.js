import './App.css';
import React, {useEffect} from "react";
import VerifyHealthId from './components/verifyHealthId/verifyHealthId';
import './ndhm.scss';
import PatientQueue from './components/patient-queue/patientQueue';
import VerifyAadhaar from "./components/creation/verifyAadhaar";
import {fetchGlobalProperty} from './api/hipServiceApi';
import {cmSuffixProperty} from '../src/api/constants';


function App() {
    const params = Object.fromEntries(
    new URLSearchParams(window.location.search)
  );

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetchGlobalProperty(cmSuffixProperty)
      if(response.Error === undefined ){
         localStorage.setItem(cmSuffixProperty, response)
      }
    }
    fetchData();
  },[])

  switch (params['action']) {
    case "patientQueue":
      return (
          <PatientQueue />
      );
    case "createABHA":
      return (
          <VerifyAadhaar />
      );
    default:
      return (
          <VerifyHealthId />
      );
  }

}

export default App;
