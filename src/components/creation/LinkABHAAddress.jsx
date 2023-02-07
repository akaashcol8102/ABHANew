import React, {useEffect, useState} from "react";
import './creation.scss';
import PatientDetails from "../patient-details/patientDetails";
import VerifyMobileEmail from "./VerifyMobileEmail";
import CreateABHAAddress from "./CreateABHAAddress";
import {getDate} from "../Common/DateUtil";

const LinkABHAAddress = (props) => {
    const patient = props.patient;
    const [abhaAddress, setAbhaAddress] = useState('');
    const [proceed, setProceed] = useState(false);
    const [mappedPatient, setMappedPatient] = useState({});
    const [link, setLink] = useState(false);
    const [createNewABHA, setcreateNewABHA] = useState(false);
    const [newAbhaAddress, setNewAbhaAddress] = useState('');
    const [abhaAddressCreated, setABHAAddressCreated]= useState(false);

    function onProceed() {
        mapPatient();
        setProceed(true);
    }

    let phrAddressList = patient.phrAddress !== undefined && patient.phrAddress.length > 0 && patient.phrAddress.map((item, i) => {
        return (
            <button onClick={() => setAbhaAddress(patient.phrAddress[i])} className={abhaAddress === item ? "active" : "abha-list"}>{item}</button>
        )
    });

    function getAddressLine(){
        return [patient?.districtName,patient?.stateName,patient?.pincode].filter(e => e !== undefined);
    }

    function mapPatient(){
        var identifier = patient?.phone !== undefined ? [{
            value: patient.phone
        }] : (patient?.mobile !== undefined ? [{
            value: patient.mobile
        }] : undefined);
        var address =  {
            line: getAddressLine().join(', '),
            district: patient?.district,
            state: patient?.state,
            pincode: patient?.pincode
        };
        const ndhm = {
            healthNumber: patient.healthIdNumber,
            id: abhaAddressCreated ? newAbhaAddress : abhaAddress,
            gender: patient.gender,
            name: patient.name,
            isBirthDateEstimated: false,
            dateOfBirth:  patient?.birthdate === undefined  ? getDate(patient) : patient?.birthdate.split('-').reverse().join('-'),
            address: address,
            identifiers: identifier
        };
        setMappedPatient(ndhm);
    }

    function gotoLink(){
        setLink(true);
    }

    function gotoCreate(){
        setcreateNewABHA(true);
    }

    useEffect(() => {
        if(abhaAddressCreated){
            onProceed();
        }
    },[abhaAddressCreated])


    return (
        <div>
            {!createNewABHA && !link && !proceed &&
            <div>
                {patient.new === undefined && patient.phrAddress === undefined &&
                 <p className="note">No Mapped ABHA Address found</p>}
                {patient.phrAddress !== undefined &&
                <div>
                    <div className="choose-abha-address">
                        <div className="abha-list-label">
                            <label htmlFor="abha-address">Choose ABHA-Address from the ABHA Number mapped ABHA
                                Address</label>
                        </div>
                            {phrAddressList}
                    </div>
                    <div className="center">
                        <button type="button" className="proceed" onClick={onProceed}>Proceed</button>
                    </div>
                </div>}
                <div className="left-button">
                    <button type="button" className="proceed" onClick={gotoLink}>Link ABHA Address</button>
                </div>

                <div className="right-button">
                    <button type="button" className="proceed" onClick={gotoCreate}>Create ABHA Address</button>
                </div>
            </div>}
            {!proceed && createNewABHA &&
             <CreateABHAAddress newAbhaAddress={newAbhaAddress} setNewAbhaAddress={setNewAbhaAddress} setABHAAddressCreated={setABHAAddressCreated} />
            }
            {link && <VerifyMobileEmail patient={patient} />}
            {proceed && <PatientDetails ndhmDetails={mappedPatient}/>}
        </div>
    );
}

export default LinkABHAAddress;