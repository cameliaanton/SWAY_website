import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/Profile.css';
import { Link, useNavigate } from 'react-router-dom';

const Profile = ({ user }) => {
    const [userData, setUserData] = useState({
        email: '',
        firstName: '',
        lastName: '',
        address: '',
        telephone: '',
        gender: '',
        subscribe: false,
        dateBirth: '',
    });

    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            axios.get(`http://localhost:8080/getUser?email=${user.email}`)
                .then(response => {
                    const data = response.data;
                    setUserData({
                        email: data.email,
                        firstName: data.name.split(" ")[0],
                        lastName: data.name.split(" ")[1],
                        address: data.address,
                        telephone: data.telephone,
                        gender: data.gender,
                        subscribe: data.subscribe,
                        dateBirth: data.dateBirth,
                    });
                })
                .catch(error => console.error(error));
        }
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = () => {
        axios.put(`http://localhost:8080/updateUser`, userData, {
            params: { id: user.id }
        })
            .then(response => {
                alert('Data updated successfully!');
            })
            .catch(error => {
                console.error(error);
                alert('Error updating data.');
            });
    };

    const handleDeleteAccount = () => {
        if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
            axios.delete(`http://localhost:8080/deleteUser`, {
                params: { id: user.id }
            })
                .then(response => {
                    alert('Account deleted successfully.');
                    navigate('/'); // Redirect to login or home page
                })
                .catch(error => {
                    console.error(error);
                    alert('Error deleting account.');
                });
        }
    };

    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <div className="profile-container">
            <h1>BINE AI VENIT! <span className="user-name">{userData.firstName}</span></h1>
            <div className="profile-content">
                <div className="profile-details">
                    <h2>DATELE MELE</h2>
                    <form className="profile-form">
                        <div className="form-group gender">
                            <label>
                                <input
                                    type="radio"
                                    name="gender"
                                    value="male"
                                    checked={userData.gender === 'male'}
                                    onChange={handleChange}
                                />
                                BĂRBAT
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    name="gender"
                                    value="female"
                                    checked={userData.gender === 'female'}
                                    onChange={handleChange}
                                />
                                FEMEIE
                            </label>
                        </div>
                        <div className="form-group">
                            <label>Prenume*</label>
                            <input
                                type="text"
                                name="firstName"
                                value={userData.firstName}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <label>Numele de familie*</label>
                            <input
                                type="text"
                                name="lastName"
                                value={userData.lastName}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <label>Adresă de e-mail*</label>
                            <input
                                type="email"
                                name="email"
                                value={userData.email}
                                onChange={handleChange}
                                readOnly
                            />
                        </div>
                        <div className="form-group">
                            <label>Telefon</label>
                            <div className="phone-input">
                                <input
                                    type="text"
                                    name="telephone"
                                    value={userData.telephone}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Data nașterii*</label>
                            <input
                                type="date"
                                name="dateBirth"
                                value={userData.dateBirth}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group subscribe">
                            <label>
                                <input
                                    type="checkbox"
                                    name="subscribe"
                                    checked={userData.subscribe}
                                    onChange={(e) => setUserData(prevState => ({
                                        ...prevState,
                                        subscribe: e.target.checked
                                    }))}
                                />
                                ANUNȚĂ-MĂ DESPRE NOUTĂȚI ȘI OFERTE SPECIALE.
                            </label>
                        </div>
                        <button type="button" className="save-button" onClick={handleSubmit}>
                            SALVEAZĂ MODIFICĂRILE
                        </button>
                    </form>
                </div>
                <div className="profile-sidebar">
                    <h2>COMENZILE MELE</h2>
                    <ul>
                        <li><Link to="/orders">COMENZILE MELE</Link></li>
                        <li><a href="#">RETURURI</a></li>
                    </ul>
                    <h2>DATELE MELE</h2>
                    <ul>
                        <li><a href="#">DATELE DUMNEAVOASTRĂ / ADRESA DE LIVRARE</a></li>
                        <li><Link to="/login/changePassword">MODIFICA PAROLA</Link></li>
                        <li><button onClick={handleDeleteAccount} className="delete-account-button">ȘTERGERE CONT</button></li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Profile;
