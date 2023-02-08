import React, {Component} from "react";
import Header from '../header/header.jsx';
import {Link} from 'react-router-dom';
import './accounts.scss';

const API = process.env.REACT_APP_API_URL;

class Gerercomptes extends Component {
    constructor(props) {
        super(props);
        this.state = {
            items: [],
            Derole: '',
            isEnable: false,
            filter_account_email: '',
            filter_account_role: '',
            filter_account_enable : null,
            filter_account: []
        };
        // this.handleEnableByAdmin = this.handleEnableByAdmin.bind(this),
        this.filterAccount = this.filterAccount.bind(this);
        this.filterall = this.filterall.bind(this);
    }
    handleInputChange = event => {
        event.preventDefault();
        this.setState({
            [event.target.name]: event.target.value,
        });
    }
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
        
        fetch(`https://api.fatboarrestaurant.com/accounts/getrolebytoken`,{
            headers : { 
              'Content-Type': 'application/json;charset=utf-8',
              'Accept': 'application/json',
              'authorization': `Bearer ${tok}`
            }
        })
        .then(results => {
            return results.json();
        })
        .then(data => {
            if(data.success === true){
                var therole = data.result;
                if(therole === 'admin'){
                    this.setState({ Derole: 'admin' }) 
                }
                else if(therole === 'serveur'){
                    this.setState({ Derole: 'serveur' }) 
                }
            }
        })
        
