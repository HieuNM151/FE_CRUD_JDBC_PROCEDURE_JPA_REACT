import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';

const EmpCreate = () => {
    const [name, setName] = useState("");
    const [date, setDate] = useState("");
    const [sdt, setSdt] = useState("");
    const [gioitinh, setGioiTinh] = useState("nam");
    const [diachi, setDiaChi] = useState("");
    const [validationName, valchange] = useState(false);
    const [validationDate, valDchange] = useState(false);
    const [validationPhone, valPchange] = useState(false);
    const [validationDc, valDcchange] = useState(false);
    const [diaChiList, setDiaChiList] = useState([]); // State để lưu danh sách địa chỉ từ API
    const navigate = useNavigate();

    useEffect(() => {
        // Gọi API để lấy danh sách địa chỉ
        fetch("http://localhost:8081/api/v1/nhan-vien/get-dia-chi")
            .then(response => response.json())
            .then(data => {
                setDiaChiList(data); // Cập nhật danh sách địa chỉ từ API
            })
            .catch(error => {
                console.error("Đã xảy ra lỗi khi lấy danh sách địa chỉ:", error);
            });
    }, []);

    const handleGenderChange = (event) => {
        setGioiTinh(event.target.value);
    };

    const handleAddEmployee = () => {
        const formData = {
            name: name,
            namsinh: date,
            sdt: sdt,
            gioitinh: gioitinh === "nam" ? true : false,
            diachi: diachi
        };

        fetch("http://localhost:8081/api/v1/nhan-vien/create", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(formData)
        })
            .then(response => {
                if (response.ok) {
                    console.log("Thêm thành công");
                    toast.success('Thêm thành công');
                    navigate("/");
                } else {
                    console.error("Thêm thất bại");
                    toast.error('Thêm thất bại')
                }
            })
            .catch(error => {
                console.error("Đã xảy ra lỗi khi thêm nhân viên:", error);
            });
    };

    return (
        <div>
            <div className="row">
                <div className="">
                    <div className="container">
                        <div className="card">
                            <div className="card-title">
                                <h2>Employee Create</h2>
                            </div>
                            <div className="card-body"  style={{"textAlign": "left"}}>
                                <div className="row">
                                    <div className="col-lg-6 mb-3">
                                        <div className="from-group">
                                            <label className="fw-bold">Họ và Tên</label>
                                            <input value={name} required onMouseDown={e => valchange(true)} onChange={e => setName(e.target.value)} className="form-control"></input>
                                            {name.length === 0 && validationName && <span className="text-danger">Tên không được để trống</span>}
                                        </div>
                                    </div>
                                    <div className="col-lg-6 mb-3">
                                        <div className="from-group">
                                            <label className="fw-bold">Ngày tháng năm sinh</label>
                                            <input value={date} required onMouseDown={e => valDchange(true)} onChange={e => setDate(e.target.value)} className="form-control" type="date"></input>
                                            {date.length === 0 && validationDate && <span className="text-danger">Ngày tháng năm sinh không được để trống</span>}
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-lg-6 mb-3">
                                        <div className="from-group">
                                            <label className="fw-bold">SĐT</label>
                                            <input value={sdt} required onMouseDown={e => valPchange(true)} onChange={e => setSdt(e.target.value)} className="form-control"></input>
                                            {sdt.length === 0 && validationPhone && <span className="text-danger">SĐT không được để trống</span>}
                                        </div>
                                    </div>
                                    <div className="col-lg-6 mb-3">
                                        <div className="from-group">
                                            <label className="fw-bold">Giới tính</label>
                                            <div>
                                                <input type="radio" id="nam" name="gender" value="nam" checked={gioitinh === "nam"} className="form-check-input" onChange={handleGenderChange} />
                                                <label htmlFor="nam" required className="form-check-label">Nam</label>
                                            </div>
                                            <div>
                                                <input type="radio" id="nu" name="gender" value="nu" checked={gioitinh === "nu"} className="form-check-input" onChange={handleGenderChange} />
                                                <label htmlFor="nu" required className="form-check-label">Nữ</label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-lg-6 mb-3">
                                        <div className="from-group">
                                            <label className="fw-bold">Địa chỉ</label>
                                            <select value={diachi} required onMouseDown={e => valDcchange(true)} onChange={e => setDiaChi(e.target.value)} className="form-control">
                                                <option value="">Chọn địa chỉ</option>
                                                {diaChiList.map((diaChi, index) => (
                                                    <option key={index} value={diaChi.id}>{`${diaChi.xa}, ${diaChi.huyen}, ${diaChi.tinh}`}</option>
                                                ))}
                                            </select>
                                            {diachi.length === 0 && validationDc && <span className="text-danger">Địa chỉ không được để trống</span>}
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-lg-6">
                                        <div className="d-flex align-items-center">
                                            <button className="btn btn-success" type="submit" onClick={handleAddEmployee}>Thêm</button>
                                            <Link to="/" className="btn btn-warning">Quay lại</Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmpCreate;
