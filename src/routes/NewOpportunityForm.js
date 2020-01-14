import React from 'react';
import {useMutation} from "@apollo/react-hooks";
import gql from "graphql-tag";
import {useHistory} from 'react-router-dom';

const OPPORTUNITY_CREATE_MUTATION = gql`
    mutation ($data: OpportunityCreateInput!) {
        opportunityCreate (data: $data){
            id
        }
    }
`;

const NewOpportunityForm = () => {
  const [name, setName] = React.useState('');
  const [address, setAddress] = React.useState('');
  const [phoneNumber, setPhoneNumber] = React.useState('');
  const [success, setSuccess] = React.useState(false);
  const history = useHistory();
  const [createOpportunity] = useMutation(OPPORTUNITY_CREATE_MUTATION);

  const createNewOpportunity = async (e) => {
    e.preventDefault();
    if (!address || !name || !phoneNumber)
      return alert("Invalid Data!");
    const variables = {
      data: {name, address, phoneNumber}
    };
    try {
      await createOpportunity({variables});
    } catch (e) {
      console.log(`ERROR:`, e);
    }
    history.push("/");
  };

  return (
    <div>
      <h1>New Opportunity</h1>
      <span>{success && 'Opportunity Created'}</span>
      <form>
        <p> Name: <input name={'name'} onChange={(e) => setName(e.target.value)} value={name}/></p>
        <p> Address: <input name={'address'} onChange={(e) => setAddress(e.target.value)}
                            value={address}/></p>
        <p> Phone Number:
          <input name={'phoneNumber'} onChange={(e) => setPhoneNumber(e.target.value)}
                 value={phoneNumber}/>
        </p>
        <button onClick={createNewOpportunity}>
          CREATE OPPORTUNITY
        </button>
      </form>
    </div>
  );
};

export {NewOpportunityForm};
