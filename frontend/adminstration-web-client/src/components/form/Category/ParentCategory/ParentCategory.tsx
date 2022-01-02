import React, { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useAppDispatch } from "../../../../app/hooks";
import { addParentCategory } from "../../../../features/categories/categoriesThunk";
import VerticalLabelInput from "../../../common/VerticalLabelInput";
import VerticalImageInput from "../../../common/VerticalImageInput";
import ButtonsAction from "../../../common/ButtonsAction";

type FormValues = {
  name: string;
  files: File | FileList;
};

export interface ParentCategoryProps {
  openParentCategoryForm: boolean;
  handleParentCategoryForm: () => void;
}

const ParentCategoryFormSchema = yup
  .object({
    name: yup.string().required(),
    files: yup.mixed().required("This field is required"),
  })
  .required();

const ParentCategory: React.FC<ParentCategoryProps> = ({
  openParentCategoryForm,
  handleParentCategoryForm,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: yupResolver(ParentCategoryFormSchema),
  });
  const dispatch = useAppDispatch();

  const [image, setImage] = useState<File>();

  const onChangeImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      setImage(undefined);
      return;
    }
    setImage(e.target.files[0]);
  };

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("files", image as Blob);
    try {
      dispatch(addParentCategory(formData));
      handleParentCategoryForm();
      toast.success("Succeed");
    } catch (error) {
      throw error;
    }
  };

  return (
    <div
      className={
        openParentCategoryForm
          ? "category-container-form category-container-form-opening"
          : "category-container-form hidden"
      }
    >
      <div className="relative my-6 mx-auto max-w-3xl w-3/4 md:w-1/2">
        <div className="relative flex flex-col w-full rounded-lg shadow-lg bg-white">
          <h3 className="text-lg md:text-xl lg:text-2xl font-bold px-3 py-3 md:px-4 md:py-4 lg:px-5 lg:py-5">
            Add new category
          </h3>
          <form className="category-form" onSubmit={handleSubmit(onSubmit)}>
            <VerticalLabelInput
              cols={6}
              label="Name"
              inputName="name"
              type="text"
              register={register}
              errors={errors}
            />

            <VerticalImageInput
              cols={6}
              image={image}
              label="Choose image"
              widthImage="1/2"
              inputName="files"
              type="file"
              register={register}
              onChangeImage={onChangeImage}
            />

            <ButtonsAction
              cols={6}
              title="Add"
              handleAction={handleParentCategoryForm}
            />
          </form>
        </div>
      </div>
    </div>
  );
};

export default ParentCategory;
