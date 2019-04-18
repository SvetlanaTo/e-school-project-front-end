import React, { Component } from 'react';
import { STUDENTS, MARKS, IMAGEPATH, FORMS, FTS, PARENTS, ACCOUNT } from "../../../service/api";
import '../../../style/components/student/studentid.css';
import '../../../style/components/student/student_profile_adminview.css';
import Modal from '../../common/Modal';


class StudentId extends Component {
    constructor(props) {
        super(props);

        this.searchedMarkDate = React.createRef();
        this.searchedMarkValue = React.createRef();
        this.searchedSubject = React.createRef();

        this.oldPassword = React.createRef();
        this.password = React.createRef();
        this.confirmPassword = React.createRef();

        this.fileInput = React.createRef();

        this.state = {
            student: '',
            errorMessage: '',
            url: IMAGEPATH,
            isStudentInputDisabled: true,
            isFormInputDisabled: true,
            isAboutDisabled: false,
            isFormDisabled: true,
            isMarksDisabled: true,
            isParentDisabled: true,
            forms: [],
            selectedFormId: 0,
            marks: [],
            isMarkUpdateDisabled: true,
            markID: 0,
            mark: [],
            MarkValue: 0,
            disableMarkChangeButton: false,
            TeacherID: '',
            ftsList: [],
            selectedFTSId: 0,
            errorMessageForAdd: '',
            disableMarkAddButton: true,
            newMarkForPushing: [],
            parents: [],
            selectedParentId: '',
            isParentInputDisabled: true,
            disableSubmitPassChange: false,
            isStudentPasswordChangeDisabled: true,
            isModalForImgUploadOpened: false,

        };
        this.fileInput = React.createRef();
    }



    componentDidMount() {
        if (localStorage.getItem('token') === null) {
            this.props.history.push('/login');
        }
        else if (localStorage.getItem('role') !== 'admin') {
            this.props.history.push('/no-auth');

        }
        else {
            this.fetchStudent();
            this.fetchForms();
            this.fetchParents();
        }

    }

