import React, {useEffect, useState} from "react";
import {fetchPatientFromBahmniWithHealthId, getHealthIdStatus} from '../../api/hipServiceApi';
import '../verifyHealthId/verifyHealthId.scss';

const CheckIdentifierExists = (props) => {
    const [matchingPatientFound, setMatchingPatientFound] = useState(false);
    const [matchingpatientUuid, setMatchingPatientUuid] = useState('');
    const [healthIdIsVoided, setHealthIdIsVoided] = useState(false);
    const [errorHealthId, setErrorHealthId] = useState('');
    const [showError, setShowError] = useState(false);

    async function checkIfAlreadyExistingIdentifier(id) {
        if(props.setABHAAlreadyExists !== undefined)
            props?.setABHAAlreadyExists(false);
        if (id !== '') {
            setHealthIdIsVoided(false);
            setMatchingPatientFound(false);
            setMatchingPatientUuid('');
            const matchingPatientId = await fetchPatientFromBahmniWithHealthId(id);
            if (matchingPatientId.Error === undefined && matchingPatientId.error === undefined) {
                const healthIdStatus = await getHealthIdStatus(matchingPatientId);
                if (healthIdStatus) {
                    setHealthIdIsVoided(healthIdStatus);
                }
                else {
                    setMatchingPatientFound(true);
                    setMatchingPatientUuid(matchingPatientId);
                }
                if(props.setABHAAlreadyExists !== undefined)
                    props?.setABHAAlreadyExists(true);
            }
            else {
                if (matchingPatientId.Error !== undefined) {
                    setShowError(true)
                    setErrorHealthId(matchingPatientId.Error.message);
                }
            }
        }
    }

    useEffect(async () => {
        await checkIfAlreadyExistingIdentifier(props.id);
    },[props.id])

    function redirectToPatientDashboard() {
        window.parent.postMessage({"patientUuid" : matchingpatientUuid}, "*");
    }


    return (
        <div>
            {matchingPatientFound && <div className="patient-existed" onClick={redirectToPatientDashboard}>
                Matching record with Health ID/PHR Address found
            </div>}
            {healthIdIsVoided && <div className="id-deactivated">
                Health ID is deactivated
            </div>}
            {showError && <h6 className="error">{errorHealthId}</h6>}
        </div>
    );
}

export default CheckIdentifierExists;