import React, { Component } from 'react'
import {Link} from 'react-router-dom';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import propTypes from 'prop-types';

//MUI
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import IconButton from '@material-ui/core/IconButton';
import ToolTip from '@material-ui/core/ToolTip';
import Typography from '@material-ui/core/Typography';
import Badge from '@material-ui/core/Badge'

//MUI ICONS
import NotificationsIcon from '@material-ui/icons/Notifications';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ChatIcon from '@material-ui/icons/Chat';

//Redux
import {connect} from 'react-redux'
import {markNotificationsRead} from '../redux/actions/userActions';



class Notifications extends Component{
    state = {
        anchor: null
    }
    handleOpen = (event) => {
        this.setState({anchor: event.target});
    }
    handleClose = () => {
        this.setState({anchor: null})
    }
    handleEntered = () => {
        let unreadNotifications = this.props.notifications.filter(notif => !notif.read).map(notif => notif.notificationId);
        this.props.markNotificationsRead(unreadNotifications);
    }
    render(){
        const {notifications} = this.props;
        const anchor = this.state.anchor;
        dayjs.extend(relativeTime)

        let notificationsIcon;

        if(notifications && notifications.length > 0){
            notifications.filter(not => not.read === false).length > 0? (
                notificationsIcon = (
                    <Badge badgeContent={notifications.filter(not => not.read === false).length} color='secondary'>
                        <NotificationsIcon/>
                    </Badge>
                )
            ) : (
                notificationsIcon = <NotificationsIcon/>
            )
            
        }else{
            notificationsIcon = <NotificationsIcon/>
        }

        let notificationsMarkup = notifications && notifications.length > 0? (
            notifications.map(notif => {
                const verb = notif.type === 'like' ? 'liked' : 'commented on';
                const time = dayjs(notif.createdAt).fromNow();
                const iconColor = notif.read ? '#009688' : 'grey';
                const icon = notif.type === 'like'? (
                    <FavoriteIcon style={{marginRight:10,color:iconColor}}/>
                ) : (
                    <ChatIcon style={{marginRight: 10, color:iconColor}}/>
                )

                return (
                    <MenuItem key={notif.createdAt} onClick={this.handleClose}>
                        {icon}
                        <Typography component={Link} color='default' variant='body1' to={`/user/${notif.recipient}/scream/${notif.screamId}`}>
                            {notif.sender} {verb} your howl {time}
                        </Typography>
                    </MenuItem>
                )
            })
        ): (
            <MenuItem onClick={this.handleClose}>
                You have no notifications yet
            </MenuItem>
        )
        return (
            <div>
                <ToolTip placement='top' title='notifications'>
                    <IconButton aria-owns={anchor? 'simple menu' : undefined} aria-haspopup='true' onClick={this.handleOpen}>
                        {notificationsIcon}
                    </IconButton>
                </ToolTip>
                <Menu anchorEl={anchor} open={Boolean(anchor)} onClose={this.handleClose} onEntered={this.handleEntered} PaperProps={{
                        style: {
                          backgroundColor: '#b2bec3',
                          boxShadow: 'none',
                          borderRadius:20
                        },
                      }}>
                    {notificationsMarkup}
                </Menu>
            </div>
        )
    }
}

Notifications.propTypes = {
    markNotificationsRead : propTypes.func.isRequired,
    notifications : propTypes.array.isRequired
}


const mapStateToProps = (state) => ({
    notifications: state.user.notifications
})


export default connect(mapStateToProps,{markNotificationsRead})(Notifications);