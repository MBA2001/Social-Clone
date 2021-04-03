import React, { Component } from 'react'
import propTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import { connect } from 'react-redux';
import {Link} from 'react-router-dom';
import dayjs from 'dayjs';
import {logOutUser, uploadImage} from '../redux/actions/userActions';
import EditDetails from './EditDetails';
import MyButton from '../util/TheButton';
//* MUI
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import MuiLink from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import EditIcon from '@material-ui/icons/Edit';
import CircularProgress from '@material-ui/core/CircularProgress';
//* icons
import LocationOn from '@material-ui/icons/LocationOn';
import LinkIcon from '@material-ui/icons/Link';
import CalendarToday from '@material-ui/icons/CalendarToday';
import KeyboardReturn from '@material-ui/icons/KeyboardReturn';
const styles = {
    paper:{
        width: '25%',
        position:'absolute',
        paddingLeft: 10,
        paddingTop: 20,
        paddingBottom: 20,
        marginTop: 40,
        backgroundColor:'#b2bec3'
    },
    profile:{
        '& .image-wrapper':{
            textAlign: 'center',
            position: 'relative',
            '& button':{
                position: 'absolute',
                top: '80%',
                left: '70%'
            }
        },
        '& .profile-image':{
            width: 200,
            height:200,
            objectFit: 'cover',
            maxWidth: '100%',
            borderRadius:'50%'
        },
        '& .profile-details':{
            textAlign: 'center',
            '& span, svg':{
                verticalAlign:'middle'
            },
            '& a':{
                color: 'blue'
            }
        },
        '& hr':{
            border:'none',
            margin: '0 0 10px 0'
        },
        '& svg.button':{
            '&:hover':{
                cursor: 'pointer'
            }
        }
    },
    buttons : {
        textAlign: 'center',
        '& a':{
            margin: '20px 10px'
        }
    }
}

export class Profile extends Component {

    handleimageUpload = (event) => {
        const image = event.target.files[0];
        const formdata = new FormData();
        formdata.append('image',image,image.name);
        this.props.uploadImage(formdata);
    }
    handleEditPicture = () => {
        const fileInput = document.getElementById('image-Input');
        fileInput.click();
    }

    handleLogout = () => {
        this.props.logOutUser();
    }
    render() {
        const {
            classes,
            user: {
                credentials: {userHandle,createdAt,imageUrl,bio,website,location},
                loading,
                authenticated
                }
            } = this.props

            let profiileMarkup = !loading? (authenticated? (
                <Paper className={classes.paper}>
                    <div className={classes.profile}>
                        <div className='image-wrapper'>
                            <img src ={imageUrl} alt='profile' className='profile-image'/>
                            <input type='file' id="image-Input" onChange={this.handleimageUpload} hidden='hidden'/>
                            <MyButton tip="edit profile picture" onClick={this.handleEditPicture} buttonClass="button">
                                <EditIcon/>
                            </MyButton>
                        </div>
                        <hr/>
                        <div className='profile-details'>
                            <MuiLink component={Link} to={`/user/${userHandle}`} variant='h5' style={{color:'#009688'}}>
                                {userHandle}
                            </MuiLink>
                            <hr/>
                            {bio && <Typography variant="body1">{bio}</Typography>}
                            <hr/>
                            {location && (
                                <>
                                    <LocationOn style={{color:'#009688'}} /> <span>{location}</span>
                                    <hr/>
                                </>
                            )}
                            {website && (
                                <>
                                    <LinkIcon style={{color:'#009688'}}/>
                                    <a href={website} target="_blank" rel="noopener noreferrer">
                                        {'  '}{website}
                                    </a>
                                    <hr/>
                                </>
                            )}
                            <CalendarToday style={{color:'#009688'}}/>
                            {'   '}
                            <span>Joined {dayjs(createdAt).format('MMM YYYY')}</span>
                        </div>
                        <MyButton tip="logout" onClick={this.handleLogout}>
                            <KeyboardReturn style={{color:'#009688'}}/>
                        </MyButton>
                        <EditDetails/>
                    </div>
                </Paper>
            ): (
                <Paper className={classes.paper}>
                    <Typography variant="body2" align="center">
                        No profile Found, please logIn
                    </Typography>
                    <div className={classes.buttons}>
                        <Button variant="contained" component={Link} to="/login" style={{backgroundColor: '#009688'}}>Login</Button>
                        <p>if you dont have an account</p>
                        <Button variant="contained" style={{backgroundColor: '#009688'}} component={Link} to="/signup">Sign Up</Button>
                    </div>
                </Paper>
            )) : (<CircularProgress size={50} style={{position:'absolute', marginTop:200, marginLeft:150,color: '#009688'}} />)
        return profiileMarkup;
    }
}

Profile.propTypes = {
    user: propTypes.object.isRequired,
    classes: propTypes.object.isRequired,
    uploadImage: propTypes.func.isRequired,
    logOutUser: propTypes.func.isRequired
}

const mapStateToProps = (state) => ({
    user: state.user
})

const mapActionsToProps = {
    uploadImage,
    logOutUser
}

export default connect(mapStateToProps,mapActionsToProps)(withStyles(styles)(Profile));
