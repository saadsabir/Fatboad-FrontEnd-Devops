import React, { Component } from 'react';
import { BrowserRouter as Router, Link } from 'react-router-dom';
import Connexion from '../Connexion/connexion.jsx';
import Ticket from '../Ticket/ticket.jsx';
import Bigwinner from '../Admin/Bigwinner/bigwinner.jsx';
import Logo from '../../assets/img/fatboar_logo.png';
import gagnerDiv from '../../assets/img/gagner-img.jpg';
import { Cookies } from 'react-cookie-banner'
import './body.scss';
const API = process.env.REACT_APP_API_URL;
const cookies = new Cookies();

class Body extends Component {
  constructor(props) {
    super(props);
    this.state = {
      role: '',
      acceptCook : "false"
    };
    this.handleSessionAccept = this.handleSessionAccept.bind(this);
  }
  // accept cookies
   handleSessionAccept(event) {
     event.preventDefault();
     //set a cookies name acceptCookies to true 
     var date = new Date();
     date.setTime(date.getTime()+(150*24*60*60*1000));//5months;
     document.cookie = "acceptCookies=true;expires="+date+";path=/"
     this.setState({ acceptCook: "true" });
    //hide de cookies popup
  }
  componentDidMount() {
    //acceptCookies 
    if(cookies.get('acceptCookies')===undefined){
      var date = new Date();
      date.setTime(date.getTime()+(150*24*60*60*1000));//5months;
      document.cookie = "acceptCookies=false;expires="+date+";path=/"
    }
    var acceptCookies = cookies.get('acceptCookies');
    if(acceptCookies==="true"){
      this.setState({ acceptCook: "true" });
    }else{
      this.setState({ acceptCook: "false" });
    }
    

    // Get the cnx token
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
    if (auth_payload) {
      var auth_role = JSON.parse(atob(auth_payload)).account.role;
      if (auth_role === 'admin' || auth_role === 'serveur') {
        this.setState({ auth_tok_role: 'auth_role_admin' });
      } else if (auth_role === 'user') {
        this.setState({ auth_tok_role: 'auth_role_user' });
      }
    }
    // Get user's role
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
          if (therole === 'admin') {
            this.setState({ role: 'admin' });
          } else if (therole === 'serveur') {
            this.setState({ role: 'serveur' });
          } else if (therole === 'user') {
            this.setState({ role: 'user' });
          }
        }
      });
  }

  render() {
    var { role, auth_tok_role,acceptCook } = this.state;
    return (
      <div id="corp">
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
          {
            <Router>
              {' '}
              <Connexion />{' '}
            </Router>
          }
        </nav>
        <section id="the-main">
          {role === 'admin' || auth_tok_role === 'auth_role_admin' ? (
            <div className="welcome-section">
              <h1 className="admin-title">
                {' '}
                Bienvenue <span className="bold-color"> Admin !</span>
              </h1>
              <Bigwinner />
            </div>
          ) : role === 'serveur' ? (
            <div className="welcome-section" >
              <h1 className="admin-title">
                {' '}
                Bienvenue <span className="bold-color"> Serveur !</span>
              </h1>
            </div>
          ) : role === 'user' || auth_tok_role === 'auth_role_user' ? (
            <div className="title">
              <h1 className="user-title">
                <span className="bold-color">Grand jeu-concours</span><br/><br/>
              </h1>
              <h4 className="h4-accueil">
                Du 30 mars 2020 au 30 avril 2020<br></br>
                Pour tout achat d'une valeur de 18€ tentez de gagner une voiture  
                <span className="text-vip"> Range Rover Evoque</span> ainsi que de très nombreux cadeaux !
              </h4>
              <Ticket />
            </div>
          ) : (
            <div className="title">
              <h1 className="user-title">
                 <span className="bold-color" >Grand jeu-concours</span><br/><br/>
              </h1>
              <h4 className="h4-accueil">
                Du 30 mars 2020 au 30 avril 2020<br></br>
                Pour tout achat d'une valeur de 18€ tentez de gagner une voiture  
                <span className="text-vip"> Range Rover Evoque</span> ainsi que de très nombreux cadeaux !
              </h4>
              <button className="surprise" 
              data-toggle="collapse"
              href="#collapseConnexion"
              aria-expanded="false"
              aria-controls="collapseConnexion"
              >Connexion</button>
            </div>
          )}
          <div className="gagner-div">
            <h1 id="h1-gagner">Gagner</h1>
            <img
                className="gagner-img"
                alt="Gagnez des cadeaux"
                src={gagnerDiv}
                title="Gagnez des cadeaux"
            />
          </div>
          <ul className="the-footer">
            <li>
              <a
                className="insta"
                href="https://www.instagram.com/fatboarrestaurants/?hl=fr"
                target="_blank"
                rel="noopener noreferrer"
              ></a>
            </li>
            <li>
              <a
                className="fb"
                href="https://www.facebook.com/FatBoarRestaurant/"
                target="_blank"
                rel="noopener noreferrer"
              ></a>
            </li>
            <li>
              <a
                className="yb"
                href="https://www.youtube.com/"
                target="_blank"
                rel="noopener noreferrer"
              ></a>
            </li>
          </ul>
        </section>
        {acceptCook === "false" ? (
          <div className='react-cookie-banner'>
            <span className='cookie-message'>
            Nous utilisons des cookies pour nous permettre de mieux comprendre comment le site est utilisé. En continuant à utiliser ce site, vous acceptez cette politique.&emsp;
              <a className='cookie-link' href="/cookies" target="_blank">
                En savoir plus
              </a>
            </span>
            <button className='button-close' onClick={this.handleSessionAccept}>
              Accepter et fermer
            </button>
          </div>
        ):(
          ''
        )}
      </div>
    );
  }
}
export default Body;
