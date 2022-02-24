import React from 'react'
import { Link, Navigate } from 'react-router-dom'
import { api } from '../api'
import axios from 'axios'
import isEmail from 'validator/lib/isEmail'
import { useForm } from 'react-hook-form'
import SEO from '../components/Seo'
// import { useSignUpStyles } from '../styles'
import { Button, Card, CardContent, CardHeader, CircularProgress, InputAdornment, TextField, Typography } from '@mui/material'
import { headers } from '../config/config'
import { CheckCircleOutline, HighlightOff } from '@mui/icons-material'

const SignUp = () => {
    // const classes = useSignUpStyles()
    const [loading, setLoading ] = React.useState(false)
    const [ error, setError ] = React.useState(null)
    const [accountCreated, setAccountCreated] = React.useState(false)
    const { register, handleSubmit, formState : { errors, isSubmitting, touchedFields, isValid }  } = useForm({mode:"onBlur"})

    

    async function onSubmit(data){
        setLoading(true)
        setError("")
        const { email, firstname, lastname, password, confirmpassword} = data
        try{

            if (password !== confirmpassword){
                setError('Passwords must match')
                return
            }
            const res = await axios.post(api.auth.register, JSON.stringify(data), headers)
            if (res.status !== 201){
                setLoading(false)
                return
            }
            setAccountCreated(true)
        }catch(err){
            setError('Sorry, there was an error signing up')
            setLoading(false)
            
        }
    }  

    const errorIcon = (
        <InputAdornment position="end">
            <HighlightOff style={{color: 'red', height: 30, width: 30}} />
        </InputAdornment>
    )

    const validIcon = (
        <InputAdornment position="end">
            <CheckCircleOutline style={{color: 'green', height: 30, width: 30}} />
        </InputAdornment>
    )

    return (
        <>
        <SEO title="Sign Up"/> 
        <section>
            <article>
                <Card >
                    <CardContent>
                    <Typography variant="h2">
                        Please Sign Up Below
                    </Typography>
                    <form onSubmit={handleSubmit(onSubmit)} action="">
                    <TextField
                    name="email"
                    {...register('email', {
                        required: true,
                        minLength: 2,
                        maxLength: 30,
                        validate: (input) => isEmail(input),
                    })}
                    InputProps={{
                        endAdornment: errors.email ? errorIcon : touchedFields.email && validIcon
                    }}
                    fullWidth
                    variant="filled"
                    label="Email"
                    margin="dense"
                    autoComplete="email"
                    />
                    <TextField
                    name="firstname"
                    {...register('firstname', {
                        required: true,
                        minLength: 2,
                        maxLength: 30,
                    })}
                    InputProps={{
                        endAdornment: errors.firstname ? errorIcon : touchedFields.firstname && validIcon
                    }}
                    fullWidth
                    variant="filled"
                    label="First Name"
                    margin="dense"
                    autoComplete="firstname"
                    />
                    <TextField
                    name="lastname"
                    {...register('lastname', {
                        required: true,
                        minLength: 5,
                        maxLength: 30,
                    })}
                    InputProps={{
                        endAdornment: errors.lastname ? errorIcon : touchedFields.lastname && validIcon
                    }}
                    fullWidth
                    variant="filled"
                    label="Last Name"
                    margin="dense"
                    autoComplete="lastname"
                    />
                    <TextField
                    name="password"
                    {...register('password', {
                        required: true,
                        minLength: 5,
                    })}
                    InputProps={{
                        endAdornment: errors.password ? errorIcon : touchedFields.password && validIcon
                    }}
                    fullWidth
                    variant="filled"
                    label="Password"
                    type="password"
                    margin="dense"
                    autoComplete="current-password"
                    />
                    <TextField
                    name="confirmpassword"
                    {...register('confirmpassword', {
                        required: true,
                        minLength: 5,
                    })}
                    InputProps={{
                        endAdornment: errors.confirmpassword ? errorIcon : touchedFields.confirmpassword && validIcon
                    }}
                    fullWidth
                    variant="filled"
                    label="Confirm Password"
                    type="password"
                    margin="dense"
                    autoComplete="current-password-confirm"
                    />
                    <Button
                    disabled={!isValid || isSubmitting}
                    variant="contained"
                    fullWidth
                    color="primary"
                    type="submit"
                    endIcon={loading && <CircularProgress/>}>
                        Sign up
                    </Button>
                    </form>
                    {/* {error && <ErrorMessage variant="outlined" severity="error" message={error} />}
                    {state.errorMessage &&  <ErrorMessage variant="outlined" severity="error" message={state.errorMessage}/> } */}
                    </CardContent>
                </Card>
                <Card>
                    <Typography variant="body2">
                    Already have an account? 
                    </Typography>
                    <Link to="/login">
                    <Button color="primary">
                        Login
                    </Button>
                    </Link>
                </Card>
            </article>
        </section>
        </>
       
    )
}

export default SignUp