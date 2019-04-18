import React, { Component } from 'react';

class Logger2 extends Component {
    constructor(props) {
        super(props);
        this.state = {
            log: ''
        }
    }

    componentDidMount() {
        if (localStorage.getItem('token') === null) {
            this.props.history.push('/login');
        }
        else if (localStorage.getItem('role') !== 'admin') {
            this.props.history.push('/no-auth');
        }
        else {
            const requestOptions = {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem("token")
                }
            };
    
            fetch("http://localhost:54164/project/logs/from/2/days-ago", requestOptions)
                .then(response => {
                    if (response.ok) {
                        response.json().then(data =>
                            this.setState({ log: data })
                        )
                    } else {
                        response.text().then(message => alert(message))
                    }
                })
                .catch(error => console.log(error));
        }
    }

    render() {

        return (
            <div className='logger-page'>  
            {this.state.log}
            </div>
           
        )

    }
}

export default Logger2;