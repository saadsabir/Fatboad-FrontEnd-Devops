import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch} from "react-router-dom";
import Body from './components/body/body.jsx';
import Tickets from './components/Ticket/tickets.jsx';
import Accounts from './components/Admin/accounts.jsx';
import Account from './components/Admin/account.jsx';
import AdminGains from './components/Gains/adminGains.jsx';
import NotFoundPage from './components/NotFoundPage/404.jsx';
import ResetPwd from './components/Resetpwd/resetpwd.jsx';
import CGU from './components/CGU/cgu.jsx';
import Cookies from './components/Cookies/cookies.jsx';
import Stats from './components/Admin/Stats/stats.jsx';
import './App.scss';

class App extends Component {
    render() {
        return (
            <Router>  
                <Switch>
                    <Route exact path="/" component={Body} />
                    <Route path="/accounts" component={Accounts} />
                    <Route path="/account" component={Account} />
                    <Route path="/tickets" component={Tickets} />
                    <Route path="/gains" component={AdminGains} />
                    <Route path="/resetpassword/*" component={ResetPwd} />
                    <Route path="/cgu" component={CGU} />
                    <Route path="/cookies" component={Cookies} />
                    <Route path="/stats" component={Stats} />
                    <Route path="*" component={NotFoundPage} />
                </Switch>
            </Router>
        );
    }
}
export default App;
