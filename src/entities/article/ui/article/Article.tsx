import React, { useEffect, useState } from "react"
import { IArticle } from "../../types/types"
import Favorites from "./ui/favorites"
import { Tags } from "./ui/tagList"
import { useSetLikeMutation } from "shared/redux/api"
import { Box, CircularProgress, Theme, useMediaQuery } from "@mui/material"
import { useNavigate } from "react-router-dom"
import clsx from "clsx"
import { useDispatch, useSelector } from "react-redux"
import { store } from "shared/redux"
import { change } from "shared/redux/local"
import { format } from "date-fns"
import { useTheme } from "@emotion/react"
const avatar = require("../../../../shared/assets/avatar.png")

const Article: React.FC<IArticle> = (props: IArticle) => {
  const { changed } = useSelector((state: ReturnType<typeof store.getState>) => state.local)
  const [image, setImage] = useState<string | undefined>(props.author.image)
  const [favorited, setFavorited] = useState<boolean>(props.favorited)
  const [favoritesCount, setFavoritesCount] = useState<number>(props.favoritesCount)
  const [load, setLoad] = useState<boolean | string>(false)
  const [setLike, result] = useSetLikeMutation()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const isPointer = useMediaQuery("(pointer: fine)")
  const theme = useTheme() as Theme
  useEffect(() => {
    let timer: NodeJS.Timeout | undefined
    if (changed.includes(props.author.username)) {
      setLoad(true)
      setImage(avatar)
    } else {
      if (!load) {
        timer = setTimeout(() => {
          setImage(avatar)
          dispatch(change(props.author.username))
        }, 2000)
      }
    }
    return () => {
      if (timer) {
        clearTimeout(timer)
      }
    }
  }, [load])

  useEffect(() => {
    if (result.isSuccess) {
      setFavorited(result.data?.article.favorited)
      setFavoritesCount(result.data?.article.favoritesCount)
    }
  }, [result])

  const handleClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const { tagName } = e.target as HTMLElement
    if (tagName === "INPUT" || tagName === "A") {
      e.preventDefault()
      return
    } else {
      navigate(`/slug/${props.slug}`)
    }
  }

  return (
    <Box
      onClick={handleClick}
      className={clsx(
        "flex flex-col justify-between cursor-pointer xs:h-[120px] xs:p-[2vw] sm:p-[15px] sm:h-[160px] xs:w-[90vw] sm:w-[60vw] rounded-md mx-auto animate-display overflow-x-hidden",
        isPointer ? "hover:bg-[#636a8d1c]" : null
      )}
      sx={{
        backgroundColor: "primary.main",
        color: "secondary.main",
        boxShadow: `0px 0px 3px ${theme.palette.mode === "dark" ? "#494949" : "#d6caca"}`,
      }}
    >
      <Box>
        <Box className="flex w-[100%] justify-between items-center">
          <Box className="flex max-w-[60%] items-center">
            <h3 className=" text-[#1890FF] max-h-9 text-ellipsis overflow-hidden text-clamp whitespace-nowrap capitalize">
              {props.title.trim() || "Untitled"}
            </h3>
            <Favorites
              onToggleLike={setLike}
              count={favoritesCount}
              liked={favorited}
              slug={props.slug}
              className="inline-block min-w-3 text-clamp pb-[2px]"
            />
          </Box>
          <Box className="flex w-auto xs:gap-1 gap-2 justify-end max-w-[50%] min-w-[40%]">
            <Box
              sx={{ fontSize: "clamp(14px, 2vw, 16px)" }}
              className="flex flex-col text-right w-[80%] justify-center overflow-hidden"
            >
              <Box sx={{ fontSize: "clamp(12px, 2vw, 16px)" }} className="overflow-hidden text-ellipsis">
                {props.author.username}
              </Box>
              <Box sx={{ color: "text.primary", fontSize: "clamp(8px, 1vw, 12px)", whiteSpace: "nowrap" }}>
                {format(props.createdAt, "PP")}
              </Box>
            </Box>
            <div className="xs:min-w-[46px] xs:max-w-[46px] xs:min-h-[46px] xs:max-h-[46px] sm:max-w-[56px] sm:min-h-[56px] sm:min-w-[56px] sm:max-h-[56px] flex items-center justify-center">
              {!load && <CircularProgress aria-busy="true" color="info" />}
              <img
                src={image}
                onLoad={() => setLoad(true)}
                alt="avatar"
                style={{ display: load ? "block" : "none" }}
                className="xs:min-w-[46px] xs:max-w-[46px] xs:min-h-[46px] xs:max-h-[46px] sm:max-w-[56px] sm:min-h-[56px] sm:min-w-[56px] sm:max-h-[56px]  rounded-[50%] animate-display border-[2px] border-solid border-[#1890FF]"
              />
            </div>
          </Box>
        </Box>
        <Tags tagList={props.tagList} />
      </Box>
      <Box className="overflow-hidden" sx={{ color: "text.primary", fontWeight: 200 }}>
        <p className="h-[25px] overflow-hidden text-ellipsis text-[16px]">{props.description}</p>
      </Box>
    </Box>
  )
}
export default Article
