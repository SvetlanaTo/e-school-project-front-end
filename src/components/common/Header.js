import React, { Component } from 'react';
import { NavLink, withRouter } from 'react-router-dom';
import '../../style/common/header.css';

class Header extends Component {

    logout = () => {
        localStorage.clear();
        this.props.history.push("/login");
    }

    render() {
        return (
            <div>

                {localStorage.getItem("token") ?

                    <div >

                        {(localStorage.getItem("role") === 'admin') &&
                            <div className='navbar'>
                                <div className="same">\\ E-School</div>
                                <NavLink activeClassName='activeHeader' exact to="/">Home</NavLink>

                                <div className="dropdown">
                                    <button className="dropbtn"> Registration
      <i className="fa fa-caret-down"></i>
                                    </button>
                                    <div className="dropdown-content">

                                        <NavLink activeClassName='activeHeader' to="/register-teacher">Register - TEACHER</NavLink>
                                        <NavLink activeClassName='activeHeader' to="/register-student-and-parent">Register - STUDENT/PARENT</NavLink>
                                        <NavLink activeClassName='activeHeader' to="/register-admin">Register - ADMIN</NavLink>


                                    </div>
                                </div>

                                <NavLink activeClassName='activeHeader' to="/forms">Forms</NavLink>
                                <NavLink activeClassName='activeHeader' to="/students">Students</NavLink>
                                <NavLink activeClassName='activeHeader' to="/teachers">Teachers</NavLink>
                                <NavLink activeClassName='activeHeader' to="/subjects">Subjects</NavLink>
                                <NavLink activeClassName='activeHeader' to="/parents-album">Parents</NavLink>
                                <NavLink activeClassName='activeHeader' to="/admins">Admins</NavLink>


                                <div className="dropdown">
                                    <button className="dropbtn"> Loggings
                                    </button>
                                    <div className="dropdown-content">

                                        <NavLink activeClassName='activeHeader' to="/logger-today">today's</NavLink>
                                        <NavLink activeClassName='activeHeader' to="/logger-yesterday">yesterday's</NavLink>
                                        <NavLink activeClassName='activeHeader' to="/logger-2days-ago">2 days old</NavLink>


                                    </div>
                                </div>


                                <div className="logout" onClick={this.logout}>Logout  [ {localStorage.getItem("name")} ]</div>

                            </div>
                        }

                        {(localStorage.getItem("role") === 'teacher') &&
                            <div className='navbar'>
                                <div className="same">\\ E-School</div>
                                <NavLink activeClassName='activeHeader' exact to="/">Home</NavLink>
                                <NavLink activeClassName='activeHeader' to="/subjects-for-teacher"> Subjects </NavLink>
                                <div className="logout" onClick={this.logout}>Logout  [ {localStorage.getItem("name")} ]</div>
                            </div>
                        }

                        {(localStorage.getItem("role") === 'parent') &&
                            <div className='navbar'>
                                <div className="same">\\ E-School</div>
                                <NavLink activeClassName='activeHeader' exact to="/">Home</NavLink>
                                <NavLink activeClassName='activeHeader' to="/students-for-parent">Students</NavLink>
                                <div className="logout" onClick={this.logout}>Logout  [ {localStorage.getItem("name")} ]</div>
                            </div>
                        }

                        {(localStorage.getItem("role") === 'student') &&
                            <div className='navbar'>
                                <div className="same">\\ E-School</div>
                                <NavLink activeClassName='activeHeader' exact to="/">Home</NavLink>
                                <NavLink activeClassName='activeHeader' to="/my-profile">My Profile</NavLink>
                                <div className="logout" onClick={this.logout}>Logout  [ {localStorage.getItem("name")} ]</div>
                            </div>
                        }

                    </div>
                    :
                    <div className='navbar'>
                        <div className='same'>\\ E-School</div>

                    </div>
                }
            </div>


        )
    }
};

export default withRouter(Header);

