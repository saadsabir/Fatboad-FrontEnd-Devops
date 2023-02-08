import React, { Component } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Logo from '../../assets/img/fatboar_logo.png';
import './header.scss';
const API = process.env.REACT_APP_API_URL;

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      logout: false,
      role: '',
    };
    this.logout = this.logout.bind(this);
  }
  logout(event) {
    event.preventDefault();
    window.location.href = '/';
    localStorage.clear();
    this.setState({ logout: true });
    var domain = domain || document.domain;
    var path = path || '/';
    document.cookie =
      'token' +
      '=; expires=' +
      new Date() +
      '; domain=' +
      domain +
      '; path=' +
      path;
  }
  componentDidMount() {
    var head;
    var payload ;
    var signature;
    var tok;
    if(localStorage.getItem('payload')){
          head =  localStorage.getItem('head');
          payload =  localStorage.getItem('payload');
          signature =  localStorage.getItem('signature');
          tok = head + '.' + payload + '.' + signature;
    }else{
          head =  localStorage.getItem('auth_head');
          payload =  localStorage.getItem('auth_payload');
          signature =  localStorage.getItem('auth_signature');
          tok = head + '.' + payload + '.' + signature;
          tok = tok.substr(6);
    }

    fetch(`https://api.fatboarrestaurant.com/accounts/getrolebytoken`, {
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
        Accept: 'application/json',
        authorization: `Bearer ${tok}`,
      },
    })
      .then(results => {
        return results.json();
      })
      .then(data => {
        if (data.success === true) {
          var therole = data.result;
          if (therole === 'admin' || therole === 'serveur') {
            this.setState({ role: 'admin' });
          } else this.setState({ role: 'user' });
        }
      });
  }
  render() {
    var { role } = this.state;
    return (
      <Router>
        {role === 'admin' ? (
          <header>
            <nav className="nav">
              <input type="checkbox" id="nav-check" />
              <div className="nav-header">
                <a className="nav-title" href="/">
                  <img
                    className="logo-header"
                    alt="logo"
                    src={Logo}
                    title="logo fatbor header admin"
                  />
                </a>
              </div>
              <div className="nav-btn">
                <label htmlFor="nav-check">
                  <span></span>
                  <span></span>
                  <span></span>
                </label>
              </div>
              <div className="nav-links">
                <a href="/accounts" className="admin-nav-link">
                  Les comptes
                </a>
                <a href="/tickets" className="admin-nav-link">
                  Les tickets
                </a>
                <a href="/gains" className="admin-nav-link">
                  Les gains
                </a>
                <a href="/stats" className="admin-nav-link">
                  Les stats
                </a>
                <a href="/" onClick={this.logout} className="admin-nav-link">
                  Se déconnecter
                </a>
              </div>
            </nav>
          </header>
        ) : (
          <header>
            <nav className="nav">
              <input type="checkbox" id="nav-check" />
              <div className="nav-header">
                <a className="nav-title" href="/">
                  <img
                    className="logo-header"
                    alt="logo"
                    src={Logo}
                    title="logo fatboar header user"
                  />
                </a>
              </div>
              <div className="nav-btn">
                <label htmlFor="nav-check">
                  <span></span>
                  <span></span>
                  <span></span>
                </label>
              </div>

              <div className="nav-links">
                <a href="/" className="admin-nav-link">
                  Accueil
                </a>
                <a href="/account" className="admin-nav-link">
                  Mon compte
                </a>
                <a href="/tickets" className="admin-nav-link">
                  Mes tickets
                </a>
                <a href="/gains" className="admin-nav-link">
                  Mes gains
                </a>
                <a href="/" onClick={this.logout} className="admin-nav-link">
                  Se déconnecter
                </a>
              </div>
            </nav>
          </header>
        )}
      </Router>
    );
  }
}
export default Header;
