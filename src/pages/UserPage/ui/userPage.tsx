import { Box, Button, CircularProgress, Theme } from "@mui/material"
import React, { useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate, useParams } from "react-router-dom"
import { formatDistanceToNow } from "date-fns"
import {
  useEditProfileMutation,
  useFollowUserMutation,
  useGetArticlesQuery,
  useGetCurrentUserQuery,
  useGetProfileQuery,
  useUnfollowUserMutation,
} from "shared/redux/api"
import { Portal } from "shared/ui/Portal/portal"
import { store } from "shared/redux"
import clsx from "clsx"
import ArticleIcon from "@mui/icons-material/Article"
import { setUser } from "shared/redux/local"
import { useTheme } from "@emotion/react"
import { FormField } from "shared/ui/form-field/form-field"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { schema } from "../utils/schema"
import EditIcon from "@mui/icons-material/Edit"
import { FaUserEdit } from "react-icons/fa"
import { SwitchComponent } from "./switchComponent/switchComponent"
import { CSSTransition } from "react-transition-group"
import { IArticle } from "entities/article"
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium"

const avatar = require("../../../shared/assets/avatar.png")

export const UserPage: React.FC = (): JSX.Element => {
  const { username } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { data, refetch } = useGetProfileQuery(username)
  const { data: articles } = useGetArticlesQuery({ username: username })
  const { data: user } = useGetCurrentUserQuery(null)
  const [closeBio, setCloseBio] = useState<boolean>(true)
  const [edit] = useEditProfileMutation()
  const [follow] = useFollowUserMutation()
  const [unfollow] = useUnfollowUserMutation()
  const [showImg, setshowImg] = useState<boolean>(false)
  const [openBio, setOpenBio] = useState<boolean>(false)
  const [top, setTop] = useState<IArticle | null>(null)
  const bioRef = useRef<any>()
  const [image, setImage] = useState<string | undefined>()
  const token = localStorage.getItem("token")
  const { changed } = useSelector((state: ReturnType<typeof store.getState>) => state.local)
  const theme = useTheme() as Theme
  const {
    handleSubmit,
    register,
    reset,
    clearErrors,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) })
  const handleClick = () => setshowImg(false)
  const onSubmit = handleSubmit(async (data) => {
    const { bio } = data
    if (user) {
      const { username, email } = user.user
      const { error } = await edit({ user: { username, email, bio } })
      if (!error) {
        clearErrors()
        reset()
        refetch()
      }
    }
  })

  useEffect(() => {
    window.addEventListener("click", handleClick)
    return () => window.removeEventListener("click", handleClick)
  }, [])

  useEffect(() => {
    if (showImg) document.getElementById("root")?.classList.add("brightness")
    else document.getElementById("root")?.classList.remove("brightness")
  }, [showImg])

  useEffect(() => {
    if (data) {
      if (changed.includes(data.profile.username)) {
        setImage(avatar)
      } else {
        setImage(data.profile.image)
      }
    }
  }, [data])
  useEffect(() => {
    if (articles?.articles.length) {
      setTop([...articles.articles].sort((a, b) => b.favoritesCount - a.favoritesCount)[0])
    }
  }, [articles])

  return !data ? (
    <CircularProgress className="m-auto" />
  ) : (
    <React.Fragment>
      <Box
        className="sm:h-[480px] p-[20px] rounded-[1.375rem] w-[60vw] m-auto animate-display"
        sx={{
          bgcolor: "primary.main",
          position: "relative",
          boxShadow: `0px 0px 4px ${theme.palette.mode === "dark" ? "#494949" : "#d6caca"}`,
        }}
      >
        {data && (
          <React.Fragment>
            <img
              src={image}
              onClick={(e) => {
                e.stopPropagation()
                if (image !== avatar) setshowImg(true)
              }}
              onKeyDown={() => {
                return
              }}
              alt="avatar"
              className={clsx(
                "bg-white xs:w-[100px] xs:h-[100px] sm:w-[175px] sm:h-[175px] top-5 absolute left-[50%] transform translate-x-[-50%] translate-y-[-50%] rounded-[50%]  border-solid border-[2px] border-[#0288d1]",
                image !== avatar && "hover:opacity-70 cursor-pointer transition-opacity duration-200"
              )}
            />
            <Box
              sx={{
                color: "text.primary",
                textTransform: "capitalize",
                textAlign: "center",
                fontWeight: 700,
              }}
              className="xs:mt-[75px] sm:mt-[110px] text-clamp-xl"
            >
              {data.profile.username}
            </Box>
            <Box
              sx={{
                color: "text.primary",
                textTransform: "capitalize",
                textAlign: "center",
              }}
              className="text-clamp"
            >
              {data.profile.bio}
            </Box>
            {articles?.articles[0] && (
              <Box
                sx={{
                  color: "text.primary",
                  textAlign: "center",
                }}
                className="text-clamp-xs flex flex-col gap-3 items-center"
              >
                <Box>Last update {formatDistanceToNow(articles?.articles[0].updatedAt)} ago</Box>
                {articles.articles.length > 1 && (
                  <Button
                    endIcon={<WorkspacePremiumIcon />}
                    sx={{ textTransform: "capitalize", maxWidth: "150px" }}
                    color="info"
                    onClick={() => navigate(`/slug/${top?.slug}`)}
                  >
                    show top article
                  </Button>
                )}
              </Box>
            )}
            <Box className="mt-[10px] flex flex-col gap-4 items-center">
              {user?.user.username === data.profile.username && data.profile.bio && !openBio && (
                <Button
                  startIcon={<EditIcon sx={{ fontSize: "16px" }} />}
                  variant="text"
                  color="success"
                  onClick={() => {
                    setOpenBio(true)
                    setCloseBio(false)
                  }}
                >
                  Edit bio
                </Button>
              )}
              {token && user?.user.username !== data.profile.username && (
                <Box className="flex flex-col items-center gap-3" sx={{ fontSize: "12px", color: "text.primary" }}>
                  <SwitchComponent
                    follow={follow}
                    unfollow={unfollow}
                    following={data.profile.following}
                    username={data.profile.username}
                  />
                </Box>
              )}
              {user?.user.username === data.profile.username && (
                <React.Fragment>
                  <CSSTransition
                    nodeRef={bioRef}
                    in={!closeBio}
                    timeout={300}
                    classNames="alert"
                    onExited={() => setOpenBio(false)}
                    unmountOnExit
                  >
                    <form onSubmit={onSubmit} ref={bioRef} className="flex flex-col items-center gap-5">
                      <Box className="flex flex-col items-center gap-3">
                        <FormField
                          name="bio"
                          id="bio"
                          placeholder="Bio"
                          type="bio"
                          rows={1}
                          defaultValue={data.profile.bio}
                          register={register}
                          error={!!errors.bio}
                          errors={errors.bio}
                        />
                        <Box className="flex gap-2">
                          <Button type="submit" color="info" variant="text" onClick={() => setCloseBio(true)}>
                            Submit
                          </Button>
                          <Button
                            onClick={() => {
                              setCloseBio(true)
                              reset()
                              clearErrors()
                            }}
                            color="error"
                            variant="text"
                          >
                            Cancel
                          </Button>
                        </Box>
                      </Box>
                    </form>
                  </CSSTransition>

                  {!data.profile.bio && !openBio && (
                    <Button
                      color={openBio ? "error" : "info"}
                      variant="text"
                      onClick={() => {
                        if (openBio) {
                          clearErrors()
                          reset()
                        }
                        setOpenBio(true)
                        setCloseBio(false)
                      }}
                    >
                      Add Bio
                    </Button>
                  )}
                  <Button
                    color="info"
                    variant="outlined"
                    onClick={() => navigate("/edit-profile")}
                    sx={{ textTransform: "capitalize" }}
                    endIcon={<FaUserEdit />}
                  >
                    Edit Profile
                  </Button>
                </React.Fragment>
              )}
              {(articles?.articlesCount && (
                <Button
                  onClick={() => {
                    dispatch(setUser(data.profile.username))
                    navigate(`/articles/author/${username}`)
                  }}
                  endIcon={<ArticleIcon />}
                  sx={{ textTransform: "capitalize" }}
                  color="info"
                  variant="outlined"
                >
                  {articles.articlesCount} {articles.articlesCount > 1 ? "articles" : "article"}
                </Button>
              )) ||
                null}
            </Box>
          </React.Fragment>
        )}
      </Box>
      {data && (
        <Portal isOpen={showImg}>
          <div className="absolute w-[100vw] h-[100vh]">
            <img
              src={image}
              alt="avatar"
              className="absolute xs:w-[70vw] s:w-[50vw] max-w-[700px] max-h-[700px] animate-display left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] rounded"
            />
          </div>
        </Portal>
      )}
    </React.Fragment>
  )
}
