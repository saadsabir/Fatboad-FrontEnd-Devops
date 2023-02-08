import React, { Component } from "react";
import { BrowserRouter as Router, Link } from "react-router-dom";
import Connexion from '../Connexion/connexion.jsx';
import Logo from '../../assets/img/fatboar_logo.png';
import './cookies.scss';

class ForgotenPwd extends Component {
    componentDidMount(){
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
        if(head === null && payload === null && signature ===null){
            console.log("tok", tok);
        }
    }
    render(){
        return( 
            <div id="cookies">
                    <a className="nav-title" href="/">
                        <img
                            id="logo-header"
                            alt="logo"
                            src={Logo}
                            title="logo fatbor header admin"
                        />
                    </a>
                <section className="cgu">
                        <br></br> 
                        <br></br>
                        <h2 className="text-center h2-cgu">POLITIQUE DES COOKIES</h2>
                        <div className="mt-n1 mb-n1">
                            <h3>DEFINITIONS</h3>
                            <p>Les cookies sont des informations déposées dans l’équipement terminal d’un Internaute par le serveur du site internet visité. Ils sont utilisés par un site internet pour envoyer des informations au navigateur de l’Internaute et permettre à ce navigateur de renvoyer des informations au site d’origine (par exemple un identifiant de session ou le choix d’une langue).
                            <br></br>
                            Seul l’émetteur d’un cookie peut lire ou modifier les informations qui y sont contenues.<br></br>
                            Il existe différents types de cookies :<br></br>
                            - des cookies de session qui disparaissent dès que vous quittez le site ;<br></br>
                            - des cookies permanents qui demeurent sur votre terminal jusqu’à expiration de leur durée de vie ou jusqu’à ce que vous les supprimiez à l’aide des fonctionnalités de votre navigateur.<br></br>
                            Vous êtes informé que, lors de vos visites sur ce site, des cookies peuvent être installés sur votre équipement terminal.</p>
                        </div>
                        <div className="mt-n1 mb-n1">
                            <h3>FINALITES DES COOKIES UTILISES</h3>
                            <p>
                            Les cookies utilisés par Fatboar ont pour finalité exclusive de permettre ou faciliter la communication (détection des erreurs de connexion, identification des points de connexion…).<br></br>
                            </p>
                        </div>
                        <div className="mt-n1 mb-n1">
                            <h3>QUELS COOKIES UTILISONS-NOUS ?</h3>
                            <p>
                            Les cookies utilisés sur le site sont :
                            - les cookies de Fatboar (pas de cookies de tiers );<br></br>
                            </p>
                        </div>
                        <div className="mt-n1 mb-n1">
                            <h3>Cookies de Fatboar </h3>
                            <p>
                            Les cookies déposés par les outils du site Fatboar sont : <br></br>
                            Cookies techniques : Ces cookies ont pour principal objectif de faciliter la navigation de l’utilisateur, et permettre de vous proposer des fonctionnalités du site Fatboar.<br></br>
                            </p>
                            <table className="cookie-table">
                                <tr>
                                    <th>-</th>
                                    <th>TYPE</th>
                                    <th>NOM</th>
                                    <th>A QUOI SERVENT-ILS ?</th>
                                    <th>DUREE DE VIE</th>
                                </tr>
                                <tr>
                                    <td>1</td>
                                    <td>Cookie permanent</td>
                                    <td>token</td>
                                    <td>Il s'agit d'un identificateur jeton généré automatiquement après la connexion de l'utilisateur.</td>
                                    <td>15 minutes</td>
                                </tr>
                                <tr>
                                    <td>2</td>
                                    <td>Cookie permanent</td>
                                    <td>acceptCookies</td>
                                    <td>Il s'agit d'un identificateur général utilisé pour gérer les variables de session utilisateur.</td>
                                    <td>5 mois</td>
                                </tr>
                            </table>
                            <br></br><br></br>
                        </div>
                        
                       
                </section>
            </div>
        )
    }
}
export default ForgotenPwd;
