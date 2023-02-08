import React from 'react';
import PageNotFound from '../../assets/img/404.gif';
import Header from '../header/header.jsx';
import './404.scss';

class NotFoundPage extends React.Component{
    render(){
        return (
             <div className="NotFoutdPage">
                <Header />
                <div className="NotFoutdPage_body">
                    <img src={PageNotFound} alt="not found gif" title="no found image" />
                    <a class="backtohome" href="/"> Revenir à l'accueil </a>
                </div>
            </div>
        )
    }
}
export default NotFoundPage;