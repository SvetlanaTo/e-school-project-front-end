import React, { Component } from 'react';
import '../../style/components/form/updateForm.css';
import '../../style/components/auth/register.css';
import { PARENTS } from "../../service/api";
// import DateTimePicker from 'react-datetime-picker';


class UpdateParent extends Component {
    constructor(props) {
        super(props);
        this.state = { parent: null, errorMessage: '' };

    }

    componentDidMount() {
        if (localStorage.getItem('token') === null) {
            this.props.history.push('/login');
        }
        else if (localStorage.getItem('role') !== 'admin') {
            this.props.history.push('/no-auth');

        }
        else {
            const path = PARENTS + "/" + this.props.match.params.id;
            const requestOptions = {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem("token")
                }
            };
            fetch(path, requestOptions)
                .then(response => response.json())
                .then(data => {
                    this.setState({ parent: data })
                });
        }
    }

    handleInputChange = (event) => {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        this.setState({
            parent: { ...this.state.parent, [name]: value }

        });
    }

    handleFirstNameChange = (event) => {
        const target = event.target;
        const name = target.name;

        if (target.value === '') {
            this.setState({
                disable: true,
                errorMessage: '',
                parent: { ...this.state.parent, [name]: target.value }
            })
        }
        else if ((target.value.length < 2 || target.value.length > 50)) {
            this.setState({
                errorMessage: "First name must be between 2 and 50 characters long.",
                disable: true,
                parent: { ...this.state.parent, [name]: target.value }
            })
        }
        else {
            this.setState({
                errorMessage: "",
                disable: false,
                parent: { ...this.state.parent, [name]: target.value }
            })
        }
    }

    handleLastNameChange = (event) => {
        const target = event.target;
        const name = target.name;

        if (target.value === '') {
            this.setState({
                disable: true,
                errorMessage: '',
                parent: { ...this.state.parent, [name]: target.value }
            })
        }
        else if ((target.value.length < 2 || target.value.length > 50)) {
            this.setState({
                errorMessage: "Last name must be between 2 and 50 characters long.",
                disable: true,
                parent: { ...this.state.parent, [name]: target.value }
            })
        }
        else {
            this.setState({
                errorMessage: "",
                disable: false,
                parent: { ...this.state.parent, [name]: target.value }
            })
        }
    }

    handleUserNameChange = (event) => {
        const target = event.target;
        const name = target.name;

        if (target.value === '') {
            this.setState({
                disable: true,
                errorMessage: '',
                parent: { ...this.state.parent, [name]: target.value }
            })
        }
        else if ((target.value.length < 4 || target.value.length > 50)) {
            this.setState({
                errorMessage: "Username must be between 4 and 50 characters long.",
                disable: true,
                parent: { ...this.state.parent, [name]: target.value }
            })
        }
        else {
            this.setState({
                errorMessage: "",
                disable: false,
                parent: { ...this.state.parent, [name]: target.value }
            })
        }
    }



    handleEmailChange = (event) => {
        const target = event.target;
        const name = target.name;

        if (target.value === '') {
            this.setState({
                disable: true,
                errorMessage: '',
                parent: { ...this.state.parent, [name]: target.value }
            })
        }
        else if (!target.value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i)) {
            this.setState({
                errorMessage: "A valid e-mail address is required.",
                disable: true,
                parent: { ...this.state.parent, [name]: target.value }
            })
        }
        else {
            this.setState({
                errorMessage: "",
                disable: false,
                parent: { ...this.state.parent, [name]: target.value }
            })
        }
    }

    handleJmbgChange = (event) => {
        const target = event.target;
        const name = target.name;

        if (target.value === '') {
            this.setState({
                disable: true,
                errorMessage: '',
                parent: { ...this.state.parent, [name]: target.value }
            })
        }
        else if (target.value !== '' && target.value.length !== 13) {

            this.setState({
                disable: true,
                errorMessage: `JMBG must be exactly 13 characters long.`,
                parent: { ...this.state.parent, [name]: target.value }
            })
        }
        else {
            this.setState({
                errorMessage: "",
                disable: false,
                parent: { ...this.state.parent, [name]: target.value }
            })
        }
    }

    handleSubmit = (event) => {
        const requestOptions = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem("token")
            },
            body: JSON.stringify({

                ID: this.state.parent.ID,
                FirstName: this.state.parent.FirstName,
                LastName: this.state.parent.LastName,
                Email: this.state.parent.Email,
                UserName: this.state.parent.UserName,
                PhoneNumber: this.state.parent.PhoneNumber,
                Jmbg: this.state.parent.Jmbg,
                EmailConfirmed: this.state.parent.EmailConfirmed,
                PhoneNumberConfirmed: this.state.parent.PhoneNumberConfirmed,

            })
        };

        const path = PARENTS + "/" + this.state.parent.ID;
        fetch(path, requestOptions)
            .then(response => {
                if (response.ok) {
                    response.json().then(data => {
                        this.setState({ errorMessage: '' })
                        this.props.history.push("/parents-album");
                    });
                } else {
                    response.text().then(message => this.setState({ errorMessage: message }))
                }
            })
            .catch(error => console.log(error))
        event.preventDefault();

    };



    render() {
        return (
            <div className="row">
                <div className="register_together">


                    {
                        this.state.parent &&
                        <form onSubmit={this.handleSubmit} className="register">
                            <div>
                                <h3>Change parent information</h3>
                            </div>
                            <input
                                type="text"
                                name="FirstName"
                                placeholder="Change first name"
                                value={this.state.parent.FirstName}
                                onChange={this.handleFirstNameChange}
                                required />

                            <input
                                type="text"
                                name="LastName"
                                placeholder="Change last name"
                                value={this.state.parent.LastName}
                                onChange={this.handleLastNameChange}
                                required />

                            <input
                                type="text"
                                name="UserName"
                                placeholder="Change username"
                                value={this.state.parent.UserName}
                                onChange={this.handleUserNameChange}
                                required />

                            <input
                                type="email"
                                name="Email"
                                placeholder="Change email"
                                value={this.state.parent.Email}
                                onChange={this.handleEmailChange}
                                required />

                            <label>Email Confirmed</label>
                            <input
                                name="EmailConfirmed"
                                type="checkbox"
                                checked={this.state.parent.EmailConfirmed}
                                value={this.state.parent.EmailConfirmed}
                                onChange={this.handleInputChange} />

                            <input
                                type="text"
                                name="Jmbg"
                                placeholder="Change JMBG"
                                value={this.state.parent.Jmbg}
                                onChange={this.handleJmbgChange}
                                required />



                            <input
                                type="text"
                                name="PhoneNumber"
                                placeholder="Change Phone Number"
                                value={this.state.parent.PhoneNumber}
                                onChange={this.handleInputChange}
                            />

                            <label>Phone Number Confirmed</label>
                            <input
                                name="PhoneNumberConfirmed"
                                type="checkbox"
                                checked={this.state.parent.PhoneNumberConfirmed}
                                value={this.state.parent.PhoneNumberConfirmed}
                                onChange={this.handleInputChange}
                            />




                            <input type="submit" value="Change" className="submit" />
                            <input type="button" value="Cancel" className="cancel" onClick={() => this.props.history.push("/parents-album")} />
                            <label className="error">{this.state.errorMessage}</label>

                        </form>


                    }

                </div>
            </div>



        )
    }
};

export default UpdateParent;