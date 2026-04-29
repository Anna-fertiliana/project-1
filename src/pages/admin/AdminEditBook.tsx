import { useParams, useNavigate } from "react-router-dom";
import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { axiosInstance } from "../../api/axios";

export default function AdminEditBook() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [form, setForm] = useState({
    title: "",
    author: "",
    category: "",
    pages: "",
    description: "",
    coverImage: "",
  });

  const { data, isLoading } = useQuery({
    queryKey: ["admin-book-detail", id],
    queryFn: async () => {
      const res = await axiosInstance.get(`/api/books/${id}`);
      return res.data?.data;
    },
    enabled: !!id,
  });

  useEffect(() => {
    if (data) {
      setForm({
        title: data.title || "",
        author: data?.author?.name || "",
        category: data?.category?.name || "",
        pages: String(data.totalCopies || ""),
        description: data.description || "",
        coverImage: data.coverImage || "",
      });
    }
  }, [data]);

  const updateMutation = useMutation({
    mutationFn: async () => {
      return axiosInstance.put(`/api/books/${id}`, {
        title: form.title,
        description: form.description,
        coverImage: form.coverImage,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin-books"],
      });
      navigate("/admin/books");
    },
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  if (isLoading) {
    return (
      <p className="text-center py-12 text-sm text-gray-500">
        Loading...
      </p>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-6 sm:py-10">
      <div className="w-full max-w-2xl mx-auto bg-white rounded-2xl shadow-sm p-5 sm:p-8 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-gray-100"
          >
            ←
          </button>

          <h1 className="text-lg sm:text-xl font-semibold">
            Edit Book
          </h1>
        </div>

        <Field
          label="Title"
          name="title"
          value={form.title}
          onChange={handleChange}
        />

        <Field
          label="Author"
          value={form.author}
          disabled
        />

        <Field
          label="Category"
          value={form.category}
          disabled
        />

        <Field
          label="Number of Pages"
          value={form.pages}
          disabled
        />

        {/* Description */}
        <div>
          <label className="text-sm text-gray-500">
            Description
          </label>
          <textarea
            name="description"
            rows={4}
            value={form.description}
            onChange={handleChange}
            className="w-full mt-1 px-4 py-3 border rounded-xl bg-gray-50"
          />
        </div>

        {/* Cover */}
        <div>
          <label className="text-sm text-gray-500">
            Cover Image
          </label>

          <div className="mt-2 border-2 border-dashed rounded-2xl p-5 flex flex-col items-center gap-4">
            {form.coverImage ? (
              <img
                src={form.coverImage}
                alt="cover"
                className="h-40 object-contain rounded-lg"
              />
            ) : (
              <p className="text-sm text-gray-400">
                No Image
              </p>
            )}

            <input
              type="text"
              name="coverImage"
              value={form.coverImage}
              onChange={handleChange}
              placeholder="Paste image URL..."
              className="w-full px-4 py-3 border rounded-xl text-sm"
            />

            <div className="w-full flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                className="flex-1 px-4 py-2 border rounded-xl text-sm hover:bg-gray-50"
              >
                Change Image
              </button>

              <button
                type="button"
                onClick={() =>
                  setForm({
                    ...form,
                    coverImage: "",
                  })
                }
                className="flex-1 px-4 py-2 border border-red-300 text-red-500 rounded-xl text-sm hover:bg-red-50"
              >
                Delete Image
              </button>
            </div>

            <p className="text-xs text-gray-400">
              PNG or JPG (max. 5mb)
            </p>
          </div>
        </div>

        {/* Save */}
        <button
          onClick={() => updateMutation.mutate()}
          className="w-full bg-blue-600 text-white py-3 rounded-full hover:bg-blue-700"
        >
          {updateMutation.isPending ? "Saving..." : "Save"}
        </button>
      </div>
    </div>
  );
}

function Field({
  label,
  disabled,
  ...props
}: any) {
  return (
    <div>
      <label className="text-sm text-gray-500">
        {label}
      </label>
      <input
        {...props}
        disabled={disabled}
        className={`w-full mt-1 px-4 py-3 border rounded-xl ${
          disabled
            ? "bg-gray-100 text-gray-500"
            : "bg-gray-50"
        }`}
      />
    </div>
  );
}