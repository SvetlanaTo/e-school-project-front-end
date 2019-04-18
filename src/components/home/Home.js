import React, { Component } from 'react';
import '../../style/components/home/home.css';

class Home extends Component {

    componentDidMount() {
        const currentUser = localStorage.getItem("token");
        if (!currentUser) {
            this.props.history.push("/login");
        }
    }
    render() {
        return (

            <div className="app">
                <div className="app_title">Welcome, {localStorage.getItem('name')}</div>
                <div className="app_text">Your application has been successfully started</div>
            </div>
        );
    }
}

export default Home;