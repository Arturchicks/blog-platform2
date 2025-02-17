import { createBrowserRouter } from "react-router-dom"
import App from "./App"
import { LoginForm } from "features/sign-in-form"
import { Articles } from "pages/Articles"
import { AuthForm } from "features/sign-up-form"
import CreateArticle from "pages/createArticle/createArticle"
import { ArticlePage } from "pages/ArticlePage/article-page"
import { EditUser } from "pages/EditUser/edit-user-page"
import EditArticle from "pages/editArticle/edit-article-page"
import { UserPage } from "pages/UserPage/ui/userPage"

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Articles />,
      },
      {
        path: "articles",
        element: <Articles />,
        children: [
          {
            path: "tag/:tag",
            element: <Articles />,
          },
          {
            path: "author/:author",
            element: <Articles />,
          },
        ],
      },
      {
        path: "sign-in",
        element: <LoginForm />,
      },
      {
        path: "sign-up",
        element: <AuthForm />,
      },
      {
        path: "create-article",
        element: <CreateArticle />,
      },
      {
        path: "slug/:slug",
        element: <ArticlePage />,
      },
      {
        path: "edit-profile",
        element: <EditUser />,
      },
      {
        path: "edit-article/:slug",
        element: <EditArticle />,
      },
      {
        path: "profile/:username",
        element: <UserPage />,
      },
    ],
  },
])
