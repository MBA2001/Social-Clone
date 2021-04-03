import React, { Component, Fragment } from 'react'
import propTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import MyButton from '../util/TheButton';
//* Redux
import {connect} from 'react-redux';
import {editUserDetails} from '../redux/actions/userActions';


//* MUI
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import EditIcon from '@material-ui/icons/Edit';

const styles = () => ({
    button: {
        float: 'right'
    },
    textField:{
        margin:'10px auto 10px auto',
        '& label.Mui-focused': {
          color: '#009688',
        },
        '& .MuiInput-underline:after': {
          borderBottomColor: '#009688',
        },
        width:500
    },
    container:{
        display:'flex',
        flexDirection:'column',
        width:'40vh',
        alignItems:'center'
    }
})

class EditDetails extends Component {
    state ={
        bio:'',
        website:'',
        location:'',
        open:false
    };

    mapUserDetailsToState = (credentials) => {
        this.setState({
            bio: credentials.bio? credentials.bio : '',
            website: credentials.website? credentials.website : '',
            location: credentials.location? credentials.location : ''

        })
    }
    componentDidMount(){
        const {credentials} = this.props
        this.mapUserDetailsToState(credentials);
    }

    handleOpen = () => {
        this.setState({open:true})
        const {credentials} = this.props;
        this.mapUserDetailsToState(credentials);
    }

    handleClose= () => {
        this.setState({open: false})
    }

    handleChange = (event) => {
        this.setState({
            [event.target.name]:event.target.value
        })
    }

    handleSubmit = () => {
        const userDetails = {
            bio: this.state.bio,
            website: this.state.website,
            location: this.state.location
        }

        this.props.editUserDetails(userDetails);
        this.handleClose();
    }

    render() {
        const {classes} = this.props
        return (
            <Fragment>
                <MyButton tip="edit details" onClick={this.handleOpen} buttonClass={classes.button}>
                    <EditIcon style={{color:'#009688'}}/>
                </MyButton>
                <Dialog open={this.state.open}
                    onClose={this.handleClose}
                    fullWidth
                    maxWidth="sm"
                    PaperProps={{
                        style: {
                          backgroundColor: '#b2bec3',
                          boxShadow: 'none',
                          borderRadius:20
                        },
                      }}
                >
                    <DialogTitle>Edit Your Details</DialogTitle>
                    <DialogContent>
                        <form className={classes.container}>
                            <TextField 
                                name="bio" 
                                type="text" 
                                label="Bio" 
                                multiline rows="3" 
                                placeholder="A Short Bio about you"
                                className={classes.textField}
                                value={this.state.bio}
                                onChange={this.handleChange}
                                />
                                <TextField 
                                name="website" 
                                type="text" 
                                label="Website"  
                                placeholder="Your Website"
                                className={classes.textField}
                                value={this.state.website}
                                onChange={this.handleChange}
                                />
                                <TextField 
                                name="location" 
                                type="text" 
                                label="Location"  
                                placeholder="your Location"
                                className={classes.textField}
                                value={this.state.location}
                                onChange={this.handleChange}
                                />
                        </form>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleClose}>Cancel</Button>
                        <Button onClick={this.handleSubmit}>Save</Button>
                    </DialogActions>
                </Dialog>

            </Fragment>
        )
    }
}

EditDetails.propTypes = {
    editUserDetails: propTypes.func.isRequired,
    classes: propTypes.object.isRequired
}

const mapStateToProps = (state) => ({
    credentials: state.user.credentials
})

export default connect(mapStateToProps,{editUserDetails})(withStyles(styles)(EditDetails));
