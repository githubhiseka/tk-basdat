import React, { useState, useEffect } from "react";
import axios from "axios";

export default function ProfilePengguna() {
	const [profileData, setProfileData] = useState(null);
	const [formOpen, setFormOpen] = useState(false);
	const [formData, setFormData] = useState({});
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchProfile = async () => {
			try {
				const id = sessionStorage.getItem("id"); // Ambil ID pengguna dari sessionStorage
				const response = await axios.get(`http://localhost:5000/yellow/profile/pengguna?id=${id}`);
				setProfileData(response.data);
				setFormData(response.data); // Inisialisasi form data dengan profil pengguna
			} catch (err) {
				setError(err.response?.data || "Error fetching profile data");
			} finally {
				setLoading(false);
			}
		};

		fetchProfile();
	}, []);

	const handleUpdate = async () => {
		try {
			const id = sessionStorage.getItem("id");
			await axios.put(`http://localhost:5000/yellow/profile/pengguna?id=${id}`, formData);
			alert("Profil berhasil diperbarui!");
			setFormOpen(false); // Tutup form setelah update berhasil
		} catch (err) {
			console.error(err);
			alert("Terjadi kesalahan saat memperbarui profil.");
		}
	};

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	if (loading) {
		return <p>Loading...</p>;
	}

	if (error) {
		return <p className="text-red-500">{error}</p>;
	}

	return (
		<div className="flex h-screen w-screen items-center justify-center bg-gray-300">
			<div className="flex w-2/5 flex-row items-center justify-center gap-2 rounded-lg bg-white py-8 shadow-lg">
				{/* Profil Pengguna */}
				<div className="flex flex-col space-y-3">
					<p><strong>Nama:</strong> {profileData.nama}</p>
					<p><strong>Level:</strong> {profileData.level}</p>
					<p><strong>Jenis Kelamin:</strong> {profileData.gender}</p>
					<p><strong>No HP:</strong> {profileData.nohp}</p>
					<p><strong>Tanggal Lahir:</strong> {profileData.tgllahir}</p>
					<p><strong>Alamat:</strong> {profileData.alamat}</p>
					<p><strong>Saldo MyPay:</strong> Rp{profileData.saldomypay}</p>

					<div className="flex w-full justify-center !mt-8">
						<button
							className="rounded-md bg-green-800 p-2 px-3 font-bold text-white"
							onClick={() => setFormOpen(true)}
						>
							Update
						</button>
					</div>
				</div>
			</div>

			{/* Form Update */}
			{formOpen && (
				<div className="fixed z-20 flex w-[40rem] flex-col items-center space-y-4 rounded-xl bg-white px-8 py-6">
					<h2 className="text-xl font-bold">Update Profil</h2>
					<input
						type="text"
						name="nama"
						placeholder="Nama"
						value={formData.nama || ""}
						onChange={handleChange}
						className="w-full rounded-md border p-2"
					/>
					<div className="flex w-full items-center gap-4">
						<label>
							<input
								type="radio"
								name="gender"
								value="L"
								checked={formData.gender === "L"}
								onChange={handleChange}
							/>{" "}
							L
						</label>
						<label>
							<input
								type="radio"
								name="gender"
								value="P"
								checked={formData.gender === "P"}
								onChange={handleChange}
							/>{" "}
							P
						</label>
					</div>
					<input
						type="text"
						name="nohp"
						placeholder="No HP"
						value={formData.nohp || ""}
						onChange={handleChange}
						className="w-full rounded-md border p-2"
					/>
					<input
						type="date"
						name="tgllahir"
						placeholder="Tanggal Lahir"
						value={formData.tgllahir || ""}
						onChange={handleChange}
						className="w-full rounded-md border p-2"
					/>
					<input
						type="text"
						name="alamat"
						placeholder="Alamat"
						value={formData.alamat || ""}
						onChange={handleChange}
						className="w-full rounded-md border p-2"
					/>

					<div className="flex w-full justify-between">
						<button
							className="rounded-md bg-gray-400 p-2 px-4 text-white"
							onClick={() => setFormOpen(false)}
						>
							Batal
						</button>
						<button
							className="rounded-md bg-blue-600 p-2 px-4 text-white"
							onClick={handleUpdate}
						>
							Submit
						</button>
					</div>
				</div>
			)}

			{/* Overlay */}
			{formOpen && <div className="fixed top-0 left-0 z-10 h-full w-full bg-black opacity-50" />}
		</div>
	);
}