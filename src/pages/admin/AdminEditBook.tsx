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

  /* ================= FETCH ================= */
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

  /* ================= UPDATE ================= */
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

  const handleChange = (e: any) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  if (isLoading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center py-10">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow p-8 space-y-6">
        
        {/* HEADER */}
        <div className="flex items-center gap-2 text-gray-600">
          <button onClick={() => navigate(-1)}>←</button>
          <h1 className="text-lg font-semibold">Edit Book</h1>
        </div>

        {/* TITLE */}
        <div>
          <label className="text-sm text-gray-500">Title</label>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            className="w-full mt-1 px-4 py-2 border rounded-lg bg-gray-50"
          />
        </div>

        {/* AUTHOR */}
        <div>
          <label className="text-sm text-gray-500">Author</label>
          <input
            value={form.author}
            disabled
            className="w-full mt-1 px-4 py-2 border rounded-lg bg-gray-100"
          />
        </div>

        {/* CATEGORY */}
        <div>
          <label className="text-sm text-gray-500">Category</label>
          <input
            value={form.category}
            disabled
            className="w-full mt-1 px-4 py-2 border rounded-lg bg-gray-100"
          />
        </div>

        {/* PAGES */}
        <div>
          <label className="text-sm text-gray-500">Number of Pages</label>
          <input
            value={form.pages}
            disabled
            className="w-full mt-1 px-4 py-2 border rounded-lg bg-gray-100"
          />
        </div>

        {/* DESCRIPTION */}
        <div>
          <label className="text-sm text-gray-500">Description</label>
          <textarea
            name="description"
            rows={4}
            value={form.description}
            onChange={handleChange}
            className="w-full mt-1 px-4 py-2 border rounded-lg bg-gray-50"
          />
        </div>

        {/* COVER IMAGE */}
        <div>
          <label className="text-sm text-gray-500">Cover Image</label>

          <div className="mt-2 border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center gap-4">
            
            {form.coverImage ? (
              <img
                src={form.coverImage}
                alt="cover"
                className="h-40 object-contain"
              />
            ) : (
              <p className="text-gray-400 text-sm">No Image</p>
            )}

            <div className="flex gap-3">
              <input
                type="text"
                placeholder="Paste image URL..."
                name="coverImage"
                value={form.coverImage}
                onChange={handleChange}
                className="px-3 py-2 border rounded-lg text-sm"
              />

              <button
                type="button"
                className="px-3 py-2 text-sm border rounded-lg"
              >
                Change Image
              </button>

              <button
                type="button"
                onClick={() =>
                  setForm({ ...form, coverImage: "" })
                }
                className="px-3 py-2 text-sm text-red-500 border rounded-lg"
              >
                Delete Image
              </button>
            </div>

            <p className="text-xs text-gray-400">
              PNG or JPG (max. 5mb)
            </p>
          </div>
        </div>

        {/* SAVE BUTTON */}
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