import React, { Component } from 'react';
import { Link, Route } from 'react-router-dom';
import Header from '../header/header.jsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import './gains.scss';
import moment from 'moment';
import { format } from 'url';
const API = process.env.REACT_APP_API_URL;

class AdminGains extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [],
      role: '',
      numTicket: '',
      gainTaked: false,

      //filter gains
      filter_gains_email: '',
      filter_gains_ticket: 0,
      filter_gains_libelle: '',
      items_ticket: [],
      filter_gains: [],
    };

    this.handleTakeGain = this.handleTakeGain.bind(this);
    this.filterGains = this.filterGains.bind(this);
    this.filterallGains = this.filterallGains.bind(this);
  }
  handleInputChange = event => {
    event.preventDefault();
    this.setState({
      [event.target.name]: event.target.value,
    });
  };
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
    var auth_token = auth_head + '.' + auth_payload + '.' + auth_signature;
    var auth_token = auth_token.substr(6);
    if (auth_payload !== undefined) {
      // Get role when user's connected
      fetch(`https://api.fatboarrestaurant.com/accounts/getrolebytoken`, {
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
          Accept: 'application/json',
          authorization: `Bearer ${auth_token}`,
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
              fetch(`https://api.fatboarrestaurant.com/gains/getallgains`, {
                headers: {
                  method: 'GET',
                  'Content-Type': 'application/json',
                  Accept: 'application/json',
                  authorization: `Bearer ${auth_payload}`,
                },
              })
                .then(results => {
                  return results.json();
                })

                .then(data => {
                  this.setState({ items: data.result });
                  this.setState({ items_ticket: data.result });
                  this.setState({
                    numTicket: data.result.numTicket,
                  });
                });
            } else {
              this.setState({ role: 'user' });
              fetch(`https://api.fatboarrestaurant.com/gains/getmygain`, {
                headers: {
                  method: 'GET',
                  'Content-Type': 'application/json',
                  Accept: 'application/json',
                  authorization: `Bearer ${auth_token}`,
                },
              })
                .then(results => {
                  return results.json();
                })

                .then(data => {
                  this.setState({ items: data.result });
                });
            }
          }
        });
    } else if (auth_payload === undefined) {
      // Get the token
      const head = localStorage.getItem('head');
      const payload = localStorage.getItem('payload');
      const signature = localStorage.getItem('signature');
      var tok = head + '.' + payload + '.' + signature;
      // Get role when user's connected
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
              fetch(`https://api.fatboarrestaurant.com/gains/getallgains`, {
                headers: {
                  method: 'GET',
                  'Content-Type': 'application/json',
                  Accept: 'application/json',
                  authorization: `Bearer ${tok}`,
                },
              })
                .then(results => {
                  return results.json();
                })

                .then(data => {
                  this.setState({ items: data.result });
                  this.setState({ items_ticket: data.result });
                  this.setState({
                    numTicket: data.result.numTicket,
                  });
                });
            } else {
              this.setState({ role: 'user' });

              fetch(`https://api.fatboarrestaurant.com/gains/getmygain`, {
                headers: {
                  method: 'GET',
                  'Content-Type': 'application/json',
                  Accept: 'application/json',
                  authorization: `Bearer ${tok}`,
                },
              })
                .then(results => {
                  return results.json();
                })

                .then(data => {
                  this.setState({ items: data.result });
                });
            }
          }
        });
    }
  }
  handleTakeGain(numTicket) {
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
    var auth_token = auth_head + '.' + auth_payload + '.' + auth_signature;
    var auth_token = auth_token.substr(6);

    if (auth_payload !== undefined) {
      fetch(`https://api.fatboarrestaurant.com/gains/takegain`, {
        method: 'POST', // 'GET', 'PUT', 'DELETE'
        body: JSON.stringify({
          numTicket: new Number(numTicket),
        }),
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
          authorization: `Bearer ${auth_token}`,
        },
      })
        .then(results => {
          return results.json();
        })
        .then(result => {
          if (result.success === true) {
            this.setState({ gainTaked: true });
          }
        });
    } else if (auth_payload === undefined) {
      // Get the token
      const head = localStorage.getItem('head');
      const payload = localStorage.getItem('payload');
      const signature = localStorage.getItem('signature');
      var tok = head + '.' + payload + '.' + signature;
       window.location.reload();

      fetch(`https://api.fatboarrestaurant.com/gains/takegain`, {
        method: 'POST', // 'GET', 'PUT', 'DELETE'
        body: JSON.stringify({
          numTicket: new Number(numTicket),
        }),
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
          authorization: `Bearer ${tok}`,
        },
      })
        .then(results => {
          return results.json();
        })
        .then(result => {
          if (result.success === true) {
            this.setState({ gainTaked: true });
          }
        });
    }
  }
  //Filter Gain by email/numTicket/Libelle gain
  filterGains() {
    const head = localStorage.getItem('head');
    const payload = localStorage.getItem('payload');
    const signature = localStorage.getItem('signature');
    var tok = head + '.' + payload + '.' + signature;
    fetch(`https://api.fatboarrestaurant.com/gains/getgainsbyfilter`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${tok}`,
      },
      body: JSON.stringify({
        email: this.state.filter_gains_email,
        numTicket: this.state.filter_gains_ticket,
        libelleGain: this.state.filter_gains_libelle,
      }),
    })
      .then(results => {
        return results.json();
      })
      .then(res => {
        if (res.success === true) {
          this.setState({ filter_gains: res.result });
          this.setState({ items: [] });
        }
      });
  }

  // Get all gain
  filterallGains() {
    const head = localStorage.getItem('head');
    const payload = localStorage.getItem('payload');
    const signature = localStorage.getItem('signature');
    var tok = head + '.' + payload + '.' + signature;

    // Gains List
    fetch(`https://api.fatboarrestaurant.com/gains/getallgains`, {
      headers: {
        method: 'GET',
        'Content-Type': 'application/json',
        Accept: 'application/json',
        authorization: `Bearer ${tok}`,
      },
    })
      .then(results => {
        return results.json();
      })

      .then(data => {
        this.setState({ items: data.result });
        this.setState({
          numTicket: data.result.numTicket,
        });
      });
  }
  render() {
    var { items, role, gainTaked, filter_gains, items_ticket } = this.state;
    return (
      <section id="gains">
        <Header />
          <h2>
            <i>Liste des gains</i>
          </h2>
          <div className="bg">
            {role === 'admin' || role === 'serveur' ? (
              <section className="filters container">
                <div className="fatb-inpu-border col-lg-12">
                  <label htmlFor="filter_gains_email"> Filtrer par email : </label>
                  <input
                    type="text"
                    placeholder="Entrez un email"
                    name="filter_gains_email"
                    onChange={this.handleInputChange}
                  />
                  <span className="focus-border"></span>
                </div>

                <div className="justify-content-center row">
                  <div className="ticket-section col-lg-5 col-sm-12">
                    <label htmlFor="filter_gains_ticket">
                      {' '}
                      Filtrer par ticket :{' '}
                    </label>
                    <div className="select-filter">
                      <select
                        name="filter_gains_ticket"
                        id="filter_gains_ticket"
                        onChange={this.handleInputChange}
                      >
                        <option value=""></option>
                        {items_ticket.length > 0
                          ? items_ticket.map(item => {
                              const { numTicket } = item;
                              return (
                                <option value={numTicket} key={numTicket}>
                                  {' '}
                                  {numTicket}
                                </option>
                              );
                            })
                          : ''}
                      </select>
                    </div>
                  </div>

                  <div className="libelle-section col-lg-5 col-sm-12">
                    <label htmlFor="filter_gains_libelle">
                      {' '}
                      Filtrer par libelle :{' '}
                    </label>
                    <div className="select-filter">
                      <select
                        name="filter_gains_libelle"
                        id="filter_gains_libelle"
                        onChange={this.handleInputChange}
                      >
                        <option value=""></option>
                        <option value="une entrée ou un dessert au choix">
                          une entrée ou un dessert au choix
                        </option>
                        <option value="un burger au choix">
                          un burger au choix
                        </option>
                        <option value="un menu du jour">un menu du jour</option>
                        <option value="un menu au choix">un menu au choix</option>
                        <option value="70% de réduction">70% de réduction</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="justify-content-center row">
                  <button
                    type="button"
                    className="filter-btn fatb-btn-validate col-lg-5 col-sm-6"
                    onClick={this.filterGains}
                  >
                    {' '}
                    valider
                  </button>
                  <button
                    type="button"
                    className="filter-btn fatb-btn-validate col-lg-5 col-sm-6"
                    onClick={this.filterallGains}
                  >
                    {' '}
                    afficher tout{' '}
                  </button>
                </div>
              </section>
            ) : (
              ''
            )}
            <div className="table-responsive">
              {gainTaked === true ? (
                <div className="w-50 mx-auto alert alert-success">
                  Félicitation vous avez validé le gain !
                </div>
                
              ) : (
                ''
              )}
              {role === 'admin' ? (
              <div class="scrollbar" id="style-1">
                <table className="table table-striped table-dark table-hover">
                  <thead>
                    <tr>
                      <th className="hidden-id"> Id gain</th>
                      <th>Libelle</th>
                      <th>Date gain</th>
                      <th>Email compte</th>
                      <th>N° ticket</th>
                      <th>(Non) récupéré </th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.length > 0
                      ? items.map(item => {
                          const {
                            isTaked,
                            _id,
                            libelleGain,
                            isTakedDate,
                            emailAccount,
                            numTicket,
                          } = item;
                          return (
                            <tr key={_id}>
                              <td className="hidden-id">{_id}</td>
                              <td>{libelleGain}</td>
                              <td>
                                {isTakedDate !== null ? (
                                  moment(isTakedDate).utc(1).format("DD/MM/YYYY HH:mm")
                                ) : (
                                  'gain non pris'
                                )
                                }
                              </td>
                              <td>{emailAccount}</td>
                              <td>{numTicket}</td>
                              <td>
                                {isTaked === true ? (
                                  <button
                                    className="notChecked button btn-check"
                                    data-toggle="tooltip"
                                    data-placement="left"
                                    title="Ce gain est déja pris"
                                  >
                                    <FontAwesomeIcon icon={faCheck} size="3x" />
                                  </button>
                                ) : isTaked === false ? (
                                  <Route>
                                    <Link
                                      to={`/gains`}
                                      className="checked button btn-check"
                                      data-toggle="tooltip"
                                      data-placement="left"
                                      title="Valider le gain"
                                      onClick={() => this.handleTakeGain(numTicket)}
                                    >
                                      <FontAwesomeIcon icon={faCheck} size="3x" />
                                    </Link>
                                  </Route>
                                ) : (
                                  ''
                                )}
                              </td>

                              {localStorage.setItem('numticket', numTicket)}
                            </tr>
                          );
                        })
                      : ''}

                    {filter_gains.length > 0
                      ? filter_gains.map(gain => {
                          const {
                            isTaked,
                            _id,
                            libelleGain,
                            isTakedDate,
                            emailAccount,
                            numTicket,
                          } = gain;
                          return (
                            <tr key={_id}>
                              <td className="hidden-id">{_id}</td>
                              <td>{libelleGain}</td>
                              <td>
                                {isTakedDate !== null ? (
                                  moment(isTakedDate).utc(1).format("DD/MM/YYYY HH:mm")
                                ) : (
                                  'gain non pris'
                                )
                                }
                              </td>
                              <td>{emailAccount}</td>
                              <td>{numTicket}</td>
                              <td>
                                {isTaked === true ? (
                                  <button
                                    className="notChecked button btn-check"
                                    data-toggle="tooltip"
                                    data-placement="left"
                                    title="Ce gain est déja pris"
                                  >
                                    <FontAwesomeIcon icon={faCheck} size="3x" />
                                  </button>
                                ) : isTaked === false ? (
                                  <Route>
                                    <Link
                                      to={`/gains`}
                                      className="checked button btn-check"
                                      data-toggle="tooltip"
                                      data-placement="left"
                                      title="Valider le gain"
                                      onClick={() => this.handleTakeGain(numTicket)}
                                    >
                                      <FontAwesomeIcon icon={faCheck} size="3x" />
                                    </Link>
                                  </Route>
                                ) : (
                                  ''
                                )}
                              </td>

                              {localStorage.setItem('numticket', numTicket)}
                            </tr>
                          );
                        })
                      : ''}
                  </tbody>
                </table>
              </div>
            ) : role === 'user' ? (
              <div class="scrollbar" id="style-1">
                <table className="table table-striped table-dark table-hover">
                  <thead>
                    <tr>
                      <th>Mes gains</th>
                      <th>Date gain</th>
                      <th>Email</th>
                      <th>N° ticket</th>
                      <th>(Non) Validé </th>
                      <th>Action </th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.length > 0 ? (
                      items.map(item => {
                        const {
                          isTaked,
                          _id,
                          libelleGain,
                          isTakedDate,
                          emailAccount,
                          numTicket,
                        } = item;
                        return (
                          <tr key={_id}>
                            <td>{libelleGain}</td>
                            <td>
                              {isTakedDate !== null ? (
                                  moment(isTakedDate).utc(1).format("DD/MM/YYYY HH:mm")
                                ) : (
                                  'gain non pris'
                                )
                              }
                            </td>
                            <td>{emailAccount}</td>
                            <td>{numTicket}</td>
                            <td>{isTaked === true ? 'Validé' : 'Non validé'}</td>
                            <td>
                              {isTaked === true ? (
                                <button
                                  className="notChecked button btn-check"
                                  data-toggle="tooltip"
                                  data-placement="left"
                                  title="Ce gain est déja pris"
                                >
                                  <FontAwesomeIcon icon={faCheck} size="3x" />
                                </button>
                              ) : isTaked === false ? (
                                <Route>
                                  <Link
                                    to={`/gains`}
                                    className="checked button btn-check"
                                    data-toggle="tooltip"
                                    data-placement="left"
                                    title="Valider le gain"
                                    onClick={() => this.handleTakeGain(numTicket)}
                                  >
                                    <FontAwesomeIcon icon={faCheck} size="3x" />
                                  </Link>
                                </Route>
                              ) : (
                                ''
                              )}
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <td className="no-dispo">Aucune donnée à afficher</td>
                    )}
                  </tbody>
                </table>
              </div>
            ) : (
              ''
            )}
          </div>
        </div>
      </section>
    );
  }
}
export default AdminGains;
