import { yupResolver } from "@hookform/resolvers/yup";
import React, { ChangeEvent, useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import * as yup from "yup";
import axiosClient from "../../../../api/axiosClient";
import { useAppDispatch } from "../../../../app/hooks";
import { addChildCategory } from "../../../../features/categories/categoriesThunk";
import ButtonsAction from "../../../common/ButtonsAction";
import VerticalImageInput from "../../../common/VerticalImageInput";
import VerticalLabelInput from "../../../common/VerticalLabelInput";

type FormValues = {
  name: string;
  file: File | FileList;
};

type ParentNameProps = {
  name: string;
  depth: number;
};

export interface ChildCategoryProps {
  openChildCategoryForm: boolean;
  handleChildCategoryForm: () => void;
}

const ChildCategoryFormSchema = yup
  .object({
    name: yup.string().required(),
    file: yup.mixed().required("This field is required"),
  })
  .required();

const ChildCategory: React.FC<ChildCategoryProps> = ({
  openChildCategoryForm,
  handleChildCategoryForm,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: yupResolver(ChildCategoryFormSchema),
  });
  const dispatch = useAppDispatch();

  const [imageChild, setImageChild] = useState<File>();
  const [arrayParentName, setArrayParentName] = useState<ParentNameProps[]>([]);
  const [parentName, setParentName] = useState("");

  useEffect(() => {
    let unmounted = false;
    (async function () {
      try {
        const response = await axiosClient.get<string, []>(
          `${import.meta.env.VITE_API_BASE_URL}/categories/name`
        );
        if (!unmounted) {
          setArrayParentName(response);
        }
      } catch (error) {
        if (!unmounted) {
          setArrayParentName([]);
          throw error;
        }
      }
    })();
    return () => {
      unmounted = true;
    };
  }, []);

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setParentName(event.target.value);
  };

  const onChangeImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      setImageChild(undefined);
      return;
    }
    setImageChild(e.target.files[0]);
  };

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    console.log(parentName);
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("parentName", parentName);
    formData.append("files", imageChild as Blob);
    try {
      dispatch(addChildCategory(formData));
      handleChildCategoryForm();
      toast.success("Succeed");
    } catch (error) {
      throw error;
    }
  };

  return (
    <div
      className={
        openChildCategoryForm
          ? "category-container-form category-container-form-opening"
          : "category-container-form hidden"
      }
    >
      <div className="relative my-6 mx-auto max-w-3xl w-3/4 md:w-1/2">
        <div className="relative flex flex-col w-full rounded-lg shadow-lg bg-white">
          <h3 className="text-lg md:text-xl lg:text-2xl font-bold px-3 py-3 md:px-4 md:py-4 lg:px-5 lg:py-5">
            Add child category
          </h3>
          <form className="category-form" onSubmit={handleSubmit(onSubmit)}>
            <div className="col-span-6 lg:col-span-3 animate-fade-in-down">
              <label
                htmlFor="parentName"
                className="block text-sm sm:text-base font-medium text-gray-700"
              >
                Parent name
              </label>
              <select
                className="mt-2 p-2 block w-full shadow-sm text-sm sm:text-base border border-gray-500 rounded-md animate-fade-in-down"
                onChange={handleChange}
              >
                <option value="" className="text-sm md:text-base">
                  Please choose parent name
                </option>
                {arrayParentName.map((parent, index) => (
                  <option key={index} value={parent.name}>
                    {parent.name}
                  </option>
                ))}
              </select>
            </div>

            <VerticalLabelInput
              cols={6}
              colsResponsive={3}
              label="Name"
              inputName="name"
              type="text"
              register={register}
              errors={errors}
            />

            <VerticalImageInput
              cols={6}
              image={imageChild}
              label="Choose image"
              widthImage="1/2"
              inputName="file"
              type="file"
              register={register}
              onChangeImage={onChangeImage}
            />

            <ButtonsAction
              cols={6}
              title="Add"
              handleAction={handleChildCategoryForm}
            />
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChildCategory;
