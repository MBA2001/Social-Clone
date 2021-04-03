import React, { Component } from 'react'
import propTypes from 'prop-types';
import { connect } from 'react-redux';
import axios from 'axios';
import Scream from '../components/Scream';
import Grid from '@material-ui/core/Grid';
import {getUserData} from '../redux/actions/dataActions';
import StaticProfile from '../components/StaticProfile';
import CircularProgress from '@material-ui/core/CircularProgress';

class User extends Component {
    state = {
        screamIdParam: null,
        profile: null
    }
    componentDidMount(){
        const handle = this.props.match.params.handle;
        const screamId = this.props.match.params.screamId;

        if(screamId){
            this.setState({screamIdParam: screamId})
        }
        this.props.getUserData(handle);
        axios.get(`/user/${handle}`)
            .then(res => {
                this.setState({profile: res.data.user})
            })
            .catch(err => console.log(err));
    }
    render() {
        const {data: {screams, loading}} = this.props;
        const {screamIdParam} = this.state;
        const screamsMarkup = loading? (
            <CircularProgress size={50} style={{position:'absolute',color: '#009688'}}/>
        ): screams === null ? (
            <p>No screams from this user</p>
        ) : !screamIdParam? (
            screams.map(scream => <Scream key={scream.screamId} scream={scream}/>)
        ) : (
            screams.map(scream => {
                if(scream.screamId !== screamIdParam){
                    return <Scream key={scream.screamId} scream={scream}/>
                }else{
                    return <Scream key={scream.screamId} scream={scream} openDialog/>
                }
            })
        )
        return (
            <Grid container spacing={10}>
                <div style={{display:'inline-block', width:1000}}>
                    <Grid item small={8} xs={12}>
                        <p>Howls</p>
                        {screamsMarkup}
                    </Grid>
                </div>
                <div style={{display:'inline-block', marginRight: 80}}>
                    <Grid item small={4} xs={12}>
                        {this.state.profile === null? (
                            <CircularProgress size={50} style={{position:'absolute', marginTop:100, marginLeft:150, color: '#009688'}}/>
                        ): (
                            <StaticProfile profile={this.state.profile}/>
                        )}
                    </Grid>
                </div>
            </Grid>
        )
    }
}

User.propTypes = {
    data: propTypes.object.isRequired,
    getUserData: propTypes.func.isRequired
}

const mapStateToProps = state => ({
    data: state.data
})

export default connect(mapStateToProps,{getUserData})(User);
