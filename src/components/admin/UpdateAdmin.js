import React, { Component } from 'react';
import { ADMINS } from "../../service/api";

class UpdateAdmin extends Component {
    constructor(props) {
        super(props);
        this.state = { admin: null, errorMessage: '' };

    }

    componentDidMount() {
        if (localStorage.getItem('token') === null) {
            this.props.history.push('/login');
        }
        else if (localStorage.getItem('role') !== 'admin') {
            this.props.history.push('/no-auth');

        }
        else {
            const path = ADMINS + "/" + this.props.match.params.id;
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
                    this.setState({ admin: data })
                });
        }
    }

    handleInputChange = (event) => {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        this.setState({
            admin: { ...this.state.admin, [name]: value }
        });
    }

    handleFirstNameChange = (event) => {
        const target = event.target;
        const name = target.name;

        if (target.value === '') {
            this.setState({
                disable: true,
                errorMessage: '',
                admin: { ...this.state.admin, [name]: target.value }
            })
        }
        else if ((target.value.length < 2 || target.value.length > 50) || !target.value.match("^[a-zA-Z]*$")) {
            this.setState({
                errorMessage: "First name must be between 2 and 50 characters long containing only letters.",
                disable: true,
                admin: { ...this.state.admin, [name]: target.value }
            })
        }
        else {
            this.setState({
                errorMessage: "",
                disable: false,
                admin: { ...this.state.admin, [name]: target.value }
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
                admin: { ...this.state.admin, [name]: target.value }
            })
        }
        else if ((target.value.length < 2 || target.value.length > 50) || !target.value.match("^[a-zA-Z]*$")) {
            this.setState({
                errorMessage: "Last name must be between 2 and 50 characters long containing only letters.",
                disable: true,
                admin: { ...this.state.admin, [name]: target.value }
            })
        }
        else {
            this.setState({
                errorMessage: "",
                disable: false,
                admin: { ...this.state.admin, [name]: target.value }
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
                admin: { ...this.state.admin, [name]: target.value }
            })
        }
        else if ((target.value.length < 4 || target.value.length > 50)) {
            this.setState({
                errorMessage: "Username must be between 4 and 50 characters long.",
                disable: true,
                admin: { ...this.state.admin, [name]: target.value }
            })
        }
        else {
            this.setState({
                errorMessage: "",
                disable: false,
                admin: { ...this.state.admin, [name]: target.value }
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
                admin: { ...this.state.admin, [name]: target.value }
            })
        }
        else if (!target.value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i)) {
            this.setState({
                errorMessage: "A valid e-mail address is required.",
                disable: true,
                admin: { ...this.state.admin, [name]: target.value }
            })
        }
        else {
            this.setState({
                errorMessage: "",
                disable: false,
                admin: { ...this.state.admin, [name]: target.value }
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
                admin: { ...this.state.admin, [name]: target.value }
            })
        }
        else if ((target.value !== '' && target.value.length !== 13) || !target.value.match(/^[\+\-]?\d*\.?\d+(?:[Ee][\+\-]?\d+)?$/)) {
            this.setState({
                disable: true,
                errorMessage: `JMBG must be exactly 13 characters long and containing only digits.`,
                admin: { ...this.state.admin, [name]: target.value }
            })
        }
        else {
            this.setState({
                errorMessage: "",
                disable: false,
                admin: { ...this.state.admin, [name]: target.value }
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
                ID: this.state.admin.Id,
                FirstName: this.state.admin.FirstName,
                LastName: this.state.admin.LastName,
                Email: this.state.admin.Email,
                UserName: this.state.admin.UserName,
                PhoneNumber: this.state.admin.PhoneNumber,
                Jmbg: this.state.admin.Jmbg,
                EmailConfirmed: this.state.admin.EmailConfirmed,
                PhoneNumberConfirmed: this.state.admin.PhoneNumberConfirmed,


            })
        };

        const path = ADMINS + "/" + this.state.admin.Id;
        fetch(path, requestOptions)
            .then(response => {
                if (response.ok) {
                    response.json().then(data => {
                        this.setState({ errorMessage: '' })
                        this.props.history.push("/admins");
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
            <div className="register_admin_form">

                {
                    this.state.admin &&
                    <form onSubmit={this.handleSubmit}>
                        <h3 className="register_admin_h3" >Change admin information</h3>
                        <input
                            className='reg_admin_input'
                            type="text"
                            name="FirstName"
                            placeholder="Change first name"
                            value={this.state.admin.FirstName}
                            onChange={this.handleFirstNameChange}
                            required />

                        <input
                            className='reg_admin_input'
                            type="text"
                            name="LastName"
                            placeholder="Change last name"
                            value={this.state.admin.LastName}
                            onChange={this.handleLastNameChange}
                            required />

                        <input
                            className='reg_admin_input'
                            type="text"
                            name="UserName"
                            placeholder="Change username"
                            value={this.state.admin.UserName}
                            onChange={this.handleUserNameChange}
                            required />

                        <input
                            className='reg_admin_input'
                            type="email"
                            name="Email"
                            placeholder="Change email"
                            value={this.state.admin.Email}
                            onChange={this.handleEmailChange}
                            required />

                        <input
                            className='reg_admin_input'
                            name="EmailConfirmed"
                            type="checkbox"
                            checked={this.state.admin.EmailConfirmed}
                            value={this.state.admin.EmailConfirmed}
                            onChange={this.handleInputChange} /> Email Confirmed

                        <input
                            className='reg_admin_input'
                            type="text"
                            name="Jmbg"
                            placeholder="Change JMBG"
                            value={this.state.admin.Jmbg}
                            onChange={this.handleJmbgChange}
                            required />



                        <input
                            className='reg_admin_input'
                            type="text"
                            name="PhoneNumber"
                            placeholder="Change Phone Number"
                            value={this.state.admin.PhoneNumber}
                            onChange={this.handleInputChange}
                        />

                        <input
                            className='reg_admin_input'
                            name="PhoneNumberConfirmed"
                            type="checkbox"
                            checked={this.state.admin.PhoneNumberConfirmed}
                            value={this.state.admin.PhoneNumberConfirmed}
                            onChange={this.handleInputChange}
                        /> Phone Number Confirmed


                        <input type="submit" value="Change" className="submitAdminRegister" />
                        <input type="button" value="Cancel" className="cancelAdminRegister" onClick={() => this.props.history.push("/admins")} />
                        <label className="error">{this.state.errorMessage}</label>

                    </form>
                }



            </div>

        )
    }
};

export default UpdateAdmin;