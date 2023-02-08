import React, { Component } from 'react';
import { reject } from 'q';
import './bigwinner.scss';
const API = process.env.REACT_APP_API_URL;

class Gerercomptes extends Component {
  constructor(props) {
    super(props);
    this.state = {
      IsWinner: false,
      TheWinner: '',
    };
    this.handleBigwinner = this.handleBigwinner.bind(this);
  }
  // Activate an account
  handleBigwinner(e) {
    const head = localStorage.getItem('head');
    const payload = localStorage.getItem('payload');
    const signature = localStorage.getItem('signature');
    var tok = head + '.' + payload + '.' + signature;
    e.preventDefault();

    fetch(`https://api.fatboarrestaurant.com/gains/setbigwinner`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${tok}`,
      },
    })
      .then(res => res.json())
      .then(json => {
        if (json.result.length !== 0) {
          this.setState({ IsWinner: 'true' });
          this.setState({ TheWinner: json.result[0].emailAccount });
        } else {
          this.setState({ IsWinner: 'false' });
        }
      })
      .then(resultats => this.setState(resultats))
      .catch(error => {
        reject(error);
      });
  }
  render() {
    var { IsWinner, TheWinner } = this.state;
    return (
      <section id="Thewinner">
        <button className="tirage-btn" onClick={this.handleBigwinner}>
          {' '}
          tirage au sort{' '}
        </button>
        {IsWinner === 'true' ? (
          <div className="alert alert-success alert-winner text-center">
            {' '}
            Le gagnant est : {TheWinner}{' '}
          </div>
        ) : IsWinner === 'false' ? (
          <div className="alert alert-danger alert-winner text-center">
            {' '}
            Il n y a aucun gagnant pour le moment !{' '}
          </div>
        ) : (
          ''
        )}
      </section>
    );
  }
}
export default Gerercomptes;
