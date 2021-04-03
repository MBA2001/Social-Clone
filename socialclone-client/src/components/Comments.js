import React, { Component, Fragment } from 'react'
import propTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import dayjs from 'dayjs';
//Mui stuff
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { Link } from 'react-router-dom';

const styles = {
    image:{
        maxWidth: '100%',
        height: 100,
        objectFit: 'cover',
        borderRadius: '50%'
    },
    commentData:{
        marginLeft: 20
    }
}
class Comments extends Component {
    render() {
        const {comments, classes} = this.props
        return (
            <Grid container>
                {comments.map(comment => {
                    const {body, createdAt, userImg, userHandle} = comment;
                    return (
                        <Fragment key={createdAt}>
                            <Grid item sm={12}>
                                <Grid container >
                                    <Grid item sm={2}>
                                        <img src={userImg} alt="comment" className={classes.image}></img>
                                    </Grid>
                                    <Grid item sm={9}>
                                        <div className={classes.commentData}>
                                            <Typography variant='h5' component={Link} to={`/user/${userHandle}`} style={{color:'#009688'}}>
                                                {userHandle}
                                            </Typography>
                                            <Typography variant='body2' color='textSecondary'>
                                                {dayjs(createdAt).format('h:mm a, MMMM DD YYYY')}
                                            </Typography>
                                            <hr  style={{border:'none'}}/>
                                            <Typography variant='body1'> {body}</Typography>
                                        </div>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Fragment>
                    )
                })}
            </Grid>
        )
    }
}

Comments.propTypes= {
    Comments: propTypes.array.isRequired
}

export default withStyles(styles)(Comments);
