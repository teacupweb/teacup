import { useState, useRef, useEffect } from "react";
import JoditEditor from "jodit-react";
import {
  getUserBlogById,
  postBlog,
  updateUserBlog,
  type blogType,
} from "@/backendProvider";
import { useAuth } from "@/AuthProvider";
import { useParams } from "react-router";
import Swal from "sweetalert2";

const NewBlog = ({ isEditMode }: { isEditMode?: boolean }) => {
  const { id } = useParams();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: "",
    image: "",
    data: "",
    created_by: user && typeof user === "object" && user?.email,
  } as blogType);

  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const editor = useRef(null);

  useEffect(() => {
    if (isEditMode) {
      getUserBlogById(Number(id)).then((data) => {
        if (data) {
          setFormData(data);
        }
      });
    }
  }, [isEditMode, location]);

  const config = {
    readonly: false,
    placeholder: "Start typing your content...",
    height: 400,
    toolbarAdaptive: false,
    toolbarSticky: true,
    buttons: [
      "bold",
      "italic",
      "underline",
      "strikethrough",
      "|",
      "ul",
      "ol",
      "|",
      "outdent",
      "indent",
      "|",
      "font",
      "fontsize",
      "brush",
      "|",
      "image",
      "link",
      "|",
      "align",
      "|",
      "undo",
      "redo",
      "|",
      "preview",
      "fullsize",
    ],
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      Swal.fire("Error", "Please select a valid image file", "error");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      Swal.fire("Error", "Image size should be less than 5MB", "error");
      return;
    }

    setSelectedFile(file);

    // Clear the URL input when a file is selected
    setFormData((prev) => ({ ...prev, image: "" }));
  };

  const uploadImageToServer = async (file: File): Promise<string> => {
    const uploadFormData = new FormData();
    uploadFormData.append("upload_preset", "teacupnet");
    uploadFormData.append("cloud_name", "dmbbkvlky");
    uploadFormData.append("file", file);
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/dmbbkvlky/image/upload`,
      {
        method: "POST",
        body: uploadFormData,
      },
    );
    console.log(response);
    if (!response.ok) {
      throw new Error("Upload failed");
    }

    const result = await response.json();
    const imageUrl = result.url;

    if (!imageUrl) {
      throw new Error("No image URL returned from server");
    }

    return imageUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.image && !selectedFile) {
      Swal.fire(
        "Error",
        "Please provide an image URL or upload an image",
        "error",
      );
      return;
    }

    setIsUploading(true);

    try {
      let finalImageUrl = formData.image;

      // If a file is selected, upload it first
      if (selectedFile) {
        finalImageUrl = await uploadImageToServer(selectedFile);
      }

      const submitData = {
        ...formData,
        image: finalImageUrl,
      };

      const result = await Swal.fire({
        title: isEditMode ? "Update Article?" : "Publish Article?",
        text: isEditMode
          ? "Do you want to update this article?"
          : "Do you want to publish this article?",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: isEditMode ? "Yes, update it!" : "Yes, publish it!",
      });

      if (result.isConfirmed) {
        if (isEditMode) {
          await updateUserBlog(Number(id), submitData);
          Swal.fire("Updated!", "Your article has been updated.", "success");
        } else {
          await postBlog(submitData);
          Swal.fire(
            "Published!",
            "Your article has been published.",
            "success",
          );
          setFormData({
            title: "",
            image: "",
            data: "",
            created_by: user && typeof user === "object" && user?.email,
          } as blogType);
          setSelectedFile(null);
          if (fileInputRef.current) {
            fileInputRef.current.value = "";
          }
        }
      }
    } catch (error) {
      console.error("Error:", error);
      Swal.fire(
        "Error",
        "Failed to process your request. Please try again.",
        "error",
      );
    } finally {
      setIsUploading(false);
    }
  };

  const clearFileSelection = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="max-w-4xl mx-auto p-8 rounded-2xl shadow-xl border bg-white border-rose-100">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-rose-600 mb-2 ubuntu-font">
            {isEditMode ? "Edit Article" : "Create New Article"}
          </h1>
          <p className="text-gray-600">Share your knowledge with the world</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Title */}
          <div className="group">
            <label className="block text-sm font-semibold text-gray-700 mb-3 transition-all duration-200 group-focus-within:text-rose-600">
              Article Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, title: e.target.value }))
              }
              className="w-full px-4 py-3 border bg-white border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all duration-200 hover:border-rose-300 text-lg font-medium"
              placeholder="Enter a compelling title..."
              required
            />
          </div>

          {/* Image Section */}
          <div className="space-y-4">
            <label className="block text-sm font-semibold text-gray-700 mb-3 transition-all duration-200 group-focus-within:text-rose-600">
              Article Image *
            </label>

            {/* File Upload Option */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Image
              </label>
              <div className="flex items-center gap-4">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className="px-4 py-2 border border-rose-500 text-rose-600 rounded-lg cursor-pointer hover:bg-rose-50 transition-all duration-200"
                >
                  Choose File
                </label>
                {selectedFile && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-green-600">
                      ✓ {selectedFile.name}
                    </span>
                    <button
                      type="button"
                      onClick={clearFileSelection}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Supported formats: JPEG, PNG, GIF. Max size: 5MB
              </p>
            </div>

            {/* Manual URL Input */}
            <div className="group">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Or enter Image URL
              </label>
              <input
                type="text"
                value={formData.image}
                onChange={(e) => {
                  setFormData((prev) => ({ ...prev, image: e.target.value }));
                  // Clear file selection when URL is entered
                  if (selectedFile) {
                    setSelectedFile(null);
                    if (fileInputRef.current) {
                      fileInputRef.current.value = "";
                    }
                  }
                }}
                className="w-full px-4 py-3 border bg-white border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all duration-200 hover:border-rose-300"
                placeholder="https://example.com/image.jpg"
              />
            </div>
          </div>

          {/* Jodit Editor */}
          <div className="group">
            <label className="block text-sm font-semibold text-gray-700 mb-3 transition-all duration-200 group-focus-within:text-rose-600">
              Content *
            </label>
            <div className="border border-gray-300 rounded-xl overflow-hidden shadow-sm transition-all duration-200 hover:shadow-md group-focus-within:border-rose-500 group-focus-within:ring-2 group-focus-within:ring-rose-500 group-focus-within:ring-opacity-20">
              <JoditEditor
                ref={editor}
                value={formData.data}
                config={config}
                onBlur={(newContent) =>
                  setFormData((prev) => ({ ...prev, data: newContent }))
                }
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex gap-4 pt-6 border-t border-gray-200">
            <button
              type="submit"
              disabled={isUploading}
              className={`px-8 py-3 bg-rose-600 text-white hover:bg-rose-700 font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center gap-2 ${
                isUploading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
              }`}
            >
              {isUploading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  {isEditMode ? "Updating..." : "Publishing..."}
                </>
              ) : (
                <>
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                  {isEditMode ? "Update Article" : "Publish Article"}
                </>
              )}
            </button>

            <button
              type="button"
              className="px-6 py-3 bg-transparent cursor-pointer text-gray-500 font-medium rounded-xl hover:bg-gray-100 transition-all duration-200 ml-auto"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewBlog;
