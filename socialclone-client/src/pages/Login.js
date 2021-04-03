import React, { Component } from 'react'
import withStyles from '@material-ui/core/styles/withStyles';
import propTypes from 'prop-types';
import icon from '../images/clone.png';
import {Link} from 'react-router-dom';

//* Redux stuff
import {connect} from 'react-redux';
import {loginUser} from '../redux/actions/userActions';
//* MUI Stuff
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button'
import CircularProgress from '@material-ui/core/CircularProgress'

const styles = {form:{
    display:'flex',
    justifyContent:'center',
    alignItems:'center',
    height: '50vh',
    flexDirection:'column'
  },
  image:{
      margin:'65px auto 20px auto'
  },
  container:{
      display:'flex',
      flexDirection:'column',
      width:'40vh',
      alignItems:'center'
  },
  pageTitle:{
      margin: '0 auto 40px auto',
  },
  textField:{
      margin:'10px auto 10px auto',
      '& label.Mui-focused': {
        color: '#009688',
      },
      '& .MuiInput-underline:after': {
        borderBottomColor: '#009688',
      }
  },
  button:{
      width:'20vh',
      height:'5vh',
      marginTop:'20px',
      position:'relative',
      background:'#009688',
      '&:hover':{
        background:'#009688'
      }
  },
  customError:{
      color:'red',
      fontSize:'0.8rem'
  },
  progress:{
      position: 'absolute',
      color: '#009688'
  }}


class Login extends Component {
    constructor(props){
        super(props);
        this.state = {
            email: '',
            password: '',
            errors:{}
        }
    }

    handleChange = (event) => {
        this.setState({
            [event.target.name]:event.target.value
        })
    }
    componentWillReceiveProps(nextProps){
        if(nextProps.UI.errors){
            this.setState({
                errors:nextProps.UI.errors
            })
        }
    }
    handleSubmit = (event) => {
        event.preventDefault();
        const userData= {
            email:this.state.email,
            password:this.state.password
        }
        this.props.loginUser(userData,this.props.history);
    }
    render() {
        const {classes, UI:{loading}} = this.props;
        const {errors} = this.state;
        return (
            <div className={classes.form}>
                <img src={icon} alt="Icon" height="100" className={classes.image}/>
                <Typography variant="h2" className={classes.pageTitle}>
                    Login
                </Typography>
                <form noValidate onSubmit={this.handleSubmit} className={classes.container}>
                    <TextField id="email" 
                        name="email" 
                        type="email" 
                        label="Email" 
                        className={classes.textField}
                        value={this.state.email} 
                        onChange={this.handleChange}
                        error={errors.email?true:false}
                        helperText={errors.email}
                        fullWidth
                        />
                        <TextField id="password" 
                        name="password" 
                        type="password" 
                        label="Password" 
                        className={classes.textField}
                        value={this.state.password} 
                        onChange={this.handleChange}
                        error={errors.password?true:false}
                        helperText={errors.password}
                        fullWidth
                        />
                        {errors.general && (
                            <Typography variant="body1" className={classes.customError}>
                                {errors.general}
                            </Typography>
                        )}
                        <Button type="submit" 
                        variant="contained"
                        className={classes.button}
                        disabled={loading}
                        >
                        {loading & (
                            <CircularProgress size={20} className={classes.progress}/>
                        ) || "Login"}
                        </Button>
                        <small>If you dont have an account <Link to='/signup'>Sign up</Link></small>
                </form>
            </div>
        )
    }
}

Login.propTypes = {
    classes: propTypes.object.isRequired,
    loginUser: propTypes.func.isRequired,
    user : propTypes.object.isRequired,
    UI: propTypes.object.isRequired
}

const mapStateToProps = (state) => ({
    user: state.user,
    UI: state.UI
})

const mapActionsToProps = {
    loginUser
}

export default connect(mapStateToProps,mapActionsToProps)(withStyles(styles)(Login));
