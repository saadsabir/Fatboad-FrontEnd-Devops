import React, { Component } from 'react';
import CanvasJSReact from '../../../assets/js/canvasjs.react.js';
import Header from '../../header/header.jsx';
import './stats.scss';
var CanvasJSChart = CanvasJSReact.CanvasJSChart;
const API = process.env.REACT_APP_API_URL;

class Stats extends Component {
  constructor(props) {
    super(props);
    this.state = {
      account_active: '',
      account_nonactive: '',
    };
    // this.handleBigwinner = this.handleBigwinner.bind(this);
  }
  // Activate an account
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

    // accounts stats
    fetch(`https://api.fatboarrestaurant.com/accounts/getstataccounts`, {
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
        var statsaccount = res.result;
        if (res.success === true) {
          // console.log("chart ", res);
          for (var i = 0; i < statsaccount.length; i++) {
            if (statsaccount[i]._id === true) {
              this.setState({ account_active: statsaccount[i].total });
            } else {
              this.setState({ account_nonactive: statsaccount[i].total });
            }
          }
        }
      });

    // Tickets stats
    fetch(`https://api.fatboarrestaurant.com/tickets/getstattickets`, {
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
        var statstickets = res.result;
        if (res.success === true) {
          // console.log("chart ", res);
          for (var i = 0; i < statstickets.length; i++) {
            if (statstickets[i]._id === true) {
              this.setState({ tickets_used: statstickets[i].total });
            } else {
              this.setState({ tickets_notused: statstickets[i].total });
            }
          }
        }
      });

    // Gains stats
    fetch(`https://api.fatboarrestaurant.com/gains/getstatgains`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${tok}`,
      },
    })
      .then(results => {
        return results.json();
      })

      .then(({ result, success }) =>
        success
          ? result
              .map(({ _id, total }) => ({ x: 10, y: total, label: _id }))
              .map((obj, i) => ({ ...obj, x: obj.x + i }))
          : []
      )
      .then(dataPoints => this.setState({ dataPoints }));
  }
  render() {
    var {
      account_active,
      account_nonactive,
      tickets_used,
      tickets_notused,
      dataPoints,
    } = this.state;

    const options_account = {
      animationEnabled: true,
      exportEnabled: true,
      backgroundColor: '#000',
      width: 400,
      legend: {
        horizontalAlign: 'center',
        verticalAlign: 'bottom',
        fontSize: 15,
        fontColor: '#ccc',
        fontweight: 'bold',
      },
      data: [
        {
          type: 'pie',
          indexLabel: '{label}: {y}',
          startAngle: -90,
          indexLabelFontColor: '#ccc',
          indexLabelFontSize: 15,
          showInLegend: true,
          dataPoints: [
            { label: 'activé', y: account_active, legendText: 'Activé' },
            {
              label: 'désactivé',
              y: account_nonactive,
              legendText: 'Désactivé',
            },
          ],
        },
      ],
    };
    //Tickets stats
    const options_tickets = {
      animationEnabled: true,
      exportEnabled: true,
      backgroundColor: '#000',
      width: 400,
      legend: {
        horizontalAlign: 'center',
        verticalAlign: 'bottom',
        fontSize: 15,
        fontColor: '#ccc',
        fontweight: 'bold',
      },
      data: [
        {
          type: 'doughnut',
          indexLabelFontColor: '#ccc',
          indexLabelFontSize: 15,
          showInLegend: true,
          indexLabel: '{label}: {y}',
          startAngle: -90,
          dataPoints: [
            { label: 'utilisé', y: tickets_used, legendText: 'Utilisé' },
            {
              label: 'non utilisé',
              y: tickets_notused,
              legendText: 'Non utilisé',
            },
          ],
        },
      ],
    };

    //Gains stats
    const options_gains = {
      backgroundColor: '#000',
      exportEnabled: true,
      colorSet: 'greenShades',
      axisX: {
        labelFontColor: '#ccc',
        labelFontSize: 15,
        labelAngle: -50,
      },
      axisY: {
        labelFontColor: '#ccc',
        labelFontSize: 15,
      },
      legend: {
        verticalAlign: 'bottom',
        horizontalAlign: 'center',
      },
      data: [
        {
          indexLabel: '{y}',
          indexLabelFontColor: 'white',
          type: 'column',
          legendMarkerType: 'none',
          dataPoints,
        },
      ],
    };
    return (
      <section id="stats">
        <Header />
        <div className="container content-fix graph-content-div">
          <div className="graphs row">
            <div
              className="col-lg-12 col-md-12 col-sm-12 the-graph graph-gains chartContainer"
              data-pause="hover"
            >
              <h2 className="title-graph">
                <i>Statistiques des gains</i>
              </h2>
              <CanvasJSChart className="d-block" options={options_gains} />
            </div>
            <div
              className="col-lg-6 col-md-6 col-sm-12 the-graph graph-tickets chartContainer"
              data-pause="hover"
            >
              <h2 className="title-graph">
                <i>Statistiques des tickets</i>
              </h2>
              <CanvasJSChart className="d-block" options={options_tickets} />
            </div>
            <div
              className="col-lg-6 col-md-6 col-sm-12 the-graph graph-account chartContainer"
              data-pause="hover"
            >
              <h2 className="title-graph">
                <i>Statistiques des comptes</i>
              </h2>
              <CanvasJSChart className="d-block" options={options_account} />
            </div>
          </div>
        </div>
      </section>
    );
  }
}
export default Stats;
