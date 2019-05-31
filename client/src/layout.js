import React, { Component } from 'react';
import { withRouter } from "react-router-dom";

import 'tvirus/dist/tvirus.css';

// 父组件
class App extends Component{
    constructor(props){
        super(props);
    }
    render(){
        return (
            <section>
                {this.props.children}
            </section>
        )
    }
}

export default withRouter(App);
