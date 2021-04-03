import React, { Component } from 'react'
import Grid from '@material-ui/core/Grid'
import CircularProgress from '@material-ui/core/CircularProgress'
import Scream from '../components/Scream';
import Profile from '../components/Profile';

import {connect} from 'react-redux'
import {getScreams} from '../redux/actions/dataActions';
import propTypes from 'prop-types'

class Home extends Component {
    state = {
        screams: null
    }
    componentDidMount(){
        this.props.getScreams();
    }
    render() {
        const {screams, loading} = this.props.data;
        let recentScreamsMarkup = !loading? (
        screams.map(scream => <Scream key={scream.screamId} scream={scream} />)
        ) : (
            <CircularProgress size={50} style={{position:'absolute', color: '#009688'}}/>
        )
        return (
            <Grid container spacing={10}>
                <div style={{display:'inline-block', width:1000}}>
                    <Grid item small={8} xs={12} style={{marginTop:50}}>
                        {recentScreamsMarkup}
                    </Grid>
                </div>
                <div style={{display:'inline-block', marginRight: 80}}>
                    <Grid item small={4} xs={12}>
                        <Profile />
                    </Grid>
                </div>
            </Grid>
        )
    }
}

Home.propTypes = {
    getScreams: propTypes.func.isRequired,
    data: propTypes.object.isRequired
}

const mapStateToProps = (state) => ({
    data: state.data
})

export default connect(mapStateToProps,{getScreams})(Home);
