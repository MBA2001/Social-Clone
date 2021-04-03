import React, { Component } from 'react'
import {Link} from 'react-router-dom';
import MyButton from '../util/TheButton';
import propTypes from 'prop-types';
import PostScream from '../components/PostScream';
import Notifications from './Notifications';
//MUI
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
//
import HomeIcon from '@material-ui/icons/Home';

//* REDUX
import {connect} from 'react-redux';
class NavBar extends Component {
    render() {
        const {authenticated} = this.props
        return (
            // TODO: change the NavBar color
            <AppBar style={{background:'#009688',position:'absolute', alignItems:'center'}}>
                <Toolbar className="nav-container" >
                    {authenticated? (
                        <>
                            <PostScream/>
                           <Link to="/">
                            <MyButton tip="home">
                                <HomeIcon/>
                            </MyButton>
                            </Link>
                            <Notifications />
                        </>
                    ) : (
                        <>
                        <Button color="inherit" component={Link} to="/">home</Button>
                        <Button color="inherit" component={Link} to="/login">Login</Button>
                        <Button color="inherit" component={Link} to="/signup">signup</Button>
                        </>
                    )}
                </Toolbar>
            </AppBar>
        )
    }
}

NavBar.propTypes = {
    authenticated: propTypes.bool.isRequired
}

const mapStateToProps = (state) => ({
    authenticated: state.user.authenticated
})

export default connect(mapStateToProps)(NavBar);