        // Account List
        fetch(`https://api.fatboarrestaurant.com/accounts/getallaccounts`,{
            headers :{
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'authorization': `Bearer ${tok}`
            }
        })
        .then(results => {
            return results.json();
        })
        .then(data => {
            this.setState({ items: data.result });
        }); 
     }
    
    // Activate an account
    handleEnableByAdmin (idd){
        const head =  localStorage.getItem('head');
        const payload =  localStorage.getItem('payload');
        const signature =  localStorage.getItem('signature');
        var tok = head + "." + payload + "." + signature;
        window.location.reload();
        
        fetch(`https://api.fatboarrestaurant.com/accounts/enableaccountbyid` 
        ,{
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'authorization': `Bearer ${tok}`
            },
            body: JSON.stringify ({
                id: idd,
            })
        })
        .then(results => {
            return results.json();
        })
        .then(res => {
            if(res.success === true){
                this.setState({ isEnable: true });
                this.setState({ lid :idd })
            }
        })
    }
    logout(event) {
        event.preventDefault();
        localStorage.clear();
        this.props.history.push('/');   
    }
    //Fiter Account 
    filterAccount(event){
        const head =  localStorage.getItem('head');
        const payload =  localStorage.getItem('payload');
        const signature =  localStorage.getItem('signature');
        var tok = head + "." + payload + "." + signature;
        // window.location.reload();
        // event.preventDefault();
        if(this.state.filter_account_enable === ""){this.state.filter_account_enable = null;}
        fetch(`https://api.fatboarrestaurant.com/accounts/getaccountsbyfilter` 
        ,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'authorization': `Bearer ${tok}`
            },
            mode: 'cors',
            body: JSON.stringify ({
                email: this.state.filter_account_email,
                role: this.state.filter_account_role,
                enable: this.state.filter_account_enable,
            })
        })
        .then(results => {
            return results.json();
        })
        .then(res => {
            if(res.success === true){
                this.setState({ filter_account: res.result });
                this.setState({items: []});
            }
        })
    }
    filterall(){
        const head =  localStorage.getItem('head');
        const payload =  localStorage.getItem('payload');
        const signature =  localStorage.getItem('signature');
        var tok = head + "." + payload + "." + signature;

        // Account List
        fetch(`https://api.fatboarrestaurant.com/accounts/getallaccounts`,{
            headers :{
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'authorization': `Bearer ${tok}`
            }
        })
        .then(results => {
            return results.json();
        })
        .then(data => {
            this.setState({ items: data.result });
        }); 
    }
    render(){
        var { items, Derole, isEnable, lid, filter_account } = this.state;
            return(
            <div id="admin-accounts">
                <Header />
                
                <h2><i>Liste des utilisateurs</i></h2>
                <div className="bg">
                    <section className="filters container">
                    <div className="fatb-inpu-border col-lg-12">
                        <label htmlFor="filter_account_email"> Filtrer par email : </label>
                        <input type="text" placeholder="Entrer un email"
                        name="filter_account_email"
                        onChange={this.handleInputChange}
                        />
                        <span className="focus-border"></span>
                    </div>
                    <div className="justify-content-center row">
                        <div className="role-section col-lg-5 col-sm-12">
                            <label htmlFor="filter_account_role"> Role : </label>
                            <div className="select-filter">
                                <select name="filter_account_role" id="filter_account_role" onChange={this.handleInputChange}>
                                    <option disabled>Choisir un role</option>
                                    <option value=""></option>
                                    <option value="admin">Admin</option>
                                    <option value="serveur">Serveur</option>
                                    <option value="user">Utilisateur</option>
                                </select>
                            </div>
                        </div>
                        
                        <div className="enable-section col-lg-5 col-sm-12">
                            <label htmlFor="filter_account_enable"> Compte : </label>
                            <div className="select-filter">
                                <select name="filter_account_enable" id="filter_account_enable" onChange={this.handleInputChange}>
                                    <option value=""></option>
                                    <option value="true">Activé</option>
                                    <option value="false">Désactivé</option>
                                </select>
                            </div>
                        </div>
                   </div>
                   <div className="justify-content-center row">
                        <button type="button" className="filter-btn fatb-btn-validate col-lg-5 col-sm-6" onClick={this.filterAccount}  > valider</button>
                        <button type="button" className="filter-btn fatb-btn-validate col-lg-5 col-sm-6" onClick={this.filterall}  > afficher tout </button>
                   </div>
                </section>
                
                <div className="table-responsive">
                <div class="scrollbar" id="style-1">
                    <table className="table table-striped table-dark table-hover">
                        { 
                        <thead>
                            <tr>
                            <th className="hidden-id"> Id</th>
                            <th>role</th>
                            <th scope="col">Email</th>
                            <th scope="col">Nom</th>
                            <th scope="col">Prénom</th>
                            <th scope="col">Téléphone</th>
                            <th scope="col">Compte</th>
                           {Derole==='admin' ? <th scope="col">Action</th> : ""}
                            </tr>
                        </thead> 
                        }
                        <tbody>{
                            items.length > 0   ? items.map(item => {
                            const {nom, prenom, email, tel, _id, role, enable} = item;
                            return  <tr className={role === 'admin' ? "tr-admin": ''} key={email}>
                                <td className="hidden-id">{_id}</td>
                                <td>{role === 'user' ? 'Utilisateur' : role === 'admin' ? 'Admin' : 'Serveur'}</td>
                                    <td>{email}</td>
                                    <td>{nom}</td>
                                    <td>{prenom}</td>
                                    <td>{tel}</td>
                                    <td>{
                                        isEnable === true && _id === lid ?
                                        "Activé"
                                        : 
                                        enable === true ?
                                        "Activé"
                                        : 
                                        "Désactivé"  
                                    }</td>
                                    {Derole==='admin' ? 
                                     <td>
                                        {
                                           isEnable === true && _id === lid ?
                                            <Link className="btn btn-primary admin-btn-update" to={`/account/${_id}`}>
                                                Éditer
                                            </Link> 
                                            : 
                                            enable === true ?
                                            <Link className="btn btn-primary admin-btn-update" to={`/account/${_id}`}>
                                                Éditer
                                            </Link>
                                            : enable === false ?
                                            <Link to={`/accounts`} onClick={() => this.handleEnableByAdmin(_id)}
                                            className="btn btn-success">
                                                Activer
                                            </Link> :  ""
                                        }
                                    </td> : ""
                                }
                                   
                                    
                                    {localStorage.setItem('id_account', _id)}</tr> 
                            }) : 
                                ""
                            }
                            {
                            filter_account.length > 0   ? filter_account.map(fil => {
                            const {nom, prenom, email, tel, _id, role, enable} = fil;
                            return  <tr className={role === 'admin' ? "tr-admin": ''} key={email}>
                                <td className="hidden-id">{_id}</td>
                                <td>{role === 'user' ? 'Utilisateur' : role === 'admin' ? 'Admin' : 'Serveur'}</td>
                                    <td>{email}</td>
                                    <td>{nom}</td>
                                    <td>{prenom}</td>
                                    <td>{tel}</td>
                                    <td>{
                                        isEnable === true && _id === lid ?
                                        "Activé"
                                        : 
                                        enable === true ?
                                        "Activé"
                                        : 
                                        "Désactivé"  
                                    }</td>
                                    {Derole==='admin' ? 
                                     <td>
                                        {
                                           isEnable === true && _id === lid ?
                                            <Link className="btn btn-primary admin-btn-update" to={`/account/${_id}`}>
                                                Éditer
                                            </Link> 
                                            : 
                                            enable === true ?
                                            <Link className="btn btn-primary admin-btn-update" to={`/account/${_id}`}>
                                                Éditer
                                            </Link>
                                            : enable === false ?
                                            <Link to={`/accounts`} onClick={() => this.handleEnableByAdmin(_id)}
                                            className="btn btn-success">
                                                Activer
                                            </Link> :  ""
                                        }
                                    </td> : ""
                                }
                                   
                                    
                                    {localStorage.setItem('id_account', _id)}</tr> 
                            }) : 
                          ""
                            }</tbody>
                    </table>
                    </div>
                </div>
                </div>
            </div>            
            )
        }
    }
export default Gerercomptes;