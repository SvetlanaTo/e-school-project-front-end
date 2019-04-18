import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { FTS, MARKS, IMAGEPATH } from '../../service/api';
import '../../style/components/teacherView/ftsId.css';

class FormToTeacherSubjectId extends Component {
    constructor(props) {
        super(props);
        this.searchedStudentName = React.createRef();
        this.state = {
            ftsOne: null,
            ftsOneId: 0,
            teacherId: '',
            subjectId: 0,
            formId: 0,
            students: [],
            marksDTO: [],
            marksDTOone: null,
            urlImg: IMAGEPATH,
            openAddMarkModal: false,
            studentId: '',
            MarkValue: 0,
            teacherName: '',
            formGradeTag: '',
            subjectName: '',
        };
    }

    componentDidMount() {
        this.fetchMarks()
    }

    fetchMarks = () => {
        const currentUser = localStorage.getItem("token");
        const isTeacher = (localStorage.getItem("role") === 'teacher') ? true : false;
        const currentUserId = localStorage.getItem('UserId');

        if (localStorage.getItem('token') === null) {
            this.props.history.push('/login');
        }
        else if (localStorage.getItem('role') !== 'teacher') {
            this.props.history.push('/no-auth');
        }
        else {
            const path = FTS + "/" + this.props.match.params.id;
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
                        ftsOne: data,
                        ftsOneId: data.ID,
                        teacherId: data.TeacherToSubject.Teacher.ID,
                        teacherName: data.TeacherToSubject.Teacher.FirstName + ' ' + data.TeacherToSubject.Teacher.LastName,

                        formId: data.Form.ID,
                        formGradeTag: data.Form.Grade + '-' + data.Form.Tag,

                        subjectId: data.TeacherToSubject.Subject.ID,
                        subjectName: data.TeacherToSubject.Subject.Name
                    })
                });

            const pathForMarks = MARKS + "/by-fts/" + this.props.match.params.id;
            const requestForMarks = {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer  ' + localStorage.getItem("token")
                }
            };
            fetch(pathForMarks, requestForMarks)
                .then(response => response.json())
                .then(data => {
                    this.setState({
                        marksDTO: data,
                    })
                });
        }
    }

    addMark = (id) => {
        console.log('student id:', id);
        let marksDTOone = this.state.marksDTO.find(dto => dto.StudentID === id);
        this.setState({
            openAddMarkModal: true,
            marksDTOone: marksDTOone,
            studentName: marksDTOone.Student,
            studentId: id,
        });
    }

    closeAddMarkModal = () => {
        this.setState({
            openAddMarkModal: false,
            studentId: '',
            note: ''
        })
    }

    handleInputChange = (event) => {
        const target = event.target;
        const name = target.name;

        this.setState({
            [name]: target.value,
            errorMessage: '',
        });
        console.log(name, target.value);
    }

    handleSubmit = (event) => {
        console.log('da li je ovo mark value id: ', this.state.MarkValue);

        const ftsId = this.state.ftsOneId;
        const studentId = this.state.studentId;
        const studentName = this.state.studentName;
        const markValue = this.state.MarkValue;


        const r = window.confirm(`Are you sure you want to give 
        mark: ${markValue} to
        student: ${studentName}?`);
        if (r === true) {
            const path = MARKS + "/fts/" + ftsId + "/student/" + studentId;

            console.log(path);

            const requestOptions = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer  ' + localStorage.getItem("token")
                },
                body: JSON.stringify({
                    MarkValue: markValue
                })
            }
            fetch(path, requestOptions)
                .then(response => {
                    if (response.ok) {


                        this.fetchMarks()
                        const r = window.confirm(`Success! Do you wish to 
                        add a new mark to student: ${studentName}?`);

                        if (r === true) {
                            response.json().then(data => {
                                this.setState({
                                    errorMessage: '',
                                    openAddMarkModal: true,
                                });
                            });
                        }
                        else {
                            response.json().then(data => {
                                this.setState({
                                    errorMessage: '',
                                    openAddMarkModal: false,
                                    studentId: '',
                                });

                            });
                        }
                    }
                    else {
                        response.text().then(message => this.setState({ errorMessage: message }));
                    }
                })
                .catch(error => console.log(error));

            event.preventDefault();
        }
        else {
            console.log('what to do?');
        }

    };

    updateStudentMarks = (id) => {

        console.log(id)
        let student = this.state.marksDTO.find(s => s.StudentID === id);
        console.log(student);
        if (student.FirstSemesterAverageMark === null && student.SecondSemesterAverageMark === null) {
            alert(`${student.Student}'s mark list is empty.`)
        }
        else {
            const ftsId = this.state.ftsOneId;
            console.log('student id:', id, 'fts:', ftsId);
            this.props.history.push(ftsId + "/student/" + id);
        }

    }

    searchStudents = (event) => {
        event.preventDefault();

        let originalStudentList = this.state.marksDTO;
        let newList = [];

        if (this.searchedStudentName.current.value !== "") {
            newList = this.state.marksDTO.filter(mark => {
                const lc = mark.Student.toLowerCase();
                const filter = this.searchedStudentName.current.value.toLowerCase();
                return lc.includes(filter);
            })
            this.setState({
                marksDTO: newList,
                searchedByDateExtraTitle: true,
                searchedByMarkValueExtraTitle: false,
            });
        }
        else {
            newList = originalStudentList;
            this.setState({
                marksDTO: newList,
                searchedByDateExtraTitle: false,
                searchedByMarkValueExtraTitle: false,
            });
        }

    }

    resetSearch() {
        window.location.reload()
    }

    render() {

        const buttons = [
            { name: "Add Mark", action: this.addMark, class: "tv_add_mark" },

        ];

        return (
            <div className="bodiesFTSId">
                <div className='my_student_page_NoaddLinks'>
                    {/* background img */}
                </div>
                <div id='zaglavlje_tv_ftsId'>
                    <div id="okvir_za_h3">
                        <h3>{this.state.subjectName}</h3>
                        <h3> Form: {this.state.formGradeTag} </h3>

                        <h3>{this.state.marksDTO.length} students</h3>
                    </div>
                </div>

                <div className="tview_ftsId_wrapper">



                    {
                        this.state.marksDTO !== null &&
                        <div>
                            <form onSubmit={this.searchStudents} className='search_in_tviewFTSID'>
                                <label id="input4">Search student </label>

                                <input
                                    name="Name"
                                    type="text"
                                    id="input6"
                                    placeholder="by name"
                                    ref={this.searchedStudentName}
                                // onChange={this.handleInputChange}
                                />
                                <input type="submit" value="Find" className="btn-neutral-xs" id="button1" />
                                <button onClick={this.resetSearch} className="btn-cancel"> RESET </button>
                            </form>



                            <ul className="tview_ftsId_list_row">
                                <li id='zag_tabele_dnevnika'>
                                    <ul id='z_t_d_ul'>
                                        <li><div id='tv_header_li_student'>Student</div></li>
                                        <li id='tv_header_li_fs'>First Semester</li>
                                        <li id='tv_header_li_mm'>Midterm mark</li>
                                        <li id='tv_header_li'>Second Semester</li>
                                        <li id='tv_header_li'>Final mark</li>
                                        <li></li>
                                        <li></li>


                                    </ul>
                                </li>
                                {this.state.marksDTO.map((dto) =>
                                    <li key={dto.StudentID} id='zag_tabele_dnevnika2'>
                                        <ul id='z_t_d_ul2'>

                                            <li>
                                                <div className="flip-card-teacher-view">
                                                    <div className="flip-card-inner-teacher-view">
                                                        <div className="flip-card-front-teacher-view">
                                                            <img src={this.state.urlImg + dto.ImagePath} alt="Avatar" width='150px' height="150px" />
                                                            <div></div>{dto.Student}
                                                        </div>
                                                        <div className="flip-card-back-teacher-view">
                                                            <h2>{dto.Student}</h2>
                                                            <p>Parent: {dto.Parent}</p>
                                                            <p>Mobile: {dto.ParentMobile}</p>

                                                        </div>
                                                    </div>
                                                </div>
                                            </li>
                                            <li >

                                                {dto.FirstSemesterMarks.length !== null && dto.FirstSemesterMarks.map((mark, fsIndex) =>
                                                    <ul key={fsIndex + 1}>
                                                        <li>{mark}</li>
                                                    </ul>
                                                )
                                                }

                                            </li>

                                            <li><b>{dto.FirstSemesterAverageMark}</b></li>


                                            <li>{dto.SecondSemesterMarks !== null && dto.SecondSemesterMarks.map((mark, ssIndex) =>
                                                <ul key={ssIndex + 1}>
                                                    <li>{mark}</li>
                                                </ul>
                                            )
                                            }</li>


                                            <li><b>{dto.SecondSemesterAverageMark}</b></li>
                                            {
                                                buttons.map(btn => (
                                                    <li id="cells_for_buttons_tv" key={btn.name}><button id="tv_add_mark" onClick={() => btn.action(dto.StudentID)}>{btn.name}</button></li>
                                                ))
                                            }

                                            <li id="cells_for_buttons_tv"><button id="tv_update_mark" onClick={() => this.updateStudentMarks(dto.StudentID)}> Update </button></li>
                                        </ul>


                                        {this.state.ftsOne && dto.StudentID === this.state.studentId && this.state.openAddMarkModal &&
                                            <div>
                                                <form onSubmit={this.handleSubmit} className='unos_ocene_tv'>
                                                    <label className='unos_ocene_tv_label'>
                                                        Choose a mark value:</label>
                                                    <select
                                                        className='unos_ocene_tv_select'
                                                        value={this.state.MarkValue}
                                                        onChange={this.handleInputChange}
                                                        name="MarkValue"
                                                        required >

                                                        <option value={0}> Marks..</option>
                                                        <option value={1}>1</option>
                                                        <option value={2}>2</option>
                                                        <option value={3}>3</option>
                                                        <option value={4}>4</option>
                                                        <option value={5}>5</option>
                                                    </select>

                                                    <input type="submit" value="Add mark" className="unos_ocene_tv_submit" />
                                                    <button onClick={this.closeAddMarkModal} className="unos_ocene_tv_cancel"> Cancel </button>
                                                    <label className="error">{this.state.errorMessage}</label>

                                                </form>


                                            </div>
                                        }

                                    </li>
                                )
                                }
                            </ul>
                        </div>
                    }



                </div>
            </div>
        )
    }
}


export default withRouter(FormToTeacherSubjectId);


