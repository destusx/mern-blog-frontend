import React, { useEffect, useRef } from "react";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import SimpleMDE from "react-simplemde-editor";
import { selectIsAuth } from "../../redux/slices/auth";
import { useSelector } from "react-redux";
import {  useNavigate, Navigate, useParams } from "react-router-dom";
import axios from '../../axios'

import "easymde/dist/easymde.min.css";
import styles from "./AddPost.module.scss";

export const AddPost = () => {
	const {id} = useParams()
	const navigate = useNavigate()
	const isAuth = useSelector(selectIsAuth)
	const [isLoading, setIsLoading] = React.useState(false);
	const [text, setText] = React.useState("");
	const [title, setTitle] = React.useState("");
	const [imageUrl, setImageUrl] = React.useState(null);
	const [tags, setTags] = React.useState("");
	const inputRef = useRef(null)

	const onChange = React.useCallback((value) => {
		setText(value);
	}, []);

	const isEditing = Boolean(id)

	const handleChangeFile = async (e) => {
		try {
			const formDara = new FormData();
			const file = e.target.files[0]
			formDara.append('image', file)
			const {data} = await axios.post('/upload', formDara)
			setImageUrl(data.url)
		} catch (error) {
			console.log(error)
			alert('Принимаются форматы: JPEG, PNG, JPG до 1мб')

		}
	}

	useEffect(() => {
		if (id) {
			axios.get(`/posts/${id}`).then(({data}) => {
				setTitle(data.title)
				setText(data.text)
				setImageUrl(data.imageUrl)
				setTags(data.tags.join(', '))
			})
		}
	}, [])

	const onSubmit = async () => {
		try {
			setIsLoading(true)

			const fields = {
				title,
				tags,
				imageUrl: imageUrl ?? '/uploads/banner-default.png',
				text
			}

			const {data} = isEditing ? await axios.patch(`/posts/${id}`, fields) 
									: await axios.post('/posts', fields)

			const _id = isEditing ? id : data._id

			navigate(`/posts/${_id}`)
		} catch (error) {
			console.warn('Ошибка при создании статьи')
		}
	}

	const onClickRemoveFile = () => {
		setImageUrl('')
	}

	const options = React.useMemo(
	() => ({
		spellChecker: false,
		maxHeight: "400px",
		autofocus: true,
		placeholder: "Введите текст...",
		status: false,
		autosave: {
		enabled: true,
		delay: 1000,
		},
	}),
	[]
	);

	if (!window.localStorage.getItem('token') && !isAuth) {
		return <Navigate to='/'/>
	}

	return (
	<Paper style={{ padding: 30 }}>
		{!imageUrl && 
			<Button onClick={() => inputRef.current.click()} variant="outlined" size="large">
			Загрузить превью
			</Button>
		}
		<input ref={inputRef} type="file" onChange={handleChangeFile} hidden />
		{imageUrl && (
			<div className={styles.wrapper}>
				<Button variant='contained' color="error" onClick={onClickRemoveFile}>
					Удалить
				</Button>
				<img className={styles.img} src={`${process.env.REACT_APP_API_URL}${imageUrl}`}/>
			</div>
		)}
		<br />
		<br />
		<TextField
		value={title}
		onChange={e => setTitle(e.target.value)}
		classes={{ root: styles.title }}
		variant="standard"
		placeholder="Заголовок статьи..."
		fullWidth
		/>
		<TextField
		value={tags}
		onChange={e => setTags(e.target.value)}
		classes={{ root: styles.tags }}
		variant="standard"
		placeholder="Тэги"
		fullWidth
		/>
		<SimpleMDE
		className={styles.editor}
		value={text}
		onChange={onChange}
		options={options}
		/>
		<div className={styles.buttons}>
		<Button onClick={onSubmit} size="large" variant="contained">
			{isEditing ? 'Редактировать' : 'Опубликовать'}
		</Button>
		<Button size="large">Отмена</Button>
		</div>
	</Paper>
	);
};
