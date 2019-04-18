import React, { Component } from 'react';
import { STUDENTS, MARKS, IMAGEPATH, FORMS, FTS, PARENTS, ACCOUNT } from "../../service/api";
import '../../style/components/parentView/studentProfile.css';



class StudentIdProfile extends Component {
    constructor(props) {
        super(props);

        this.searchedMarkDate = React.createRef();
        this.searchedMarkValue = React.createRef();
        this.searchedSubject = React.createRef();


        this.state = {
            student: null,

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

    }

    componentDidMount() {
        const currentUserId = localStorage.getItem('UserId');
        if (localStorage.getItem('token') === null) {
            this.props.history.push('/login');
        }
        else if (localStorage.getItem('role') !== 'student') {
            this.props.history.push('/no-auth');

        }
        else {
            console.log('usli u fetch student')
            const path = STUDENTS + "/" + currentUserId + "/for-user";
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
                        formId: data.Form.ID,
                        parentId: data.Parent.ID,

                    })
                });
        }
    }

    fetchMarks(id) {
        console.log('usli u fetch marks')
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
        console.log("usli u showAboutTab fju?");
        this.setState({
            isAboutDisabled: false,
            isFormDisabled: true,
            isMarksDisabled: true,
            isParentDisabled: true,
        });
    }

    showFormTab = () => {
        console.log("usli u showFormTab fju?");
        this.setState({
            isAboutDisabled: true,
            isFormDisabled: false,
            isMarksDisabled: true,
            isParentDisabled: true,
        });
    }

    showMarksTab = (id) => {
        console.log("usli u showMarksTab fju?");
        this.setState({
            isAboutDisabled: true,
            isFormDisabled: true,
            isMarksDisabled: false,
            isParentDisabled: true,
        });

        this.fetchMarks(id);
    }

    showParentTab = () => {
        console.log("usli u showParentTab fju?");
        this.setState({
            isAboutDisabled: true,
            isFormDisabled: true,
            isMarksDisabled: true,
            isParentDisabled: false,
        });
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

                        <div className="student_page">
                            <div className="s_column_row">

                                <div tabindex="4" className="s_column" onClick={this.showAboutTab}>About Student</div>
                                <div tabindex="4" className="s_column" onClick={this.showFormTab}>Form</div>
                                <div tabindex="4" className="s_column" onClick={this.showParentTab}>Parent</div>
                                <div tabindex="4" className="s_column" onClick={() => this.showMarksTab(this.state.student.ID)}>Marks</div>

                            </div>

                            <div className="student_page_form_pv_sv">

                                {!this.state.isAboutDisabled &&

                                    <div>

                                        <form onSubmit={this.handleStudentUpdate} >

                                            <div>
                                                <label>First name</label>
                                                <input
                                                    className="prvi_input_20px"
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
                                                    className="prvi_input_20px"
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
                                                    className="prvi_input_20px"
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
                                                    className="drugi_input"
                                                    type="email"
                                                    name="Email"
                                                    placeholder="Change email"
                                                    value={this.state.student.Email}
                                                    onChange={this.handleEmailChange}
                                                    disabled={this.state.isStudentInputDisabled}
                                                    required />
                                            </div>

                                            <div>
                                                <label>JMBG</label>
                                                <input
                                                    className="treci_input"
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
                                                    className="cetvrti_input"
                                                    type="text" id="start"
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
                                                    className="peti_input"
                                                    type="text"
                                                    name="PhoneNumber"
                                                    placeholder="Change Phone Number"
                                                    value={this.state.student.PhoneNumber}
                                                    onChange={this.handleStudentInputChange}
                                                    disabled={this.state.isStudentInputDisabled}
                                                />
                                            </div>
                                        </form>
                                    </div>
                                }


                                {!this.state.isFormDisabled &&

                                    <div>
                                        <div>
                                            <label>Grade</label>

                                            <input
                                                className="peti_input"
                                                type="text"
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

                                        </div>
                                    </div>
                                }


                                {!this.state.isMarksDisabled &&
                                    <div>

                                        {this.state.marks &&
                                            <div>

                                                {this.state.marks &&
                                                    <div>

                                                        <form onSubmit={this.searchMarks} className='myprofile_search_header'>
                                                            <label id="myprofile_search_input3">Search marks </label>
                                                            <input
                                                                // name="MarkValue"
                                                                type="number"
                                                                id="myprofile_search_input5"
                                                                placeholder="by value"
                                                                ref={this.searchedMarkValue}
                                                            // onChange={this.handleInputChange}
                                                            />

                                                            <input
                                                                name="Created"
                                                                type="text"
                                                                id="myprofile_search_input4"
                                                                placeholder="mm/dd/yyyy"
                                                                ref={this.searchedMarkDate}
                                                            // onChange={this.handleInputChange}
                                                            />

                                                            <input
                                                                name="Class"
                                                                type="text"
                                                                id="myprofile_search_input1"
                                                                placeholder="by subject"
                                                                ref={this.searchedSubject}
                                                            // onChange={this.handleInputChange}
                                                            />
                                                            <input type="submit" value="Find" id="myprofile_search_button1" />
                                                            <button
                                                                onClick={() => this.resetSearch(this.state.student.ID)}
                                                                className="btn-cancel"> RESET </button>

                                                        </form>



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
                                                                    </tr>
                                                                </thead>
                                                                <tbody>

                                                                    {
                                                                        this.state.marks.map(mark =>
                                                                            <tr key={mark.ID}>
                                                                                <td>{mark.ID}</td>
                                                                                <td>{mark.MarkValue}</td>
                                                                                <td>{mark.Semester}</td>
                                                                                <td>{mark.Created}</td>
                                                                                <td>{mark.SubjectName}</td>
                                                                                <td>{mark.Teacher}</td>
                                                                            </tr>
                                                                        )
                                                                    }

                                                                </tbody>
                                                            </table>
                                                        }
                                                    </div>
                                                }
                                            </div>
                                        }

                                    </div>
                                }

                                {!this.state.isParentDisabled &&
                                    <div>
                                        <div>
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

export default StudentIdProfile;