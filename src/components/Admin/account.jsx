import React, { Component } from 'react';
import { Link, Redirect, Route } from 'react-router-dom';
import Header from '../header/header.jsx';
import { FormErrors } from '../form_erros/FormErrors';
import FormValidator from '../form_erros/FormErrorsSub';
import './accounts.scss';
const API = process.env.REACT_APP_API_URL;

class Gerercomptes extends Component {
  constructor(props) {
    super(props);
    this.validator = new FormValidator([
      {
        field: 'acc_email',
        method: 'isEmpty',
        validWhen: false,
        message: 'Email requis',
      },
      {
        field: 'acc_email',
        method: 'isEmail',
        validWhen: true,
        message: "Votre email n'est pas valide",
      },
      {
        field: 'acc_pwd',
        method: 'isEmpty',
        validWhen: false,
        message: 'Mot de passe obligatoire',
      },
    ]);
    this.state = {
      donnee: [],
      items: [],
      acc_email: '',
      acc_nom: '',
      acc_prenom: '',
      acc_tel: '',
      acc_pwd: '',
      role: '',
      redirectHome: false,
      fbgoogleaccount:false,
      Iduser: '',
      good_update: false,
      user_update: null,
      //update for user
      validation: this.validator.valid(),
      emailValid: false,
      passwordValid: false,
      formValid: false,

      formErrors: { acc_email: '', acc_pwd: '' },
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleDisableUser = this.handleDisableUser.bind(this);
    this.handleDisableByAdmin = this.handleDisableByAdmin.bind(this);
  }
  validateField(fieldName, value) {
    let fieldValidationErrors = this.state.formErrors;
    let emailValid = this.state.emailValid;
    let passwordValid = this.state.passwordValid;

    switch (fieldName) {
      case 'acc_email':
        emailValid = value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);
        fieldValidationErrors.acc_email = emailValid
          ? ''
          : "Votre email n'est pas valide";
        break;
      case 'acc_pwd':
        passwordValid = value.length >= 6;
        fieldValidationErrors.acc_pwd = passwordValid
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


     

    let url = this.props.location.pathname.split('/')[2];

    // Check if user or admin
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
            // Dsiplay user info for an admin
            fetch(`https://api.fatboarrestaurant.com/accounts/getallaccounts`, {
              method: 'GET',
              headers: {
                authorization: `Bearer ${tok}`,
              },
            })
              .then(results => {
                return results.json();
              })
              .then(data => {
                var donnees = data.result;
                for (var i = 0; i < donnees.length; i++) {
                  if (donnees[i]._id === url) {
                    this.setState({
                      donnee: donnees[i],
                      acc_email: donnees[i].email,
                      acc_nom: donnees[i].nom,
                      acc_prenom: donnees[i].prenom,
                      acc_tel: donnees[i].tel,
                      acc_pwd: donnees[i].password,
                      Iduser: donnees[i]._id,
                    });
                  }
                }
              });
          } else {
            this.setState({ role: 'user' });
            // Dsiplay user info for a simple user
            fetch(`https://api.fatboarrestaurant.com/accounts/getmyaccount`, {
              headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                authorization: `Bearer ${tok}`,
              },
            })
              .then(results => {
                return results.json();
              })

              .then(data => {
                var donnee = data.result;
                if(donnee.facebook || donnee.google){
                    console.log(donnee);
                    this.setState({
                      fbgoogleaccount:true
                    });
                }
                console.log("autre");
                this.setState({
                items: data.result,
                acc_email: donnee.email,
                acc_nom: donnee.nom,
                acc_prenom: donnee.prenom,
                acc_tel: donnee.tel,
                });
              });
          }
        }
        else{
          this.setState({ redirectHome: true });
          window.location.reload();
        }
      });
  }
  handleInputChange(e) {
    const name = e.target.name;
    const value = e.target.value;
    this.setState({ [name]: value }, () => {
      this.validateField(name, value);
    });
    this.setState({ [e.target.name]: e.target.value });
  }
  // Desactivate an account by a user
  handleDisableUser(event) {
    const head = localStorage.getItem('head');
    const payload = localStorage.getItem('payload');
    const signature = localStorage.getItem('signature');
    var tok = head + '.' + payload + '.' + signature;
    event.preventDefault();
    fetch(`https://api.fatboarrestaurant.com/accounts/disableaccountbytoken`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${tok}`,
      },
    })
      .then(results => {
        return results.json();
      })
      .then(res => {
        if (res.success === true) {
          this.setState({ redirectHome: true });
          localStorage.clear();
          window.location.reload();
        }
      });
  }
  // Desactivate an account by an admin
  handleDisableByAdmin(idd) {
    const head = localStorage.getItem('head');
    const payload = localStorage.getItem('payload');
    const signature = localStorage.getItem('signature');
    var tok = head + '.' + payload + '.' + signature;
    let path = `/accounts`;
    this.props.history.push(path);
    fetch(`https://api.fatboarrestaurant.com/accounts/disableaccountbyid`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${tok}`,
      },
      body: JSON.stringify({
        id: idd,
      }),
    }).then(results => {
      return results.json();
    });
  }
  handleSubmit(event) {
    const head = localStorage.getItem('head');
    const payload = localStorage.getItem('payload');
    const signature = localStorage.getItem('signature');
    var tok = head + '.' + payload + '.' + signature;
    event.preventDefault();
    fetch(`https://api.fatboarrestaurant.com/accounts/updateaccountv2`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${tok}`,
      },
      body: JSON.stringify({
        email: this.state.acc_email,
        nom: this.state.acc_nom,
        prenom: this.state.acc_prenom,
        tel: this.state.acc_tel,
        password: this.state.acc_pwd,
      }),
    })
      .then(results => {
        return results.json();
      })
      .then(res => {
        if (res.success === true) {
          this.setState({ user_update: true });
        }
        else{
          this.setState({ user_update: false });
        }
      });
  }
  handleSubmitAdmin(idd, e) {
    const head = localStorage.getItem('head');
    const payload = localStorage.getItem('payload');
    const signature = localStorage.getItem('signature');
    var tok = head + '.' + payload + '.' + signature;
    e.preventDefault();
    fetch(`https://api.fatboarrestaurant.com/accounts/updateaccountbyidv2`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${tok}`,
      },
      body: JSON.stringify({
        id: idd,
        email: this.state.acc_email,
        nom: this.state.acc_nom,
        prenom: this.state.acc_prenom,
        tel: this.state.acc_tel,
      }),
    })
      .then(results => {
        return results.json();
      })
      .then(res => {
        if (res.success === true) {
          this.setState({ admin_update: true });
        }
      });
  }

  render() {
    var {
      donnee,
      items,
      role,
      redirectHome,
      admin_update,
      user_update,
      fbgoogleaccount,
    } = this.state;
    let validation = this.submitted // if the form has been submitted at least once
      ? this.validator.validate(this.state) // then check validity every time we render
      : this.state.validation;

    {
      if (role === 'admin') {
        return (
          <div id="admin-account">
            <Header />
            <div className="single-account-info-box">
              <h2 className="text-center">
                <i>Gestion de compte</i>
              </h2>
              <form
                onSubmit={this.handleSubmitAdmin.bind(this, donnee._id)}
                className="single-account-info"
                key={donnee._id}
              >
                <div className="single-account-info-field">
                  <label htmlFor="acc_email">Email*: </label>
                  <input
                    type="email"
                    defaultValue={donnee.email}
                    id="acc_email"
                    name="acc_email"
                    onChange={this.handleInputChange}
                  />
                </div>

                <div className="single-account-info-field">
                  <label htmlFor="acc_nom">Nom: </label>
                  <input
                    placeholder="Nom"
                    type="text"
                    pattern="[A-Za-z]*"
                    minLength="3"
                    maxLength="20"
                    defaultValue={donnee.nom}
                    id="acc_nom"
                    name="acc_nom"
                    onChange={this.handleInputChange}
                  />
                </div>

                <div className="single-account-info-field">
                  <label htmlFor="acc_prenom">Prénom: </label>
                  <input
                    placeholder="Prénom"
                    type="text"
                    pattern="[A-Za-z]*"
                    minLength="3"
                    maxLength="20"
                    defaultValue={donnee.prenom}
                    id="acc_prenom"
                    name="acc_prenom"
                    onChange={this.handleInputChange}
                  />
                </div>

                <div className="single-account-info-field">
                  <label htmlFor="acc_tel">Téléphone: </label>
                  <input
                    placeholder="Téléphone"
                    type="tel"
                    pattern="[0]{1}[0-9]{10}"
                    defaultValue={donnee.tel}
                    id="acc_tel"
                    name="acc_tel"
                    onChange={this.handleInputChange}
                  />
                </div>
                <button className="button btn-validate">Modifier</button>
                {admin_update === true ? (
                  <div className="alert alert-success">
                    Ce compte a bien été modifié
                  </div>
                ) : (
                  ''
                )}
                
                {redirectHome === true ? (
                  <div className="alert alert-success">
                    Ce compte a bien été supprimé
                    <Redirect to="/" />
                  </div>
                ) : (
                  ''
                )}<button type="button"
                className="button btn-desactivate"
                data-toggle="modal"
                data-target="#AdminModalCenter"
              >
                Désactiver ce compte
              </button>
              </form>
              
            </div>
            <div className="alert-desactivate-account">
              {/* <!-- Modal Admin disabled acocunt--> */}
              <div
                className="modal fade"
                id="AdminModalCenter"
                tabIndex="-1"
                role="dialog"
                aria-labelledby="exampleModalCenterTitle"
                aria-hidden="true"
              >
                <div
                  className="modal-dialog modal-dialog-centered"
                  role="document"
                >
                  <div className="modal-content">
                    <div className="modal-header">
                      <h5 className="modal-title" id="exampleModalLongTitle">
                        Confirmation de désactivation de compte
                      </h5>
                      <button
                        type="button"
                        className="close"
                        data-dismiss="modal"
                        aria-label="Close"
                      >
                        <span aria-hidden="false">&times;</span>
                      </button>
                    </div>
                    <div className="modal-body">
                      êtes-vous sûr de vouloir désactiver votre compte ?
                    </div>
                    <div className="modal-footer">
                      <Route>
                        <Link
                          to="/accounts"
                          onClick={() => this.handleDisableByAdmin(donnee._id)}
                          className="single-account-btn-update"
                          data-dismiss="modal"
                        >
                          Confirmer
                        </Link>
                      </Route>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      }
      else { //user or serveur
        if(fbgoogleaccount===true){ //for facebook and google accounts, can't update the profil
          return (
            <div id="admin-user">
              <Header />
              <div className="single-account-info-box">
                <h2 className="text-center">
                  <i>Informations de mon compte</i>
                </h2>
                <form
                  onSubmit={this.handleSubmit}
                  className="single-account-info-disable"
                  key={items._id}
                >
                  <div className="single-account-info-field">
                    <label htmlFor="acc_email">Email: </label>
                    <input
                      type="email"
                      disabled="true"
                      defaultValue={items.email}
                      id="acc_email"
                      name="acc_email"
                      onChange={this.handleInputChange}
                    />
                    <span className="help-block redtext">
                      {validation.acc_email.message}
                    </span>
                  </div>
                  <div className="single-account-info-field">
                    <label htmlFor="acc_nom">Nom: </label>
                    <input
                      disabled="true"
                      type="text"
                      defaultValue={items.nom}
                      id="acc_nom"
                      name="acc_nom"
                      onChange={this.handleInputChange}
                    />
                  </div>
                  <div className="single-account-info-field">
                    <label htmlFor="acc_prenom">Prénom: </label>
                    <input
                      disabled="true"
                      type="text"
                      defaultValue={items.prenom}
                      id="acc_prenom"
                      name="acc_prenom"
                      onChange={this.handleInputChange}
                    />
                  </div>
                  <FormErrors formErrors={this.state.formErrors} />
                </form>
              </div>
            </div>
          );
        } 
        else //for standard accounts, can update profil
        {
          return (
            <div id="admin-user">
              <Header />
              <div className="single-account-info-box">
                <h2 className="text-center">
                  <i>Gestion de compte</i>
                </h2>
                {user_update === true ? (
                  <div className="alert alert-success alert-in-forms">
                    Votre compte a bien été modifié
                  </div>
                ) : (
                  ''
                )}
                {redirectHome === true ? (
                  <div className="alert alert-success alert-in-forms">
                    Votre compte a bien été supprimé
                    <Redirect to="/" />
                  </div>
                ) : (
                  ''
                )}
                <form
                  onSubmit={this.handleSubmit}
                  className="single-account-info"
                  key={items._id}
                >
                  <div className="single-account-info-field">
                    <label htmlFor="acc_email">Email*: </label>
                    <input
                      type="email"
                      placeholder="Entrez votre email"
                      defaultValue={items.email}
                      required
                      id="acc_email"
                      name="acc_email"
                      onChange={this.handleInputChange}
                    />
                    <span className="help-block redtext">
                      {validation.acc_email.message}
                    </span>
                  </div>
                  <div className="single-account-info-field">
                    <label htmlFor="acc_nom">Nom: </label>
                    <input
                      placeholder="Entrez votre nom"
                      type="text"
                      pattern="[A-Za-z]*"
                      minLength="3"
                      maxLength="20"
                      defaultValue={items.nom}
                      id="acc_nom"
                      name="acc_nom"
                      onChange={this.handleInputChange}
                    />
                  </div>
                  <div className="single-account-info-field">
                    <label htmlFor="acc_prenom">Prénom: </label>
                    <input
                      placeholder="Entrez votre prénom"
                      type="text"
                      pattern="[A-Za-z]*"
                      minLength="3"
                      maxLength="20"
                      defaultValue={items.prenom}
                      id="acc_prenom"
                      name="acc_prenom"
                      onChange={this.handleInputChange}
                    />
                  </div>
                  <div className="single-account-info-field">
                    <label htmlFor="acc_tel">Téléphone: </label>
                    <input
                      type="tel"
                      pattern="[0]{1}[0-9]{10}"
                      placeholder="Exemple: 0600000000"
                      defaultValue={items.tel}
                      id="acc_tel"
                      name="acc_tel"
                      onChange={this.handleInputChange}
                    />
                  </div>
                  <div className="single-account-info-field">
                    <label htmlFor="acc_pwd">Mot de passe*: </label>
                    <input
                      className={user_update === false ? 'error-border' : ''}
                      placeholder="Entrez votre mot de passe"
                      required
                      type="password"
                      defaultValue=""
                      id="acc_pwd"
                      name="acc_pwd"
                      onChange={this.handleInputChange}
                    />
                    <span className="help-block redtext">
                      {validation.acc_pwd.message}
                    </span>
                  </div>
                  <FormErrors formErrors={this.state.formErrors} />
                  <button className="button btn-validate">Modifier</button>
                  <button
                    className="button btn-desactivate"
                    data-toggle="modal"
                    data-target="#UserModalCenter"
                  >
                    Désactiver mon compte
                  </button>
                </form>
              </div>
              <div className="alert-desactivate-account">
                {/* <!-- Modal User disabled account--> */}
                <div
                  className="modal fade"
                  id="UserModalCenter"
                  tabIndex="-1"
                  role="dialog"
                  aria-labelledby="exampleModalCenterTitle"
                  aria-hidden="true"
                >
                  <div
                    className="modal-dialog modal-dialog-centered"
                    role="document"
                  >
                    <div className="modal-content">
                      <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalLongTitle">
                          Confirmation de désactivation de compte
                        </h5>
                        <button
                          type="button"
                          className="close"
                          data-dismiss="modal"
                          aria-label="Close"
                        >
                          <span aria-hidden="true">&times;</span>
                        </button>
                      </div>
                      <div className="modal-body">
                        êtes-vous sûr de vouloir désactiver votre compte ?
                      </div>
                      <div className="modal-footer">
                        {/* <button type="button" className="btn btn-secondary" data-dismiss="modal">fermer</button> */}
                        <Route>
                          <Link
                            to="/"
                            onClick={this.handleDisableUser}
                            className="single-account-btn-update"
                          >
                            Confirmer
                          </Link>
                        </Route>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        }
      }
    }
  }
}
export default Gerercomptes;
