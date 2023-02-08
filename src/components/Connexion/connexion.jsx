import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookF } from '@fortawesome/free-brands-svg-icons';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import { FormErrors } from '../form_erros/FormErrors';
import FormValidator from '../form_erros/FormErrorsSub';
import { reject } from 'q';
import './connexion.scss';
const API = process.env.REACT_APP_API_URL;

class Connexion extends Component {
  constructor(props) {
    super(props);
    // Subscribe
    this.validator = new FormValidator([
      {
        field: 'sub_mail',
        method: 'isEmpty',
        validWhen: false,
        message: 'Email requis',
      },
      {
        field: 'sub_mail',
        method: 'isEmail',
        validWhen: true,
        message: "Votre email n'est pas valide",
      },
      {
        field: 'sub_pwd',
        method: 'isEmpty',
        validWhen: false,
        message: 'Mot de passe obligatoire',
      },
      {
        field: 'subConfirm_pwd',
        method: 'isEmpty',
        validWhen: false,
        message: 'Confirmation de mot de passe requise',
      },
      {
        field: 'subConfirm_pwd',
        method: this.passwordMatch,
        validWhen: true,
        message: 'ce champ ne correspond pas au mot de passe',
      },
    ]);

    this.state = {
      // Subscribe
      sub_mail: '',
      sub_pwd: '',
      subConfirm_pwd: '',
      sub_nom: '',
      sub_prenom: '',
      sub_tel: '',
      validation: this.validator.valid(),
      validate_sub: null,
      sub: false,
      show: false,

      // Autentication
      cnx_mail: '',
      cnx_pwd: '',
      items: [],
      errors: {},
      redirection: false,
      logout: false,
      role: '',
      cnx: false,

      formErrors: { cnx_mail: '', cnx_pwd: '' },
      emailValid: false,
      passwordValid: false,
      formValid: false,
      faild: false,
      valide_pwd_forgoten: false,

      checked: false,
      msg: '',
      auth_tok_role: '',
    };

    this.submitted = false;
    this.handleUserInput = this.handleUserInput.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleForgotenPwd = this.handleForgotenPwd.bind(this);

    this.handleFormSubmit = this.handleFormSubmit.bind(this);
    this.logout = this.logout.bind(this);
  }
  handleCheck = e => {
    this.setState({ checked: e.target.checked });
  };

