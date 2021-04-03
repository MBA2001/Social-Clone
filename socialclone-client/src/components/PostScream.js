import React, { Component } from 'react'
import propTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import MyButton from '../util/TheButton';
//* Redux
import {connect} from 'react-redux';
import {postScream} from '../redux/actions/dataActions';


//* MUI
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import CircularProgress from '@material-ui/core/CircularProgress';
import AddIcon from '@material-ui/icons/Add';
import CloseIcon from '@material-ui/icons/Close';
const styles = {
    textField:{
        margin:'10px auto 10px auto',
        '& label.Mui-focused': {
          color: '#009688',
        },
        '& .MuiInput-underline:after': {
          borderBottomColor: '#009688',
        }
    },
    submitButton:{
        position:'relative',
    },
    ProgressSpinner:{
        position:'absolute'
    },
    closeButton:{
        position:'absolute',
        left:'90%',
        top:'10%'
    }
}

class PostScream extends Component {
    state= {
        open:false,
        body: '',
        errors:{}
    }
    componentWillReceiveProps(nextProps){
        if(nextProps.UI.errors){
            this.setState({errors: nextProps.UI.errors})
        }
        if(!nextProps.UI.errors && !nextProps.UI.loading){
            this.setState({body: ''});
            this.handleClose();
        }
    }

    handleOpen = () => {
        this.setState({open :true})
    }
    handleClose = () => {
        this.setState({open :false, errors:{}})
    }
    handleChange = (event) => {
        this.setState({
            [event.target.name]:event.target.value
        })
    }

    handleSubmit = (event) => {
        event.preventDefault();
        const scream= {
            body: this.state.body.trim().toString()
        }
        this.props.postScream(scream);

    }
    render(){
        const {errors} = this.state;
        const {classes, UI:{loading}} = this.props
        return(
            <div>
                <MyButton tip='create howl' onClick={this.handleOpen}>
                    <AddIcon color='primary'/>
                </MyButton>
                <Dialog 
                    open={this.state.open} 
                    onClose={this.handleClose} 
                    fullWidth 
                    maxWidth='sm' 
                    PaperProps={{
                        style: {
                          backgroundColor: '#b2bec3',
                          boxShadow: 'none',
                          borderRadius:20
                        },
                      }}>
                    <MyButton tip='close' onClick={this.handleClose} tipClass={classes.closeButton}>
                        <CloseIcon />
                    </MyButton>
                    <DialogTitle>Post a new Howl</DialogTitle>
                    <DialogContent>
                        <form onSubmit={this.handleSubmit}>
                            <TextField 
                                name='body' 
                                type='text' 
                                label='howl'
                                rows='3' 
                                placeholder='your howl' 
                                error={errors.body?true:false} 
                                helperText={errors.body}
                                className={classes.textField}
                                onChange={this.handleChange}
                                fullWidth
                                />
                                <Button 
                                    type='submit' 
                                    variant='contained' 
                                    color='primary' 
                                    className={classes.submitButton} 
                                    disabled={this.state.body.trim().length === 0 || loading}
                                    style={this.state.body.trim().length === 0? {} : {backgroundColor:'#009688',color:'black'}}
                                    >
                                    Submit
                                    {
                                    loading && (
                                        <CircularProgress size='30px' className={classes.ProgressSpinner} style={{color: '#009688'}}/>
                                    )
                                    }
                                </Button>                                
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
        )
    }
}

PostScream.propTypes = {
    postScream: propTypes.func.isRequired,
    UI: propTypes.object.isRequired
}

const mapStateToProps = (state) => ({
    UI: state.UI
})

export default connect(mapStateToProps,{postScream})(withStyles(styles)(PostScream));