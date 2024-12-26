import React, { useState } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";

import { app } from "../firebase";
import { useSelector } from "react-redux";
import {useNavigate} from 'react-router-dom'
export default function Listings() {
  const [files, setFiles] = useState([]);
  const [imageUploadError, setImageUploadError] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const { currentUser } = useSelector((state) => state.user);

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    imageUrls: [],
    name: "",
    description: "",
    address: "",
    type: "rent",
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 50,
    discountPrice: 50,
    offer: false,
    parking: false,
    furnished: false,
  });
  //console.log(files);
  console.log(formData);

  const handleImageSubmit = (e) => {
    if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
      setUploading(true);
      setImageUploadError(false);
      const promises = [];

      for (let i = 0; i < files.length; i++) {
        promises.push(storageImage(files[i]));
      }
      Promise.all(promises)
        .then((urls) => {
          setFormData({
            ...formData,
            imageUrls: formData.imageUrls.concat(urls),
          });
          setImageUploadError(false);
          setUploading(false);
        })

        .catch((err) => {
          setImageUploadError(
            "Image upload failed (2 mb max per image upload)"
          );
        });
    } else {
      setImageUploadError("You can only upload 6 images per upload");
      setUploading(false);
    }
  };

  const storageImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% done`);
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };

  const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i !== index),
    });
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    setFiles((prevFiles) => [...prevFiles, ...droppedFiles]);
  };

  const handleChange = (e) => {
    if (e.target.id === "sale" || e.target.id === "rent") {
      setFormData({
        ...formData,
        type: e.target.id,
      });
    }

    if (
      e.target.id === "parking" ||
      e.target.id === "furnished" ||
      e.target.id === "offer"
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.checked,
      });
    }

    if (
      e.target.type === "number" ||
      e.target.type === "text" ||
      e.target.type === "textarea"
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.imageUrls.length < 1)
        return setError("You must upload at least 1 image");
      if (+formData.regularPrice < +formData.discountPrice)
        return setError("Discounted Price must be lower than Regular Price");

      setLoading(true);
      setError(false);

      const res = await fetch("/api/listing/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          userRef: currentUser._id,
        }),
      });

      const data = await res.json();

      setLoading(false);
      if (data.success === false) {
        setError(data.message);
      }
      navigate(`/listing/${data._id}`)
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto text-center md:text-left mt-5">
      <h2 className="text-xl font-bold tracking-wide">Create a new listing</h2>

      <form onSubmit={handleSubmit}>
        <p className="mt-7 text-sm sm:text-base ml-2 mb-2">Name</p>
        <input
          className="border w-44 sm:w-96 p-3 rounded-xl text-sm"
          type="text"
          placeholder="e.g. Modern 2BR condo with parking"
          id="name"
          maxLength="62"
          minLength="10"
          required
          onChange={handleChange}
          value={formData.name}
        />

        <p className="mt-7 text-sm sm:text-base ml-2 mb-2">Description</p>
        <textarea
          className="border w-44 sm:w-96 h-32 p-3 rounded-xl text-sm"
          type="textarea"
          onChange={handleChange}
          value={formData.description}
          placeholder="e.g., This modern condo is perfect for a small family or couple. It has 2 bedrooms, 1 bathroom, and parking. The living room is spacious and bright due to the large windows. The kitchen is fully equipped with modern appliances."
          id="description"
        />

        <p className="mt-7 text-sm sm:text-base ml-2 mb-2">Address</p>
        <input
          className="border w-44 sm:w-96 p-3 rounded-xl text-sm"
          type="text"
          onChange={handleChange}
          value={formData.address}
          placeholder="e.g. 123 Main St, Toronto, ON"
          id="address"
        />

        <div className="border mt-5 w-3/4 mx-auto md:mx-0 rounded-md p-4 flex flex-col md:flex-row items-start md:items-center space-y-3 md:space-y-0 md:space-x-3">
          <input
            type="checkbox"
            onChange={handleChange}
            checked={formData.type === "sale"}
            className="form-radio h-5 w-5 text-blue-500 mt-1 md:mt-0 mx-auto md:mx-0"
            id="sale"
          />
          <div className="mx-auto md:mx-0">
            <h4 className="text-sm font-medium text-gray-900 ">For sale</h4>
            <p className="text-sm text-gray-500">
              Select this if you want to sell this property
            </p>
          </div>
        </div>

        <div className="border mt-5 w-3/4 mx-auto md:mx-0 rounded-md p-4 flex flex-col md:flex-row items-start md:items-center space-y-3 md:space-y-0 md:space-x-3">
          <input
            type="checkbox"
            className="form-radio h-5 w-5 text-blue-500 mt-1 md:mt-0 mx-auto md:mx-0"
            id="rent"
            onChange={handleChange}
            checked={formData.type === "rent"}
          />
          <div className="mx-auto md:mx-0">
            <h4 className="text-sm font-medium text-gray-900">For rent</h4>
            <p className="text-sm text-gray-500">
              Select this if you want to rent this property
            </p>
          </div>
        </div>

        <div className="border mt-5 w-3/4 mx-auto md:mx-0 rounded-md p-4 flex flex-col md:flex-row items-start md:items-center space-y-3 md:space-y-0 md:space-x-3">
          <input
            type="checkbox"
            className="form-radio h-5 w-5 text-blue-500 mt-1 md:mt-0 mx-auto md:mx-0"
            id="parking"
            onChange={handleChange}
            checked={formData.parking}
          />
          <div className="mx-auto md:mx-0">
            <h4 className="text-sm font-medium text-gray-900">Parking Spot</h4>
            <p className="text-sm text-gray-500">
              Select this if you want to include a parking spot
            </p>
          </div>
        </div>

        <div className="border mt-5 w-3/4 mx-auto md:mx-0 rounded-md p-4 flex flex-col md:flex-row items-start md:items-center space-y-3 md:space-y-0 md:space-x-3">
          <input
            type="checkbox"
            className="form-radio h-5 w-5 text-blue-500 mt-1 md:mt-0 mx-auto md:mx-0"
            id="furnished"
            onChange={handleChange}
            checked={formData.furnished}
          />
          <div className="mx-auto md:mx-0">
            <h4 className="text-sm font-medium text-gray-900">Furnished</h4>
            <p className="text-sm text-gray-500">
              Select this if you want to include furniture
            </p>
          </div>
        </div>
        <div className="border mt-5 w-3/4 mx-auto md:mx-0 rounded-md p-4 flex flex-col md:flex-row items-start md:items-center space-y-3 md:space-y-0 md:space-x-3">
          <input
            type="checkbox"
            className="form-radio h-5 w-5 text-blue-500 mt-1 md:mt-0 mx-auto md:mx-0"
            id="offer"
            onChange={handleChange}
            checked={formData.offer}
          />
          <div className="mx-auto md:mx-0">
            <h4 className="text-sm font-medium text-gray-900">Offer</h4>
            <p className="text-sm text-gray-500">
              Select this if you want to include an offer
            </p>
          </div>
        </div>

        <div className="mb-5">
          <div className="flex flex-col md:flex-row gap-7 md:gap-12">
            <div className="mt-7">
              <h3 className="mb-2">Beds</h3>
              <input
                type="number"
                className="border w-[200px] rounded-md p-1"
                id="bedrooms"
                min="1"
                max="10"
                required
                onChange={handleChange}
                value={formData.bedrooms}
              />
            </div>

            <div className="md:mt-7">
              <h3 className="mb-2">Baths</h3>
              <input
                type="number"
                className="border w-[200px] rounded-md p-1"
                id="bathrooms"
                min="1"
                max="10"
                required
                onChange={handleChange}
                value={formData.bathrooms}
              />
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:gap-12">
            <div className="mt-7">
              <h3 className="mb-2">
                Regular Price <span className="text-xs">($ / Month)</span>
              </h3>
              <input
                type="number"
                className="border w-[200px] rounded-md p-1"
                id="regularPrice"
                required
                placeholder="2000"
                onChange={handleChange}
                value={formData.regularPrice}
                min="50"
                max="10000"
              />
            </div>
          </div>
        </div>
        <div
          className={`mb-5 border-2 ${
            isDragging ? "border-blue-500" : "border-dashed border-gray-300"
          } p-6 rounded-lg flex flex-col items-center justify-center bg-gray-50`}
          onDragEnter={handleDragEnter}
          onDragOver={(e) => e.preventDefault()}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {" "}
          <p className="text-gray-800 font-medium mb-4">
            Drag and drop your photos here
          </p>
          <label
            htmlFor="images"
            className="px-4 py-2 bg-gray-200 text-gray-700 font-medium rounded-lg cursor-pointer hover:bg-gray-300"
          >
            Browse files
          </label>
          <input
            id="images"
            onChange={(e) => setFiles(e.target.files)}
            type="file"
            multiple
            accept="images/*"
            className="hidden"
          />
          <button
            type="button"
            disabled={uploading}
            onClick={handleImageSubmit}
            className="mt-5 px-4 py-2 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600"
          >
            {uploading ? "Uploading..." : "Upload Images"}
          </button>
        </div>
        {imageUploadError && (
          <p className="text-red-600 text-sm mt-3 bg-red-100 border border-red-400 rounded-lg p-2 mb-5">
            {imageUploadError}
          </p>
        )}
        <div className="flex flex-wrap gap-4 mx-auto">
          {formData.imageUrls.length > 0 &&
            formData.imageUrls.map((url, index) => (
              <div key={url} className="relative">
                <button
                  onClick={() => handleRemoveImage(index)}
                  type="button"
                  className="absolute top-1 right-1 bg-gray-400 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs hover:bg-red-700"
                  title="Remove Image"
                >
                  &times;
                </button>
                <img
                  src={url}
                  alt="Listing Image"
                  className="w-20 h-20 object-contain rounded-lg"
                />
              </div>
            ))}
        </div>

        <button
          // disabled={loading || uploading}
          onClick={handleImageSubmit}
          className="mb-5 bg-[#2785e6] text-white py-2 px-3 w-1/2 rounded-full font-bold"
        >
          {loading ? "Creating..." : "Create Listing"}
        </button>
      </form>
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
}