  logout(event) {
    event.preventDefault();
    this.setState({ redirection: false });
    window.location.reload();
    localStorage.clear();
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
  // Subscribe
  handleFormSubmit(event) {
    event.preventDefault();
    this.setState({ msg: 'checked' });
    const validation = this.validator.validate(this.state);
    this.setState({ validation });
    this.submitted = true;
    if (
      this.state.checked === true &&
      validation.subConfirm_pwd.isInvalid === false
    ) {
      fetch(`https://api.fatboarrestaurant.com/accounts/addaccount`, {
        method: 'POST', // 'GET', 'PUT', 'DELETE'
        body: JSON.stringify({
          email: this.state.sub_mail,
          password: this.state.sub_pwd,
          acceptCGU: this.state.checked,
        }),
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
          Accept: 'application/json',
        },
      })
        .then(res => res.json())
        .then(json => {
          if (json.success === true) {
            if (this.state.checked === true) {
              json.result.acceptCGU = true;
            }
            this.setState({ validate_sub: true });
            //If subscribe's good then connect the user
            fetch(`https://api.fatboarrestaurant.com/accounts/connection`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                email: this.state.sub_mail,
                password: this.state.sub_pwd,
              }),
            })
              .then(res => res.json())
              .then(json => {
                this.setState({ items: json.result });
                localStorage.setItem('head', json.result.split('.')[0]);
                localStorage.setItem('payload', json.result.split('.')[1]);
                localStorage.setItem('signature', json.result.split('.')[2]);

                const head = localStorage.getItem('head');
                const payload = localStorage.getItem('payload');
                const signature = localStorage.getItem('signature');
                const tok = head + '.' + payload + '.' + signature;
                localStorage.setItem('letoken', tok);
                if (json.success === true) {
                  this.setState({ redirection: true });
                  const thecnx = true;
                  localStorage.setItem('lacnx', thecnx);

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
                } else {
                  this.setState({ faild: true });
                }
              });
          }
          if (json.success === false) {
            this.setState({ validate_sub: false });
          }
        })
        .then(resultats => this.setState(resultats))
        .catch(error => {
          reject(error);
        });
    } else if (this.state.checked === false) {
      this.setState({ msg: 'notchecked' });
    }
    if (
      validation.subConfirm_pwd.message ===
      'Confirmation de mot de passe requise'
    ) {
      this.setState({ msg: 'subpwd_no' });
    }
  }
  passwordMatch = (confirmation, state) => state.sub_pwd === confirmation;

  handleInputChange = event => {
    event.preventDefault();
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  // Authentication
  componentDidMount() {
    // Get the token when Google/facebook Auth
    var gettokenheader = document.cookie.split('.')[0];
    if(gettokenheader.includes("true")){
      gettokenheader = gettokenheader.substr(20);
    }
    else{
      gettokenheader = gettokenheader.substr(21);
    }
    const auth_head = gettokenheader;
    const auth_payload = document.cookie.split('.')[1];
    const auth_signature = document.cookie.split('.')[2];

    localStorage.setItem('auth_head', auth_head);
    localStorage.setItem('auth_payload', auth_payload);
    localStorage.setItem('auth_signature', auth_signature);

    if (auth_payload) {
      var auth_email = JSON.parse(atob(auth_payload)).account.email;
      var auth_pwd = JSON.parse(atob(auth_payload)).account.password;
      fetch(`https://api.fatboarrestaurant.com/accounts/connection`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: auth_email,
          password: auth_pwd,
        }),
      }).then(res => res.json());
      var auth_role = JSON.parse(atob(auth_payload)).account.role;
      if (auth_role === 'admin' || auth_role === 'serveur') {
        this.setState({ auth_tok_role: 'auth_role_admin' });
      } else if (auth_role === 'user') {
        this.setState({ auth_tok_role: 'auth_role_user' });
      }
    }

    const thecnx = localStorage.getItem('lacnx');
    if (thecnx) {
      const head = localStorage.getItem('head');
      const payload = localStorage.getItem('payload');
      const signature = localStorage.getItem('signature');
      const tok = head + '.' + payload + '.' + signature;
      localStorage.setItem('Detoken', payload);

      var load_role = JSON.parse(atob(payload)).account[0].role;
      if (load_role === 'admin' || load_role === 'serveur') {
        this.setState({ role: 'admin' });
      } else this.setState({ role: 'user' });
      const thetok = localStorage.getItem('letoken');
      if (tok === thetok) {
        this.setState({ redirection: true });
      }
    }
  }
  handleSubmit(event) {
    event.preventDefault();
    fetch(`https://api.fatboarrestaurant.com/accounts/connection`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: this.state.cnx_mail,
        password: this.state.cnx_pwd,
      }),
    })
      .then(res => res.json())
      .then(json => {
        this.setState({ items: json.result });
        localStorage.setItem('head', json.result.split('.')[0]);
        localStorage.setItem('payload', json.result.split('.')[1]);
        localStorage.setItem('signature', json.result.split('.')[2]);

        const head = localStorage.getItem('head');
        const payload = localStorage.getItem('payload');
        const signature = localStorage.getItem('signature');
        const tok = head + '.' + payload + '.' + signature;
        localStorage.setItem('letoken', tok);
        if (json.success === true) {
          window.location.reload();
          this.setState({ redirection: true });
          const thecnx = true;
          localStorage.setItem('lacnx', thecnx);
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
        } else {
          this.setState({ faild: true });
        }
      });
  }
  handleUserInput = e => {
    const name = e.target.name;
    const value = e.target.value;
    this.setState({ [name]: value }, () => {
      this.validateField(name, value);
    });
    this.setState({ [e.target.name]: e.target.value });
  };

  validateField(fieldName, value) {
    let fieldValidationErrors = this.state.formErrors;
    let emailValid = this.state.emailValid;
    let passwordValid = this.state.passwordValid;

    switch (fieldName) {
      case 'cnx_mail':
        emailValid = value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);
        fieldValidationErrors.cnx_mail = emailValid
          ? ''
          : "Votre mail n'est pas valide";
        break;
      case 'cnx_pwd':
        passwordValid = value.length >= 6;
        fieldValidationErrors.cnx_pwd = passwordValid
          ? ''
          : "Votre mot de passe n'est pas valide";
        break;
      default:
        break;
    }
    this.setState(
      {
        formErrors: fieldValidationErrors,
        emailValid: emailValid,
        passwordValid: passwordValid,
      },
      this.validateForm
    );
  }

  validateForm() {
    this.setState({
      formValid: this.state.emailValid && this.state.passwordValid,
    });
  }

  errorClass(error) {
    return error.length === 0 ? '' : 'has-error';
  }
  handleForgotenPwd(event) {
    event.preventDefault();
    fetch(`https://api.fatboarrestaurant.com/accounts/sendforgotpasswordlink`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: this.state.valide_pwd_forgoten,
      }),
    })
      .then(res => res.json())
      .then(json => {
        if (json.success === true) {
          this.setState({ valide_pwd_forgoten: true });
        }
      });
  }
  render() {
    // Subscribe
    var { validate_sub, faild } = this.state;
    let validation = this.submitted // if the form has been submitted at least once
      ? this.validator.validate(this.state) // then check validity every time we render
      : this.state.validation;

    // Authentication
    const {
      errors,
      redirection,
      role,
      valide_pwd_forgoten,
      msg,
      auth_tok_role,
    } = this.state;
    //Auth fb/google
    if (auth_tok_role === 'auth_role_admin') {
      return (
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
      );
    } else if (auth_tok_role === 'auth_role_user') {
      return (
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
      );
    }

    if (redirection === true) {
      if (role === 'admin' || auth_tok_role === 'auth_role_admin') {
        return (
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
        );
      } else if (role === 'user' || auth_tok_role === 'auth_role_user') {
        return (
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
        );
      }
    }
    if (validate_sub === true) {
      return (
        <div className="validate-sub">
          <div className="good-sub alert alert-success">
            Vous vous êtes bien inscrit
          </div>
          <ul className="admin-header-cnx">
            <li className="admin-nav-item">
              <a href="/account" className="admin-nav-link">
                Mon compte
              </a>
            </li>
            <li className="admin-nav-item">
              <a href="/ticket" className="admin-nav-link">
                Mes tickets
              </a>
            </li>
            <li className="admin-nav-item">
              <a href="/ticket" className="admin-nav-link">
                Mes gains
              </a>
            </li>
            <li className="admin-nav-item">
              <a href="/" onClick={this.logout} className="admin-nav-link">
                Se déconnecter
              </a>
            </li>
          </ul>
        </div>
      );
    }
    return (
      <section className="nav-links" id="joinus">
        <div className="header-cnx">
          <button
            className="fatb-btn btn-connexion"
            type="submit"
            name="cnx_btn"
            data-toggle="collapse"
            href="#collapseConnexion"
            aria-expanded="false"
            aria-controls="collapseConnexion"
          >
            Connexion
          </button>

          <button
            className="fatb-btn btn-inscription"
            data-toggle="collapse"
            href="#collapseSubscribe"
            aria-expanded="false"
            aria-controls="collapseSubscribe"
          >
            Inscription{' '}
          </button>
        </div>

        <div className="joinus-block">
          <div
            className="alreadysubscribed-rs rs-box collapse"
            id="collapseConnexion"
          >
            {/* <button type="button" className="cnx-back">
                                    <FontAwesomeIcon icon={faTimes} size="3x" />
                                </button> */}
            <h3>Déjà inscrit ?</h3>
            <p>Connectez-vous :</p>
            <div className="rs-btn">
              <a
                href={`https://api.fatboarrestaurant.com/auth/facebook`}
                rel="noopener noreferrer"
                className="btn facebook"
              >
                <FontAwesomeIcon icon={faFacebookF} />
              </a>
              <a
                href={`https://api.fatboarrestaurant.com/auth/google`}
                rel="noopener noreferrer"
                className="btn google"
              >
                <FontAwesomeIcon icon={faGoogle} />
              </a>
            </div>
            <form
              className="demoForm"
              onSubmit={this.handleSubmit}
              noValidate
              encType="application/x-www-form-urlencoded"
            >
              <div className="alreadysubscribed-input">
                <div
                  className={`alreadysubscribed-field group-input ${this.errorClass(
                    this.state.formErrors.cnx_mail
                  )}`}
                >
                  <label className="fatb-label" htmlFor="cnx_mail">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    className="form-control fatb-input input-form"
                    name="cnx_mail"
                    value={this.state.cnx_mail}
                    id="cnx_mail"
                    onChange={this.handleUserInput}
                    error={errors.cnx_mail}
                  />
                  <div className="fatb-bar"></div>
                </div>
                <div
                  className={`alreadysubscribed-field group-input ${this.errorClass(
                    this.state.formErrors.cnx_pwd
                  )}`}
                >
                  <label className="fatb-label" htmlFor="cnx_pwd">
                    Mot de passe
                  </label>
                  <input
                    type="password"
                    required
                    className="form-control fatb-input input-form"
                    name="cnx_pwd"
                    value={this.state.cnx_pwd}
                    id="cnx_pwd"
                    onChange={this.handleUserInput}
                    error={errors.cnx_pwd}
                  />
                  <div className="fatb-bar"></div>
                </div>
              </div>
              <FormErrors formErrors={this.state.formErrors} />
              <div className="btn-cnx text-center">
                <button
                  className="fatb-btn-cnx fatb-btn-validate"
                  type="submit"
                  name="cnx_btn"
                  disabled={!this.state.formValid}
                >
                  Se connecter
                </button>
              </div>
            </form>
            <a
              className="forgotenpwd"
              data-toggle="collapse"
              href="#collapsePassword"
              role="button"
              aria-expanded="false"
              aria-controls="collapsePassword"
            >
              Mot de passe oublié ?
            </a>
            <div className="collapse" id="collapsePassword">
              <div className="card card-body">
                <input
                  type="email"
                  required
                  className="form-control fatb-input input-form"
                  name="valide_pwd_forgoten"
                  id="valide_pwd_forgoten"
                  placeholder="tapez votre mail "
                  onChange={this.handleUserInput}
                  error={errors.valide_pwd_forgoten}
                />
                <button onClick={this.handleForgotenPwd} className="fatb-btn">
                  Envoyer
                </button>
              </div>
              {valide_pwd_forgoten === true ? (
                <div className="not-sub alert alert-success">Email envoyé</div>
              ) : (
                ''
              )}
            </div>
            {faild === true ? (
              <div className="not-sub alert alert-danger">
                Compte désactivé ou identifiants incorrects
              </div>
            ) : (
              ''
            )}
          </div>

          <form
            method="post"
            className="subscribe-form rs-box text-left collapse"
            id="collapseSubscribe"
          >
            <h3 className="text-center">Inscription</h3>
            <div action="" className="subscribe-form_inputs">
              <div
                className={
                  validation.sub_mail.isInvalid
                    ? 'form-inputs_box has-error'
                    : 'form-inputs_box'
                }
              >
                <label htmlFor="sub_mail">Email</label>
                <input
                  type="email"
                  className="form-control fatb-input btn-cnxmail"
                  name="sub_mail"
                  placeholder="exemple : john@doe.com"
                  onChange={this.handleInputChange}
                />
                <span className="help-block redtext">
                  {validation.sub_mail.message}
                </span>
              </div>

              <div
                className={
                  validation.sub_pwd.isInvalid
                    ? 'form-inputs_box has-error'
                    : 'form-inputs_box'
                }
              >
                <label htmlFor="sub_pwd">Mot de passe</label>
                <input
                  type="password"
                  className="form-control fatb-input"
                  name="sub_pwd"
                  onChange={this.handleInputChange}
                />
                <span className="help-block redtext">
                  {validation.sub_pwd.message}
                </span>
              </div>

              <div
                className={
                  validation.subConfirm_pwd.isInvalid
                    ? 'form-inputs_box has-error'
                    : 'form-inputs_box'
                }
              >
                <label htmlFor="subConfirm_pwd">Confirmer mot de passe</label>
                <input
                  type="password"
                  className="form-control"
                  name="subConfirm_pwd"
                  onChange={this.handleInputChange}
                />
                <span className="help-block redtext">
                  {validation.subConfirm_pwd.message}
                </span>
              </div>
            </div>

            <div id="checks">
              <label
                className={msg === 'notchecked' ? 'cgu-box redtext' : 'cgu-box'}
              >
                j'ai lu et j'accepte{' '}
                <a
                  className={
                    msg === 'notchecked' ? 'cgu-link redtext' : 'cgu-link'
                  }
                  href="/cgu"
                >
                  les conditions générales d'utilisation.
                </a>
                <input
                  type="checkbox"
                  onChange={this.handleCheck}
                  checked={this.state.checked}
                />
                <span className="checkmark"></span>
              </label>
              <label className="nl-box">
                j'accepte de recevoir des offres promotionnelles par mail.
                <input type="checkbox" name="nl" className="nl" />
                <span className="checkmark"></span>
              </label>
            </div>
            <div className="form-btn">
              <button
                className="fatb-btn btn-inscription-validate"
                onClick={this.handleFormSubmit}
              >
                Valider
              </button>
            </div>
            {validate_sub === false ? (
              <div className="not-sub alert alert-danger">
                Email ou mot de passe incorrect
              </div>
            ) : (
              ''
            )}
          </form>
        </div>
      </section>
    );
  }
}
export default withRouter(Connexion);
