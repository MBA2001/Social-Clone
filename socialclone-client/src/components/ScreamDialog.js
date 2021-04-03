import React, { Component} from 'react'
import propTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import MyButton from '../util/TheButton';
import dayjs from 'dayjs';
import {Link} from 'react-router-dom';
import Comments from './Comments';
import CommentForm from './CommentForm';
//* Redux
import {connect} from 'react-redux';
import {getOneScream} from '../redux/actions/dataActions';
//* MUI
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
// Icons
import CloseIcon from '@material-ui/icons/Close';
import UnfoldMore from '@material-ui/icons/UnfoldMore';
import LikeButton from './LikeButton';
import ChatIcon from '@material-ui/icons/Chat'

// TODO: change styles and colors
const styles = {
    invisibleSeperator:{
        border:'none',
        margin: 4
    },
    profileImage:{
        width: 200,
        height:200
    },
    loading:{
        marginLeft:170,
        overflow:'auto',
        color: '#009688'
    },
    loadingContainer:{
        overflow:'hidden'
    }
}

class ScreamDialog extends Component {
    state ={
        open: false,
        oldPath: '',
        newPath: ''
    }
    componentDidMount(){
        if(this.props.openDialog){
            this.handleOpen();
        }
    }
    handleOpen = ()=>{
        let oldPath = window.location.pathname;

        const {userHandle, screamId} = this.props
        const newPath = `/user/${userHandle}/scream/${screamId}`;
        
        if(oldPath === newPath)
            oldPath = `/user/${userHandle}`;

        window.history.pushState(null,null,newPath);

        this.setState({open:true, oldPath, newPath});
        this.props.getOneScream(this.props.screamId);
    }
    handleClose = ()=>{
        window.history.pushState(null,null,this.state.oldPath);

        this.setState({open:false});
    }
    render() {
        const {classes,
            scream:{screamId, body, createdAt, likeCount, commentCount,userImg, userHandle,comments},
            UI:{loading}
        } = this.props

        const dialogMarkup = loading? (
            <div className={classes.loadingContainer}>
            <CircularProgress size={200} style={{color:'#009688'}} className={classes.loading}/> 
            </div>):(
            <Grid container spacing={16}>
                <Grid item sm={5}>
                    <img src={userImg} alt='profile' className={classes.profileImage}/>
                </Grid>
                <Grid item sm={7}>
                    <Typography component={Link} style={{color:'#009688'}} variant='h5' to={`/user/${userHandle}`}>
                        {userHandle}
                    </Typography>
                    <hr className={classes.invisibleSeperator}/>
                    <Typography variant="body2" style={{color:'black'}}>
                        {dayjs(createdAt).format('h:mm a, MMMM DD YYYY')}
                    </Typography>
                    <hr className={classes.invisibleSeperator}/>
                    <Typography variant='body1'>
                        {body}
                    </Typography>
                    <LikeButton screamId={screamId} disabled={true}/>
                    <span>{likeCount} Likes</span>
                    <MyButton tip='comments' disabled={true}>
                            <ChatIcon style={{color:'#009688'}}/>
                        </MyButton>
                    <span>{commentCount} comments</span>
                </Grid>
                <hr/>
                <CommentForm screamId={screamId}/>
                <Comments comments={comments}/>
            </Grid>
        )
        return (
            <div>
                <MyButton tip='comments' style={{marginLeft:40}} onClick={this.handleOpen}>
                            <ChatIcon style={{color:'#009688'}}/>
                </MyButton>
                <MyButton tip='expand this howl' 
                    onClick={this.handleOpen} 
                    tipClass={classes.dialogButton} 
                    style={{position:'absolute', marginLeft:353}}
                >
                    <UnfoldMore style={{color:'#009688'}}/>
                </MyButton>
                <Dialog open={this.state.open} onClose={this.handleClose} fullWidth maxWidth='sm' PaperProps={{
                        style: {
                          backgroundColor: '#b2bec3',
                          boxShadow: 'none',
                          borderRadius:20
                        },
                      }}>
                    <MyButton tip='close' onClick={this.handleClose} tipClass={classes.closeButton}>
                        <CloseIcon />
                    </MyButton>
                    <DialogContent className={classes.dialogContent}>
                        {dialogMarkup}
                    </DialogContent>
                </Dialog>
            </div>
        )
    }
}

ScreamDialog.propTypes = {
    getOneScream: propTypes.func.isRequired,
    screamId: propTypes.string.isRequired,
    userHandle: propTypes.string.isRequired,
    scream: propTypes.object.isRequired,
    UI: propTypes.object.isRequired
}

const mapStateToProps = (state) => ({
    UI: state.UI,
    scream: state.data.scream
})

const mapActionsToProps = {
    getOneScream
}

export default connect(mapStateToProps,mapActionsToProps)(withStyles(styles)(ScreamDialog));
