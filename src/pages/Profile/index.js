import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { fetchAuthMe, selectIsAuth } from '../../redux/slices/auth';
import axios from '../../axios';

import styles from './Profile.module.scss';

export const Profile = () => {
    const { id } = useParams();
    const isAuth = useSelector(selectIsAuth);
    const [avatar, setAvatar] = useState(null);
    const userData = useSelector(state => state.auth.data);
    const dispatch = useDispatch();

    useEffect(() => {
        if (id) {
            dispatch(fetchAuthMe(id));
        }
    }, []);

    if (!window.localStorage.getItem('token') && !isAuth) {
        return <Navigate to="/" />;
    }

    const handleChangeFile = async e => {
        e.preventDefault();
        try {
            const formDara = new FormData();
            const file = e.target.files[0];
            formDara.append('image', file);
            const { data } = await axios.post('/upload', formDara);
            const updateUser = await axios.patch(`/auth/edit/${userData._id}`, {
                avatarUrl: data.url,
            });
            setAvatar(`process.env.REACT_APP_API_URL${data.url}`);
        } catch (error) {
            console.log(error);
            alert('Принимаются форматы: JPEG, PNG, JPG до 1мб');
        }
    };

    return (
        <div className={styles.root}>
            <div>
                <h2>Добро пожаловать - {userData?.fullName}</h2>
                {avatar ? (
                    <img src={avatar} />
                ) : (
                    <img
                        src={
                            `process.env.REACT_APP_API_URL${userData?.avatarUrl}` ??
                            `process.env.REACT_APP_API_URL/uploads/default.png`
                        }
                        alt=""
                    />
                )}
            </div>

            <h3>Изменить аватар</h3>
            <input type="file" onChange={handleChangeFile} />
        </div>
    );
};
