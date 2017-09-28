import React, { Component } from "react";
import {render} from "react-dom";

import  Home  from './components/Home.js';

class App extends Component {
    constructor() {
        super();
        this.state = {
                car_maker_list: [],
                car_model_list: [],
                year: []
        };
    }
    
    /*call all components to set the initial state or call */
    componentWillMount(){
       
        if(this.state.year.length === 0){
            
            this.generateYear()
        }

        if(this.state.car_maker_list.length === 0){
            this.generateCarMaker()
         
        }
        
    }

    generateYear(){
        const year = [];
        
         for(let i = 0; i <= 20; i++){
            year.push(1996+i);
            
         }
         this.state.year = year;
       
    }

    generateCarMaker(){

        const URL = 'https://autosure.mybluemix.net/api/makes';

        fetch(URL, {method: 'GET'})
        .then(response => response.json())
        .then(json => {
            const car_maker_list = [];
            for(let car of json){
                car_maker_list.push(car.car_make);
            }

            this.setState({car_maker_list});
        })

    }


    render() {

   
        return (
            <section className="container">
           
            <div className="jumbotron">
                <div className="row">
                    <div className="col-md-6">
                    <h1 className="display-3">Be Insured</h1>
                    <p className="lead">This is a simple hero unit, a simple jumbotron-style component for calling extra attention to featured content or information.</p>
                </div>
                <div className="col-md-6">
                    <Home  state={this.state}/>

                
                             
                </div>
                </div>
            </div>
            <div className="jumbotron">
                
            </div>

            </section>
           
        );
    }
}

render(<App />, window.document.getElementById('app'));