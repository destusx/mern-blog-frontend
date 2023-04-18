import React, { useEffect, useState } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";

import { Post } from "../components/Post";
import { TagsBlock } from "../components/TagsBlock";
import { CommentsBlock } from "../components/CommentsBlock";
import { useDispatch, useSelector } from "react-redux";
import { fetchPopularPosts, fetchPosts, fetchTags } from "../redux/slices/posts";

export const Home = () => {
	const { posts, tags } = useSelector(state => state.posts)
  	const userData = useSelector(state => state.auth.data)
	const dispatch = useDispatch()
	const [activeButton, setActiveButton] = useState('new')

	const isPostsLoading = posts.postsStatusLoading === 'loading'


	useEffect(() => {
		dispatch(fetchPosts())
		dispatch(fetchTags())
	}, [])


  return (
    <>
	<div style={{marginBottom: 15}}>      
		<Button onClick={() => {
			dispatch(fetchPosts())
			setActiveButton('new')
		}} 
			variant={activeButton === 'new' ? "contained" : "outlined"}>
				Новые
		</Button>
		<Button style={{marginLeft: 10}} onClick={() => {
			dispatch(fetchPopularPosts())
			setActiveButton('popular')
		}} 
			variant={activeButton === 'popular' ? "contained" : "outlined"}>
				Популярные
		</Button>
	  </div>

      <Grid container spacing={4}>
        <Grid xs={8} item>
          {(isPostsLoading ? [...Array(5)] : posts.items).map((obj, i) => 
		  isPostsLoading ? (
		  <Post key={i} isLoading={true}/>
		  ) : (
		  <Post
              id={obj._id}
              title={obj.title}
              imageUrl={obj.imageUrl ? `${process.env.REACT_APP_API_URL}${obj.imageUrl}` : ''}
              user={obj.user}
              createdAt={obj.createdAt}
              viewsCount={obj.viewsCount}
              commentsCount={3}
              tags={obj.tags}
              isEditable={userData && userData._id === obj.user?._id}
            />))}
        </Grid>
        <Grid xs={4} item>
          <TagsBlock
            items={tags.items}
            isLoading={false}
          />
          <CommentsBlock
            items={[
              {
                user: {
                  fullName: "Вася Пупкин",
                  avatarUrl: "https://mui.com/static/images/avatar/1.jpg",
                },
                text: "Это тестовый комментарий",
              },
              {
                user: {
                  fullName: "Иван Иванов",
                  avatarUrl: "https://mui.com/static/images/avatar/2.jpg",
                },
                text: "When displaying three lines or more, the avatar is not aligned at the top. You should set the prop to align the avatar at the top",
              },
            ]}
            isLoading={false}
          />
        </Grid>
      </Grid>
    </>
  );
};
