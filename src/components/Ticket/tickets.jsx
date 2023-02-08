import React, { Component } from 'react';
import Header from '../header/header.jsx';
import './ticket.scss';
const API = process.env.REACT_APP_API_URL;

class Tickets extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filter_tickets_email: '',
      filter_tickets_ticket: '',
      filter_tickets_libelle: '',
      filter_tickets_used: null,
      items_tickets: [],
      dd_tickets: [],
      filter_tickets: [],
    };

    this.filterTickets = this.filterTickets.bind(this);
    this.filteralltickets = this.filterallTickets.bind(this);
  }
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
              fetch(`https://api.fatboarrestaurant.com/tickets/getalltickets`, {
                headers: {
                  'Content-Type': 'application/json',
                  Accept: 'application/json',
                  authorization: `Bearer ${auth_token}`,
                },
              })
                .then(results => {
                  return results.json();
                })

                .then(data => {
                  this.setState({ items_tickets: data.result });
                  this.setState({ dd_tickets: data.result });
                });
            } else {
              this.setState({ role: 'user' });
              fetch(`https://api.fatboarrestaurant.com/tickets/getmytickets`, {
                headers: {
                  'Content-Type': 'application/json',
                  Accept: 'application/json',
                  authorization: `Bearer ${auth_token}`,
                },
              })
                .then(results => {
                  return results.json();
                })

                .then(data => {
                  this.setState({ items_tickets: data.result });
                });
            }
          }
        });
    } else if (auth_payload === undefined) {
      const head = localStorage.getItem('head');
      const payload = localStorage.getItem('payload');
      const signature = localStorage.getItem('signature');
      var tok = head + '.' + payload + '.' + signature;

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
              fetch(`https://api.fatboarrestaurant.com/tickets/getalltickets`, {
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
                  this.setState({ items_tickets: data.result });
                  this.setState({ dd_tickets: data.result });
                });
            } else {
              this.setState({ role: 'user' });
              fetch(`https://api.fatboarrestaurant.com/tickets/getmytickets`, {
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
                  this.setState({ items_tickets: data.result });
                });
            }
          }
        });
    }
  }
  handleInputChange = event => {
    event.preventDefault();
    this.setState({
      [event.target.name]: event.target.value,
    });
  };
  //Filter Gain by email/numTicket/Libelle gain
  filterTickets = () => {
    const head = localStorage.getItem('head');
    const payload = localStorage.getItem('payload');
    const signature = localStorage.getItem('signature');
    var tok = head + '.' + payload + '.' + signature;
    // window.location.reload();
    // event.preventDefault();
    if (this.state.filter_tickets_used === '') {
      this.state.filter_tickets_used = null;
    }
    fetch(`https://api.fatboarrestaurant.com/tickets/getticketssbyfilter`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${tok}`,
      },
      body: JSON.stringify({
        email: this.state.filter_tickets_email,
        numTicket: this.state.filter_tickets_ticket,
        used: this.state.filter_tickets_used,
        libelleGain: this.state.filter_tickets_libelle,
      }),
    })
      .then(results => {
        return results.json();
      })
      .then(res => {
        if (res.success === true) {
          this.setState({ filter_tickets: res.result });
          this.setState({ items_tickets: [] });
        }
      });
  };
  // Get all tickets
  filterallTickets = () => {
    const head = localStorage.getItem('head');
    const payload = localStorage.getItem('payload');
    const signature = localStorage.getItem('signature');
    var tok = head + '.' + payload + '.' + signature;
    // Gains List
    fetch(`https://api.fatboarrestaurant.com/tickets/getalltickets`, {
      method: 'GET',
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
          this.setState({ filter_tickets: res.result });
          // this.setState({items_tickets: []});
        }
      });
  };

  render() {
    var { items_tickets, dd_tickets, role, filter_tickets } = this.state;
    return (
      <div id="admin-tickets">
        <Header />
          <h2 class="otest">
            <i>Liste des tickets</i>
          </h2>
          <div className="bg">
          {role === 'admin' || role === 'serveur' ? (
            <section className="filters container">
              <div className="fatb-inpu-border col-lg-12">
                <label htmlFor="filter_tickets_email">
                  {' '}
                  Filtrer par email :{' '}
                </label>
                <input
                  type="text"
                  name="filter_tickets_email"
                  placeholder="Entrez un email"
                  defaultValue=""
                  onChange={this.handleInputChange}
                />
                <span className="focus-border"></span>
              </div>

              <div className="justify-content-center row">
                <div className="ticket-section col-lg-5 col-sm-12">
                    <label htmlFor="filter_tickets_ticket"> 
                      {' '}
                      Numéro de ticket :{' '}
                    </label>
                    <input
                      type="text"
                      name="filter_tickets_ticket"
                      id="filter_tickets_ticket"
                      defaultValue=""
                      onChange={this.handleInputChange}
                    />
                    <span className="focus-border"></span>
                  </div>

                <div className="ticket-section col-lg-5 col-sm-12">
                  <label htmlFor="filter_tickets_libelle"> Libellé : </label>
                  <div className="select-filter">
                    <select
                      name="filter_tickets_libelle"
                      id="filter_tickets_libelle"
                      onChange={this.handleInputChange}
                    >
                      <option value=""></option>
                      <option value="une entrée ou un dessert au choix">une entrée ou un dessert au choix</option>
                      <option value="un burger au choix">un burger au choix</option>
                      <option value="un menu du jour">un menu du jour</option>
                      <option value="un menu au choix">un menu au choix</option>
                      <option value="70% de réduction">70% de réduction</option>
                    </select>
                  </div>
                </div>

                <div className="libelle-section col-lg-5 col-sm-12">
                  <label htmlFor="filter_tickets_used">
                    Ticket(utilisé/non utilisé) :
                  </label>
                  <div className="select-filter">
                    <select
                      id="filter_tickets_used"
                      name="filter_tickets_used"
                      onChange={this.handleInputChange}
                    >
                      <option value=""></option>
                      <option value="true">utilisé</option>
                      <option value="false">non utilisé</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="justify-content-center row">
                <button
                  type="button"
                  className="filter-btn fatb-btn-validate col-lg-5 col-sm-6"
                  onClick={this.filterTickets}
                >
                  {' '}
                  valider
                </button>
                <button
                  type="button"
                  className="filter-btn fatb-btn-validate col-lg-5 col-sm-6"
                  onClick={this.filterallTickets}
                >
                  {' '}
                  afficher tout{' '}
                </button>
              </div>
              
            </section>
          ) : (
            ''
          )}
          <div className="table-responsive table-responsive-sm table-responsive-xs table-responsive-md">
          <div class="scrollbar" id="style-1">
            <table className="table table-striped table-dark table-hover">
              <thead>
                <tr>
                  <th>Email</th>
                  <th> N° de Ticket </th>
                  <th> Les Gains </th>
                  <th> (Non) utilisé </th>
                </tr>
              </thead>
              <tbody>
                {items_tickets.length > 0
                  ? items_tickets.map(item => {
                      const { numTicket, libelleGain, used, usedby } = item;
                      return (
                        <tr key={numTicket}>
                          <td>{usedby !== '' ? usedby : ' ... '}</td>
                          <td>{numTicket}</td>
                          <td>{libelleGain}</td>
                          <td>{used === true ? 'Utilisé' : 'Non utilisé'}</td>
                        </tr>
                      );
                    })
                  : ''}
                {filter_tickets.length > 0
                  ? filter_tickets.map(item => {
                      const { numTicket, libelleGain, used, usedby } = item;
                      return (
                        <tr key={numTicket}>
                          <td>{usedby !== '' ? usedby : ' ... '}</td>
                          <td>{numTicket}</td>
                          <td>{libelleGain}</td>
                          <td>{used === true ? 'Utilisé' : 'Non utilisé'}</td>
                        </tr>
                      );
                    })
                  : ''}
              </tbody>
            </table>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default Tickets;
