import React, { Component } from 'react';
import '../../../style/components/form/addForm.css';
import { FORMS, TEACHER_TO_SUBJECT, FTS } from "../../../service/api";

class AddClassesToForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            classes: [],
            form: [],
            formId: 0,
            errorMessage: '',
            disable: true,
            error: null,
            selectedClass: '',
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
        
            const requestOptions = {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer  ' + localStorage.getItem("token")
                }
            };
            const path = FORMS + "/" + this.props.match.params.id;
            console.log(path)
            fetch(path, requestOptions)
                .then(response => {
                    if (response.ok) {
                        response.json().then(data =>
                            this.setState({
                                form: data,
                                formId: data.ID,
                            })
                        )
                    } else {
                        response.text().then(message => alert(message))
                    }
                })
                .catch(error => console.log(error))


            const requestForTS = {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem("token")
                }
            };

const pathForClassesWithTheSameGradeAsTheFormId = TEACHER_TO_SUBJECT + "/for-form/" + this.props.match.params.id + "/grade";

            fetch(pathForClassesWithTheSameGradeAsTheFormId, requestForTS)              
            .then(response => response.json())
            .then(data => {
                if(data.length > 0) {
                    this.setState({ 
                        classes: data,
                    });
                }
                else {
                    this.setState({ 
                        classes: [],
                    alert(`Currently, the list of classes for this grade is empty.`)
                }
                
            })
            .catch(reason => console.log(reason));


        }
    } 

    handleSelectChange = (event) => {
        const target = event.target;
        const name = target.name;

        if (target.value === '') {
            this.setState({ disable: true, errorMessage: '' })
        }
        else {
            this.setState({
                errorMessage: "",
                disable: false,
                [name]: target.value
            })
        }
    }


    handleSubmit = (event) => {

        event.preventDefault();
        const formId = this.state.form.ID;
        const newTSId = this.state.selectedClass;
        console.log(this.state.selectedClass, newTSId)


        const r = window.confirm(`
    
        Are you sure?`);

        if (r === true) {
           
            console.log('usli')
            const path = FTS + "/form/" + formId + "/teacher-to-subject/" + this.state.selectedClass;
            console.log(path);

            const requestOptions = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer  ' + localStorage.getItem("token")
                },
            }

            fetch(path, requestOptions)
                .then(response => {
                    if (response.ok) {
                        const r = window.confirm(`
                        Success! 
                        Do you wish to continue assigning classes to this form?`);

                        if (r === false) {
                            this.setState({ errorMessage: '' });
               
                            this.props.history.push("/forms");
                        }
                        else {
                            response.json().then(data => {
                                this.setState({
                                    errorMessage: '',
                                    formId: formId,
                                    selectedClass: ''
                                })
                            });
                        }

                    } else {
                        response.text().then(message => this.setState({ errorMessage: message }));
                    }
                })
                .catch(error => console.log(error));

        }
        else {
            console.log('what to do?');
        }

    };

    goBack = () => {
        this.props.history.push(`formClasses/${this.state.form.ID}`);
    }


    render() {
        return (
            <div className="add_form_wrapper">
           
                <form onSubmit={this.handleSubmit}>
                {this.state.classes &&
                    <label>
                        Pick the new class for the form {this.state.form.Grade}-{this.state.form.Tag}:
                       

                    <select
                        value={this.state.selectedClass}
                        onChange={this.handleSelectChange}
                        name="selectedClass"
                        required >                  
                       <option disabled hidden value=''>Classes...</option>
                        {
                            this.state.classes.map((s) =>
                                <option value={s.ID} key={s.ID}>{s.Subject.Name} for {s.Subject.Grade}. grade, {s.Teacher.FirstName} {s.Teacher.LastName}</option>
                            )

                        }

                    </select>
                    </label>
                     }
                    <input type="submit" value="Assign" className="submit" disabled={this.state.disable}/>
                    <input type="button" value="Cancel" className="cancel" onClick={() => this.props.history.push("/forms")} />
                    <label className="error">{this.state.errorMessage}</label>
               
                </form>
           
            </div>

        )
    }
};

export default AddClassesToForm;