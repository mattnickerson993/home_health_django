import { AppBar, Avatar, Button, Grow, Hidden, IconButton, Link, Menu, MenuItem, Toolbar, Tooltip, Typography } from '@mui/material'
import React from 'react'
import MenuIcon from '@mui/icons-material/Menu';
import InfoIcon from '@mui/icons-material/Info';
import ArchiveIcon from '@mui/icons-material/Archive';
import { AuthContext } from '../context';
import { Navigate } from 'react-router-dom';

const Navbar = ({auth}) => {
   
    const [anchorEl, setAnchorEl] = React.useState(null)
    const { dispatch } = React.useContext(AuthContext)
    const [loggedIn, setLoggedIn] = React.useState(auth ? true : false)

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget)
    }
  
    const handleClose = () => {
        setAnchorEl(null)
    }
    function  handleDropMenuClick(path){
        return
    }
    function handlelogout(){
      dispatch({
        type: "LOGOUT"
      })
      setLoggedIn(false)
    }
    if(!loggedIn){
      return <Navigate to='login' />
    }
    
    return (
        <AppBar position="static" styles={{position: 'relative'}}>
            <Toolbar>
                <div >
                    <Tooltip title="Home">
                        <IconButton onClick={handleClick}>
                            <Avatar alt="Logo"/>
                        </IconButton>
                    </Tooltip>
                    
                    <Typography variant="h6" style={{marginLeft: '1em'}}>
                        Home Health
                    </Typography>
                    <Hidden only={['xs', 'sm']}>
                        <Typography variant="h6" style={{marginLeft: '1em'}}>
                            • Questions Answered | Patient Satisfied
                        </Typography>
                    </Hidden>
                    
                </div>
                <div>
                
                
                <Hidden only={["sm", "md", 'lg', 'xl']}>
                    <IconButton onClick={handleClick}>
                        <MenuIcon />
                    </IconButton>
                    
                    <Menu
                        id="menu"
                        anchorEl={anchorEl}
                        keepMounted
                        TransitionComponent={Grow}
                        open={Boolean(anchorEl)}
                        onClose={handleClose}
                        anchorOrigin={{ 
                            vertical: "top", 
                            horizontal: "right" 
                        }}
                        transformOrigin={{ 
                            vertical: "top", 
                            horizontal: "right" 
                        }}
                        
                        >
                        <MenuItem 
                        
                        onClick={() => handleDropMenuClick('/about/')}
                        >
                            About
                        </MenuItem>
                        <MenuItem 
                        
                        onClick={() => handleDropMenuClick('/archive/')}
                        >
                              Archive
                        </MenuItem>
                        <MenuItem 
                        onClick={handlelogout}
                        >
                            Logout
                        </MenuItem>
                    </Menu>
                </Hidden>
                <Hidden only={'xs'}>
                    <Tooltip title="About">
                        <IconButton onClick={() => console.log('complete me')}>
                            <InfoIcon/>
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="View Archives">
                        <IconButton style={{marginRight:'1em'}} onClick={() => console.log('complete me')}>
                            <ArchiveIcon/>
                        </IconButton>
                    </Tooltip>
                {auth ? (
                    <Button variant="contained" color="secondary" onClick={handlelogout}>
                        Logout
                    </Button>
                ): (
                    <Link to="/login/">
                        <Button variant="contained" color="secondary">
                            Login
                        </Button>
                    </Link>
                )}
                </Hidden>
                
                </div>
            </Toolbar>
        </AppBar>
    )
}

export default Navbar