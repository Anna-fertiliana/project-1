import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { axiosInstance } from "../../api/axios";

export default function AdminCreateBook() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [form, setForm] = useState({
    title: "",
    authorId: "",
    categoryId: "",
    totalCopies: "",
    description: "",
    coverImage: "",
  });

  const [errors, setErrors] = useState<any>({});

  /* == FETCH == */
  const { data: authors } = useQuery({
    queryKey: ["authors"],
    queryFn: async () => {
      const res = await axiosInstance.get("/api/authors");
      return res.data?.data?.authors || [];
    },
  });

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await axiosInstance.get("/api/categories");
      return res.data?.data?.categories || [];
    },
  });

  /* == CREATE == */
  const createMutation = useMutation({
    mutationFn: async () => {
      const payload: any = {
        title: form.title.trim(),
        description: form.description.trim(),
        coverImage: form.coverImage || null,
      };

      // hanya kirim kalau valid
      if (form.authorId) payload.authorId = Number(form.authorId);
      if (form.categoryId) payload.categoryId = Number(form.categoryId);
      if (form.totalCopies)
        payload.availableCopies = Number(form.totalCopies);

      console.log("PAYLOAD:", payload);

      return axiosInstance.post("/api/admin/books", payload);
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-books"] });
      navigate("/admin/books?success=1");
    },

    onError: (err: any) => {
      console.log("ERROR:", err?.response?.data);

      setErrors({
        global:
          err?.response?.data?.message || "Invalid input data",
      });
    },
  });

  /* ================= HANDLER ================= */
  const handleChange = (e: any) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

    setErrors({
      ...errors,
      [e.target.name]: "",
      global: "",
    });
  };

  const handleSubmit = () => {
    let newErrors: any = {};

    if (!form.title.trim())
      newErrors.title = "Title is required";

    if (!form.authorId)
      newErrors.authorId = "Author is required";

    if (!form.categoryId)
      newErrors.categoryId = "Category is required";

    if (!form.totalCopies || Number(form.totalCopies) <= 0)
      newErrors.totalCopies = "Must be greater than 0";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    createMutation.mutate();
  };

  return (
    <div className="min-h-screen bg-[#F6F7FB] flex justify-center py-10">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-sm p-8 space-y-6">

        {/* HEADER */}
        <div className="flex items-center gap-2 text-gray-500">
          <button onClick={() => navigate(-1)}>←</button>
          <h1 className="text-lg font-semibold text-gray-800">
            Add Book
          </h1>
        </div>

        {/* GLOBAL ERROR */}
        {errors.global && (
          <div className="bg-red-50 text-red-500 text-sm px-4 py-2 rounded-lg">
            {errors.global}
          </div>
        )}

        {/* TITLE */}
        <div className="space-y-1">
          <label className="text-sm text-gray-500">Title</label>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            className={`w-full px-4 py-2.5 border rounded-xl bg-gray-50 ${
              errors.title ? "border-red-400" : ""
            }`}
          />
          {errors.title && (
            <p className="text-xs text-red-500">{errors.title}</p>
          )}
        </div>

        {/* AUTHOR */}
        <div className="space-y-1">
          <label className="text-sm text-gray-500">Author</label>
          <select
            name="authorId"
            value={form.authorId}
            onChange={handleChange}
            className={`w-full px-4 py-2.5 border rounded-xl bg-gray-50 ${
              errors.authorId ? "border-red-400" : ""
            }`}
          >
            <option value="">Select Author</option>
            {authors?.map((a: any) => (
              <option key={a.id} value={a.id}>
                {a.name}
              </option>
            ))}
          </select>
          {errors.authorId && (
            <p className="text-xs text-red-500">
              {errors.authorId}
            </p>
          )}
        </div>

        {/* CATEGORY */}
        <div className="space-y-1">
          <label className="text-sm text-gray-500">Category</label>
          <select
            name="categoryId"
            value={form.categoryId}
            onChange={handleChange}
            className={`w-full px-4 py-2.5 border rounded-xl bg-gray-50 ${
              errors.categoryId ? "border-red-400" : ""
            }`}
          >
            <option value="">Select Category</option>
            {categories?.map((c: any) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          {errors.categoryId && (
            <p className="text-xs text-red-500">
              {errors.categoryId}
            </p>
          )}
        </div>

        {/* STOCK */}
        <div className="space-y-1">
          <label className="text-sm text-gray-500">
            Stock
          </label>
          <input
            name="totalCopies"
            type="number"
            value={form.totalCopies}
            onChange={handleChange}
            className={`w-full px-4 py-2.5 border rounded-xl bg-gray-50 ${
              errors.totalCopies ? "border-red-400" : ""
            }`}
          />
          {errors.totalCopies && (
            <p className="text-xs text-red-500">
              {errors.totalCopies}
            </p>
          )}
        </div>

        {/* DESCRIPTION */}
        <div className="space-y-1">
          <label className="text-sm text-gray-500">
            Description
          </label>
          <textarea
            name="description"
            rows={4}
            value={form.description}
            onChange={handleChange}
            className="w-full px-4 py-2.5 border rounded-xl bg-gray-50"
          />
        </div>

        {/* IMAGE */}
        <div>
          <label className="text-sm text-gray-500">
            Cover Image
          </label>

          <div className="mt-2 border-2 border-dashed border-gray-200 rounded-2xl p-6 flex flex-col items-center gap-3">
            {form.coverImage ? (
              <img
                src={form.coverImage}
                className="h-32 object-contain"
              />
            ) : (
              <p className="text-gray-400 text-sm text-center">
                Paste image URL
              </p>
            )}

            <input
              type="text"
              placeholder="https://..."
              name="coverImage"
              value={form.coverImage}
              onChange={handleChange}
              className="px-3 py-2 border rounded-lg text-sm w-60"
            />
          </div>
        </div>

        {/* BUTTON */}
        <button
          onClick={handleSubmit}
          disabled={createMutation.isPending}
          className="w-full bg-[#2563EB] text-white py-3 rounded-full font-medium hover:bg-blue-700 disabled:opacity-50"
        >
          {createMutation.isPending ? "Saving..." : "Save"}
        </button>
      </div>
    </div>
  );
}