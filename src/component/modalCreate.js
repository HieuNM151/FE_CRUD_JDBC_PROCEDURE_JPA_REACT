import React, { useState, useEffect } from "react";
import { Modal, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';

const EmpCreateModal = ({ show, handleClose, handleAddEmployeeModal, handleReloadData }) => {
    const [name, setName] = useState("");
    const [date, setDate] = useState("");
    const [sdt, setSdt] = useState("");
    const [gioitinh, setGioiTinh] = useState("nam");
    const [diachi, setDiaChi] = useState("");
    const [validationName, setValidationName] = useState(false);
    const [validationDate, setValidationDate] = useState(false);
    const [validationPhone, setValidationPhone] = useState(false);
    const [validationDc, setValidationDc] = useState(false);
    const [diaChiList, setDiaChiList] = useState([]);

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

    const handleValidation = () => {
        if (name.trim() === "" || date.trim() === "" || sdt.trim() === "" || diachi.trim() === "") {
            toast.error('Vui lòng điền đầy đủ thông tin');
            return false;
        }
        return true;
    };

    const handleAddEmployee = () => {
        if (handleValidation()) {
            const formData = {
                name: name,
                namsinh: date,
                sdt: sdt,
                gioitinh: gioitinh === "nam" ? true : false,
                diachi: diachi
            };

            // Gọi API chỉ khi đủ điều kiện
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
                        handleAddEmployeeModal();
                        handleClose(); // Đóng modal sau khi thêm thành công
                    } else {
                        console.error("Thêm thất bại");
                        return response.json(); // Trả về response để xử lý thông báo lỗi từ API
                    }
                })
                .then(data => {
                    console.table(data);
                    if (data) {
                        // Xử lý thông báo lỗi từ API
                        toast.error(data.message || 'Có lỗi xảy ra khi thêm nhân viên');
                    }
                })
                .catch(error => {
                    console.error("Đã xảy ra lỗi khi thêm nhân viên:", error);
                    toast.error("Đã xảy ra lỗi khi thêm nhân viên");
                });
        }
    };

    return (
        <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Thêm mới nhân viên</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="container">
                    <div className="card">
                        <div className="card-body" style={{ "textAlign": "left" }}>
                            <div className="row">
                                <div className="col-lg-6 mb-3">
                                    <div className="from-group">
                                        <label className="fw-bold">Họ và Tên</label>
                                        <input value={name} required onMouseDown={() => setValidationName(true)} onChange={(e) => setName(e.target.value)} className="form-control"></input>
                                        {name.length === 0 && validationName && <span className="text-danger">Tên không được để trống</span>}
                                    </div>
                                </div>
                                <div className="col-lg-6 mb-3">
                                    <div className="from-group">
                                        <label className="fw-bold">Ngày tháng năm sinh</label>
                                        <input value={date} required onMouseDown={() => setValidationDate(true)} onChange={(e) => setDate(e.target.value)} className="form-control" type="date"></input>
                                        {date.length === 0 && validationDate && <span className="text-danger">Ngày tháng năm sinh không được để trống</span>}
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-lg-6 mb-3">
                                    <div className="from-group">
                                        <label className="fw-bold">SĐT</label>
                                        <input value={sdt} required onMouseDown={() => setValidationPhone(true)} onChange={(e) => setSdt(e.target.value)} className="form-control"></input>
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
                                        <select value={diachi} required onMouseDown={() => setValidationDc(true)} onChange={(e) => setDiaChi(e.target.value)} className="form-control">
                                            <option value="">Chọn địa chỉ</option>
                                            {diaChiList.map((diaChi, index) => (
                                                <option key={index} value={diaChi.id}>{`${diaChi.xa}, ${diaChi.huyen}, ${diaChi.tinh}`}</option>
                                            ))}
                                        </select>
                                        {diachi.length === 0 && validationDc && <span className="text-danger">Địa chỉ không được để trống</span>}
                                    </div>
                                </div>
                            </div>
                            {/* <div className="row">
                                <div className="col-lg-12 d-flex justify-content-end">
                                    <button className="btn btn-success" type="submit" onClick={handleAddEmployee}>Thêm nhân viên</button>
                                </div>
                            </div> */}

                        </div>
                    </div>
                </div>
                {/* <br />
                <br />
                <div className="container">
                    <div className="card">
                        <div className="card-body" style={{ "textAlign": "left" }}>
                            <div className="row">
                                <div className="col-lg-6 mb-3">
                                    <div className="from-group">
                                        <label className="fw-bold">Mức Lương</label>
                                        <select className="form-control">
                                            <option value="">Mức 1</option>
                                            <option value="">Mức 2</option>
                                            <option value="">Mức 3</option>
                                            <option value="">Mức 4</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="col-lg-6 mb-3">
                                    <div className="from-group">
                                        <label className="fw-bold">Ngày bắt đầu</label>
                                        <input className="form-control" type="date"></input>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-lg-12 d-flex justify-content-end">
                                        <button className="btn btn-success" type="submit">Thêm mức lương</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div> */}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Đóng
                </Button>
                <Button variant="success" onClick={handleAddEmployee}>
                    Thêm mới
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default EmpCreateModal;
