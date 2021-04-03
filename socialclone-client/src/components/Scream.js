import React, { Component } from 'react'
import WithStyles from '@material-ui/core/styles/withStyles';
import {Link} from 'react-router-dom';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import propTypes from 'prop-types';

import DeleteScream from '../components/DeleteScream';
import {connect} from 'react-redux'

import ScreamDialog from './ScreamDialog';

//* MUI STUFF
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import CardMedia from '@material-ui/core/CardMedia'
import Typography from '@material-ui/core/Typography';
import LikeButton from './LikeButton';


//TODO: Change styles
const styles = {
    card:{
        display: 'flex',
        marginBottom:20,
        width: '80%',
        backgroundColor:'#b2bec3',
        borderRadius:30
    },
    image:{
        minWidth:200
    },
    content:{
        padding:25,
        objectFit:'cover'
    },
    buttons:{
        flexDirection:'row',
        display:'flex'
    }
}

class Scream extends Component {
    state ={
        opened: false
    }

    handleOpenDialog = () => {
        this.setState({opened: true})
    }
    render() {
        dayjs.extend(relativeTime);
        const {classes,
               scream: {body, createdAt, userImg, userHandle, screamId, likeCount, commentCount},
               user:{authenticated, credentials}} = this.props;

        
        const deleteButton  = authenticated && userHandle === credentials.userHandle ? (
            <DeleteScream screamId={screamId}/>
        ): null
        //TODO: change the color of the name
        return (
            <Card className={classes.card}>
                <CardMedia 
                    image={userImg}
                    title="Profile Image"
                    className={classes.image}
                />
                <CardContent className={classes.content}>
                    <Typography variant="h5" 
                    component={Link} 
                    to={`/user/${userHandle}`}
                    style={{color:'#009688'}}
                    >
                        {userHandle}
                    </Typography>
                    {deleteButton}
                    <Typography variant="body2" color="textSecondary">{dayjs(createdAt).fromNow()}</Typography>
                    <Typography variant="body1">{body}</Typography>
                    <div className={classes.buttons}>
                        <LikeButton screamId={screamId} />
                        <span style={{position:'absolute',marginTop:40}}>{likeCount} likes</span>
                        <span style={{position:'absolute',marginTop:40, marginLeft:70}}>{commentCount} comments</span>
                        <ScreamDialog screamId={screamId} userHandle={userHandle} openDialog={this.props.openDialog}/>
                    </div>
                </CardContent>
            </Card>
        )
    }
}


Scream.propTypes = {
    user: propTypes.object.isRequired,
    scream: propTypes.object.isRequired,
    classes: propTypes.object.isRequired,
    openDialog: propTypes.bool
}

const mapStateToProps = (state) =>({
    user: state.user
})



export default connect(mapStateToProps)(WithStyles(styles)(Scream));
