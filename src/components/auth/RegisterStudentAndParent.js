import React, { Component } from 'react';
import '../../style/components/auth/register.css';
import { REGISTER_STUDENT_ALONE, REGISTER_STUDENT_AND_PARENT, FORMS, PARENTS } from "../../service/api";

class RegisterStudentAndParent extends Component {

    constructor(props) {
        super(props);

        this.password = React.createRef();
        this.confirmPassword = React.createRef();

        this.parentPassword = React.createRef();
        this.parentConfirmPassword = React.createRef();

        this.state = {
            UserName: '',
            FirstName: '',
            LastName: '',
            Email: '',
            Jmbg: '',
            DayOfBirth: '',
            IsActive: true,
            ParentJmbg: '',
            ParentMobilePhone: '',
            ParentFirstName: '',
            ParentLastName: '',
            ParentEmail: '',
            ParentUserName: '',
            parents: [],
            parent: null,
            forms: [],
            FormId: '',
            errorMessage: '',
            error: null,
            disable: false,
            isFindParentByJmbgOpen: true,
            isRegisterAloneOpen: false,
            isRegisterTogetherOpen: false,
            JmbgEmpty: true,
            errorMessage2: '',
            errorMessage3: '',

        };
    }

    componentDidMount() {
        if (localStorage.getItem('token') === null) {
            this.props.history.push('/login');
        }
        else if (localStorage.getItem('role') !== 'admin') {
            this.props.history.push('/no-auth');
        }
        else {
            this.fetchPage();
        }
    }

