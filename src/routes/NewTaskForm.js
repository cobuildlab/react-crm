import React from 'react';
import {useMutation, useQuery} from "@apollo/react-hooks";
import gql from "graphql-tag";

const TASK_LIST_MUTATION = gql`
    mutation ($data: TaskCreateInput!){
        taskCreate(data:$data){
            id
        }
    }
`;

const USER_LIST_QUERY = gql`
    {
        usersList{
            count
            items {
                id
                firstName
                lastName
                email
            }
        }
    }
`;

const NewTaskForm = () => {
  const [name, setName] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [success, setSuccess] = React.useState(false);
  const [user, setUser] = React.useState(null);

  const [createTask] = useMutation(TASK_LIST_MUTATION);
  const {data, loading} = useQuery(USER_LIST_QUERY);

  const createNewTask = async (e) => {
    e.preventDefault();
    if(!user || !name || !description)
      return alert("Invalid Data!");
    const variables = {
      data: {
        name, description,
        assignee: {connect:{id: user}}
      }
    };
    try {
      await createTask({variables});
    } catch (e) {
      console.log(`ERROR:`, e);
    }
    setSuccess(true);
  };

  if (loading) {
    return <h2>Loading...</h2>
  }

  const {usersList: {items}} = data;

  return (
    <div>
      <h1>New Task</h1>
      <span>{success && 'Task Created'}</span>
      <form>
        <p> Name: <input name={'name'} onChange={(e) => setName(e.target.value)} value={name}/></p>
        <p> Description: <input name={'description'} onChange={(e) => setDescription(e.target.value)}
                                value={description}/></p>
        <p> Assignee:
          <select name={"user"} onChange={(e) => setUser(e.target.value)}>
            <option value={null}>Select a USER</option>
            {items ? items.map((user, i) => {
              return <option value={user.id}
                             key={i}>{user.firstName ? `${user.firstName} ${user.lastName}` : user.email}</option>
            }) : ''}

          </select>
        </p>
        <button onClick={createNewTask}>
          CREATE TASK
        </button>
      </form>
    </div>
  );
};

export {NewTaskForm};
