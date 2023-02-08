import React, { Component } from 'react';
import { reject } from 'q';
import './ticket.scss';
const API = process.env.REACT_APP_API_URL;

class Ticket extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fatb_ticket_input: '',
      goodticket: '',
    };
    this.handleUserInput = this.handleUserInput.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleUserInput(e) {
    const name = e.target.name;
    const value = e.target.value;
    this.setState({ [name]: value });
    this.setState({ [e.target.name]: e.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();
    const head = localStorage.getItem('head');
    const payload = localStorage.getItem('payload');
    const signature = localStorage.getItem('signature');
    var tok = head + '.' + payload + '.' + signature;

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

    console.log('TEST auth_payload', auth_payload);
    if (auth_payload !== undefined) {
      console.log('connected auth_payload', auth_payload);
      fetch(`https://api.fatboarrestaurant.com/tickets/validateticket`, {
        method: 'POST', // 'GET', 'PUT', 'DELETE'
        body: JSON.stringify({
          numTicket: new Number(this.state.fatb_ticket_input),
        }),
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
          Accept: 'application/json',
          authorization: `Bearer ${auth_token}`,
        },
      })
        .then(res => res.json())
        .then(json => {
          if (json.success === true) {
            this.setState({ goodticket: 'true' });
          } else if (json.success === false) {
            this.setState({ goodticket: 'false' });
          }
        })
        .then(resultats => this.setState(resultats))
        .catch(error => {
          reject(error);
        });
    } else {
      console.log('auth_token----', tok);
      fetch(`https://api.fatboarrestaurant.com/tickets/validateticket`, {
        method: 'POST', // 'GET', 'PUT', 'DELETE'
        body: JSON.stringify({
          numTicket: new Number(this.state.fatb_ticket_input),
        }),
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
          Accept: 'application/json',
          authorization: `Bearer ${tok}`,
        },
      })
        .then(res => res.json())
        .then(json => {
          if (json.success === true) {
            this.setState({ goodticket: 'true' });
          } else if (json.success === false) {
            this.setState({ goodticket: 'false' });
          }
        })
        .then(resultats => this.setState(resultats))
        .catch(error => {
          reject(error);
        });
    }
  }
  render() {
    var { goodticket } = this.state;

    return (
      <section id="ticket" className="col-sm-12">
        <form onSubmit={this.handleSubmit} className="ticket-form">
          <input
            type="text"
            className="fatb-ticket-input"
            name="fatb_ticket_input"
            id="fatb_ticket_input"
            onChange={this.handleUserInput}
            placeholder="Numéro de ticket Fatboar*"
          />
          <button type="submit" className="ticket-btn">
            {' '}
            Jouer
          </button>
        </form>
        {goodticket === 'false' ? (
          <div className="not-ticket alert alert-danger">
            Ce ticket n'est pas valide ou existe déja
          </div>
        ) : goodticket === 'true' ? (
          <div className="good-ticket alert alert-success">
            votre ticket est maintenant validé ! Accèdez à la page des gains
            pour l'activer
          </div>
        ) : (
          ''
        )}
      </section>
    );
  }
}

export default Ticket;
