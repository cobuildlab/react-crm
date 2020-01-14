import React from 'react';
import {useQuery, useMutation} from "@apollo/react-hooks";
import gql from "graphql-tag";
import {OPPORTUNITIES_LIST_QUERY, OPPORTUNITY_UPDATE_MUTATION} from "../queries";

const USER_QUERY = gql`
    {
        user{
            id
            email
        }
    }
`;




const Opportunity = ({user}) => {
  const [success, setSuccess] = React.useState(false);
  const {data, loading, refetch} = useQuery(OPPORTUNITIES_LIST_QUERY, {fetchPolicy: "network-only"});
  const [updateTask] = useMutation(OPPORTUNITY_UPDATE_MUTATION);

  if (!user || loading)
    return null;

  const markDone = async (e, taskId) => {
    console.log(`DEBUG:markDone:`, e, taskId);
    e.preventDefault();
    const variables = {
      data: {
        id: taskId,
        done: true,
        doneDate: new Date()
      }
    };
    try {
      await updateTask({variables});
    } catch (e) {
      console.log(`ERROR:`, e);
    }
    setSuccess(true);
    refetch();
  };

  const hide = async (e, taskId) => {
    console.log(`DEBUG:markDone:`, e, taskId);
    e.preventDefault();
    const variables = {
      data: {
        id: taskId,
        hide: true
      }
    };
    try {
      await updateTask({variables});
    } catch (e) {
      console.log(`ERROR:`, e);
    }
    setSuccess(true);
    refetch();
  };

  console.log(`DEBUG:`, data.opportunitiesList);

  const {opportunitiesList: {items}} = data;

  return (
    <>
      {/*{success && <p>Task UPDATED!</p>}*/}
      <table>
        <thead>
        <tr>
          <td>#</td>
          <td>NAME</td>
          <td>ADDRESS</td>
          <td>PHONE NUMBER</td>
          <td>Created At</td>
          <td>Options</td>
        </tr>
        </thead>
        <tbody>
        {items.map((opp, i) => {
          return (
            <tr key={i}>
              <td>{i + 1}</td>
              <td>{opp.name}</td>
              <td>{opp.address}</td>
              <td>{opp.phoneNumber}</td>
              <td>
                {opp.createdAt}
              </td>
              <td>OPTIONS</td>
            </tr>
          )
        })}
        </tbody>
      </table>
    </>
  );
};

const Home = () => {
  const {data, loading} = useQuery(USER_QUERY);
  if (loading === true)
    return <div className={'loading'}>Loading...</div>;

  const {user} = data;
  return (
    <div>
      <h1>Opportunities!</h1>
      <Opportunity user={user}/>
    </div>
  );
};

export {Home};