    fetchPage = () => {
        console.log('usli u fetchPage')
        const request = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem("token")
            }
        };
        fetch(PARENTS, request)
            .then(response => response.json())
            .then(data => {
                this.setState({ parents: data })
                console.log(this.state.parents);
            });

        fetch(FORMS, request)
            .then(response => response.json())
            .then(data => {
                this.setState({ forms: data })
            });

    }


    handleInputChange = (event) => {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });
        console.log(name, value)
    }

    handleFirstNameChange = (event) => {
        const target = event.target;
        const name = target.name;

        if (target.value === '') {
            this.setState({
                disable: true,
                errorMessage: '',

            })
        }
        else if ((target.value.length < 2 || target.value.length > 50) || !target.value.match("^[a-zA-Z]*$")) {
            this.setState({
                errorMessage: "First name must be between 2 and 50 characters long containing only letters.",
                disable: true,

            })
        }
        else {
            this.setState({
                errorMessage: "",
                disable: false,
                [name]: target.value

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

            })
        }
        else if ((target.value.length < 2 || target.value.length > 50) || !target.value.match("^[a-zA-Z]*$")) {
            this.setState({
                errorMessage: "Last name must be between 2 and 50 characters long containing only letters.",
                disable: true,
            })
        }
        else {
            this.setState({
                errorMessage: "",
                disable: false,
                [name]: target.value

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
            })
        }
        else if ((target.value.length < 4 || target.value.length > 50)) {
            this.setState({
                errorMessage: "Username must be between 4 and 50 characters long.",
                disable: true,

            })
        }
        else {
            this.setState({
                errorMessage: "",
                disable: false,
                [name]: target.value

            })
        }
    }

    handleFirstName2Change = (event) => {
        const target = event.target;
        const name = target.name;

        if (target.value === '') {
            this.setState({
                disable: true,
                errorMessage2: '',

            })
        }
        else if ((target.value.length < 2 || target.value.length > 50) || !target.value.match("^[a-zA-Z]*$")) {
            this.setState({
                errorMessage2: "First name for student must be between 2 and 50 characters long containing only letters.",
                disable: true,

            })
        }
        else {
            this.setState({
                errorMessage2: "",
                disable: false,
                [name]: target.value

            })
        }
    }

    handleLastName2Change = (event) => {
        const target = event.target;
        const name = target.name;

        if (target.value === '') {
            this.setState({
                disable: true,
                errorMessage2: '',

            })
        }
        else if ((target.value.length < 2 || target.value.length > 50) || !target.value.match("^[a-zA-Z]*$")) {
            this.setState({
                errorMessage2: "Last name for student must be between 2 and 50 characters long containing only letters.",
                disable: true,

            })
        }
        else {
            this.setState({
                errorMessage2: "",
                disable: false,
                [name]: target.value

            })
        }
    }

    handleUserName2Change = (event) => {
        const target = event.target;
        const name = target.name;

        if (target.value === '') {
            this.setState({
                disable: true,
                errorMessage2: '',
            })
        }
        else if ((target.value.length < 4 || target.value.length > 50)) {
            this.setState({
                errorMessage2: "Username for student must be between 4 and 50 characters long.",
                disable: true,

            })
        }
        else {
            this.setState({
                errorMessage2: "",
                disable: false,
                [name]: target.value

            })
        }
    }

    handleFirstName3Change = (event) => {
        const target = event.target;
        const name = target.name;

        if (target.value === '') {
            this.setState({
                disable: true,
                errorMessage3: '',

            })
        }
        else if ((target.value.length < 2 || target.value.length > 50) || !target.value.match("^[a-zA-Z]*$")) {
            this.setState({
                errorMessage3: "First name for parent must be between 2 and 50 characters long containing only letters.",
                disable: true,

            })
        }
        else {
            this.setState({
                errorMessage3: "",
                disable: false,
                [name]: target.value

            })
        }
    }

    handleLastName3Change = (event) => {
        const target = event.target;
        const name = target.name;

        if (target.value === '') {
            this.setState({
                disable: true,
                errorMessage3: '',

            })
        }
        else if ((target.value.length < 2 || target.value.length > 50) || !target.value.match("^[a-zA-Z]*$")) {
            this.setState({
                errorMessage3: "Last name for parent must be between 2 and 50 characters long containing only letters.",
                disable: true,

            })
        }
        else {
            this.setState({
                errorMessage3: "",
                disable: false,
                [name]: target.value

            })
        }
    }

    handleUserName3Change = (event) => {
        const target = event.target;
        const name = target.name;

        if (target.value === '') {
            this.setState({
                disable: true,
                errorMessage3: '',
            })
        }
        else if ((target.value.length < 4 || target.value.length > 50)) {
            this.setState({
                errorMessage3: "Username for parent must be between 4 and 50 characters long.",
                disable: true,

            })
        }
        else {
            this.setState({
                errorMessage3: "",
                disable: false,
                [name]: target.value

            })
        }
    }


    handleJmbgChange = (event) => {
        const target = event.target;
        const name = target.name;

        if (target.value === '') {
            this.setState({ JmbgEmpty: true, errorMessage: '' })
        }
        else if ((target.value !== '' && target.value.length !== 13) || !target.value.match(/^[\+\-]?\d*\.?\d+(?:[Ee][\+\-]?\d+)?$/)) {
            this.setState({
                disable: true,
                errorMessage: `JMBG must be exactly 13 characters long and containing only digits.`,
            })
        }
        else {
            this.setState({
                errorMessage: "",
                JmbgEmpty: false,
                [name]: target.value
            })
        }
    }

    handleStudentJmbgChange = (event) => {
        const target = event.target;
        const name = target.name;

        if (target.value === '') {
            this.setState({ disable: true, errorMessage: '' })
        }
        else if ((target.value !== '' && target.value.length !== 13) || !target.value.match(/^[\+\-]?\d*\.?\d+(?:[Ee][\+\-]?\d+)?$/)) {
            this.setState({
                disable: true, errorMessage: `Student's JMBG must be exactly 13 characters long and containing only digits.`
            })
        }
        else {
            this.setState({
                errorMessage: "",
                [name]: target.value
            })
        }
    }


    handleStudent2JmbgChange = (event) => {
        const target = event.target;
        const name = target.name;

        if (target.value === '') {
            this.setState({ disable: true, errorMessage2: '' })
        }
        else if ((target.value !== '' && target.value.length !== 13) || !target.value.match(/^[\+\-]?\d*\.?\d+(?:[Ee][\+\-]?\d+)?$/)) {
            this.setState({
                disable: true,
                errorMessage2: `Student's JMBG must be exactly 13 characters long and containing only digits.`
            })
        }
        else {
            this.setState({
                errorMessage2: "",
                disable: false,
                [name]: target.value
            })
        }
    }

    handleParentJmbgChange = (event) => {
        const target = event.target;
        const name = target.name;

        if (target.value === '') {
            this.setState({ errorMessage3: '' })
        }
        else if ((target.value !== '' && target.value.length !== 13) || !target.value.match(/^[\+\-]?\d*\.?\d+(?:[Ee][\+\-]?\d+)?$/)) {
            this.setState({ errorMessage3: `Parent's JMBG must be exactly 13 characters long and containing only digits.` })
        }
        else {
            this.setState({
                errorMessage3: "",
                [name]: target.value,

            })
        }

        console.log(name, target.value)
    }

    handleEmailChange = (event) => {
        const target = event.target;
        const name = target.name;

        if (target.value === '') {
            this.setState({
                disable: true,
                errorMessage: '',
            })
        }
        else if (!target.value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i)) {
            this.setState({
                errorMessage: "A valid e-mail address is required.",
                disable: true,
            })
        }
        else {
            this.setState({
                errorMessage: "",
                disable: false,
                [name]: target.value
            })
        }
    }

    handleEmail1Change = (event) => {
        const target = event.target;
        const name = target.name;

        if (target.value === '') {
            this.setState({
                disable: true,
                errorMessage2: '',
            })
        }
        else if (!target.value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i)) {
            this.setState({
                errorMessage2: "A valid e-mail address is required for student.",
                disable: true,
            })
        }
        else {
            this.setState({
                errorMessage2: "",
                disable: false,
                [name]: target.value

            })
        }
    }
    handleEmail2Change = (event) => {
        const target = event.target;
        const name = target.name;

        if (target.value === '') {
            this.setState({
                disable: true,
                errorMessage3: '',
            })
        }
        else if (!target.value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i)) {
            this.setState({
                errorMessage3: "A valid e-mail address is required for parent.",
                disable: true,
            })
        }
        else {
            this.setState({
                errorMessage3: "",
                disable: false,
                [name]: target.value
            })
        }
    }

    handlePhoneChange = (event) => {
        const target = event.target;
        const name = target.name;

        if (target.value === '') {
            this.setState({
                disable: true,
                errorMessage3: '',

            })
        }
        else if (!target.value.match(/^[\+\-]?\d*\.?\d+(?:[Ee][\+\-]?\d+)?$/)) {
            this.setState({
                disable: true,
                errorMessage3: `Phone number must contain only digits.`,
            })
        }
        else {
            this.setState({
                errorMessage3: "",
                disable: false,
                [name]: target.value

            })
        }
    }



    findByJmbg = (event) => {
        console.log(this.state.parents);
        const target = event.target;
        const name = target.name;

        let parent1 = this.state.parents.find(p => p.Jmbg === this.state.ParentJmbg);
        let parent2 = this.state.parents.find(p => p.Jmbg === target.value);
        console.log(parent1, parent2);

        if (parent1 !== undefined) {
            console.log("register alone")
            this.setState({
                parent: parent1,
                isFindParentByJmbgOpen: false,
                isRegisterAloneOpen: true,
                isRegisterTogetherOpen: false
            });
        }
        else {
            console.log(parent1);
            console.log("register together ")
            this.setState({
                isRegisterTogetherOpen: true,
                parent: null, //da li je potrebno?
                isFindParentByJmbgOpen: false,
                isRegisterAloneOpen: false,

            });
        }
    }

    registerStudentAlone = (event) => {
        event.preventDefault();

        if (this.confirmPassword.current.value !== this.password.current.value) {
            alert('Passwords do not match!')
        }
        else if (!this.password.current.value.match(/^((?=.*\d)(?=.*[a-z]).{5,15})$/)) {
            alert('Password must be between 5 and 15 character in length containg at least one digit and one lowercase character!')
        }
        else {
            const r = window.confirm(`
    Are you sure you want to register this person?`);
            if (r === true) {

                const requestOptions = {
                    method: 'POST',
                    headers: {
                        'Authorization': 'Bearer ' + localStorage.getItem('token'),
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        FirstName: this.state.FirstName,
                        LastName: this.state.LastName,
                        Email: this.state.Email,
                        UserName: this.state.UserName,
                        PhoneNumber: this.state.PhoneNumber,
                        Jmbg: this.state.Jmbg,
                        DayOfBirth: this.state.DayOfBirth,
                        IsActive: this.state.IsActive,
                        Password: this.password.current.value,
                        ConfirmPassword: this.confirmPassword.current.value,
                        ParentJmbg: this.state.ParentJmbg,
                        FormId: this.state.FormId

                    })

                };

                fetch(REGISTER_STUDENT_ALONE, requestOptions)
                    .then(response => {
                        if (response.ok) {

                            const r = window.confirm(`
                            Success!
    Do you wish to register another user?`);
                            if (r === true) {
                                this.setState({ errorMessage: '' })
                                window.location.reload();
                            }
                            else {
                                this.setState({ errorMessage: '' })
                                this.props.history.push("/students");
                            }

                        } else {
                            response.text().then(message => this.setState({ errorMessage: message }))
                        }
                    })
                    .catch(error => console.log(error))
            }
        }

    };

    resetRegisterAloneFieleds = () => {

        console.log('usli u reset fieleds register alone');
        console.log(this.state.FirstName)

        this.setState({
            UserName: '',
            FirstName: '',
            LastName: '',
            Email: '',
            Jmbg: '',
            DayOfBirth: '',
            FormId: ''
        });


        this.password.current.value = '';
        this.confirmPassword.current.value = '';
        console.log(this.state.FirstName)
    }

    registerStudentAndParentTogether = (event) => {

        event.preventDefault();

        if (this.confirmPassword.current.value !== this.password.current.value) {
            alert(`Student's passwords do not match!`)
        }
        else if (this.parentConfirmPassword.current.value !== this.parentPassword.current.value) {
            alert(`Parent's passwords do not match!`)
        }
        else if (!this.password.current.value.match(/^((?=.*\d)(?=.*[a-z]).{5,15})$/)) {
            alert(`Parent's password must be between 5 and 15 characters in length containg at least one digit and one lowercase character!`)
        }
        else if (!this.parentPassword.current.value.match(/^((?=.*\d)(?=.*[a-z]).{5,15})$/)) {
            alert(`Student's password must be between 5 and 15 characters in length containg at least one digit and one lowercase character!`)
        }
        else {
            const r = window.confirm(`
    Are you sure you want to register these users?`);
            if (r === true) {

                const requestOptions = {
                    method: 'POST',
                    headers: {
                        'Authorization': 'Bearer ' + localStorage.getItem('token'),
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        FirstName: this.state.FirstName,
                        LastName: this.state.LastName,
                        Email: this.state.Email,
                        UserName: this.state.UserName,
                        PhoneNumber: this.state.PhoneNumber,
                        Jmbg: this.state.Jmbg,
                        DayOfBirth: this.state.DayOfBirth,
                        IsActive: this.state.IsActive,

                        Password: this.password.current.value,
                        ConfirmPassword: this.confirmPassword.current.value,

                        ParentJmbg: this.state.ParentJmbg,
                        ParentMobilePhone: this.state.ParentMobilePhone,
                        ParentFirstName: this.state.ParentFirstName,
                        ParentLastName: this.state.ParentLastName,
                        ParentEmail: this.state.ParentEmail,
                        ParentUserName: this.state.ParentUserName,

                        ParentPassword: this.parentPassword.current.value,
                        ParentConfirmPassword: this.parentConfirmPassword.current.value,

                        FormId: this.state.FormId

                    })

                };

                fetch(REGISTER_STUDENT_AND_PARENT, requestOptions)
                    .then(response => {
                        if (response.ok) {
                            const r = window.confirm(`
                            Do you wish to register another user?`);
                            if (r === true) {
                                this.setState({ errorMessage2: '', errorMessage3: '' })
                                window.location.reload();
                            }
                            else {
                                this.setState({ errorMessage2: '', errorMessage3: '' })
                                this.props.history.push("/students");
                            }

                        } else {
                            response.text().then(message => this.setState({ errorMessage3: message }))
                        }
                    })
                    .catch(error => console.log(error))


            };
        }
    }


    render() {
        return (
            <div className="register_student_parent_form">

                {this.state.isFindParentByJmbgOpen &&
                    <div className="checkingIfParentJmbgExists">
                        <form onSubmit={this.findByJmbg}>
                            <p>Checking if parent is already registered</p>


                            <input
                                type="text"
                                name="ParentJmbg"
                                placeholder="Enter parent JMBG"
                                onChange={this.handleJmbgChange}
                                required />

                            <input type="submit" value="Submit" className="submitParentJmbgCheck" disabled={this.state.JmbgEmpty} />
                            <input type="button" value="Cancel" className="cancelParentJmbgCheck" onClick={() => this.props.history.push("/students")} />
                            <label className="error">{this.state.errorMessage}</label>
                        </form>
                    </div>
                }



                {this.state.isRegisterAloneOpen && this.state.parent !== undefined &&


                    <div className="register_student_alone">
                        <form onSubmit={this.registerStudentAlone}>
                            <h2>Parent is already registered </h2>
                            <div>
                                <div><b>Name</b> {this.state.parent.FirstName} {this.state.parent.LastName}</div>
                                <div><b>Username</b> {this.state.parent.UserName}</div>
                                <div><b>JMBG</b> {this.state.parent.Jmbg}</div>
                                <div><b>Email</b> {this.state.parent.Email}</div>
                            </div>

                            <hr></hr>
                            <h2>Enter student information</h2>
                            <div>
                                {/* <label><b>First Name</b></label> */}
                                <input
                                    type="text"
                                    name="FirstName"
                                    placeholder="Enter first name"
                                    onChange={this.handleFirstNameChange}
                                    required />

                                {/* <label><b>Last Name</b></label> */}
                                <input
                                    type="text"
                                    name="LastName"
                                    placeholder="Enter last name"
                                    onChange={this.handleLastNameChange}
                                    required />

                                {/* <label><b>Username</b></label> */}
                                <input
                                    type="text"
                                    name="UserName"
                                    placeholder="Enter username"
                                    onChange={this.handleUserNameChange}
                                    required />



                                {/* <label><b>Email</b></label> */}
                                <input
                                    type="text"
                                    name="Email"
                                    placeholder="Enter Email"
                                    onChange={this.handleEmailChange}
                                    required />

                            </div>
                            <div>
                                <input
                                    type="password"
                                    name="Password"
                                    placeholder="Enter password"
                                    // onChange={this.handlePassword} 
                                    ref={this.password}
                                    required />

                                <input
                                    type="password"
                                    name="ConfirmPassword"
                                    placeholder="Enter password again"
                                    // onChange={this.handleRepeatedPassword}
                                    ref={this.confirmPassword}
                                    required />

                                {/* <label><b>JMBG</b></label> */}
                                <input
                                    type="text"
                                    name="Jmbg"
                                    placeholder="Enter JMBG"
                                    onChange={this.handleStudentJmbgChange}
                                    required />

                                {/* <label><b>Form</b></label> */}
                                <select
                                    value={this.state.FormId}
                                    onChange={this.handleInputChange}
                                    name="FormId"
                                    required >
                                    <option disabled hidden value=''>Grade-Tag, Attending teacher</option>

                                    {
                                        this.state.forms.map((f) =>
                                            <option value={f.ID} key={f.ID}>Grade: {f.Grade}-{f.Tag}, Attending Teacher: {f.AttendingTeacher.FirstName} {f.AttendingTeacher.LastName}</option>
                                        )
                                    }

                                </select>




                            </div>


                            <div>

                                <label className="register_dob">Day Of Birth</label>
                                <input
                                    type="date"
                                    name="DayOfBirth"
                                    onChange={this.handleInputChange}
                                    required />

                            </div>

                            <input type="submit" value="Submit" className="sumbitRegisterAlone" />
                            <br />
                            <input type="button" value="Cancel" className="cancelRegisterAlone" onClick={() => this.props.history.push("/students")} />
                            <br />
                            <label className="error">{this.state.errorMessage}</label>


                        </form>
                    </div>

                }

                {this.state.isRegisterTogetherOpen &&
                    <div className="row">
                        <div className="register_together">

                            <form onSubmit={this.registerStudentAndParentTogether} className="register">
                                <div>
                                    <h2>Register student and parent together</h2>

                                    <hr></hr>
                                    <h2>Enter student information</h2>
                                    <div>
                                        <input
                                            type="text"
                                            name="FirstName"
                                            placeholder="Enter first name"
                                            onChange={this.handleFirstName2Change}
                                            required />

                                        <input
                                            type="text"
                                            name="LastName"
                                            placeholder="Enter last name"
                                            onChange={this.handleLastName2Change}
                                            required />

                                        <input
                                            type="text"
                                            name="UserName"
                                            placeholder="Enter username"
                                            onChange={this.handleUserName2Change}
                                            required />

                                        <input
                                            type="email"
                                            name="Email"
                                            placeholder="Enter email"
                                            onChange={this.handleEmail1Change}
                                            required />

                                    </div>
                                    <div>
                                        <input
                                            type="password"
                                            name="Password"
                                            placeholder="Enter password"
                                            ref={this.password}
                                            required />

                                        <input
                                            type="password"
                                            name="ConfirmPassword"
                                            placeholder="Enter password again"
                                            ref={this.confirmPassword}
                                            required />

                                        <input
                                            type="text"
                                            name="Jmbg"
                                            placeholder="Enter JMBG"
                                            onChange={this.handleStudent2JmbgChange}
                                            required />

                                        {/* <label><b>Form</b></label> */}
                                        <select
                                            value={this.state.FormId}
                                            onChange={this.handleInputChange}
                                            name="FormId"
                                            required >
                                            <option disabled hidden value=''>Grade-Tag, Attending teacher</option>

                                            {
                                                this.state.forms.map((f) =>
                                                    <option value={f.ID} key={f.ID}>Grade: {f.Grade}-{f.Tag}, Attending Teacher: {f.AttendingTeacher.FirstName} {f.AttendingTeacher.LastName}</option>
                                                )
                                            }

                                        </select>

                                    </div>

                                    <div>
                                        <label className="register_dob">Day Of Birth</label>
                                        <input
                                            type="date"
                                            name="DayOfBirth"
                                            onChange={this.handleInputChange}
                                            required />
                                    </div>


                                    <br />
                                    <label className="error">{this.state.errorMessage2}</label>
                                </div>

                                <div>
                                    <hr></hr>
                                    <h2>Enter parent information</h2>

                                    <input
                                        type="text"
                                        name="ParentFirstName"
                                        placeholder="Enter ParentFirstName"
                                        onChange={this.handleFirstName3Change}
                                        required />

                                    <input
                                        type="text"
                                        name="ParentLastName"
                                        placeholder="Enter ParentLastName"
                                        onChange={this.handleLastName3Change}
                                        required />

                                    <input
                                        type="text"
                                        name="ParentUserName"
                                        placeholder="Enter ParentUserName"
                                        onChange={this.handleUserName3Change}
                                        required />

                                    <input
                                        type="email"
                                        name="ParentEmail"
                                        placeholder="Enter ParentEmail"
                                        onChange={this.handleEmail2Change}
                                        required />


                                    <input
                                        type="password"
                                        name="ParentPassword"
                                        placeholder="Enter ParentPassword"
                                        ref={this.parentPassword}
                                        required />

                                    <input
                                        type="password"
                                        name="ParentConfirmPassword"
                                        placeholder="Enter ParentPassword again"
                                        ref={this.parentConfirmPassword}
                                        required />

                                    <input
                                        type="text"
                                        name="ParentJmbg"
                                        placeholder="Enter ParentJmbg"
                                        onChange={this.handleParentJmbgChange}
                                        required />

                                    <input
                                        type="text"
                                        name="ParentMobilePhone"
                                        placeholder="Enter ParentMobilePhone"
                                        onChange={this.handlePhoneChange} />
                                </div>


                                <input type="submit" value="Submit" className="sumbitRegisterAlone" disabled={this.state.disable} />
                                <input type="button" value="Cancel" className="cancelRegisterAlone" onClick={() => this.props.history.push("/students")} />
                                <label className="error">{this.state.errorMessage3}</label>
                            </form>

                        </div>
                    </div>
                }


            </div>
        )
    }
};

export default RegisterStudentAndParent;