import React, { Component } from 'react';
import { BrowserRouter as Router, Link, Redirect } from 'react-router-dom';
import Connexion from '../Connexion/connexion.jsx';
import Logo from '../../assets/img/fatboar_logo.png';
import './resetpwd.scss';
const API = process.env.REACT_APP_API_URL;

class ForgotenPwd extends Component {
  constructor(props) {
    super(props);
    this.state = {
      reset_pwd: '',
      conf_reset_pwd: '',
      good_confirm: '',
    };

    this.handleUserInput = this.handleUserInput.bind(this);
    this.SubmitReset = this.SubmitReset.bind(this);
  }
  handleUserInput(e) {
    const name = e.target.name;
    const value = e.target.value;
    this.setState({ [name]: value });
    this.setState({ [e.target.name]: e.target.value });
  }

  SubmitReset() {
    let tok = this.props.location.pathname.split('/')[2];
    fetch(`https://api.fatboarrestaurant.com/accounts/resetpassword/${tok}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        password: this.state.reset_pwd,
        confirmpassword: this.state.conf_reset_pwd,
      }),
    })
      .then(results => {
        return results.json();
      })

      .then(data => {
        if (data.success === true) {
          this.setState({ reset_confirm: 'good_confirm' });
          console.log(data);
        } else {
          this.setState({ reset_confirm: 'notgood_confirm' });
          console.log(data);
        }
      });
  }
  render() {
    var { reset_confirm } = this.state;
    return (
      <div id="conf-reset">
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
          <div class="nav-btn">
            <label for="nav-check">
              <span></span>
              <span></span>
              <span></span>
            </label>
          </div>
          {
            <Router>
              {' '}
              <Connexion />{' '}
            </Router>
          }
        </nav>
        <section className="conf_pwd_box single-account-info">
          <h2>
            <i>Rénitialisation du mot de passe</i>
          </h2>
          <div className="fatb-inpu-border reset_pwd_box">
            <label htmlFor=""> Nouveau mot de passe </label>
            <input
              type="password"
              placeholder="Entrez votre nouveau mot de passe"
              name="reset_pwd"
              onChange={this.handleUserInput}
            />
            <span className="focus-border"></span>
          </div>
          <div className="fatb-inpu-border reset_pwd_box">
            <label htmlFor=""> Confirmation du mot de passe </label>
            <input
              type="password"
              required
              className="form-control fatb-input input-form"
              name="conf_reset_pwd"
              value={this.state.conf_reset_pwd}
              id="conf_reset_pwd"
              onChange={this.handleUserInput}
            />
            <span className="focus-border"></span>
          </div>
          <div className="text-center">
            <button
              class="fatb-btn-cnx fatb-btn-validate btn-validate-reset"
              type="submit"
              name="conf_reset"
              onClick={this.SubmitReset}
            >
              {' '}
              valider{' '}
            </button>
            {reset_confirm === 'good_confirm' ? (
              <Redirect to="/" />
            ) : reset_confirm === 'notgood_confirm' ? (
              <div className="redtext text-center">
                {' '}
                Session expirée ou informations incorrectes ! Veuillez réessayer{' '}
              </div>
            ) : (
              ''
            )}
          </div>
        </section>
      </div>
    );
  }
}
export default ForgotenPwd;
