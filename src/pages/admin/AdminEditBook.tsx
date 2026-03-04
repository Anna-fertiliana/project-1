import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { axiosInstance } from "../../api/axios";

export default function AdminEditBook() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    author: "",
    category: "",
    pages: "",
    description: "",
    image: "",
  });

  /* ================= FETCH BOOK DETAIL ================= */
  const { data, isLoading } = useQuery({
    queryKey: ["admin-book-detail", id],
    queryFn: async () => {
      const res = await axiosInstance.get(`/api/admin/books/${id}`);
      return res.data;
    },
  });

  useEffect(() => {
    if (data?.data) {
      setForm({
        title: data.data.title,
        author: data.data.author,
        category: data.data.category,
        pages: data.data.pages,
        description: data.data.description,
        image: data.data.image,
      });
    }
  }, [data]);

  /* ================= UPDATE BOOK ================= */
  const updateMutation = useMutation({
    mutationFn: async () => {
      await axiosInstance.put(`/api/admin/books/${id}`, form);
    },
    onSuccess: () => {
      navigate("/admin/books");
    },
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* ===== Back Button ===== */}
      <button
        onClick={() => navigate(-1)}
        className="text-sm text-gray-600 hover:underline"
      >
        ← Back
      </button>

      <h1 className="text-xl font-semibold">Edit Book</h1>

      {/* ===== Form ===== */}
      <div className="space-y-4">
        {/* Title */}
        <div>
          <label className="text-sm">Title</label>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-2 mt-1"
          />
        </div>

        {/* Author */}
        <div>
          <label className="text-sm">Author</label>
          <input
            name="author"
            value={form.author}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-2 mt-1"
          />
        </div>

        {/* Category */}
        <div>
          <label className="text-sm">Category</label>
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-2 mt-1"
          >
            <option value="">Select category</option>
            <option value="Finance & Economics">Finance & Economics</option>
            <option value="Business">Business</option>
            <option value="Technology">Technology</option>
          </select>
        </div>

        {/* Pages */}
        <div>
          <label className="text-sm">Number of Pages</label>
          <input
            type="number"
            name="pages"
            value={form.pages}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-2 mt-1"
          />
        </div>

        {/* Description */}
        <div>
          <label className="text-sm">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={4}
            className="w-full border rounded-lg px-4 py-2 mt-1"
          />
        </div>

        {/* Cover Preview */}
        <div>
          <label className="text-sm">Cover Image</label>

          <div className="border rounded-xl p-4 mt-2 text-center space-y-3">
            {form.image && (
              <img
                src={form.image}
                alt="cover"
                className="mx-auto h-40 object-cover rounded-md"
              />
            )}

            <div className="flex justify-center gap-4 text-sm">
              <button className="text-blue-600 hover:underline">
                Change image
              </button>
              <button
                onClick={() => setForm({ ...form, image: "" })}
                className="text-red-500 hover:underline"
              >
                Delete image
              </button>
            </div>

            <p className="text-xs text-gray-400">
              PNG or JPG (max. 5mb)
            </p>
          </div>
        </div>

        {/* Save Button */}
        <button
          onClick={() => updateMutation.mutate()}
          className="w-full bg-blue-600 text-white py-3 rounded-full hover:bg-blue-700"
        >
          Save
        </button>
      </div>
    </div>
  );
}