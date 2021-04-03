import React, { Component } from 'react'
import withStyles from '@material-ui/core/styles/withStyles';
import {connect} from 'react-redux';
import propTypes from 'prop-types';
import {submitComment} from '../redux/actions/dataActions';
//MIU
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import TextField from '@material-ui/core/TextField'

const styles = {
    button:{
        marginTop: 10
    },
    commentField:{
        '& label.Mui-focused': {
            color: '#009688',
          },
          '& .MuiInput-underline:after': {
            borderBottomColor: '#009688',
          }
    }
}
class CommentForm extends Component {
    state={
        body:'',
    }
    handleChange = (event)=>{
        this.setState({[event.target.name]: event.target.value})
    }
    handleSubmit = (event)=>{
        event.preventDefault();
        this.props.submitComment(this.props.screamId,{body:this.state.body});
        this.setState({body: ''})
    }
    render() {
        const {classes, authenticated} = this.props
        const commentFormMarkup = authenticated? (
            <Grid item sm={12} style={{textAlign:'center'}}>
                <form onSubmit={this.handleSubmit}>
                    <TextField 
                        name="body" 
                        type="text" 
                        label="comment on howl" 
                        value={this.state.body} 
                        onChange={this.handleChange} 
                        className={classes.commentField}
                        fullWidth/>
                        <Button 
                            type='submit' 
                            variant='contained' 
                            style={this.state.body.trim().length === 0? {} : {backgroundColor:'#009688',color:'black'}}
                            className={classes.button} 
                            disabled={this.state.body.trim().length === 0}>Submit</Button>
                </form>
                <hr/>
            </Grid>
        ) : null
        return commentFormMarkup;
    }
}

CommentForm.propTypes = {
    submitComment: propTypes.func.isRequired,
    UI: propTypes.object.isRequired,
    authenticated: propTypes.bool.isRequired,
    screamId: propTypes.string.isRequired,
    classes: propTypes.object.isRequired
}

const mapStateToProps = (state) => ({
    UI: state.UI,
    authenticated: state.user.authenticated
})

export default connect(mapStateToProps,{submitComment})(withStyles(styles)(CommentForm))
