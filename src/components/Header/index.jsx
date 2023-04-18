import React from "react";
import Button from "@mui/material/Button";
import { useDispatch, useSelector } from "react-redux";

import styles from "./Header.module.scss";
import Container from "@mui/material/Container";
import { Link } from "react-router-dom";
import { selectIsAuth, logout } from "../../redux/slices/auth";

export const Header = () => {
	const isAuth = useSelector(selectIsAuth)
	const data = useSelector(state => state.auth.data);
	const id = data?._id
	
	const dispatch = useDispatch()

	const onClickLogout = () => {
		if (window.confirm('Вы уверены что хотите выйти?')) {
			dispatch(logout())
			window.localStorage.removeItem('token')
		}
	}

  return (
    <div className={styles.root}>
      <Container maxWidth="lg">
        <div className={styles.inner}>
          <Link className={styles.logo} to="/">
		  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="none" viewBox="0 0 24 24" id="blogger"><path fill="#4361ee" d="M3 1C1.89543 1 1 1.89543 1 3V21C1 22.1046 1.89543 23 3 23H21C22.1046 23 23 22.1046 23 21V3C23 1.89543 22.1046 1 21 1H3Z"></path><path fill="#90CAEA" fill-rule="evenodd" d="M6.5 12C6.5 11.4477 6.94772 11 7.5 11H16.5C17.0523 11 17.5 11.4477 17.5 12V14C17.5 16.2091 15.7091 18 13.5 18H10.5C8.29086 18 6.5 16.2091 6.5 14V12ZM8.5 13V14C8.5 15.1046 9.39543 16 10.5 16H13.5C14.6046 16 15.5 15.1046 15.5 14V13H8.5Z" clip-rule="evenodd"></path><path fill="#90CAEA" fill-rule="evenodd" d="M6.5 12C6.5 12.5523 6.94772 13 7.5 13H12.5C14.1569 13 15.5 11.6569 15.5 10C15.5 7.79086 13.7091 6 11.5 6H10.5C8.29086 6 6.5 7.79086 6.5 10V12ZM8.5 11V10C8.5 8.89543 9.39543 8 10.5 8H11.5C12.6046 8 13.5 8.89543 13.5 10C13.5 10.5523 13.0523 11 12.5 11H8.5Z" clip-rule="evenodd"></path></svg>
            <div className={styles.name}>Blogger</div>
          </Link>
          <div className={styles.buttons}>
			{isAuth ? (<>
			<Link to={`/profile`}>
            	<Button	Button variant="contained">Профиль</Button>
            </Link>
			<Link to='/add-post'>
            	<Button	Button variant="contained">Написать статью</Button>
            </Link>
            	<Button onClick={onClickLogout} variant="contained" color="error">Выйти</Button>
			</>
			) : (
			<>
				<Link to='/login'>
					<Button	Button variant="outlined">Войти</Button>
				</Link>
				<Link to="/register">
					<Button variant="contained">Создать аккаунт</Button>
				</Link>
			</>
			)}
          </div>
        </div>
      </Container>
    </div>
  );
};
