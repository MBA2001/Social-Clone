import React, { Component } from 'react'
import MyButton from '../util/TheButton';
import propTypes from 'prop-types';

//MUI

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/Button';
import DeleteIcon from '@material-ui/icons/DeleteOutline';

import {connect} from 'react-redux';
import {deleteScream} from '../redux/actions/dataActions';

class DeleteScream extends Component {
    state= {
        open: false
    };
    handleOpen = () => {
        this.setState({open:true})
    }
    handleClose = () => {
        this.setState({open:false})
    }
    deleteScream = () => {
        this.props.deleteScream(this.props.screamId);
        this.setState({open:false})
    }
    render() {
        return (
            <>
                <div style={{display: 'inline-block', float:'right', position:'absolute', left:'55%'}}>
                    <MyButton tip = 'delete howl' onClick={this.handleOpen}>
                        <DeleteIcon style={{color:'#009688'}}/>
                    </MyButton>
                </div>
                <Dialog open={this.state.open} onClose={this.handleClose} fullWidth maxWidth='sm'>
                    <DialogTitle>
                        Are you sure you want to delete this scream?
                    </DialogTitle>
                    <DialogActions>
                        <Button onClick={this.handleClose} >Cancel</Button>
                        <Button onClick={this.deleteScream}>Delete</Button>
                    </DialogActions>
                </Dialog>
            </>
        )
    }
}

DeleteScream.propTypes = {
    deleteScream: propTypes.func.isRequired,
    screamId: propTypes.string.isRequired
}


export default connect(null,{deleteScream})(DeleteScream);
