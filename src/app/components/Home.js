import React, { Component } from 'react';
import NumberFormat from 'react-number-format';

export default class Home extends Component{

    constructor(props){
        super(props);
        this.state = {
            selected_car_maker: 'null',
            car_model_list: [],
            selected_car_model: null,
            car_model_full_list: [],
            selected_car_model_full_list: null,
            selected_year: 0,
            insured_value: 0
        }
    }





    shouldComponentUpdate(nextProps, nextState){
        // console.log('should component update');

        // console.log('nextState', nextState);
        //console.log(nextState.selected_car_model_full_list === null)

        if(nextState.selected_year !== 0 && nextState.selected_car_model !== null && nextState.selected_car_model_full_list !== null){
            this.computeInitialValue(nextState.selected_car_model_full_list, nextState.selected_year);
         
        }
        return true;
       
    }

    searchCarModel(car_model){
        for(let value of  this.state.car_model_full_list){
            if(car_model === value.car_model){
             return value;
             }
        }
    }



    /*function that will change the state of car_model_list and car_model_full_list based 
      on selected car manufacturer
    */ 
    generateCarModel(car_maker){

        if(car_maker === 'Hyundai'){
            car_maker = 'Huyndai';
        }

        const BASE_URL = 'https://autosure.mybluemix.net/api/models?filter[where][car_make]=';
        const FETCH_URL = `${BASE_URL}${car_maker}`;

        fetch(FETCH_URL,{method: 'GET'})
        .then(response => response.json())
        .then(json =>{
            const car_model_list = [];
            const car_model_full_list = [];
            
            for(let model of json){
                car_model_list.push(model.car_model);
                car_model_full_list.push(model);
            }

          
            this.setState({car_model_list, car_model_full_list});
        })

    }

    onChangeSelectedCar(selected_car_model){
        this.setState({selected_car_model});

        
    }

    onChangeYear(selected_year){

        this.setState({selected_year}, function(){
            console.log('successfully change year to', this.state.selected_year)
        });
    }

    onChangeSelectedCarFullListing(selected_car_model){
        
        let car = this.searchCarModel(selected_car_model);
        this.setState({selected_car_model_full_list: car});
    }



    computeInitialValue(selected_car_model_full_list, year){        
           
         const {car_make, car_model, value} = selected_car_model_full_list;


         let FETCH_URL = `https://autosure.mybluemix.net/api/compute?data={%22year%22:${year},%22value%22:${value}}`;

        fetch(FETCH_URL, {method: 'GET'})
        .then(response => response.json())
        .then(json => {
           
            this.setState({insured_value: json.value})
        })

        
    }

    render(){
        const {car_maker_list, year} = this.props.state;
        let car_model = [];
        
                if(this.state.car_model_list.length !== 0){
                    car_model = this.state.car_model_list;
                
                }
                
        let message = '';
        let additionalMessage = '';

        if(this.state.insured_value === 0) {
            message = 'Please select car year, car maker & car model';
        }else if (this.state.insured_value < 0){
            message = 'Please make sure to select a year that is not 10 years prior today';
        }
        else{
            
            additionalMessage = 'Amount insured is';
            message = <NumberFormat value={this.state.insured_value} displayType={'text'}  thousandSeparator={true} prefix={'$'}/> 
        }     
     
        return(
            <div>
                <div className="form-group">
                    <label >Car Year</label>
                    <select 
                        className="form-control" 
                        id="exampleFormControlSelect1"   
                        onChange={(event) => this.onChangeYear(event.target.value)}  

                    >
                    <option value='null' defaultValue>Select Car Year</option>
                    {
                        year.map((value,key) => {
                            return(
                                <option value={value} key={key}>{value}</option>
                            )
                        })
                    }

                    </select>
                </div> 

                <div className="form-group">
                    <label >Car Maker</label>
                    <select 
                        className="form-control" 
                        id="exampleFormControlSelect1" 
                        onChange={event => 
                            {
                                this.setState({selected_car_maker:event.target.value})
                                this.generateCarModel(event.target.value);
                            } 
                        }       
                    >
                    <option value='null' defaultValue>Select Car Maker</option>
                    {
                        car_maker_list.map((car_maker,key) => {
                            return(
                                <option value={car_maker} key={key}>{car_maker}</option>
                            )
                        })
                    }

                    </select>
                </div> 

                <div className="form-group">
                    <label >Car Model</label>
                    <select 
                        className="form-control" 
                        id="exampleFormControlSelect1"   
                        onChange={event => {
                            this.onChangeSelectedCar(event.target.value);
                            this.onChangeSelectedCarFullListing(event.target.value);  
                            }
                        }
                    >
                    <option value='null' defaultValue>Select Car Model</option>
                    {   
                        
                        car_model.map((value,key) => {
                            return(
                                <option value={value} key={key}>{value}</option>
                            )
                        })
                    }

                    </select>
                </div> 
                
                <figure className="figure">
                   
                    <figcaption className="figure-caption">
                      {additionalMessage} {message}
                    </figcaption>
                </figure>
               
                <br/>
                <p className="lead">
                <button className="btn btn-primary btn-lg" href="full#" role="button">Get Quote</button>
                </p>

            </div>
        )
    }
}