    fetchStudent = () => {

        console.log('usli u fetch student')
        const path = STUDENTS + "/" + this.props.match.params.id;
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
                this.setState({
                    student: data,
                    studentId: data.ID,
                })
            });
    }

    fetchForms = () => {
        const path2 = FORMS;
        console.log("path to FORMS: ", path2);

        const requestForForms = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem("token")
            }
        };
        fetch(path2, requestForForms)
            .then(response => response.json())
            .then(data => {
                this.setState({ forms: data })
            });
        console.log('forms:', this.state.forms);
    }



    fetchParents = () => {
        const path2 = PARENTS;
        console.log("path to PARENTS: ", path2);

        const requestForParents = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem("token")
            }
        };
        fetch(path2, requestForParents)
            .then(response => response.json())
            .then(data => {
                this.setState({ parents: data })
            });
        console.log('forms:', this.state.forms);
    }


    fetchMarks(id) {
        const pathForMarks = MARKS + '/by-student/' + id;
        const requestForMarks = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem("token")
            }
        };
        fetch(pathForMarks, requestForMarks)
            .then(response => {
                if (response.ok) {
                    response.json().then(data => {
                        this.setState({
                            errorMessage: '',
                            marks: data
                        });
                    });
                }
                else {
                    response.text().then(message => this.setState({ errorMessage: message }));
                }
            })
            .catch(error => console.log(error));

        const pathForFTS = FTS + '/by-student/' + id;
        const requestForFTS = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem("token")
            }
        };
        fetch(pathForFTS, requestForFTS)
            .then(response => {
                if (response.ok) {
                    response.json().then(data => {
                        this.setState({
                            errorMessage: '',
                            ftsList: data
                        });
                    });
                }
                else {
                    response.text().then(message => this.setState({ errorMessage: message }));
                }
            })
            .catch(error => console.log(error));
    }

    showAboutTab = () => {
        this.setState({
            isAboutDisabled: false,
            isFormDisabled: true,
            isMarksDisabled: true,
            isParentDisabled: true,
        });
    }

    showFormTab = () => {
        this.setState({
            isAboutDisabled: true,
            isFormDisabled: false,
            isMarksDisabled: true,
            isParentDisabled: true,
        });
    }

    showMarksTab = (id) => {
        this.setState({
            isAboutDisabled: true,
            isFormDisabled: true,
            isMarksDisabled: false,
            isParentDisabled: true,
        });

        this.fetchMarks(id);
    }

    showParentTab = () => {
        this.setState({
            isAboutDisabled: true,
            isFormDisabled: true,
            isMarksDisabled: true,
            isParentDisabled: false,
        });
    }

    handleStudentInputChange = (event) => {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        this.setState({
            student: { ...this.state.student, [name]: value }

        });
    }

    handleFormChange = (event) => {
        const target = event.target;
        const name = target.name;

        this.setState({
            [name]: target.value
        });
    }


    showStudentInput = () => {
        this.setState({
            isStudentInputDisabled: false,
        });
    }


    resetInputValues = () => {
        this.fetchStudent();
        this.setState({
            isStudentInputDisabled: true,
        });
    }

    handleFirstNameChange = (event) => {
        const target = event.target;
        const name = target.name;

        if (target.value === '') {
            this.setState({
                disable: true,
                errorMessage: '',
                student: { ...this.state.student, [name]: target.value }
            })
        }
        else if ((target.value.length < 2 || target.value.length > 50) || !target.value.match("^[a-zA-Z]*$")) {
            this.setState({
                errorMessage: "First name must be between 2 and 50 characters long and containing only letters.",
                disable: true,
                student: { ...this.state.student, [name]: target.value }
            })
        }
        else {
            this.setState({
                errorMessage: "",
                disable: false,
                student: { ...this.state.student, [name]: target.value }
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
                student: { ...this.state.student, [name]: target.value }
            })
        }
        else if ((target.value.length < 2 || target.value.length > 50) || !target.value.match("^[a-zA-Z]*$")) {
            this.setState({
                errorMessage: "Last name must be between 2 and 50 characters long containing only letters.",
                disable: true,
                student: { ...this.state.student, [name]: target.value }
            })
        }
        else {
            this.setState({
                errorMessage: "",
                disable: false,
                student: { ...this.state.student, [name]: target.value }
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
                student: { ...this.state.student, [name]: target.value }
            })
        }
        else if ((target.value.length < 4 || target.value.length > 50)) {
            this.setState({
                errorMessage: "Username must be between 4 and 50 characters long.",
                disable: true,
                student: { ...this.state.student, [name]: target.value }
            })
        }
        else {
            this.setState({
                errorMessage: "",
                disable: false,
                student: { ...this.state.student, [name]: target.value }
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
                student: { ...this.state.student, [name]: target.value }
            })
        }
        else if (!target.value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i)) {
            this.setState({
                errorMessage: "A valid e-mail address is required.",
                disable: true,
                student: { ...this.state.student, [name]: target.value }
            })
        }
        else {
            this.setState({
                errorMessage: "",
                disable: false,
                student: { ...this.state.student, [name]: target.value }
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
                student: { ...this.state.student, [name]: target.value }
            })
        }
        else if ((target.value !== '' && target.value.length !== 13) || !target.value.match(/^[\+\-]?\d*\.?\d+(?:[Ee][\+\-]?\d+)?$/)) {

            this.setState({
                disable: true,
                errorMessage: `Student's JMBG must be exactly 13 characters long and containing only digits.`,
                student: { ...this.state.student, [name]: target.value }
            })
        }
        else {
            this.setState({
                errorMessage: "",
                disable: false,
                student: { ...this.state.student, [name]: target.value }
            })
        }
    }

    handlePhoneChange = (event) => {
        const target = event.target;
        const name = target.name;

        if (target.value === '') {
            this.setState({
                disable: true,
                errorMessage: '',
                student: { ...this.state.student, [name]: target.value }
            })
        }
        else if (!target.value.match(/^[\+\-]?\d*\.?\d+(?:[Ee][\+\-]?\d+)?$/)) {
            this.setState({
                disable: true,
                errorMessage: `Phone number must contain only digits.`,
                student: { ...this.state.student, [name]: target.value }
            })
        }
        else {
            this.setState({
                errorMessage: "",
                disable: false,
                student: { ...this.state.student, [name]: target.value }
            })
        }
    }



    handleStudentUpdate = (event) => {

        console.log('usli u handleStudentUpdate')
        const requestOptions = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem("token")
            },
            body: JSON.stringify({
                ID: this.state.student.ID,
                FirstName: this.state.student.FirstName,
                LastName: this.state.student.LastName,
                Email: this.state.student.Email,
                UserName: this.state.student.UserName,
                PhoneNumber: this.state.student.PhoneNumber,
                Jmbg: this.state.student.Jmbg,
                DayOfBirth: this.state.student.DayOfBirth,
                EmailConfirmed: this.state.student.EmailConfirmed,
                PhoneNumberConfirmed: this.state.student.PhoneNumberConfirmed,
                IsActive: this.state.student.IsActive,
                FormId: this.state.student.FormId

            })
        };

        const path = STUDENTS + "/" + this.state.student.ID;
        fetch(path, requestOptions)
            .then(response => {
                if (response.ok) {
                    alert('Success!');
                    response.json().then(data => {
                        this.setState({
                            errorMessage: '',
                        })
                        this.resetInputValues();
                    });
                } else {
                    response.text().then(message => {
                        this.setState({
                            errorMessage: message
                        })
                        alert(message)
                    }
                    )
                }
            })
            .catch(error => console.log(error))
        event.preventDefault();

    };


    transferStudentToDiferentForm = (event) => {
        event.preventDefault();

        const studentId = this.state.student.ID;
        const newFormId = this.state.selectedFormId;

        const r = window.confirm(`

        Are you sure you want to assign student 
        ${this.state.student.FirstName} ${this.state.student.LastName} 
        to the new form?`);

        if (r === true) {
            const path = FORMS + "/" + newFormId + "/students/" + studentId;
            console.log(path);

            const requestOptions = {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer  ' + localStorage.getItem("token")
                },
            }

            fetch(path, requestOptions)
                .then(response => {
                    if (response.ok) {
                        alert(`
                        Success! 
                       `);

                        this.setState({
                            errorMessage: '',
                            selectedFormId: '',

                        })
                        this.fetchStudent();
                    } else {
                        response.text().then(message => this.setState({ errorMessage: message }))
                    }
                })
                .catch(error => console.log(error))
        }
        else {
            this.fetchForms();
        }

    }

    openMarkUpdateInput = (id) => {

        console.log("usli openMarkUpdateInput?");
        let mark = this.state.marks.find(mark => mark.ID === id);
        this.setState({
            isMarkUpdateDisabled: false,
            markID: id,
            markForUpdate: mark,
            mark: mark,
            MarkValue: mark.MarkValue,
            TeacherID: mark.TeacherID
        });
    }

    closeMarkInlineInput = () => {
        this.setState({
            isMarkUpdateDisabled: true,
            markID: '',
            note: ''
        })
    }

    handleMarkChange = (event) => {
        const target = event.target;
        const name = target.name;

        if (target.value === '') {
            this.setState({
                disableMarkChangeButton: true,
                errorMessage: '',
                mark: { ...this.state.mark, [name]: target.value }
            })
        }
        else if (target.value !== '' && (target.value < 1 || target.value > 5)) {
            this.setState({
                errorMessage: "Mark must be number between 1 and 5.",
                disableMarkChangeButton: true,
                mark: { ...this.state.mark, [name]: target.value }
            })
        }
        else {
            this.setState({
                errorMessage: "",
                disableMarkChangeButton: false,
                mark: { ...this.state.mark, [name]: target.value }
            })
        }
    }

    putMarkInline = (event) => {
        event.preventDefault();
        const sId = this.state.studentId;
        const markValue = this.state.mark.MarkValue;

        const r = window.confirm(`Are you sure you want to give 
        mark: ${markValue} to
        student: ${this.state.mark.Student}?`);
        if (r === true) {
            const requestOptions = {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer  ' + localStorage.getItem("token")
                },

            };

            const path = MARKS + "/" + this.state.markID + "/by-teacher/" + this.state.TeacherID + '?value=' + this.state.mark.MarkValue;
            fetch(path, requestOptions)
                .then(response => {
                    if (response.ok) {

                        alert(`You have successfully updated mark to value ${this.state.mark.MarkValue}!`)

                        response.json().then(data => {
                            this.setState({
                                errorMessage: '',
                                isMarkUpdateDisabled: true,

                            })
                            this.fetchMarks(sId)
                        });

                    } else {
                        response.text().then(message => this.setState({ errorMessage: message }))
                    }
                })
                .catch(error => console.log(error))

        }
        else {
            console.log('what to do?');
        }

    };

    deleteMark = (id) => {

        let mark = this.state.marks.find(m => m.ID === id);
        const r = window.confirm(`Are you sure you want to delete 
        mark value ${mark.MarkValue} 
        created ${mark.Created}
        for student ${mark.Student}?`);
        if (r === true) {

            let isLastMark = this.state.marks.length === 1 ? true : false;
            console.log(isLastMark);

            const path = MARKS + "/" + id + "/by-teacher/" + mark.TeacherID;
            const requestOptions = {
                method: 'DELETE',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token'),
                    'Content-Type': 'application/json'
                }
            };
            fetch(path, requestOptions)
                .then(response => {
                    if (response.ok) {
                        if (isLastMark === true) {
                            alert(`
                            Success! 
                            There are no more marks to be updated. `);
                            this.setState({ marks: this.state.marks.filter(m => m.ID !== id) })
                        }
                        else {
                            alert("Success!");
                            this.setState({ marks: this.state.marks.filter(mark => mark.ID !== id) })
                        }

                    } else {
                        response.text().then(message => alert(message))
                    }
                })
                .catch(error => console.log(error))
        }
    }


    handleInputChange = (event) => {
        const target = event.target;
        const name = target.name;

        this.setState({
            [name]: target.value
        });
    }


    handleNewMarkInput = (event) => {
        const target = event.target;
        const name = target.name;

        if (target.value === '') {
            this.setState({ disableMarkAddButton: true, errorMessageForAdd: '' })
        }
        else if (target.value !== '' && (target.value < 1 || target.value > 5)) {
            this.setState({ errorMessageForAdd: "Mark must be number between 1 and 5.", disableMarkAddButton: true })
        }
        else {
            this.setState({
                errorMessageForAdd: "",
                disableMarkAddButton: false,
                [name]: target.value
            })
        }
    }

    createNewMark = (event) => {
        console.log('CIJI JE OVO id: ', event.target.value);
        console.log(this.state.selectedFTSId);

        const ftsID = this.state.selectedFTSId;
        const markValue = this.state.MarkValue;
        const studentId = this.state.studentId;

        const r = window.confirm(`
        Are you sure?`);

        if (r === true) {
            console.log('usli')
            const path = MARKS + "/fts/" + ftsID + "/student/" + studentId;
            console.log(path);

            const requestOptions = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer  ' + localStorage.getItem("token")
                },
                body: JSON.stringify({
                    MarkValue: this.state.MarkValue

                })
            }

            fetch(path, requestOptions)
                .then(response => {
                    if (response.ok) {
                        alert("Success!");

                        this.setState({
                            errorMessageForAdd: '',
                            MarkValue: 0,
                            selectedFTSId: ''
                        });
                        this.fetchMarks(studentId);

                    } else {
                        response.text().then(message => this.setState({ errorMessageForAdd: message }));
                    }
                })
                .catch(error => console.log(error));

            event.preventDefault();
        }

    }

    searchMarks = (event) => {
        event.preventDefault();
        console.log(`da li je ocitano? 
        ${this.searchedMarkValue.current.value}
        ${this.searchedMarkDate.current.value}
        ${this.searchedSubject.current.value} `);



        let originalMarkList = this.state.marks;
        let newList = [];

        if (this.searchedSubject.current.value !== ""
            && this.searchedMarkValue.current.value === ""
            && this.searchedMarkDate.current.value === "") {
            console.log('if')
            newList = this.state.marks.filter(f => {

                const lc = f.SubjectName.toLowerCase();
                const filter = this.searchedSubject.current.value.toLowerCase();
                return lc.includes(filter);
            })
            this.setState({
                marks: newList
            });
        }
        else if (this.searchedSubject.current.value === ""
            && this.searchedMarkValue.current.value !== ""
            && this.searchedMarkDate.current.value === "") {
            console.log('else if2')
            newList = this.state.marks.filter(f => f.MarkValue.toString() === this.searchedMarkValue.current.value)
            this.setState({
                marks: newList
            });
        }
        else if (this.searchedSubject.current.value === ""
            && this.searchedMarkValue.current.value === ""
            && this.searchedMarkDate.current.value !== "") {
            console.log('else if2')
            newList = this.state.marks.filter(mark => mark.Created === this.searchedMarkDate.current.value)
            this.setState({
                marks: newList
            });
        }

        else if (this.searchedSubject.current.value !== ""
            && this.searchedMarkValue.current.value !== ""
            && this.searchedMarkDate.current.value === "") {
            console.log('else if4')

            newList = this.state.marks.filter(f => {

                const gr = f.MarkValue.toString();
                const filter1 = this.searchedMarkValue.current.value;
                const lc = f.SubjectName.toLowerCase();
                const filter2 = this.searchedSubject.current.value.toLowerCase();
                return (lc.includes(filter2) && gr === filter1);
            })
            this.setState({
                marks: newList
            });
        }
        else if (this.searchedSubject.current.value === ""
            && this.searchedMarkValue.current.value !== ""
            && this.searchedMarkDate.current.value !== "") {
            console.log('else if5')

            newList = this.state.marks.filter(f => {

                const gr = f.MarkValue.toString();
                const filter1 = this.searchedMarkValue.current.value;
                const wc = f.Created;
                const filter2 = this.searchedMarkDate.current.value;

                return (gr.includes(filter1) && wc === filter2);
            })

            this.setState({
                marks: newList
            });
        }
        else if (this.searchedSubject.current.value !== ""
            && this.searchedMarkValue.current.value === ""
            && this.searchedMarkDate.current.value !== "") {
            console.log('else if6')

            newList = this.state.marks.filter(f => {

                const lc = f.SubjectName.toLowerCase();
                const filter2 = this.searchedSubject.current.value.toLowerCase();
                const wc = f.Created;
                const filter1 = this.searchedMarkDate.current.value;

                return (lc.includes(filter2) && wc === filter1);
            })
            this.setState({
                marks: newList
            });
        }
        else if (this.searchedSubject.current.value !== ""
            && this.searchedMarkValue.current.value !== ""
            && this.searchedMarkDate.current.value !== "") {
            console.log('else if7')

            newList = this.state.marks.filter(f => {

                const gr = f.MarkValue.toString();
                const filter1 = this.searchedMarkValue.current.value;
                const lc = f.SubjectName.toLowerCase();
                const filter2 = this.searchedSubject.current.value.toLowerCase();
                const wc = f.Created;
                const filter3 = this.searchedMarkDate.current.value;

                return (lc.includes(filter2) && gr.includes(filter1) && wc === filter3);
            })
            this.setState({
                marks: newList
            });
        }
        else {
            console.log('else')
            newList = originalMarkList;
            this.setState({
                marks: newList
            });
        }
    }

    resetSearch(id) {
        this.fetchMarks(id);

        this.searchedMarkDate.current.value = '';
        this.searchedMarkValue.current.value = '';
        this.searchedSubject.current.value = '';
    }


    transferStudentToDiferentParent = (event) => {
        const studentId = this.state.student.ID;
        const newParentId = this.state.selectedParentId;

        const r = window.confirm(`

        Are you sure you want to assign student 
        ${this.state.student.FirstName} ${this.state.student.LastName} 
        to a new garidan?`);

        if (r === true) {
            console.log('usli U transferStudentToDiferentParent FETCH DEO')
            const path = STUDENTS + "/" + studentId + "/assign-to-parent/" + newParentId;
            console.log(path);

            const requestOptions = {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer  ' + localStorage.getItem("token")
                },
            }

            fetch(path, requestOptions)
                .then(response => {
                    if (response.ok) {

                        alert(`
                        Success! 
                       `);

                        this.setState({
                            errorMessage: '',
                            selectedParentId: ''

                        })
                        this.fetchStudent();

                    } else {
                        response.text().then(message => this.setState({ errorMessage: message }))
                    }
                })
                .catch(error => console.log(error))
            event.preventDefault();

        }

    }

    handleStudentPasswordChange = (event) => {

        event.preventDefault();
        const studentId = this.state.student.ID;
        if (this.confirmPassword.current.value !== this.password.current.value) {
            alert('Passwords do not match!')
        }
        else if (!this.password.current.value.match(/^((?=.*\d)(?=.*[a-z]).{5,15})$/)) {
            alert(`Password must be between 5 and 15 characters in length containg at least one digit and one lowercase character!`)
        }
        else {
            const r = window.confirm(`
    Are you sure you want to change password?`);
            if (r === true) {
                const requestOptions = {
                    method: 'PUT',
                    headers: {
                        'Authorization': 'Bearer ' + localStorage.getItem('token'),
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        ID: studentId,
                        OldPassword: this.oldPassword.current.value,
                        NewPassword: this.password.current.value,
                    })

                };
                const path = ACCOUNT + "/change-password/" + studentId;
                fetch(path, requestOptions)
                    .then(response => {
                        if (response.ok) {
                            alert('Sucess!')
                            this.setState({
                                errorMessage: '',
                                isStudentPasswordChangeDisabled: true
                            })
                            this.fetchStudent();
                        } else {
                            response.text().then(message => this.setState({ errorMessage: message }))
                        }
                    })
                    .catch(error => console.log(error))

            }
        }
    }



    showPasswordChangeForm = () => {

        console.log("usli showPasswordChangeForm?");
        this.setState({
            isStudentPasswordChangeDisabled: false,
        });
    }


    cancelPasswordChange = () => {

        this.fetchStudent();
        this.setState({
            isStudentPasswordChangeDisabled: true,
        });
    }

    openModalToUploadImg = (id) => {
        this.setState({
            isModalForImgUploadOpened: true,
            studentId: id,
        });
    }

    closeModalToUploadImg = () => {
        this.setState({
            isModalForImgUploadOpened: false,

        });
    }

    handleFileUpload = (event) => {
        event.preventDefault();

        const data = new FormData();
        data.append('file', this.fileInput.current.files[0]);

        if (this.fileInput.current.files.length === 1) {

            fetch('http://localhost:54164/project/students/upload-image/' + this.state.studentId, {
                method: 'POST',
                headers: new Headers({
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                }),
                body: data
            })

                .then(response => {
                    if (response.ok) {
                        alert("Success!");
                        this.setState({
                            isModalForImgUploadOpened: false,
                            errorMessage: ''
                        })
                        this.fetchStudent();

                    } else {
                        response.text().then(message => alert(message))
                    }
                })
                .catch(error => console.log(error))
        }

        else {
            console.log(`No files selected for update.`);
            alert(`No files selected for update.`);
        }
    }

    render() {

        return (
            <div className="pv_student_page">
                {
                    this.state.student &&
                    <div>
                        <div className="card">
                            <img src={this.state.url + this.state.student.ImagePath} alt="Avatar" width="200px" height="200px" />
                            <div className="container">
                                <h3>{this.state.student.FirstName}  {this.state.student.LastName}</h3>
                            </div>

                        </div>

                        <button className="uploadImgButton" onClick={() => this.openModalToUploadImg(this.state.studentId)}>Change picture</button>

                        <Modal show={this.state.isModalForImgUploadOpened} onClose={this.closeModalToUploadImg}>
                            <form onSubmit={this.handleFileUpload} encType="multipart/form-data" action="api/upload">

                                <h3>Select profile photo for {this.state.student.FirstName} {this.state.student.FirstName}</h3>
                                <input
                                    type="file"
                                    ref={this.fileInput}
                                    required
                                />
                                <br />
                                <button type="submit">Submit</button>

                            </form>
                        </Modal>

                        <div className="student_page">
                            <div className="s_column_row">
                                <div tabIndex="4" className="s_column" onClick={this.showAboutTab}>About</div>
                                <div tabIndex="4" className="s_column" onClick={this.showFormTab}>Form</div>
                                <div tabIndex="4" className="s_column" onClick={this.showParentTab}>Parent</div>
                                <div tabIndex="4" className="s_column" onClick={() => this.showMarksTab(this.state.student.ID)}>Marks</div>

                            </div>

                            <div className="student_page_form_pv_sv">

                                {!this.state.isAboutDisabled &&

                                    <div>
                                        <div>
                                            {this.state.isStudentPasswordChangeDisabled ?
                                                <div>
                                                    <button onClick={this.showPasswordChangeForm} className="changePassButton"> CHANGE PASSWORD </button>
                                                    <div></div>
                                                    <hr />
                                                </div>
                                                :
                                                <div className="changePassDiv">
                                                    <form onSubmit={this.handleStudentPasswordChange}>

                                                        <input

                                                            type="password"
                                                            name="OldPassword"
                                                            placeholder="Enter OLD password"
                                                            // onChange={this.handleOldPassword}
                                                            ref={this.oldPassword}
                                                            required />

                                                        <br />
                                                        <input
                                                            type="password"
                                                            name="NewPassword"
                                                            placeholder="Enter NEW password"
                                                            //   onChange={this.handleNewPassword} 
                                                            ref={this.password}
                                                            required />
                                                        <br />


                                                        <input
                                                            type="password"
                                                            name="ConfirmNewPassword"
                                                            placeholder="Enter NEW password again"
                                                            // onChange={this.handleRepeatedNewPassword} />
                                                            ref={this.confirmPassword}
                                                            required />
                                                        <br />

                                                        <input type="submit" value="CHANGE" className="submitNewPass" />
                                                        <br />
                                                        <input type="button" value="Cancel" className="cancelNewPass" onClick={() => this.cancelPasswordChange()} />
                                                        <br />
                                                        <label className="error">{this.state.errorMessage}</label>
                                                        <hr />
                                                    </form>

                                                </div>
                                            }
                                        </div>

                                        <form onSubmit={this.handleStudentUpdate}>
                                            {this.state.isStudentInputDisabled ?
                                                <h3>Student information</h3>
                                                :
                                                <h3>Change student information</h3>

                                            }
                                            <div>
                                                <label>First name</label>
                                                <input
                                                    className="prvi_input_20pxadmin"
                                                    type="text"
                                                    name="FirstName"
                                                    placeholder="Change first name"
                                                    value={this.state.student.FirstName}
                                                    // onChange={this.handleStudentInputChange}
                                                    onChange={this.handleFirstNameChange}

                                                    disabled={this.state.isStudentInputDisabled}
                                                    required />
                                            </div>

                                            <div>
                                                <label>Last name</label>
                                                <input
                                                    className="prvi_input_20pxadmin"
                                                    type="text"
                                                    name="LastName"
                                                    placeholder="Change last name"
                                                    value={this.state.student.LastName}
                                                    onChange={this.handleLastNameChange}
                                                    disabled={this.state.isStudentInputDisabled}
                                                    required />
                                            </div>

                                            <div>
                                                <label>Username</label>
                                                <input
                                                    className="prvi_input_20pxadmin"
                                                    type="text"
                                                    name="UserName"
                                                    placeholder="Change username"
                                                    value={this.state.student.UserName}
                                                    onChange={this.handleUserNameChange}
                                                    disabled={this.state.isStudentInputDisabled}
                                                    required />
                                            </div>

                                            <div>
                                                <label>Email</label>

                                                <input
                                                    className="drugi_inputadmin"
                                                    type="email"
                                                    name="Email"
                                                    placeholder="Change email"
                                                    value={this.state.student.Email}
                                                    onChange={this.handleEmailChange}
                                                    disabled={this.state.isStudentInputDisabled}
                                                    required />
                                            </div>

                                            <div>
                                                <label>Email confirmed</label>


                                                <input

                                                    name="EmailConfirmed"
                                                    type="checkbox"
                                                    checked={this.state.student.EmailConfirmed}
                                                    value={this.state.student.EmailConfirmed}
                                                    disabled={this.state.isStudentInputDisabled}
                                                    onChange={this.handleStudentInputChange} />
                                            </div>


                                            <div>
                                                <label>JMBG</label>
                                                <input
                                                    className="treci_inputadmin"
                                                    type="text"
                                                    name="Jmbg"
                                                    placeholder="Change JMBG"
                                                    value={this.state.student.Jmbg}
                                                    onChange={this.handleJmbgChange}
                                                    disabled={this.state.isStudentInputDisabled}
                                                    required />
                                            </div>

                                            <div>
                                                <label>Day of birth</label>
                                                <input
                                                    className="cetvrti_inputadmin"
                                                    type="text"
                                                    name="DayOfBirth"
                                                    placeholder="Change day of birth (MM/dd/yyyy)"
                                                    value={this.state.student.DayOfBirth}
                                                    onChange={this.handleStudentInputChange}
                                                    disabled={this.state.isStudentInputDisabled}
                                                    required />
                                            </div>

                                            <div>
                                                <label>Phone number</label>
                                                <input
                                                    className="peti_inputadmin"
                                                    type="text"
                                                    name="PhoneNumber"
                                                    // placeholder="Change Phone Number"
                                                    value={this.state.student.PhoneNumber}
                                                    onChange={this.handlePhoneChange}
                                                    disabled={this.state.isStudentInputDisabled}
                                                />
                                            </div>

                                            <div>
                                                <label>Phone number confirmed</label>
                                                <input
                                                    className='input_kikice_pn'
                                                    name="PhoneNumberConfirmed"
                                                    type="checkbox"
                                                    checked={this.state.student.PhoneNumberConfirmed}
                                                    value={this.state.student.PhoneNumberConfirmed}
                                                    onChange={this.handleStudentInputChange}
                                                    disabled={this.state.isStudentInputDisabled}
                                                />
                                            </div>

                                            <div>
                                                <label>Is active</label>
                                                <input
                                                    className='input_kikice'
                                                    name="IsActive"
                                                    type="checkbox"
                                                    checked={this.state.student.IsActive}
                                                    value={this.state.student.IsActive}
                                                    onChange={this.handleStudentInputChange}
                                                    disabled={this.state.isStudentInputDisabled}
                                                />
                                            </div>


                                            {this.state.isStudentInputDisabled ?

                                                <input type="button" value="UPDATE" className="btn_openStudentChangeInput" onClick={this.showStudentInput} />

                                                :

                                                <div>

                                                    <input type="submit" value="SAVE" className="submitStudentProfileUpdate" disabled={this.state.disable} />
                                                    <br />
                                                    <button onClick={this.resetInputValues} className="cancelStudentProfileUpdate"> CANCEL </button>
                                                    <br />
                                                    <label className="error">{this.state.errorMessage}</label>
                                                </div>
                                            }


                                        </form>
                                    </div>
                                }


                                {!this.state.isFormDisabled &&
                                    <div>

                                        {this.state.forms &&
                                            <div className="changePassDiv">
                                                <form onSubmit={this.transferStudentToDiferentForm}>
                                                    <h3>Assign student to a new form:</h3>
                                                    <select
                                                        value={this.state.selectedFormId}
                                                        onChange={this.handleFormChange}
                                                        name="selectedFormId"
                                                        required
                                                    >
                                                        <option value=''>Select a NEW form </option>
                                                        {
                                                            this.state.forms.map((f) =>
                                                                <option value={f.ID} key={f.ID}>{f.ID}. {f.Grade}-{f.Tag}, {f.AttendingTeacher.FirstName} {f.AttendingTeacher.LastName}</option>
                                                            )

                                                        }

                                                    </select>
                                                    <br />
                                                    <input type="submit" value="CHANGE" className="submitNewPass" />
                                                    <br />
                                                    <label className="error">{this.state.errorMessage}</label>
                                                    <hr />


                                                </form>
                                            </div>
                                        }



                                        <br />
                                        <div>
                                            <label>
                                                <h3>Student's current form </h3>
                                                <br />

                                                <div>
                                                    <label>Grade</label>

                                                    <input
                                                        className="peti_input"
                                                        type="number"
                                                        value={this.state.student.Form.Grade}
                                                        disabled={this.state.isFormInputDisabled} />
                                                </div>

                                                <div>
                                                    <label>Tag</label>

                                                    <input
                                                        className="sesti_input"
                                                        type="text"
                                                        value={this.state.student.Form.Tag}
                                                        disabled={this.state.isFormInputDisabled} />
                                                </div>

                                                <br /> <br />
                                                <hr />

                                                <div>
                                                    <label><b>Attending teacher </b></label>
                                                    <br /> <br />
                                                    <label>First name</label>
                                                    <input
                                                        className="prvi_input_20px"
                                                        type="text"
                                                        value={this.state.student.Form.AttendingTeacher.FirstName}
                                                        disabled={this.state.isFormInputDisabled} />
                                                    <br />
                                                    <label>Last name</label>
                                                    <input
                                                        className="prvi_input_20px"
                                                        type="text"
                                                        value={this.state.student.Form.AttendingTeacher.LastName}
                                                        disabled={this.state.isFormInputDisabled} />
                                                    <br />
                                                    <label>Username</label>
                                                    <input
                                                        className="prvi_input_20px"
                                                        type="text"
                                                        value={this.state.student.Form.AttendingTeacher.UserName}
                                                        disabled={this.state.isFormInputDisabled} />
                                                    <br />
                                                    <label>Email</label>
                                                    <input
                                                        className="drugi_input"
                                                        type="text"
                                                        value={this.state.student.Form.AttendingTeacher.Email}
                                                        disabled={this.state.isFormInputDisabled} />
                                                    <br />
                                                    <label>Phone number</label>
                                                    <input
                                                        className="peti_input"
                                                        type="text"
                                                        value={this.state.student.Form.AttendingTeacher.PhoneNumber}
                                                        disabled={this.state.isFormInputDisabled} />
                                                    <br />
                                                    <label>JMBG</label>
                                                    <input
                                                        className="treci_input"
                                                        type="text"
                                                        value={this.state.student.Form.AttendingTeacher.Jmbg}
                                                        disabled={this.state.isFormInputDisabled} />
                                                    <br />

                                                </div>
                                            </label>
                                        </div>

                                    </div>
                                }


                                {!this.state.isMarksDisabled &&
                                    <div>
                                        {this.state.marks &&
                                            <div>
                                                {
                                                    this.state.ftsList &&

                                                    <form onSubmit={this.createNewMark}>

                                                        <h3>
                                                            Create a new mark:
                                                            </h3>
                                                        <select
                                                            className="izaberi_class"
                                                            value={this.state.selectedFTSId}
                                                            onChange={this.handleInputChange}
                                                            name="selectedFTSId"
                                                            required
                                                        >
                                                            <option value=''>Select a student class</option>
                                                            {
                                                                this.state.ftsList.map((f) =>
                                                                    <option value={f.ID} key={f.ID}>{f.TeacherToSubject.ID}. {f.TeacherToSubject.Subject.Name}, {f.TeacherToSubject.Subject.Grade}, prof. {f.TeacherToSubject.Teacher.FirstName} {f.TeacherToSubject.Teacher.LastName}</option>
                                                                )

                                                            }

                                                        </select>


                                                        <input
                                                            className="unesi_ocenu"
                                                            type="number"
                                                            name="MarkValue"
                                                            placeholder="Enter mark value"
                                                            onChange={this.handleNewMarkInput}
                                                            required
                                                        />

                                                        <input type="submit" value="ADD NEW MARK" className="adminAddMark" disabled={this.state.disableMarkAddButton} />
                                                        <br />
                                                        <label className="error">{this.state.errorMessageForAdd}</label>

                                                        <hr />
                                                    </form>


                                                }

                                                {this.state.marks &&
                                                    <div>
                                                        <div className='adminSearchMarks'>

                                                            <form onSubmit={this.searchMarks}>
                                                                <label id="input3">Search marks </label>
                                                                <input
                                                                    // name="MarkValue"
                                                                    type="number"
                                                                    id="input2"
                                                                    placeholder="by value"
                                                                    ref={this.searchedMarkValue}
                                                                // onChange={this.handleInputChange}
                                                                />

                                                                <input
                                                                    name="Created"
                                                                    type="text"
                                                                    id="input1"
                                                                    placeholder="mm/dd/yyyy"
                                                                    ref={this.searchedMarkDate}
                                                                // onChange={this.handleInputChange}
                                                                />

                                                                <input
                                                                    name="Class"
                                                                    type="text"
                                                                    id="input1"
                                                                    placeholder="by subject"
                                                                    ref={this.searchedSubject}
                                                                // onChange={this.handleInputChange}
                                                                />
                                                                <input type="submit" value="Find" className="pronadji_ocenu" />
                                                                <button
                                                                    onClick={() => this.resetSearch(this.state.student.ID)}
                                                                    className="btn-cancel"> RESET </button>

                                                                <hr className='moj_separator' />
                                                            </form>
                                                        </div>

                                                        <div className="tabela_ocena_admin">
                                                            {this.state.marks && this.state.marks.length === 0 ?
                                                                <label>Mark list is empty</label>
                                                                :

                                                                < table >
                                                                    <thead>
                                                                        <tr>
                                                                            <th>ID</th>
                                                                            <th>MarkValue</th>
                                                                            <th>Semester</th>
                                                                            <th>Created</th>
                                                                            <th>SubjectName</th>
                                                                            <th>Teacher</th>
                                                                            <th></th>
                                                                            <th></th>

                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>


                                                                        {
                                                                            this.state.marks.map(mark =>
                                                                                <tr key={mark.ID}>
                                                                                    <td>{mark.ID}</td>
                                                                                    {!this.state.isMarkUpdateDisabled && mark.ID === this.state.markID ?
                                                                                        <td>
                                                                                            <form onSubmit={this.putMarkInline} className="inline-mark-update">

                                                                                                <input
                                                                                                    type="number"
                                                                                                    name="MarkValue"
                                                                                                    //placeholder="Change subject grade"
                                                                                                    value={this.state.mark.MarkValue}
                                                                                                    onChange={this.handleMarkChange}
                                                                                                />

                                                                                                <input type="submit" value="CHANGE" className="btn-add" id="need-margin" />
                                                                                                <button onClick={this.closeMarkInlineInput} className="btn-cancel" id="need-margin">Cancel</button>
                                                                                                <br />
                                                                                                <label className="error">{this.state.errorMessage}</label>

                                                                                            </form>
                                                                                        </td>
                                                                                        :
                                                                                        <td>{mark.MarkValue}</td>
                                                                                    }
                                                                                    <td>{mark.Semester}</td>
                                                                                    <td>{mark.Created}</td>
                                                                                    <td>{mark.SubjectName}</td>
                                                                                    <td>{mark.Teacher}</td>



                                                                                    <td><button onClick={() => this.openMarkUpdateInput(mark.ID)} disabled={!this.state.isMarkUpdateDisabled} className='btn-update'>UPDATE</button></td>

                                                                                    <td><button onClick={() => this.deleteMark(mark.ID)} className="btn-delete">Delete</button></td>





                                                                                </tr>
                                                                            )
                                                                        }

                                                                    </tbody>
                                                                </table>
                                                            }
                                                        </div>
                                                    </div>
                                                }
                                            </div>
                                        }

                                    </div>
                                }


                                {!this.state.isParentDisabled &&
                                    <div>

                                        {this.state.parents &&
                                            <div className="changePassDiv">
                                                <form onSubmit={this.transferStudentToDiferentParent}>
                                                    <h3>Assign student to a new gardian:</h3>
                                                    <select
                                                        value={this.state.selectedParentId}
                                                        onChange={this.handleFormChange}
                                                        name="selectedParentId"
                                                        required
                                                    >
                                                        <option value=''>Select a NEW garidan </option>
                                                        {
                                                            this.state.parents.map((f) =>
                                                                <option value={f.ID} key={f.ID}>{f.ID}. {f.UserName}, {f.FirstName} {f.LastName}, {f.Jmbg}</option>
                                                            )

                                                        }

                                                    </select>
                                                    <br />
                                                    <input type="submit" value="ASSIGN" className="submitNewPass" />
                                                    <br />
                                                    <label className="error">{this.state.errorMessage}</label>
                                                    <hr />
                                                </form>
                                            </div>
                                        }



                                        <br />
                                        <div>
                                            <label>
                                                <h3>Student's parent </h3>
                                                <br />

                                                <div>
                                                    <label>First name</label>
                                                    <input
                                                        className="prvi_input_20px"
                                                        type="text"
                                                        value={this.state.student.Parent.FirstName}
                                                        disabled={this.state.isParentInputDisabled} />
                                                </div>

                                                <div>
                                                    <label>Last name</label>
                                                    <input
                                                        className="prvi_input_20px"
                                                        type="text"
                                                        value={this.state.student.Parent.LastName}
                                                        disabled={this.state.isParentInputDisabled} />
                                                </div>

                                                <div>
                                                    <label>Username</label>
                                                    <input
                                                        className="prvi_input_20px"
                                                        type="text"
                                                        value={this.state.student.Parent.UserName}
                                                        disabled={this.state.isParentInputDisabled} />
                                                </div>

                                                <div>
                                                    <label>Email</label>
                                                    <input
                                                        className="drugi_input"
                                                        type="text"
                                                        value={this.state.student.Parent.Email}
                                                        disabled={this.state.isParentInputDisabled} />
                                                </div>

                                                <div>
                                                    <label>Phone number</label>
                                                    <input
                                                        className="peti_input"
                                                        type="text"
                                                        value={this.state.student.Parent.PhoneNumber}
                                                        disabled={this.state.isParentInputDisabled} />
                                                </div>

                                                <div>
                                                    <label>JMBG</label>
                                                    <input
                                                        className="treci_input"
                                                        type="text"
                                                        value={this.state.student.Parent.Jmbg}
                                                        disabled={this.state.isParentInputDisabled} />
                                                </div>

                                            </label>
                                        </div>

                                    </div>
                                }
                            </div>


                        </div>
                    </div>
                }

            </div>
        )
    }
}

export default StudentId;