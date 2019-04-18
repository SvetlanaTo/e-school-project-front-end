import React, { Component } from 'react';
import '../../../style/components/form/updateForm.css';
import { FORMS } from "../../../service/api";
import { TEACHERS } from "../../../service/api";


class UpdateForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            form: null,
            teachers: [],
            errorMessage: '',
            disable: false,
            error: null,
            AttendingTeacherId: '',

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
            const path = FORMS + "/" + this.props.match.params.id;
            const requestOptions = {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer  ' + localStorage.getItem("token")
                }
            };
            fetch(path, requestOptions)
                .then(response => response.json())
                .then(data => {
                    this.setState({
                        form: data,
                        AttendingTeacherId: data.AttendingTeacher.ID,
                    })
                });

            const requestForTeachers = {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem("token")
                }
            };
            fetch(TEACHERS, requestForTeachers)
                .then(response => response.json())
                .then(data => {
                    this.setState({ teachers: data })
                });
        }

        const ispisi = this.state.form
        console.log(ispisi)

    }

    handleInputChange = (event) => {
        const target = event.target;
        const name = target.name;

        this.setState({
            form: { ...this.state.form, [name]: target.value }
        });
    }

    handleAttendingTeacherChange = (event) => {
        const target = event.target;
        const name = target.name;


        this.setState({
            errorMessage: "",
            disable: false,
            [name]: target.value,
        })
    }


    handleGradeChange = (event) => {
        const target = event.target;
        const name = target.name;

        if (target.value === '') {
            this.setState({
                disable: true,
                errorMessage: '',
                form: { ...this.state.form, [name]: target.value }
            })
        }
        else if (target.value !== '' && (target.value < 1 || target.value > 8)) {
            this.setState({
                errorMessage: "Grade must be a number between 1 and 8.",
                disable: true,
                form: { ...this.state.form, [name]: target.value }
            })
        }
        else {
            this.setState({
                errorMessage: "",
                disable: false,
                form: { ...this.state.form, [name]: target.value }
            })
        }
    }

    handleTagChange = (event) => {
        const target = event.target;
        const name = target.name;

        if (target.value === '') {
            this.setState({
                disable: true,
                errorMessage: '',
                form: { ...this.state.form, [name]: target.value }
            })
        }
        else if ((target.value.length !== 1)) {
            this.setState({
                errorMessage: "Tag must be exactly one character long.",
                disable: true,
                form: { ...this.state.form, [name]: target.value }
            })
        }
        else {
            this.setState({
                errorMessage: "",
                disable: false,
                form: { ...this.state.form, [name]: target.value }
            })
        }
    }

    handleSubmit = (event) => {
        const requestOptions = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer  ' + localStorage.getItem("token")
            },
            body: JSON.stringify({
                ID: this.state.form.ID,
                Grade: this.state.form.Grade,
                Tag: this.state.form.Tag,
                AttendingTeacherId: this.state.AttendingTeacherId

            })

        };
        console.log('body:', requestOptions);
        const path = FORMS + "/" + this.state.form.ID;
        fetch(path, requestOptions)
            .then(response => {
                if (response.ok) {
                    alert("Success!");
                    response.json().then(data => {
                        this.setState({ errorMessage: '' })
                        this.props.history.push("/forms");
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
            <div className="update_form_wrapper">
                {
                    this.state.form &&
                    <form onSubmit={this.handleSubmit}>
                        <input
                            type="number"
                            name="Grade"
                            placeholder="Change Grade"
                            value={this.state.form.Grade}
                            onChange={this.handleGradeChange} />

                        <input
                            type="text"
                            name="Tag"
                            placeholder="Change Tag"
                            value={this.state.form.Tag}
                            onChange={this.handleTagChange}
                            required />

                        <label>
                            Change the Attending Teacher:
                            </label>
                        <select
                            value={this.state.AttendingTeacherId}
                            onChange={this.handleAttendingTeacherChange}
                            name="AttendingTeacherId">
                            {
                                this.state.teachers.map((s) =>
                                    <option value={s.ID} key={s.ID}>{s.ID}. {s.FirstName} {s.LastName}</option>
                                )
                            }

                        </select>


                        <input type="submit" value="Change" className="submit" disabled={this.state.disable} />
                        <input type="button" value="Cancel" className="formTable_btn-nop" onClick={() => this.props.history.push("/forms")} />
                        <label className="error">{this.state.errorMessage}</label>
                    </form>
                }

            </div>

        )
    }
};

export default UpdateForm;