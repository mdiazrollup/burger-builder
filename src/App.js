import React, { useEffect , Suspense} from 'react';
import Layout from './hoc/Layout/Layout';
import BurgerBuilder from './containers/BurgerBuilder/BurgerBuilder';
import {Route, Switch, withRouter, Redirect} from 'react-router-dom';
import Logout from './containers/Auth/Logout/Logout';
import {connect} from 'react-redux';
import * as actions from './store/actions/index';

const Checkout = React.lazy(() => {
  return  import('./containers/Checkout/Checkout')
});

const Orders = React.lazy(() => {
  return  import('./containers/Orders/Orders')
});

const Auth = React.lazy(() => {
  return  import('./containers/Auth/Auth')
});

const app = props => {
  const {onTryAutoSignup} = props;

  useEffect(() => {
    onTryAutoSignup();
  }, [onTryAutoSignup]); //Only when mount if []. if not when variable change

    let routes = (
      <Switch>
        <Route path="/auth" render={(props) => <Auth {...props}/>}></Route>
         <Route path="/" exact component={BurgerBuilder}></Route>
         <Redirect to="/"/>
      </Switch>
    );

    if(props.isAuthenticated) {
      routes = (
        <Switch>
            <Route path="/checkout" render={(props) => <Checkout {...props}/>}></Route>
            <Route path="/orders" render={(props) => <Orders {...props}/>}></Route>
            <Route path="/logout" component={Logout}></Route>
            <Route path="/auth" render={(props) => <Auth {...props}/>}></Route>
            <Route path="/" exact component={BurgerBuilder}></Route>
            <Redirect to="/"/>
        </Switch>
      );
    }

    return (
      <div>
        <Layout>
          <Suspense fallback={<p>Loading...</p>}>{routes}</Suspense>
        </Layout>
      </div>
    );
}

const mapStateToProps = state => {
  return {
    isAuthenticated: state.auth.token !== null
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onTryAutoSignup: () => dispatch(actions.authCheckState())
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(app));
