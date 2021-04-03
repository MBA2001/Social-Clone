import React, { Component } from 'react'
import MyButton from '../util/TheButton';
import {Link} from 'react-router-dom';
import propTypes from 'prop-types';
import FavoriteBorder from '@material-ui/icons/FavoriteBorder';
import Favorite from '@material-ui/icons/Favorite';
import {connect} from 'react-redux';
import {likeScream, unlikeScream} from '../redux/actions/dataActions';


class LikeButton extends Component {
    likedScream(){
        if(this.props.user.likes && this.props.user.likes.find(like => like.screamId === this.props.screamId)) return true;
        else return false;
    }

    likeScream = () =>{
        this.props.likeScream(this.props.screamId);
    }
    unlikeScream = () => {
        this.props.unlikeScream(this.props.screamId);
    }
    render() {
        const {user:{authenticated},disabled} = this.props
        const likeButton = !authenticated? (
            <Link to='/login'>
                <MyButton tip ='like'>
                    
                        <FavoriteBorder style={{color:'#009688'}}/>
                </MyButton>
            </Link>
        ) : (
            this.likedScream()? (
                <MyButton tip = 'unlike' onClick={this.unlikeScream} disabled={disabled}>
                    <Favorite style={{color:'#009688'}} />
                </MyButton>
            ): (
                <MyButton tip = 'like' onClick={this.likeScream} disabled={disabled}>
                    <FavoriteBorder style={{color:'#009688'}}/>
                </MyButton>
            )
        );
        return likeButton;
    }
}

LikeButton.propTypes = {
    user: propTypes.object.isRequired,
    screamId:propTypes.string.isRequired,
    likeScream: propTypes.func.isRequired,
    unlikeScream: propTypes.func.isRequired,
    disabled: propTypes.bool
}


const mapStateToProps = (state) =>({
    user:state.user
})

const mapActionsToProps ={
    likeScream,
    unlikeScream
}

export default connect(mapStateToProps,mapActionsToProps)(LikeButton);
