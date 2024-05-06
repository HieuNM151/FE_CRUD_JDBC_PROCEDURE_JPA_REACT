// import React, { useState, useEffect } from "react";
// import { Link, useParams, useNavigate } from "react-router-dom";
// import { toast } from 'react-toastify';

// const EmpEdit = () => {
//     const { idnv } = useParams();
//     const [id, setid] = useState("");
//     const [name, setName] = useState("");
//     const [namsinh, setNamsinh] = useState(""); 
//     const [sdt, setSdt] = useState("");
//     const [gioitinh, setGioiTinh] = useState(true); 
//     const [diachi, setDiaChi] = useState("");
//     const [validationName, valchange] = useState(false);
//     const [validationDate, valDchange] = useState(false);
//     const [validationPhone, valPchange] = useState(false);
//     const [validationDc, valDcchange] = useState(false);
//     const [diaChiList, setDiaChiList] = useState([]); 
//     const navigate = useNavigate();
    
//     useEffect(() => {
//         fetch("http://localhost:8081/api/v1/nhan-vien/get-dia-chi")
//             .then(response => response.json())
//             .then(data => {
//                 setDiaChiList(data);
//             })
//             .catch(error => {
//                 console.error("Đã xảy ra lỗi khi lấy danh sách địa chỉ:", error);
//             });
//         fetch(`http://localhost:8081/api/v1/nhan-vien/details?id=${idnv}`)
//             .then((res) => res.json())
//             .then((resp) => {
//                 setid(resp.id);
//                 setName(resp.name);
//                 setNamsinh(resp.namsinh.split(" ")[0]);
//                 setSdt(resp.sdt);
//                 setDiaChi(resp.diachi.id);
//                 setGioiTinh(resp.gioitinh);
//             })
//             .catch((err) => {
//                 console.log(err.message);
//             });
//     }, [idnv]);

//     const handleGenderChange = (event) => {
//         setGioiTinh(event.target.value === "nam" ? true : false);
//     };

//     const handleAddEmployee = () => {
//         if (name.trim() === "") {
//             valchange(true);
//             toast.error('Phải điền đủ dữ liệu');
//             return; 
//         }
//         if (namsinh.trim() === "") {
//             valDchange(true); 
//             toast.error('Phải điền đủ dữ liệu');
//             return; 
//         }
//         if (sdt.trim() === "") {
//             valPchange(true);
//             toast.error('Phải điền đủ dữ liệu');
//             return;
//         }
//         if (diachi.trim() === "") {
//             valDcchange(true);
//             toast.error('Phải điền đủ dữ liệu');
//             return;
//         }
    
//         const formData = {
//             id: id,
//             name: name,
//             namsinh: namsinh,
//             sdt: sdt,
//             gioitinh: gioitinh,
//             diachi: diachi,
//         };

//         fetch(`http://localhost:8081/api/v1/nhan-vien/update?nhanVienId=${idnv}`, {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json"
//         },
//         body: JSON.stringify(formData)
//     })
//         .then(response => {
//             if (response.ok) {
//                 console.log("Cập nhật thành công");
//                 toast.success("Cập nhật thành công");
//                 navigate("/")
//             } else {
//                 console.error("Cập nhật thất bại");
//                 toast.error("Cập nhật thất bại");
//             }
//         })
//         .catch(error => {
//             console.error("Đã xảy ra lỗi khi cập nhật nhân viên:", error);
//         });
// };

//     return (
//         <div>
//             <div className="row">
//                 <div className="">
//                     <div className="container">
//                         <div className="card">
//                             <div className="card-title">
//                                 <h2>Employee Edit</h2>
//                             </div>
//                             <div className="card-body" style={{ "textAlign": "left" }}>
//                                 <div className="row">
//                                     <div className="col-lg-6 mb-3">
//                                         <div className="from-group">
//                                             <label className="fw-bold">ID</label>
//                                             <input value={id} required onChange={e => setid(e.target.value)}  readOnly className="form-control"></input>
//                                         </div>
//                                     </div>
//                                     <div className="col-lg-6 mb-3">
//                                         <div className="from-group">
//                                             <label className="fw-bold">Họ và Tên</label>
//                                             <input value={name} required onMouseDown={e => valchange(true)} onChange={e => setName(e.target.value)} className="form-control"></input>
//                                             {name.length === 0 && validationName && <span className="text-danger">Tên không được để trống</span>}
//                                         </div>
//                                     </div>
//                                 </div>
//                                 <div className="row">
//                                     <div className="col-lg-6 mb-3">
//                                         <div className="from-group">
//                                             <label className="fw-bold">Ngày tháng năm sinh</label>
//                                             <input value={namsinh} required onMouseDown={e => valDchange(true)} onChange={e => setNamsinh(e.target.value)} className="form-control" type="date"></input>
//                                             {namsinh.length === 0 && validationDate && <span className="text-danger">Ngày tháng năm sinh không được để trống</span>}
//                                         </div>
//                                     </div>
//                                     <div className="col-lg-6 mb-3">
//                                         <div className="from-group">
//                                             <label className="fw-bold">SĐT</label>
//                                             <input value={sdt} required onMouseDown={e => valPchange(true)} onChange={e => setSdt(e.target.value)} className="form-control"></input>
//                                             {sdt.length === 0 && validationPhone && <span className="text-danger">SĐT không được để trống</span>}
//                                         </div>
//                                     </div>
//                                 </div>
//                                 <div className="row">
//                                     <div className="col-lg-6 mb-3">
//                                         <div className="from-group">
//                                             <label className="fw-bold">Giới tính</label>
//                                             <div>
//                                                 <input type="radio" id="nam" name="gender" value="nam" checked={gioitinh === true} className="form-check-input" onChange={handleGenderChange} />
//                                                 <label htmlFor="nam" required className="form-check-label">Nam</label>
//                                             </div>
//                                             <div>
//                                                 <input type="radio" id="nu" name="gender" value="nu" checked={gioitinh === false} className="form-check-input" onChange={handleGenderChange} />
//                                                 <label htmlFor="nu" required className="form-check-label">Nữ</label>
//                                             </div>
//                                         </div>
//                                     </div>
//                                     <div className="col-lg-6 mb-3">
//                                         <div className="from-group">
//                                             <label className="fw-bold">Địa chỉ</label>
//                                             <select value={diachi} required onMouseDown={e => valDcchange(true)} onChange={e => setDiaChi(e.target.value)} className="form-control">
//                                                 {diaChiList.map((diaChi, index) => (
//                                                     <option key={index} value={diaChi.id}>{`${diaChi.xa}, ${diaChi.huyen}, ${diaChi.tinh}`}</option>
//                                                 ))}
//                                             </select>
//                                             {diachi.length === 0 && validationDc && <span className="text-danger">Địa chỉ không được để trống</span>}
//                                         </div>
//                                     </div>
//                                 </div>
//                                 <div className="row">
//                                     <div className="col-lg-6">
//                                         <div className="d-flex align-items-center">
//                                             <button className="btn btn-info" type="submit" onClick={handleAddEmployee}>Cập nhật</button>
//                                             <Link to="/" className="btn btn-warning">Quay lại</Link>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }

// export default EmpEdit;
