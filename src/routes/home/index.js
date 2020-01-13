import React from 'react';
import {useQuery, useMutation} from "@apollo/react-hooks";
import gql from "graphql-tag";

const TASK_LIST_QUERY = gql`
    query TaskQuery($filter: TaskFilter){
        tasksList(filter: $filter){
            count
            items {
                id
                name
                description
                createdAt
                done
                doneDate
            }
        }
    }
`;

const USER_QUERY = gql`
    {
        user{
            id
            email
        }
    }
`;

const TASK_UPDATE_MUTATION = gql`
    mutation($data:TaskUpdateInput!){
        taskUpdate(data:$data){
            id
        }
    }
`;


const Tasks = ({user}) => {
  const [success, setSuccess] = React.useState(false);
  const {data, loading, refetch} = useQuery(TASK_LIST_QUERY, {
    variables: {
      "filter": {
        "assignee": {
          "id": {
            "equals": user ? user.id : null
          }
        },
        hide: {"equals": false}
      }
    }
  });
  const [updateTask] = useMutation(TASK_UPDATE_MUTATION);

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

  const {tasksList: {items}} = data;
  console.log(`DEBUG:`, items);
  return (
    <>
      {success && <p>Task UPDATED!</p>}
      <table>
        <thead>
        <tr>
          <td>NAME</td>
          <td>DESCRIPTION</td>
          <td>Created At</td>
          <td>Done?</td>
          <td>Done Date</td>
          <td>Options</td>
        </tr>
        </thead>
        <tbody>
        {items.map((task, i) => {
          return (
            <tr key={i}>
              <td>{task.name}</td>
              <td>{task.description}</td>
              <td>{task.createdAt}</td>
              <td>{task.done ? 'DONE' : 'NOT DONE'}</td>
              <td>{task.doneDate}</td>
              <td>
                {task.done ?
                  <input type={'button'} value={'HIDE'} onClick={(e) => hide(e, task.id)}/>
                  :
                  <input type={'button'} value={'MARK AS DONE'} onClick={(e) => markDone(e, task.id)}/>
                }
              </td>
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
      <h1>Tasks!</h1>
      <Tasks user={user}/>
    </div>
  );
};

export {Home};
