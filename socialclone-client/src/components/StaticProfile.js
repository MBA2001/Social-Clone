import React from 'react'
import propTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import dayjs from 'dayjs';
import {Link} from 'react-router-dom'
//MUII
import MuiLink from '@material-ui/core/Link'
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

//Icons
import LocationOn from '@material-ui/icons/LocationOn';
import LinkIcon from '@material-ui/icons/Link';
import CalendarToday from '@material-ui/icons/CalendarToday';

const styles = {
    paper:{
        width: '25%',
        position:'absolute',
        paddingLeft: 10,
        paddingTop: 20,
        paddingBottom: 20,
        marginTop: 40
    },
    profile:{
        '& .image-wrapper':{
            textAlign: 'center',
            position: 'relative'
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
    }
}

const StaticProfile = (props) => {
    const {classes, profile: {userHandle, createdAt, imageUrl, bio,website,location}} = props;
    return (
        <Paper className={classes.paper}>
                    <div className={classes.profile}>
                        <div className='image-wrapper'>
                            <img src ={imageUrl} alt='profile' className='profile-image'/>
                        </div>
                        <hr/>
                        <div className='profile-details'>
                            <MuiLink component={Link} to={`/user/${userHandle}`} style={{color:'#009688'}} variant='h5'>
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
                    </div>
                </Paper>
    )
}

StaticProfile.propTypes={
    profile: propTypes.object.isRequired,
    classes: propTypes.object.isRequired
}

export default withStyles(styles)(StaticProfile);