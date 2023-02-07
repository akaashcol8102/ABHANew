import React, {useState} from "react";
import './creation.scss';
import {cmSuffix} from "../../api/constants";
import Spinner from "../spinner/spinner";
import {createABHAAddress} from "../../api/hipServiceApi";

const CreateABHAAddress = (props) => {
    const [loader, setLoader] = useState(false);
    const [error, setError] = useState('');
    const [newAbhaAddress, setNewAbhaAddress] = [props.newAbhaAddress,props.setNewAbhaAddress];
    const [isPreferred, setIsPreferred]= useState(false);


    function OnChangeHandler(e) {
        setNewAbhaAddress(e.target.value);
        setError('');
    }

    async function onCreate() {
        if (newAbhaAddress === '') {
            setError("ABHA Address cannot be empty")
        } else {
            setLoader(true);
            var response = await createABHAAddress(newAbhaAddress,isPreferred);
            if (response) {
                setLoader(false);
                if (response.data === undefined) {
                    if (response.details !== undefined && response.details.length > 0)
                        setError(response.details[0].message)
                    else
                        setError("An error occurred while processing your request")
                } else {
                    props.setABHAAddressCreated(true);
                }
            }
        }
    }

    function OnClick(){
        setIsPreferred(!isPreferred);
    }

    return (
        <div>
            <div>
                <div className="abha-address" >
                    <label htmlFor="abhaAdddress">Enter new ABHA ADDRESS </label>
                    <div className="abha-adddress-input" >
                        <div className="new-abha-address-input">
                            <input type="text" id="abhaAdddress" name="abhaAdddress" value={newAbhaAddress} onChange={OnChangeHandler} />
                        </div>
                    </div>
                </div>
                <div className="center" >
                    <input type="checkbox" id="preferred" checked={isPreferred} className="checkbox" onChange={OnClick}/> Preferred
                </div>
                <p className="message">Click on the check box to make the above abha-address as a default</p>
                {error !== '' && <h6 className="error">{error}</h6>}
                {loader && <Spinner />}
                <div className="center">
                    <button type="button" className="proceed" onClick={onCreate}>Create</button>
                </div>
            </div>
        </div>
    );
}

export default CreateABHAAddress;