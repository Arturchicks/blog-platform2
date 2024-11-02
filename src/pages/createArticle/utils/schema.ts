import * as yup from "yup"
export const schema = yup
  .object({
    title: yup.string().max(100, "No more").required("Enter title"),
    description: yup.string().max(150, "No more").required("Enter description"),
    text: yup.string().required("Enter text"),
    tags: yup.array().of(yup.string().required("Add tag")),
  })
  .required()
