import React from 'react'
import { Link } from 'react-router-dom';
import InstagramIcon from "@mui/icons-material/Instagram";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import "../styles/Footer.css";
function Footer() {
    return (
        <div className="footer">
            <div className='socialMedia'>
                <a href="https://www.instagram.com/mfgarden.ro/" target="_blank" rel="noopener noreferrer">
                    <InstagramIcon />
                </a>
                <a href="https://www.facebook.com/profile.php?id=100090621936959" target="_blank" rel="noopener noreferrer">
                    <FacebookIcon />
                </a>

                <TwitterIcon />
                <LinkedInIcon />
            </div>
            <p>&copy; 2023 </p>
        </div>
    )
};

export default Footer