import React from 'react';
import {ProtectedRoute} from 'shared/components';
import {Redirect, Route, Switch} from 'react-router-dom';
import {withAuth} from '@8base/app-provider';

/* Import UI Components */
import {NavBar} from '../components';

/* Import Route Components */
import {Home} from './home';
import {Profile} from './profile';
import {AuthCallback} from './auth';
import {NewTaskForm} from "./NewTaskForm";
import {useQuery} from "@apollo/react-hooks";

const Router = (props) => {
  const {auth: {isAuthorized}} = props;

  let routes = (
    <Switch>
      <Route exact path="/" component={Home}/>
      <Route exact path="/new" component={NewTaskForm}/>
      <ProtectedRoute exact path="/profile" component={Profile}/>
      <Redirect to="/"/>
    </Switch>
  );

  if (!isAuthorized)
    routes = (
      <Switch>
        <Redirect to={"/auth"}/>
      </Switch>
    );
  return (
    <Switch>
      <Route path="/auth" component={AuthCallback}/>
      <Route>
        <div>
          <NavBar/>
          <hr/>
          <div>
            {routes}
          </div>
        </div>
      </Route>
    </Switch>
  );
};

const _Router = withAuth(Router);
export default _Router;
